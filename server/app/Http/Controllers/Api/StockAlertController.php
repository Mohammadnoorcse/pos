<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockAlertController extends Controller
{
    /** GET /stock-alerts — products at/under their alert_quantity, aggregated stock across branches (or one branch) */
    public function index(Request $request)
    {
        $branchId = $request->query('branch_id');
        $search = $request->query('search');
        $perPage = $request->integer('per_page', 25);

        // ১. Branch-specific Stock Alert Check
        if ($branchId) {
            $query = ProductStock::query()
                ->join('products', 'product_stocks.product_id', '=', 'products.id')
                ->where('product_stocks.branch_id', $branchId)
                ->whereColumn('product_stocks.quantity', '<=', 'products.alert_quantity')
                ->select([
                    'products.id',
                    'products.title',
                    'products.barcode',
                    'products.alert_quantity',
                    'product_stocks.quantity as current_stock',
                ]);

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('products.title', 'like', "%{$search}%")
                      ->orWhere('products.barcode', 'like', "%{$search}%");
                });
            }

            return response()->json($query->paginate($perPage));
        }

        // ২. Global Stock Alert Check (যদি branch_id না থাকে)
        $query = Product::query()
            ->whereNotNull('alert_quantity')
            ->whereColumn('stock_qty', '<=', 'alert_quantity')
            ->select([
                'id',
                'title',
                'barcode',
                'alert_quantity',
                'stock_qty as current_stock',
            ]);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('barcode', 'like', "%{$search}%");
            });
        }

        return response()->json($query->paginate($perPage));
    }
}
