/* ---------------------------------------------------------------------
   Branch scoping helper.

   VITE_BRANCH_ID set    → this frontend build belongs to a specific branch;
                            every request should carry that branch_id so the
                            API only returns/writes that branch's data.
   VITE_BRANCH_ID unset  → this is the main/head-office build; branch_id is
                            omitted so the backend returns data across every
                            branch (see App\Http\Controllers\Concerns\
                            ScopesToBranch::resolveBranchId — no branch_id
                            filter means "all branches" for owner/admin/main
                            branch users).

   NOTE: this is a convenience for the *client* — it does not weaken
   security. A real branch-type staff user is always forced back onto their
   own branch_id server-side in ScopesToBranch::forceBranchIdOnCreate /
   resolveBranchId, regardless of what the client sends.
--------------------------------------------------------------------- */

const RAW_BRANCH_ID = import.meta.env.VITE_BRANCH_ID;

export const getBranchId = () => {
  if (RAW_BRANCH_ID === undefined || RAW_BRANCH_ID === null || RAW_BRANCH_ID === "") {
    return null;
  }
  const id = Number(RAW_BRANCH_ID);
  return Number.isNaN(id) ? null : id;
};

// Merge branch_id into a GET params object (used before building a query string).
// Leaves an explicitly-provided params.branch_id untouched.
export const withBranchParams = (params = {}) => {
  const branchId = getBranchId();
  if (branchId === null || params.branch_id !== undefined) return params;
  return { ...params, branch_id: branchId };
};

// Merge branch_id into a POST/PUT body payload.
// Leaves an explicitly-provided body.branch_id untouched.
export const withBranchBody = (body = {}) => {
  const branchId = getBranchId();
  if (branchId === null || body.branch_id !== undefined) return body;
  return { ...body, branch_id: branchId };
};
