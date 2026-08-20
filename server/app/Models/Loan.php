<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    protected $fillable = [
        'loan_no', 'kind', 'party', 'party_type', 'principal', 'rate', 'tenure_months',
        'emi', 'outstanding', 'next_due', 'status', 'taken_on', 'purpose', 'branch_id', 'created_by',
    ];

    protected function casts(): array
    {
        return [
            'principal' => 'decimal:2',
            'rate' => 'decimal:2',
            'emi' => 'decimal:2',
            'outstanding' => 'decimal:2',
            'next_due' => 'date',
            'taken_on' => 'date',
        ];
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function payments()
    {
        return $this->hasMany(LoanPayment::class);
    }

    /** Record a repayment and reduce outstanding balance. */
    public function recordPayment(float $amount, string $account = 'cash', ?string $note = null): LoanPayment
    {
        $payment = $this->payments()->create([
            'date' => now()->toDateString(),
            'amount' => $amount,
            'account' => $account,
            'note' => $note,
        ]);

        $this->decrement('outstanding', $amount);

        if ($this->outstanding <= 0) {
            $this->update(['status' => 'closed', 'outstanding' => 0]);
        }

        return $payment;
    }
}
