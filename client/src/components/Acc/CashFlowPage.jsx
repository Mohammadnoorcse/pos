import React from "react";
import {
  Wallet,
  Search,
  ChevronDown,
  Filter,
  Download,
  X,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeft,
  Banknote,
  Landmark,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Tag,
  FileText,
  Trash2,
} from "lucide-react";

/* ---------------------------------------------------------------------
   Design tokens — kept in step with the sibling Bank Details / Stock
   Transfer / Invoices pages (warm paper surface, vermillion primary
   accent, magenta secondary). This page inherits that house style
   since it lives in the same product (Acc & Transaction Wing →
   Bank & Cash → Cash Flow).
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

const SOURCES = [
  { id: "cash", name: "Cash in hand", icon: Banknote },
  { id: "BNK-001", name: "Islami Bank — Motijheel", icon: Landmark },
  { id: "BNK-002", name: "Dutch-Bangla — Agrabad", icon: Landmark },
  { id: "BNK-003", name: "BRAC Bank — Gulshan", icon: Landmark },
];

const CATEGORIES_IN = ["Sales collection", "Customer payment", "Loan received", "Capital injection", "Other income"];
const CATEGORIES_OUT = ["Supplier payment", "Godown rent", "Salary & wages", "Utility bill", "Transport", "Bank charges", "Other expense"];

function sourceName(id) {
  return SOURCES.find((s) => s.id === id)?.name || id;
}
function sourceIcon(id) {
  return SOURCES.find((s) => s.id === id)?.icon || Wallet;
}

const OPENING_BALANCE = 218400;

const INITIAL_ENTRIES = [
  { id: "CF-2210", date: "22-07-2026", type: "in", source: "BNK-001", category: "Customer payment", note: "Rafiq Traders — invoice settlement", amount: 145000 },
  { id: "CF-2209", date: "22-07-2026", type: "out", source: "cash", category: "Transport", note: "Delivery van fuel & toll", amount: 4200 },
  { id: "CF-2207", date: "21-07-2026", type: "out", source: "BNK-002", category: "Supplier payment", note: "Cumin Seed lot — TRF-1035 settlement", amount: 66000 },
  { id: "CF-2205", date: "21-07-2026", type: "in", source: "cash", category: "Sales collection", note: "Counter sales, evening shift", amount: 38500 },
  { id: "CF-2203", date: "20-07-2026", type: "out", source: "BNK-001", category: "Godown rent", note: "Central Godown — July rent", amount: 32000 },
  { id: "CF-2201", date: "19-07-2026", type: "out", source: "cash", category: "Salary & wages", note: "Warehouse staff — weekly wages", amount: 21000 },
  { id: "CF-2198", date: "18-07-2026", type: "in", source: "BNK-003", category: "Loan received", note: "Working capital top-up", amount: 100000 },
  { id: "CF-2195", date: "18-07-2026", type: "in", source: "cash", category: "Sales collection", note: "Counter sales, morning shift", amount: 27600 },
  { id: "CF-2192", date: "16-07-2026", type: "out", source: "BNK-004", category: "Bank charges", note: "Quarterly maintenance fee", amount: 1200 },
  { id: "CF-2189", date: "15-07-2026", type: "out", source: "cash", category: "Utility bill", note: "Electricity — Central Godown", amount: 9800 },
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

function TypePill({ type }) {
  const isIn = type === "in";
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: isIn ? greenSoft : redSoft, color: isIn ? green : red }}
    >
      {isIn ? <ArrowDownRight size={11} /> : <ArrowUpRight size={11} />}
      {isIn ? "Cash in" : "Cash out"}
    </span>
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
   Signature element: a "cash ledger" entry sheet.
   Bangladeshi shopkeepers keep a rokod বই (cash book) with a big
   toggle for জমা (in) / খরচ (out) at the top of every entry, then
   amount, source, and note beneath. This drawer mirrors that physical
   ledger sheet rather than a generic form modal — the in/out toggle
   drives the accent color of the whole sheet.
--------------------------------------------------------------------- */
function EntryDrawer({ open, onClose, onSave }) {
  const [type, setType] = React.useState("in");
  const [form, setForm] = React.useState({
    date: "22-07-2026",
    source: "cash",
    category: CATEGORIES_IN[0],
    note: "",
    amount: "",
  });

  React.useEffect(() => {
    if (open) {
      setType("in");
      setForm({ date: "22-07-2026", source: "cash", category: CATEGORIES_IN[0], note: "", amount: "" });
    }
  }, [open]);

  if (!open) return null;
  const accent = type === "in" ? green : red;
  const accentSoft = type === "in" ? greenSoft : redSoft;
  const categories = type === "in" ? CATEGORIES_IN : CATEGORIES_OUT;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = () => {
    if (!form.amount || Number(form.amount) <= 0) return;
    onSave({ ...form, type, amount: Number(form.amount) });
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
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: vermillionSoft }}>
              <Wallet size={15} style={{ color: COLORS.vermillion }} />
            </div>
            <div>
              <h2 className="text-[14.5px] font-bold" style={{ color: COLORS.ink }}>New cash entry</h2>
              <p className="text-[11px]" style={{ color: COLORS.muted }}>রোকড বই · Cash book entry</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5">
            <X size={15} style={{ color: COLORS.muted }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* In / Out toggle */}
          <div className="rounded-lg border p-1 flex mb-5" style={{ borderColor: COLORS.line }}>
            <button
              onClick={() => setType("in")}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-md py-2.5 text-[12.5px] font-semibold transition-colors"
              style={{ backgroundColor: type === "in" ? green : "transparent", color: type === "in" ? "#fff" : COLORS.muted }}
            >
              <TrendingUp size={13} />
              জমা · Cash in
            </button>
            <button
              onClick={() => setType("out")}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-md py-2.5 text-[12.5px] font-semibold transition-colors"
              style={{ backgroundColor: type === "out" ? red : "transparent", color: type === "out" ? "#fff" : COLORS.muted }}
            >
              <TrendingDown size={13} />
              খরচ · Cash out
            </button>
          </div>

          {/* Amount, big and central like a ledger line */}
          <div className="rounded-xl border p-4 mb-5 text-center" style={{ borderColor: COLORS.line, backgroundColor: accentSoft }}>
            <div className="text-[10.5px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: COLORS.muted }}>
              Amount
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
              <Field label="Source / account">
                <Select value={form.source} onChange={(v) => setForm((f) => ({ ...f, source: v }))} icon={Wallet} options={SOURCES} />
              </Field>
            </div>

            <Field label="Category">
              <div className="relative">
                <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: COLORS.line }}>
                  <Tag size={13} style={{ color: COLORS.muted }} />
                  <select
                    value={form.category}
                    onChange={set("category")}
                    className="bg-transparent outline-none text-[13px] w-full appearance-none"
                    style={{ color: COLORS.ink }}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} style={{ color: COLORS.muted, pointerEvents: "none" }} />
                </div>
              </div>
            </Field>

            <Field label="Note">
              <div className="flex items-start gap-2 rounded-lg border px-3 py-2" style={{ borderColor: COLORS.line }}>
                <FileText size={13} style={{ color: COLORS.muted, marginTop: 2 }} />
                <textarea
                  value={form.note}
                  onChange={set("note")}
                  placeholder="e.g. Rafiq Traders — invoice settlement"
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
            className="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[12.5px] font-semibold text-white"
            style={{ backgroundColor: accent }}
          >
            <Plus size={13} />
            Save entry
          </button>
        </div>
      </div>
    </div>
  );
}

export function CashFlowPage({ onNavigate }) {
  const [entries, setEntries] = React.useState(INITIAL_ENTRIES);
  const [query, setQuery] = React.useState("");
  const [sourceFilter, setSourceFilter] = React.useState("ALL");
  const [typeFilter, setTypeFilter] = React.useState("ALL");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [toast, setToast] = React.useState("");

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // Sorted chronologically to compute a running balance
  const sortedAsc = [...entries].sort((a, b) => a.id.localeCompare(b.id));
  let running = OPENING_BALANCE;
  const withBalance = sortedAsc.map((e) => {
    running += e.type === "in" ? e.amount : -e.amount;
    return { ...e, runningBalance: running };
  });
  const closingBalance = running;
  const byId = Object.fromEntries(withBalance.map((e) => [e.id, e.runningBalance]));

  const totalIn = entries.filter((e) => e.type === "in").reduce((s, e) => s + e.amount, 0);
  const totalOut = entries.filter((e) => e.type === "out").reduce((s, e) => s + e.amount, 0);
  const net = totalIn - totalOut;

  const filtered = [...entries]
    .sort((a, b) => b.id.localeCompare(a.id))
    .filter((e) => {
      const matchesQuery = [e.note, e.category, sourceName(e.source)].join(" ").toLowerCase().includes(query.toLowerCase());
      const matchesSource = sourceFilter === "ALL" || e.source === sourceFilter;
      const matchesType = typeFilter === "ALL" || e.type === typeFilter;
      return matchesQuery && matchesSource && matchesType;
    });

  const handleSave = (form) => {
    const nextNum = Math.max(...entries.map((e) => parseInt(e.id.split("-")[1], 10))) + 1;
    const newEntry = { id: "CF-" + nextNum, ...form };
    setEntries((prev) => [newEntry, ...prev]);
    setDrawerOpen(false);
    notify(`${form.type === "in" ? "Cash in" : "Cash out"} of ${taka(form.amount)} recorded`);
  };

  const handleDelete = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    notify(`${id} removed`);
  };

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      <style>{`@keyframes slideIn { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: magentaSoft }}>
            <Wallet size={16} style={{ color: COLORS.magenta }} />
          </div>
          <div>
            <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>Cash Flow</h1>
            <p className="text-[12px]" style={{ color: COLORS.muted }}>
              Every cash-in and cash-out movement, with a running balance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onNavigate && onNavigate("acc-bank-cash")}
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold border"
            style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.panel }}
          >
            <ArrowLeft size={13} />
            Bank & Cash
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
            className="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-md"
            style={{ backgroundColor: COLORS.vermillion, boxShadow: `0 4px 10px ${COLORS.vermillion}40` }}
          >
            <Plus size={13} />
            New entry
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <StatCard icon={Wallet} label="Closing balance" value={taka(closingBalance)} sub={`Opened at ${taka(OPENING_BALANCE)}`} color={COLORS.vermillion} soft={vermillionSoft} />
        <StatCard icon={TrendingUp} label="Cash in" value={taka(totalIn)} sub={`${entries.filter((e) => e.type === "in").length} entries`} color={green} soft={greenSoft} />
        <StatCard icon={TrendingDown} label="Cash out" value={taka(totalOut)} sub={`${entries.filter((e) => e.type === "out").length} entries`} color={red} soft={redSoft} />
        <StatCard icon={net >= 0 ? TrendingUp : TrendingDown} label="Net flow" value={taka(net)} sub={net >= 0 ? "Positive period" : "Negative period"} color={net >= 0 ? green : red} soft={net >= 0 ? greenSoft : redSoft} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 border flex-1 min-w-[220px]" style={{ borderColor: COLORS.line, backgroundColor: COLORS.panel }}>
          <Search size={14} style={{ color: COLORS.muted }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search note / category / source"
            className="bg-transparent outline-none text-[13px] w-full"
            style={{ color: COLORS.ink }}
          />
        </div>

        <Select
          value={sourceFilter}
          onChange={setSourceFilter}
          icon={Landmark}
          options={[{ id: "ALL", name: "Any source" }, ...SOURCES]}
        />
        <Select
          value={typeFilter}
          onChange={setTypeFilter}
          icon={Filter}
          options={[
            { id: "ALL", name: "In & out" },
            { id: "in", name: "Cash in" },
            { id: "out", name: "Cash out" },
          ]}
        />
      </div>

      {/* Ledger table */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr>
                {["Date", "Type", "Source", "Category", "Note", "Amount", "Balance", ""].map((label) => (
                  <th key={label} className="text-left px-5 py-3 text-white" style={{ backgroundColor: COLORS.vermillion }}>
                    <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => {
                const SourceIcon = sourceIcon(e.source);
                return (
                  <tr key={e.id} className="border-b hover:bg-black/[0.02] transition-colors" style={{ borderColor: COLORS.line }}>
                    <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: COLORS.muted, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                      {e.date}
                    </td>
                    <td className="px-5 py-3.5">
                      <TypePill type={e.type} />
                    </td>
                    <td className="px-5 py-3.5" style={{ color: COLORS.ink }}>
                      <div className="flex items-center gap-1.5">
                        <SourceIcon size={13} style={{ color: COLORS.muted }} />
                        <span className="text-[12.5px]">{sourceName(e.source)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5" style={{ color: COLORS.muted }}>
                      {e.category}
                    </td>
                    <td className="px-5 py-3.5 max-w-[220px] truncate" style={{ color: COLORS.ink }}>
                      {e.note}
                    </td>
                    <td
                      className="px-5 py-3.5 font-semibold whitespace-nowrap"
                      style={{ color: e.type === "in" ? green : red, fontFamily: FONTS.MONO }}
                    >
                      {e.type === "in" ? "+" : "-"}{taka(e.amount)}
                    </td>
                    <td className="px-5 py-3.5 font-semibold whitespace-nowrap" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                      {taka(byId[e.id])}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="text-[11.5px] font-semibold whitespace-nowrap inline-flex items-center gap-1"
                        style={{ color: COLORS.muted }}
                      >
                        <Trash2 size={11} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-[13px]" style={{ color: COLORS.muted }}>
                    No entries match your filters.
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
          <Wallet size={14} />
          {toast}
        </div>
      )}

      {/* Entry drawer */}
      <EntryDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSave={handleSave} />
    </div>
  );
}

export default CashFlowPage;