import React from "react";
import { Search, ChevronLeft, ChevronRight, AlertCircle, Printer } from "lucide-react";
import { COLORS, FONTS } from "../../constants";

// Colors pulled directly from your existing constants file — same tokens as
// PurchasePage.jsx / SupplierInvoicesPage.jsx (magenta / paper / panel / ink / muted / vermillion).
const magentaSoft = COLORS.magentaSoft || `${COLORS.magenta}1A`;
const vermillionSoft = `${COLORS.vermillion}1A`;

const DUE_PURCHASES = [
  { date: "27-04-2025", name: "Matador", phone: "01784848944", company: "Matador BD", amount: 6500, paid: 5000, inv: "STB/230710646/98" },
  { date: "19-04-2025", name: "kudus", phone: "01789654131", company: "7up", amount: 6000, paid: 990, inv: "STB/230710646/97" },
  { date: "10-04-2025", name: "Siraj", phone: "01717777744", company: "Siraj Enterprise", amount: 5100, paid: 0, inv: "STB/230710646/96" },
  { date: "10-04-2025", name: "Siraj", phone: "01717777744", company: "Siraj Enterprise", amount: 1500, paid: 0, inv: "STB/230710646/95" },
  { date: "28-03-2025", name: "Sohag Ahmed", phone: "01766554433", company: "Cock", amount: 4800, paid: 2000, inv: "STB/230710646/93" },
  { date: "15-03-2025", name: "nazrul", phone: "01655221199", company: "Allahr Dan 4", amount: 3300, paid: 1000, inv: "STB/230710646/91" },
].map((r) => ({ ...r, due: r.amount - r.paid }))
  .filter((r) => r.due > 0);

function agingLabel(dateStr) {
  const [d, m, y] = dateStr.split("-").map(Number);
  const days = Math.floor((Date.now() - new Date(y, m - 1, d).getTime()) / 86400000);
  if (days > 60) return { label: `${days}d overdue`, tone: "danger" };
  if (days > 30) return { label: `${days}d`, tone: "warn" };
  return { label: `${days}d`, tone: "ok" };
}

function AgingPill({ dateStr }) {
  const { label, tone } = agingLabel(dateStr);
  const styles =
    tone === "danger"
      ? { backgroundColor: vermillionSoft, color: COLORS.vermillion }
      : tone === "warn"
      ? { backgroundColor: "#FFF4E0", color: "#B8790A" }
      : { backgroundColor: "#E9F7EE", color: "#1E8A4C" };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold" style={styles}>
      {label}
    </span>
  );
}

export function DuePurchaseReportPage() {
  const [query, setQuery] = React.useState("");
  const [perPage, setPerPage] = React.useState(100);

  const filtered = DUE_PURCHASES.filter((r) =>
    [r.name, r.company, r.inv, r.phone].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  const totals = filtered.reduce(
    (acc, r) => ({
      amount: acc.amount + r.amount,
      paid: acc.paid + r.paid,
      due: acc.due + r.due,
    }),
    { amount: 0, paid: 0, due: 0 }
  );

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {[
          { label: "Total purchase amount", value: totals.amount, color: COLORS.ink },
          { label: "Total paid", value: totals.paid, color: "#1E8A4C" },
          { label: "Total due", value: totals.due, color: COLORS.vermillion },
        ].map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border p-4"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
          >
            <div className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
              {c.label}
            </div>
            <div className="text-[22px] font-bold mt-1" style={{ color: c.color, fontFamily: FONTS.MONO }}>
              {c.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
      >
        {/* Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-5 border-b"
          style={{ borderColor: COLORS.line }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: vermillionSoft }}
            >
              <AlertCircle size={16} style={{ color: COLORS.vermillion }} />
            </div>
            <div>
              <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>
                Due Purchase Report
              </h1>
              <p className="text-[12px]" style={{ color: COLORS.muted }}>
                {filtered.length} supplier invoice{filtered.length !== 1 ? "s" : ""} with outstanding balance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-[13px]" style={{ color: COLORS.muted }}>
              <span>Show</span>
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="rounded-md px-2 py-1.5 border text-[13px] outline-none"
                style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.paper }}
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span>entries</span>
            </div>

            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2 border w-full sm:w-64"
              style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper }}
            >
              <Search size={14} style={{ color: COLORS.muted }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search supplier"
                className="bg-transparent outline-none text-[13px] w-full"
                style={{ color: COLORS.ink }}
              />
            </div>

            <button
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-white"
              style={{ backgroundColor: COLORS.magenta }}
            >
              <Printer size={14} />
              Print
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr>
                {["Date", "Supplier info", "Purchase amount", "Paid", "Due", "Aging", "Inv num."].map((h) => (
                  <th
                    key={h}
                    className="text-left font-semibold text-[11px] uppercase tracking-wide px-5 py-3 text-white"
                    style={{ backgroundColor: COLORS.magenta }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, perPage).map((row, i) => (
                <tr
                  key={i}
                  className="border-b hover:bg-black/[0.02] transition-colors"
                  style={{ borderColor: COLORS.line }}
                >
                  <td className="px-5 py-3.5 align-top whitespace-nowrap" style={{ color: COLORS.ink, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                    {row.date}
                  </td>
                  <td className="px-5 py-3.5 align-top">
                    <div className="font-semibold" style={{ color: COLORS.ink }}>
                      {row.name}
                    </div>
                    <div className="text-[11.5px] mt-0.5" style={{ color: COLORS.muted }}>
                      Phone: {row.phone}
                    </div>
                    <div className="text-[11.5px]" style={{ color: COLORS.muted }}>
                      Company Name: {row.company}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 align-top font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                    {row.amount.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 align-top" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                    {row.paid.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 align-top font-bold" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>
                    {row.due.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 align-top">
                    <AgingPill dateStr={row.date} />
                  </td>
                  <td className="px-5 py-3.5 align-top">
                    <button
                      className="font-semibold hover:underline"
                      style={{ color: COLORS.magenta, fontFamily: FONTS.MONO, fontSize: 12.5 }}
                    >
                      {row.inv}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[13px]" style={{ color: COLORS.muted }}>
                    No due purchases found.
                  </td>
                </tr>
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr style={{ backgroundColor: magentaSoft }}>
                  <td colSpan={2} className="px-5 py-3 font-bold text-[12px] uppercase tracking-wide" style={{ color: COLORS.ink }}>
                    Total
                  </td>
                  <td className="px-5 py-3 font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                    {totals.amount.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                    {totals.paid.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 font-bold" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>
                    {totals.due.toLocaleString()}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Footer / pagination */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t text-[13px]"
          style={{ borderColor: COLORS.line, color: COLORS.muted }}
        >
          <span>
            Showing 1 to {Math.min(perPage, filtered.length)} of {filtered.length} entries
          </span>
          <div className="flex items-center gap-1.5">
            <button
              className="w-8 h-8 rounded-md border flex items-center justify-center disabled:opacity-40"
              style={{ borderColor: COLORS.line, color: COLORS.muted }}
              disabled
            >
              <ChevronLeft size={14} />
            </button>
            <span
              className="w-8 h-8 rounded-md flex items-center justify-center font-semibold text-white"
              style={{ backgroundColor: COLORS.magenta }}
            >
              1
            </span>
            <button
              className="w-8 h-8 rounded-md border flex items-center justify-center"
              style={{ borderColor: COLORS.line, color: COLORS.ink }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DuePurchaseReportPage;