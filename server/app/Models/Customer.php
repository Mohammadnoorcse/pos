<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = ['name', 'phone', 'address', 'branch_id'];

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function collections()
    {
        return $this->hasMany(Payment::class)->where('type', 'due_collection');
    }

    /** Sum of due across all sales for this customer. */
    public function totalDue(): float
    {
        return (float) $this->sales()->sum('due');
    }

    public function lastInvoice()
    {
        return $this->sales()->latest('sale_date')->first();
    }

    public function lastPayment()
    {
        return $this->collections()->latest('paid_date')->first();
    }
}
