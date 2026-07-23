import React from "react";
import {
  Receipt,
  Search,
  ChevronDown,
  Filter,
  Download,
  X,
  Wallet,
  Banknote,
  Landmark,
  CalendarDays,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Plus,
  Zap,
  Home,
  Users,
  Truck as TruckIcon,
  Wrench,
  MoreHorizontal,
  TrendingUp,
} from "lucide-react";

/* ---------------------------------------------------------------------
   Design tokens — kept in step with the sibling Bank Details / Cash
   Flow / Contra Transfer / Supplier Payment pages (warm paper
   surface, vermillion primary accent, magenta secondary). This page
   lives in the same product (Acc & Transaction Wing → Expenses).
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

const CATEGORIES = [
  { id: "rent", name: "Rent", icon: Home, color: COLORS.magenta, soft: magentaSoft },
  { id: "utilities", name: "Utilities", icon: Zap, color: amber, soft: amberSoft },
  { id: "salary", name: "Staff salary", icon: Users, color: COLORS.vermillion, soft: vermillionSoft },
  { id: "transport", name: "Transport", icon: TruckIcon, color: green, soft: greenSoft },
  { id: "maintenance", name: "Maintenance", icon: Wrench, color: graya, soft: grayaSoft },
  { id: "misc", name: "Miscellaneous", icon: MoreHorizontal, color: COLORS.muted, soft: "#8A7F781A" },
];

function categoryOf(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}

const TODAY = "22-07-2026";
const DAILY_BUDGET = 25000;

const INITIAL_EXPENSES = [
  { id: "EXP-3301", date: "22-07-2026", category: "utilities", account: "cash", amount: 4200, note: "Electricity bill — July", payee: "DESCO" },
  { id: "EXP-3300", date: "22-07-2026", category: "transport", account: "cash", amount: 1800, note: "Delivery van fuel", payee: "Meghna Filling Station" },
  { id: "EXP-3298", date: "21-07-2026", category: "salary", account: "BNK-001", amount: 62000, note: "Mid-month staff salary", payee: "Staff (6 persons)" },
  { id: "EXP-3295", date: "20-07-2026", category: "maintenance", account: "cash", amount: 3600, note: "AC servicing — showroom", payee: "Rahman Electronics" },
  { id: "EXP-3291", date: "18-07-2026", category: "rent", account: "BNK-002", amount: 45000, note: "Shop rent — July", payee: "Karim Properties" },
  { id: "EXP-3286", date: "15-07-2026", category: "misc", account: "cash", amount: 950, note: "Office stationery", payee: "Anika Store" },
  { id: "EXP-3280", date: "12-07-2026", category: "utilities", account: "cash", amount: 1100, note: "Internet bill", payee: "Link3 Broadband" },
  { id: "EXP-3274", date: "08-07-2026", category: "transport", account: "BNK-001", amount: 5200, note: "Truck rental — inbound stock", payee: "Bismillah Carriers" },
];

function taka(n) {
  const sign = n < 0 ? "-" : "";
  return sign + "৳" + Math.abs(n).toLocaleString("en-BD");
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
   Signature element: a "daily spend meter" — a slim horizontal bar
   segmented by category, filled up to today's spend against a soft
   daily budget line. Wholesale shop owners think in terms of "what
   went out today" more than running totals, so the ledger's header
   surfaces that immediately, with an overrun flag if the day runs hot.
--------------------------------------------------------------------- */
function DailySpendMeter({ expenses, budget }) {
  const todays = expenses.filter((e) => e.date === TODAY);
  const total = todays.reduce((s, e) => s + e.amount, 0);
  const overBudget = total > budget;
  const pct = Math.min((total / budget) * 100, 100);

  const byCategory = CATEGORIES.map((c) => ({
    ...c,
    amount: todays.filter((e) => e.category === c.id).reduce((s, e) => s + e.amount, 0),
  })).filter((c) => c.amount > 0);

  return (
    <div className="rounded-2xl border p-4 mb-5" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} style={{ color: COLORS.vermillion }} />
          <span className="text-[12.5px] font-semibold" style={{ color: COLORS.ink }}>
            Today's spend
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[15px] font-bold" style={{ color: overBudget ? red : COLORS.ink, fontFamily: FONTS.MONO }}>
            {taka(total)}
          </span>
          <span className="text-[11.5px]" style={{ color: COLORS.muted }}>
            / {taka(budget)} soft budget
          </span>
        </div>
      </div>

      <div className="h-2.5 rounded-full overflow-hidden flex" style={{ backgroundColor: COLORS.paper }}>
        {byCategory.length === 0 ? (
          <div className="h-full w-0" />
        ) : (
          byCategory.map((c) => (
            <div
              key={c.id}
              className="h-full"
              style={{
                width: `${Math.max((c.amount / budget) * 100, 1.5)}%`,
                backgroundColor: c.color,
              }}
              title={`${c.name}: ${taka(c.amount)}`}
            />
          ))
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
        {byCategory.map((c) => (
          <div key={c.id} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
            <span className="text-[11px]" style={{ color: COLORS.muted }}>
              {c.name} <span style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{taka(c.amount)}</span>
            </span>
          </div>
        ))}
        {overBudget && (
          <div className="flex items-center gap-1 text-[11px] font-semibold ml-auto" style={{ color: red }}>
            <AlertTriangle size={11} />
            {taka(total - budget)} over today's soft budget
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------
   Add-expense drawer — mirrors the payment voucher pattern used on
   Supplier Payment, but built around a category chip picker since
   that's the first decision a shop owner makes when logging a cost.
--------------------------------------------------------------------- */
function ExpenseDrawer({ open, onClose, onSave }) {
  const [form, setForm] = React.useState({
    date: TODAY,
    category: "misc",
    account: "cash",
    amount: "",
    payee: "",
    note: "",
  });

  React.useEffect(() => {
    if (open) setForm({ date: TODAY, category: "misc", account: "cash", amount: "", payee: "", note: "" });
  }, [open]);

  if (!open) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const amountNum = Number(form.amount) || 0;
  const cat = categoryOf(form.category);

  const handleSave = () => {
    if (!form.amount || amountNum <= 0) return;
    onSave({ ...form, amount: amountNum });
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
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
              style={{ background: `linear-gradient(135deg, ${COLORS.magenta}, ${COLORS.vermillion})` }}
            >
              <Receipt size={16} />
            </div>
            <div>
              <h2 className="text-[14.5px] font-bold" style={{ color: COLORS.ink }}>Log an expense</h2>
              <p className="text-[11px]" style={{ color: COLORS.muted }}>Recorded against today unless changed</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5">
            <X size={15} style={{ color: COLORS.muted }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Category picker */}
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: COLORS.muted }}>
              Category
            </div>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                const active = form.category === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setForm((f) => ({ ...f, category: c.id }))}
                    className="flex flex-col items-center gap-1.5 rounded-xl border py-3 transition-colors"
                    style={{
                      borderColor: active ? c.color : COLORS.line,
                      backgroundColor: active ? c.soft : COLORS.panel,
                    }}
                  >
                    <Icon size={16} style={{ color: active ? c.color : COLORS.muted }} />
                    <span
                      className="text-[10.5px] font-semibold text-center leading-tight"
                      style={{ color: active ? c.color : COLORS.muted }}
                    >
                      {c.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Voucher-style amount slip */}
          <div className="rounded-xl border p-4 mb-5" style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10.5px] font-semibold uppercase tracking-wider" style={{ color: COLORS.muted }}>
                খরচের ভাউচার · Expense voucher
              </span>
              <span
                className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: cat.soft, color: cat.color }}
              >
                {cat.name}
              </span>
            </div>

            <div className="text-center">
              <div className="text-[10.5px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: COLORS.muted }}>
                Amount spent
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
            </div>
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
              <Field label="Pay from">
                <Select value={form.account} onChange={(v) => setForm((f) => ({ ...f, account: v }))} icon={Wallet} options={PAY_ACCOUNTS} />
              </Field>
            </div>

            <Field label="Paid to">
              <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: COLORS.line }}>
                <Users size={13} style={{ color: COLORS.muted }} />
                <input
                  value={form.payee}
                  onChange={set("payee")}
                  placeholder="e.g. DESCO, landlord, staff name"
                  className="bg-transparent outline-none text-[13px] w-full"
                  style={{ color: COLORS.ink }}
                />
              </div>
            </Field>

            <Field label="Note">
              <div className="flex items-start gap-2 rounded-lg border px-3 py-2" style={{ borderColor: COLORS.line }}>
                <FileText size={13} style={{ color: COLORS.muted, marginTop: 2 }} />
                <textarea
                  value={form.note}
                  onChange={set("note")}
                  placeholder="e.g. Electricity bill — July"
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
            Save expense
          </button>
        </div>
      </div>
    </div>
  );
}

export function ExpensesAcc({ onNavigate }) {
  const [expenses, setExpenses] = React.useState(INITIAL_EXPENSES);
  const [query, setQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("ALL");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [toast, setToast] = React.useState("");

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const filtered = expenses
    .filter((e) => {
      const matchesQuery = [e.payee, e.note, e.id].join(" ").toLowerCase().includes(query.toLowerCase());
      const matchesCategory = categoryFilter === "ALL" || e.category === categoryFilter;
      return matchesQuery && matchesCategory;
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  const todayTotal = expenses.filter((e) => e.date === TODAY).reduce((s, e) => s + e.amount, 0);
  const monthTotal = expenses.reduce((s, e) => s + e.amount, 0);
  const largestCategory = CATEGORIES.map((c) => ({
    ...c,
    amount: expenses.filter((e) => e.category === c.id).reduce((s, e) => s + e.amount, 0),
  })).sort((a, b) => b.amount - a.amount)[0];

  const handleSave = (form) => {
    const nextNum = Math.max(...expenses.map((e) => parseInt(e.id.split("-")[1], 10)), 3300) + 1;
    setExpenses((prev) => [{ id: "EXP-" + nextNum, ...form }, ...prev]);
    setDrawerOpen(false);
    notify(`${taka(form.amount)} logged under ${categoryOf(form.category).name}`);
  };

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      <style>{`@keyframes slideIn { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: vermillionSoft }}>
            <Receipt size={16} style={{ color: COLORS.vermillion }} />
          </div>
          <div>
            <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>Expenses</h1>
            <p className="text-[12px]" style={{ color: COLORS.muted }}>
              Log and track day-to-day business costs
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
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold text-white"
            style={{ backgroundColor: COLORS.vermillion }}
          >
            <Plus size={13} />
            Log expense
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <StatCard icon={Wallet} label="Spent today" value={taka(todayTotal)} color={COLORS.vermillion} soft={vermillionSoft} />
        <StatCard icon={Receipt} label="Total this month" value={taka(monthTotal)} sub={`${expenses.length} entries`} color={COLORS.magenta} soft={magentaSoft} />
        <StatCard
          icon={largestCategory.icon}
          label="Top category"
          value={largestCategory.name}
          sub={taka(largestCategory.amount)}
          color={largestCategory.color}
          soft={largestCategory.soft}
        />
        <StatCard icon={CheckCircle2} label="Avg. per entry" value={taka(Math.round(monthTotal / (expenses.length || 1)))} color={green} soft={greenSoft} />
      </div>

      {/* Daily spend meter — signature element */}
      <DailySpendMeter expenses={expenses} budget={DAILY_BUDGET} />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 border flex-1 min-w-[220px]" style={{ borderColor: COLORS.line, backgroundColor: COLORS.panel }}>
          <Search size={14} style={{ color: COLORS.muted }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search payee / note / expense ID"
            className="bg-transparent outline-none text-[13px] w-full"
            style={{ color: COLORS.ink }}
          />
        </div>

        <Select
          value={categoryFilter}
          onChange={setCategoryFilter}
          icon={Filter}
          options={[{ id: "ALL", name: "All categories" }, ...CATEGORIES]}
        />
      </div>

      {/* Expenses table */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr>
                {["Expense", "Category", "Paid via", "Date", "Amount"].map((label) => (
                  <th key={label} className="text-left px-5 py-3 text-white" style={{ backgroundColor: COLORS.vermillion }}>
                    <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => {
                const cat = categoryOf(e.category);
                const Icon = cat.icon;
                const acct = PAY_ACCOUNTS.find((a) => a.id === e.account);
                return (
                  <tr key={e.id} className="border-b hover:bg-black/[0.02] transition-colors" style={{ borderColor: COLORS.line }}>
                    <td className="px-5 py-3.5" style={{ color: COLORS.ink }}>
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: cat.soft }}
                        >
                          <Icon size={14} style={{ color: cat.color }} />
                        </div>
                        <div>
                          <div className="font-semibold">{e.payee}</div>
                          <div className="text-[11px]" style={{ color: COLORS.muted }}>{e.note}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
                        style={{ backgroundColor: cat.soft, color: cat.color }}
                      >
                        {cat.name}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: COLORS.muted }}>
                      <div className="flex items-center gap-1.5 text-[12.5px]">
                        {acct?.id === "cash" ? <Banknote size={12} /> : <Landmark size={12} />}
                        {acct?.name || e.account}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: COLORS.muted, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                      {e.date}
                    </td>
                    <td className="px-5 py-3.5 font-semibold whitespace-nowrap" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>
                      {taka(e.amount)}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-[13px]" style={{ color: COLORS.muted }}>
                    No expenses match your filters — try a different search or category.
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
          <Receipt size={14} />
          {toast}
        </div>
      )}

      {/* Expense drawer */}
      <ExpenseDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSave={handleSave} />
    </div>
  );
}

export default ExpensesAcc;