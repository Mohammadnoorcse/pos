<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class SaleController extends Controller
{
    /**
     * GET /sales
     * List sales with filters: branch_id, customer_id, status, date range, search by invoice.
     */
    public function index(Request $request)
    {
        $query = Sale::with(['branch', 'customer'])
            ->withCount('items');

        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }

        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('invoice_no')) {
            $query->where('invoice_no', 'like', '%' . $request->invoice_no . '%');
        }

        if ($request->filled('date_from')) {
            $query->whereDate('sale_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('sale_date', '<=', $request->date_to);
        }

        $sales = $query->latest('sale_date')->paginate($request->get('per_page', 20));

        return response()->json($sales);
    }

    /**
     * GET /sales/{sale}
     */
    public function show(Sale $sale)
    {
        $sale->load(['branch', 'customer', 'items.product', 'items.variant', 'payments']);

        return response()->json($sale);
    }

    /**
     * POST /sales
     * Creates a sale with its line items, computes totals, and optionally records
     * an initial payment. Wrapped in a transaction so partial writes never persist.
     */
    public function store(Request $request)
    {
        $validated = $this->validateSale($request);

        $sale = DB::transaction(function () use ($validated) {
            [$subTotal, $items] = $this->buildItems($validated['items']);

            $discount = $validated['discount'] ?? 0;
            $vat = $validated['vat'] ?? 0;
            $total = $subTotal - $discount + $vat;
            $paid = $validated['paid'] ?? 0;
            $due = max($total - $paid, 0);

            $sale = Sale::create([
                'invoice_no' => $validated['invoice_no'] ?? $this->generateInvoiceNo(),
                'branch_id' => $validated['branch_id'],
                'customer_id' => $validated['customer_id'] ?? null,
                'created_by' => auth()->id(),
                'sub_total' => $subTotal,
                'discount' => $discount,
                'vat' => $vat,
                'total' => $total,
                'paid' => $paid,
                'due' => $due,
                'status' => $this->resolveStatus($paid, $total),
                'sale_date' => $validated['sale_date'] ?? now()->toDateString(),
            ]);

            foreach ($items as $item) {
                $sale->items()->create($item);
            }

            if ($paid > 0) {
                Payment::create([
                    'sale_id' => $sale->id,
                    'branch_id' => $sale->branch_id,
                    'amount' => $paid,
                    'type' => 'income',
                    'paid_date' => $sale->sale_date,
                ]);
            }

            return $sale;
        });

        return response()->json($sale->load(['items', 'branch', 'customer']), 201);
    }

    /**
     * PUT/PATCH /sales/{sale}
     * Replaces line items and recalculates totals. Does not touch payment history;
     * use recordPayment() for collecting additional due amounts.
     */
    public function update(Request $request, Sale $sale)
    {
        $validated = $this->validateSale($request, $sale->id);

        $sale = DB::transaction(function () use ($validated, $sale) {
            [$subTotal, $items] = $this->buildItems($validated['items']);

            $discount = $validated['discount'] ?? $sale->discount;
            $vat = $validated['vat'] ?? $sale->vat;
            $total = $subTotal - $discount + $vat;
            $due = max($total - $sale->paid, 0);

            $sale->update([
                'invoice_no' => $validated['invoice_no'] ?? $sale->invoice_no,
                'branch_id' => $validated['branch_id'],
                'customer_id' => $validated['customer_id'] ?? null,
                'sub_total' => $subTotal,
                'discount' => $discount,
                'vat' => $vat,
                'total' => $total,
                'due' => $due,
                'status' => $this->resolveStatus($sale->paid, $total),
                'sale_date' => $validated['sale_date'] ?? $sale->sale_date,
            ]);

            $sale->items()->delete();
            foreach ($items as $item) {
                $sale->items()->create($item);
            }

            return $sale;
        });

        return response()->json($sale->load(['items', 'branch', 'customer']));
    }

    /**
     * DELETE /sales/{sale}
     */
    public function destroy(Sale $sale)
    {
        $sale->delete();

        return response()->json(['message' => 'Sale deleted successfully']);
    }

    /**
     * POST /sales/{sale}/payments
     * Records a due collection payment against an existing sale and updates
     * the sale's paid/due/status fields accordingly.
     */
    public function recordPayment(Request $request, Sale $sale)
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01', 'max:' . max($sale->due, 0)],
            'paid_date' => ['nullable', 'date'],
        ]);

        $payment = DB::transaction(function () use ($validated, $sale) {
            $payment = Payment::create([
                'sale_id' => $sale->id,
                'branch_id' => $sale->branch_id,
                'amount' => $validated['amount'],
                'type' => 'due_collection',
                'paid_date' => $validated['paid_date'] ?? now()->toDateString(),
            ]);

            $paid = $sale->paid + $validated['amount'];
            $due = max($sale->total - $paid, 0);

            $sale->update([
                'paid' => $paid,
                'due' => $due,
                'status' => $this->resolveStatus($paid, $sale->total),
            ]);

            return $payment;
        });

        return response()->json([
            'payment' => $payment,
            'sale' => $sale->fresh(),
        ], 201);
    }

    /**
     * Validate an incoming sale request. $saleId excludes the current record
     * from the invoice_no unique check on update.
     */
    protected function validateSale(Request $request, ?int $saleId = null): array
    {
        return $request->validate([
            'invoice_no' => [
                'nullable', 'string',
                Rule::unique('sales', 'invoice_no')->ignore($saleId),
            ],
            'branch_id' => ['required', 'exists:branches,id'],
            'customer_id' => ['nullable', 'exists:customers,id'],
            'discount' => ['nullable', 'numeric', 'min:0'],
            'vat' => ['nullable', 'numeric', 'min:0'],
            'paid' => ['nullable', 'numeric', 'min:0'],
            'sale_date' => ['nullable', 'date'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.product_variant_id' => ['nullable', 'exists:product_variants,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
        ]);
    }

    /**
     * Builds line-item rows (with computed totals) and the overall sub-total
     * from validated item input.
     */
    protected function buildItems(array $rawItems): array
    {
        $subTotal = 0;
        $items = [];

        foreach ($rawItems as $row) {
            $lineTotal = $row['quantity'] * $row['unit_price'];
            $subTotal += $lineTotal;

            $items[] = [
                'product_id' => $row['product_id'],
                'product_variant_id' => $row['product_variant_id'] ?? null,
                'quantity' => $row['quantity'],
                'unit_price' => $row['unit_price'],
                'total' => $lineTotal,
            ];
        }

        return [$subTotal, $items];
    }

    protected function resolveStatus(float $paid, float $total): string
    {
        if ($paid <= 0) {
            return 'Due';
        }

        if ($paid >= $total) {
            return 'Paid';
        }

        return 'Partial';
    }

    protected function generateInvoiceNo(): string
    {
        $last = Sale::orderByDesc('id')->first();
        $next = $last ? $last->id + 1 : 1;

        return 'INV-' . now()->format('Ymd') . '-' . str_pad($next, 4, '0', STR_PAD_LEFT);
    }
}
