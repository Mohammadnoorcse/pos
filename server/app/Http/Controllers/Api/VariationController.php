<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Variation;
use App\Models\VariationValue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VariationController extends Controller
{
    public function index(Request $request)
    {
        $query = Variation::with('values');
        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }
        return response()->json($query->orderBy('name')->paginate($request->integer('per_page', 100)));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:variations,name',
            'values' => 'array',
            'values.*' => 'string|max:100',
        ]);

        $variation = DB::transaction(function () use ($data) {
            $variation = Variation::create(['name' => $data['name']]);
            foreach ($data['values'] ?? [] as $value) {
                $variation->values()->create(['value' => $value]);
            }
            return $variation;
        });

        return response()->json($variation->load('values'), 201);
    }

    public function show(Variation $variation)
    {
        return response()->json($variation->load('values'));
    }

    public function update(Request $request, Variation $variation)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:variations,name,'.$variation->id,
            'values' => 'array',
            'values.*' => 'string|max:100',
        ]);

        DB::transaction(function () use ($data, $variation) {
            $variation->update(['name' => $data['name']]);
            if (isset($data['values'])) {
                $variation->values()->delete();
                foreach ($data['values'] as $value) {
                    $variation->values()->create(['value' => $value]);
                }
            }
        });

        return response()->json($variation->load('values'));
    }

    public function destroy(Variation $variation)
    {
        $variation->delete();
        return response()->json(['message' => 'Variation deleted']);
    }
}
