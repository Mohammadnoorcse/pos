import React, { useState, useEffect, useCallback } from "react";
import { Loader2, Eye, Search } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { COLORS, PETALS, FONTS, SUB_BRANCH_ID } from "../../../constants";
import { fetchStaffList } from "../../../api/staffService";
import { fetchBranches } from "../../../api/branchService";

const money = (n) => "৳" + Number(n || 0).toLocaleString("en-BD");

export function StaffPage({ onOpenStaff }) {
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState(SUB_BRANCH_ID ? String(SUB_BRANCH_ID) : "");
  const [search, setSearch] = useState("");

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ব্রাঞ্চ ফিল্টার ড্রপডাউনের জন্য branch list লোড করা
  useEffect(() => {
    fetchBranches({ per_page: 200 })
      .then((data) => setBranches(data?.data || data || []))
      .catch((err) => console.error("Failed to load branches:", err));
  }, []);

  const loadStaff = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { per_page: 200 };
      if (branchId) params.branch_id = branchId;
      if (search.trim()) params.search = search.trim();
      const data = await fetchStaffList(params);
      setStaff(data?.data || []);
    } catch (err) {
      console.error("Error loading staff:", err);
      setError("স্টাফ লিস্ট লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }, [branchId, search]);

  useEffect(() => {
    const t = setTimeout(loadStaff, 300); // debounce search
    return () => clearTimeout(t);
  }, [loadStaff]);

  const roleName = (u) =>
    u.user_type === "owner"
      ? "Owner"
      : u.user_type === "admin"
      ? u.admin_role?.name || "Admin (no role)"
      : u.branch_role?.name || "Branch (no role)";

  return (
    <div
      className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-staff" colors={PETALS} />

      {/* Header + Filters */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2
          className="font-bold text-[16px]"
          style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
        >
          Staff & Salary — কোন branch এ কতজন staff
        </h2>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            className="rounded-lg px-3 py-2 text-[12.5px] border outline-none"
            style={{
              backgroundColor: COLORS.paper,
              borderColor: COLORS.line,
              color: COLORS.ink,
              fontFamily: FONTS.BODY,
            }}
          >
            <option value="">সব Branch</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
                {b.is_main ? " (Main/HQ)" : ""}
              </option>
            ))}
          </select>

          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2"
              style={{ color: COLORS.muted }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="নাম / ইমেইল / ফোন খুঁজুন"
              className="rounded-lg pl-8 pr-3 py-2 text-[12.5px] border outline-none"
              style={{
                backgroundColor: COLORS.paper,
                borderColor: COLORS.line,
                color: COLORS.ink,
                fontFamily: FONTS.BODY,
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="mb-4 text-[12.5px] font-semibold"
        style={{ color: COLORS.muted }}
      >
        মোট {staff.length} জন স্টাফ পাওয়া গেছে{branchId ? " (এই branch এ)" : ""}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-slate-500 gap-2">
            <Loader2 className="animate-spin" size={20} />
            <span>ডাটা লোড হচ্ছে...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left" style={{ color: COLORS.muted }}>
                {["SI", "Name", "Contact", "Branch", "Role", "Joining Date", "Monthly Salary", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b whitespace-nowrap"
                    style={{ borderColor: COLORS.line }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staff.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8" style={{ color: COLORS.muted }}>
                    কোন স্টাফ পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                staff.map((u, i) => (
                  <tr
                    key={u.id}
                    style={i !== staff.length - 1 ? { borderBottom: `1px solid ${COLORS.line}` } : undefined}
                  >
                    <td className="py-3 px-2.5" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>
                      {i + 1}
                    </td>
                    <td className="py-3 px-2.5 font-semibold" style={{ color: COLORS.ink }}>
                      {u.name}
                    </td>
                    <td className="py-3 px-2.5" style={{ color: COLORS.muted }}>
                      <div>{u.email}</div>
                      {u.phone && <div className="text-[11.5px]">{u.phone}</div>}
                    </td>
                    <td className="py-3 px-2.5" style={{ color: COLORS.ink }}>
                      {u.branch?.name || "—"}
                    </td>
                    <td className="py-3 px-2.5" style={{ color: COLORS.ink }}>
                      {roleName(u)}
                    </td>
                    <td className="py-3 px-2.5" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>
                      {u.joining_date || "—"}
                    </td>
                    <td className="py-3 px-2.5 font-semibold" style={{ color: COLORS.forest, fontFamily: FONTS.MONO }}>
                      {u.monthly_salary != null ? money(u.monthly_salary) : "—"}
                    </td>
                    <td className="py-3 px-2.5">
                      <button
                        onClick={() => onOpenStaff && onOpenStaff(u)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: COLORS.peacock }}
                        title="View details & salary history"
                      >
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
