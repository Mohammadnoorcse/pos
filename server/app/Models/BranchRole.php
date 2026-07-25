<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BranchRole extends Model
{
    protected $fillable = ['name'];

    public function permissions()
    {
        return $this->hasMany(BranchRolePermission::class);
    }
}
