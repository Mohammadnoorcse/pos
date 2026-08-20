import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ScallopBorder } from "../../shared";
import { COLORS, PETALS, FONTS } from "../../../constants";
import { fetchStockAlerts } from "../../../api/dashboardService";

export function StockAlertSection({ branchId }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchStockAlerts({ branch_id: branchId, per_page: 10 });
      // StockAlertController returns a Laravel paginator: { data: [...] }
      const rows = (data?.data || []).map((row) => ({
        name: row.title,
        branch: branchId ? "This branch" : "All branches",
        qty: row.current_stock,
      }));
      setAlerts(rows);
    } catch (err) {
      console.error("Error loading stock alerts:", err);
      setError("স্টক অ্যালার্ট লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [branchId]);

  return (
    <div
      className="relative rounded-2xl p-5 pt-6 border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-stock" colors={PETALS} />
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-[14.5px]" style={{ fontFamily: FONTS.HEAD }}>
          Stock Alert — কম মজুদ পণ্য
        </h3>
        <span
          className="text-[10.5px] font-bold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: COLORS.marigoldTint, color: COLORS.rust }}
        >
          {alerts.length} Items
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8 text-slate-500 gap-2">
          <Loader2 className="animate-spin" size={18} />
          <span className="text-[12.5px]">লোড হচ্ছে...</span>
        </div>
      ) : error ? (
        <div className="text-center py-6 text-red-500 text-[12.5px]">{error}</div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-6 text-gray-400 text-[12.5px]">
          কোন লো-স্টক পণ্য নেই।
        </div>
      ) : (
        <div>
          {alerts.map((s, i) => (
            <div
              key={`${s.name}-${i}`}
              className="flex items-center justify-between py-2.5"
              style={i !== alerts.length - 1 ? { borderBottom: `1px dashed ${COLORS.line}` } : undefined}
            >
              <div>
                <div className="text-[13px] font-semibold">{s.name}</div>
                <div className="text-[11.5px]" style={{ color: COLORS.muted }}>
                  Branch: {s.branch}
                </div>
              </div>
              <span
                className="text-[12.5px] font-bold px-2.5 py-1 rounded-lg"
                style={{ backgroundColor: COLORS.rustTint, color: COLORS.rust, fontFamily: FONTS.MONO }}
              >
                {s.qty}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}