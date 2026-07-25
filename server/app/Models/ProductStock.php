<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ProductStock extends Model
{
    protected $fillable = [
        'branch_id',
        'product_id',
        'product_variant_id',
        'quantity',
        'lot_no'
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    /**
     * Atomically decrease stock (e.g., on sale). Throws if stock is insufficient.
     */
    public static function deductStock($branchId, $productId, $variantId = null, int $qty = 1, ?string $lotNo = null): self
    {
        return DB::transaction(function () use ($branchId, $productId, $variantId, $qty, $lotNo) {
            $query = self::where('branch_id', $branchId)
                ->where('product_id', $productId)
                ->where('product_variant_id', $variantId);

            if ($lotNo !== null) {
                $query->where('lot_no', $lotNo);
            }

            $stock = $query->lockForUpdate()->first();

            if (!$stock || $stock->quantity < $qty) {
                throw new RuntimeException("Insufficient stock for product ID {$productId}.");
            }

            $stock->quantity -= $qty;
            $stock->save();

            return $stock;
        });
    }

    /**
     * Atomically increase stock (e.g., on purchase/restock).
     */
    public static function addStock($branchId, $productId, $variantId = null, int $qty = 1, ?string $lotNo = null): self
    {
        return DB::transaction(function () use ($branchId, $productId, $variantId, $qty, $lotNo) {
            $query = self::where('branch_id', $branchId)
                ->where('product_id', $productId)
                ->where('product_variant_id', $variantId);

            if ($lotNo !== null) {
                $query->where('lot_no', $lotNo);
            }

            // Lock first before deciding to create
            $stock = $query->lockForUpdate()->first();

            if (!$stock) {
                $stock = self::create([
                    'branch_id'          => $branchId,
                    'product_id'         => $productId,
                    'product_variant_id' => $variantId,
                    'lot_no'             => $lotNo,
                    'quantity'           => 0,
                ]);
            }

            $stock->quantity += $qty;
            $stock->save();

            return $stock;
        });
    }
}
