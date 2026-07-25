<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductStock;
use Illuminate\Http\Request;

class ProductStockController extends Controller
{
    /** GET /product-stocks — filterable stock ledger (Product Stocks page) */
    public function index(Request $request)
    {
        $query = ProductStock::with(['product.brand', 'product.category', 'branch', 'variant.values']);

        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('product', fn ($q) => $q->where('title', 'like', "%{$search}%")
                ->orWhere('barcode', 'like', "%{$search}%"));
        }
        if ($request->boolean('active_only')) {
            $query->where('quantity', '>', 0);
        }
        if ($request->filled('category_id')) {
            $query->whereHas('product', fn ($q) => $q->where('category_id', $request->category_id));
        }
        if ($request->filled('brand_id')) {
            $query->whereHas('product', fn ($q) => $q->where('brand_id', $request->brand_id));
        }

        $stocks = $query->orderByDesc('id')->paginate($request->integer('per_page', 100));

        $totals = (clone $query)->get();

        return response()->json([
            'data' => $stocks,
            'summary' => [
                'total_purchase_value' => $totals->sum(fn ($s) => $s->quantity * ($s->product->purchase_price ?? 0)),
                'total_sale_value' => $totals->sum(fn ($s) => $s->quantity * ($s->product->selling_price ?? 0)),
            ],
        ]);
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

        return response()->json($stock->load(['product', 'branch']));
    }
}
