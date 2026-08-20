<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

/**
 * Shared branch-scoping logic used by every controller that lists or
 * aggregates branch-owned data (sales, products, stock, expenses, etc.).
 *
 * Rule:
 *   - user_type === 'owner'
 *       → NEVER restricted, always sees every branch, regardless of
 *         branch_id. May optionally filter by branch_id sent in the request.
 *   - user_type === 'branch'
 *       → ALWAYS locked to their own branch_id, no matter what the client
 *         sends in the request.
 *   - user_type === 'admin' (or any other type) && branch_id IS SET
 *       → locked to that branch_id, same as a branch user.
 *   - user_type === 'admin' (or any other type) && branch_id IS NULL
 *       → treated as main branch / head office: sees every branch by
 *         default, and may optionally filter by a branch_id sent in the
 *         request (used by the main/admin dashboard).
 */
trait ScopesToBranch
{
    /**
     * True when this request's user must always be locked to their own
     * branch_id — i.e. their branch_id is set and they aren't an owner.
     */
    protected function isRestrictedBranchUser(Request $request): bool
    {
        $user = $request->user();

        if (! $user || $user->user_type === 'owner') {
            // No user, or an owner → never restricted, sees everything.
            return false;
        }

        // No branch_id at all → main branch behaviour (see all / optional filter).
        return (bool) $user->branch_id;
    }

    /**
     * Resolve the branch_id that should scope this request.
     * Returns null when the user is allowed to see every branch and no
     * specific branch_id filter was requested.
     */
    protected function resolveBranchId(Request $request): ?int
    {
        $user = $request->user();

        if ($this->isRestrictedBranchUser($request)) {
            return $user->branch_id;
        }

        return $request->integer('branch_id') ?: null;
    }

    /**
     * Apply the resolved branch scope to an Eloquent query builder.
     * $column lets callers target a different column name (e.g. a related
     * table's branch_id via whereHas) when 'branch_id' isn't directly on
     * the base table.
     */
    protected function applyBranchScope(Builder $query, Request $request, string $column = 'branch_id'): Builder
    {
        $branchId = $this->resolveBranchId($request);

        return $query->when($branchId, fn ($q) => $q->where($column, $branchId));
    }

    /**
     * Guard for single-record endpoints (show/update/delete). Aborts with a
     * 403 if a branch-type user tries to touch a record that belongs to a
     * different branch (or has no branch at all).
     */
    protected function denyIfOtherBranch(Request $request, ?int $recordBranchId): void
    {
        $user = $request->user();

        if ($this->isRestrictedBranchUser($request) && (int) $recordBranchId !== (int) $user->branch_id) {
            abort(403, 'এই তথ্য দেখা বা পরিবর্তন করার অনুমতি আপনার নেই।');
        }
    }

    /**
     * Force the correct branch_id into data being created.
     *
     * - Restricted branch staff: always their own branch_id, regardless of
     *   what the client sent (prevents creating records under another branch).
     * - Main branch / owner / admin: use whatever branch_id was submitted in
     *   the request (nullable — null means a head-office-level record).
     */
    protected function forceBranchIdOnCreate(array $data, Request $request): array
    {
        if ($this->isRestrictedBranchUser($request)) {
            $data['branch_id'] = $request->user()->branch_id;
        } else {
            $data['branch_id'] = $request->integer('branch_id') ?: ($data['branch_id'] ?? null);
        }

        return $data;
    }
}