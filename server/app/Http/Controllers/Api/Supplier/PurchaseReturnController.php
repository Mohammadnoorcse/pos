<?php

namespace App\Http\Controllers\Api\Supplier;

use App\Http\Controllers\Controller;
use App\Models\Purchase;
use App\Models\PurchaseReturn;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PurchaseReturnController extends Controller
{
    /**
     * GET /api/purchase-returns
     * Optional ?purchase_id= or ?supplier_id= filters.
     */
    public function index(Request $request)
    {
        $query = PurchaseReturn::query()->with(['supplier:id,name,company,phone', 'purchase:id,invoice_no,total,paid,due,receivable', 'items']);

        if ($request->filled('purchase_id')) {
            $query->where('purchase_id', $request->integer('purchase_id'));
        }

        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->integer('supplier_id'));
        }

        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->integer('branch_id'));
        }

        if ($request->filled('search')) {
            $s = $request->string('search');
            $query->where('return_no', 'like', "%{$s}%")
                ->orWhereHas('supplier', fn ($q) => $q->where('name', 'like', "%{$s}%")->orWhere('company', 'like', "%{$s}%"));
        }

        return response()->json(
            $query->latest('return_date')->paginate($request->integer('per_page', 100))
        );
    }

    public function show(PurchaseReturn $purchaseReturn)
    {
        return response()->json($purchaseReturn->load(['supplier', 'purchase', 'items.product']));
    }

    /**
     * POST /api/purchase-returns
     * Body: { purchase_id, reason?, return_date, items: [{ purchase_item_id?, product_id?, name, qty, price }] }
     *
     * Creates the return, then recalculates the purchase's due/receivable via
     * Purchase::refreshTotals(). Due drops by the returned amount; if paid
     * already covers more than what's left owed, the excess shows up as
     * 'receivable' instead of due.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'purchase_id' => 'required|exists:purchases,id',
            'reason' => 'nullable|string|max:255',
            'return_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.purchase_item_id' => 'nullable|exists:purchase_items,id',
            'items.*.product_id' => 'nullable|exists:products,id',
            'items.*.name' => 'required|string|max:255',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        $purchase = Purchase::with('items')->findOrFail($data['purchase_id']);

        $return = DB::transaction(function () use ($data, $purchase, $request) {
            // Guard: don't let a return exceed what was actually purchased
            // (checked per purchase_item_id when provided).
            $alreadyReturnedByItem = \App\Models\PurchaseReturnItem::query()
                ->whereHas('purchaseReturn', fn ($q) => $q->where('purchase_id', $purchase->id))
                ->whereNotNull('purchase_item_id')
                ->selectRaw('purchase_item_id, SUM(qty) as qty')
                ->groupBy('purchase_item_id')
                ->pluck('qty', 'purchase_item_id');

            foreach ($data['items'] as $item) {
                if (!empty($item['purchase_item_id'])) {
                    $purchaseItem = $purchase->items->firstWhere('id', $item['purchase_item_id']);
                    if ($purchaseItem) {
                        $alreadyReturned = (int) ($alreadyReturnedByItem[$item['purchase_item_id']] ?? 0);
                        if ($alreadyReturned + $item['qty'] > $purchaseItem->qty) {
                            throw ValidationException::withMessages([
                                'items' => "Return qty for \"{$purchaseItem->name}\" exceeds purchased qty.",
                            ]);
                        }
                    }
                }
            }

            $total = collect($data['items'])->sum(fn ($i) => $i['qty'] * $i['price']);

            $return = PurchaseReturn::create([
                'return_no' => $this->nextReturnNo(),
                'purchase_id' => $purchase->id,
                'supplier_id' => $purchase->supplier_id,
                'branch_id' => $purchase->branch_id,
                'created_by' => $request->user()?->id,
                'total' => $total,
                'reason' => $data['reason'] ?? null,
                'return_date' => $data['return_date'],
            ]);

            foreach ($data['items'] as $item) {
                $return->items()->create([
                    'purchase_item_id' => $item['purchase_item_id'] ?? null,
                    'product_id' => $item['product_id'] ?? null,
                    'name' => $item['name'],
                    'qty' => $item['qty'],
                    'price' => $item['price'],
                    'total' => $item['qty'] * $item['price'],
                ]);
            }

            $purchase->refreshTotals();

            return $return;
        });

        return response()->json($return->load(['items', 'supplier', 'purchase']), 201);
    }

    /**
     * DELETE /api/purchase-returns/{purchaseReturn}
     * Reverses the return — purchase due/receivable recalculated again.
     */
    public function destroy(PurchaseReturn $purchaseReturn)
    {
        DB::transaction(function () use ($purchaseReturn) {
            $purchase = $purchaseReturn->purchase;
            $purchaseReturn->delete();
            $purchase?->refreshTotals();
        });

        return response()->json(['message' => 'Purchase return removed.']);
    }

    private function nextReturnNo(): string
    {
        $seq = PurchaseReturn::query()->count() + 1;

        return 'PR/' . now()->format('ymd') . str_pad($seq, 3, '0', STR_PAD_LEFT);
    }
}