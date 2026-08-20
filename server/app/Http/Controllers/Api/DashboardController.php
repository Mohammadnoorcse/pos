<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\CashFlowEntry;
use App\Models\Expense;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SaleReturn;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    /** Shared date-range resolver: ?date=YYYY-MM-DD or ?from=&to= */
    protected function resolveRange(Request $request): array
    {
        if ($request->filled('from') || $request->filled('to')) {
            $from = $request->filled('from') ? Carbon::parse($request->from)->startOfDay() : Carbon::today();
            $to = $request->filled('to') ? Carbon::parse($request->to)->endOfDay() : Carbon::today()->endOfDay();
            return [$from, $to];
        }
        $date = $request->filled('date') ? Carbon::parse($request->date) : Carbon::today();
        return [$date->copy()->startOfDay(), $date->copy()->endOfDay()];
    }

 

/** GET /dashboard/kpis?branch_id=&date=  OR  ?branch_id=&from=&to= */
public function kpis(Request $request)
{
    $branchId = $request->integer('branch_id');
    [$from, $to] = $this->resolveRange($request); // reuse the helper already added

    $sales = Sale::whereBetween('sale_date', [$from->toDateString(), $to->toDateString()])
        ->when($branchId, fn ($q) => $q->where('branch_id', $branchId));

    $totalSales = (clone $sales)->sum('total');
    $paid = (clone $sales)->sum('paid');
    $due = (clone $sales)->sum('due');
    $txnCount = (clone $sales)->count();

    $expense = Expense::whereBetween('expense_date', [$from->toDateString(), $to->toDateString()])
        ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))->sum('amount');

    $returns = SaleReturn::whereBetween('return_date', [$from->toDateString(), $to->toDateString()])
        ->when($branchId, fn ($q) => $q->whereHas('sale', fn ($s) => $s->where('branch_id', $branchId)))
        ->sum('amount');

    $payments = Payment::whereBetween('paid_date', [$from->toDateString(), $to->toDateString()])
        ->when($branchId, fn ($q) => $q->where('branch_id', $branchId));

    $income = (clone $payments)->where('type', 'income')->sum('amount');
    $duePaid = (clone $payments)->where('type', 'due_collection')->sum('amount');
    $totalPayment = (clone $payments)->sum('amount');

    $lowStock = Product::query()
        ->whereRaw('(select coalesce(sum(quantity),0) from product_stocks where product_stocks.product_id = products.id'
            .($branchId ? ' and product_stocks.branch_id = '.(int) $branchId : '').') <= products.alert_quantity')
        ->count();

    return response()->json([
        'total_sales' => round((float) $totalSales, 2),
        'instant_paid' => round((float) $paid, 2),
        'total_expense' => round((float) $expense, 2),
        'due_paid' => round((float) $duePaid, 2),
        'total_return' => round((float) $returns, 2),
        'total_payment' => round((float) $totalPayment, 2),
        'stock_alert_qty' => $lowStock,
        'total_income' => round((float) $income, 2),
        'total_due' => round((float) $due, 2),
        'transaction_count' => $txnCount,
    ]);
}

    /** GET /dashboard/sales-trend?branch_id=&days=7 */
    public function salesTrend(Request $request)
    {
        $days = $request->integer('days', 7);
        $branchId = $request->integer('branch_id');
        $start = Carbon::today()->subDays($days - 1);

        $rows = Sale::selectRaw('sale_date, SUM(total) as sales')
            ->whereDate('sale_date', '>=', $start)
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->groupBy('sale_date')
            ->orderBy('sale_date')
            ->get()
            ->keyBy(fn ($r) => Carbon::parse($r->sale_date)->toDateString());

        $result = [];
        for ($i = 0; $i < $days; $i++) {
            $day = $start->copy()->addDays($i);
            $key = $day->toDateString();
            $result[] = [
                'date' => $key,
                'sales' => isset($rows[$key]) ? round((float) $rows[$key]->sales, 2) : 0,
            ];
        }

        return response()->json($result);
    }

    /** GET /dashboard/recent-transactions?branch_id=&limit=10 */
    public function recentTransactions(Request $request)
    {
        $sales = Sale::with(['customer', 'branch'])
            ->when($request->integer('branch_id'), fn ($q, $branchId) => $q->where('branch_id', $branchId))
            ->orderByDesc('id')
            ->limit($request->integer('limit', 10))
            ->get()
            ->map(fn ($s) => [
                'invoice' => $s->invoice_no,
                'customer' => $s->customer?->name ?? 'Walk-in',
                'branch' => $s->branch?->name,
                'status' => $s->status,
                'amount' => $s->total,
                'date' => $s->sale_date,
            ]);

        return response()->json($sales);
    }

    /** GET /dashboard/top-products?branch_id=&date=&limit=5 */
    public function topProducts(Request $request)
    {
        [$from, $to] = $this->resolveRange($request);
        $branchId = $request->integer('branch_id');
        $limit = $request->integer('limit', 5);

        $rows = SaleItem::query()
            ->selectRaw('product_id, SUM(quantity) as qty, SUM(total) as revenue')
            ->whereHas('sale', function ($q) use ($from, $to, $branchId) {
                $q->whereBetween('sale_date', [$from->toDateString(), $to->toDateString()])
                    ->when($branchId, fn ($qq) => $qq->where('branch_id', $branchId));
            })
            ->groupBy('product_id')
            ->orderByDesc('revenue')
            ->limit($limit)
            ->with('product:id,title')
            ->get()
            ->map(fn ($r) => [
                'id' => $r->product_id,
                'name' => $r->product->title ?? 'Unknown',
                'sold' => (int) $r->qty,
                'revenue' => round((float) $r->revenue, 2),
            ]);

        return response()->json($rows);
    }

    /** GET /dashboard/payment-breakdown?branch_id=&date= */
    public function paymentBreakdown(Request $request)
    {
        [$from, $to] = $this->resolveRange($request);
        $branchId = $request->integer('branch_id');

        $rows = Payment::query()
            ->selectRaw('account, SUM(amount) as amount')
            ->whereBetween('paid_date', [$from->toDateString(), $to->toDateString()])
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->groupBy('account')
            ->get()
            ->map(function ($r) {
                $account = $r->account ?: 'cash';
                return [
                    'id' => $account,
                    'label' => $account === 'cash' ? 'Cash' : $account,
                    'amount' => round((float) $r->amount, 2),
                ];
            });

        return response()->json($rows);
    }

    /** GET /dashboard/staff-performance?branch_id=&date=&limit=10 */
    public function staffPerformance(Request $request)
    {
        [$from, $to] = $this->resolveRange($request);
        $branchId = $request->integer('branch_id');
        $limit = $request->integer('limit', 10);

        $rows = Sale::query()
            ->selectRaw('created_by, SUM(total) as sales, COUNT(*) as txns')
            ->whereBetween('sale_date', [$from->toDateString(), $to->toDateString()])
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->whereNotNull('created_by')
            ->groupBy('created_by')
            ->orderByDesc('sales')
            ->limit($limit)
            ->with('creator:id,name,user_type')
            ->get()
            ->map(fn ($r) => [
                'id' => $r->created_by,
                'name' => $r->creator->name ?? 'Unknown',
                'role' => $r->creator->user_type ?? '—',
                'sales' => round((float) $r->sales, 2),
                'txns' => (int) $r->txns,
            ]);

        return response()->json($rows);
    }

    /** GET /dashboard/category-sales?branch_id=&date= */
    public function categorySales(Request $request)
    {
        [$from, $to] = $this->resolveRange($request);
        $branchId = $request->integer('branch_id');

        $rows = SaleItem::query()
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->selectRaw('categories.id as category_id, categories.name as label, SUM(sale_items.total) as value')
            ->whereBetween('sales.sale_date', [$from->toDateString(), $to->toDateString()])
            ->when($branchId, fn ($q) => $q->where('sales.branch_id', $branchId))
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('value')
            ->get()
            ->map(fn ($r) => [
                'id' => $r->category_id,
                'label' => $r->label,
                'value' => round((float) $r->value, 2),
            ]);

        return response()->json($rows);
    }

    /** GET /dashboard/expenses-today?branch_id=&date= */
    public function expensesToday(Request $request)
    {
        $date = $request->filled('date') ? Carbon::parse($request->date) : Carbon::today();
        $branchId = $request->integer('branch_id');

        $expenses = Expense::whereDate('expense_date', $date)
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->orderByDesc('id')
            ->get(['id', 'title', 'category', 'amount']);

        return response()->json([
            'expenses' => $expenses->map(fn ($e) => [
                'id' => $e->id,
                'label' => $e->title ?: $e->category,
                'amount' => round((float) $e->amount, 2),
            ]),
            'total' => round((float) $expenses->sum('amount'), 2),
        ]);
    }

    /** GET /dashboard/branch-comparison?date= */
    public function branchComparison(Request $request)
    {
        [$from, $to] = $this->resolveRange($request);

        $rows = Branch::query()
            ->where('type', 'shop')
            ->get(['id', 'name'])
            ->map(function ($branch) use ($from, $to) {
                $agg = Sale::whereBetween('sale_date', [$from->toDateString(), $to->toDateString()])
                    ->where('branch_id', $branch->id)
                    ->selectRaw('COALESCE(SUM(total),0) as sales, COUNT(*) as txns')
                    ->first();

                return [
                    'id' => $branch->id,
                    'name' => $branch->name,
                    'sales' => round((float) $agg->sales, 2),
                    'txns' => (int) $agg->txns,
                ];
            })
            ->sortByDesc('sales')
            ->values();

        return response()->json($rows);
    }

    /**
     * GET /dashboard/cash-summary?branch_id=&date=
     * Auto-derived cash movement (sales, deposits, withdrawals/expenses).
     * Opening balance & the physically-counted closing figure aren't tracked
     * anywhere yet (no till/session model) — the frontend should keep those
     * as a manual entry per shift until a CashSession model exists.
     */
    public function cashSummary(Request $request)
    {
        $date = $request->filled('date') ? Carbon::parse($request->date) : Carbon::today();
        $branchId = $request->integer('branch_id');

        $cashSales = Payment::whereDate('paid_date', $date)
            ->where('account', 'cash')
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->sum('amount');

        $cashIn = CashFlowEntry::whereDate('date', $date)
            ->where('type', 'in')->where('source', 'cash')
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->sum('amount');

        $cashOutFlow = CashFlowEntry::whereDate('date', $date)
            ->where('type', 'out')->where('source', 'cash')
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->sum('amount');

        $cashExpense = Expense::whereDate('expense_date', $date)
            ->where('account', 'cash')
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->sum('amount');

        return response()->json([
            'cash_sales' => round((float) $cashSales, 2),
            'cash_in' => round((float) $cashIn, 2),
            'cash_out' => round((float) ($cashOutFlow + $cashExpense), 2),
            // opening/actual closing: not modeled server-side yet, client enters manually
        ]);
    }

    /** GET /dashboard/activity-feed?branch_id=&limit=10 */
    public function activityFeed(Request $request)
    {
        $branchId = $request->integer('branch_id');
        $limit = $request->integer('limit', 10);

        $sales = Sale::with('customer')
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->latest('id')->limit($limit)->get()
            ->map(fn ($s) => [
                'type' => 'sale',
                'text' => "Invoice {$s->invoice_no} generated for ".($s->customer?->name ?? 'Walk-in'),
                'at' => $s->created_at,
            ]);

        $collections = Payment::with('customer')
            ->where('type', 'due_collection')
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->latest('id')->limit($limit)->get()
            ->map(fn ($p) => [
                'type' => 'collection',
                'text' => round((float) $p->amount, 2)." due collected from ".($p->customer?->name ?? 'Customer'),
                'at' => $p->created_at,
            ]);

        $feed = $sales->concat($collections)
            ->sortByDesc('at')
            ->take($limit)
            ->values()
            ->map(fn ($item, $i) => [
                'id' => $i + 1,
                'text' => $item['text'],
                'time' => optional($item['at'])->diffForHumans(),
            ]);

        return response()->json($feed);
    }
}
