import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ScallopBorder } from "../../shared";
import { COLORS, PETALS, FONTS, SALES_TREND } from "../../../constants";

export function SalesChart() {
  return (
    <div
      className="relative rounded-2xl p-5 pt-6 border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-chart" colors={PETALS} />
      <div className="flex items-center justify-between mb-3">
        <h3
          className="font-bold text-[14.5px]"
          style={{ fontFamily: FONTS.HEAD }}
        >
          বিক্রয় প্রবণতা — গত ৭ দিন
        </h3>
        <span
          className="text-[10.5px] font-bold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: COLORS.forestTint, color: COLORS.forestDark }}
        >
          ▲ ১৮% বৃদ্ধি
        </span>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={SALES_TREND}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="salesFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={COLORS.magenta} stopOpacity={0.3} />
                <stop
                  offset="100%"
                  stopColor={COLORS.marigold}
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={COLORS.line} vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: COLORS.muted }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{
                fontSize: 10.5,
                fontFamily: "monospace",
                fill: COLORS.muted,
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `৳${v / 1000}k`}
            />
            <Tooltip
              formatter={(v) => [`৳${v.toLocaleString()}`, "বিক্রয়"]}
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: `1px solid ${COLORS.line}`,
              }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke={COLORS.magenta}
              strokeWidth={2.5}
              fill="url(#salesFill)"
              dot={{ r: 4, fill: COLORS.magenta }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}