<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bank extends Model
{
    protected $fillable = [
        'code', 'bank_name', 'branch', 'account_name', 'account_number',
        'routing_number', 'type', 'opening_balance', 'balance', 'status', 'branch_id',
    ];

    protected function casts(): array
    {
        return [
            'opening_balance' => 'decimal:2',
            'balance' => 'decimal:2',
        ];
    }

    public function branchModel()
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    /** Adjust running balance atomically. Positive = credit, negative = debit. */
    public function adjustBalance(float $delta): void
    {
        $this->increment('balance', $delta);
    }
}
