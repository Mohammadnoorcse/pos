<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StaffSalaryPayment extends Model
{
    protected $fillable = [
        'user_id', 'amount', 'for_month', 'paid_on', 'note', 'created_by',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'for_month' => 'date',
            'paid_on' => 'date',
        ];
    }

    public function staff()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
