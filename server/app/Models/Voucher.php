<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
     protected $fillable = [
        'voucher_no', 'type', 'date', 'party', 'account', 'amount', 'narration',
        'prepared_by', 'source_type', 'source_id', 'branch_id',
    ];

    protected function casts(): array
    {
        return ['date' => 'date', 'amount' => 'decimal:2'];
    }

    public function preparer()
    {
        return $this->belongsTo(User::class, 'prepared_by');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function source()
    {
        return $this->morphTo(__FUNCTION__, 'source_type', 'source_id');
    }

    /** Voucher number prefix per type, matches frontend convention. */
    public static function prefixFor(string $type): string
    {
        return match ($type) {
            'payment' => 'PV',
            'receipt' => 'RV',
            'journal' => 'JV',
            'contra' => 'CV',
            default => 'VC',
        };
    }

    /** Create a voucher automatically from another Acc-wing action. */
    public static function recordFrom(string $type, string $party, string $account, float $amount, ?string $narration, ?int $preparedBy, $source = null): self
    {
        $prefix = self::prefixFor($type);
        $last = self::where('voucher_no', 'like', "{$prefix}-%")->orderByDesc('id')->first();
        $next = $last ? ((int) substr($last->voucher_no, strlen($prefix) + 1)) + 1 : 1;

        return self::create([
            'voucher_no' => $prefix . '-' . str_pad($next, 4, '0', STR_PAD_LEFT),
            'type' => $type,
            'date' => now()->toDateString(),
            'party' => $party,
            'account' => $account,
            'amount' => $amount,
            'narration' => $narration,
            'prepared_by' => $preparedBy,
            'source_type' => $source ? get_class($source) : null,
            'source_id' => $source?->id,
        ]);
    }
}
