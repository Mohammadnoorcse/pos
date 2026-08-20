<?php

namespace App\Http\Controllers\Api\Supplier;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;

use App\Models\SupplierPayment;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;


class SupplierController extends Controller
{
     /**
     * GET /api/suppliers
     * List all suppliers (for directory table / dropdowns).
     */
    public function index(Request $request)
    {
        $query = Supplier::query()->withSum('purchases as total_due_sum', 'due');

        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->integer('branch_id'));
        }
 
        if ($request->filled('search')) {
            $s = $request->string('search');
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('company', 'like', "%{$s}%")
                  ->orWhere('phone', 'like', "%{$s}%");
            });
        }
 
        $suppliers = $query->orderBy('name')->paginate($request->integer('per_page', 100));
 
        $suppliers->getCollection()->transform(fn (Supplier $s) => $this->formatSupplierRow($s));
 
        return response()->json($suppliers);
    }
 
    /**
     * GET /api/suppliers/{supplier}
     */
    public function show(Supplier $supplier)
    {
        $supplier->load(['branch']);
 
        return response()->json([
            'id' => $supplier->id,
            'name' => $supplier->name,
            'company' => $supplier->company,
            'phone' => $supplier->phone,
            'address' => $supplier->address,
            'branch_id' => $supplier->branch_id,
            'is_active' => $supplier->is_active,
            'due' => $supplier->totalDue(),
            'purchases' => $supplier->purchases()->latest('purchase_date')->limit(20)->get(),
            'payments' => $supplier->payments()->latest('paid_date')->limit(20)->get(),
        ]);
    }
 
    /**
     * POST /api/suppliers
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:30',
            'address' => 'nullable|string|max:255',
            'branch_id' => 'nullable|exists:branches,id',
        ]);
 
        $supplier = Supplier::create($data);
 
        return response()->json($supplier, 201);
    }
 
    /**
     * PUT/PATCH /api/suppliers/{supplier}
     */
    public function update(Request $request, Supplier $supplier)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'company' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:30',
            'address' => 'nullable|string|max:255',
            'branch_id' => 'nullable|exists:branches,id',
            'is_active' => 'sometimes|boolean',
        ]);
 
        $supplier->update($data);
 
        return response()->json($supplier);
    }
 
    /**
     * DELETE /api/suppliers/{supplier}
     */
    public function destroy(Supplier $supplier)
    {
        if ($supplier->purchases()->exists() || $supplier->payments()->exists()) {
            return response()->json([
                'message' => 'Cannot delete supplier with existing purchases or payments.',
            ], 422);
        }
 
        $supplier->delete();
 
        return response()->json(['message' => 'Supplier deleted.']);
    }
 
    /**
     * GET /api/suppliers/dashboard
     *
     * Single endpoint that returns everything SupplierDashboardPage.jsx needs:
     * hero stats, monthly purchase-vs-paid (6 months), top due suppliers,
     * recent payments, and the full supplier directory.
     */
   /**
     * GET /api/suppliers/dashboard
     * Params: branch_id, start_date, end_date
     */
    public function dashboard(Request $request)
    {
        $branchId  = $request->input('branch_id');
        $startDate = $request->input('start_date'); // format: YYYY-MM-DD
        $endDate   = $request->input('end_date');   // format: YYYY-MM-DD

        // 1. Total Supplier Count
        $supplierQuery = Supplier::query()->when($branchId, fn ($q) => $q->where('branch_id', $branchId));
        $supplierCount = $supplierQuery->count();

        // 2. Full Supplier List with Lifetime Outstanding Due
        $suppliers = Supplier::query()
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->withSum('purchases as due_sum', 'due')
            ->get()
            ->map(fn (Supplier $s) => $this->formatSupplierRow($s));

        $totalLifetimeDue  = (float) $suppliers->sum('due');
        $outstandingCount = $suppliers->where('due', '>', 0)->count();

        // -------------------------------------------------------------
        // DATE-FILTERED STATS (Purchase, Due, Payment, Return)
        // -------------------------------------------------------------

        // A. Total Purchases in Date Range
        $totalPurchase = (float) DB::table('purchases')
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->when($startDate, fn ($q) => $q->whereDate('purchase_date', '>=', $startDate))
            ->when($endDate, fn ($q) => $q->whereDate('purchase_date', '<=', $endDate))
            ->sum('total');

        // B. Total Due created in Date Range
        $totalDueInPeriod = (float) DB::table('purchases')
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->when($startDate, fn ($q) => $q->whereDate('purchase_date', '>=', $startDate))
            ->when($endDate, fn ($q) => $q->whereDate('purchase_date', '<=', $endDate))
            ->sum('due');

        // C. Total Supplier Payments in Date Range
        $totalPaid = (float) DB::table('supplier_payments')
            ->when($branchId, function ($q) use ($branchId) {
                $q->whereIn('purchase_id', function ($sub) use ($branchId) {
                    $sub->select('id')->from('purchases')->where('branch_id', $branchId);
                });
            })
            ->when($startDate, fn ($q) => $q->whereDate('paid_date', '>=', $startDate))
            ->when($endDate, fn ($q) => $q->whereDate('paid_date', '<=', $endDate))
            ->sum('amount');

        // D. Total Purchase Returns in Date Range
        $totalReturn = (float) DB::table('purchase_returns')
            ->when($branchId, function ($q) use ($branchId) {
                $q->whereIn('purchase_id', function ($sub) use ($branchId) {
                    $sub->select('id')->from('purchases')->where('branch_id', $branchId);
                });
            })
            ->when($startDate, fn ($q) => $q->whereDate('return_date', '>=', $startDate))
            ->when($endDate, fn ($q) => $q->whereDate('return_date', '<=', $endDate))
            ->sum('total_amount'); // আপনার টেবিলের কলামের নাম 'amount' হলে 'amount' দিন

        // -------------------------------------------------------------

        // Recent Payments (Filtered by date if requested)
        $recentPayments = SupplierPayment::query()
            ->with('supplier:id,name')
            ->when($branchId, function ($q) use ($branchId) {
                $q->whereHas('purchase', fn ($p) => $p->where('branch_id', $branchId));
            })
            ->when($startDate, fn ($q) => $q->whereDate('paid_date', '>=', $startDate))
            ->when($endDate, fn ($q) => $q->whereDate('paid_date', '<=', $endDate))
            ->latest('paid_date')
            ->limit(10)
            ->get()
            ->map(fn (SupplierPayment $p) => [
                'id' => $p->payment_no ?? "PAY-{$p->id}",
                'supplier' => $p->supplier?->name,
                'date' => $p->paid_date ? Carbon::parse($p->paid_date)->format('d-m-Y') : null,
                'method' => $p->method,
                'amount' => (float) $p->amount,
            ]);

        // Purchase vs paid for the last 6 months
        $monthly = $this->lastSixMonthsPurchaseVsPaid($branchId);

        return response()->json([
            'supplier_count'        => $supplierCount,
            'outstanding_count'     => $outstandingCount,
            
            // Filtered Summary Cards (নির্দিষ্ট ডেট ফিল্টার অনুযায়ী)
            'total_purchase'        => $totalPurchase,
            'total_due_in_period'   => $totalDueInPeriod,
            'total_paid'            => $totalPaid,
            'total_return'          => $totalReturn,
            'total_lifetime_due'    => $totalLifetimeDue, // সর্বমোট বাকি

            'top_due_suppliers'     => $suppliers->sortByDesc('due')->values(),
            'recent_payments'       => $recentPayments,
            'monthly'               => $monthly,
            'suppliers'             => $suppliers->values(),
        ]);
    }

    private function formatSupplierRow(Supplier $supplier): array
    {
        $lastPayment = $supplier->relationLoaded('payments')
            ? $supplier->payments->sortByDesc('paid_date')->first()
            : $supplier->payments()->latest('paid_date')->first();

        return [
            'id' => $supplier->id,
            'name' => $supplier->name,
            'company' => $supplier->company,
            'phone' => $supplier->phone,
            'due' => (float) ($supplier->due_sum ?? $supplier->total_due_sum ?? $supplier->totalDue()),
            'last_payment' => $lastPayment?->paid_date ? Carbon::parse($lastPayment->paid_date)->format('d-m-Y') : null,
            'trend' => ($supplier->due_sum ?? 0) > 0 ? 'up' : 'down',
        ];
    }

    private function lastSixMonthsPurchaseVsPaid(?int $branchId): array
    {
        $months = collect(range(5, 0))->map(fn ($i) => now()->subMonths($i));

        return $months->map(function (Carbon $month) use ($branchId) {
            $purchaseTotal = DB::table('purchases')
                ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
                ->whereYear('purchase_date', $month->year)
                ->whereMonth('purchase_date', $month->month)
                ->sum('total');

            $paidTotal = DB::table('supplier_payments')
                ->when($branchId, function ($q) use ($branchId) {
                    $q->whereIn('purchase_id', function ($sub) use ($branchId) {
                        $sub->select('id')->from('purchases')->where('branch_id', $branchId);
                    });
                })
                ->whereYear('paid_date', $month->year)
                ->whereMonth('paid_date', $month->month)
                ->sum('amount');

            return [
                'label' => $month->format('M'),
                'purchase' => (float) $purchaseTotal,
                'paid' => (float) $paidTotal,
            ];
        })->values()->all();
    }
}