import React from "react";
import { ArrowLeft, CheckSquare, Square } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import {
  COLORS,
  PETALS,
  FONTS,
  BRANCH_AVAILABLE_PERMISSIONS,
  BRANCH_GRANTED_PERMISSIONS_DEFAULT,
} from "../../../constants";

export function BranchRolePermissionsPage({ role, onBack }) {
  const [checkedAvailable, setCheckedAvailable] = React.useState(
    Object.fromEntries(BRANCH_AVAILABLE_PERMISSIONS.map((p) => [p, false]))
  );
  const [granted, setGranted] = React.useState(BRANCH_GRANTED_PERMISSIONS_DEFAULT);

  const toggleAvailable = (perm) => {
    setCheckedAvailable((prev) => ({ ...prev, [perm]: !prev[perm] }));
  };

  const handleSave = () => {
    const newlyChecked = BRANCH_AVAILABLE_PERMISSIONS.filter(
      (p) => checkedAvailable[p] && !granted.includes(p)
    );
    if (newlyChecked.length > 0) {
      setGranted((prev) => [...prev, ...newlyChecked]);
    }
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[12.5px] font-semibold mb-4"
        style={{ color: COLORS.muted }}
      >
        <ArrowLeft size={14} /> Back to Branch User Role & Permissions
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* LEFT: assignable permission checkboxes */}
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
            Branch
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pb-2">
            {BRANCH_AVAILABLE_PERMISSIONS.map((perm) => {
              const checked = checkedAvailable[perm];
              return (
                <label
                  key={perm}
                  className="flex items-center gap-2 cursor-pointer select-none"
                  onClick={() => toggleAvailable(perm)}
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
                </label>
              );
            })}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSave}
              className="text-white font-semibold text-[13px] px-5 py-2.5 rounded-lg shadow-md"
              style={{
                backgroundColor: COLORS.purple,
                boxShadow: `0 4px 10px ${COLORS.purple}40`,
              }}
            >
              Save Permissions
            </button>
          </div>
        </div>

        {/* RIGHT: currently granted permissions */}
        <div
          className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
          style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        >
          <ScallopBorder id="scallop-branch-perm-right" colors={PETALS} />
          <h2
            className="font-bold text-[16px] mb-4"
            style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
          >
            Provided Permissions
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
          <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
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
      </div>
    </div>
  );
}