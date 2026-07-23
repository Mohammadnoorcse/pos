import React from "react";
import {
  Landmark,
  Search,
  ChevronDown,
  Filter,
  Download,
  X,
  Wallet,
  CheckCircle2,
  FilePenLine,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Banknote,
  Plus,
  AlertTriangle,
  CalendarClock,
  Percent,
} from "lucide-react";

/* ---------------------------------------------------------------------
   Design tokens — kept in step with the sibling Stock Transfer / Godown
   / Current Stock / Invoices pages (warm paper surface, vermillion
   primary accent, magenta secondary). This page inherits that house
   style rather than introducing a new one, since it lives in the same
   product.
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
const amberSoft = "#FDF1E0";
const amber = "#B4740E";

const TODAY = "22-07-2026";

/* ---------------------------------------------------------------------
   Domain: a small wholesale/distribution business tracks two kinds of
   money coming in that aren't sales revenue —
     1. Loans: bank/NBFC/personal borrowing, repaid on a schedule with
        interest (has a lender, a rate, an EMI).
     2. Capital: money the owner(s) inject or withdraw directly — no
        interest, no schedule, just equity movement.
   Both share a ledger shape, so the page treats them as one register
   with a type flag, mirroring how the owner's own notebook would.
--------------------------------------------------------------------- */
const ENTRIES = [
  {
    id: "LN-0012",
    kind: "loan",
    party: "Uttara Bank Ltd.",
    partyType: "Bank",
    principal: 800000,
    rate: 9,
    tenureMonths: 24,
    emi: 36560,
    outstanding: 621520,
    nextDue: "05-08-2026",
    status: "active",
    takenOn: "05-08-2025",
    purpose: "Warehouse cold storage expansion",
  },
  {
    id: "LN-0011",
    kind: "loan",
    party: "IDLC Finance",
    partyType: "NBFC",
    principal: 250000,
    rate: 11,
    tenureMonths: 12,
    emi: 22150,
    outstanding: 44300,
    nextDue: "28-07-2026",
    status: "active",
    takenOn: "28-08-2025",
    purpose: "Delivery van purchase",
  },
  {
    id: "LN-0010",
    kind: "loan",
    party: "Md. Kamal Hossain",
    partyType: "Personal",
    principal: 150000,
    rate: 0,
    tenureMonths: 6,
    emi: 25000,
    outstanding: 0,
    nextDue: null,
    status: "closed",
    takenOn: "10-01-2026",
    purpose: "Eid stock buildup — short bridge",
  },
  {
    id: "CP-0027",
    kind: "capital",
    party: "Rafiq Islam (Owner)",
    partyType: "Owner",
    direction: "in",
    amount: 300000,
    date: "18-07-2026",
    status: "posted",
    note: "Fresh capital ahead of monsoon stock order",
  },
  {
    id: "CP-0026",
    kind: "capital",
    party: "Rafiq Islam (Owner)",
    partyType: "Owner",
    direction: "out",
    amount: 60000,
    date: "02-07-2026",
    status: "posted",
    note: "Owner's draw",
  },
  {
    id: "LN-0009",
    kind: "loan",
    party: "Uttara Bank Ltd.",
    partyType: "Bank",
    principal: 500000,
    rate: 9.5,
    tenureMonths: 18,
    emi: 30800,
    outstanding: 0,
    nextDue: null,
    status: "closed",
    takenOn: "12-11-2024",
    purpose: "Working capital — festive season",
  },
  {
    id: "CP-0025",
    kind: "capital",
    party: "Nasrin Akter (Partner)",
    partyType: "Partner",
    direction: "in",
    amount: 150000,
    date: "15-06-2026",
    status: "posted",
    note: "Partner buy-in top-up",
  },
];

function taka(n) {
  return "৳" + Math.round(n).toLocaleString("en-BD");
}

const PARTY_TYPE_META = {
  Bank: { color: blue, soft: blueSoft },
  NBFC: { color: COLORS.magenta, soft: magentaSoft },
  Personal: { color: amber, soft: amberSoft },
  Owner: { color: COLORS.vermillion, soft: vermillionSoft },
  Partner: { color: green, soft: greenSoft },
};

const LOAN_STATUS_META = {
  active: { label: "Active", color: blue, soft: blueSoft, icon: CalendarClock },
  closed: { label: "Closed", color: green, soft: greenSoft, icon: CheckCircle2 },
  overdue: { label: "Overdue", color: COLORS.vermillion, soft: vermillionSoft, icon: AlertTriangle },
};

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

function PartyPill({ type }) {
  const meta = PARTY_TYPE_META[type] || { color: graya, soft: grayaSoft };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: meta.soft, color: meta.color }}
    >
      {type}
    </span>
  );
}

function LoanStatusPill({ status }) {
  const meta = LOAN_STATUS_META[status];
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

/* Amortization progress — a thin repayment bar rather than a % badge,
   since "how much of this loan is behind us" is the thing an owner
   actually scans for. */
function RepaymentBar({ principal, outstanding }) {
  const paidPct = Math.max(0, Math.min(100, ((principal - outstanding) / principal) * 100));
  return (
    <div className="w-full">
      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.line }}>
        <div className="h-full rounded-full" style={{ width: `${paidPct}%`, backgroundColor: paidPct >= 100 ? green : COLORS.vermillion }} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------
   Signature element: a "খতিয়ান" (khatian / ledger folio) drawer.
   Where the Invoices page mirrors a physical challan slip, this page
   mirrors the bound ledger book a shop owner keeps for money owed —
   ruled lines, a running balance column, and (for loans) a compact
   amortization strip instead of a payment schedule table, since the
   owner cares about "how much is left", not every installment.
--------------------------------------------------------------------- */
function LedgerDrawer({ entry, onClose, onRecordPayment, onCloseLoan }) {
  if (!entry) return null;
  const isLoan = entry.kind === "loan";
  const paidSoFar = isLoan ? entry.principal - entry.outstanding : null;
  const paidPct = isLoan ? Math.max(0, Math.min(100, (paidSoFar / entry.principal) * 100)) : null;

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
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: isLoan ? vermillionSoft : magentaSoft }}
            >
              {isLoan ? <Landmark size={15} style={{ color: COLORS.vermillion }} /> : <Wallet size={15} style={{ color: COLORS.magenta }} />}
            </div>
            <div>
              <h2 className="text-[14.5px] font-bold" style={{ color: COLORS.ink }}>{entry.id}</h2>
              <p className="text-[11px]" style={{ color: COLORS.muted }}>{isLoan ? "Loan folio" : "Capital entry"} · {entry.party}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5">
            <X size={15} style={{ color: COLORS.muted }} />
          </button>
        </div>

        {/* Body — ruled ledger-folio styling */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div
            className="rounded-xl border p-4"
            style={{
              borderColor: COLORS.line,
              backgroundImage: `repeating-linear-gradient(${COLORS.paper}, ${COLORS.paper} 27px, ${COLORS.line} 28px)`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10.5px] font-semibold uppercase tracking-wider" style={{ color: COLORS.muted }}>
                {isLoan ? "ঋণ খতিয়ান" : "মূলধন এন্ট্রি"}
              </span>
              <PartyPill type={entry.partyType} />
            </div>

            <div className="text-[15px] font-bold mb-0.5" style={{ color: COLORS.ink }}>{entry.party}</div>
            <div className="text-[11.5px] mb-4" style={{ color: COLORS.muted }}>
              {isLoan ? entry.purpose : entry.note}
            </div>

            <div className="border-t border-dashed my-3" style={{ borderColor: COLORS.line }} />

            {isLoan ? (
              <>
                <div className="grid grid-cols-2 gap-y-2.5 text-[12.5px]">
                  <div style={{ color: COLORS.muted }}>Principal</div>
                  <div className="text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{taka(entry.principal)}</div>
                  <div style={{ color: COLORS.muted }}>Interest rate</div>
                  <div className="text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                    {entry.rate > 0 ? `${entry.rate}% p.a.` : "Interest-free"}
                  </div>
                  <div style={{ color: COLORS.muted }}>Tenure</div>
                  <div className="text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{entry.tenureMonths} months</div>
                  <div style={{ color: COLORS.muted }}>EMI</div>
                  <div className="text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{taka(entry.emi)} / mo</div>
                  <div style={{ color: COLORS.muted }}>Taken on</div>
                  <div className="text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{entry.takenOn}</div>
                </div>

                <div className="border-t my-3" style={{ borderColor: COLORS.line }} />

                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Repaid</span>
                  <span className="text-[12px] font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{Math.round(paidPct)}%</span>
                </div>
                <RepaymentBar principal={entry.principal} outstanding={entry.outstanding} />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px]" style={{ color: COLORS.muted }}>{taka(paidSoFar)} paid</span>
                  <span className="text-[11px]" style={{ color: COLORS.muted }}>{taka(entry.outstanding)} left</span>
                </div>

                <div className="border-t border-dashed my-4" style={{ borderColor: COLORS.line }} />

                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Outstanding balance</span>
                  <span className="text-[16px] font-bold" style={{ color: entry.outstanding > 0 ? COLORS.vermillion : green, fontFamily: FONTS.MONO }}>
                    {taka(entry.outstanding)}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-y-2.5 text-[12.5px]">
                  <div style={{ color: COLORS.muted }}>Direction</div>
                  <div className="text-right font-semibold flex items-center justify-end gap-1" style={{ color: entry.direction === "in" ? green : COLORS.vermillion }}>
                    {entry.direction === "in" ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
                    {entry.direction === "in" ? "Injection" : "Withdrawal"}
                  </div>
                  <div style={{ color: COLORS.muted }}>Date</div>
                  <div className="text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{entry.date}</div>
                </div>

                <div className="border-t border-dashed my-4" style={{ borderColor: COLORS.line }} />

                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Amount</span>
                  <span className="text-[16px] font-bold" style={{ color: entry.direction === "in" ? green : COLORS.vermillion, fontFamily: FONTS.MONO }}>
                    {entry.direction === "in" ? "+" : "−"}{taka(entry.amount)}
                  </span>
                </div>
              </>
            )}
          </div>

          {isLoan && (
            <div className="mt-5 flex items-center justify-between text-[12px]">
              <span style={{ color: COLORS.muted }}>Status</span>
              <LoanStatusPill status={entry.status} />
            </div>
          )}
          {isLoan && entry.nextDue && (
            <div className="mt-2.5 flex items-center justify-between text-[12px]">
              <span style={{ color: COLORS.muted }}>Next installment due</span>
              <span className="font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{entry.nextDue}</span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {isLoan && entry.status === "active" && (
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t shrink-0" style={{ borderColor: COLORS.line }}>
            <button
              onClick={() => onCloseLoan(entry.id)}
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold border"
              style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.panel }}
            >
              Foreclose
            </button>
            <button
              onClick={() => onRecordPayment(entry.id)}
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold text-white"
              style={{ backgroundColor: COLORS.vermillion }}
            >
              <Banknote size={13} />
              Record EMI payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function LoanCapitalPage({ onNavigate }) {
  const [entries, setEntries] = React.useState(ENTRIES);
  const [query, setQuery] = React.useState("");
  const [kindFilter, setKindFilter] = React.useState("ALL");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [active, setActive] = React.useState(null);
  const [toast, setToast] = React.useState("");

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleRecordPayment = (id) => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const newOutstanding = Math.max(0, e.outstanding - e.emi);
        return {
          ...e,
          outstanding: newOutstanding,
          status: newOutstanding === 0 ? "closed" : "active",
          nextDue: newOutstanding === 0 ? null : e.nextDue,
        };
      })
    );
    setActive((prev) => {
      if (!prev || prev.id !== id) return prev;
      const newOutstanding = Math.max(0, prev.outstanding - prev.emi);
      return { ...prev, outstanding: newOutstanding, status: newOutstanding === 0 ? "closed" : "active" };
    });
    notify(`EMI recorded for ${id}`);
  };

  const handleCloseLoan = (id) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, outstanding: 0, status: "closed", nextDue: null } : e)));
    setActive((prev) => (prev && prev.id === id ? { ...prev, outstanding: 0, status: "closed" } : prev));
    notify(`${id} foreclosed and marked closed`);
  };

  const filtered = entries.filter((e) => {
    const matchesQuery = [e.id, e.party, e.partyType].join(" ").toLowerCase().includes(query.toLowerCase());
    const matchesKind = kindFilter === "ALL" || e.kind === kindFilter;
    const matchesStatus =
      statusFilter === "ALL" ||
      (e.kind === "loan" && e.status === statusFilter) ||
      (e.kind === "capital" && statusFilter === "posted" && e.status === "posted");
    return matchesQuery && matchesKind && matchesStatus;
  });

  const activeLoans = entries.filter((e) => e.kind === "loan" && e.status === "active");
  const totalOutstanding = activeLoans.reduce((s, e) => s + e.outstanding, 0);
  const totalEmi = activeLoans.reduce((s, e) => s + e.emi, 0);
  const capitalIn = entries.filter((e) => e.kind === "capital" && e.direction === "in").reduce((s, e) => s + e.amount, 0);
  const capitalOut = entries.filter((e) => e.kind === "capital" && e.direction === "out").reduce((s, e) => s + e.amount, 0);
  const netCapital = capitalIn - capitalOut;

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      <style>{`@keyframes slideIn { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: vermillionSoft }}>
            <Landmark size={16} style={{ color: COLORS.vermillion }} />
          </div>
          <div>
            <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>
              Loan &amp; Capital
            </h1>
            <p className="text-[12px]" style={{ color: COLORS.muted }}>
              Borrowed money and owner's equity, tracked in one register
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onNavigate && onNavigate("dashboard")}
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold border"
            style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.panel }}
          >
            <ArrowLeft size={13} />
            Dashboard
          </button>
          <button
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold border"
            style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.panel }}
          >
            <Download size={13} />
            Export
          </button>
          <button
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold text-white"
            style={{ backgroundColor: COLORS.vermillion }}
          >
            <Plus size={13} />
            New entry
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <StatCard icon={Landmark} label="Outstanding loans" value={taka(totalOutstanding)} sub={`${activeLoans.length} active`} color={COLORS.vermillion} soft={vermillionSoft} />
        <StatCard icon={CalendarClock} label="Monthly EMI due" value={taka(totalEmi)} sub="Across active loans" color={blue} soft={blueSoft} />
        <StatCard icon={Wallet} label="Net capital" value={taka(netCapital)} sub={`${taka(capitalIn)} in · ${taka(capitalOut)} out`} color={green} soft={greenSoft} />
        <StatCard icon={Percent} label="Blended rate" value={activeLoans.length ? (activeLoans.reduce((s, e) => s + e.rate, 0) / activeLoans.length).toFixed(1) + "%" : "—"} sub="Weighted avg., active loans" color={COLORS.magenta} soft={magentaSoft} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 border flex-1 min-w-[220px]" style={{ borderColor: COLORS.line, backgroundColor: COLORS.panel }}>
          <Search size={14} style={{ color: COLORS.muted }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search entry ID / lender / owner"
            className="bg-transparent outline-none text-[13px] w-full"
            style={{ color: COLORS.ink }}
          />
        </div>

        <Select
          value={kindFilter}
          onChange={(v) => { setKindFilter(v); setStatusFilter("ALL"); }}
          icon={Filter}
          options={[
            { id: "ALL", name: "Loans & capital" },
            { id: "loan", name: "Loans only" },
            { id: "capital", name: "Capital only" },
          ]}
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          icon={Filter}
          options={[
            { id: "ALL", name: "All statuses" },
            { id: "active", name: "Active" },
            { id: "closed", name: "Closed" },
            { id: "posted", name: "Posted" },
          ]}
        />
      </div>

      {/* Register table */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr>
                {["Entry", "Party", "Type", "Amount", "Progress / Date", "Status", ""].map((label) => (
                  <th key={label} className="text-left px-5 py-3 text-white" style={{ backgroundColor: COLORS.vermillion }}>
                    <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => {
                const isLoan = e.kind === "loan";
                return (
                  <tr
                    key={e.id}
                    className="border-b hover:bg-black/[0.02] transition-colors cursor-pointer"
                    style={{ borderColor: COLORS.line }}
                    onClick={() => setActive(e)}
                  >
                    <td className="px-5 py-3.5 font-semibold whitespace-nowrap" style={{ color: isLoan ? COLORS.vermillion : COLORS.magenta, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                      <div className="flex items-center gap-1.5">
                        {isLoan ? <Landmark size={12} /> : <Wallet size={12} />}
                        {e.id}
                      </div>
                    </td>
                    <td className="px-5 py-3.5" style={{ color: COLORS.ink }}>
                      <div className="font-semibold">{e.party}</div>
                      {isLoan && <div className="text-[11px]" style={{ color: COLORS.muted }}>{e.purpose}</div>}
                    </td>
                    <td className="px-5 py-3.5">
                      <PartyPill type={e.partyType} />
                    </td>
                    <td className="px-5 py-3.5 font-semibold whitespace-nowrap" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                      {isLoan ? taka(e.principal) : (
                        <span className="flex items-center gap-1" style={{ color: e.direction === "in" ? green : COLORS.vermillion }}>
                          {e.direction === "in" ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                          {taka(e.amount)}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 min-w-[140px]">
                      {isLoan ? (
                        <RepaymentBar principal={e.principal} outstanding={e.outstanding} />
                      ) : (
                        <span style={{ color: COLORS.muted, fontFamily: FONTS.MONO, fontSize: 12.5 }}>{e.date}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {isLoan ? <LoanStatusPill status={e.status} /> : (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
                          style={{ backgroundColor: greenSoft, color: green }}
                        >
                          <CheckCircle2 size={11} />
                          Posted
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={(ev) => { ev.stopPropagation(); setActive(e); }}
                        className="text-[11.5px] font-semibold whitespace-nowrap"
                        style={{ color: COLORS.magenta }}
                      >
                        View folio
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-[13px]" style={{ color: COLORS.muted }}>
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
          <Banknote size={14} />
          {toast}
        </div>
      )}

      {/* Ledger drawer */}
      <LedgerDrawer
        entry={active}
        onClose={() => setActive(null)}
        onRecordPayment={handleRecordPayment}
        onCloseLoan={handleCloseLoan}
      />
    </div>
  );
}

export default LoanCapitalPage;