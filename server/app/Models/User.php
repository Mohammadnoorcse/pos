<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'user_type',
        'admin_role_id', 'branch_id', 'branch_role_id',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return ['email_verified_at' => 'datetime', 'password' => 'hashed'];
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function adminRole()
    {
        return $this->belongsTo(AdminRole::class);
    }

    public function branchRole()
    {
        return $this->belongsTo(BranchRole::class);
    }

    /** Flat list of permission keys this user currently holds. */
    public function permissionKeys(): array
    {
        if ($this->user_type === 'owner') {
            return ['*'];
        }
        if ($this->user_type === 'admin' && $this->adminRole) {
            return $this->adminRole->permissions()->pluck('permission_key')->all();
        }
        if ($this->user_type === 'branch' && $this->branchRole) {
            return $this->branchRole->permissions()->pluck('permission_key')->all();
        }
        return [];
    }

    public function hasPermission(string $key): bool
    {
        $keys = $this->permissionKeys();
        return in_array('*', $keys, true) || in_array($key, $keys, true);
    }
}
