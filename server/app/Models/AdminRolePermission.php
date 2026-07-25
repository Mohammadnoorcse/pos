<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminRolePermission extends Model
{
    protected $fillable = ['admin_role_id', 'wing', 'permission_key'];

    public function role()
    {
        return $this->belongsTo(AdminRole::class, 'admin_role_id');
    }
}
