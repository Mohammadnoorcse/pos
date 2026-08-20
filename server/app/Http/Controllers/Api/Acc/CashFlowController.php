<?php

namespace App\Http\Controllers\Api\Acc;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\ScopesToBranch;
use App\Models\Bank;
use App\Models\CashFlowEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CashFlowController extends Controller
{
    use ScopesToBranch;

    // GET /api/acc/cash-flow?from=&to=&type=&source=
    public function index(Request $request)
    {
        $q = CashFlowEntry::query();
        $this->applyBranchScope($q, $request);

        if ($request->filled('from')) $q->whereDate('date', '>=', $request->from);
        if ($request->filled('to')) $q->whereDate('date', '<=', $request->to);
        if ($request->filled('type') && $request->type !== 'ALL') $q->where('type', $request->type);
        if ($request->filled('source') && $request->source !== 'ALL') $q->where('source', $request->source);

        $entries = $q->orderByDesc('date')->orderByDesc('id')->get();

        $totalIn = (float) $entries->where('type', 'in')->sum('amount');
        $totalOut = (float) $entries->where('type', 'out')->sum('amount');

        return response()->json([
            'entries' => $entries,
            'summary' => [
                'total_in' => $totalIn,
                'total_out' => $totalOut,
                'net' => $totalIn - $totalOut,
            ],
        ]);
    }

    // POST /api/acc/cash-flow
    public function store(Request $request)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'type' => 'required|in:in,out',
            'source' => 'required|string', // "cash" or banks.code
            'category' => 'required|string',
            'note' => 'nullable|string',
            'amount' => 'required|numeric|min:0.01',
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        $data = $this->forceBranchIdOnCreate($data, $request);

        $entry = DB::transaction(function () use ($data, $request) {
            $last = CashFlowEntry::orderByDesc('id')->first();
            $next = $last ? ((int) substr($last->entry_no, 3)) + 1 : 2200;
            $data['entry_no'] = 'CF-' . $next;
            $data['created_by'] = $request->user()?->id;

            $entry = CashFlowEntry::create($data);

            // keep the linked bank balance in sync; "cash" source has no bank row
            if ($data['source'] !== 'cash') {
                $bank = Bank::where('code', $data['source'])->first();
                $bank?->adjustBalance($data['type'] === 'in' ? $data['amount'] : -$data['amount']);
            }

            return $entry;
        });

        return response()->json($entry, 201);
    }

    // DELETE /api/acc/cash-flow/{cashFlowEntry}
    public function destroy(Request $request, CashFlowEntry $cashFlowEntry)
    {
        $this->denyIfOtherBranch($request, $cashFlowEntry->branch_id);

        DB::transaction(function () use ($cashFlowEntry) {
            if ($cashFlowEntry->source !== 'cash') {
                $bank = Bank::where('code', $cashFlowEntry->source)->first();
                // reverse the original effect
                $bank?->adjustBalance($cashFlowEntry->type === 'in' ? -$cashFlowEntry->amount : $cashFlowEntry->amount);
            }
            $cashFlowEntry->delete();
        });

        return response()->json(['message' => 'Entry removed']);
    }
}
