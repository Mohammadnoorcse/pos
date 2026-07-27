<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductStock;
use App\Models\StockTransfer;
use App\Models\StockTransferItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockTransferController extends Controller
{
    public function index(Request $request)
    {
        $query = StockTransfer::with(['fromBranch', 'toBranch', 'items.product']);

        if ($request->filled('from_branch_id')) {
            $query->where('from_branch_id', $request->from_branch_id);
        }
        if ($request->filled('to_branch_id')) {
            $query->where('to_branch_id', $request->to_branch_id);
        }

        return response()->json($query->latest()->paginate($request->integer('per_page', 25)));
    }

    public function show(StockTransfer $stockTransfer)
    {
        return response()->json($stockTransfer->load(['fromBranch', 'toBranch', 'items.product', 'creator']));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:B2B_B2G,G2B',
            'from_branch_id' => 'required|exists:branches,id|different:to_branch_id',
            'to_branch_id' => 'required|exists:branches,id',
            'transfer_date' => 'required|date',
            'note' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.product_variant_id' => 'nullable|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $totalAmount = 0;
            foreach ($validated['items'] as $item) {
                $totalAmount += $item['quantity'] * $item['price'];
            }

            // 1. Create Stock Transfer Record
            $transfer = StockTransfer::create([
                'type' => $validated['type'],
                'from_branch_id' => $validated['from_branch_id'],
                'to_branch_id' => $validated['to_branch_id'],
                'created_by' => $request->user()?->id,
                'transfer_date' => $validated['transfer_date'],
                'note' => $validated['note'] ?? null,
                'total' => $totalAmount,
                'status' => 'confirmed',
            ]);

            // 2. Process Items: Deduct from Source Branch & Add to Target Branch
            foreach ($validated['items'] as $item) {
                $itemTotal = $item['quantity'] * $item['price'];

                StockTransferItem::create([
                    'stock_transfer_id' => $transfer->id,
                    'product_id' => $item['product_id'],
                    'product_variant_id' => $item['product_variant_id'] ?? null,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'total' => $itemTotal,
                ]);

                // Deduct from Source Branch
                ProductStock::deductStock(
                    $transfer->from_branch_id,
                    $item['product_id'],
                    $item['product_variant_id'] ?? null,
                    $item['quantity']
                );

                // Add to Target Branch
                ProductStock::addStock(
                    $transfer->to_branch_id,
                    $item['product_id'],
                    $item['product_variant_id'] ?? null,
                    $item['quantity']
                );
            }

            return response()->json($transfer->load(['fromBranch', 'toBranch', 'items']), 201);
        });
    }
}
