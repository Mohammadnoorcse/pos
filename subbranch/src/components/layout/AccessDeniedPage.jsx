import React from "react";
import { ShieldOff } from "lucide-react";
import { COLORS, FONTS } from "../../constants";

export function AccessDeniedPage({ label }) {
  return (
    <div
      className="relative rounded-2xl p-10 border flex flex-col items-center justify-center text-center gap-3"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line, minHeight: 260 }}
    >
      <ShieldOff size={32} style={{ color: COLORS.vermillion }} />
      <h2 className="font-bold text-[16px]" style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}>
        Access Denied
      </h2>
      <p className="text-[13px]" style={{ color: COLORS.muted }}>
        এই পেজ ({label}) দেখার অনুমতি আপনার নেই। প্রয়োজন হলে owner/admin-এর সাথে যোগাযোগ করুন।
      </p>
    </div>
  );
}