import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { COLORS, FONTS } from "../../constants";

export function MainLayout({ children, activePage, onNavigate, user, onLogout }) {
  const [wing, setWing] = useState(null);

  const businessName = user?.branch?.name || "My Business";

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: COLORS.paper }}>
      <aside
        className="w-64 shrink-0 p-4 hidden md:flex md:flex-col"
        style={{
          background: `linear-gradient(180deg, ${COLORS.plum} 0%, ${COLORS.plumLight} 100%)`,
          color: "#E7D9E0",
        }}
      >
        <div className="flex items-center gap-2.5 px-1.5 pb-4 mb-3 border-b border-white/10">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C9 6 6 8.5 6 12.5C6 16 8.7 19 12 19C15.3 19 18 16 18 12.5C18 8.5 15 6 12 2Z" fill={COLORS.marigold} />
            <path d="M12 19C12 19 9 21 9 22.2C9 22.6 9.4 23 12 23C14.6 23 15 22.6 15 22.2C15 21 12 19 12 19Z" fill={COLORS.peacock} />
          </svg>
          <span className="font-bold text-white text-[17px] tracking-tight" style={{ fontFamily: FONTS.HEAD }}>
            {businessName}
          </span>
        </div>

        <Sidebar
          activePage={activePage}
          onNavigate={onNavigate}
          wing={wing}
          onBack={() => setWing(null)}
          user={user}
        />
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar
          user={user}
          onLogout={onLogout}
          onWingSelect={(wingId) => {
            setWing(wingId);
            if (wingId === null) onNavigate("dashboard");
          }}
          onSellClick={() => onNavigate("sell")}
        />
        <div className="p-4 md:p-7 space-y-5 overflow-auto flex-1">{children}</div>
      </div>
    </div>
  );
}