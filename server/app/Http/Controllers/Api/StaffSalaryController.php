<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StaffSalaryPayment;
use App\Models\User;
use Illuminate\Http\Request;

class StaffSalaryController extends Controller
{
    /** GET /staff-salary-payments?user_id=&branch_id=&month=YYYY-MM */
    public function index(Request $request)
    {
        $query = StaffSalaryPayment::with(['staff.branch', 'createdBy']);

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        if ($request->filled('branch_id')) {
            $query->whereHas('staff', fn ($q) => $q->where('branch_id', $request->branch_id));
        }
        if ($request->filled('month')) {
            $query->whereDate('for_month', date('Y-m-01', strtotime($request->month)));
        }

        return response()->json(
            $query->orderByDesc('for_month')->orderByDesc('paid_on')
                ->paginate($request->integer('per_page', 100))
        );
    }

    /** POST /staff-salary-payments  body: { user_id, amount, for_month, paid_on, note } */
    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:0',
            'for_month' => 'required|date',
            'paid_on' => 'required|date',
            'note' => 'nullable|string|max:255',
        ]);

        $staff = User::findOrFail($data['user_id']);
        if (! in_array($staff->user_type, ['admin', 'branch'], true)) {
            return response()->json(['message' => 'Salary payments can only be recorded for admin/branch staff.'], 422);
        }

        $data['for_month'] = date('Y-m-01', strtotime($data['for_month']));
        $data['created_by'] = $request->user()->id;

        $payment = StaffSalaryPayment::create($data);

        return response()->json($payment->load(['staff.branch', 'createdBy']), 201);
    }

    /** DELETE /staff-salary-payments/{staffSalaryPayment} */
    public function destroy(StaffSalaryPayment $staffSalaryPayment)
    {
        $staffSalaryPayment->delete();

        return response()->json(['message' => 'Salary payment record deleted']);
    }
}
