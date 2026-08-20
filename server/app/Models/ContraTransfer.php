<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContraTransfer extends Model
{
     protected $fillable = [
        'transfer_no', 'date', 'from_account', 'to_account', 'amount',
        'note', 'ref', 'status', 'branch_id', 'created_by',
    ];

    protected function casts(): array
    {
        return ['date' => 'date', 'amount' => 'decimal:2'];
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
