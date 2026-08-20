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
  UserPlus,
  LogOut,
} from "lucide-react";
import { useClock } from "../../hooks";
import { COLORS, FONTS } from "../../constants";
import { RegisterForm } from "../../AuthPages";

const API_BASE = import.meta.env.VITE_API_URL;

const wingItems = [
  { id: "main", label: "Main Dashboard", icon: Home, tint: true },
  { id: "supplier", label: "Supplier Wing", icon: Users, tint: false },
  { id: "acc", label: "Acc & Transaction Wing", icon: Receipt, tint: false },
  
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

function RegisterModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-16 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-stone-950 border border-stone-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-stone-800">
          <h2 className="text-sm font-semibold text-stone-100">Register New User</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-200">
            <X size={16} />
          </button>
        </div>
        <RegisterForm onSuccess={onClose} />
      </div>
    </div>
  );
}

function UserMenu({ user, initials, onLogout }) {
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    setOpen(false);
    const token = localStorage.getItem("token");
    try {
      if (token) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      }
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      onLogout && onLogout();
    }
  };

  return (
    <div className="relative hidden lg:block">
      <div
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 border rounded-lg text-[13px] font-semibold cursor-pointer"
        style={{ borderColor: COLORS.line }}
      >
        <div
          className="w-7 h-7 rounded-lg text-white flex items-center justify-center text-[11px] font-bold"
          style={{ background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.magenta})` }}
        >
          {initials}
        </div>
        {user?.name || "Guest"} <ChevronDown size={13} />
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-2 w-44 rounded-lg border shadow-lg z-50 overflow-hidden"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
          >
            <div className="px-3.5 py-2.5 border-b" style={{ borderColor: COLORS.line }}>
              <p className="text-[12.5px] font-semibold" style={{ color: COLORS.ink }}>
                {user?.name}
              </p>
              <p className="text-[11px] capitalize" style={{ color: COLORS.muted }}>
                {user?.user_type}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3.5 py-2.5 text-[12.5px] font-medium text-red-500 hover:bg-red-500/10"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function Topbar({ onWingSelect, onSellClick, user, onLogout }) {
  const clock = useClock();
  const [wingsOpen, setWingsOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const canRegister = user?.user_type === "owner" || user?.user_type === "admin";
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

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

        {canRegister && (
          <button
            onClick={() => setRegisterOpen(true)}
            className="text-white font-semibold text-[13px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md"
            style={{ backgroundColor: "#2E7D32", boxShadow: "0 4px 10px #2E7D3240" }}
          >
            <UserPlus size={14} /> Register
          </button>
        )}

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

        <UserMenu user={user} initials={initials} onLogout={onLogout} />
      </div>

      <WingsModal
        open={wingsOpen}
        onClose={() => setWingsOpen(false)}
        onSelect={(id) => {
          onWingSelect && onWingSelect(id === "main" ? null : id);
        }}
      />
      <RegisterModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
    </div>
  );
}