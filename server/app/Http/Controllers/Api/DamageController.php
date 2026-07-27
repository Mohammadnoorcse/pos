<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DamageRecord;
use App\Models\Product;
use Illuminate\Http\Request;

class DamageController extends Controller
{
public function index(Request $request)
    {
        $search = $request->query('search', '');
        $limit = (int) $request->query('limit', 100);

        // Fetch records with relationships
        $records = DamageRecord::with(['product', 'branch', 'unitType', 'variation'])
            ->when($search, function ($query) use ($search) {
                $query->whereHas('product', function ($q) use ($search) {
                    $q->where('title', 'LIKE', "%{$search}%"); // 'name' এর জায়গায় 'title'
                })
                ->orWhereHas('branch', function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%");
                })
                ->orWhere('reason', 'LIKE', "%{$search}%");
            })
            ->latest()
            ->paginate($limit);

        // Transform response for React table
        $formattedData = $records->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id,
                'date' => $item->created_at ? $item->created_at->format('d-m-Y') : null,
                'branch_id' => $item->branch_id,
                'unit_id' => $item->unit_id,
                'variation_id' => $item->variation_id,
                'place' => $item->branch->name ?? $item->place ?? 'My Shop',
                'product' => $item->product->title ?? '—', // Product model-এর 'title' field
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
     * Store a newly created damage record in storage.
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
            'quantity' => 'required|numeric',
            'unit' => 'nullable|string',
            'reason' => 'required|string',
        ]);

        $damageRecord = DamageRecord::create($validated);

        return response()->json([
            'message' => 'Damage record created successfully',
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
                $query->where('title', 'LIKE', "%{$search}%") // 'title' কলামে সার্চ করা হচ্ছে
                      ->orWhere('barcode', 'LIKE', "%{$search}%");
            })
            ->select('id', 'title as name', 'barcode') // 'title as name' দিলে ফ্রন্টএন্ডে name হিসেবেই যাবে
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
