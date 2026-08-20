<?php

namespace App\Http\Controllers\Api\Acc;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\ScopesToBranch;
use App\Models\Bank;
use App\Models\Expense;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExpenseController extends Controller
{
    use ScopesToBranch;

    // GET /api/acc/expenses?date=&category=&account=
    public function index(Request $request)
    {
        $q = Expense::query();
        $this->applyBranchScope($q, $request);

        if ($request->filled('date')) $q->whereDate('expense_date', $request->date);
        if ($request->filled('from')) $q->whereDate('expense_date', '>=', $request->from);
        if ($request->filled('to')) $q->whereDate('expense_date', '<=', $request->to);
        if ($request->filled('category') && $request->category !== 'ALL') $q->where('category', $request->category);
        if ($request->filled('account') && $request->account !== 'ALL') $q->where('account', $request->account);

        $expenses = $q->orderByDesc('expense_date')->orderByDesc('id')->get();
        $today = today()->toDateString();

        return response()->json([
            'expenses' => $expenses,
            'summary' => [
                'total' => (float) $expenses->sum('amount'),
                'today_total' => (float) $expenses->where('expense_date', $today)->sum('amount'),
                'by_category' => $expenses->groupBy('category')->map->sum('amount'),
            ],
        ]);
    }

    // POST /api/acc/expenses
    public function store(Request $request)
    {
        $data = $request->validate([
            'expense_date' => 'required|date',
            'category' => 'required|string',
            'account' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
            'title' => 'nullable|string',
            'note' => 'nullable|string',
            'payee' => 'nullable|string',
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        $data = $this->forceBranchIdOnCreate($data, $request);

        $expense = DB::transaction(function () use ($data, $request) {
            $last = Expense::orderByDesc('id')->first();
            $next = $last && $last->expense_no ? ((int) substr($last->expense_no, 4)) + 1 : 3301;
            $data['expense_no'] = 'EXP-' . $next;
            $data['title'] = $data['title'] ?? $data['category'];
            $data['created_by'] = $request->user()?->id;

            $expense = Expense::create($data);

            if ($data['account'] !== 'cash') {
                Bank::where('code', $data['account'])->first()?->adjustBalance(-$data['amount']);
            }

            Voucher::recordFrom(
                'payment',
                $data['payee'] ?? $data['category'],
                $data['account'],
                $data['amount'],
                $data['note'] ?? $data['title'],
                $request->user()?->id,
                $expense
            );

            return $expense;
        });

        return response()->json($expense, 201);
    }

    // DELETE /api/acc/expenses/{expense}
    public function destroy(Request $request, Expense $expense)
    {
        $this->denyIfOtherBranch($request, $expense->branch_id);

        DB::transaction(function () use ($expense) {
            if ($expense->account !== 'cash') {
                Bank::where('code', $expense->account)->first()?->adjustBalance($expense->amount);
            }
            $expense->delete();
        });

        return response()->json(['message' => 'Expense removed']);
    }
}
