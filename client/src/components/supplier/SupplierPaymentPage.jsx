import React from "react";
import { Search, ChevronLeft, ChevronRight, Wallet, Plus, X, Printer, Calendar, Hash, CreditCard, Phone, MapPin, ReceiptText, User, Building2 } from "lucide-react";
import { COLORS, FONTS } from "../../constants";

// Colors pulled directly from your existing constants file — same tokens used across
// PurchasePage.jsx / SupplierInvoicesPage.jsx / DuePurchaseReportPage.jsx /
// DueConnectionReportPage.jsx / PurchaseInvoiceReportPage.jsx.
const magentaSoft = COLORS.magentaSoft || `${COLORS.magenta}1A`;
const vermillionSoft = `${COLORS.vermillion}1A`;

const SUPPLIERS = [
  { id: 1, name: "Matador", company: "Matador BD", phone: "01784848944", address: "Mirpur-10, Dhaka", due: 1500 },
  { id: 2, name: "Siraj", company: "Siraj Enterprise", phone: "01717777744", address: "Chawkbazar, Chattogram", due: 6600 },
  { id: 3, name: "Sohag Ahmed", company: "Cock", phone: "01766554433", address: "Bogura Sadar, Bogura", due: 2800 },
  { id: 4, name: "nazrul", company: "Allahr Dan 4", phone: "01655221199", address: "Feni Sadar, Feni", due: 2300 },
];

const METHODS = ["Cash", "Bank Transfer", "bKash", "Cheque"];

const INITIAL_PAYMENTS = [
  { id: "PMT-2041", date: "18-04-2025", supplier: "Matador", company: "Matador BD", phone: "01784848944", address: "Mirpur-10, Dhaka", invRef: "STB/230710646/98", invAmount: 6500, invPaidTotal: 5000, method: "Cash", amount: 5000, note: "Partial settlement", receivedBy: "Store Manager", paidBy: "Karim Uddin (Accounts)" },
  { id: "PMT-2038", date: "12-04-2025", supplier: "kudus", company: "7up", phone: "01789654131", address: "Motijheel, Dhaka", invRef: "STB/230710646/97", invAmount: 6000, invPaidTotal: 6000, method: "Bank Transfer", amount: 6000, note: "Full payment", receivedBy: "Store Manager", paidBy: "Karim Uddin (Accounts)" },
  { id: "PMT-2030", date: "05-04-2025", supplier: "Sohag Ahmed", company: "Cock", phone: "01766554433", address: "Bogura Sadar, Bogura", invRef: "STB/230710646/93", invAmount: 4800, invPaidTotal: 2000, method: "bKash", amount: 2000, note: "", receivedBy: "Store Manager", paidBy: "Karim Uddin (Accounts)" },
  { id: "PMT-2019", date: "20-03-2025", supplier: "Rahmat Ali", company: "Microlab", phone: "01911223344", address: "Uttara, Dhaka", invRef: "STB/230710646/94", invAmount: 3200, invPaidTotal: 3200, method: "Cheque", amount: 3200, note: "Cheque #004521", receivedBy: "Store Manager", paidBy: "Karim Uddin (Accounts)" },
];

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

function PaymentDetailModal({ row, onClose }) {
  if (!row) return null;
  const invDue = row.invAmount - row.invPaidTotal;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(36,34,32,0.45)" }}
      onClick={onClose}
    >
      <div
        id="payment-detail-print"
        className="w-full max-w-2xl rounded-2xl border overflow-hidden shadow-xl max-h-[90vh] flex flex-col"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b print:hidden shrink-0" style={{ borderColor: COLORS.line }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: magentaSoft }}>
              <Wallet size={16} style={{ color: COLORS.magenta }} />
            </div>
            <h2 className="text-[16px] font-bold" style={{ color: COLORS.ink }}>
              Payment details
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-black/5" style={{ color: COLORS.muted }}>
            <X size={16} />
          </button>
        </div>

        {/* Scrollable printable content */}
        <div className="px-6 py-5 overflow-y-auto">
          {/* Title block */}
          <div className="flex items-start justify-between pb-4 mb-4 border-b" style={{ borderColor: COLORS.line }}>
            <div>
              <div className="text-[20px] font-bold" style={{ color: COLORS.ink }}>{row.supplier}</div>
              <div className="text-[12.5px] mt-0.5" style={{ color: COLORS.muted }}>{row.company}</div>
              <div className="text-[12px] mt-1.5" style={{ color: COLORS.magenta, fontFamily: FONTS.MONO }}>{row.id}</div>
            </div>
            <div className="text-right">
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{ backgroundColor: "#E9F7EE", color: "#1E8A4C" }}
              >
                {row.method}
              </span>
              <div className="text-[11px] mt-1.5" style={{ color: COLORS.muted }}>{row.date}</div>
            </div>
          </div>

          {/* Supplier contact */}
          <div className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: COLORS.muted }}>
            Supplier information
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 divide-y sm:divide-y-0" style={{ borderColor: COLORS.line }}>
            <DetailRow icon={Phone} label="Phone" value={row.phone} />
            <DetailRow icon={MapPin} label="Address" value={row.address} />
            <DetailRow icon={Building2} label="Company" value={row.company} />
            <DetailRow icon={Hash} label="Payment id" value={row.id} valueColor={COLORS.magenta} />
          </div>

          {/* Invoice reference */}
          <div className="text-[11px] font-semibold uppercase tracking-wide mt-4 mb-1" style={{ color: COLORS.muted }}>
            Against invoice
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: COLORS.paper }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ReceiptText size={14} style={{ color: COLORS.muted }} />
                <span className="text-[13px] font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{row.invRef}</span>
              </div>
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={invDue <= 0 ? { backgroundColor: "#E9F7EE", color: "#1E8A4C" } : { backgroundColor: "#FFF4E0", color: "#B8790A" }}
              >
                {invDue <= 0 ? "Fully settled" : `Remaining due ${invDue.toLocaleString()}`}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div>
                <div className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Invoice total</div>
                <div className="text-[14px] font-bold mt-0.5" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{row.invAmount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Paid to date</div>
                <div className="text-[14px] font-bold mt-0.5" style={{ color: "#1E8A4C", fontFamily: FONTS.MONO }}>{row.invPaidTotal.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Due</div>
                <div className="text-[14px] font-bold mt-0.5" style={{ color: invDue > 0 ? COLORS.vermillion : COLORS.muted, fontFamily: FONTS.MONO }}>{invDue.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Payment meta */}
          <div className="text-[11px] font-semibold uppercase tracking-wide mt-4 mb-1" style={{ color: COLORS.muted }}>
            Payment record
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 divide-y sm:divide-y-0" style={{ borderColor: COLORS.line }}>
            <DetailRow icon={Calendar} label="Payment date" value={row.date} />
            <DetailRow icon={CreditCard} label="Method" value={row.method} />
            <DetailRow icon={User} label="Paid by" value={row.paidBy} />
            <DetailRow icon={User} label="Received by" value={row.receivedBy} />
          </div>
          {row.note && (
            <div className="mt-3 rounded-lg px-3.5 py-2.5 text-[12.5px]" style={{ backgroundColor: COLORS.paper, color: COLORS.ink }}>
              <span className="font-semibold" style={{ color: COLORS.muted }}>Note: </span>
              {row.note}
            </div>
          )}

          {/* Amount paid — headline */}
          <div className="rounded-xl p-4 mt-4" style={{ backgroundColor: magentaSoft }}>
            <div className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.ink }}>
              Amount paid this transaction
            </div>
            <div className="text-[26px] font-bold mt-0.5" style={{ color: "#1E8A4C", fontFamily: FONTS.MONO }}>
              {row.amount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t print:hidden shrink-0" style={{ borderColor: COLORS.line }}>
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-[13px] font-semibold border" style={{ borderColor: COLORS.line, color: COLORS.ink }}>
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

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #payment-detail-print, #payment-detail-print * { visibility: visible; }
          #payment-detail-print { position: fixed; inset: 0; margin: auto; box-shadow: none; max-height: none; }
        }
      `}</style>
    </div>
  );
}

function AddPaymentModal({ open, onClose, onSave }) {
  const [supplierId, setSupplierId] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [method, setMethod] = React.useState(METHODS[0]);
  const [date, setDate] = React.useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = React.useState("");

  if (!open) return null;

  const supplier = SUPPLIERS.find((s) => String(s.id) === supplierId);

  const handleSave = () => {
    if (!supplier || !amount) return;
    onSave({
      id: `PMT-${Math.floor(2000 + Math.random() * 900)}`,
      date: date.split("-").reverse().join("-"),
      supplier: supplier.name,
      company: supplier.company,
      phone: supplier.phone,
      address: supplier.address,
      invRef: "—",
      invAmount: Number(amount),
      invPaidTotal: Number(amount),
      method,
      amount: Number(amount),
      note,
      paidBy: "You",
      receivedBy: supplier.name,
    });
    setSupplierId("");
    setAmount("");
    setNote("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(36,34,32,0.45)" }} onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border overflow-hidden shadow-xl"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: COLORS.line }}>
          <h2 className="text-[16px] font-bold" style={{ color: COLORS.ink }}>
            Record supplier payment
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-black/5" style={{ color: COLORS.muted }}>
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-3.5">
          <div>
            <label className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
              Supplier
            </label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full mt-1 rounded-lg px-3 py-2.5 border text-[13px] outline-none"
              style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.paper }}
            >
              <option value="">Select supplier</option>
              {SUPPLIERS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.company}) — due {s.due.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full mt-1 rounded-lg px-3 py-2.5 border text-[13px] outline-none"
                style={{ borderColor: COLORS.line, color: COLORS.ink, fontFamily: FONTS.MONO }}
              />
            </div>
            <div>
              <label className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mt-1 rounded-lg px-3 py-2.5 border text-[13px] outline-none"
                style={{ borderColor: COLORS.line, color: COLORS.ink }}
              />
            </div>
          </div>

          <div>
            <label className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
              Payment method
            </label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {METHODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className="px-3 py-1.5 rounded-lg text-[12.5px] font-semibold border"
                  style={
                    method === m
                      ? { backgroundColor: COLORS.magenta, borderColor: COLORS.magenta, color: "#fff" }
                      : { backgroundColor: COLORS.paper, borderColor: COLORS.line, color: COLORS.ink }
                  }
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
              Note (optional)
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Cheque number, reference"
              className="w-full mt-1 rounded-lg px-3 py-2.5 border text-[13px] outline-none"
              style={{ borderColor: COLORS.line, color: COLORS.ink }}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t" style={{ borderColor: COLORS.line }}>
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-[13px] font-semibold border" style={{ borderColor: COLORS.line, color: COLORS.ink }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!supplier || !amount}
            className="rounded-lg px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-40"
            style={{ backgroundColor: COLORS.magenta }}
          >
            Save payment
          </button>
        </div>
      </div>
    </div>
  );
}

export function SupplierPaymentPage() {
  const [payments, setPayments] = React.useState(INITIAL_PAYMENTS);
  const [query, setQuery] = React.useState("");
  const [perPage, setPerPage] = React.useState(100);
  const [selected, setSelected] = React.useState(null);
  const [addOpen, setAddOpen] = React.useState(false);

  const filtered = payments.filter((r) =>
    [r.supplier, r.company, r.id, r.invRef].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  const totalPaid = filtered.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="rounded-2xl border p-4" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
          <div className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
            Total payments
          </div>
          <div className="text-[22px] font-bold mt-1" style={{ color: COLORS.ink }}>
            {filtered.length}
          </div>
        </div>
        <div className="rounded-2xl border p-4" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
          <div className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
            Total amount paid
          </div>
          <div className="text-[22px] font-bold mt-1" style={{ color: "#1E8A4C", fontFamily: FONTS.MONO }}>
            {totalPaid.toLocaleString()}
          </div>
        </div>
        <div className="rounded-2xl border p-4" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
          <div className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
            Outstanding suppliers
          </div>
          <div className="text-[22px] font-bold mt-1" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>
            {SUPPLIERS.filter((s) => s.due > 0).length}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
        {/* Header */}
        <div className="flex flex-col gap-4 px-6 py-5 border-b" style={{ borderColor: COLORS.line }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: magentaSoft }}>
                <Wallet size={16} style={{ color: COLORS.magenta }} />
              </div>
              <div>
                <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>
                  Supplier Payment
                </h1>
                <p className="text-[12px]" style={{ color: COLORS.muted }}>
                  Record and track payments made to suppliers
                </p>
              </div>
            </div>

            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold text-white self-start sm:self-auto"
              style={{ backgroundColor: COLORS.magenta }}
            >
              <Plus size={14} />
              Add payment
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
                placeholder="Search supplier / payment id"
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
                {["Date", "Payment id", "Supplier", "Against invoice", "Method", "Amount"].map((h) => (
                  <th key={h} className="text-left font-semibold text-[11px] uppercase tracking-wide px-5 py-3 text-white" style={{ backgroundColor: COLORS.magenta }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, perPage).map((row) => (
                <tr key={row.id} onClick={() => setSelected(row)} className="border-b hover:bg-black/[0.02] transition-colors cursor-pointer" style={{ borderColor: COLORS.line }}>
                  <td className="px-5 py-3.5 align-top whitespace-nowrap" style={{ color: COLORS.ink, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                    {row.date}
                  </td>
                  <td className="px-5 py-3.5 align-top font-semibold" style={{ color: COLORS.magenta, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                    {row.id}
                  </td>
                  <td className="px-5 py-3.5 align-top">
                    <div className="font-semibold hover:underline" style={{ color: COLORS.ink }}>{row.supplier}</div>
                    <div className="text-[11.5px] mt-0.5" style={{ color: COLORS.muted }}>{row.company}</div>
                  </td>
                  <td className="px-5 py-3.5 align-top" style={{ color: COLORS.ink, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                    {row.invRef}
                  </td>
                  <td className="px-5 py-3.5 align-top">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ backgroundColor: "#E9F7EE", color: "#1E8A4C" }}>
                      {row.method}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 align-top font-bold" style={{ color: "#1E8A4C", fontFamily: FONTS.MONO }}>
                    {row.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[13px]" style={{ color: COLORS.muted }}>
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr style={{ backgroundColor: magentaSoft }}>
                  <td colSpan={5} className="px-5 py-3 font-bold text-[12px] uppercase tracking-wide" style={{ color: COLORS.ink }}>Total</td>
                  <td className="px-5 py-3 font-bold" style={{ color: "#1E8A4C", fontFamily: FONTS.MONO }}>{totalPaid.toLocaleString()}</td>
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

      <PaymentDetailModal row={selected} onClose={() => setSelected(null)} />
      <AddPaymentModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(payment) => {
          setPayments((prev) => [payment, ...prev]);
          setAddOpen(false);
        }}
      />
    </div>
  );
}

export default SupplierPaymentPage;