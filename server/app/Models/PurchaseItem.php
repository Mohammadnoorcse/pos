<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseItem extends Model
{
      protected $fillable = ['purchase_id', 'product_id', 'name', 'qty', 'price', 'total'];
 
    public function purchase()
    {
        return $this->belongsTo(Purchase::class);
    }
 
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
