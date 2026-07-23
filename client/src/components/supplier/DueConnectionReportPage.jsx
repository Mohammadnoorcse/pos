import React from "react";
import { Search, ChevronLeft, ChevronRight, Wifi, Printer, X, Phone, Calendar, Hash, Package as PackageIcon } from "lucide-react";
import { COLORS, FONTS } from "../../constants";

// Colors pulled directly from your existing constants file — same tokens as
// PurchasePage.jsx / SupplierInvoicesPage.jsx / DuePurchaseReportPage.jsx.
const magentaSoft = COLORS.magentaSoft || `${COLORS.magenta}1A`;
const vermillionSoft = `${COLORS.vermillion}1A`;

// Assumption: "connection" = customer subscription/connection (e.g. internet, cable, gas line —
// swap the field labels below if your "connection" means something else, like a supplier account).
const DUE_CONNECTIONS = [
  { date: "01-04-2025", customer: "Rafiq Islam", phone: "01711223344", connId: "CON-1042", package: "20 Mbps Home", bill: 1500, paid: 800 },
  { date: "01-04-2025", customer: "Nasrin Akter", phone: "01822334455", connId: "CON-1043", package: "40 Mbps Home", bill: 2200, paid: 0 },
  { date: "01-04-2025", customer: "Kamal Hossain", phone: "01933445566", connId: "CON-1044", package: "Cable TV Basic", bill: 600, paid: 300 },
  { date: "01-05-2025", customer: "Sumaiya Rahman", phone: "01644556677", connId: "CON-1045", package: "20 Mbps Home", bill: 1500, paid: 0 },
  { date: "01-05-2025", customer: "Tariq Mahmud", phone: "01555667788", connId: "CON-1046", package: "100 Mbps Office", bill: 4500, paid: 2000 },
  { date: "01-06-2025", customer: "Farhana Yasmin", phone: "01766778899", connId: "CON-1047", package: "40 Mbps Home", bill: 2200, paid: 2200 },
].map((r) => ({ ...r, due: r.bill - r.paid }))
  .filter((r) => r.due > 0);

function agingLabel(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
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

function CustomerDetailModal({ row, onClose }) {
  if (!row) return null;
  const { label: aging, tone } = agingLabel(row.date);
  const agingColor = tone === "danger" ? COLORS.vermillion : tone === "warn" ? "#B8790A" : "#1E8A4C";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(36,34,32,0.45)" }}
      onClick={onClose}
    >
      <div
        id="connection-detail-print"
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
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: vermillionSoft }}>
              <Wifi size={16} style={{ color: COLORS.vermillion }} />
            </div>
            <h2 className="text-[16px] font-bold" style={{ color: COLORS.ink }}>
              Connection details
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
                {row.customer}
              </div>
              <div className="text-[12px] mt-0.5" style={{ color: COLORS.magenta, fontFamily: FONTS.MONO }}>
                {row.connId}
              </div>
            </div>
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold"
              style={{ backgroundColor: `${agingColor}1A`, color: agingColor }}
            >
              {aging}
            </span>
          </div>

          <div className="divide-y" style={{ borderColor: COLORS.line }}>
            <DetailRow icon={Calendar} label="Bill date" value={row.date} />
            <DetailRow icon={Phone} label="Phone" value={row.phone} />
            <DetailRow icon={PackageIcon} label="Package" value={row.package} />
            <DetailRow icon={Hash} label="Connection ID" value={row.connId} />
          </div>

          {/* Amount summary */}
          <div className="grid grid-cols-3 gap-3 mt-4 rounded-xl p-4" style={{ backgroundColor: COLORS.paper }}>
            <div>
              <div className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
                Bill
              </div>
              <div className="text-[16px] font-bold mt-0.5" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                {row.bill.toLocaleString()}
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
              <div className="text-[16px] font-bold mt-0.5" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>
                {row.due.toLocaleString()}
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
          #connection-detail-print, #connection-detail-print * { visibility: visible; }
          #connection-detail-print { position: fixed; inset: 0; margin: auto; box-shadow: none; }
        }
      `}</style>
    </div>
  );
}

export function DueConnectionReportPage() {
  const [query, setQuery] = React.useState("");
  const [perPage, setPerPage] = React.useState(100);
  const [selected, setSelected] = React.useState(null);

  const filtered = DUE_CONNECTIONS.filter((r) =>
    [r.customer, r.connId, r.phone, r.package].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  const totals = filtered.reduce(
    (acc, r) => ({
      bill: acc.bill + r.bill,
      paid: acc.paid + r.paid,
      due: acc.due + r.due,
    }),
    { bill: 0, paid: 0, due: 0 }
  );

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {[
          { label: "Total bill amount", value: totals.bill, color: COLORS.ink },
          { label: "Total collected", value: totals.paid, color: "#1E8A4C" },
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
              <Wifi size={16} style={{ color: COLORS.vermillion }} />
            </div>
            <div>
              <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>
                Due Connection Report
              </h1>
              <p className="text-[12px]" style={{ color: COLORS.muted }}>
                {filtered.length} connection{filtered.length !== 1 ? "s" : ""} with outstanding balance
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
                placeholder="Search customer / connection id"
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
                {["Bill date", "Customer / connection", "Package", "Bill amount", "Paid", "Due", "Aging"].map((h) => (
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
                  onClick={() => setSelected(row)}
                  className="border-b hover:bg-black/[0.02] transition-colors cursor-pointer"
                  style={{ borderColor: COLORS.line }}
                >
                  <td className="px-5 py-3.5 align-top whitespace-nowrap" style={{ color: COLORS.ink, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                    {row.date}
                  </td>
                  <td className="px-5 py-3.5 align-top">
                    <div className="font-semibold hover:underline" style={{ color: COLORS.ink }}>
                      {row.customer}
                    </div>
                    <div className="text-[11.5px] mt-0.5" style={{ color: COLORS.muted }}>
                      Phone: {row.phone}
                    </div>
                    <div className="text-[11.5px]" style={{ color: COLORS.magenta, fontFamily: FONTS.MONO }}>
                      {row.connId}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 align-top" style={{ color: COLORS.ink }}>
                    {row.package}
                  </td>
                  <td className="px-5 py-3.5 align-top font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                    {row.bill.toLocaleString()}
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
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[13px]" style={{ color: COLORS.muted }}>
                    No due connections found.
                  </td>
                </tr>
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr style={{ backgroundColor: magentaSoft }}>
                  <td colSpan={3} className="px-5 py-3 font-bold text-[12px] uppercase tracking-wide" style={{ color: COLORS.ink }}>
                    Total
                  </td>
                  <td className="px-5 py-3 font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                    {totals.bill.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                    {totals.paid.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 font-bold" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>
                    {totals.due.toLocaleString()}
                  </td>
                  <td></td>
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

      <CustomerDetailModal row={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

export default DueConnectionReportPage;