<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductStockController extends Controller
{
    /** GET /product-stocks — filterable stock ledger (Product Stocks page) */
    public function index(Request $request)
    {
        $query = Product::with(['category', 'brand', 'stocks']);

        // Filter by Branch (Fix: Filter through relationship)
        if ($request->filled('branch_id')) {
            $query->whereHas('stocks', function ($q) use ($request) {
                $q->where('branch_id', $request->branch_id);
            });
        }

        // Active Stock (>0)
        if ($request->boolean('active_only')) {
            $query->where('stock_qty', '>', 0);
        }

        // Search Filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('barcode', 'like', "%{$search}%");
            });
        }

        // Category Filter
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Brand Filter
        if ($request->filled('brand_id')) {
            $query->where('brand_id', $request->brand_id);
        }

        $allProducts = (clone $query)->get();

        // Calculate Summary
        $totalPurchaseValue = $allProducts->sum(fn($p) => $p->stock_qty * $p->purchase_price);
        $totalSaleValue     = $allProducts->sum(fn($p) => $p->stock_qty * $p->selling_price);

        $perPage = $request->integer('per_page', 100);
        $paginated = $query->latest()->paginate($perPage);

        return response()->json(array_merge($paginated->toArray(), [
            'summary' => [
                'total_purchase_value' => round($totalPurchaseValue, 2),
                'total_sale_value'     => round($totalSaleValue, 2),
            ]
        ]));
    }

    /** POST /product-stocks/adjust — manual stock correction */
    public function adjust(Request $request)
    {
        $data = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'product_id' => 'required|exists:products,id',
            'product_variant_id' => 'nullable|exists:product_variants,id',
            'quantity' => 'required|integer', // can be negative delta
            'mode' => 'in:set,delta',
        ]);

        return DB::transaction(function () use ($data) {
            $stock = ProductStock::firstOrCreate([
                'branch_id' => $data['branch_id'],
                'product_id' => $data['product_id'],
                'product_variant_id' => $data['product_variant_id'] ?? null,
            ], ['quantity' => 0]);

            if (($data['mode'] ?? 'delta') === 'set') {
                $stock->quantity = max(0, $data['quantity']);
            } else {
                $stock->quantity = max(0, $stock->quantity + $data['quantity']);
            }
            $stock->save();

            // Sync main product stock_qty field across all branches (Fix)
            $product = Product::find($data['product_id']);
            if ($product) {
                $product->stock_qty = ProductStock::where('product_id', $product->id)->sum('quantity');
                $product->save();
            }

            return response()->json($stock->load(['product', 'branch']));
        });
    }

    /** POST /products/{product}/update-stock — quick stock adjustment API */
    public function updateStock(Request $request, $id)
    {
        $validated = $request->validate([
            'branch_id'          => 'required|exists:branches,id',
            'product_variant_id' => 'nullable|exists:product_variants,id',
            'quantity'           => 'required|integer|min:0',
            'action'             => 'required|in:set,add,subtract',
        ]);

        $product = Product::findOrFail($id);

        return DB::transaction(function () use ($validated, $product) {
            $branchId  = $validated['branch_id'];
            $variantId = $validated['product_variant_id'] ?? null;
            $qty       = $validated['quantity'];
            $action    = $validated['action'];

            // ১. নির্দিষ্ট শাখায় স্টক রেকর্ড খুঁজে বের করা বা নতুন তৈরি করা
            $stock = ProductStock::firstOrCreate(
                [
                    'branch_id'          => $branchId,
                    'product_id'         => $product->id,
                    'product_variant_id' => $variantId,
                ],
                ['quantity' => 0]
            );

            // ২. অ্যাকশন অনুযায়ী স্টক পরিবর্তন
            if ($action === 'set') {
                $stock->quantity = $qty;
            } elseif ($action === 'add') {
                $stock->quantity += $qty;
            } elseif ($action === 'subtract') {
                $stock->quantity = max(0, $stock->quantity - $qty);
            }

            $stock->save();

            // ৩. প্রোডাক্টের গ্লোবাল stock_qty সব ব্র্যাঞ্চের সমষ্টি দিয়ে আপডেট করা
            $totalStock = ProductStock::where('product_id', $product->id)->sum('quantity');
            $product->stock_qty = $totalStock;
            $product->save();

            return response()->json([
                'status'  => 'success',
                'message' => 'Stock updated successfully',
                'data'    => [
                    'product_id'      => $product->id,
                    'product_title'   => $product->title,
                    'branch_id'       => $branchId,
                    'branch_stock'    => $stock->quantity,
                    'total_stock_qty' => $product->stock_qty,
                ]
            ], 200);
        });
    }
}