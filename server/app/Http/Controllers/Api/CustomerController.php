<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CustomerController extends Controller
{
    /**
     * GET /customers
     * List customers with optional branch filter and name/phone search.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Customer::query()->withCount('sales')->withSum('sales as due', 'due');

        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $customers = $query->latest()->paginate($request->get('per_page', 20));

        return response()->json($customers);
    }

    /**
     * GET /customers/{customer}
     * Includes recent sales so a customer's ledger can be reviewed in one call.
     */
    public function show(Customer $customer): JsonResponse
    {
        $customer->load(['branch']);
        $customer->loadSum('sales as total_due_sum', 'due');

        $recentSales = $customer->sales()
            ->latest('sale_date')
            ->limit(20)
            ->get();

        return response()->json([
            'customer' => $customer,
            'recent_sales' => $recentSales,
        ]);
    }

    /**
     * POST /customers
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateCustomer($request);

        $customer = Customer::create($validated);

        return response()->json($customer, 201);
    }

    /**
     * PUT/PATCH /customers/{customer}
     */
    public function update(Request $request, Customer $customer): JsonResponse
    {
        $validated = $this->validateCustomer($request, $customer->id);

        $customer->update($validated);

        return response()->json($customer);
    }

    /**
     * DELETE /customers/{customer}
     * Blocked if the customer has sales history.
     */
    public function destroy(Customer $customer): JsonResponse
    {
        if ($customer->sales()->exists()) {
            return response()->json([
                'message' => 'Cannot delete a customer with existing sales history.',
            ], 422);
        }

        $customer->delete();

        return response()->json(['message' => 'Customer deleted successfully']);
    }

    /**
     * GET /customers/{customer}/history
     * Returns full sales history, timeline, and purchased products summary.
     */
    public function history(Customer $customer): JsonResponse
    {
        $customer->load([
            'sales.items.product',
            'sales.items.productVariant',
            'sales.payments',
            'sales.returns.saleItem.product',
        ]);

        $totalPurchase = $customer->sales->sum('total');
        $totalPayment  = $customer->sales->flatMap->payments->sum('amount');
        $totalReturn   = $customer->sales->flatMap->returns->sum('amount');
        $totalDue      = $customer->sales->sum('due');

        // Products the customer has bought (grouped, with total qty & spend)
        $products = $customer->sales
            ->flatMap->items
            ->groupBy(fn ($item) => $item->product_id)
            ->map(function ($items) {
                $first = $items->first();
                return [
                    'product_id'   => $first->product_id,
                    'title'        => $first->product->title ?? 'Unknown Product',
                    'quantity'     => $items->sum('quantity'),
                    'total_amount' => $items->sum('total'),
                ];
            })
            ->values();

        // Merged timeline: purchase (sale), payment, return
        $timeline = collect();

        foreach ($customer->sales as $sale) {
            $timeline->push([
                'id'     => $sale->invoice_no,
                'type'   => 'purchase',
                'date'   => $sale->sale_date,
                'amount' => $sale->total,
                'note'   => $sale->items->map(fn ($i) => ($i->product->title ?? 'Item') . ' x' . $i->quantity)->implode(', '),
            ]);

            foreach ($sale->payments as $payment) {
                $timeline->push([
                    'id'     => 'PAY-' . $payment->id,
                    'type'   => 'payment',
                    'date'   => $payment->paid_date,
                    'amount' => $payment->amount,
                    'note'   => 'Payment for invoice ' . $sale->invoice_no,
                ]);
            }

            foreach ($sale->returns as $return) {
                $timeline->push([
                    'id'     => 'RET-' . $return->id,
                    'type'   => 'return',
                    'date'   => $return->return_date,
                    'amount' => $return->amount,
                    'note'   => ($return->saleItem->product->title ?? 'Item') . ' x' . $return->quantity . ' returned',
                ]);
            }
        }

        $timeline = $timeline->sortByDesc('date')->values();

        return response()->json([
            'customer' => [
                'id'    => $customer->id,
                'name'  => $customer->name,
                'phone' => $customer->phone,
            ],
            'summary' => [
                'total_purchase' => round((float) $totalPurchase, 2),
                'total_payment'  => round((float) $totalPayment, 2),
                'total_return'   => round((float) $totalReturn, 2),
                'total_due'      => round((float) $totalDue, 2),
            ],
            'products' => $products,
            'timeline' => $timeline,
        ]);
    }

    /**
     * Customer Input Validation
     */
    protected function validateCustomer(Request $request, ?int $customerId = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => [
                'nullable', 'string', 'max:20',
                Rule::unique('customers', 'phone')->ignore($customerId),
            ],
            'address' => ['nullable', 'string', 'max:255'],
            'branch_id' => ['nullable', 'exists:branches,id'],
        ]);
    }
}