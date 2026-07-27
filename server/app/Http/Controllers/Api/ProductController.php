<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductStock;
use App\Models\UnitType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
{
    // ১. কারেন্ট ব্রাঞ্চ আইডি নির্ধারণ (Request থেকে অথবা লগইন ইউজারের ব্রাঞ্চ থেকে)
    $branchId = $request->branch_id ?? auth()->user()?->branch_id;

    $query = Product::with(['branch', 'brand', 'category', 'unitType']);

    // ২. বর্তমান ব্রাঞ্চের স্টক যোগ করার জন্য (branch_stock)
    if ($branchId) {
        $query->withSum(['stocks as branch_stock' => function ($q) use ($branchId) {
            $q->where('branch_id', $branchId);
        }], 'quantity');
    } else {
        $query->withSum('stocks as branch_stock', 'quantity');
    }

    // ৩. সব ব্রাঞ্চের সর্বমোট স্টক যোগ করার জন্য (total_stock)
    $query->withSum('stocks as total_stock', 'quantity');

    // সার্চ ফিল্টার (Title / Barcode)
    if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('barcode', 'like', "%{$search}%");
        });
    }

    // ফিল্টারিং
    if ($request->filled('branch_id')) {
        $query->where('branch_id', $request->branch_id);
    }

    if ($request->filled('category_id')) {
        $query->where('category_id', $request->category_id);
    }

    if ($request->filled('brand_id')) {
        $query->where('brand_id', $request->brand_id);
    }

    $products = $query->orderByDesc('id')->paginate($request->integer('per_page', 25));

    return response()->json($products);
}

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'branch_id' => 'nullable|exists:branches,id',
            'brand_id' => 'nullable|exists:brands,id',
            'category_id' => 'required|exists:categories,id',
            'unit_type_id' => 'required|exists:unit_types,id',
            'purchase_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'discount_status' => 'in:Flat,Percent,No',
            'discount_value' => 'nullable|numeric|min:0',
            'vat_status' => 'in:Yes,No',
            'vat_percent' => 'nullable|numeric|min:0',
            'alert_quantity' => 'nullable|integer|min:0',
            'stock_qty' => 'nullable|integer|min:0',
            'barcode' => 'nullable|string|unique:products,barcode',
            'image' => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('products', 'public');
        }

        $data['barcode'] = $data['barcode'] ?: $this->generateBarcode();

        $product = DB::transaction(function () use ($data) {
            $product = Product::create(collect($data)->except(['image'])->toArray());

            // Synchronize initial stock with ProductStock ledger
            if (!empty($product->branch_id)) {
                ProductStock::updateOrCreate(
                    [
                        'branch_id' => $product->branch_id,
                        'product_id' => $product->id,
                        'product_variant_id' => null,
                    ],
                    [
                        'quantity' => $product->stock_qty ?? 0,
                    ]
                );
            }

            return $product;
        });

        return response()->json($product->load(['branch', 'brand', 'category', 'unitType']), 201);
    }

    public function show(Product $product)
    {
        return response()->json($product->load(['branch', 'brand', 'category', 'unitType', 'variants.values']));
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'branch_id' => 'nullable|exists:branches,id',
            'brand_id' => 'nullable|exists:brands,id',
            'category_id' => 'sometimes|required|exists:categories,id',
            'unit_type_id' => 'sometimes|required|exists:unit_types,id',
            'purchase_price' => 'sometimes|required|numeric|min:0',
            'selling_price' => 'sometimes|required|numeric|min:0',
            'description' => 'nullable|string',
            'discount_status' => 'in:Flat,Percent,No',
            'discount_value' => 'nullable|numeric|min:0',
            'vat_status' => 'in:Yes,No',
            'vat_percent' => 'nullable|numeric|min:0',
            'alert_quantity' => 'nullable|integer|min:0',
            'stock_qty' => 'nullable|integer|min:0',
            'barcode' => 'nullable|string|unique:products,barcode,'.$product->id,
            'image' => 'nullable|image|max:4096',
        ]);

        return DB::transaction(function () use ($request, $product, $data) {
            if ($request->hasFile('image')) {
                if ($product->image_path) {
                    Storage::disk('public')->delete($product->image_path);
                }
                $data['image_path'] = $request->file('image')->store('products', 'public');
            }

            $product->update(collect($data)->except(['image'])->toArray());

            // Synchronize updated stock quantity with ProductStock ledger
            if (!empty($product->branch_id) && isset($data['stock_qty'])) {
                ProductStock::updateOrCreate(
                    [
                        'branch_id' => $product->branch_id,
                        'product_id' => $product->id,
                        'product_variant_id' => null,
                    ],
                    [
                        'quantity' => $product->stock_qty,
                    ]
                );
            }

            return response()->json($product->fresh(['branch', 'brand', 'category', 'unitType']));
        });
    }

    public function destroy(Product $product)
    {
        if ($product->image_path) {
            Storage::disk('public')->delete($product->image_path);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }

    /** POST /products/generate-barcode */
    public function generateBarcodeEndpoint(Request $request)
    {
        return response()->json(['barcode' => $this->generateBarcode()]);
    }

    private function generateBarcode(): string
    {
        do {
            $code = (string) random_int(1000000000, 9999999999);
        } while (Product::where('barcode', $code)->exists());

        return $code;
    }

    /** POST /products/upload-csv */
    public function uploadCsv(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt',
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        $branchId = $request->input('branch_id');

        $path = $request->file('file')->getRealPath();
        $handle = fopen($path, 'r');
        $header = fgetcsv($handle);
        $header = array_map(fn ($h) => Str::snake(trim($h)), $header);

        $created = 0;
        $errors = [];
        $row = 1;

        while (($line = fgetcsv($handle)) !== false) {
            $row++;
            $record = array_combine($header, $line);

            if (empty($record['title'])) {
                $errors[] = "Row {$row}: missing title";
                continue;
            }

            $category = Category::firstOrCreate(['name' => $record['category'] ?? 'Uncategorized']);
            $unitType = UnitType::firstOrCreate(['name' => $record['unit_type'] ?? 'Pcs']);
            $brand = ! empty($record['brand']) ? Brand::firstOrCreate(['name' => $record['brand']]) : null;

            $productBranchId = $record['branch_id'] ?? $branchId;
            $stockQty = $record['stock_qty'] ?? 0;

            $product = Product::create([
                'title'          => $record['title'],
                'branch_id'      => $productBranchId,
                'category_id'    => $category->id,
                'unit_type_id'   => $unitType->id,
                'brand_id'       => $brand?->id,
                'purchase_price' => $record['purchase_price'] ?? 0,
                'selling_price'  => $record['selling_price'] ?? 0,
                'barcode'        => !empty($record['barcode']) ? $record['barcode'] : $this->generateBarcode(),
                'alert_quantity' => $record['alert_quantity'] ?? 0,
                'stock_qty'      => $stockQty,
            ]);

            // Sync stock record into ProductStock
            if (!empty($productBranchId)) {
                ProductStock::updateOrCreate(
                    [
                        'branch_id' => $productBranchId,
                        'product_id' => $product->id,
                        'product_variant_id' => null,
                    ],
                    [
                        'quantity' => $stockQty,
                    ]
                );
            }

            $created++;
        }

        fclose($handle);

        return response()->json(['created' => $created, 'errors' => $errors]);
    }
}
