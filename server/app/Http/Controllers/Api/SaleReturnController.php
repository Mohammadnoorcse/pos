<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductStock;
use App\Models\SaleItem;
use App\Models\SaleReturn;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleReturnController extends Controller
{
    public function index(Request $request)
    {
        $returns = SaleReturn::with(['sale', 'saleItem.product'])
            ->latest()
            ->paginate($request->integer('per_page', 25));

        return response()->json($returns);
    }

  public function store(Request $request)
{
    $validated = $request->validate([
        'sale_id'      => 'required|exists:sales,id',
        'sale_item_id' => 'required|exists:sale_items,id',
        'quantity'     => 'required|integer|min:1',
        'return_date'  => 'required|date',
    ]);

    return DB::transaction(function () use ($validated) {
        $saleItem = SaleItem::with('sale')->findOrFail($validated['sale_item_id']);

        $alreadyReturned = $saleItem->returns()->sum('quantity');
        $remaining = $saleItem->quantity - $alreadyReturned;

        if ($validated['quantity'] > $remaining) {
            return response()->json([
                'message' => "Return quantity remaining stock ({$remaining}) থেকে বেশি হতে পারবে না।",
            ], 422);
        }

        // Loss/amount নিজে থেকেই calculate হবে
        $amount = $saleItem->unit_price * $validated['quantity'];

        $saleReturn = SaleReturn::create([
            'sale_id'      => $validated['sale_id'],
            'sale_item_id' => $validated['sale_item_id'],
            'quantity'     => $validated['quantity'],
            'amount'       => $amount,
            'return_date'  => $validated['return_date'],
        ]);

        // Stock ফেরত যোগ হবে
        ProductStock::addStock(
            $saleItem->sale->branch_id,
            $saleItem->product_id,
            $saleItem->product_variant_id,
            $validated['quantity']
        );

        // Sale-এর total/due আপডেট (loss reflect করার জন্য)
        $sale = $saleItem->sale;
        $sale->total -= $amount;
        $sale->due = max(0, $sale->total - $sale->paid);
        $sale->save();

        return response()->json($saleReturn->load('saleItem.product'), 201);
    });
}
}
