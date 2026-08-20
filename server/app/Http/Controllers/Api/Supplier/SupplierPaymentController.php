<?php

namespace App\Http\Controllers\Api\Supplier;

use App\Http\Controllers\Controller;
use App\Models\Bank;
use Illuminate\Http\Request;
use App\Models\Purchase;
use App\Models\SupplierPayment;
use App\Models\Voucher;
use Illuminate\Support\Facades\DB;

class SupplierPaymentController extends Controller
{
    /**
     * GET /api/supplier-payments
     * Feeds SupplierPaymentPage.jsx's payment list/table.
     */
    public function index(Request $request)
    {
        $query = SupplierPayment::query()->with(['supplier:id,name,company,phone,address', 'purchase:id,invoice_no,total,paid,due']);
 
        if ($request->filled('search')) {
            $s = $request->string('search');
            $query->whereHas('supplier', function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")->orWhere('company', 'like', "%{$s}%");
            });
        }
 
        if ($request->filled('account') && $request->account !== 'ALL') {
            $query->where('account', $request->account);
        }

        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->integer('supplier_id'));
        }

        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->integer('branch_id'));
        }
 
        $payments = $query->latest('paid_date')->paginate($request->integer('per_page', 100));
 
        return response()->json($payments);
    }
 
    /**
     * POST /api/supplier-payments
     * Records a new payment against a supplier and updates the linked purchase's
     * paid/due/status atomically. Also moves money out of the chosen account
     * (cash or a bank) and drops a Payment Voucher (PV) into the ledger.
     *
     * If the frontend doesn't send a specific purchase_id, the payment is
     * auto-applied to the supplier's oldest outstanding invoice (FIFO) so
     * paid/due totals always move instead of silently going nowhere.
     *
     * Note: if the amount exceeds that single invoice's due, this still only
     * settles that one invoice (it will show as over-paid rather than
     * spilling the remainder onto the next invoice). For split payments
     * across multiple invoices, send an explicit purchase_id per payment.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'purchase_id' => 'nullable|exists:purchases,id',
            'amount' => 'required|numeric|min:0.01',
            'method' => 'required|in:Cash,Bank Transfer,bKash,Nagad,Cheque',
            'account' => 'nullable|string', 
            'note' => 'nullable|string',
            'received_by' => 'nullable|string|max:255',
            'paid_by' => 'nullable|string|max:255',
            'paid_date' => 'required|date',
            'branch_id' => 'nullable|exists:branches,id',
        ]);
 
        $account = $data['account'] ?? 'cash';
        $data['account'] = $account;
 
        $payment = DB::transaction(function () use ($data, $account, $request) {
            if (empty($data['purchase_id'])) {
                $oldestDue = Purchase::where('supplier_id', $data['supplier_id'])
                    ->where('due', '>', 0)
                    ->oldest('purchase_date')
                    ->first();
 
                if ($oldestDue) {
                    $data['purchase_id'] = $oldestDue->id;
                }
            }
 
            $payment = SupplierPayment::create([
                ...$data,
                'payment_no' => $this->nextPaymentNo(),
                 'created_by' => $request->user()?->id,
            ]);
 
            if (!empty($data['purchase_id'])) {
                Purchase::findOrFail($data['purchase_id'])->refreshTotals();
            }
 
            // move the money out of the chosen account
            if ($account !== 'cash') {
                Bank::where('code', $account)->first()?->adjustBalance(-$data['amount']);
            }
 
            // drop a Payment Voucher into the shared ledger, per house convention
            Voucher::recordFrom(
                'payment',
                $payment->supplier->name,
                $account,
                $data['amount'],
                $data['note'] ?? null,
                $request->user()?->id,
                $payment
            );
 
            return $payment;
        });
 
        return response()->json($payment->load(['supplier', 'purchase']), 201);
    }
 
    public function destroy(SupplierPayment $supplierPayment)
    {
        DB::transaction(function () use ($supplierPayment) {
            $purchaseId = $supplierPayment->purchase_id;
            $account = $supplierPayment->account;
            $amount = $supplierPayment->amount;
 
            $supplierPayment->delete();
 
            if ($purchaseId) {
                Purchase::find($purchaseId)?->refreshTotals();
            }
 
            // reverse the balance effect — the money "returns" to the account
            if ($account && $account !== 'cash') {
                Bank::where('code', $account)->first()?->adjustBalance($amount);
            }
        });
 
        return response()->json(['message' => 'Payment removed.']);
    }
 
    private function nextPaymentNo(): string
    {
        $last = SupplierPayment::query()->latest('id')->value('id') ?? 2000;
 
        return 'PMT-' . ($last + 1);
    }
}