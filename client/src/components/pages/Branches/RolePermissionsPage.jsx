import React from "react";
import { ArrowLeft, ChevronDown, CheckSquare, Square } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { COLORS, PETALS, FONTS, PERMISSION_WINGS } from "../../../constants";

function defaultPermissionState() {
  const state = {};
  Object.entries(PERMISSION_WINGS).forEach(([wing, perms]) => {
    state[wing] = {};
    perms.forEach((p) => {
      const startsUnchecked = [
        "account.bank.and.cash",
        "account.capital",
        "account.customer.report",
        "account.dashboard",
      ];
      state[wing][p] = !startsUnchecked.includes(p);
    });
  });
  return state;
}

export function RolePermissionsPage({ role, onBack }) {
  const [openWing, setOpenWing] = React.useState("Account_Wing");
  const [state, setState] = React.useState(defaultPermissionState);

  const toggle = (wing, perm) => {
    setState((prev) => ({
      ...prev,
      [wing]: { ...prev[wing], [perm]: !prev[wing][perm] },
    }));
  };

  const wingHeaderColors = {
    Account_Wing: COLORS.peacock,
    Godown_Wing: COLORS.purple,
    Main_Wing: COLORS.magenta,
    Supplier_Wing: COLORS.rust,
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[12.5px] font-semibold mb-4"
        style={{ color: COLORS.muted }}
      >
        <ArrowLeft size={14} /> Back to Admin Helper Roles
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* LEFT: editable permission tree */}
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
            {Object.entries(PERMISSION_WINGS).map(([wing, perms], idx) => {
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
                    className="w-full flex items-center justify-between py-3 text-left"
                  >
                    <span
                      className="text-[13.5px] font-bold"
                      style={{
                        color: isOpen ? COLORS.ink : wingHeaderColors[wing],
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
                        const checked = state[wing][perm];
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

          <div className="pt-4 flex justify-end">
            <button
              className="text-white font-semibold text-[13px] px-5 py-2.5 rounded-lg shadow-md"
              style={{
                backgroundColor: COLORS.forest,
                boxShadow: `0 4px 10px ${COLORS.forest}40`,
              }}
            >
              Save Permissions
            </button>
          </div>
        </div>

        {/* RIGHT: live summary of granted permissions */}
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
            {Object.entries(PERMISSION_WINGS).map(([wing, perms]) => {
              const granted = perms.filter((p) => state[wing][p]);
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
                        <CheckSquare size={14} style={{ color: COLORS.forest }} className="shrink-0" />
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
          </div>
        </div>
      </div>
    </div>
  );
}