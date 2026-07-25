<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $fillable = ['product_id', 'sku', 'barcode', 'purchase_price', 'selling_price'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function values()
    {
        return $this->belongsToMany(VariationValue::class, 'product_variant_values');
    }

    public function stocks()
    {
        return $this->hasMany(ProductStock::class);
    }
}
