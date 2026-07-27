import React, { useState, useEffect } from "react";
import { ArrowLeft, CheckSquare, Square, Loader2 } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { COLORS, PETALS, FONTS } from "../../../constants";
import {
  fetchPermissionCatalog,
  updateRolePermissions,
} from "../../../api/branchRoleService";

export function BranchRolePermissionsPage({ role, onBack }) {
  const [catalog, setCatalog] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // পারমিশন ক্যাটালগ ও রোলের বর্তমান পারমিশন ইনিশিয়ালাইজ করা
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const catalogData = await fetchPermissionCatalog();
        setCatalog(catalogData || []);

        // Backend থেকে পাওয়া role.permissions থেকে permission_key সমূহের লিস্ট বের করা
        const currentKeys = role.permissions
          ? role.permissions.map((p) => p.permission_key)
          : [];
        setSelectedPermissions(currentKeys);
      } catch (err) {
        console.error("Error loading permissions:", err);
        alert("পারমিশন ক্যাটালগ লোড করা সম্ভব হয়নি।");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [role]);

  // পারমিশন চেক/আনচেক টগল
  const togglePermission = (permKey) => {
    setSelectedPermissions((prev) =>
      prev.includes(permKey)
        ? prev.filter((k) => k !== permKey)
        : [...prev, permKey]
    );
  };

  // পারমিশন সেভ করা
  const handleSave = async () => {
    try {
      setSaving(true);
      await updateRolePermissions(role.id, selectedPermissions);
      alert("Permissions updated successfully!");
    } catch (err) {
      console.error("Error saving permissions:", err);
      alert("পারমিশন সেভ করতে সমস্যা হয়েছে।");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[12.5px] font-semibold mb-4 hover:underline"
        style={{ color: COLORS.muted }}
      >
        <ArrowLeft size={14} /> Back to Branch User Role & Permissions
      </button>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-500 gap-2">
          <Loader2 className="animate-spin" size={24} />
          <span>পারমিশন লোড হচ্ছে...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* LEFT: Permission Selector */}
          <div
            className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
          >
            <ScallopBorder id="scallop-branch-perm-left" colors={PETALS} />
            <h2
              className="font-bold text-[16px] mb-4"
              style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
            >
              Permission of {role.name}
            </h2>

            <div
              className="text-[13.5px] font-bold mb-2.5"
              style={{ color: COLORS.peacock, fontFamily: FONTS.HEAD }}
            >
              Branch Permissions
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pb-2 max-h-[480px] overflow-y-auto">
              {catalog.map((perm) => {
                const checked = selectedPermissions.includes(perm);
                return (
                  <div
                    key={perm}
                    className="flex items-center gap-2 cursor-pointer select-none py-1"
                    onClick={() => togglePermission(perm)}
                  >
                    {checked ? (
                      <CheckSquare size={16} style={{ color: COLORS.forest }} />
                    ) : (
                      <Square size={16} style={{ color: COLORS.line }} />
                    )}
                    <span
                      className="text-[12.5px]"
                      style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}
                    >
                      {perm}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-white font-semibold text-[13px] px-5 py-2.5 rounded-lg shadow-md flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: COLORS.purple,
                  boxShadow: `0 4px 10px ${COLORS.purple}40`,
                }}
              >
                {saving && <Loader2 className="animate-spin" size={14} />}
                {saving ? "Saving..." : "Save Permissions"}
              </button>
            </div>
          </div>

          {/* RIGHT: Granted Permissions Summary */}
          <div
            className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
          >
            <ScallopBorder id="scallop-branch-perm-right" colors={PETALS} />
            <h2
              className="font-bold text-[16px] mb-4"
              style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
            >
              Provided Permissions ({selectedPermissions.length})
            </h2>

            <div
              className="text-[12.5px] font-bold mb-1.5"
              style={{
                color: COLORS.forestDark,
                fontFamily: FONTS.HEAD,
              }}
            >
              Branch
            </div>

            <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
              {selectedPermissions.length === 0 ? (
                <div className="text-[12px] text-gray-400 py-4">
                  কোন পারমিশন দেওয়া হয়নি।
                </div>
              ) : (
                selectedPermissions.map((perm) => (
                  <div key={perm} className="flex items-center gap-2">
                    <CheckSquare
                      size={14}
                      style={{ color: COLORS.forest }}
                      className="shrink-0"
                    />
                    <span
                      className="text-[12px]"
                      style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}
                    >
                      {perm}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}