import React from "react";
import {
  Users,
  Search,
  ChevronDown,
  Filter,
  Download,
  X,
  Plus,
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
   Design tokens — kept in step with the sibling Bank Details / Cash
   Flow / Contra Transfer / Invoices pages (warm paper surface,
   vermillion primary accent, magenta secondary). This page inherits
   that house style since it lives in the same product
   (Acc & Transaction Wing → Take Customer Due).
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

const DEPOSIT_ACCOUNTS = [
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

const TODAY = "22-07-2026";

const INITIAL_CUSTOMERS = [
  {
    id: "CUS-101",
    name: "Rafiq Traders",
    phone: "01711-224488",
    area: "Motijheel, Dhaka",
    totalDue: 186500,
    agingDays: 12,
    lastInvoice: "INV-3315",
    lastPaymentDate: "10-07-2026",
  },
  {
    id: "CUS-102",
    name: "Nasrin Enterprise",
    phone: "01822-556699",
    area: "Agrabad, Chattogram",
    totalDue: 92300,
    agingDays: 24,
    lastInvoice: "INV-3298",
    lastPaymentDate: "28-06-2026",
  },
  {
    id: "CUS-103",
    name: "Shakil Store",
    phone: "01933-771122",
    area: "Bogura Sadar",
    totalDue: 41000,
    agingDays: 6,
    lastInvoice: "INV-3312",
    lastPaymentDate: "15-07-2026",
  },
  {
    id: "CUS-104",
    name: "Karim Bhandar",
    phone: "01644-889900",
    area: "Feni Sadar",
    totalDue: 268400,
    agingDays: 42,
    lastInvoice: "INV-3201",
    lastPaymentDate: "05-06-2026",
  },
  {
    id: "CUS-105",
    name: "Moni Grocers",
    phone: "01555-336677",
    area: "Gulshan, Dhaka",
    totalDue: 15600,
    agingDays: 3,
    lastInvoice: "INV-3319",
    lastPaymentDate: "19-07-2026",
  },
  {
    id: "CUS-106",
    name: "Alam & Sons",
    phone: "01766-112233",
    area: "Chattogram Port",
    totalDue: 133800,
    agingDays: 33,
    lastInvoice: "INV-3244",
    lastPaymentDate: "12-06-2026",
  },
];

const INITIAL_COLLECTIONS = [
  { id: "COL-4410", date: "21-07-2026", customer: "CUS-103", account: "cash", amount: 20000, note: "Partial payment against INV-3298" },
  { id: "COL-4408", date: "20-07-2026", customer: "CUS-101", account: "BNK-001", amount: 50000, note: "Cheque cleared" },
  { id: "COL-4405", date: "18-07-2026", customer: "CUS-105", account: "cash", amount: 12000, note: "Counter collection" },
];

function taka(n) {
  const sign = n < 0 ? "-" : "";
  return sign + "৳" + Math.abs(n).toLocaleString("en-BD");
}

function initials(name) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function customerOf(list, id) {
  return list.find((c) => c.id === id);
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

/* ---------------------------------------------------------------------
   Signature element: a "collection receipt" slip.
   Bangladeshi wholesalers hand over a small প্রাপ্তি রসিদ (receipt) the
   moment cash or cheque is taken against a customer's due — showing
   customer, amount collected, remaining due after this payment, and
   deposit account. This drawer mirrors that instant receipt, with the
   remaining-due figure recalculating live as the collector types.
--------------------------------------------------------------------- */
function CollectDrawer({ customer, onClose, onSave }) {
  const [form, setForm] = React.useState({
    date: TODAY,
    account: "cash",
    amount: "",
    note: "",
  });

  React.useEffect(() => {
    setForm({ date: TODAY, account: "cash", amount: "", note: "" });
  }, [customer]);

  if (!customer) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const amountNum = Number(form.amount) || 0;
  const remaining = customer.totalDue - amountNum;
  const overpaying = amountNum > customer.totalDue;

  const handleSave = () => {
    if (!form.amount || amountNum <= 0) return;
    onSave(customer.id, { ...form, amount: amountNum });
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
              style={{ background: `linear-gradient(135deg, ${COLORS.vermillion}, ${COLORS.magenta})` }}
            >
              {initials(customer.name)}
            </div>
            <div>
              <h2 className="text-[14.5px] font-bold" style={{ color: COLORS.ink }}>{customer.name}</h2>
              <p className="text-[11px]" style={{ color: COLORS.muted }}>{customer.id} · {customer.area}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5">
            <X size={15} style={{ color: COLORS.muted }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Receipt slip */}
          <div className="rounded-xl border p-4 mb-5" style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10.5px] font-semibold uppercase tracking-wider" style={{ color: COLORS.muted }}>
                প্রাপ্তি রসিদ · Collection receipt
              </span>
              <span className="text-[11px] font-semibold" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>{form.date}</span>
            </div>

            <div className="flex items-center justify-between text-[12.5px] mb-3">
              <span style={{ color: COLORS.muted }}>Current due</span>
              <span className="font-bold" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>{taka(customer.totalDue)}</span>
            </div>

            <div className="border-t border-dashed my-3" style={{ borderColor: COLORS.line }} />

            <div className="text-center">
              <div className="text-[10.5px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: COLORS.muted }}>
                Amount collected
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-[22px] font-bold" style={{ color: green, fontFamily: FONTS.MONO }}>৳</span>
                <input
                  type="number"
                  value={form.amount}
                  onChange={set("amount")}
                  placeholder="0"
                  className="bg-transparent outline-none text-[28px] font-bold text-center w-40"
                  style={{ color: green, fontFamily: FONTS.MONO }}
                />
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                {[customer.totalDue, Math.round(customer.totalDue / 2)].map((v) => (
                  <button
                    key={v}
                    onClick={() => setForm((f) => ({ ...f, amount: String(v) }))}
                    className="text-[10.5px] font-semibold px-2 py-1 rounded-md"
                    style={{ backgroundColor: greenSoft, color: green }}
                  >
                    {v === customer.totalDue ? "Full due" : "Half"} · {taka(v)}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-dashed my-3.5" style={{ borderColor: COLORS.line }} />

            <div className="flex items-center justify-between">
              <span className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
                Remaining due
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
                Amount exceeds current due by {taka(amountNum - customer.totalDue)}
              </div>
            )}
          </div>

          <div className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date">
                <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: COLORS.line }}>
                  <CalendarDays size={13} style={{ color: COLORS.muted }} />
                  <input
                    value={form.date}
                    onChange={set("date")}
                    className="bg-transparent outline-none text-[13px] w-full"
                    style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}
                  />
                </div>
              </Field>
              <Field label="Deposit to">
                <Select value={form.account} onChange={(v) => setForm((f) => ({ ...f, account: v }))} icon={Wallet} options={DEPOSIT_ACCOUNTS} />
              </Field>
            </div>

            <Field label="Note">
              <div className="flex items-start gap-2 rounded-lg border px-3 py-2" style={{ borderColor: COLORS.line }}>
                <FileText size={13} style={{ color: COLORS.muted, marginTop: 2 }} />
                <textarea
                  value={form.note}
                  onChange={set("note")}
                  placeholder="e.g. Partial payment against INV-3298"
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
            style={{ backgroundColor: green }}
          >
            <CheckCircle2 size={13} />
            Collect payment
          </button>
        </div>
      </div>
    </div>
  );
}

export function TakeCustomerDuePage({ onNavigate }) {
  const [customers, setCustomers] = React.useState(INITIAL_CUSTOMERS);
  const [collections, setCollections] = React.useState(INITIAL_COLLECTIONS);
  const [query, setQuery] = React.useState("");
  const [agingFilter, setAgingFilter] = React.useState("ALL");
  const [selected, setSelected] = React.useState(null);
  const [toast, setToast] = React.useState("");

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const filtered = customers
    .filter((c) => c.totalDue > 0)
    .filter((c) => {
      const matchesQuery = [c.name, c.phone, c.area, c.id].join(" ").toLowerCase().includes(query.toLowerCase());
      const matchesAging =
        agingFilter === "ALL" ||
        (agingFilter === "fresh" && c.agingDays <= 15) ||
        (agingFilter === "watch" && c.agingDays > 15 && c.agingDays <= 30) ||
        (agingFilter === "overdue" && c.agingDays > 30);
      return matchesQuery && matchesAging;
    })
    .sort((a, b) => b.totalDue - a.totalDue);

  const totalDue = customers.reduce((s, c) => s + c.totalDue, 0);
  const overdueCount = customers.filter((c) => c.agingDays > 30 && c.totalDue > 0).length;
  const customersWithDue = customers.filter((c) => c.totalDue > 0).length;
  const collectedToday = collections.filter((c) => c.date === TODAY).reduce((s, c) => s + c.amount, 0);

  const handleSave = (customerId, form) => {
    const cust = customerOf(customers, customerId);
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, totalDue: Math.max(c.totalDue - form.amount, 0), agingDays: 0 } : c))
    );
    const nextNum = Math.max(...collections.map((c) => parseInt(c.id.split("-")[1], 10)), 4400) + 1;
    setCollections((prev) => [{ id: "COL-" + nextNum, customer: customerId, ...form }, ...prev]);
    setSelected(null);
    notify(`${taka(form.amount)} collected from ${cust.name}`);
  };

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      <style>{`@keyframes slideIn { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: magentaSoft }}>
            <Receipt size={16} style={{ color: COLORS.magenta }} />
          </div>
          <div>
            <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>Take Customer Due</h1>
            <p className="text-[12px]" style={{ color: COLORS.muted }}>
              Collect outstanding payments from customers, oldest and largest first
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
        <StatCard icon={Wallet} label="Total receivable" value={taka(totalDue)} sub={`${customersWithDue} customers owe`} color={COLORS.vermillion} soft={vermillionSoft} />
        <StatCard icon={CheckCircle2} label="Collected today" value={taka(collectedToday)} color={green} soft={greenSoft} />
        <StatCard icon={AlertTriangle} label="Overdue (30d+)" value={overdueCount} sub={overdueCount > 0 ? "Needs follow-up" : "All current"} color={red} soft={redSoft} />
        <StatCard icon={Clock} label="Collections logged" value={collections.length} color={graya} soft={grayaSoft} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 border flex-1 min-w-[220px]" style={{ borderColor: COLORS.line, backgroundColor: COLORS.panel }}>
          <Search size={14} style={{ color: COLORS.muted }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customer name / phone / area"
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

      {/* Customers table */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr>
                {["Customer", "Contact", "Last invoice", "Aging", "Due amount", ""].map((label) => (
                  <th key={label} className="text-left px-5 py-3 text-white" style={{ backgroundColor: COLORS.vermillion }}>
                    <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const aging = agingMeta(c.agingDays);
                return (
                  <tr key={c.id} className="border-b hover:bg-black/[0.02] transition-colors" style={{ borderColor: COLORS.line }}>
                    <td className="px-5 py-3.5" style={{ color: COLORS.ink }}>
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                          style={{ background: `linear-gradient(135deg, ${COLORS.vermillion}, ${COLORS.magenta})` }}
                        >
                          {initials(c.name)}
                        </div>
                        <div>
                          <div className="font-semibold">{c.name}</div>
                          <div className="text-[11px]" style={{ color: COLORS.muted }}>{c.area}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: COLORS.muted }}>
                      <div className="flex items-center gap-1.5 text-[12.5px]">
                        <Phone size={12} />
                        {c.phone}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: COLORS.muted, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                      {c.lastInvoice}
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
                      {taka(c.totalDue)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelected(c)}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11.5px] font-semibold text-white ml-auto"
                        style={{ backgroundColor: green }}
                      >
                        <Wallet size={12} />
                        Collect
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-[13px]" style={{ color: COLORS.muted }}>
                    No customers match your filters — everyone's settled up!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-5 right-5 flex items-center gap-2 rounded-xl px-4 py-3 text-[12.5px] font-semibold text-white shadow-lg z-50"
          style={{ backgroundColor: COLORS.magenta }}
        >
          <CheckCircle2 size={14} />
          {toast}
        </div>
      )}

      {/* Collect drawer */}
      <CollectDrawer customer={selected} onClose={() => setSelected(null)} onSave={handleSave} />
    </div>
  );
}

export default TakeCustomerDuePage;