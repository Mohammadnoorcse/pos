<?php

namespace App\Http\Controllers\Api\Supplier;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Purchase;
use Illuminate\Support\Facades\DB;

class PurchaseController extends Controller
{
    /**
     * GET /api/purchases
     * Feeds PurchaseInvoiceReportPage.jsx / SupplierInvoicesPage.jsx and, with
     * ?supplier_id=&due_only=1, the invoice picker in SupplierPaymentPage.jsx.
     */
    public function index(Request $request)
    {
        $query = Purchase::query()->with(['supplier:id,name,company,phone', 'items']);

        if ($request->filled('search')) {
            $s = $request->string('search');
            $query->where('invoice_no', 'like', "%{$s}%")
                ->orWhereHas('supplier', fn ($q) => $q->where('name', 'like', "%{$s}%")->orWhere('company', 'like', "%{$s}%"));
        }

        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->integer('supplier_id'));
        }

        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->integer('branch_id'));
        }

        if ($request->boolean('due_only')) {
            $query->where('due', '>', 0);
        }

        return response()->json(
            $query->latest('purchase_date')->paginate($request->integer('per_page', 100))
        );
    }

    public function show(Purchase $purchase)
    {
        return response()->json($purchase->load(['supplier', 'items.product', 'payments']));
    }

    /**
     * POST /api/purchases
     * Creates a purchase invoice with line items (matches PurchasePage.jsx's items[] shape:
     * { name, qty, price }). Optionally records an initial payment.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'branch_id' => 'nullable|exists:branches,id',
            'purchase_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.name' => 'required|string|max:255',
            'items.*.product_id' => 'nullable|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'initial_paid' => 'nullable|numeric|min:0',
        ]);

        $purchase = DB::transaction(function () use ($data, $request) {
            $total = collect($data['items'])->sum(fn ($i) => $i['qty'] * $i['price']);

            $purchase = Purchase::create([
                'invoice_no' => $this->nextInvoiceNo(),
                'supplier_id' => $data['supplier_id'],
                'branch_id' => $data['branch_id'] ?? null,
                'created_by' => $request->user()?->id,
                'total' => $total,
                'paid' => 0,
                'due' => $total,
                'status' => 'Due',
                'purchase_date' => $data['purchase_date'],
            ]);

            foreach ($data['items'] as $item) {
                $purchase->items()->create([
                    'product_id' => $item['product_id'] ?? null,
                    'name' => $item['name'],
                    'qty' => $item['qty'],
                    'price' => $item['price'],
                    'total' => $item['qty'] * $item['price'],
                ]);
            }

            if (!empty($data['initial_paid'])) {
                $purchase->payments()->create([
                    'payment_no' => 'PMT-' . ((\App\Models\SupplierPayment::latest('id')->value('id') ?? 2000) + 1),
                    'supplier_id' => $purchase->supplier_id,
                    'amount' => $data['initial_paid'],
                    'method' => 'Cash',
                    'paid_date' => $data['purchase_date'],
                ]);
                $purchase->refreshTotals();
            }

            return $purchase;
        });

        return response()->json($purchase->load(['items', 'supplier']), 201);
    }

    private function nextInvoiceNo(): string
    {
        $seq = Purchase::query()->count() + 1;

        return 'STB/' . now()->format('ymd') . str_pad($seq, 3, '0', STR_PAD_LEFT);
    }
}