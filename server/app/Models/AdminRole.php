<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminRole extends Model
{
    protected $fillable = ['name'];

    public function permissions()
    {
        return $this->hasMany(AdminRolePermission::class);
    }
}
