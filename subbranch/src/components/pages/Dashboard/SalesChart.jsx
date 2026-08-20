import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";
import { ScallopBorder } from "../../shared";
import { COLORS, PETALS, FONTS } from "../../../constants";
import { fetchSalesTrend } from "../../../api/dashboardService";

export function SalesChart({ branchId, days = 7 }) {
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTrend = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSalesTrend({ branch_id: branchId, days });
      // API returns [{ date, sales }] — map to chart-friendly { day, sales }
      const mapped = (data || []).map((row) => ({
        day: new Date(row.date).toLocaleDateString("bn-BD", { weekday: "short" }),
        sales: row.sales,
      }));
      setTrend(mapped);
    } catch (err) {
      console.error("Error loading sales trend:", err);
      setError("বিক্রয় প্রবণতা লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrend();
  }, [branchId, days]);

  const growthPct = (() => {
    if (trend.length < 2) return null;
    const first = trend[0].sales || 0;
    const last = trend[trend.length - 1].sales || 0;
    if (!first) return null;
    return Math.round(((last - first) / first) * 100);
  })();

  return (
    <div
      className="relative rounded-2xl p-5 pt-6 border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-chart" colors={PETALS} />
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-[14.5px]" style={{ fontFamily: FONTS.HEAD }}>
          বিক্রয় প্রবণতা — গত {days} দিন
        </h3>
        {growthPct !== null && (
          <span
            className="text-[10.5px] font-bold px-2.5 py-1 rounded-full"
            style={
              growthPct >= 0
                ? { backgroundColor: COLORS.forestTint, color: COLORS.forestDark }
                : { backgroundColor: COLORS.vermillionTint, color: COLORS.vermillion }
            }
          >
            {growthPct >= 0 ? "▲" : "▼"} {Math.abs(growthPct)}% {growthPct >= 0 ? "বৃদ্ধি" : "হ্রাস"}
          </span>
        )}
      </div>

      <div className="h-56">
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-500 gap-2">
            <Loader2 className="animate-spin" size={18} />
            <span className="text-[12.5px]">লোড হচ্ছে...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500 text-[12.5px]">
            {error}
          </div>
        ) : trend.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-[12.5px]">
            কোন ডাটা পাওয়া যায়নি।
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.magenta} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={COLORS.marigold} stopOpacity={0.02} />
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
                tick={{ fontSize: 10.5, fontFamily: "monospace", fill: COLORS.muted }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `৳${v / 1000}k`}
              />
              <Tooltip
                formatter={(v) => [`৳${v.toLocaleString()}`, "বিক্রয়"]}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${COLORS.line}` }}
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
        )}
      </div>
    </div>
  );
}