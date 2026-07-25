<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockAlertController extends Controller
{
    /** GET /stock-alerts — products at/under their alert_quantity, aggregated stock across branches (or one branch) */
    public function index(Request $request)
    {
        $branchId = $request->integer('branch_id');

        $stockSub = DB::table('product_stocks')
            ->select('product_id', DB::raw('SUM(quantity) as current_stock'))
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->groupBy('product_id');

        $query = Product::query()
            ->joinSub($stockSub, 'stock', fn ($join) => $join->on('products.id', '=', 'stock.product_id'))
            ->whereColumn('stock.current_stock', '<=', 'products.alert_quantity')
            ->select('products.*', 'stock.current_stock');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")->orWhere('barcode', 'like', "%{$search}%");
            });
        }

        $items = $query->orderBy('stock.current_stock')->paginate($request->integer('per_page', 100));

        return response()->json($items);
    }
}
