<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsurePermission
{
    /** Usage in routes: ->middleware('permission:branch.sell') */
    public function handle(Request $request, Closure $next, string $permission)
    {
        $user = $request->user();

        if (! $user || ! $user->hasPermission($permission)) {
            return response()->json(['message' => 'Forbidden — missing permission: '.$permission], 403);
        }

        return $next($request);
    }
}
