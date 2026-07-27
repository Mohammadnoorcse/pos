<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SaleItem extends Model
{
    protected $fillable = ['sale_id', 'product_id', 'product_variant_id', 'quantity', 'unit_price', 'total'];

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function returns()
{
    return $this->hasMany(SaleReturn::class);
}

    public function getReturnedQuantityAttribute()
    {
        return $this->returns()->sum('quantity');
    }

    public function getRemainingQuantityAttribute()
    {
        return $this->quantity - $this->returned_quantity;
    }
}
