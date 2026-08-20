import React from "react";
import {
  fetchSupplierPayments,
  createSupplierPayment,
  fetchSuppliers,
} from "../../api/supplier/Supplierpaymentservice";
import {
  Loader2,
  Truck,
  Search,
  ChevronDown,
  Filter,
  Download,
  X,
  Phone,
  Wallet,
  Banknote,
  Landmark,
  CalendarDays,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Receipt,
  Clock,
} from "lucide-react";

/* ---------------------------------------------------------------------
   Design tokens
--------------------------------------------------------------------- */
const COLORS = {
  paper: "#FAF8F4",
  panel: "#FFFFFF",
  ink: "#241C1A",
  muted: "#8A7F78",
  line: "#EAE3DC",
  vermillion: "#C1440E",
  magenta: "#9B2954",
};

const FONTS = {
  BODY: "'Inter', system-ui, sans-serif",
  MONO: "'JetBrains Mono', ui-monospace, monospace",
};

const vermillionSoft = `${COLORS.vermillion}1A`;
const magentaSoft = `${COLORS.magenta}1A`;
const greenSoft = "#E7F6EC";
const green = "#1E9E5A";
const grayaSoft = "#EFEBE7";
const graya = "#6B6058";
const redSoft = "#FBE9E7";
const red = "#C1440E";
const amberSoft = "#FDF1DC";
const amber = "#B8720A";

const PAY_ACCOUNTS = [
  { id: "cash", name: "Cash in hand", icon: Banknote },
  { id: "BNK-001", name: "Islami Bank — Motijheel", icon: Landmark },
  { id: "BNK-002", name: "Dutch-Bangla — Agrabad", icon: Landmark },
  { id: "BNK-003", name: "BRAC Bank — Gulshan", icon: Landmark },
];

function agingMeta(days) {
  if (days <= 15) return { label: `${days}d`, color: green, soft: greenSoft };
  if (days <= 30) return { label: `${days}d`, color: amber, soft: amberSoft };
  return { label: `${days}d`, color: red, soft: redSoft };
}

function taka(n) {
  const num = Number(n) || 0;
  const sign = num < 0 ? "-" : "";
  return sign + "৳" + Math.abs(num).toLocaleString("en-BD");
}

function initials(name) {
  return (name || "S").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function supplierOf(list, id) {
  return list.find((s) => s.id === id);
}

function StatCard({ icon: Icon, label, value, sub, color, soft }) {
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
      {sub && (
        <div className="text-[11.5px] mt-0.5" style={{ color: COLORS.muted }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function Select({ value, onChange, options, icon: Icon }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-lg px-3 py-2 border" style={{ borderColor: COLORS.line, backgroundColor: COLORS.panel }}>
        {Icon && <Icon size={13} style={{ color: COLORS.muted }} />}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent outline-none text-[12.5px] font-semibold appearance-none pr-5"
          style={{ color: COLORS.ink }}
        >
          {options.map((o) => (
            <option key={o.id || o} value={o.id || o}>
              {o.name || o}
            </option>
          ))}
        </select>
        <ChevronDown size={12} style={{ color: COLORS.muted, marginLeft: -18, pointerEvents: "none" }} />
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: COLORS.muted }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function PayDrawer({ supplier, onClose, onSave }) {
  const todayISO = new Date().toISOString().split("T")[0];
  const [form, setForm] = React.useState({
    date: todayISO,
    account: "cash",
    amount: "",
    note: "",
  });

  React.useEffect(() => {
    setForm({ date: todayISO, account: "cash", amount: "", note: "" });
  }, [supplier, todayISO]);

  if (!supplier) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const amountNum = Number(form.amount) || 0;
  const remaining = supplier.totalDue - amountNum;
  const overpaying = amountNum > supplier.totalDue;

  const handleSave = () => {
    if (!form.amount || amountNum <= 0) return;
    onSave(supplier.id, { ...form, amount: amountNum });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ backgroundColor: "rgba(36,28,26,0.45)" }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-full w-full max-w-md flex flex-col animate-[slideIn_0.2s_ease-out]"
        style={{ backgroundColor: COLORS.panel, fontFamily: FONTS.BODY }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: COLORS.line }}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[12px] font-bold"
              style={{ background: `linear-gradient(135deg, ${COLORS.magenta}, ${COLORS.vermillion})` }}
            >
              {initials(supplier.name)}
            </div>
            <div>
              <h2 className="text-[14.5px] font-bold" style={{ color: COLORS.ink }}>{supplier.name}</h2>
              <p className="text-[11px]" style={{ color: COLORS.muted }}>ID: {supplier.id} · {supplier.area || supplier.address || "N/A"}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5">
            <X size={15} style={{ color: COLORS.muted }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Voucher slip */}
          <div className="rounded-xl border p-4 mb-5" style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10.5px] font-semibold uppercase tracking-wider" style={{ color: COLORS.muted }}>
                পেমেন্ট ভাউচার · Payment Voucher
              </span>
              <span className="text-[11px] font-semibold" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>{form.date}</span>
            </div>

            <div className="flex items-center justify-between text-[12.5px] mb-3">
              <span style={{ color: COLORS.muted }}>Current Payable</span>
              <span className="font-bold" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>{taka(supplier.totalDue)}</span>
            </div>

            <div className="border-t border-dashed my-3" style={{ borderColor: COLORS.line }} />

            <div className="text-center">
              <div className="text-[10.5px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: COLORS.muted }}>
                Amount Paid
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-[22px] font-bold" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>৳</span>
                <input
                  type="number"
                  value={form.amount}
                  onChange={set("amount")}
                  placeholder="0"
                  className="bg-transparent outline-none text-[28px] font-bold text-center w-40"
                  style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}
                />
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                {[supplier.totalDue, Math.round(supplier.totalDue / 2)].map((v) => (
                  <button
                    key={v}
                    onClick={() => setForm((f) => ({ ...f, amount: String(v) }))}
                    className="text-[10.5px] font-semibold px-2 py-1 rounded-md"
                    style={{ backgroundColor: vermillionSoft, color: COLORS.vermillion }}
                  >
                    {v === supplier.totalDue ? "Full payable" : "Half"} · {taka(v)}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-dashed my-3.5" style={{ borderColor: COLORS.line }} />

            <div className="flex items-center justify-between">
              <span className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
                Remaining Payable
              </span>
              <span
                className="text-[16px] font-bold"
                style={{ color: remaining <= 0 ? green : COLORS.ink, fontFamily: FONTS.MONO }}
              >
                {taka(Math.max(remaining, 0))}
              </span>
            </div>
            {overpaying && (
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium" style={{ color: red }}>
                <AlertTriangle size={12} />
                Amount exceeds current payable by {taka(amountNum - supplier.totalDue)}
              </div>
            )}
          </div>

          <div className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date">
                <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: COLORS.line }}>
                  <CalendarDays size={13} style={{ color: COLORS.muted }} />
                  <input
                    type="date"
                    value={form.date}
                    onChange={set("date")}
                    className="bg-transparent outline-none text-[13px] w-full"
                    style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}
                  />
                </div>
              </Field>
              <Field label="Pay from">
                <Select value={form.account} onChange={(v) => setForm((f) => ({ ...f, account: v }))} icon={Wallet} options={PAY_ACCOUNTS} />
              </Field>
            </div>

            <Field label="Note">
              <div className="flex items-start gap-2 rounded-lg border px-3 py-2" style={{ borderColor: COLORS.line }}>
                <FileText size={13} style={{ color: COLORS.muted, marginTop: 2 }} />
                <textarea
                  value={form.note}
                  onChange={set("note")}
                  placeholder="e.g. Partial payment against purchase"
                  rows={2}
                  className="bg-transparent outline-none text-[13px] w-full resize-none"
                  style={{ color: COLORS.ink, fontFamily: FONTS.BODY }}
                />
              </div>
            </Field>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t shrink-0" style={{ borderColor: COLORS.line }}>
          <button
            onClick={onClose}
            className="rounded-lg px-3.5 py-2 text-[12.5px] font-semibold border"
            style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.panel }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!form.amount || amountNum <= 0}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[12.5px] font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: COLORS.vermillion }}
          >
            <CheckCircle2 size={13} />
            Pay Supplier
          </button>
        </div>
      </div>
    </div>
  );
}

export function SupplierPaymentAcc({ onNavigate }) {
  const [suppliers, setSuppliers] = React.useState([]);
  const [payments, setPayments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [query, setQuery] = React.useState("");
  const [agingFilter, setAgingFilter] = React.useState("ALL");
  const [selected, setSelected] = React.useState(null);
  const [toast, setToast] = React.useState("");

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // Load suppliers and payments together
// loadData() ফাংশনের dynamic lastBill এক্সট্র্যাকশন অংশ:

const loadData = async () => {
  try {
    setLoading(true);
    setError(null);
    const [supplierRes, paymentRes] = await Promise.all([
      fetchSuppliers(),
      fetchSupplierPayments(),
    ]);

    // ১. পেমেন্টস নরমালইজ করা (purchase object সহ)
    const rawPayments = Array.isArray(paymentRes?.data)
      ? paymentRes.data
      : Array.isArray(paymentRes)
      ? paymentRes
      : [];

    const mappedPayments = rawPayments.map((p) => ({
      ...p,
      amount: Number(p.amount || 0),
      date: p.paid_date
        ? p.paid_date.split("T")[0]
        : p.created_at
        ? p.created_at.split("T")[0]
        : "",
      supplierId: p.supplier_id || p.supplier?.id,
      purchaseInvoice: p.purchase?.invoice_no || null, // invoice_no বের করে আনা
    }));

    setPayments(mappedPayments);

    // ২. সাপ্লায়ার তথ্য নরমালইজ করা এবং Dynamic Last Bill সেট করা
    const rawSuppliers = Array.isArray(supplierRes?.data)
      ? supplierRes.data
      : Array.isArray(supplierRes)
      ? supplierRes
      : [];

    const mappedSuppliers = rawSuppliers.map((s) => {
      // এই সাপ্লায়ারের সব পেমেন্ট ফিল্টার করে তারিখ অনুযায়ী সর্ট করা (সর্বশেষটি আগে)
      const supplierPayments = mappedPayments
        .filter((p) => String(p.supplierId) === String(s.id))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      const latestPayment = supplierPayments[0];

      // যে পেমেন্টে Purchase Invoice No আছে সেটা খুঁজে বের করা
      const latestInvoicePayment = supplierPayments.find((p) => p.purchaseInvoice);

      // Dynamic Last Bill নির্বাচন: 
      // direct s.last_bill -> latest invoice_no -> "N/A"
      const computedLastBill =
        s.last_bill ??
        s.lastBill ??
        latestInvoicePayment?.purchaseInvoice ??
        "N/A";

      return {
        ...s,
        totalDue: Number(s.total_due ?? s.due ?? s.totalDue ?? 0),
        agingDays: Number(s.aging_days ?? s.aging_days_count ?? s.agingDays ?? 0),
        lastBill: computedLastBill,
        lastPaymentDate:
          s.last_payment_date ?? s.last_pay_date ?? latestPayment?.date ?? "No payments yet",
      };
    });

    setSuppliers(mappedSuppliers);
  } catch (err) {
    console.error("Error loading supplier payments:", err);
    setError("সাপ্লায়ার পেমেন্ট লোড করতে সমস্যা হয়েছে।");
  } finally {
    setLoading(false);
  }
};

  React.useEffect(() => {
    loadData();
  }, []);

  const filtered = suppliers
    .filter((s) => s.totalDue > 0)
    .filter((s) => {
      const matchesQuery = [s.name, s.phone, s.area, s.address, s.id]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchesAging =
        agingFilter === "ALL" ||
        (agingFilter === "fresh" && s.agingDays <= 15) ||
        (agingFilter === "watch" && s.agingDays > 15 && s.agingDays <= 30) ||
        (agingFilter === "overdue" && s.agingDays > 30);
      return matchesQuery && matchesAging;
    })
    .sort((a, b) => b.totalDue - a.totalDue);

  const totalPayable = suppliers.reduce((s, x) => s + x.totalDue, 0);
  const overdueCount = suppliers.filter((s) => s.agingDays > 30 && s.totalDue > 0).length;
  const suppliersWithDue = suppliers.filter((s) => s.totalDue > 0).length;

  // Paid Today calculation (dynamic check for YYYY-MM-DD format)
  const todayISO = new Date().toISOString().split("T")[0];
  const paidToday = payments
    .filter((p) => p.date === todayISO)
    .reduce((s, p) => s + p.amount, 0);

  const handleSave = async (supplierId, form) => {
    const sup = supplierOf(suppliers, supplierId);
    try {
      await createSupplierPayment({
        supplier_id: supplierId,
        amount: form.amount,
        method: form.account === "cash" ? "Cash" : "Bank Transfer",
        account: form.account,
        note: form.note,
        paid_date: form.date,
      });
      setSelected(null);
      notify(`${taka(form.amount)} paid to ${sup?.name || supplierId}`);
      loadData();
    } catch (err) {
      console.error("Error recording supplier payment:", err);
      alert("পেমেন্ট রেকর্ড করা সম্ভব হয়নি।");
    }
  };

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      <style>{`@keyframes slideIn { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: magentaSoft }}>
            <Truck size={16} style={{ color: COLORS.magenta }} />
          </div>
          <div>
            <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>Supplier Payment</h1>
            <p className="text-[12px]" style={{ color: COLORS.muted }}>
              Pay down outstanding supplier bills, oldest and largest first
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onNavigate && onNavigate("acc-transaction")}
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold border"
            style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.panel }}
          >
            <ArrowLeft size={13} />
            Transaction
          </button>
          <button
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold border"
            style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.panel }}
          >
            <Download size={13} />
            Export
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <StatCard icon={Wallet} label="Total payable" value={taka(totalPayable)} sub={`${suppliersWithDue} suppliers owed`} color={COLORS.vermillion} soft={vermillionSoft} />
        <StatCard icon={CheckCircle2} label="Paid today" value={taka(paidToday)} color={green} soft={greenSoft} />
        <StatCard icon={AlertTriangle} label="Overdue (30d+)" value={overdueCount} sub={overdueCount > 0 ? "Risk of supply delay" : "All current"} color={red} soft={redSoft} />
        <StatCard icon={Clock} label="Payments logged" value={payments.length} color={graya} soft={grayaSoft} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 border flex-1 min-w-[220px]" style={{ borderColor: COLORS.line, backgroundColor: COLORS.panel }}>
          <Search size={14} style={{ color: COLORS.muted }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search supplier name / phone / address"
            className="bg-transparent outline-none text-[13px] w-full"
            style={{ color: COLORS.ink }}
          />
        </div>

        <Select
          value={agingFilter}
          onChange={setAgingFilter}
          icon={Filter}
          options={[
            { id: "ALL", name: "All ages" },
            { id: "fresh", name: "0–15 days" },
            { id: "watch", name: "16–30 days" },
            { id: "overdue", name: "30+ days" },
          ]}
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
        {loading ? (
          <div className="flex items-center justify-center py-10 gap-2" style={{ color: COLORS.muted }}>
            <Loader2 className="animate-spin" size={20} />
            <span>ডাটা লোড হচ্ছে...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8" style={{ color: COLORS.vermillion }}>{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px] border-collapse">
              <thead>
                <tr>
                  {["Supplier", "Contact", "Last Bill", "Last Pay Date", "Aging", "Payable Amount", ""].map((label) => (
                    <th key={label} className="text-left px-5 py-3 text-white" style={{ backgroundColor: COLORS.vermillion }}>
                      <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const aging = agingMeta(s.agingDays);
                  return (
                    <tr key={s.id} className="border-b hover:bg-black/[0.02] transition-colors" style={{ borderColor: COLORS.line }}>
                      <td className="px-5 py-3.5" style={{ color: COLORS.ink }}>
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                            style={{ background: `linear-gradient(135deg, ${COLORS.magenta}, ${COLORS.vermillion})` }}
                          >
                            {initials(s.name)}
                          </div>
                          <div>
                            <div className="font-semibold">{s.name}</div>
                            <div className="text-[11px]" style={{ color: COLORS.muted }}>{s.area || s.address || "N/A"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: COLORS.muted }}>
                        <div className="flex items-center gap-1.5 text-[12.5px]">
                          <Phone size={12} />
                          {s.phone}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: COLORS.muted, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                        {s.lastBill}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: COLORS.muted, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                        {s.lastPaymentDate}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
                          style={{ backgroundColor: aging.soft, color: aging.color }}
                        >
                          {aging.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-semibold whitespace-nowrap" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>
                        {taka(s.totalDue)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => setSelected(s)}
                          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11.5px] font-semibold text-white ml-auto"
                          style={{ backgroundColor: COLORS.vermillion }}
                        >
                          <Wallet size={12} />
                          Pay
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-[13px]" style={{ color: COLORS.muted }}>
                      No suppliers match your filters — nothing outstanding!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className="fixed bottom-5 right-5 flex items-center gap-2 rounded-xl px-4 py-3 text-[12.5px] font-semibold text-white shadow-lg z-50"
          style={{ backgroundColor: COLORS.magenta }}
        >
          <Receipt size={14} />
          {toast}
        </div>
      )}

      {/* Pay Drawer Modal */}
      <PayDrawer supplier={selected} onClose={() => setSelected(null)} onSave={handleSave} />
    </div>
  );
}

export default SupplierPaymentAcc;