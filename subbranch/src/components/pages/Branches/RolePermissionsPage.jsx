import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronDown, CheckSquare, Square, Loader2 } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { COLORS, PETALS, FONTS } from "../../../constants";
import {
  fetchPermissionCatalog,
  updateAdminRolePermissions,
} from "../../../api/adminRoleService";

export function RolePermissionsPage({ role, onBack }) {
  const [wingsCatalog, setWingsCatalog] = useState({});
  const [openWing, setOpenWing] = useState("Account_Wing");
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ১. ব্যাকএন্ড থেকে ক্যাটালগ লোড ও বর্তমান পারমিশন সিঙ্ক করা
  useEffect(() => {
    const loadCatalogAndPermissions = async () => {
      try {
        setLoading(true);
        const catalog = await fetchPermissionCatalog();
        setWingsCatalog(catalog || {});

        // প্রাথমিক স্টেট অবজেক্ট তৈরি: { [wing]: { [permKey]: boolean } }
        const initialState = {};
        Object.entries(catalog).forEach(([wing, perms]) => {
          initialState[wing] = {};
          perms.forEach((perm) => {
            initialState[wing][perm] = false;
          });
        });

        // রোল-এর বিদ্যমান পারমিশনগুলো ট্রু (True) সেট করা
        if (role?.permissions && Array.isArray(role.permissions)) {
          role.permissions.forEach((p) => {
            if (initialState[p.wing] && initialState[p.wing][p.permission_key] !== undefined) {
              initialState[p.wing][p.permission_key] = true;
            }
          });
        }

        setState(initialState);
      } catch (error) {
        console.error("Error loading permissions catalog:", error);
        alert("পারমিশন ক্যাটালগ লোড করতে সমস্যা হয়েছে।");
      } finally {
        setLoading(false);
      }
    };

    loadCatalogAndPermissions();
  }, [role]);

  // ২. পারমিশন চেক/আনচেক করার ফাংশন
  const toggle = (wing, perm) => {
    setState((prev) => ({
      ...prev,
      [wing]: {
        ...prev[wing],
        [perm]: !prev[wing]?.[perm],
      },
    }));
  };

  // ৩. ব্যাকএন্ড API-তে পারমিশন সেভ করা
  const handleSavePermissions = async () => {
    try {
      setSaving(true);

      // ব্যাকএন্ডের চাহিদামতো ফরম্যাটে রূপান্তর:
      // { permissions: { "Account_Wing": ["account.dashboard", ...], "Godown_Wing": [...] } }
      const payloadPermissions = {};
      Object.entries(state).forEach(([wing, permsObj]) => {
        payloadPermissions[wing] = Object.entries(permsObj)
          .filter(([_, isChecked]) => isChecked)
          .map(([permKey]) => permKey);
      });

      await updateAdminRolePermissions(role.id, payloadPermissions);
      alert(`${role.name}-এর পারমিশন সফলভাবে সেভ হয়েছে!`);
    } catch (error) {
      console.error("Error saving permissions:", error);
      alert(error.message || "পারমিশন সেভ করতে ব্যর্থ হয়েছে।");
    } finally {
      setSaving(false);
    }
  };

  const wingHeaderColors = {
    Account_Wing: COLORS.peacock,
    Godown_Wing: COLORS.purple,
    Main_Wing: COLORS.magenta,
    Supplier_Wing: COLORS.rust,
  };

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[12.5px] font-semibold mb-4 hover:underline cursor-pointer"
        style={{ color: COLORS.muted }}
      >
        <ArrowLeft size={14} /> Back to Admin Helper Roles
      </button>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-500 gap-2">
          <Loader2 className="animate-spin" size={24} />
          <span>পারমিশন ক্যাটালগ লোড হচ্ছে...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* LEFT: Editable permission tree */}
          <div
            className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
          >
            <ScallopBorder id="scallop-perm-left" colors={PETALS} />
            <h2
              className="font-bold text-[16px] mb-4"
              style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
            >
              Permission of {role.name}
            </h2>

            <div className="space-y-1">
              {Object.entries(wingsCatalog).map(([wing, perms], idx) => {
                const isOpen = openWing === wing;
                return (
                  <div
                    key={wing}
                    style={
                      idx !== 0 ? { borderTop: `1px dashed ${COLORS.line}` } : undefined
                    }
                  >
                    <button
                      onClick={() => setOpenWing(isOpen ? null : wing)}
                      className="w-full flex items-center justify-between py-3 text-left cursor-pointer"
                    >
                      <span
                        className="text-[13.5px] font-bold"
                        style={{
                          color: isOpen ? COLORS.ink : wingHeaderColors[wing] || COLORS.peacock,
                          fontFamily: FONTS.HEAD,
                        }}
                      >
                        {wing.replace("_", " ")}
                      </span>
                      <ChevronDown
                        size={15}
                        style={{
                          color: COLORS.muted,
                          transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
                          transition: "transform .15s",
                        }}
                      />
                    </button>

                    {isOpen && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pb-4">
                        {perms.map((perm) => {
                          const checked = !!state[wing]?.[perm];
                          return (
                            <label
                              key={perm}
                              className="flex items-center gap-2 cursor-pointer select-none"
                              onClick={() => toggle(wing, perm)}
                            >
                              {checked ? (
                                <CheckSquare size={16} style={{ color: COLORS.forest }} />
                              ) : (
                                <Square size={16} style={{ color: COLORS.line }} />
                              )}
                              <span
                                className="text-[12.5px]"
                                style={{
                                  color: COLORS.ink,
                                  fontFamily: FONTS.MONO,
                                }}
                              >
                                {perm}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Save Button */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSavePermissions}
                disabled={saving}
                className="text-white font-semibold text-[13px] px-5 py-2.5 rounded-lg shadow-md flex items-center gap-2 hover:opacity-90 disabled:opacity-50 cursor-pointer"
                style={{
                  backgroundColor: COLORS.forest,
                  boxShadow: `0 4px 10px ${COLORS.forest}40`,
                }}
              >
                {saving && <Loader2 className="animate-spin" size={14} />}
                {saving ? "Saving..." : "Save Permissions"}
              </button>
            </div>
          </div>

          {/* RIGHT: Live summary of granted permissions */}
          <div
            className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
          >
            <ScallopBorder id="scallop-perm-right" colors={PETALS} />
            <h2
              className="font-bold text-[16px] mb-4"
              style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
            >
              Provided Permissions
            </h2>

            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
              {Object.entries(wingsCatalog).map(([wing, perms]) => {
                const granted = perms.filter((p) => state[wing]?.[p]);
                if (granted.length === 0) return null;

                return (
                  <div key={wing}>
                    <div
                      className="text-[12.5px] font-bold mb-1.5"
                      style={{
                        color: COLORS.forestDark,
                        fontFamily: FONTS.HEAD,
                      }}
                    >
                      {wing.replace("_", " ")}
                    </div>
                    <div className="space-y-1.5">
                      {granted.map((perm) => (
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
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* No Permissions Selected Fallback */}
              {!Object.values(state).some((wingState) =>
                Object.values(wingState).some(Boolean)
              ) && (
                <div className="text-[12.5px] text-center py-8" style={{ color: COLORS.muted }}>
                  No permissions currently granted for this role.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}