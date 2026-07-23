import React from "react";
import { Search, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { COLORS, FONTS } from "../../constants";

// Colors below are pulled directly from your existing constants file —
// same magenta / paper / panel / ink / muted / vermillion tokens as PurchasePage.jsx.
// (magentaSoft is derived here only because "Paid" pill needs a light tint of magenta;
// if you already have a soft/tint token in constants.js, swap this line to use it instead.)
const magentaSoft = COLORS.magentaSoft || `${COLORS.magenta}1A`;

const INVOICES = [
  { date: "27-04-2025", name: "Matador", phone: "01784848944", company: "Matador BD", amount: 6500, paid: 5000, inv: "STB/230710646/98" },
  { date: "19-04-2025", name: "kudus", phone: "01789654131", company: "7up", amount: 6000, paid: 990, inv: "STB/230710646/97" },
  { date: "10-04-2025", name: "Siraj", phone: "01717777744", company: "Siraj Enterprise", amount: 5100, paid: 0, inv: "STB/230710646/96" },
  { date: "10-04-2025", name: "Siraj", phone: "01717777744", company: "Siraj Enterprise", amount: 1500, paid: 0, inv: "STB/230710646/95" },
  { date: "02-04-2025", name: "Rahmat Ali", phone: "01911223344", company: "Microlab", amount: 3200, paid: 3200, inv: "STB/230710646/94" },
  { date: "28-03-2025", name: "Sohag Ahmed", phone: "01766554433", company: "Cock", amount: 4800, paid: 2000, inv: "STB/230710646/93" },
];

function StatusPill({ amount, paid }) {
  const due = amount - paid;
  if (due <= 0)
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
        style={{ backgroundColor: "#E9F7EE", color: "#1E8A4C" }}
      >
        Paid
      </span>
    );
  if (paid === 0)
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
        style={{ backgroundColor: "#FCEAE6", color: COLORS.vermillion }}
      >
        Unpaid
      </span>
    );
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ backgroundColor: "#FFF4E0", color: "#B8790A" }}
    >
      Due {due}
    </span>
  );
}

export function SupplierInvoicesPage() {
  const [query, setQuery] = React.useState("");
  const [perPage, setPerPage] = React.useState(100);

  const filtered = INVOICES.filter((r) =>
    [r.name, r.company, r.inv, r.phone].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
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
              style={{ backgroundColor: magentaSoft }}
            >
              <FileText size={16} style={{ color: COLORS.magenta }} />
            </div>
            <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>
              Supplier Invoices
            </h1>
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
                placeholder="Search invoices"
                className="bg-transparent outline-none text-[13px] w-full"
                style={{ color: COLORS.ink }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr>
                {["Date", "Supplier info", "Purchase amount", "Paid", "Status", "Inv num."].map((h) => (
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
                  <td className="px-5 py-3.5 align-top">
                    <StatusPill amount={row.amount} paid={row.paid} />
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
                  <td colSpan={6} className="px-5 py-12 text-center text-[13px]" style={{ color: COLORS.muted }}>
                    No matching invoices found.
                  </td>
                </tr>
              )}
            </tbody>
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

export default SupplierInvoicesPage;