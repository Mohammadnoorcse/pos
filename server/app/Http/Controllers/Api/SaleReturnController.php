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
            ->when($request->filled('branch_id'), function ($query) use ($request) {
                $query->whereHas('sale', function ($q) use ($request) {
                    $q->where('branch_id', $request->branch_id);
                });
            })
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->search;
                $query->whereHas('sale', function ($q) use ($search) {
                    $q->where('invoice_no', 'like', "%{$search}%");
                })
                ->orWhereHas('saleItem.product', function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('range'), function ($query) use ($request) {
                $this->applyDateRange($query, $request->range, 'return_date');
            })
            ->latest()
            ->paginate($request->integer('per_page', 25));

        return response()->json($returns);
    }

    /**
     * Apply a date-range filter (today, this_week, this_month, this_year) on the given column.
     */
    protected function applyDateRange($query, string $range, string $column): void
    {
        $today = now();

        switch ($range) {
            case 'today':
                $query->whereDate($column, $today->toDateString());
                break;

            case 'this_week':
                $query->whereBetween($column, [
                    $today->copy()->startOfWeek()->toDateString(),
                    $today->copy()->endOfWeek()->toDateString(),
                ]);
                break;

            case 'this_month':
                $query->whereBetween($column, [
                    $today->copy()->startOfMonth()->toDateString(),
                    $today->copy()->endOfMonth()->toDateString(),
                ]);
                break;

            case 'this_year':
                $query->whereBetween($column, [
                    $today->copy()->startOfYear()->toDateString(),
                    $today->copy()->endOfYear()->toDateString(),
                ]);
                break;

            // Unknown/blank range values are ignored — no date filter applied.
        }
    }

  public function store(Request $request)
{
    $validated = $request->validate([
        'sale_id'       => 'required|exists:sales,id',
        'sale_item_id'  => 'required|exists:sale_items,id',
        'quantity'      => 'required|integer|min:1',
        'return_date'   => 'required|date',
        // Refund handling — how the returned amount is settled with the customer.
        // 'direct'   => actual money leaves cash/bank now (real refund)
        // 'exchange' => no money moves, it's just adjusted against the invoice/exchange
        'refund_action' => 'nullable|in:direct,exchange',
        'account'       => 'nullable|string', // 'cash' or banks.code, only used when refund_action = direct
        'note'          => 'nullable|string',
    ]);

    return DB::transaction(function () use ($validated, $request) {
        $saleItem = SaleItem::with('sale.customer')->findOrFail($validated['sale_item_id']);

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

        // --- Refund settlement -------------------------------------------------
        $refundAction = $validated['refund_action'] ?? 'direct';

        if ($refundAction === 'direct') {
            $account = $validated['account'] ?? 'cash';

            // money physically leaves the till/bank
            if ($account !== 'cash') {
                \App\Models\Bank::where('code', $account)->first()?->adjustBalance(-$amount);
            }

            \App\Models\Voucher::recordFrom(
                'payment',
                $sale->customer->name ?? 'Walk-in',
                $account,
                $amount,
                $validated['note'] ?? "Sale return refund — {$sale->invoice_no}",
                $request->user()?->id,
                $saleReturn
            );
        }
        // 'exchange' => no cash movement, due/total already adjusted above — nothing further to do.

        return response()->json($saleReturn->load('saleItem.product'), 201);
    });
}
}