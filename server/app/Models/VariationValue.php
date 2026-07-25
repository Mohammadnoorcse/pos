<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VariationValue extends Model
{
    protected $fillable = ['variation_id', 'value'];

    public function variation()
    {
        return $this->belongsTo(Variation::class);
    }
}
