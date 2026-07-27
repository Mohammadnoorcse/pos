<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DamageRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'branch_id',
        'unit_id',
        'variation_id',
        'place',
        'lot_number',
        'purchase_price',
        'sales_price',
        'discount',
        'vat',
        'barcode',
        'quantity',
        'unit',
        'reason',
    ];

    // Relationships
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function unitType()
    {
        return $this->belongsTo(UnitType::class, 'unit_id');
    }

    public function variation()
    {
        return $this->belongsTo(Variation::class);
    }
}
