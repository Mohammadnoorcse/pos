<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CrmPermission;
use Illuminate\Http\Request;

class CrmPermissionController extends Controller
{
    public function index(Request $request)
    {
        $query = CrmPermission::query();
        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }
        return response()->json($query->orderBy('name')->paginate($request->integer('per_page', 100)));
    }

    public function store(Request $request)
    {
        $data = $request->validate(['name' => 'required|string|max:255|unique:crm_permissions,name']);
        return response()->json(CrmPermission::create($data), 201);
    }

    public function update(Request $request, CrmPermission $crmPermission)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:crm_permissions,name,'.$crmPermission->id,
        ]);
        $crmPermission->update($data);
        return response()->json($crmPermission);
    }

    public function destroy(CrmPermission $crmPermission)
    {
        $crmPermission->delete();
        return response()->json(['message' => 'CRM permission deleted']);
    }
}
