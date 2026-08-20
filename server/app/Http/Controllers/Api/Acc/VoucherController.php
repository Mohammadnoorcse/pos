<?php

namespace App\Http\Controllers\Api\Acc;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\ScopesToBranch;
use App\Models\Voucher;
use Illuminate\Http\Request;

class VoucherController extends Controller
{
    use ScopesToBranch;

    // GET /api/acc/vouchers?type=payment|receipt|journal|contra
    public function index(Request $request)
    {
        $q = Voucher::with('preparer');
        $this->applyBranchScope($q, $request);

        if ($request->filled('type') && $request->type !== 'ALL') $q->where('type', $request->type);
        if ($request->filled('account') && $request->account !== 'ALL') $q->where('account', $request->account);
        if ($request->filled('from')) $q->whereDate('date', '>=', $request->from);
        if ($request->filled('to')) $q->whereDate('date', '<=', $request->to);
        if ($request->filled('search')) {
            $s = $request->search;
            $q->where(function ($w) use ($s) {
                $w->where('party', 'like', "%{$s}%")
                  ->orWhere('voucher_no', 'like', "%{$s}%")
                  ->orWhere('narration', 'like', "%{$s}%");
            });
        }

        $vouchers = $q->orderByDesc('date')->orderByDesc('id')->get();

        return response()->json(['vouchers' => $vouchers]);
    }

    // POST /api/acc/vouchers — manual voucher (e.g. Journal voucher entries)
    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|in:payment,receipt,journal,contra',
            'party' => 'required|string',
            'account' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
            'narration' => 'nullable|string',
            'date' => 'nullable|date',
        ]);

        $voucher = Voucher::recordFrom(
            $data['type'],
            $data['party'],
            $data['account'],
            $data['amount'],
            $data['narration'] ?? null,
            $request->user()?->id
        );

        if (!empty($data['date'])) {
            $voucher->update(['date' => $data['date']]);
        }

        return response()->json($voucher, 201);
    }
}
