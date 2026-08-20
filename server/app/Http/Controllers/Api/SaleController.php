<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\ProductStock;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $query = Sale::with(['branch', 'customer', 'items.product']);

        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }
        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }
        if ($request->filled('search')) {
            $query->where('invoice_no', 'like', '%'.$request->search.'%');
        }

        // Invoice number search (Sold Invoices page — number typed without the leading #)
        if ($request->filled('invoice_no')) {
            $query->where('invoice_no', 'like', '%'.ltrim($request->invoice_no, '#').'%');
        }

        // Name or phone search (Sold Invoices page)
        if ($request->filled('name_or_phone')) {
            $term = $request->name_or_phone;
            $query->whereHas('customer', function ($q) use ($term) {
                $q->where('name', 'like', "%{$term}%")
                  ->orWhere('phone', 'like', "%{$term}%");
            });
        }

        if ($request->filled('range')) {
            $this->applyDateRange($query, $request->range);
        }

        // date_type + from_date/to_date: choose whether the range applies to sale_date or created_at
        if ($request->filled('from_date') || $request->filled('to_date')) {
            $column = $request->input('date_type') === 'Created Date' ? 'created_at' : 'sale_date';

            if ($request->filled('from_date')) {
                $query->whereDate($column, '>=', $request->from_date);
            }
            if ($request->filled('to_date')) {
                $query->whereDate($column, '<=', $request->to_date);
            }
        }

        return response()->json($query->latest()->paginate($request->integer('per_page', 30)));
    }

    /**
     * Apply a `sale_date` filter based on a named range (today, this_week, this_month, this_year).
     */
    protected function applyDateRange($query, string $range): void
    {
        $today = now();

        switch ($range) {
            case 'today':
                $query->whereDate('sale_date', $today->toDateString());
                break;

            case 'this_week':
                $query->whereBetween('sale_date', [
                    $today->copy()->startOfWeek()->toDateString(),
                    $today->copy()->endOfWeek()->toDateString(),
                ]);
                break;

            case 'this_month':
                $query->whereBetween('sale_date', [
                    $today->copy()->startOfMonth()->toDateString(),
                    $today->copy()->endOfMonth()->toDateString(),
                ]);
                break;

            case 'this_year':
                $query->whereBetween('sale_date', [
                    $today->copy()->startOfYear()->toDateString(),
                    $today->copy()->endOfYear()->toDateString(),
                ]);
                break;

            // Unknown/blank range values are ignored — no date filter applied.
        }
    }

    public function show(Sale $sale)
    {
        return response()->json($sale->load(['branch', 'customer', 'items.product', 'items.product.brand']));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'customer_id' => 'nullable|exists:customers,id',
            'discount' => 'nullable|numeric|min:0',
            'vat' => 'nullable|numeric|min:0',
            'others_charge' => 'nullable|numeric|min:0',
            'others_label' => 'nullable|string|max:255',
            'paid' => 'required|numeric|min:0',
            'account' => 'nullable|string', // 'cash' or banks.code
            'sale_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.product_variant_id' => 'nullable|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        // Pre-validate stock levels to avoid internal 500 exceptions
        foreach ($validated['items'] as $item) {
            $stock = ProductStock::where('branch_id', $validated['branch_id'])
                ->where('product_id', $item['product_id'])
                ->where('product_variant_id', $item['product_variant_id'] ?? null)
                ->first();

            $availableQty = $stock ? $stock->quantity : 0;

            if ($availableQty < $item['quantity']) {
                return response()->json([
                    'message' => "Insufficient stock for product ID {$item['product_id']}.",
                    'errors' => [
                        'items' => ["Product ID {$item['product_id']} has only {$availableQty} items available in stock."]
                    ]
                ], 422);
            }
        }

        return DB::transaction(function () use ($validated, $request) {
            $subTotal = 0;

            // 1. Calculate Subtotal from items
            foreach ($validated['items'] as $item) {
                $subTotal += $item['quantity'] * $item['unit_price'];
            }

            $discount = $validated['discount'] ?? 0;
            $vat = $validated['vat'] ?? 0;
            $othersCharge = $validated['others_charge'] ?? 0;
            $total = max(0, $subTotal - $discount + $vat + $othersCharge);
            $paid = min($total, $validated['paid']);
            $due = max(0, $total - $paid);

            $status = 'Paid';
            if ($due > 0 && $paid > 0) {
                $status = 'Partial';
            } elseif ($due > 0 && $paid == 0) {
                $status = 'Due';
            }

            // 2. Create Sale Record
            $sale = Sale::create([
                'invoice_no' => 'INV-'.strtoupper(Str::random(8)),
                'branch_id' => $validated['branch_id'],
                'customer_id' => $validated['customer_id'] ?? null,
                'created_by' => $request->user()?->id,
                'sub_total' => $subTotal,
                'discount' => $discount,
                'vat' => $vat,
                'others_charge' => $othersCharge,
                'others_label' => $validated['others_label'] ?? null,
                'total' => $total,
                'paid' => $paid,
                'due' => $due,
                'status' => $status,
                'sale_date' => $validated['sale_date'],
            ]);

            // 3. Process Sale Items and Atomically Deduct Stock
            foreach ($validated['items'] as $item) {
                $itemTotal = $item['quantity'] * $item['unit_price'];

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['product_id'],
                    'product_variant_id' => $item['product_variant_id'] ?? null,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total' => $itemTotal,
                ]);

                // Auto-deduct stock from the selected branch
                ProductStock::deductStock(
                    $sale->branch_id,
                    $item['product_id'],
                    $item['product_variant_id'] ?? null,
                    $item['quantity']
                );
            }

            // 4. Record Payment Entry if payment was received
            if ($paid > 0) {
                $account = $validated['account'] ?? 'cash';

                Payment::create([
                    'sale_id' => $sale->id,
                    'customer_id' => $sale->customer_id,
                    'branch_id' => $sale->branch_id,
                    'amount' => $paid,
                    'type' => 'income',
                    'account' => $account,
                    'paid_date' => $validated['sale_date'],
                ]);

                // money received into a bank/MFS account (not cash) bumps its balance
                if ($account !== 'cash') {
                    \App\Models\Bank::where('code', $account)->first()?->adjustBalance($paid);
                }
            }

            return response()->json($sale->load(['items', 'customer']), 201);
        });
    }

    /**
     * POST /sales/{sale}/payments
     * Records a due-collection payment against an existing sale, updates
     * paid/due/status, moves the money into the chosen account, and drops
     * a Receipt Voucher into the ledger.
     */
    public function recordPayment(Request $request, Sale $sale)
    {
        $data = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'account' => 'nullable|string', // 'cash' or banks.code
            'note' => 'nullable|string',
            'paid_date' => 'nullable|date',
        ]);

        $account = $data['account'] ?? 'cash';

        $payment = DB::transaction(function () use ($sale, $data, $account, $request) {
            // never collect more than what's actually due
            $amount = min($data['amount'], (float) $sale->due);

            if ($amount <= 0) {
                abort(422, 'This invoice has no remaining due.');
            }

            $payment = Payment::create([
                'sale_id' => $sale->id,
                'customer_id' => $sale->customer_id,
                'branch_id' => $sale->branch_id,
                'amount' => $amount,
                'type' => 'due_collection',
                'account' => $account,
                'note' => $data['note'] ?? null,
                'paid_date' => $data['paid_date'] ?? now()->toDateString(),
            ]);

            $sale->decrement('due', $amount);
            $sale->increment('paid', $amount);
            $sale->refresh();
            $sale->update([
                'status' => $sale->due <= 0 ? 'Paid' : ($sale->paid > 0 ? 'Partial' : 'Due'),
            ]);

            if ($account !== 'cash') {
                \App\Models\Bank::where('code', $account)->first()?->adjustBalance($amount);
            }

            \App\Models\Voucher::recordFrom(
                'receipt',
                $sale->customer->name ?? 'Walk-in',
                $account,
                $amount,
                $data['note'] ?? "Due collection — {$sale->invoice_no}",
                $request->user()?->id,
                $payment
            );

            return $payment;
        });

        return response()->json([
            'payment' => $payment,
            'sale' => $sale->fresh(['customer']),
        ], 201);
    }

    public function returnableItems(Sale $sale)
    {
        $sale->load(['customer', 'items.product']);

        $items = $sale->items->map(function ($item) {
            $returnedQty = $item->returns()->sum('quantity');
            $remainingQty = $item->quantity - $returnedQty;

            return [
                'sale_item_id'       => $item->id,
                'product_id'         => $item->product_id,
                'product_name'       => $item->product->title ?? null,
                'unit_price'         => $item->unit_price,
                'sold_quantity'      => $item->quantity,
                'returned_quantity'  => $returnedQty,
                'remaining_quantity' => $remainingQty,
            ];
        })->filter(fn ($i) => $i['remaining_quantity'] > 0)->values();

        return response()->json([
            'sale' => [
                'id'         => $sale->id,
                'invoice_no' => $sale->invoice_no,
                'customer'   => $sale->customer,
            ],
            'items' => $items,
        ]);
    }
/**
     * Get invoices with pending/due payments.
     */
    public function dueInvoices(Request $request)
    {
        // Filter by status != 'Paid' or due > 0
        $query = Sale::with('customer')
            ->where('status', '!=', 'Paid');

        if ($request->filled('from_date')) {
            $query->whereDate('sale_date', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('sale_date', '<=', $request->to_date);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('customer', function ($customerQuery) use ($search) {
                    $customerQuery->where('name', 'like', "%{$search}%")
                                  ->orWhere('phone', 'like', "%{$search}%");
                })
                ->orWhere('invoice_no', 'like', "%{$search}%");
            });
        }

        $perPage = $request->get('per_page', 100);
        $invoices = $query->latest()->paginate($perPage);

        return response()->json($invoices);
    }

    /**
     * Toggle payment status between Paid and Due.
     */
    public function togglePaymentStatus(Request $request, Sale $sale)
    {
        $isPaid = $request->boolean('paid');

        if ($isPaid) {
            $sale->status = 'Paid';
            $sale->paid = $sale->total;
            $sale->due = 0;
        } else {
            $sale->status = 'Due';
            $sale->due = $sale->total;
            $sale->paid = 0;
        }

        $sale->save();

        return response()->json([
            'message' => 'Payment status updated successfully.',
            'data' => $sale,
        ]);
    }
}