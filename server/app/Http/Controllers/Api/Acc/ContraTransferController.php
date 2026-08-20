<?php

namespace App\Http\Controllers\Api\Acc;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\ScopesToBranch;
use App\Models\Bank;
use App\Models\ContraTransfer;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ContraTransferController extends Controller
{
    use ScopesToBranch;

    // GET /api/acc/contra-transfers
    public function index(Request $request)
    {
        $q = ContraTransfer::query();
        $this->applyBranchScope($q, $request);

        if ($request->filled('status') && $request->status !== 'ALL') {
            $q->where('status', $request->status);
        }

        $transfers = $q->orderByDesc('date')->orderByDesc('id')->get();

        return response()->json(['transfers' => $transfers]);
    }

    // POST /api/acc/contra-transfers
    public function store(Request $request)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'from_account' => 'required|string',
            'to_account' => 'required|string|different:from_account',
            'amount' => 'required|numeric|min:0.01',
            'note' => 'nullable|string',
            'ref' => 'nullable|string',
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        $data = $this->forceBranchIdOnCreate($data, $request);

        $transfer = DB::transaction(function () use ($data, $request) {
            $last = ContraTransfer::orderByDesc('id')->first();
            $next = $last ? ((int) substr($last->transfer_no, 4)) + 1 : 513;
            $data['transfer_no'] = 'CNT-' . str_pad($next, 4, '0', STR_PAD_LEFT);
            $data['status'] = 'completed';
            $data['created_by'] = $request->user()?->id;

            $transfer = ContraTransfer::create($data);

            // move money: debit "from", credit "to" — "cash" isn't a bank row
            if ($data['from_account'] !== 'cash') {
                Bank::where('code', $data['from_account'])->first()?->adjustBalance(-$data['amount']);
            }
            if ($data['to_account'] !== 'cash') {
                Bank::where('code', $data['to_account'])->first()?->adjustBalance($data['amount']);
            }

            Voucher::recordFrom(
                'contra',
                "{$data['from_account']} ⇄ {$data['to_account']}",
                $data['to_account'],
                $data['amount'],
                $data['note'] ?? null,
                $request->user()?->id,
                $transfer
            );

            return $transfer;
        });

        return response()->json($transfer, 201);
    }

    // PATCH /api/acc/contra-transfers/{contraTransfer}/cancel
    public function cancel(Request $request, ContraTransfer $contraTransfer)
    {
        $this->denyIfOtherBranch($request, $contraTransfer->branch_id);

        if ($contraTransfer->status !== 'completed') {
            return response()->json(['message' => 'Only completed transfers can be cancelled'], 422);
        }

        DB::transaction(function () use ($contraTransfer) {
            // reverse the balances
            if ($contraTransfer->from_account !== 'cash') {
                Bank::where('code', $contraTransfer->from_account)->first()?->adjustBalance($contraTransfer->amount);
            }
            if ($contraTransfer->to_account !== 'cash') {
                Bank::where('code', $contraTransfer->to_account)->first()?->adjustBalance(-$contraTransfer->amount);
            }
            $contraTransfer->update(['status' => 'cancelled']);
        });

        return response()->json($contraTransfer);
    }
}
