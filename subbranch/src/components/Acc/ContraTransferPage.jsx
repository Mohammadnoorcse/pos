import React from "react";
import { fetchContraTransfers, createContraTransfer, cancelContraTransfer } from "../../api/acc/contraTransferService";
import {
  ArrowLeftRight,
  Loader2,
  Search,
  ChevronDown,
  Filter,
  Download,
  X,
  Plus,
  ArrowRight,
  ArrowLeft,
  Banknote,
  Landmark,
  CalendarDays,
  FileText,
  CheckCircle2,
  Clock,
  Trash2,
  RefreshCw,
} from "lucide-react";

/* ---------------------------------------------------------------------
   Design tokens — kept in step with the sibling Bank Details / Cash
   Flow / Invoices pages (warm paper surface, vermillion primary
   accent, magenta secondary). This page inherits that house style
   since it lives in the same product (Acc & Transaction Wing →
   Bank & Cash → Contra / Balance Transfer).
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
const blueSoft = "#E8EEFC";
const blue = "#2657C7";

const ACCOUNTS = [
  { id: "cash", name: "Cash in hand", icon: Banknote, balance: 96700 },
  { id: "BNK-001", name: "Islami Bank — Motijheel", icon: Landmark, balance: 1284650 },
  { id: "BNK-002", name: "Dutch-Bangla — Agrabad", icon: Landmark, balance: 642300 },
  { id: "BNK-003", name: "BRAC Bank — Gulshan", icon: Landmark, balance: 318900 },
  { id: "BNK-004", name: "Sonali Bank — Bogura", icon: Landmark, balance: -84200 },
];

function accountOf(id) {
  return ACCOUNTS.find((a) => a.id === id);
}
function accountName(id) {
  return accountOf(id)?.name || id;
}
function accountIcon(id) {
  return accountOf(id)?.icon || Banknote;
}

const STATUS_META = {
  pending: { label: "Pending", color: blue, soft: blueSoft, icon: Clock },
  completed: { label: "Completed", color: green, soft: greenSoft, icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: graya, soft: grayaSoft, icon: Trash2 },
};

const TODAY = "22-07-2026";

function taka(n) {
  const sign = n < 0 ? "-" : "";
  return sign + "৳" + Math.abs(n).toLocaleString("en-BD");
}

// API returns ISO timestamps (e.g. "2026-07-22T00:00:00.000000Z");
// the UI displays DD-MM-YYYY throughout (see TODAY above), so normalize on the way in.
function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

// Maps a raw API transfer record to the shape the UI expects.
function mapTransfer(t) {
  return {
    id: t.transfer_no,
    date: formatDate(t.date),
    from: t.from_account,
    to: t.to_account,
    amount: Number(t.amount),
    note: t.note || "",
    status: t.status,
    ref: t.ref || "",
  };
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
  const meta = STATUS_META[status] || STATUS_META.pending;
  const Icon = meta.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: meta.soft, color: meta.color }}
    >
      <Icon size={11} />
      {meta.label}
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
   Signature element: a "transfer chit" slip.
   Bangladeshi accountants log a contra entry — money moving between
   two of the business's own accounts — on a small dual-column chit:
   FROM on the left, TO on the right, joined by a transfer arrow, with
   the amount stamped in the middle. This drawer mirrors that chit,
   including a live from/to swap control, rather than a generic
   single-column form.
--------------------------------------------------------------------- */
function ContraDrawer({ open, onClose, onSave }) {
  const [form, setForm] = React.useState({
    date: TODAY,
    from: "BNK-001",
    to: "cash",
    amount: "",
    note: "",
    ref: "",
  });

  React.useEffect(() => {
    if (open) setForm({ date: TODAY, from: "BNK-001", to: "cash", amount: "", note: "", ref: "" });
  }, [open]);

  if (!open) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const swap = () => setForm((f) => ({ ...f, from: f.to, to: f.from }));
  const sameAccount = form.from === form.to;
  const fromBalance = accountOf(form.from)?.balance ?? 0;
  const insufficient = Number(form.amount) > fromBalance;

  const handleSave = () => {
    if (!form.amount || Number(form.amount) <= 0 || sameAccount) return;
    onSave({ ...form, amount: Number(form.amount) });
  };

  const FromIcon = accountIcon(form.from);
  const ToIcon = accountIcon(form.to);

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
              <ArrowLeftRight size={15} style={{ color: COLORS.vermillion }} />
            </div>
            <div>
              <h2 className="text-[14.5px] font-bold" style={{ color: COLORS.ink }}>New contra entry</h2>
              <p className="text-[11px]" style={{ color: COLORS.muted }}>কন্ট্রা ভাউচার · Fund transfer chit</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5">
            <X size={15} style={{ color: COLORS.muted }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Transfer chit */}
          <div className="rounded-xl border p-4 mb-5" style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10.5px] font-semibold uppercase tracking-wider" style={{ color: COLORS.muted }}>
                Transfer chit
              </span>
              <span className="text-[11px] font-semibold" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>{form.date}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg border p-3" style={{ borderColor: COLORS.line, backgroundColor: COLORS.panel }}>
                <div className="text-[10px] uppercase tracking-wide mb-1.5" style={{ color: COLORS.muted }}>From</div>
                <div className="flex items-center gap-1.5 mb-1">
                  <FromIcon size={13} style={{ color: COLORS.vermillion }} />
                  <select
                    value={form.from}
                    onChange={set("from")}
                    className="bg-transparent outline-none text-[12.5px] font-semibold w-full appearance-none"
                    style={{ color: COLORS.ink }}
                  >
                    {ACCOUNTS.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
                <div className="text-[10.5px]" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>
                  Bal: {taka(fromBalance)}
                </div>
              </div>

              <button
                onClick={swap}
                className="w-8 h-8 rounded-full flex items-center justify-center border shrink-0"
                style={{ borderColor: COLORS.line, backgroundColor: COLORS.panel }}
                title="Swap from / to"
              >
                <RefreshCw size={13} style={{ color: COLORS.magenta }} />
              </button>

              <div className="flex-1 rounded-lg border p-3" style={{ borderColor: COLORS.line, backgroundColor: COLORS.panel }}>
                <div className="text-[10px] uppercase tracking-wide mb-1.5" style={{ color: COLORS.muted }}>To</div>
                <div className="flex items-center gap-1.5 mb-1">
                  <ToIcon size={13} style={{ color: green }} />
                  <select
                    value={form.to}
                    onChange={set("to")}
                    className="bg-transparent outline-none text-[12.5px] font-semibold w-full appearance-none"
                    style={{ color: COLORS.ink }}
                  >
                    {ACCOUNTS.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
                <div className="text-[10.5px]" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>
                  Bal: {taka(accountOf(form.to)?.balance ?? 0)}
                </div>
              </div>
            </div>

            {sameAccount && (
              <div className="mt-2.5 text-[11.5px] font-medium" style={{ color: COLORS.vermillion }}>
                From and To accounts must be different.
              </div>
            )}

            <div className="border-t border-dashed my-3.5" style={{ borderColor: COLORS.line }} />

            <div className="text-center">
              <div className="text-[10.5px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: COLORS.muted }}>
                Amount
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-[22px] font-bold" style={{ color: COLORS.magenta, fontFamily: FONTS.MONO }}>৳</span>
                <input
                  type="number"
                  value={form.amount}
                  onChange={set("amount")}
                  placeholder="0"
                  className="bg-transparent outline-none text-[28px] font-bold text-center w-40"
                  style={{ color: COLORS.magenta, fontFamily: FONTS.MONO }}
                />
              </div>
              {insufficient && (
                <div className="text-[11px] font-medium mt-1" style={{ color: COLORS.vermillion }}>
                  Exceeds available balance in From account
                </div>
              )}
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
              <Field label="Reference no.">
                <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: COLORS.line }}>
                  <FileText size={13} style={{ color: COLORS.muted }} />
                  <input
                    value={form.ref}
                    onChange={set("ref")}
                    placeholder="CHQ / DEP / NEFT no."
                    className="bg-transparent outline-none text-[13px] w-full"
                    style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}
                  />
                </div>
              </Field>
            </div>

            <Field label="Note">
              <div className="flex items-start gap-2 rounded-lg border px-3 py-2" style={{ borderColor: COLORS.line }}>
                <FileText size={13} style={{ color: COLORS.muted, marginTop: 2 }} />
                <textarea
                  value={form.note}
                  onChange={set("note")}
                  placeholder="e.g. Cash withdrawal for weekly wages"
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
            disabled={sameAccount || !form.amount}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[12.5px] font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: COLORS.vermillion }}
          >
            <ArrowLeftRight size={13} />
            Post transfer
          </button>
        </div>
      </div>
    </div>
  );
}

export function ContraTransferPage({ onNavigate }) {
  const [contras, setContras] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [query, setQuery] = React.useState("");
  const [accountFilter, setAccountFilter] = React.useState("ALL");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [toast, setToast] = React.useState("");

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // কন্ট্রা ট্রান্সফার লিস্ট লোড করা
  const loadContras = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchContraTransfers();
      // API responds with { transfers: [...] }, and each record uses
      // from_account/to_account/transfer_no rather than the UI's
      // from/to/id — map it into the shape this page renders.
      const rows = (res.transfers || []).map(mapTransfer);
      setContras(rows);
    } catch (err) {
      console.error("Error loading contra transfers:", err);
      setError("কন্ট্রা ট্রান্সফার লিস্ট লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadContras();
  }, []);

  const filtered = [...contras]
    .sort((a, b) => b.id.localeCompare(a.id))
    .filter((c) => {
      const matchesQuery = [c.id, c.ref, c.note, accountName(c.from), accountName(c.to)]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesAccount = accountFilter === "ALL" || c.from === accountFilter || c.to === accountFilter;
      const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
      return matchesQuery && matchesAccount && matchesStatus;
    });

  const totalMoved = contras.reduce((s, c) => s + c.amount, 0);
  const pendingCount = contras.filter((c) => c.status === "pending").length;
  const completedCount = contras.filter((c) => c.status === "completed").length;
  const cashInvolved = contras.filter((c) => c.from === "cash" || c.to === "cash").length;

  const handleSave = async (form) => {
    try {
      // Backend validates on from_account/to_account, not from/to.
      const payload = {
        date: form.date,
        from_account: form.from,
        to_account: form.to,
        amount: form.amount,
        note: form.note,
        ref: form.ref,
      };
      await createContraTransfer(payload);
      setDrawerOpen(false);
      notify(`${taka(form.amount)} transfer posted from ${accountName(form.from)} to ${accountName(form.to)}`);
      loadContras();
    } catch (err) {
      console.error("Error posting contra transfer:", err);
      alert("ট্রান্সফার পোস্ট করা সম্ভব হয়নি।");
    }
  };

  // পেন্ডিং ট্রান্সফার ক্যান্সেল করা
  const handleCancel = async (id) => {
    try {
      await cancelContraTransfer(id);
      notify(`${id} cancelled`);
      loadContras();
    } catch (err) {
      console.error("Error cancelling contra transfer:", err);
      alert("ট্রান্সফার ক্যান্সেল করতে সমস্যা হয়েছে।");
    }
  };

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      <style>{`@keyframes slideIn { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: magentaSoft }}>
            <ArrowLeftRight size={16} style={{ color: COLORS.magenta }} />
          </div>
          <div>
            <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>Contra / Balance Transfer</h1>
            <p className="text-[12px]" style={{ color: COLORS.muted }}>
              Fund movements between your own cash and bank accounts
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
            onClick={() => onNavigate && onNavigate("acc-contra-list")}
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold border"
            style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.panel }}
          >
            <FileText size={13} />
            Contra List
          </button>
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-md"
            style={{ backgroundColor: COLORS.vermillion, boxShadow: `0 4px 10px ${COLORS.vermillion}40` }}
          >
            <Plus size={13} />
            New transfer
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <StatCard icon={ArrowLeftRight} label="Total moved" value={taka(totalMoved)} sub={`${contras.length} transfers`} color={COLORS.vermillion} soft={vermillionSoft} />
        <StatCard icon={CheckCircle2} label="Completed" value={completedCount} color={green} soft={greenSoft} />
        <StatCard icon={Clock} label="Pending" value={pendingCount} sub={pendingCount > 0 ? "Awaiting confirmation" : "All settled"} color={blue} soft={blueSoft} />
        <StatCard icon={Banknote} label="Cash involved" value={cashInvolved} sub="Transfers touching cash" color={graya} soft={grayaSoft} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 border flex-1 min-w-[220px]" style={{ borderColor: COLORS.line, backgroundColor: COLORS.panel }}>
          <Search size={14} style={{ color: COLORS.muted }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search voucher / reference / note / account"
            className="bg-transparent outline-none text-[13px] w-full"
            style={{ color: COLORS.ink }}
          />
        </div>

        <Select
          value={accountFilter}
          onChange={setAccountFilter}
          icon={Landmark}
          options={[{ id: "ALL", name: "Any account" }, ...ACCOUNTS]}
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          icon={Filter}
          options={[
            { id: "ALL", name: "All statuses" },
            { id: "pending", name: "Pending" },
            { id: "completed", name: "Completed" },
          ]}
        />
      </div>

      {/* Contra table */}
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
                {["Voucher", "Date", "Route", "Reference", "Amount", "Status", ""].map((label) => (
                  <th key={label} className="text-left px-5 py-3 text-white" style={{ backgroundColor: COLORS.vermillion }}>
                    <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const FromIcon = accountIcon(c.from);
                const ToIcon = accountIcon(c.to);
                return (
                  <tr key={c.id} className="border-b hover:bg-black/[0.02] transition-colors" style={{ borderColor: COLORS.line }}>
                    <td className="px-5 py-3.5 font-semibold whitespace-nowrap" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                      {c.id}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: COLORS.muted, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                      {c.date}
                    </td>
                    <td className="px-5 py-3.5" style={{ color: COLORS.ink }}>
                      <div className="flex items-center gap-1.5 text-[12.5px] whitespace-nowrap">
                        <FromIcon size={12} style={{ color: COLORS.muted }} />
                        <span>{accountName(c.from)}</span>
                        <ArrowRight size={12} style={{ color: COLORS.muted }} />
                        <ToIcon size={12} style={{ color: COLORS.muted }} />
                        <span>{accountName(c.to)}</span>
                      </div>
                      <div className="text-[11px] mt-0.5" style={{ color: COLORS.muted }}>{c.note}</div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: COLORS.muted, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                      {c.ref}
                    </td>
                    <td className="px-5 py-3.5 font-semibold whitespace-nowrap" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                      {taka(c.amount)}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusPill status={c.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        {c.status === "pending" && (
                          <button
                            onClick={() => handleCancel(c.id)}
                            className="text-[11.5px] font-semibold whitespace-nowrap"
                            style={{ color: COLORS.muted }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-[13px]" style={{ color: COLORS.muted }}>
                    No transfers match your filters.
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
          <ArrowLeftRight size={14} />
          {toast}
        </div>
      )}

      {/* Transfer drawer */}
      <ContraDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSave={handleSave} />
    </div>
  );
}

export default ContraTransferPage;