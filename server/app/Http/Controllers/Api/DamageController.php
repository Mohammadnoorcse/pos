<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DamageRecord;
use App\Models\Product;
use App\Models\ProductStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DamageController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search', '');
        $limit = (int) $request->query('limit', 100);

        $records = DamageRecord::with(['product', 'branch', 'unitType', 'variation'])
            ->when($search, function ($query) use ($search) {
                $query->whereHas('product', function ($q) use ($search) {
                    $q->where('title', 'LIKE', "%{$search}%");
                })
                ->orWhereHas('branch', function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%");
                })
                ->orWhere('reason', 'LIKE', "%{$search}%");
            })
            ->latest()
            ->paginate($limit);

        $formattedData = $records->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id,
                'date' => $item->created_at ? $item->created_at->format('d-m-Y') : null,
                'branch_id' => $item->branch_id,
                'unit_id' => $item->unit_id,
                'variation_id' => $item->variation_id,
                'place' => $item->branch->name ?? $item->place ?? 'My Shop',
                'product' => $item->product->title ?? '—',
                'variation_name' => $item->variation->name ?? null,
                'unit_name' => $item->unitType->name ?? $item->unit,
                'lot' => $item->lot_number,
                'pp' => (float) $item->purchase_price,
                'sp' => (float) $item->sales_price,
                'discount' => $item->discount,
                'vat' => $item->vat,
                'barcode' => $item->barcode ?? $item->product->barcode ?? '—',
                'stock' => $item->quantity . ' ' . ($item->unitType->short ?? $item->unitType->name ?? $item->unit ?? 'pcs'),
                'reason' => $item->reason,
            ];
        });

        return response()->json([
            'data' => $formattedData,
            'pagination' => [
                'total' => $records->total(),
                'page' => $records->currentPage(),
                'limit' => $records->perPage(),
                'totalPages' => $records->lastPage(),
            ]
        ]);
    }

    /**
     * Store a newly created damage record AND decrement product stock.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'branch_id' => 'nullable|exists:branches,id',
            'unit_id' => 'nullable|exists:unit_types,id',
            'variation_id' => 'nullable|exists:variations,id',
            'place' => 'nullable|string',
            'lot_number' => 'nullable|integer',
            'purchase_price' => 'required|numeric',
            'sales_price' => 'required|numeric',
            'discount' => 'nullable|string',
            'vat' => 'nullable|string',
            'barcode' => 'nullable|string',
            'quantity' => 'required|numeric|min:0.01',
            'unit' => 'nullable|string',
            'reason' => 'required|string',
        ]);

        $damageRecord = DB::transaction(function () use ($validated) {
            // 1) Lock the relevant stock row so concurrent requests can't
            //    both pass the "enough stock" check at once.
            $stockQuery = ProductStock::where('product_id', $validated['product_id'])
                ->when(
                    !empty($validated['branch_id']),
                    fn ($q) => $q->where('branch_id', $validated['branch_id'])
                )
                ->when(
                    !empty($validated['variation_id']),
                    fn ($q) => $q->where('product_variant_id', $validated['variation_id'])
                )
                ->lockForUpdate();

            $stock = $stockQuery->first();

            if (!$stock || $stock->quantity < $validated['quantity']) {
                throw ValidationException::withMessages([
                    'quantity' => 'Not enough stock available to record this damage. Current stock: ' . ($stock->quantity ?? 0),
                ]);
            }

            // 2) Deduct the damaged quantity from stock.
            $stock->decrement('quantity', $validated['quantity']);

            // 3) Keep the product's aggregate stock_qty column (if you use one) in sync.
            Product::where('id', $validated['product_id'])
                ->decrement('stock_qty', $validated['quantity']);

            // 4) Finally create the damage record.
            return DamageRecord::create($validated);
        });

        return response()->json([
            'message' => 'Damage record created and stock updated successfully',
            'data' => $damageRecord
        ], 201);
    }

    /**
     * Fetch Products for selection table (Add Damage Product View).
     */
    public function getProducts(Request $request)
    {
        $search = $request->query('search', '');
        $limit = (int) $request->query('limit', 100);

        $products = Product::when($search, function ($query) use ($search) {
                $query->where('title', 'LIKE', "%{$search}%")
                      ->orWhere('barcode', 'LIKE', "%{$search}%");
            })
            ->select('id', 'title as name', 'barcode')
            ->orderBy('title', 'asc')
            ->paginate($limit);

        return response()->json([
            'data' => $products->items(),
            'pagination' => [
                'total' => $products->total(),
                'page' => $products->currentPage(),
                'limit' => $products->perPage(),
                'totalPages' => $products->lastPage(),
            ]
        ]);
    }
}