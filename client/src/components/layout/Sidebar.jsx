import React from "react";
import { ChevronDown, ChevronRight, ArrowLeft } from "lucide-react";
import { NAV_ITEMS } from "../../constants";
import { SUPPLIER_NAV_ITEMS } from "../../constants";
import { GODOWN_NAV_ITEMS } from "../../constants";
import { ACC_NAV_ITEMS } from "../../constants";


import { COLORS, FONTS } from "../../constants";

// Map wing id -> { title, items }. Add more wings here as you build them
// (Acc & Transaction Wing, etc.) following the same shape.
const WINGS = {
  supplier: { title: "Supplier Wing", items: SUPPLIER_NAV_ITEMS },
  godowns: { title: "Godowns Wing", items: GODOWN_NAV_ITEMS },
  acc: { title: "Acc & Transaction Wing", items: ACC_NAV_ITEMS }
};

export function Sidebar({ activePage, onNavigate, wing, onBack }) {
  const [openId, setOpenId] = React.useState("shop-setting");

  const activeWing = wing ? WINGS[wing] : null;
  const items = activeWing ? activeWing.items : NAV_ITEMS;

  return (
    <nav className="space-y-0.5 overflow-y-auto pr-2">
      {activeWing && (
        <div
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2.5 mb-2 rounded-lg text-[12.5px] font-semibold cursor-pointer transition-colors hover:bg-white/5"
          style={{ color: COLORS.marigold }}
        >
          <ArrowLeft size={14} className="shrink-0" />
          <span className="truncate">{activeWing.title}</span>
        </div>
      )}

      {items.map((item) => {
        const Icon = item.icon;
        const isExpandable = item.type === "expandable";
        const isOpen = openId === item.id;
        const isActive = item.page && item.page === activePage;

        return (
          <div key={item.id}>
            <div
              onClick={() => {
                if (isExpandable) setOpenId(isOpen ? null : item.id);
                else if (item.page) onNavigate(item.page);
              }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium cursor-pointer transition-colors hover:bg-white/5 hover:text-white"
              style={
                isActive
                  ? {
                      backgroundColor: `${COLORS.marigold}2E`,
                      color: "#fff",
                      boxShadow: `inset 3px 0 0 0 ${COLORS.marigold}`,
                    }
                  : { color: "#E7D9E0" }
              }
            >
              <Icon size={15} className="opacity-90 shrink-0" />
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <span
                  className="ml-auto shrink-0 text-white text-[9.5px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: COLORS.mint }}
                >
                  {item.badge}
                </span>
              )}
              {isExpandable && !item.badge && (
                <ChevronDown
                  size={13}
                  className="ml-auto shrink-0 transition-transform"
                  style={{
                    transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
                    opacity: 0.7,
                  }}
                />
              )}
            </div>

            {isExpandable && isOpen && item.children && item.children.length > 0 && (
              <div
                className="ml-3.5 pl-3.5 py-1 space-y-0.5"
                style={{ borderLeft: "1px solid rgba(231,217,224,0.15)" }}
              >
                {item.children.map((child) => {
                  const childActive = child.page === activePage;
                  return (
                    <div
                      key={child.label}
                      onClick={() => child.page && onNavigate(child.page)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12.5px] font-medium cursor-pointer hover:bg-white/5 hover:text-white"
                      style={{
                        color: childActive
                          ? "#fff"
                          : child.tint
                          ? COLORS.mint
                          : "#D8C7D2",
                        backgroundColor: childActive
                          ? "rgba(255,255,255,0.06)"
                          : "transparent",
                      }}
                    >
                      <ChevronRight size={12} className="opacity-70 shrink-0" />
                      <span className="truncate">{child.label}</span>
                      {child.badge && (
                        <span
                          className="ml-auto shrink-0 text-[10px] font-bold"
                          style={{ color: COLORS.marigold }}
                        >
                          ({child.badge})
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}