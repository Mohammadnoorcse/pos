import React, { useState, useEffect } from "react";
import {
  Landmark,
  Search,
  ChevronDown,
  Filter,
  Download,
  X,
  Plus,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  CreditCard,
  Hash,
  ArrowLeft,
  Pencil,
  Trash2,
  Copy,
  Loader2,
} from "lucide-react";
import {
  fetchBanks,
  createBank,
  updateBank,
  deleteBank,
} from "../../api/acc/bankService";

/* ---------------------------------------------------------------------
   Design tokens — kept in step with the sibling Stock Transfer / Godown
   / Current Stock / Invoices pages (warm paper surface, vermillion
   primary accent, magenta secondary). This page inherits that house
   style rather than introducing a new one, since it lives in the same
   product (Acc & Transaction Wing → Bank & Cash → Banks).
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

const ACCOUNT_TYPES = ["Current", "Savings", "OD / CC"];

const RECENT_TX = [
  { id: "TX-9091", bank: "BNK-001", type: "credit", note: "Customer payment — Rafiq Traders", amount: 145000, date: "22-07-2026" },
  { id: "TX-9088", bank: "BNK-002", type: "debit", note: "Supplier payment — Cumin Seed lot", amount: 66000, date: "21-07-2026" },
  { id: "TX-9084", bank: "BNK-001", type: "debit", note: "Godown rent — July", amount: 32000, date: "20-07-2026" },
  { id: "TX-9079", bank: "BNK-003", type: "credit", note: "Cash deposit", amount: 50000, date: "18-07-2026" },
  { id: "TX-9071", bank: "BNK-004", type: "debit", note: "Bank charges", amount: 1200, date: "16-07-2026" },
];

function taka(n) {
  const sign = n < 0 ? "-" : "";
  return sign + "৳" + Math.abs(n).toLocaleString("en-BD");
}

function maskAccount(num) {
  if (!num) return "";
  const tail = num.slice(-4);
  return "•••• " + tail;
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

function StatusPill({ status }) {
  const isActive = status === "active";
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{
        backgroundColor: isActive ? greenSoft : redSoft,
        color: isActive ? green : red,
      }}
    >
      {isActive ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
      {isActive ? "Active" : "Frozen"}
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

function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full rounded-lg border px-3 py-2 text-[13px] outline-none"
      style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.panel, fontFamily: FONTS.BODY }}
    />
  );
}

/* ---------------------------------------------------------------------
   Signature element: a "passbook stub" drawer.
   Bangladeshi ledger books (ব্যাংক পাশবই) show account identity at the
   top like a stub, followed by a running balance ledger. This drawer
   mirrors that: a stub header with bank + account chip, then a
   statement-style transaction ledger for that account, rather than a
   generic form-only modal.
--------------------------------------------------------------------- */
function BankDrawer({ bank, onClose, onSave, onDelete, mode }) {
  const [form, setForm] = React.useState(
    bank || {
      id: "",
      bankName: "",
      branch: "",
      accountName: "",
      accountNumber: "",
      routingNumber: "",
      type: "Current",
      openingBalance: 0,
      balance: 0,
      status: "active",
    }
  );

  React.useEffect(() => {
    setForm(
      bank || {
        id: "",
        bankName: "",
        branch: "",
        accountName: "",
        accountNumber: "",
        routingNumber: "",
        type: "Current",
        openingBalance: 0,
        balance: 0,
        status: "active",
      }
    );
  }, [bank]);

  if (!mode) return null;
  const isNew = mode === "new";
  const tx = bank ? RECENT_TX.filter((t) => t.bank === bank.code) : [];

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

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
              <Landmark size={15} style={{ color: COLORS.vermillion }} />
            </div>
            <div>
              <h2 className="text-[14.5px] font-bold" style={{ color: COLORS.ink }}>
                {isNew ? "Add bank account" : bank.bankName}
              </h2>
              <p className="text-[11px]" style={{ color: COLORS.muted }}>
                {isNew ? "New account details" : `${bank.code} · ${bank.branch}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5">
            <X size={15} style={{ color: COLORS.muted }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Passbook stub */}
          <div className="rounded-xl border p-4 mb-5" style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10.5px] font-semibold uppercase tracking-wider" style={{ color: COLORS.muted }}>
                Account stub
              </span>
              {!isNew && <StatusPill status={form.status} />}
            </div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: COLORS.muted }}>
                  Account holder
                </div>
                <div className="font-semibold text-[13px]" style={{ color: COLORS.ink }}>
                  {form.accountName || "—"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: COLORS.muted }}>
                  Balance
                </div>
                <div
                  className="font-bold text-[15px]"
                  style={{ color: form.balance < 0 ? red : COLORS.ink, fontFamily: FONTS.MONO }}
                >
                  {taka(Number(form.balance) || 0)}
                </div>
              </div>
            </div>
            {!isNew && (
              <>
                <div className="border-t border-dashed my-3" style={{ borderColor: COLORS.line }} />
                <div className="flex items-center gap-2 text-[12.5px]" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                  <Hash size={12} style={{ color: COLORS.muted }} />
                  {form.accountNumber}
                  <button
                    onClick={() => navigator.clipboard && navigator.clipboard.writeText(form.accountNumber)}
                    className="ml-auto text-[11px] font-semibold flex items-center gap-1"
                    style={{ color: COLORS.magenta, fontFamily: FONTS.BODY }}
                  >
                    <Copy size={11} />
                    Copy
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Form */}
          <div className="space-y-3.5">
            <Field label="Bank name">
              <TextInput value={form.bankName} onChange={set("bankName")} placeholder="e.g. Islami Bank Bangladesh" />
            </Field>
            <Field label="Branch">
              <TextInput value={form.branch} onChange={set("branch")} placeholder="e.g. Motijheel Branch, Dhaka" />
            </Field>
            <Field label="Account holder name">
              <TextInput value={form.accountName} onChange={set("accountName")} placeholder="Account title" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Account number">
                <TextInput value={form.accountNumber} onChange={set("accountNumber")} placeholder="0000000000" />
              </Field>
              <Field label="Routing number">
                <TextInput value={form.routingNumber} onChange={set("routingNumber")} placeholder="000000000" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Account type">
                <div className="rounded-lg border px-1 py-1 flex" style={{ borderColor: COLORS.line }}>
                  {ACCOUNT_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm((f) => ({ ...f, type: t }))}
                      className="flex-1 rounded-md py-1.5 text-[11.5px] font-semibold transition-colors"
                      style={{
                        backgroundColor: form.type === t ? COLORS.vermillion : "transparent",
                        color: form.type === t ? "#fff" : COLORS.muted,
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Opening balance">
                <TextInput type="number" value={form.openingBalance} onChange={set("openingBalance")} placeholder="0" />
              </Field>
            </div>
          </div>

          {/* Recent transactions for this account */}
          {!isNew && (
            <div className="mt-6">
              <div className="text-[11.5px] font-semibold uppercase tracking-wide mb-2.5" style={{ color: COLORS.muted }}>
                Recent transactions
              </div>
              <div className="space-y-2">
                {tx.length === 0 && (
                  <div className="text-[12.5px] py-4 text-center" style={{ color: COLORS.muted }}>
                    No recent transactions.
                  </div>
                )}
                {tx.map((t) => (
                  <div key={t.id} className="flex items-center gap-2.5 py-2 border-b" style={{ borderColor: COLORS.line }}>
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: t.type === "credit" ? greenSoft : redSoft }}
                    >
                      {t.type === "credit" ? (
                        <ArrowDownRight size={13} style={{ color: green }} />
                      ) : (
                        <ArrowUpRight size={13} style={{ color: red }} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[12.5px] font-medium truncate" style={{ color: COLORS.ink }}>
                        {t.note}
                      </div>
                      <div className="text-[10.5px]" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>
                        {t.date}
                      </div>
                    </div>
                    <div
                      className="text-[12.5px] font-semibold whitespace-nowrap"
                      style={{ color: t.type === "credit" ? green : red, fontFamily: FONTS.MONO }}
                    >
                      {t.type === "credit" ? "+" : "-"}
                      {taka(t.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-2 px-5 py-4 border-t shrink-0" style={{ borderColor: COLORS.line }}>
          {!isNew ? (
            <button
              onClick={() => onDelete(form.id)}
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold"
              style={{ color: red }}
            >
              <Trash2 size={13} />
              Remove
            </button>
          ) : (
            <span />
          )}
          <button
            onClick={() => onSave(form, isNew)}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[12.5px] font-semibold text-white"
            style={{ backgroundColor: COLORS.vermillion }}
          >
            {isNew ? <Plus size={13} /> : <CheckCircle2 size={13} />}
            {isNew ? "Add account" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function BankDetailsPage({ onNavigate }) {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [drawer, setDrawer] = useState({ mode: null, bank: null });
  const [toast, setToast] = useState("");

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // ব্যাংক লিস্ট লোড করা
  const loadBanks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBanks();
      setBanks(data.data || []);
    } catch (err) {
      console.error("Error loading banks:", err);
      setError("ব্যাংক অ্যাকাউন্ট লিস্ট লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanks();
  }, []);

  const filtered = banks.filter((b) => {
    const matchesQuery = [b.bankName, b.branch, b.accountName, b.accountNumber]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesType = typeFilter === "ALL" || b.type === typeFilter;
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchesQuery && matchesType && matchesStatus;
  });

  const totalBalance = banks.reduce((s, b) => s + (b.balance || 0), 0);
  const activeCount = banks.filter((b) => b.status === "active").length;
  const frozenCount = banks.filter((b) => b.status === "frozen").length;
  const negativeCount = banks.filter((b) => b.balance < 0).length;

  // নতুন অ্যাকাউন্ট তৈরি / বিদ্যমান অ্যাকাউন্ট আপডেট
  const handleSave = async (form, isNew) => {
    try {
      if (isNew) {
        const payload = {
          ...form,
          openingBalance: Number(form.openingBalance) || 0,
          balance: Number(form.openingBalance) || 0,
        };
        await createBank(payload);
        notify(`${form.bankName} account added`);
      } else {
        const payload = {
          ...form,
          openingBalance: Number(form.openingBalance) || 0,
          balance: Number(form.balance) || 0,
        };
        await updateBank(form.id, payload);
        notify(`${form.bankName} details updated`);
      }
      setDrawer({ mode: null, bank: null });
      loadBanks();
    } catch (err) {
      console.error("Error saving bank account:", err);
      alert("ব্যাংক অ্যাকাউন্ট সেভ করা সম্ভব হয়নি।");
    }
  };

  // অ্যাকাউন্ট ডিলিট করা
  const handleDelete = async (id) => {
    const b = banks.find((x) => x.id === id);
    try {
      await deleteBank(id);
      setDrawer({ mode: null, bank: null });
      notify(`${b ? b.bankName : "Account"} removed`);
      loadBanks();
    } catch (err) {
      console.error("Error deleting bank account:", err);
      alert("ব্যাংক অ্যাকাউন্ট ডিলিট করতে সমস্যা হয়েছে।");
    }
  };

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      <style>{`@keyframes slideIn { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: magentaSoft }}>
            <Landmark size={16} style={{ color: COLORS.magenta }} />
          </div>
          <div>
            <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>
              Bank Details
            </h1>
            <p className="text-[12px]" style={{ color: COLORS.muted }}>
              All company bank accounts, balances, and recent activity
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
            onClick={() => setDrawer({ mode: "new", bank: null })}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-md"
            style={{ backgroundColor: COLORS.vermillion, boxShadow: `0 4px 10px ${COLORS.vermillion}40` }}
          >
            <Plus size={13} />
            Add bank
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <StatCard icon={Wallet} label="Total balance" value={taka(totalBalance)} sub={`${banks.length} accounts`} color={COLORS.vermillion} soft={vermillionSoft} />
        <StatCard icon={CheckCircle2} label="Active accounts" value={activeCount} color={green} soft={greenSoft} />
        <StatCard icon={AlertCircle} label="Frozen accounts" value={frozenCount} sub={frozenCount > 0 ? "Needs attention" : "None"} color={graya} soft={grayaSoft} />
        <StatCard icon={ArrowUpRight} label="Negative balance" value={negativeCount} sub={negativeCount > 0 ? "Overdrawn" : "All clear"} color={red} soft={redSoft} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 border flex-1 min-w-[220px]" style={{ borderColor: COLORS.line, backgroundColor: COLORS.panel }}>
          <Search size={14} style={{ color: COLORS.muted }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bank / branch / account name or number"
            className="bg-transparent outline-none text-[13px] w-full"
            style={{ color: COLORS.ink }}
          />
        </div>

        <Select
          value={typeFilter}
          onChange={setTypeFilter}
          icon={CreditCard}
          options={[{ id: "ALL", name: "All types" }, ...ACCOUNT_TYPES.map((t) => ({ id: t, name: t }))]}
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          icon={Filter}
          options={[
            { id: "ALL", name: "All statuses" },
            { id: "active", name: "Active" },
            { id: "frozen", name: "Frozen" },
          ]}
        />
      </div>

      {/* Accounts table */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
        {loading ? (
          <div className="flex items-center justify-center py-10 gap-2" style={{ color: COLORS.muted }}>
            <Loader2 className="animate-spin" size={20} />
            <span>ডাটা লোড হচ্ছে...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8" style={{ color: red }}>
            {error}
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr>
                {["Bank", "Account", "Type", "Account No.", "Balance", "Status", ""].map((label) => (
                  <th key={label} className="text-left px-5 py-3 text-white" style={{ backgroundColor: COLORS.vermillion }}>
                    <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr
                  key={b.id}
                  className="border-b hover:bg-black/[0.02] transition-colors cursor-pointer"
                  style={{ borderColor: COLORS.line }}
                  onClick={() => setDrawer({ mode: "view", bank: b })}
                >
                  <td className="px-5 py-3.5" style={{ color: COLORS.ink }}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: vermillionSoft }}>
                        <Building2 size={14} style={{ color: COLORS.vermillion }} />
                      </div>
                      <div>
                        <div className="font-semibold">{b.bankName}</div>
                        <div className="text-[11px]" style={{ color: COLORS.muted }}>{b.branch}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5" style={{ color: COLORS.ink }}>
                    {b.accountName}
                  </td>
                  <td className="px-5 py-3.5" style={{ color: COLORS.muted }}>
                    {b.type}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: COLORS.muted, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                    {maskAccount(b.accountNumber)}
                  </td>
                  <td
                    className="px-5 py-3.5 font-semibold whitespace-nowrap"
                    style={{ color: b.balance < 0 ? red : COLORS.ink, fontFamily: FONTS.MONO }}
                  >
                    {taka(b.balance)}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusPill status={b.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); setDrawer({ mode: "view", bank: b }); }}
                      className="text-[11.5px] font-semibold whitespace-nowrap inline-flex items-center gap-1"
                      style={{ color: COLORS.magenta }}
                    >
                      <Pencil size={11} />
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-[13px]" style={{ color: COLORS.muted }}>
                    No accounts match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-5 right-5 flex items-center gap-2 rounded-xl px-4 py-3 text-[12.5px] font-semibold text-white shadow-lg z-50"
          style={{ backgroundColor: COLORS.magenta }}
        >
          <Landmark size={14} />
          {toast}
        </div>
      )}

      {/* Drawer */}
      <BankDrawer
        bank={drawer.bank}
        mode={drawer.mode}
        onClose={() => setDrawer({ mode: null, bank: null })}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default BankDetailsPage;