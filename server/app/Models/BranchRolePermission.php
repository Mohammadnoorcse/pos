<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BranchRolePermission extends Model
{
    protected $fillable = ['branch_role_id', 'permission_key'];

    public function role()
    {
        return $this->belongsTo(BranchRole::class, 'branch_role_id');
    }
}
