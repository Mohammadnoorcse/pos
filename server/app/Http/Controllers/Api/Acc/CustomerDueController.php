<?php

namespace App\Http\Controllers\Api\Acc;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\ScopesToBranch;
use App\Models\Bank;
use App\Models\Customer;
use App\Models\Payment;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CustomerDueController extends Controller
{
    use ScopesToBranch;

    // GET /api/acc/customer-dues/customers — the due list (aging)
    public function customers(Request $request)
    {
        $q = Customer::query()->withSum('sales as total_due_sum', 'due');
        // NOTE: only apply this if `customers` table actually has a branch_id column.
        $this->applyBranchScope($q, $request);

        $customers = $q
            ->get()
            ->map(function ($c) {
                $lastInvoice = $c->lastInvoice();
                $lastPayment = $c->lastPayment();

                return [
                    'id' => $c->id,
                    'name' => $c->name,
                    'phone' => $c->phone,
                    'area' => $c->area,
                    'total_due' => (float) ($c->total_due_sum ?? 0),
                    'aging_days' => $lastInvoice ? now()->diffInDays($lastInvoice->sale_date) : null,
                    'last_invoice' => $lastInvoice?->invoice_no,
                    'last_payment_date' => $lastPayment?->paid_date,
                ];
            });

        return response()->json(['customers' => $customers]);
    }

    // GET /api/acc/customer-dues/collections
    public function index(Request $request)
    {
        $q = Payment::with('customer')->where('type', 'due_collection');
        $this->applyBranchScope($q, $request);

        if ($request->filled('customer_id')) $q->where('customer_id', $request->customer_id);
        if ($request->filled('account') && $request->account !== 'ALL') $q->where('account', $request->account);

        $collections = $q->orderByDesc('paid_date')->orderByDesc('id')->get();

        return response()->json([
            'collections' => $collections,
            'summary' => ['total_collected' => (float) $collections->sum('amount')],
        ]);
    }

    // POST /api/acc/customer-dues/collections
    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'sale_id' => 'nullable|exists:sales,id',
            'account' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
            'note' => 'nullable|string',
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        $data = $this->forceBranchIdOnCreate($data, $request);

        $collection = DB::transaction(function () use ($data, $request) {
            $data['type'] = 'due_collection';
            $data['paid_date'] = now()->toDateString();

            $collection = Payment::create($data);

            // reduce the linked sale's due, if given
            if (!empty($data['sale_id'])) {
                $sale = $collection->sale;
                $sale->decrement('due', min($data['amount'], $sale->due));
                $sale->increment('paid', $data['amount']);
                if ($sale->fresh()->due <= 0) {
                    $sale->update(['status' => 'Paid']);
                } elseif ($sale->paid > 0) {
                    $sale->update(['status' => 'Partial']);
                }
            }

            if ($data['account'] !== 'cash') {
                Bank::where('code', $data['account'])->first()?->adjustBalance($data['amount']);
            }

            Voucher::recordFrom(
                'receipt',
                $collection->customer->name,
                $data['account'],
                $data['amount'],
                $data['note'] ?? null,
                $request->user()?->id,
                $collection
            );

            return $collection;
        });

        return response()->json($collection->load('customer'), 201);
    }
}
