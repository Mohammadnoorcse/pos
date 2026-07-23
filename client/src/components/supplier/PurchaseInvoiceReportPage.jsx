import React from "react";
import { Search, ChevronLeft, ChevronRight, ReceiptText, Printer, X, Calendar, Hash, Building2, Boxes } from "lucide-react";
import { COLORS, FONTS } from "../../constants";

// Colors pulled directly from your existing constants file — same tokens as
// PurchasePage.jsx / SupplierInvoicesPage.jsx / DuePurchaseReportPage.jsx / DueConnectionReportPage.jsx.
const magentaSoft = COLORS.magentaSoft || `${COLORS.magenta}1A`;
const vermillionSoft = `${COLORS.vermillion}1A`;

const PURCHASE_INVOICES = [
  { date: "27-04-2025", inv: "STB/230710646/98", supplier: "Matador", company: "Matador BD", items: 6, qty: 42, amount: 6500, paid: 5000 },
  { date: "19-04-2025", inv: "STB/230710646/97", supplier: "kudus", company: "7up", items: 3, qty: 120, amount: 6000, paid: 6000 },
  { date: "10-04-2025", inv: "STB/230710646/96", supplier: "Siraj", company: "Siraj Enterprise", items: 5, qty: 60, amount: 5100, paid: 0 },
  { date: "10-04-2025", inv: "STB/230710646/95", supplier: "Siraj", company: "Siraj Enterprise", items: 2, qty: 18, amount: 1500, paid: 0 },
  { date: "02-04-2025", inv: "STB/230710646/94", supplier: "Rahmat Ali", company: "Microlab", items: 8, qty: 96, amount: 3200, paid: 3200 },
  { date: "28-03-2025", inv: "STB/230710646/93", supplier: "Sohag Ahmed", company: "Cock", items: 4, qty: 50, amount: 4800, paid: 2000 },
];

function StatusPill({ amount, paid }) {
  const due = amount - paid;
  if (due <= 0)
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ backgroundColor: "#E9F7EE", color: "#1E8A4C" }}>
        Paid
      </span>
    );
  if (paid === 0)
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ backgroundColor: vermillionSoft, color: COLORS.vermillion }}>
        Unpaid
      </span>
    );
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ backgroundColor: "#FFF4E0", color: "#B8790A" }}>
      Partial
    </span>
  );
}

function DetailRow({ icon: Icon, label, value, valueColor }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.paper }}>
        <Icon size={14} style={{ color: COLORS.muted }} />
      </div>
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
          {label}
        </div>
        <div className="text-[14px] font-semibold mt-0.5" style={{ color: valueColor || COLORS.ink }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function InvoiceDetailModal({ row, onClose }) {
  if (!row) return null;
  const due = row.amount - row.paid;
  const status = due <= 0 ? "Paid" : row.paid === 0 ? "Unpaid" : "Partial";
  const statusColor = due <= 0 ? "#1E8A4C" : row.paid === 0 ? COLORS.vermillion : "#B8790A";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(36,34,32,0.45)" }}
      onClick={onClose}
    >
      <div
        id="invoice-detail-print"
        className="w-full max-w-lg rounded-2xl border overflow-hidden shadow-xl"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b print:hidden"
          style={{ borderColor: COLORS.line }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: magentaSoft }}>
              <ReceiptText size={16} style={{ color: COLORS.magenta }} />
            </div>
            <h2 className="text-[16px] font-bold" style={{ color: COLORS.ink }}>
              Invoice details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-black/5"
            style={{ color: COLORS.muted }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Printable content */}
        <div className="px-6 py-5">
          <div className="flex items-center justify-between pb-4 mb-1 border-b" style={{ borderColor: COLORS.line }}>
            <div>
              <div className="text-[18px] font-bold" style={{ color: COLORS.ink }}>
                {row.supplier}
              </div>
              <div className="text-[12px] mt-0.5" style={{ color: COLORS.magenta, fontFamily: FONTS.MONO }}>
                {row.inv}
              </div>
            </div>
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold"
              style={{ backgroundColor: `${statusColor}1A`, color: statusColor }}
            >
              {status}
            </span>
          </div>

          <div className="divide-y" style={{ borderColor: COLORS.line }}>
            <DetailRow icon={Calendar} label="Invoice date" value={row.date} />
            <DetailRow icon={Building2} label="Company" value={row.company} />
            <DetailRow icon={Hash} label="Invoice number" value={row.inv} />
            <DetailRow icon={Boxes} label="Items / quantity" value={`${row.items} items · ${row.qty} units`} />
          </div>

          {/* Amount summary */}
          <div className="grid grid-cols-3 gap-3 mt-4 rounded-xl p-4" style={{ backgroundColor: COLORS.paper }}>
            <div>
              <div className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
                Amount
              </div>
              <div className="text-[16px] font-bold mt-0.5" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                {row.amount.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
                Paid
              </div>
              <div className="text-[16px] font-bold mt-0.5" style={{ color: "#1E8A4C", fontFamily: FONTS.MONO }}>
                {row.paid.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
                Due
              </div>
              <div className="text-[16px] font-bold mt-0.5" style={{ color: due > 0 ? COLORS.vermillion : COLORS.muted, fontFamily: FONTS.MONO }}>
                {due.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div
          className="flex items-center justify-end gap-2 px-6 py-4 border-t print:hidden"
          style={{ borderColor: COLORS.line }}
        >
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-[13px] font-semibold border"
            style={{ borderColor: COLORS.line, color: COLORS.ink }}
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold text-white"
            style={{ backgroundColor: COLORS.magenta }}
          >
            <Printer size={14} />
            Print
          </button>
        </div>
      </div>

      {/* Print-only styles: hide everything except the modal card when printing */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-detail-print, #invoice-detail-print * { visibility: visible; }
          #invoice-detail-print { position: fixed; inset: 0; margin: auto; box-shadow: none; }
        }
      `}</style>
    </div>
  );
}

export function PurchaseInvoiceReportPage() {
  const [query, setQuery] = React.useState("");
  const [perPage, setPerPage] = React.useState(100);
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [selected, setSelected] = React.useState(null);

  const filtered = PURCHASE_INVOICES.filter((r) =>
    [r.inv, r.supplier, r.company].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  const totals = filtered.reduce(
    (acc, r) => ({
      amount: acc.amount + r.amount,
      paid: acc.paid + r.paid,
      due: acc.due + (r.amount - r.paid),
      items: acc.items + r.items,
      qty: acc.qty + r.qty,
    }),
    { amount: 0, paid: 0, due: 0, items: 0, qty: 0 }
  );

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        {[
          { label: "Total invoices", value: filtered.length, color: COLORS.ink, mono: false },
          { label: "Total purchase amount", value: totals.amount, color: COLORS.ink, mono: true },
          { label: "Total paid", value: totals.paid, color: "#1E8A4C", mono: true },
          { label: "Total due", value: totals.due, color: COLORS.vermillion, mono: true },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border p-4" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
            <div className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
              {c.label}
            </div>
            <div className="text-[22px] font-bold mt-1" style={{ color: c.color, fontFamily: c.mono ? FONTS.MONO : FONTS.BODY }}>
              {c.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
        {/* Header */}
        <div className="flex flex-col gap-4 px-6 py-5 border-b" style={{ borderColor: COLORS.line }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: magentaSoft }}>
                <ReceiptText size={16} style={{ color: COLORS.magenta }} />
              </div>
              <div>
                <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>
                  Purchase Invoice Report
                </h1>
                <p className="text-[12px]" style={{ color: COLORS.muted }}>
                  {filtered.length} invoice{filtered.length !== 1 ? "s" : ""} &middot; {totals.items} items &middot; {totals.qty} units
                </p>
              </div>
            </div>

            <button
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-white self-start sm:self-auto"
              style={{ backgroundColor: COLORS.magenta }}
            >
              <Printer size={14} />
              Print
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-[13px]" style={{ color: COLORS.muted }}>
              <span>From</span>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="rounded-md px-2.5 py-1.5 border text-[13px] outline-none"
                style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.paper }}
              />
              <span>To</span>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="rounded-md px-2.5 py-1.5 border text-[13px] outline-none"
                style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.paper }}
              />
            </div>

            <div className="flex items-center gap-2 text-[13px]" style={{ color: COLORS.muted }}>
              <span>Show</span>
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="rounded-md px-2 py-1.5 border text-[13px] outline-none"
                style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.paper }}
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span>entries</span>
            </div>

            <div className="flex items-center gap-2 rounded-lg px-3 py-2 border flex-1 min-w-[200px]" style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper }}>
              <Search size={14} style={{ color: COLORS.muted }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search invoice / supplier"
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
                {["Date", "Inv num.", "Supplier", "Items", "Qty", "Amount", "Paid", "Due", "Status"].map((h) => (
                  <th key={h} className="text-left font-semibold text-[11px] uppercase tracking-wide px-5 py-3 text-white" style={{ backgroundColor: COLORS.magenta }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, perPage).map((row, i) => (
                <tr key={i} onClick={() => setSelected(row)} className="border-b hover:bg-black/[0.02] transition-colors cursor-pointer" style={{ borderColor: COLORS.line }}>
                  <td className="px-5 py-3.5 align-top whitespace-nowrap" style={{ color: COLORS.ink, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                    {row.date}
                  </td>
                  <td className="px-5 py-3.5 align-top">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelected(row); }}
                      className="font-semibold hover:underline"
                      style={{ color: COLORS.magenta, fontFamily: FONTS.MONO, fontSize: 12.5 }}
                    >
                      {row.inv}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 align-top">
                    <div className="font-semibold hover:underline" style={{ color: COLORS.ink }}>{row.supplier}</div>
                    <div className="text-[11.5px] mt-0.5" style={{ color: COLORS.muted }}>{row.company}</div>
                  </td>
                  <td className="px-5 py-3.5 align-top" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{row.items}</td>
                  <td className="px-5 py-3.5 align-top" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{row.qty}</td>
                  <td className="px-5 py-3.5 align-top font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{row.amount.toLocaleString()}</td>
                  <td className="px-5 py-3.5 align-top" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{row.paid.toLocaleString()}</td>
                  <td className="px-5 py-3.5 align-top font-bold" style={{ color: row.amount - row.paid > 0 ? COLORS.vermillion : COLORS.muted, fontFamily: FONTS.MONO }}>
                    {(row.amount - row.paid).toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 align-top">
                    <StatusPill amount={row.amount} paid={row.paid} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-[13px]" style={{ color: COLORS.muted }}>
                    No purchase invoices found.
                  </td>
                </tr>
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr style={{ backgroundColor: magentaSoft }}>
                  <td colSpan={3} className="px-5 py-3 font-bold text-[12px] uppercase tracking-wide" style={{ color: COLORS.ink }}>Total</td>
                  <td className="px-5 py-3 font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{totals.items}</td>
                  <td className="px-5 py-3 font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{totals.qty}</td>
                  <td className="px-5 py-3 font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{totals.amount.toLocaleString()}</td>
                  <td className="px-5 py-3 font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{totals.paid.toLocaleString()}</td>
                  <td className="px-5 py-3 font-bold" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>{totals.due.toLocaleString()}</td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Footer / pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t text-[13px]" style={{ borderColor: COLORS.line, color: COLORS.muted }}>
          <span>Showing 1 to {Math.min(perPage, filtered.length)} of {filtered.length} entries</span>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded-md border flex items-center justify-center disabled:opacity-40" style={{ borderColor: COLORS.line, color: COLORS.muted }} disabled>
              <ChevronLeft size={14} />
            </button>
            <span className="w-8 h-8 rounded-md flex items-center justify-center font-semibold text-white" style={{ backgroundColor: COLORS.magenta }}>1</span>
            <button className="w-8 h-8 rounded-md border flex items-center justify-center" style={{ borderColor: COLORS.line, color: COLORS.ink }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <InvoiceDetailModal row={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

export default PurchaseInvoiceReportPage;