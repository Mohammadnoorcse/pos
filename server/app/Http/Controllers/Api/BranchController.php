<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function index(Request $request)
    {
        $query = Branch::query();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        return response()->json($query->orderBy('name')->paginate($request->integer('per_page', 50)));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'type' => 'required|in:shop,godown',
            'phone' => 'nullable|string|max:50',
        ]);

        $branch = Branch::create($data);

        return response()->json($branch, 201);
    }

    public function show(Branch $branch)
    {
        return response()->json($branch);
    }

    public function update(Request $request, Branch $branch)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'address' => 'nullable|string|max:500',
            'type' => 'sometimes|required|in:shop,godown',
            'phone' => 'nullable|string|max:50',
            'is_active' => 'boolean',
        ]);

        $branch->update($data);

        return response()->json($branch);
    }

    public function destroy(Branch $branch)
    {
        $branch->delete();
        return response()->json(['message' => 'Branch deleted']);
    }
}
