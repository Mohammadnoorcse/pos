import React from "react";
import { Construction } from "lucide-react";
import { ScallopBorder } from "../shared";
import { COLORS, PETALS, FONTS } from "../../constants";

export function ComingSoonPage({ label }) {
  return (
    <div
      className="relative rounded-2xl border p-14 flex flex-col items-center justify-center text-center gap-3 overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-comingsoon" colors={PETALS} />
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: COLORS.marigoldTint, color: COLORS.rust }}
      >
        <Construction size={24} />
      </div>
      <h2
        className="font-bold text-[16px]"
        style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
      >
        {label}
      </h2>
      <p className="text-[13px] max-w-sm" style={{ color: COLORS.muted }}>
        এই সেকশনটি এখনও তৈরি হচ্ছে। শীঘ্রই এখানে {label} সম্পর্কিত তথ্য দেখা যাবে।
      </p>
    </div>
  );
}