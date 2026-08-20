<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    /**
     * GET /staff?branch_id=&user_type=&search=
     * শুধু staff (owner ব্যতীত) — branch অনুযায়ী কতজন আছে সেটা branch_id দিয়ে ফিল্টার করা যায়।
     */
    public function index(Request $request)
    {
        $query = User::with(['branch', 'adminRole', 'branchRole'])
            ->whereIn('user_type', ['admin', 'branch']);

        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }
        if ($request->filled('user_type')) {
            $query->where('user_type', $request->user_type);
        }
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                  ->orWhere('email', 'like', '%'.$request->search.'%')
                  ->orWhere('phone', 'like', '%'.$request->search.'%');
            });
        }

        return response()->json(
            $query->orderBy('branch_id')->orderBy('name')->paginate($request->integer('per_page', 100))
        );
    }

    /** GET /staff/{staff} — full details + salary payment history */
    public function show(User $staff)
    {
        $staff->load(['branch', 'adminRole', 'branchRole', 'salaryPayments' => function ($q) {
            $q->orderByDesc('for_month')->orderByDesc('paid_on');
        }]);

        return response()->json($staff);
    }

    /** PUT /staff/{staff} — employment/contact details only (not credentials/role) */
    public function update(Request $request, User $staff)
    {
        $data = $request->validate([
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
            'joining_date' => 'nullable|date',
            'monthly_salary' => 'nullable|numeric|min:0',
        ]);

        $staff->update($data);

        return response()->json($staff->fresh(['branch', 'adminRole', 'branchRole']));
    }
}
