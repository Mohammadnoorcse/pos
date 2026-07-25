<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
protected $fillable = [
    'title', 'branch_id', 'brand_id', 'category_id', 'unit_type_id',
    'purchase_price', 'selling_price', 'image_path', 'description',
    'barcode', 'discount_status', 'discount_value',
    'vat_status', 'vat_percent', 'alert_quantity', 'stock_qty', 'has_variations',
];

    protected function casts(): array
    {
        return [
            'purchase_price' => 'decimal:2',
            'selling_price' => 'decimal:2',
            'discount_value' => 'decimal:2',
            'vat_percent' => 'decimal:2',
            'has_variations' => 'boolean',
        ];
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function unitType()
    {
        return $this->belongsTo(UnitType::class);
    }

    public function variations()
    {
        return $this->belongsToMany(Variation::class, 'product_variation');
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function stocks()
    {
        return $this->hasMany(ProductStock::class);
    }

    /** Total quantity across all branches (and variants). */
    public function totalStock(): int
    {
        return (int) $this->stocks()->sum('quantity');
    }

    public function stockInBranch(int $branchId): int
    {
        return (int) $this->stocks()->where('branch_id', $branchId)->sum('quantity');
    }
}
