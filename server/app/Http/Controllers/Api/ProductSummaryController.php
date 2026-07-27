<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\SaleItem;
use App\Models\ReturnItem;
use App\Models\ProductDamage;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ProductSummaryController extends Controller
{
    public function index(Request $request)
    {
        $branchId = $request->input('branch_id');
        $range = $request->input('range', 'this_month');
        $search = $request->input('search');

        // ১. ডেট রেঞ্জ ফিল্টার নির্ধারণ
        $startDate = match ($range) {
            'today' => Carbon::today(),
            'this_week' => Carbon::now()->startOfWeek(),
            'this_year' => Carbon::now()->startOfYear(),
            default => Carbon::now()->startOfMonth(), // this_month
        };
        $endDate = Carbon::now()->endOfDay();

        // ২. ব্র্যাঞ্চ তালিকা
        $branches = Branch::select('id', 'name')->get();

        // ৩. শাখা অনুযায়ী সামারি (Branch-wise Sales, Return, Damage)
        $branchSummaryQuery = Branch::query();
        if ($branchId) {
            $branchSummaryQuery->where('id', $branchId);
        }

        $branchSummary = $branchSummaryQuery->get()->map(function ($branch) use ($startDate, $endDate) {
            $soldQty = SaleItem::whereHas('sale', fn($q) => $q->where('branch_id', $branch->id)->whereBetween('created_at', [$startDate, $endDate]))->sum('quantity');
            $soldValue = SaleItem::whereHas('sale', fn($q) => $q->where('branch_id', $branch->id)->whereBetween('created_at', [$startDate, $endDate]))->sum('total_price');

            $returnedQty = ReturnItem::whereHas('return', fn($q) => $q->where('branch_id', $branch->id)->whereBetween('created_at', [$startDate, $endDate]))->sum('quantity');
            $returnedValue = ReturnItem::whereHas('return', fn($q) => $q->where('branch_id', $branch->id)->whereBetween('created_at', [$startDate, $endDate]))->sum('amount');

            $damagedQty = ProductDamage::where('branch_id', $branch->id)->whereBetween('created_at', [$startDate, $endDate])->sum('quantity');
            $damagedValue = ProductDamage::where('branch_id', $branch->id)->whereBetween('created_at', [$startDate, $endDate])->sum('amount');

            return [
                'id'             => $branch->id,
                'name'           => $branch->name,
                'sold_qty'       => (int) $soldQty,
                'sold_value'     => (float) $soldValue,
                'returned_qty'   => (int) $returnedQty,
                'returned_value' => (float) $returnedValue,
                'damaged_qty'    => (int) $damagedQty,
                'damaged_value'  => (float) $damagedValue,
            ];
        });

        // ৪. বিক্রিত প্রোডাক্টের তালিকা
        $soldProducts = SaleItem::with(['product', 'sale.branch'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->when($branchId, fn($q) => $q->whereHas('sale', fn($s) => $s->where('branch_id', $branchId)))
            ->when($search, function ($q) use ($search) {
                $q->whereHas('product', fn($p) => $p->where('title', 'like', "%{$search}%")->orWhere('barcode', 'like', "%{$search}%"));
            })
            ->latest()
            ->take(50)
            ->get()
            ->map(fn($item) => [
                'id'      => $item->id,
                'name'    => $item->product->title ?? 'N/A',
                'barcode' => $item->product->barcode ?? 'N/A',
                'branch'  => $item->sale->branch->name ?? 'N/A',
                'qty'     => $item->quantity,
                'value'   => $item->total_price,
                'date'    => $item->created_at->format('d M Y'),
            ]);

        // ৫. রিটার্ন প্রোডাক্টের তালিকা
        $returnedProducts = ReturnItem::with(['product', 'return.branch'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->when($branchId, fn($q) => $q->whereHas('return', fn($r) => $r->where('branch_id', $branchId)))
            ->when($search, function ($q) use ($search) {
                $q->whereHas('product', fn($p) => $p->where('title', 'like', "%{$search}%")->orWhere('barcode', 'like', "%{$search}%"));
            })
            ->latest()
            ->take(50)
            ->get()
            ->map(fn($item) => [
                'id'      => $item->id,
                'name'    => $item->product->title ?? 'N/A',
                'barcode' => $item->product->barcode ?? 'N/A',
                'branch'  => $item->return->branch->name ?? 'N/A',
                'qty'     => $item->quantity,
                'reason'  => $item->reason ?? 'সাধারণ রিটার্ন',
                'value'   => $item->amount,
                'date'    => $item->created_at->format('d M Y'),
            ]);

        // ৬. ড্যামেজ প্রোডাক্টের তালিকা
        $damagedProducts = ProductDamage::with(['product', 'branch'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->when($branchId, fn($q) => $q->where('branch_id', $branchId))
            ->when($search, function ($q) use ($search) {
                $q->whereHas('product', fn($p) => $p->where('title', 'like', "%{$search}%")->orWhere('barcode', 'like', "%{$search}%"));
            })
            ->latest()
            ->take(50)
            ->get()
            ->map(fn($item) => [
                'id'      => $item->id,
                'name'    => $item->product->title ?? 'N/A',
                'barcode' => $item->product->barcode ?? 'N/A',
                'branch'  => $item->branch->name ?? 'N/A',
                'qty'     => $item->quantity,
                'reason'  => $item->reason ?? 'ক্ষতিগ্রস্ত',
                'value'   => $item->amount,
                'date'    => $item->created_at->format('d M Y'),
            ]);

        return response()->json([
            'branches'          => $branches,
            'branch_summary'    => $branchSummary,
            'sold_products'     => $soldProducts,
            'returned_products' => $returnedProducts,
            'damaged_products'  => $damagedProducts,
        ]);
    }
}
