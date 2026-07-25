<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SaleReturn extends Model
{
    protected $fillable = ['sale_id', 'sale_item_id', 'quantity', 'amount', 'return_date'];
}
