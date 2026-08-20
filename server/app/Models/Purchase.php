<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $fillable = [
        'invoice_no', 'supplier_id', 'branch_id', 'created_by',
        'total', 'paid', 'due', 'return_total', 'receivable', 'status', 'purchase_date',
    ];
 
    protected function casts(): array
    {
        return ['purchase_date' => 'date'];
    }
 
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
 
    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
 
    public function items()
    {
        return $this->hasMany(PurchaseItem::class);
    }
 
    public function payments()
    {
        return $this->hasMany(SupplierPayment::class);
    }

    public function returns()
    {
        return $this->hasMany(PurchaseReturn::class);
    }
 
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
 
    /**
     * Recalculate paid/due/status from linked payments, returns, and total.
     *
     * Returns reduce the effective amount owed to the supplier. If payments
     * already made exceed that reduced amount, 'due' goes to 0 and the
     * excess is exposed as 'receivable' (money the supplier owes back to us).
     */
    public function refreshTotals(): void
    {
        $paid = $this->payments()->sum('amount');
        $returned = $this->returns()->sum('total');

        $effectiveTotal = max(0, $this->total - $returned);
        $balance = $effectiveTotal - $paid; // positive => still due, negative => receivable

        $due = max(0, $balance);
        $receivable = $balance < 0 ? abs($balance) : 0;

        $status = 'Due';
        if ($receivable > 0) {
            $status = 'Receivable';
        } elseif ($due <= 0) {
            $status = 'Paid';
        } elseif ($paid > 0) {
            $status = 'Partial';
        }

        $this->update([
            'paid' => $paid,
            'due' => $due,
            'return_total' => $returned,
            'receivable' => $receivable,
            'status' => $status,
        ]);
    }
}