<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnitType extends Model
{
    protected $fillable = ['name', 'short'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
