<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupplierPayment extends Model
{
     protected $fillable = [
        'payment_no', 'supplier_id', 'purchase_id', 'branch_id', 'created_by',
        'amount', 'method', 'account', 'note', 'received_by', 'paid_by', 'paid_date',
    ];

    protected function casts(): array
    {
        return ['paid_date' => 'date', 'amount' => 'decimal:2'];
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function purchase()
    {
        return $this->belongsTo(Purchase::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}