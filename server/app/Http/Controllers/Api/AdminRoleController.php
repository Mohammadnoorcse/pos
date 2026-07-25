<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminRoleController extends Controller
{
    // Master permission catalog matching the dashboard's four "wings"
    public const WINGS = [
        'Account_Wing' => [
            'account.bank.and.cash', 'account.capital', 'account.customer.report', 'account.dashboard',
            'account.expense', 'account.income.statement', 'account.indirect.income', 'account.ledger.head',
            'account.list.of.group', 'account.loan', 'account.report', 'account.statement',
            'account.transaction', 'account.vouchers', 'admin.transaction.vouchers',
        ],
        'Godown_Wing' => [
            'godown.dashboard', 'godown.stock.in.out.report', 'godown.stock.info', 'godown.stock.out',
        ],
        'Main_Wing' => [
            'admin.branch.product.stock', 'admin.crm', 'admin.damage.product', 'admin.dashboard',
        ],
        'Supplier_Wing' => [
            'supplier.dashboard', 'supplier.due.report', 'supplier.ledger', 'supplier.payment',
        ],
    ];

    public function permissionCatalog()
    {
        return response()->json(self::WINGS);
    }

    public function index(Request $request)
    {
        $query = AdminRole::with('permissions');
        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }
        return response()->json($query->orderBy('name')->paginate($request->integer('per_page', 100)));
    }

    public function store(Request $request)
    {
        $data = $request->validate(['name' => 'required|string|max:255|unique:admin_roles,name']);
        return response()->json(AdminRole::create($data), 201);
    }

    public function show(AdminRole $adminRole)
    {
        return response()->json($adminRole->load('permissions'));
    }

    public function update(Request $request, AdminRole $adminRole)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:admin_roles,name,'.$adminRole->id,
        ]);
        $adminRole->update($data);
        return response()->json($adminRole);
    }

    public function destroy(AdminRole $adminRole)
    {
        $adminRole->delete();
        return response()->json(['message' => 'Role deleted']);
    }

    /**
     * PUT /admin-roles/{adminRole}/permissions
     * body: { permissions: { "Account_Wing": ["account.dashboard", ...], "Godown_Wing": [...] } }
     */
    public function updatePermissions(Request $request, AdminRole $adminRole)
    {
        $data = $request->validate(['permissions' => 'required|array']);

        DB::transaction(function () use ($data, $adminRole) {
            $adminRole->permissions()->delete();
            foreach ($data['permissions'] as $wing => $keys) {
                if (! array_key_exists($wing, self::WINGS)) {
                    continue;
                }
                foreach ($keys as $key) {
                    if (! in_array($key, self::WINGS[$wing], true)) {
                        continue;
                    }
                    $adminRole->permissions()->create(['wing' => $wing, 'permission_key' => $key]);
                }
            }
        });

        return response()->json($adminRole->load('permissions'));
    }
}
