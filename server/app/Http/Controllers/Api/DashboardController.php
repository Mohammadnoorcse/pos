<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleReturn;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    /** GET /dashboard/kpis?branch_id=&date= */
    public function kpis(Request $request)
    {
        $date = $request->filled('date') ? Carbon::parse($request->date) : Carbon::today();
        $branchId = $request->integer('branch_id');

        $sales = Sale::whereDate('sale_date', $date)
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId));

        $totalSales = (clone $sales)->sum('total');
        $paid = (clone $sales)->sum('paid');
        $due = (clone $sales)->sum('due');

        $expense = Expense::whereDate('expense_date', $date)
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))->sum('amount');

        $returns = SaleReturn::whereDate('return_date', $date)
            ->when($branchId, fn ($q) => $q->whereHas('sale', fn ($s) => $s->where('branch_id', $branchId)))
            ->sum('amount');

        $payments = Payment::whereDate('paid_date', $date)
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
            ]);

        return response()->json($sales);
    }
}
