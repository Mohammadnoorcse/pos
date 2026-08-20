<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
     protected $fillable = ['name', 'company', 'phone', 'address', 'branch_id', 'is_active'];
 
    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }
 
    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
 
    public function purchases()
    {
        return $this->hasMany(Purchase::class);
    }
 
    public function payments()
    {
        return $this->hasMany(SupplierPayment::class);
    }
 
    /** Sum of due across all purchases for this supplier. */
    public function totalDue(): float
    {
        return (float) $this->purchases()->sum('due');
    }
 
    public function lastPayment()
    {
        return $this->payments()->latest('paid_date')->first();
    }
}
