<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'user_type' => 'in:owner,admin,branch',
            'branch_id' => 'nullable|exists:branches,id',
            'admin_role_id' => 'nullable|exists:admin_roles,id',
            'branch_role_id' => 'nullable|exists:branch_roles,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'user_type' => $request->user_type ?? 'branch',
            'branch_id' => $request->branch_id,
            'admin_role_id' => $request->admin_role_id,
            'branch_role_id' => $request->branch_role_id,
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
            // Sent only by a branch-specific frontend build (VITE_BRANCH_ID).
            // The main/HQ frontend sends nothing here.
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user->load(['branch', 'adminRole', 'branchRole']);

        if (! $this->canLoginFromThisFrontend($user, $request->input('branch_id'))) {
            return response()->json([
                'message' => $request->filled('branch_id')
                    ? 'You are not a staff member of this branch. Please use your own branch portal.'
                    : 'This portal is only for Owner, Admin and Main branch staff. Please use your branch portal.',
            ], 403);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'permissions' => $user->permissionKeys(),
            'token' => $token,
        ]);
    }

    /**
     * Decide whether $user is allowed to log in from the frontend that sent this request.
     *
     * - $requestBranchId present  -> that frontend belongs to a single branch;
     *   any user (owner/admin/branch) whose branch_id matches that branch may log in.
     * - $requestBranchId absent   -> this is the Main/HQ frontend; only Owner,
     *   Admin, or branch-type staff of the branch flagged is_main may log in.
     */
    protected function canLoginFromThisFrontend(User $user, $requestBranchId): bool
    {
        if ($requestBranchId) {
            return (int) $user->branch_id === (int) $requestBranchId;
        }

        if (in_array($user->user_type, ['owner', 'admin'], true)) {
            return true;
        }

        if ($user->user_type === 'branch') {
            return (bool) ($user->branch->is_main ?? false);
        }

        return false;
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    public function me(Request $request)
    {
        $user = $request->user()->load(['branch', 'adminRole', 'branchRole']);
        return response()->json([
            'user' => $user,
            'permissions' => $user->permissionKeys(),
        ]);
    }
}