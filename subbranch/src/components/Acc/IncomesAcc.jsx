import React from "react";
import { fetchIncomes, createIncome } from "../../api/acc/incomeService";
import {
  Loader2,
  TrendingUp,
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
  CheckCircle2,
  ArrowLeft,
  Plus,
  ShoppingBag,
  CreditCard,
  Globe,
  Store,
  Building2,
  Percent,
  HandCoins,
  Tag,
  MoreHorizontal,
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
const tealSoft = "#E4F3F1";
const teal = "#1A7F72";

const RECEIVE_ACCOUNTS = [
  { id: "cash", name: "Cash in hand" },
  { id: "BNK-001", name: "Islami Bank — Motijheel" },
  { id: "BNK-002", name: "Dutch-Bangla — Agrabad" },
  { id: "BNK-003", name: "BRAC Bank — Gulshan" },
];

const DIRECT_CATEGORIES = [
  { id: "cash_sale", name: "Cash counter sale", icon: Store, color: green, soft: greenSoft },
  { id: "credit_sale", name: "Credit sale collection", icon: CreditCard, color: COLORS.vermillion, soft: vermillionSoft },
  { id: "online_order", name: "Online order", icon: Globe, color: teal, soft: tealSoft },
  { id: "wholesale", name: "Wholesale sale", icon: ShoppingBag, color: COLORS.magenta, soft: magentaSoft },
];

const INDIRECT_CATEGORIES = [
  { id: "rent", name: "Rent received", icon: Building2, color: COLORS.magenta, soft: magentaSoft },
  { id: "interest", name: "Interest received", icon: Percent, color: teal, soft: tealSoft },
  { id: "commission", name: "Commission received", icon: HandCoins, color: green, soft: greenSoft },
  { id: "discount", name: "Discount received", icon: Tag, color: COLORS.vermillion, soft: vermillionSoft },
  { id: "misc", name: "Other income", icon: MoreHorizontal, color: COLORS.muted, soft: "#8A7F781A" },
];

function categoriesFor(type) {
  return type === "direct" ? DIRECT_CATEGORIES : INDIRECT_CATEGORIES;
}

function categoryOf(type, id) {
  const list = categoriesFor(type);
  return list.find((c) => c.id === id) || list[list.length - 1];
}

// Standard ISO Today's Date YYYY-MM-DD
const TODAY = new Date().toISOString().split("T")[0];

function taka(n) {
  const num = Number(n) || 0;
  const sign = num < 0 ? "-" : "";
  return sign + "৳" + Math.abs(num).toLocaleString("en-BD");
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

function CompositionBar({ incomes = [] }) {
  const directTotal = incomes
    .filter((i) => i.type === "direct")
    .reduce((s, i) => s + Number(i.amount || 0), 0);
  const indirectTotal = incomes
    .filter((i) => i.type === "indirect")
    .reduce((s, i) => s + Number(i.amount || 0), 0);
  
  const total = directTotal + indirectTotal || 1;
  const directPct = Math.round((directTotal / total) * 100);
  const indirectPct = 100 - directPct;

  return (
    <div className="rounded-2xl border p-4 mb-5" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} style={{ color: green }} />
          <span className="text-[12.5px] font-semibold" style={{ color: COLORS.ink }}>
            Income composition — this period
          </span>
        </div>
        <span className="text-[15px] font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
          {taka(directTotal + indirectTotal)}
        </span>
      </div>

      <div className="h-3 rounded-full overflow-hidden flex" style={{ backgroundColor: COLORS.paper }}>
        <div className="h-full" style={{ width: `${directPct}%`, backgroundColor: green }} title={`Direct: ${taka(directTotal)}`} />
        <div className="h-full" style={{ width: `${indirectPct}%`, backgroundColor: COLORS.magenta }} title={`Indirect: ${taka(indirectTotal)}`} />
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: green }} />
          <span className="text-[11.5px]" style={{ color: COLORS.muted }}>
            Direct <span style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{taka(directTotal)}</span>
            <span className="ml-1" style={{ color: green, fontWeight: 600 }}>({directPct}%)</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.magenta }} />
          <span className="text-[11.5px]" style={{ color: COLORS.muted }}>
            Indirect <span style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{taka(indirectTotal)}</span>
            <span className="ml-1" style={{ color: COLORS.magenta, fontWeight: 600 }}>({indirectPct}%)</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function IncomeDrawer({ open, onClose, onSave }) {
  const [form, setForm] = React.useState({
    type: "direct",
    date: TODAY,
    category: DIRECT_CATEGORIES[0].id,
    account: "cash",
    amount: "",
    source: "",
    note: "",
  });

  React.useEffect(() => {
    if (open) {
      setForm({
        type: "direct",
        date: TODAY,
        category: DIRECT_CATEGORIES[0].id,
        account: "cash",
        amount: "",
        source: "",
        note: "",
      });
    }
  }, [open]);

  if (!open) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const amountNum = Number(form.amount) || 0;
  const cats = categoriesFor(form.type);
  const cat = categoryOf(form.type, form.category);
  const accent = form.type === "direct" ? green : COLORS.magenta;
  const accentSoft = form.type === "direct" ? greenSoft : magentaSoft;

  const switchType = (type) => {
    setForm((f) => ({ ...f, type, category: categoriesFor(type)[0].id }));
  };

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
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: COLORS.line }}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
              style={{ background: `linear-gradient(135deg, ${COLORS.magenta}, ${green})` }}
            >
              <TrendingUp size={16} />
            </div>
            <div>
              <h2 className="text-[14.5px] font-bold" style={{ color: COLORS.ink }}>Log an income</h2>
              <p className="text-[11px]" style={{ color: COLORS.muted }}>Recorded against today unless changed</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5">
            <X size={15} style={{ color: COLORS.muted }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: COLORS.muted }}>
              Income type
            </div>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl" style={{ backgroundColor: COLORS.paper }}>
              {[
                { id: "direct", name: "Direct income", sub: "From core trading" },
                { id: "indirect", name: "Indirect income", sub: "From other sources" },
              ].map((t) => {
                const active = form.type === t.id;
                const c = t.id === "direct" ? green : COLORS.magenta;
                const s = t.id === "direct" ? greenSoft : magentaSoft;
                return (
                  <button
                    key={t.id}
                    onClick={() => switchType(t.id)}
                    className="rounded-lg py-2.5 px-2 text-center transition-colors"
                    style={{ backgroundColor: active ? s : "transparent" }}
                  >
                    <div className="text-[12.5px] font-bold" style={{ color: active ? c : COLORS.muted }}>{t.name}</div>
                    <div className="text-[10.5px]" style={{ color: active ? c : COLORS.muted }}>{t.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: COLORS.muted }}>
              Category
            </div>
            <div className="grid grid-cols-2 gap-2">
              {cats.map((c) => {
                const Icon = c.icon;
                const active = form.category === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setForm((f) => ({ ...f, category: c.id }))}
                    className="flex items-center gap-2 rounded-xl border py-2.5 px-3 transition-colors"
                    style={{
                      borderColor: active ? c.color : COLORS.line,
                      backgroundColor: active ? c.soft : COLORS.panel,
                    }}
                  >
                    <Icon size={15} style={{ color: active ? c.color : COLORS.muted }} />
                    <span className="text-[11.5px] font-semibold text-left leading-tight" style={{ color: active ? c.color : COLORS.muted }}>
                      {c.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border p-4 mb-5" style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10.5px] font-semibold uppercase tracking-wider" style={{ color: COLORS.muted }}>
                আয়ের রশিদ · Income receipt
              </span>
              <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: accentSoft, color: accent }}>
                {cat.name}
              </span>
            </div>

            <div className="text-center">
              <div className="text-[10.5px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: COLORS.muted }}>
                Amount received
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-[22px] font-bold" style={{ color: accent, fontFamily: FONTS.MONO }}>৳</span>
                <input
                  type="number"
                  value={form.amount}
                  onChange={set("amount")}
                  placeholder="0"
                  className="bg-transparent outline-none text-[28px] font-bold text-center w-40"
                  style={{ color: accent, fontFamily: FONTS.MONO }}
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
                    type="date"
                    value={form.date}
                    onChange={set("date")}
                    className="bg-transparent outline-none text-[13px] w-full"
                    style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}
                  />
                </div>
              </Field>
              <Field label="Receive into">
                <Select value={form.account} onChange={(v) => setForm((f) => ({ ...f, account: v }))} icon={Wallet} options={RECEIVE_ACCOUNTS} />
              </Field>
            </div>

            <Field label="Source">
              <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: COLORS.line }}>
                <FileText size={13} style={{ color: COLORS.muted }} />
                <input
                  value={form.source}
                  onChange={set("source")}
                  placeholder="e.g. Counter sales — evening shift"
                  className="bg-transparent outline-none text-[13px] w-full"
                  style={{ color: COLORS.ink }}
                />
              </div>
            </Field>

            <Field label="Note (optional)">
              <div className="flex items-start gap-2 rounded-lg border px-3 py-2" style={{ borderColor: COLORS.line }}>
                <FileText size={13} style={{ color: COLORS.muted, marginTop: 2 }} />
                <textarea
                  value={form.note}
                  onChange={set("note")}
                  placeholder="Any extra detail"
                  rows={2}
                  className="bg-transparent outline-none text-[13px] w-full resize-none"
                  style={{ color: COLORS.ink, fontFamily: FONTS.BODY }}
                />
              </div>
            </Field>
          </div>
        </div>

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
            style={{ backgroundColor: accent }}
          >
            <CheckCircle2 size={13} />
            Save income
          </button>
        </div>
      </div>
    </div>
  );
}

export function IncomesAcc({ onNavigate }) {
  const [incomes, setIncomes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [tab, setTab] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("ALL");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [toast, setToast] = React.useState("");

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const loadIncomes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchIncomes();
      // Safely extract the incomes array returned by Laravel Controller
      const incomesList = res?.incomes;
      console.log('income',res)
      setIncomes(incomesList);
    } catch (err) {
      console.error("Error loading incomes:", err);
      setError("ইনকাম লিস্ট লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadIncomes();
  }, []);

  const visibleCategories =
    tab === "indirect" ? INDIRECT_CATEGORIES : tab === "direct" ? DIRECT_CATEGORIES : [...DIRECT_CATEGORIES, ...INDIRECT_CATEGORIES];

  const filtered = incomes
    .filter((i) => tab === "all" || i.type === tab)
    .filter((i) => {
      const searchTarget = `${i.source || ""} ${i.note || ""} ${i.income_no || i.id || ""}`.toLowerCase();
      const matchesQuery = searchTarget.includes(query.toLowerCase());
      const matchesCategory = categoryFilter === "ALL" || i.category === categoryFilter;
      return matchesQuery && matchesCategory;
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  const directTotal = incomes
    .filter((i) => i.type === "direct")
    .reduce((s, i) => s + Number(i.amount || 0), 0);

  const indirectTotal = incomes
    .filter((i) => i.type === "indirect")
    .reduce((s, i) => s + Number(i.amount || 0), 0);

  const todayTotal = incomes
    .filter((i) => String(i.date).startsWith(TODAY))
    .reduce((s, i) => s + Number(i.amount || 0), 0);

  const grandTotal = directTotal + indirectTotal;

  const handleSave = async (form) => {
    try {
      await createIncome(form);
      setDrawerOpen(false);
      notify(`${taka(form.amount)} logged as ${form.type} income`);
      loadIncomes();
    } catch (err) {
      console.error("Error saving income:", err);
      alert("ইনকাম যোগ করা সম্ভব হয়নি।");
    }
  };

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      <style>{`@keyframes slideIn { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: vermillionSoft }}>
            <TrendingUp size={16} style={{ color: COLORS.vermillion }} />
          </div>
          <div>
            <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>Direct / Indirect Income</h1>
            <p className="text-[12px]" style={{ color: COLORS.muted }}>
              Track revenue from core trading and other earnings
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
            Log income
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <StatCard icon={Wallet} label="Received today" value={taka(todayTotal)} color={COLORS.vermillion} soft={vermillionSoft} />
        <StatCard icon={Store} label="Direct income" value={taka(directTotal)} sub={`${incomes.filter((i) => i.type === "direct").length} entries`} color={green} soft={greenSoft} />
        <StatCard icon={Building2} label="Indirect income" value={taka(indirectTotal)} sub={`${incomes.filter((i) => i.type === "indirect").length} entries`} color={COLORS.magenta} soft={magentaSoft} />
        <StatCard icon={CheckCircle2} label="Total income" value={taka(grandTotal)} color={graya} soft={grayaSoft} />
      </div>

      <CompositionBar incomes={incomes} />

      <div className="flex items-center gap-1 p-1 rounded-xl mb-4 w-fit" style={{ backgroundColor: COLORS.panel, border: `1px solid ${COLORS.line}` }}>
        {[
          { id: "all", name: "All income" },
          { id: "direct", name: "Direct" },
          { id: "indirect", name: "Indirect" },
        ].map((t) => {
          const active = tab === t.id;
          const c = t.id === "direct" ? green : t.id === "indirect" ? COLORS.magenta : COLORS.ink;
          const s = t.id === "direct" ? greenSoft : t.id === "indirect" ? magentaSoft : grayaSoft;
          return (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                setCategoryFilter("ALL");
              }}
              className="rounded-lg px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors"
              style={{ backgroundColor: active ? s : "transparent", color: active ? c : COLORS.muted }}
            >
              {t.name}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 border flex-1 min-w-[220px]" style={{ borderColor: COLORS.line, backgroundColor: COLORS.panel }}>
          <Search size={14} style={{ color: COLORS.muted }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search source / note / income ID"
            className="bg-transparent outline-none text-[13px] w-full"
            style={{ color: COLORS.ink }}
          />
        </div>

        <Select
          value={categoryFilter}
          onChange={setCategoryFilter}
          icon={Filter}
          options={[{ id: "ALL", name: "All categories" }, ...visibleCategories]}
        />
      </div>

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
                  {["Source", "Type", "Category", "Received into", "Date", "Amount"].map((label) => (
                    <th key={label} className="text-left px-5 py-3 text-white" style={{ backgroundColor: COLORS.vermillion }}>
                      <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((i) => {
                  const cat = categoryOf(i.type, i.category);
                  const Icon = cat.icon;
                  const acct = RECEIVE_ACCOUNTS.find((a) => a.id === i.account);
                  const typeColor = i.type === "direct" ? green : COLORS.magenta;
                  const typeSoft = i.type === "direct" ? greenSoft : magentaSoft;
                  return (
                    <tr key={i.id || i.income_no} className="border-b hover:bg-black/[0.02] transition-colors" style={{ borderColor: COLORS.line }}>
                      <td className="px-5 py-3.5" style={{ color: COLORS.ink }}>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: cat.soft }}>
                            <Icon size={14} style={{ color: cat.color }} />
                          </div>
                          <div>
                            <div className="font-semibold">{i.source || i.income_no || "Income Record"}</div>
                            {i.note && <div className="text-[11px]" style={{ color: COLORS.muted }}>{i.note}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize"
                          style={{ backgroundColor: typeSoft, color: typeColor }}
                        >
                          {i.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: COLORS.muted }}>
                        <span className="text-[12.5px]">{cat.name}</span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: COLORS.muted }}>
                        <div className="flex items-center gap-1.5 text-[12.5px]">
                          {acct?.id === "cash" ? <Banknote size={12} /> : <Landmark size={12} />}
                          {acct?.name || i.account}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: COLORS.muted, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                        {i.date}
                      </td>
                      <td className="px-5 py-3.5 font-semibold whitespace-nowrap" style={{ color: typeColor, fontFamily: FONTS.MONO }}>
                        {taka(i.amount)}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-[13px]" style={{ color: COLORS.muted }}>
                      No income entries match your filters — try a different search or category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {toast && (
        <div
          className="fixed bottom-5 right-5 flex items-center gap-2 rounded-xl px-4 py-3 text-[12.5px] font-semibold text-white shadow-lg z-50"
          style={{ backgroundColor: COLORS.vermillion }}
        >
          <CheckCircle2 size={14} />
          {toast}
        </div>
      )}

      <IncomeDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSave={handleSave} />
    </div>
  );
}

export default IncomesAcc;