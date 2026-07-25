<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CustomerController extends Controller
{
    /**
     * GET /customers
     * List customers with optional branch filter and name/phone search.
     */
    public function index(Request $request)
    {
        $query = Customer::query()->withCount('sales');

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
    public function show(Customer $customer)
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
    public function store(Request $request)
    {
        $validated = $this->validateCustomer($request);

        $customer = Customer::create($validated);

        return response()->json($customer, 201);
    }

    /**
     * PUT/PATCH /customers/{customer}
     */
    public function update(Request $request, Customer $customer)
    {
        $validated = $this->validateCustomer($request, $customer->id);

        $customer->update($validated);

        return response()->json($customer);
    }

    /**
     * DELETE /customers/{customer}
     * Blocked if the customer has sales history, to avoid orphaning records
     * that aren't protected by nullOnDelete in a way you'd want silently.
     */
    public function destroy(Customer $customer)
    {
        if ($customer->sales()->exists()) {
            return response()->json([
                'message' => 'Cannot delete a customer with existing sales history.',
            ], 422);
        }

        $customer->delete();

        return response()->json(['message' => 'Customer deleted successfully']);
    }

    protected function validateCustomer(Request $request, ?int $customerId = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => [
                'nullable', 'string', 'max:20',
                Rule::unique('customers', 'phone')->ignore($customerId),
            ],
            'branch_id' => ['nullable', 'exists:branches,id'],
        ]);
    }
}
