<?php

namespace App\Http\Controllers\Api\Acc;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\ScopesToBranch;
use App\Models\Bank;
use Illuminate\Http\Request;

class BankController extends Controller
{
    use ScopesToBranch;

    // GET /api/acc/banks
    public function index(Request $request)
    {
        $q = Bank::query();
        $this->applyBranchScope($q, $request);

        if ($request->filled('type') && $request->type !== 'ALL') {
            $q->where('type', $request->type);
        }
        if ($request->filled('status') && $request->status !== 'ALL') {
            $q->where('status', $request->status);
        }
        if ($request->filled('search')) {
            $s = $request->search;
            $q->where(function ($w) use ($s) {
                $w->where('bank_name', 'like', "%{$s}%")
                  ->orWhere('branch', 'like', "%{$s}%")
                  ->orWhere('account_name', 'like', "%{$s}%")
                  ->orWhere('account_number', 'like', "%{$s}%");
            });
        }

        $banks = $q->orderByDesc('id')->get();

        return response()->json([
            'banks' => $banks,
            'summary' => [
                'total_balance' => (float) $banks->sum('balance'),
                'active_count' => $banks->where('status', 'active')->count(),
                'frozen_count' => $banks->where('status', 'frozen')->count(),
                'negative_count' => $banks->where('balance', '<', 0)->count(),
            ],
        ]);
    }

    // GET /api/acc/banks/{bank}
    public function show(Request $request, Bank $bank)
    {
        $this->denyIfOtherBranch($request, $bank->branch_id);

        return response()->json($bank);
    }

    // POST /api/acc/banks
    public function store(Request $request)
    {
        $data = $request->validate([
            'bank_name' => 'required|string|max:255',
            'branch' => 'nullable|string|max:255',
            'account_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:255',
            'routing_number' => 'nullable|string|max:255',
            'type' => 'required|in:Current,Savings,OD / CC',
            'opening_balance' => 'nullable|numeric',
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        $last = Bank::orderByDesc('id')->first();
        $next = $last ? ((int) substr($last->code, 4)) + 1 : 1;
        $data['code'] = 'BNK-' . str_pad($next, 3, '0', STR_PAD_LEFT);
        $data['opening_balance'] = $data['opening_balance'] ?? 0;
        $data['balance'] = $data['opening_balance'];
        $data['status'] = 'active';
        $data = $this->forceBranchIdOnCreate($data, $request);

        $bank = Bank::create($data);

        return response()->json($bank, 201);
    }

    // PUT /api/acc/banks/{bank}
    public function update(Request $request, Bank $bank)
    {
        $this->denyIfOtherBranch($request, $bank->branch_id);

        $data = $request->validate([
            'bank_name' => 'sometimes|string|max:255',
            'branch' => 'nullable|string|max:255',
            'account_name' => 'sometimes|string|max:255',
            'account_number' => 'sometimes|string|max:255',
            'routing_number' => 'nullable|string|max:255',
            'type' => 'sometimes|in:Current,Savings,OD / CC',
            'balance' => 'sometimes|numeric',
            'status' => 'sometimes|in:active,frozen',
        ]);

        $bank->update($data);

        return response()->json($bank);
    }

    // DELETE /api/acc/banks/{bank}
    public function destroy(Request $request, Bank $bank)
    {
        $this->denyIfOtherBranch($request, $bank->branch_id);

        $bank->delete();

        return response()->json(['message' => 'Bank account removed']);
    }
}
