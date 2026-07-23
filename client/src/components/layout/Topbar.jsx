import React, { useState } from "react";
import {
  Search,
  Bell,
  MessageCircle,
  ShoppingCart,
  ChevronDown,
  X,
  Users,
  Warehouse,
  Receipt,
  Home,
} from "lucide-react";
import { useClock } from "../../hooks";
import { COLORS, FONTS } from "../../constants";

const wingItems = [
  { id: "supplier", label: "Supplier Wing", icon: Users, tint: true },
  { id: "godowns", label: "Godowns Wing", icon: Warehouse, tint: false },
  { id: "acc", label: "Acc & Transaction Wing", icon: Receipt, tint: false },
  { id: "main", label: "Main Dashboard", icon: Home, tint: false },
];

function WingCard({ icon: Icon, label, tint, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 rounded-xl border py-7 px-4 transition-transform hover:-translate-y-0.5 hover:shadow-md"
      style={{
        backgroundColor: tint ? COLORS.paper : "#FAFAFC",
        borderColor: COLORS.line,
      }}
    >
      <Icon size={30} style={{ color: COLORS.purple }} strokeWidth={2} />
      <span
        className="text-[14px] font-semibold"
        style={{ color: COLORS.ink, fontFamily: FONTS.BODY }}
      >
        {label}
      </span>
    </button>
  );
}

function WingsModal({ open, onClose, onSelect }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-24"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: COLORS.panel }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ backgroundColor: "#3A3D4D" }}
        >
          <h2
            className="text-[13px] font-bold tracking-wide text-white"
            style={{ fontFamily: FONTS.BODY }}
          >
            OTHERS WINGS
          </h2>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 p-5" style={{ backgroundColor: "#fff" }}>
          {wingItems.map((it) => (
            <WingCard
              key={it.label}
              icon={it.icon}
              label={it.label}
              tint={it.tint}
              onClick={() => {
                onSelect && onSelect(it.id);
                onClose();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* onWingSelect  -> opens the "Others Wings" picker modal (Supplier / Godowns / Acc / Main)
   onSellClick   -> navigates straight to the Sell (POS) page, no modal
   These were previously collapsed into the same handler on 3 near-duplicate
   buttons; split apart so SELL actually routes to the sell screen. */
export function Topbar({ onWingSelect, onSellClick }) {
  const clock = useClock();
  const [wingsOpen, setWingsOpen] = useState(false);

  return (
    <div
      className="border-b px-4 md:px-7 py-3 flex items-center gap-4"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <div
        className="flex-1 max-w-md hidden sm:flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] border"
        style={{
          backgroundColor: COLORS.paper,
          borderColor: COLORS.line,
          color: COLORS.muted,
        }}
      >
        <Search size={15} />
        <input
          className="bg-transparent outline-none flex-1 text-[13px]"
          style={{ color: COLORS.ink, fontFamily: FONTS.BODY }}
          placeholder="খুঁজুন — product, invoice, customer…"
        />
      </div>

      <div className="flex items-center gap-2.5 md:gap-3.5 ml-auto">
        <div
          className="text-[12.5px] font-semibold px-3 py-2 rounded-lg hidden sm:block"
          style={{
            backgroundColor: COLORS.forestTint,
            color: COLORS.forestDark,
            fontFamily: FONTS.MONO,
          }}
        >
          {clock}
        </div>

        <button
          className="relative w-9 h-9 rounded-lg border flex items-center justify-center"
          style={{
            backgroundColor: COLORS.paper,
            borderColor: COLORS.line,
            color: COLORS.ink,
          }}
        >
          <Bell size={15} />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ring-2"
            style={{
              backgroundColor: COLORS.vermillion,
              boxShadow: `0 0 0 2px ${COLORS.panel}`,
            }}
          />
        </button>

        <button
          className="w-9 h-9 rounded-lg border items-center justify-center hidden sm:flex"
          style={{
            backgroundColor: COLORS.paper,
            borderColor: COLORS.line,
            color: COLORS.ink,
          }}
        >
          <MessageCircle size={15} />
        </button>

        {/* Opens the wings picker modal */}
        <button
          onClick={() => setWingsOpen(true)}
          className="text-white font-semibold text-[13px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md"
          style={{
            backgroundColor: COLORS.magenta,
            boxShadow: `0 4px 10px ${COLORS.magenta}40`,
          }}
        >
          <ShoppingCart size={14} /> Wing
        </button>

        {/* Goes straight to the Sell page — no modal */}
        <button
          onClick={() => onSellClick && onSellClick()}
          className="text-white font-semibold text-[13px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md"
          style={{
            backgroundColor: COLORS.magenta,
            boxShadow: `0 4px 10px ${COLORS.magenta}40`,
          }}
        >
          <ShoppingCart size={14} /> SELL
        </button>

        <div
          className="hidden lg:flex items-center gap-2 pl-1.5 pr-3 py-1.5 border rounded-lg text-[13px] font-semibold cursor-pointer"
          style={{ borderColor: COLORS.line }}
        >
          <div
            className="w-7 h-7 rounded-lg text-white flex items-center justify-center text-[11px] font-bold"
            style={{
              background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.magenta})`,
            }}
          >
            SM
          </div>
          SOHAG AHMED MOON <ChevronDown size={13} />
        </div>
      </div>

      <WingsModal
        open={wingsOpen}
        onClose={() => setWingsOpen(false)}
        onSelect={(id) => {
          onWingSelect && onWingSelect(id === "main" ? null : id);
        }}
      />
    </div>
  );
}