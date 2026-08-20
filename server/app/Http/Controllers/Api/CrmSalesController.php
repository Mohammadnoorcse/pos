<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class CrmSalesController extends Controller
{
    /**
     * GET /crm/summary?branch_id=
     * Quick totals: today, this month, this year, all-time.
     */
    public function summary(Request $request)
    {
        $branchId = $request->integer('branch_id');

        $today = Carbon::today();
        $monthStart = Carbon::today()->startOfMonth();
        $monthEnd = Carbon::today()->endOfMonth();
        $yearStart = Carbon::today()->startOfYear();
        $yearEnd = Carbon::today()->endOfYear();

        $base = fn () => Sale::query()->when($branchId, fn ($q) => $q->where('branch_id', $branchId));

        $agg = function ($from, $to) use ($base) {
            $row = (clone $base())
                ->whereBetween('sale_date', [$from->toDateString(), $to->toDateString()])
                ->selectRaw('COALESCE(SUM(total),0) as total, COUNT(*) as txns, COALESCE(SUM(due),0) as due')
                ->first();

            return [
                'total' => round((float) $row->total, 2),
                'txns' => (int) $row->txns,
                'due' => round((float) $row->due, 2),
            ];
        };

        $allTimeRow = $base()->selectRaw('COALESCE(SUM(total),0) as total, COUNT(*) as txns')->first();

        return response()->json([
            'today' => $agg($today, $today),
            'this_month' => $agg($monthStart, $monthEnd),
            'this_year' => $agg($yearStart, $yearEnd),
            'all_time' => [
                'total' => round((float) $allTimeRow->total, 2),
                'txns' => (int) $allTimeRow->txns,
            ],
        ]);
    }

    /**
     * GET /crm/sold-products?range=today|month|year|all|custom&from=&to=&branch_id=&search=&per_page=
     * Product-wise list of what's being sold, with qty & revenue, in the chosen range.
     */
    public function soldProducts(Request $request)
    {
        [$from, $to] = $this->resolveRange($request);
        $branchId = $request->integer('branch_id');
        $search = $request->input('search');

        $query = SaleItem::query()
            ->selectRaw('sale_items.product_id, SUM(sale_items.quantity) as qty, SUM(sale_items.total) as revenue, COUNT(DISTINCT sale_items.sale_id) as invoices')
            ->whereHas('sale', function ($q) use ($from, $to, $branchId) {
                $q->whereBetween('sale_date', [$from->toDateString(), $to->toDateString()])
                    ->when($branchId, fn ($qq) => $qq->where('branch_id', $branchId));
            })
            ->when($search, function ($q) use ($search) {
                $q->whereHas('product', fn ($qq) => $qq->where('title', 'like', "%{$search}%"));
            })
            ->groupBy('sale_items.product_id')
            ->orderByDesc('revenue')
            ->with('product:id,title,selling_price,category_id')
            ->with('product.category:id,name');

        $perPage = $request->integer('per_page', 20);
        $paginated = $query->paginate($perPage);

        $paginated->getCollection()->transform(function ($r) {
            return [
                'product_id' => $r->product_id,
                'name' => $r->product->title ?? 'Unknown',
                'category' => $r->product->category->name ?? '—',
                'qty_sold' => (int) $r->qty,
                'revenue' => round((float) $r->revenue, 2),
                'invoices' => (int) $r->invoices,
            ];
        });

        return response()->json($paginated);
    }

    /**
     * GET /crm/sales-list?range=today|month|year|all|custom&from=&to=&branch_id=&search=&per_page=
     * Invoice-level list: who sold, to whom, when, how much.
     */
    public function salesList(Request $request)
    {
        [$from, $to] = $this->resolveRange($request);
        $branchId = $request->integer('branch_id');
        $search = $request->input('search');

        $query = Sale::query()
            ->with(['customer:id,name,phone', 'branch:id,name', 'creator:id,name'])
            ->whereBetween('sale_date', [$from->toDateString(), $to->toDateString()])
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->when($search, function ($q) use ($search) {
                $q->where(function ($qq) use ($search) {
                    $qq->where('invoice_no', 'like', "%{$search}%")
                        ->orWhereHas('customer', fn ($c) => $c->where('name', 'like', "%{$search}%"));
                });
            })
            ->orderByDesc('id');

        $perPage = $request->integer('per_page', 20);
        $paginated = $query->paginate($perPage);

        $paginated->getCollection()->transform(fn ($s) => [
            'id' => $s->id,
            'invoice_no' => $s->invoice_no,
            'customer' => $s->customer?->name ?? 'Walk-in',
            'branch' => $s->branch?->name,
            'sold_by' => $s->creator?->name ?? '—',
            'total' => round((float) $s->total, 2),
            'paid' => round((float) $s->paid, 2),
            'due' => round((float) $s->due, 2),
            'status' => $s->status,
            'sale_date' => $s->sale_date,
        ]);

        return response()->json($paginated);
    }

    /** Shared date-range resolver: ?range=today|month|year|all  OR  ?from=&to= */
    protected function resolveRange(Request $request): array
    {
        if ($request->filled('from') || $request->filled('to')) {
            $from = $request->filled('from') ? Carbon::parse($request->from)->startOfDay() : Carbon::today()->startOfDay();
            $to = $request->filled('to') ? Carbon::parse($request->to)->endOfDay() : Carbon::today()->endOfDay();
            return [$from, $to];
        }

        $range = $request->input('range', 'today');

        return match ($range) {
            'month' => [Carbon::today()->startOfMonth(), Carbon::today()->endOfMonth()],
            'year' => [Carbon::today()->startOfYear(), Carbon::today()->endOfYear()],
            'all' => [Carbon::createFromDate(2000, 1, 1), Carbon::today()->endOfDay()],
            default => [Carbon::today(), Carbon::today()->endOfDay()],
        };
    }
}
