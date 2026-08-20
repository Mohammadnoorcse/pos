<?php

namespace App\Http\Controllers\Api\Acc;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\ScopesToBranch;
use App\Models\Bank;
use App\Models\Income;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class IncomeController extends Controller
{
    use ScopesToBranch;

    // GET /api/acc/incomes?type=direct|indirect&category=&account=
    public function index(Request $request)
    {
        $q = Income::query();
        $this->applyBranchScope($q, $request);

        if ($request->filled('type') && $request->type !== 'ALL') $q->where('type', $request->type);
        if ($request->filled('category') && $request->category !== 'ALL') $q->where('category', $request->category);
        if ($request->filled('account') && $request->account !== 'ALL') $q->where('account', $request->account);
        if ($request->filled('from')) $q->whereDate('date', '>=', $request->from);
        if ($request->filled('to')) $q->whereDate('date', '<=', $request->to);

        $incomes = $q->orderByDesc('date')->orderByDesc('id')->get();

        return response()->json([
            'incomes' => $incomes,
            'summary' => [
                'total' => (float) $incomes->sum('amount'),
                'direct_total' => (float) $incomes->where('type', 'direct')->sum('amount'),
                'indirect_total' => (float) $incomes->where('type', 'indirect')->sum('amount'),
            ],
        ]);
    }

    // POST /api/acc/incomes
    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|in:direct,indirect',
            'date' => 'required|date',
            'category' => 'required|string',
            'account' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
            'source' => 'nullable|string',
            'note' => 'nullable|string',
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        $data = $this->forceBranchIdOnCreate($data, $request);

        $income = DB::transaction(function () use ($data, $request) {
            $last = Income::orderByDesc('id')->first();
            $next = $last ? ((int) substr($last->income_no, 4)) + 1 : 5510;
            $data['income_no'] = 'INC-' . $next;
            $data['created_by'] = $request->user()?->id;

            $income = Income::create($data);

            if ($data['account'] !== 'cash') {
                Bank::where('code', $data['account'])->first()?->adjustBalance($data['amount']);
            }

            Voucher::recordFrom(
                'receipt',
                $data['source'] ?? $data['category'],
                $data['account'],
                $data['amount'],
                $data['note'] ?? null,
                $request->user()?->id,
                $income
            );

            return $income;
        });

        return response()->json($income, 201);
    }

    // DELETE /api/acc/incomes/{income}
    public function destroy(Request $request, Income $income)
    {
        $this->denyIfOtherBranch($request, $income->branch_id);

        DB::transaction(function () use ($income) {
            if ($income->account !== 'cash') {
                Bank::where('code', $income->account)->first()?->adjustBalance(-$income->amount);
            }
            $income->delete();
        });

        return response()->json(['message' => 'Income removed']);
    }
}
