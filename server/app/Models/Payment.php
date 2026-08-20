<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'sale_id', 'customer_id', 'branch_id', 'amount', 'type', 'account', 'note', 'paid_date',
    ];

    protected function casts(): array
    {
        return ['amount' => 'decimal:2', 'paid_date' => 'date'];
    }

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
