import React from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Printer,
  X,
  Building2,
  Phone,
  MapPin,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowDownCircle,
  ArrowUpCircle,
  Undo2,
} from "lucide-react";
import { COLORS, FONTS } from "../../constants";

// Same design tokens used across PurchasePage.jsx / SupplierPaymentPage.jsx / ProductReturnPage.jsx
const vermillionSoft = `${COLORS.vermillionSoft || COLORS.vermillion + "1A"}`;
const magentaSoft = COLORS.magentaSoft || `${COLORS.magenta}1A`;
const greenSoft = "#E7F6EC";
const green = "#1E9E5A";

const SUPPLIERS = [
  { id: 1, name: "Matador", company: "Matador BD", phone: "01784848944", address: "Mirpur-10, Dhaka" },
  { id: 2, name: "Siraj", company: "Siraj Enterprise", phone: "01717777744", address: "Chawkbazar, Chattogram" },
  { id: 3, name: "Sohag Ahmed", company: "Cock", phone: "01766554433", address: "Bogura Sadar, Bogura" },
  { id: 4, name: "nazrul", company: "Allahr Dan 4", phone: "01655221199", address: "Feni Sadar, Feni" },
];

// Mock combined transaction feed per supplier: purchase (debit / increases payable),
// payment (credit / reduces payable), return (credit / reduces payable)
const LEDGER_ENTRIES = {
  1: [
    { id: "PUR-8801", date: "01-04-2025", type: "purchase", ref: "STB/230710646/98", note: "Napa 500mg + Seclo 20mg", debit: 8600, credit: 0 },
    { id: "PAY-5510", date: "05-04-2025", type: "payment", ref: "CHK-1123", note: "Partial payment", debit: 0, credit: 4000 },
    { id: "RTN-3041", date: "19-04-2025", type: "return", ref: "STB/230710646/98", note: "Damaged — Napa 500mg", debit: 0, credit: 600 },
    { id: "PUR-8814", date: "22-04-2025", type: "purchase", ref: "STB/230710701/12", note: "Restock antibiotics", debit: 5200, credit: 0 },
    { id: "PAY-5522", date: "28-04-2025", type: "payment", ref: "CASH-991", note: "Cash settlement", debit: 0, credit: 3000 },
  ],
  2: [
    { id: "PUR-8790", date: "28-03-2025", type: "purchase", ref: "STB/230710646/97", note: "7up Can (24pcs) x15", debit: 12750, credit: 0 },
    { id: "RTN-3037", date: "13-04-2025", type: "return", ref: "STB/230710646/97", note: "Excess stock", debit: 0, credit: 2550 },
    { id: "PAY-5501", date: "15-04-2025", type: "payment", ref: "BKASH-7781", note: "Mobile banking", debit: 0, credit: 5000 },
  ],
  3: [
    { id: "PUR-8770", date: "20-03-2025", type: "purchase", ref: "STB/230710646/93", note: "Cock Detergent 1kg x30", debit: 5400, credit: 0 },
    { id: "RTN-3029", date: "04-04-2025", type: "return", ref: "STB/230710646/93", note: "Expired batch", debit: 0, credit: 1440 },
    { id: "PAY-5490", date: "10-04-2025", type: "payment", ref: "CHK-1098", note: "Full settlement", debit: 0, credit: 3960 },
  ],
  4: [
    { id: "PUR-8750", date: "15-03-2025", type: "purchase", ref: "STB/230710646/94", note: "Chanachur 200g x100", debit: 4000, credit: 0 },
    { id: "PAY-5470", date: "22-03-2025", type: "payment", ref: "CASH-870", note: "Advance payment", debit: 0, credit: 2000 },
  ],
};

const TYPE_META = {
  purchase: { label: "Purchase", color: COLORS.vermillion || "#C4442E", soft: vermillionSoft, Icon: ArrowDownCircle },
  payment: { label: "Payment", color: green, soft: greenSoft, Icon: ArrowUpCircle },
  return: { label: "Return", color: "#B8790A", soft: "#FFF4E0", Icon: Undo2 },
};

function withRunningBalance(entries) {
  let balance = 0;
  return entries
    .slice()
    .sort((a, b) => a.date.split("-").reverse().join("").localeCompare(b.date.split("-").reverse().join("")))
    .map((e) => {
      balance += e.debit - e.credit;
      return { ...e, balance };
    });
}

function StatCard({ icon: Icon, label, value, color, soft }) {
  return (
    <div className="rounded-2xl border p-4" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
      <div className="flex items-center gap-2.5 mb-1.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: soft }}>
          <Icon size={14} style={{ color }} />
        </div>
        <div className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
          {label}
        </div>
      </div>
      <div className="text-[22px] font-bold" style={{ color, fontFamily: FONTS.MONO }}>
        {value}
      </div>
    </div>
  );
}

function SupplierPickerCard({ supplier, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-xl border px-3.5 py-3 transition-colors shrink-0 min-w-[190px]"
      style={{
        borderColor: active ? COLORS.vermillion : COLORS.line,
        backgroundColor: active ? vermillionSoft : COLORS.panel,
      }}
    >
      <div className="text-[13px] font-semibold" style={{ color: COLORS.ink }}>
        {supplier.name}
      </div>
      <div className="text-[11px] mt-0.5" style={{ color: COLORS.muted }}>
        {supplier.company}
      </div>
    </button>
  );
}

function LedgerDetailModal({ entry, supplier, onClose }) {
  if (!entry) return null;
  const meta = TYPE_META[entry.type];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(36,34,32,0.45)" }}
      onClick={onClose}
    >
      <div
        id="ledger-detail-print"
        className="w-full max-w-lg rounded-2xl border overflow-hidden shadow-xl"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b print:hidden" style={{ borderColor: COLORS.line }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: meta.soft }}>
              <meta.Icon size={16} style={{ color: meta.color }} />
            </div>
            <h2 className="text-[16px] font-bold" style={{ color: COLORS.ink }}>
              Ledger entry
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-black/5" style={{ color: COLORS.muted }}>
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="flex items-start justify-between pb-4 mb-4 border-b" style={{ borderColor: COLORS.line }}>
            <div>
              <div className="text-[20px] font-bold" style={{ color: COLORS.ink }}>{supplier?.name}</div>
              <div className="text-[12.5px] mt-0.5" style={{ color: COLORS.muted }}>{supplier?.company}</div>
              <div className="text-[12px] mt-1.5" style={{ color: meta.color, fontFamily: FONTS.MONO }}>{entry.id}</div>
            </div>
            <div className="text-right">
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{ backgroundColor: meta.soft, color: meta.color }}
              >
                {meta.label}
              </span>
              <div className="text-[11px] mt-1.5" style={{ color: COLORS.muted }}>{entry.date}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Reference</div>
              <div className="text-[13px] font-semibold mt-0.5" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{entry.ref}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Note</div>
              <div className="text-[13px] font-semibold mt-0.5" style={{ color: COLORS.ink }}>{entry.note}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="rounded-xl p-4" style={{ backgroundColor: COLORS.paper }}>
              <div className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Debit</div>
              <div className="text-[18px] font-bold mt-0.5" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                {entry.debit ? entry.debit.toLocaleString() : "—"}
              </div>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: COLORS.paper }}>
              <div className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Credit</div>
              <div className="text-[18px] font-bold mt-0.5" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                {entry.credit ? entry.credit.toLocaleString() : "—"}
              </div>
            </div>
          </div>

          <div className="rounded-xl p-4 mt-3" style={{ backgroundColor: vermillionSoft }}>
            <div className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.ink }}>
              Running balance after this entry
            </div>
            <div className="text-[24px] font-bold mt-0.5" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>
              {entry.balance.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t print:hidden" style={{ borderColor: COLORS.line }}>
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-[13px] font-semibold border" style={{ borderColor: COLORS.line, color: COLORS.ink }}>
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold text-white"
            style={{ backgroundColor: COLORS.vermillion }}
          >
            <Printer size={14} />
            Print
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #ledger-detail-print, #ledger-detail-print * { visibility: visible; }
          #ledger-detail-print { position: fixed; inset: 0; margin: auto; box-shadow: none; }
        }
      `}</style>
    </div>
  );
}

export function SupplierLedgerPage() {
  const [supplierId, setSupplierId] = React.useState(SUPPLIERS[0].id);
  const [query, setQuery] = React.useState("");
  const [perPage, setPerPage] = React.useState(100);
  const [selectedEntry, setSelectedEntry] = React.useState(null);

  const supplier = SUPPLIERS.find((s) => s.id === supplierId);
  const rawEntries = LEDGER_ENTRIES[supplierId] || [];
  const entries = withRunningBalance(rawEntries);

  const filtered = entries.filter((e) =>
    [e.id, e.ref, e.note, TYPE_META[e.type].label].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  const totalPurchase = entries.reduce((s, e) => s + (e.type === "purchase" ? e.debit : 0), 0);
  const totalPayment = entries.reduce((s, e) => s + (e.type === "payment" ? e.credit : 0), 0);
  const totalReturn = entries.reduce((s, e) => s + (e.type === "return" ? e.credit : 0), 0);
  const closingBalance = entries.length ? entries[entries.length - 1].balance : 0;

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      {/* Supplier picker */}
      <div className="flex items-center gap-2.5 mb-4 overflow-x-auto pb-1">
        {SUPPLIERS.map((s) => (
          <SupplierPickerCard key={s.id} supplier={s} active={s.id === supplierId} onClick={() => setSupplierId(s.id)} />
        ))}
      </div>

      {/* Supplier info strip */}
      <div className="rounded-2xl border p-4 mb-4 flex flex-wrap items-center gap-x-6 gap-y-2" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
        <div className="flex items-center gap-2">
          <Building2 size={14} style={{ color: COLORS.muted }} />
          <span className="text-[13px] font-semibold" style={{ color: COLORS.ink }}>{supplier.company}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={14} style={{ color: COLORS.muted }} />
          <span className="text-[13px]" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{supplier.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} style={{ color: COLORS.muted }} />
          <span className="text-[13px]" style={{ color: COLORS.ink }}>{supplier.address}</span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <StatCard icon={ArrowDownCircle} label="Total purchase" value={totalPurchase.toLocaleString()} color={COLORS.vermillion} soft={vermillionSoft} />
        <StatCard icon={ArrowUpCircle} label="Total payment" value={totalPayment.toLocaleString()} color={green} soft={greenSoft} />
        <StatCard icon={Undo2} label="Total returns" value={totalReturn.toLocaleString()} color="#B8790A" soft="#FFF4E0" />
        <StatCard icon={Wallet} label="Closing balance" value={closingBalance.toLocaleString()} color={COLORS.ink} soft={magentaSoft} />
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
        {/* Header */}
        <div className="flex flex-col gap-4 px-6 py-5 border-b" style={{ borderColor: COLORS.line }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: vermillionSoft }}>
                <BookOpen size={16} style={{ color: COLORS.vermillion }} />
              </div>
              <div>
                <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>
                  Supplier Ledger
                </h1>
                <p className="text-[12px]" style={{ color: COLORS.muted }}>
                  Purchases, payments &amp; returns with running balance
                </p>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold text-white self-start sm:self-auto"
              style={{ backgroundColor: COLORS.vermillion }}
            >
              <Printer size={14} />
              Print ledger
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
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
                placeholder="Search entry id / reference / note / type"
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
                {["Date", "Entry id", "Type", "Reference", "Note", "Debit", "Credit", "Balance"].map((h) => (
                  <th key={h} className="text-left font-semibold text-[11px] uppercase tracking-wide px-5 py-3 text-white" style={{ backgroundColor: COLORS.vermillion }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, perPage).map((row) => {
                const meta = TYPE_META[row.type];
                return (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedEntry(row)}
                    className="border-b hover:bg-black/[0.02] transition-colors cursor-pointer"
                    style={{ borderColor: COLORS.line }}
                  >
                    <td className="px-5 py-3.5 align-top whitespace-nowrap" style={{ color: COLORS.ink, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                      {row.date}
                    </td>
                    <td className="px-5 py-3.5 align-top font-semibold" style={{ color: meta.color, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                      {row.id}
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                        style={{ backgroundColor: meta.soft, color: meta.color }}
                      >
                        <meta.Icon size={11} />
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 align-top" style={{ color: COLORS.ink, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                      {row.ref}
                    </td>
                    <td className="px-5 py-3.5 align-top max-w-[220px] truncate" style={{ color: COLORS.muted }}>
                      {row.note}
                    </td>
                    <td className="px-5 py-3.5 align-top font-semibold" style={{ color: row.debit ? COLORS.vermillion : COLORS.muted, fontFamily: FONTS.MONO }}>
                      {row.debit ? row.debit.toLocaleString() : "—"}
                    </td>
                    <td className="px-5 py-3.5 align-top font-semibold" style={{ color: row.credit ? green : COLORS.muted, fontFamily: FONTS.MONO }}>
                      {row.credit ? row.credit.toLocaleString() : "—"}
                    </td>
                    <td className="px-5 py-3.5 align-top font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                      {row.balance.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-[13px]" style={{ color: COLORS.muted }}>
                    No ledger entries found.
                  </td>
                </tr>
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr style={{ backgroundColor: vermillionSoft }}>
                  <td colSpan={5} className="px-5 py-3 font-bold text-[12px] uppercase tracking-wide" style={{ color: COLORS.ink }}>Total</td>
                  <td className="px-5 py-3 font-bold" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>{totalPurchase.toLocaleString()}</td>
                  <td className="px-5 py-3 font-bold" style={{ color: green, fontFamily: FONTS.MONO }}>{(totalPayment + totalReturn).toLocaleString()}</td>
                  <td className="px-5 py-3 font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{closingBalance.toLocaleString()}</td>
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
            <span className="w-8 h-8 rounded-md flex items-center justify-center font-semibold text-white" style={{ backgroundColor: COLORS.vermillion }}>1</span>
            <button className="w-8 h-8 rounded-md border flex items-center justify-center" style={{ borderColor: COLORS.line, color: COLORS.ink }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <LedgerDetailModal entry={selectedEntry} supplier={supplier} onClose={() => setSelectedEntry(null)} />
    </div>
  );
}

export default SupplierLedgerPage;