<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\StockTransfer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StockTransferController extends Controller
{
    /** GET /stock-transfers?type=B2B_B2G|G2B — Transfered Histories page */
    public function index(Request $request)
    {
        $query = StockTransfer::with(['fromBranch', 'toBranch', 'items.product', 'creator']);

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        if ($request->filled('branch_id')) {
            $query->where(fn ($q) => $q->where('from_branch_id', $request->branch_id)
                ->orWhere('to_branch_id', $request->branch_id));
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('note', 'like', "%{$search}%");
        }

        return response()->json(
            $query->orderByDesc('transfer_date')->orderByDesc('id')->paginate($request->integer('per_page', 50))
        );
    }

    /**
     * GET /stock-transfers/sender-stock?branch_id=&search= — products
     * available from a branch, for the transfer builder.
     *
     * NOTE: this now reads straight from `products` (branch_id + stock_qty),
     * the same source AllProductsPage/AddNewProductPage use, instead of the
     * separate ProductStock ledger — that table was never populated by the
     * product create/edit flow, which is why transfers were failing with
     * "Not enough stock" even though the product clearly had stock.
     */
    public function senderStock(Request $request)
    {
        $request->validate(['branch_id' => 'required|exists:branches,id']);

        $query = Product::with('brand')
            ->where('branch_id', $request->branch_id)
            ->where('stock_qty', '>', 0);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(fn ($q) => $q->where('title', 'like', "%{$search}%")
                ->orWhere('barcode', 'like', "%{$search}%"));
        }

        return response()->json($query->get());
    }

    /**
     * POST /stock-transfers — confirm a transfer.
     * body: { type: B2B_B2G|G2B, from_branch_id, to_branch_id, date, note,
     *         items: [{ product_id, quantity, price }] }
     *
     * Moves quantity between products.stock_qty directly:
     *  - decrements stock_qty on the source product (must belong to from_branch_id)
     *  - finds a matching product (by title) already in to_branch_id and
     *    increments its stock_qty, or creates a new product row there if
     *    none exists yet.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|in:B2B_B2G,G2B',
            'from_branch_id' => 'required|exists:branches,id|different:to_branch_id',
            'to_branch_id' => 'required|exists:branches,id',
            'transfer_date' => 'required|date',
            'note' => 'required|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        $transfer = DB::transaction(function () use ($data) {
            $total = 0;

            // Lock and validate every source product first, so nothing
            // partially commits if one item doesn't have enough stock.
            $sourceProducts = [];
            foreach ($data['items'] as $item) {
                $product = Product::where('id', $item['product_id'])
                    ->where('branch_id', $data['from_branch_id'])
                    ->lockForUpdate()
                    ->first();

                if (! $product) {
                    throw ValidationException::withMessages([
                        'items' => "Product #{$item['product_id']} does not belong to the sender branch",
                    ]);
                }

                $available = $product->stock_qty ?? 0;
                if ($available < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => "Not enough stock for {$product->title} (available: {$available})",
                    ]);
                }

                $sourceProducts[$item['product_id']] = $product;
            }

            $transfer = StockTransfer::create([
                'type' => $data['type'],
                'from_branch_id' => $data['from_branch_id'],
                'to_branch_id' => $data['to_branch_id'],
                'created_by' => auth()->id(),
                'transfer_date' => $data['transfer_date'],
                'note' => $data['note'],
                'status' => 'confirmed',
                'total' => 0,
            ]);

            foreach ($data['items'] as $item) {
                $lineTotal = $item['quantity'] * $item['price'];
                $total += $lineTotal;

                $sourceProduct = $sourceProducts[$item['product_id']];

                $transfer->items()->create([
                    'product_id' => $sourceProduct->id,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'total' => $lineTotal,
                ]);

                // Decrement stock on the sender's product row.
                $sourceProduct->decrement('stock_qty', $item['quantity']);

                // Find (by title) or create the matching product row at the
                // receiving branch, then bump its stock.
                $destProduct = Product::where('branch_id', $data['to_branch_id'])
                    ->where('title', $sourceProduct->title)
                    ->lockForUpdate()
                    ->first();

                if ($destProduct) {
                    $destProduct->increment('stock_qty', $item['quantity']);
                } else {
                    Product::create([
                        'title' => $sourceProduct->title,
                        'branch_id' => $data['to_branch_id'],
                        'brand_id' => $sourceProduct->brand_id,
                        'category_id' => $sourceProduct->category_id,
                        'unit_type_id' => $sourceProduct->unit_type_id,
                        'purchase_price' => $sourceProduct->purchase_price,
                        'selling_price' => $sourceProduct->selling_price,
                        'description' => $sourceProduct->description,
                        'discount_status' => $sourceProduct->discount_status,
                        'discount_value' => $sourceProduct->discount_value,
                        'vat_status' => $sourceProduct->vat_status,
                        'vat_percent' => $sourceProduct->vat_percent,
                        'alert_quantity' => $sourceProduct->alert_quantity,
                        'stock_qty' => $item['quantity'],
                        // barcode is unique, so the receiving branch's copy
                        // needs its own code rather than reusing the source's.
                        'barcode' => (string) random_int(1000000000, 9999999999),
                    ]);
                }
            }

            $transfer->update(['total' => $total]);

            return $transfer;
        });

        return response()->json($transfer->load(['fromBranch', 'toBranch', 'items.product']), 201);
    }

    public function show(StockTransfer $stockTransfer)
    {
        return response()->json($stockTransfer->load(['fromBranch', 'toBranch', 'items.product', 'creator']));
    }
}
