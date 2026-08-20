<?php

namespace App\Http\Controllers\Api\Acc;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\ScopesToBranch;
use App\Models\Bank;
use App\Models\Loan;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LoanController extends Controller
{
    use ScopesToBranch;

    // GET /api/acc/loans?kind=loan|capital&status=
    public function index(Request $request)
    {
        $q = Loan::with('payments');
        $this->applyBranchScope($q, $request);

        if ($request->filled('kind') && $request->kind !== 'ALL') $q->where('kind', $request->kind);
        if ($request->filled('status') && $request->status !== 'ALL') $q->where('status', $request->status);

        $loans = $q->orderByDesc('id')->get();

        return response()->json([
            'loans' => $loans,
            'summary' => [
                'total_outstanding' => (float) $loans->sum('outstanding'),
                'active_count' => $loans->where('status', 'active')->count(),
            ],
        ]);
    }

    // POST /api/acc/loans
    public function store(Request $request)
    {
        $data = $request->validate([
            'kind' => 'required|in:loan,capital',
            'party' => 'required|string',
            'party_type' => 'nullable|string',
            'principal' => 'required|numeric|min:0.01',
            'rate' => 'nullable|numeric',
            'tenure_months' => 'nullable|integer',
            'emi' => 'nullable|numeric',
            'next_due' => 'nullable|date',
            'taken_on' => 'required|date',
            'purpose' => 'nullable|string',
            'account' => 'nullable|string', // where the received money lands, defaults to cash
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        $data = $this->forceBranchIdOnCreate($data, $request);

        $loan = DB::transaction(function () use ($data, $request) {
            $last = Loan::orderByDesc('id')->first();
            $next = $last ? ((int) substr($last->loan_no, 3)) + 1 : 13;
            $data['loan_no'] = 'LN-' . str_pad($next, 4, '0', STR_PAD_LEFT);
            $data['outstanding'] = $data['principal'];
            $data['status'] = 'active';
            $account = $data['account'] ?? 'cash';
            unset($data['account']);
            $data['created_by'] = $request->user()?->id;

            $loan = Loan::create($data);

            // money received increases cash/bank balance
            if ($account !== 'cash') {
                Bank::where('code', $account)->first()?->adjustBalance($data['principal']);
            }

            Voucher::recordFrom(
                'receipt',
                $data['party'],
                $account,
                $data['principal'],
                $data['kind'] === 'loan' ? 'Loan received' : 'Capital injection',
                $request->user()?->id,
                $loan
            );

            return $loan;
        });

        return response()->json($loan, 201);
    }

    // POST /api/acc/loans/{loan}/payments — record a repayment/installment
    public function pay(Request $request, Loan $loan)
    {
        $this->denyIfOtherBranch($request, $loan->branch_id);

        $data = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'account' => 'nullable|string',
            'note' => 'nullable|string',
        ]);

        $account = $data['account'] ?? 'cash';

        $payment = DB::transaction(function () use ($loan, $data, $account, $request) {
            $payment = $loan->recordPayment($data['amount'], $account, $data['note'] ?? null);

            if ($account !== 'cash') {
                Bank::where('code', $account)->first()?->adjustBalance(-$data['amount']);
            }

            Voucher::recordFrom(
                'payment',
                $loan->party,
                $account,
                $data['amount'],
                'Loan repayment — ' . $loan->loan_no,
                $request->user()?->id,
                $payment
            );

            return $payment;
        });

        return response()->json(['payment' => $payment, 'loan' => $loan->fresh()]);
    }
}
