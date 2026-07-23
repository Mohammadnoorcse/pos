import React from "react";
import { ScallopBorder } from "../../shared";
import { COLORS, PETALS, FONTS, STOCK_ALERTS } from "../../../constants";

export function StockAlertSection() {
  return (
    <div
      className="relative rounded-2xl p-5 pt-6 border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-stock" colors={PETALS} />
      <div className="flex items-center justify-between mb-1">
        <h3
          className="font-bold text-[14.5px]"
          style={{ fontFamily: FONTS.HEAD }}
        >
          Stock Alert — কম মজুদ পণ্য
        </h3>
        <span
          className="text-[10.5px] font-bold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: COLORS.marigoldTint, color: COLORS.rust }}
        >
          {STOCK_ALERTS.length} Items
        </span>
      </div>
      <div>
        {STOCK_ALERTS.map((s, i) => (
          <div
            key={s.name}
            className="flex items-center justify-between py-2.5"
            style={
              i !== STOCK_ALERTS.length - 1
                ? { borderBottom: `1px dashed ${COLORS.line}` }
                : undefined
            }
          >
            <div>
              <div className="text-[13px] font-semibold">{s.name}</div>
              <div className="text-[11.5px]" style={{ color: COLORS.muted }}>
                Branch: {s.branch}
              </div>
            </div>
            <span
              className="text-[12.5px] font-bold px-2.5 py-1 rounded-lg"
              style={{
                backgroundColor: COLORS.rustTint,
                color: COLORS.rust,
                fontFamily: FONTS.MONO,
              }}
            >
              {s.qty}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}