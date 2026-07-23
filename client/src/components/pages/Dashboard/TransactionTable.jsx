import React from "react";
import { FileText } from "lucide-react";
import { ScallopBorder } from "../../shared";
import { COLORS, PETALS, FONTS, TRANSACTIONS } from "../../../constants";

export function TransactionTable() {
  return (
    <div
      className="relative rounded-2xl p-5 pt-6 border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-trans" colors={PETALS} />
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h3
          className="font-bold text-[14.5px]"
          style={{ fontFamily: FONTS.HEAD }}
        >
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
            {TRANSACTIONS.map((t, i) => (
              <tr
                key={t.inv}
                style={
                  i !== TRANSACTIONS.length - 1
                    ? { borderBottom: `1px solid ${COLORS.line}` }
                    : undefined
                }
              >
                <td className="py-2.5 px-2.5">{t.inv}</td>
                <td className="py-2.5 px-2.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold"
                      style={{
                        backgroundColor: COLORS.purpleTint,
                        color: COLORS.purple,
                      }}
                    >
                      {t.initials}
                    </div>
                    {t.name}
                  </div>
                </td>
                <td className="py-2.5 px-2.5">{t.branch}</td>
                <td className="py-2.5 px-2.5">
                  <span
                    className="text-[10.5px] font-bold px-2.5 py-1 rounded-full"
                    style={
                      t.status === "Paid"
                        ? {
                            backgroundColor: COLORS.forestTint,
                            color: COLORS.forestDark,
                          }
                        : {
                            backgroundColor: COLORS.vermillionTint,
                            color: COLORS.vermillion,
                          }
                    }
                  >
                    {t.status}
                  </span>
                </td>
                <td
                  className="py-2.5 px-2.5 text-right font-bold"
                  style={{ fontFamily: FONTS.MONO }}
                >
                  ৳{t.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}