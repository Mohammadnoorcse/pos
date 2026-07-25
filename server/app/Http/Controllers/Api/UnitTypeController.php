<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UnitType;
use Illuminate\Http\Request;

class UnitTypeController extends Controller
{
    public function index(Request $request)
    {
        $query = UnitType::query();
        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }
        return response()->json($query->orderBy('name')->paginate($request->integer('per_page', 100)));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:unit_types,name',
            'short' => 'nullable|string|max:20',
        ]);
        return response()->json(UnitType::create($data), 201);
    }

    public function show(UnitType $unitType)
    {
        return response()->json($unitType);
    }

    public function update(Request $request, UnitType $unitType)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:unit_types,name,'.$unitType->id,
            'short' => 'nullable|string|max:20',
        ]);
        $unitType->update($data);
        return response()->json($unitType);
    }

    public function destroy(UnitType $unitType)
    {
        $unitType->delete();
        return response()->json(['message' => 'Unit type deleted']);
    }
}
