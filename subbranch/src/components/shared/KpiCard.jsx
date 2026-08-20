import React from "react";
import { ScallopBorder } from "./ScallopBorder";
import { COLORS, PETALS, FONTS } from "../../constants";

export function KpiCard({ item, patternId }) {
  const Icon = item.icon;

  return (
    <div
      className="relative rounded-2xl border p-4 pt-5 overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id={patternId} colors={PETALS} />

      <div className="flex items-center justify-between mb-3 mt-1">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: item.bg, color: item.fg }}
        >
          <Icon size={16} strokeWidth={2.2} />
        </div>
        <span
          className="text-[11px] font-bold"
          style={{
            color: item.up ? COLORS.forest : COLORS.vermillion,
            fontFamily: FONTS.MONO,
          }}
        >
          {item.up ? "▲" : "▼"} {item.trend}
        </span>
      </div>

      <div
        className="text-[12px] font-semibold mb-1"
        style={{ color: COLORS.muted, fontFamily: FONTS.BODY }}
      >
        {item.label}
      </div>

      <div
        className="text-[21px] font-bold tracking-tight"
        style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}
      >
        {!item.noCurrency && (
          <span
            className="text-[13px] font-semibold mr-0.5"
            style={{ color: COLORS.muted }}
          >
            ৳
          </span>
        )}
        {item.value}
      </div>
    </div>
  );
}