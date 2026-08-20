import React, { useState, useEffect } from "react";
import { FileText, Loader2 } from "lucide-react";
import { ScallopBorder } from "../../shared";
import { COLORS, PETALS, FONTS } from "../../../constants";
import { fetchRecentTransactions } from "../../../api/dashboardService";

function initialsOf(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "—";
}

export function TransactionTable({ branchId, limit = 10 }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRecentTransactions({ branch_id: branchId, limit });
      setTransactions(data || []);
    } catch (err) {
      console.error("Error loading recent transactions:", err);
      setError("সাম্প্রতিক লেনদেন লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [branchId, limit]);

  return (
    <div
      className="relative rounded-2xl p-5 pt-6 border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-trans" colors={PETALS} />
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h3 className="font-bold text-[14.5px]" style={{ fontFamily: FONTS.HEAD }}>
          Sell & Customers — সাম্প্রতিক লেনদেন
        </h3>
        <button
          className="text-white font-semibold text-[12.5px] px-3.5 py-2 rounded-lg flex items-center gap-1.5"
          style={{ backgroundColor: COLORS.plum }}
        >
          <FileText size={13} /> Generate Report
        </button>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-slate-500 gap-2">
            <Loader2 className="animate-spin" size={20} />
            <span className="text-[12.5px]">লোড হচ্ছে...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500 text-[12.5px]">{error}</div>
        ) : (
          <table className="w-full text-[12.8px]">
            <thead>
              <tr className="text-left" style={{ color: COLORS.muted }}>
                {["Invoice", "Customer", "Branch", "Status"].map((h) => (
                  <th
                    key={h}
                    className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                    style={{ borderColor: COLORS.line }}
                  >
                    {h}
                  </th>
                ))}
                <th
                  className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-right"
                  style={{ borderColor: COLORS.line }}
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    কোন লেনদেন পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                transactions.map((t, i) => (
                  <tr
                    key={t.invoice}
                    style={i !== transactions.length - 1 ? { borderBottom: `1px solid ${COLORS.line}` } : undefined}
                  >
                    <td className="py-2.5 px-2.5">{t.invoice}</td>
                    <td className="py-2.5 px-2.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold"
                          style={{ backgroundColor: COLORS.purpleTint, color: COLORS.purple }}
                        >
                          {initialsOf(t.customer)}
                        </div>
                        {t.customer}
                      </div>
                    </td>
                    <td className="py-2.5 px-2.5">{t.branch}</td>
                    <td className="py-2.5 px-2.5">
                      <span
                        className="text-[10.5px] font-bold px-2.5 py-1 rounded-full"
                        style={
                          t.status === "Paid"
                            ? { backgroundColor: COLORS.forestTint, color: COLORS.forestDark }
                            : { backgroundColor: COLORS.vermillionTint, color: COLORS.vermillion }
                        }
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-bold" style={{ fontFamily: FONTS.MONO }}>
                      ৳{Number(t.amount).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}