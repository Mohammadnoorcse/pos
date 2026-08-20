<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BranchRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BranchRoleController extends Controller
{
    // Master permission catalog for branch-level roles
    public const PERMISSIONS = [
        'branch.customer.take.payment', 'branch.deliveryman', 'branch.expense', 'branch.income',
        'branch.opening.own', 'branch.supplier', 'create.product',
        'branch.customers', 'branch.damage.product', 'branch.dashboard', 'branch.hide.stock.price',
        'branch.product.purchase.price', 'branch.product.stock', 'branch.received.customer.due',
        'branch.reports', 'branch.return.product', 'branch.sell', 'branch.sell.discount',
        'branch.setting', 'stock.transfer.b2b.b2g', 'stock.transfer.g2b',
        // CRM — same permission_key strings the api.php route middleware checks
        // (see EnsurePermission), so granting these to a branch role gives that
        // branch's staff access to the CRM routes too.
        'admin.crm', 'admin.crm.sales.view', 'admin.crm.permissions.view', 'admin.crm.permissions.manage',
    ];

    public function permissionCatalog()
    {
        return response()->json(self::PERMISSIONS);
    }

    public function index(Request $request)
    {
        $query = BranchRole::with('permissions');
        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }
        return response()->json($query->orderBy('name')->paginate($request->integer('per_page', 100)));
    }

    public function store(Request $request)
    {
        $data = $request->validate(['name' => 'required|string|max:255|unique:branch_roles,name']);
        return response()->json(BranchRole::create($data), 201);
    }

    public function show(BranchRole $branchRole)
    {
        return response()->json($branchRole->load('permissions'));
    }

    public function update(Request $request, BranchRole $branchRole)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:branch_roles,name,'.$branchRole->id,
        ]);
        $branchRole->update($data);
        return response()->json($branchRole);
    }

    public function destroy(BranchRole $branchRole)
    {
        $branchRole->delete();
        return response()->json(['message' => 'Role deleted']);
    }

    /** PUT /branch-roles/{branchRole}/permissions  body: { permissions: ["branch.sell", ...] } */
    public function updatePermissions(Request $request, BranchRole $branchRole)
    {
        $data = $request->validate(['permissions' => 'required|array']);

        DB::transaction(function () use ($data, $branchRole) {
            $branchRole->permissions()->delete();
            foreach ($data['permissions'] as $key) {
                if (! in_array($key, self::PERMISSIONS, true)) {
                    continue;
                }
                $branchRole->permissions()->create(['permission_key' => $key]);
            }
        });

        return response()->json($branchRole->load('permissions'));
    }
}
