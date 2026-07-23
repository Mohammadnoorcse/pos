import React from "react";
import {
  BookText,
  Search,
  ChevronDown,
  Filter,
  Download,
  X,
  Wallet,
  Banknote,
  Landmark,
  CalendarDays,
  ArrowLeft,
  ArrowDownCircle,
  ArrowUpCircle,
  Repeat,
  ScrollText,
  Printer,
  User,
  ChevronRight,
} from "lucide-react";

/* ---------------------------------------------------------------------
   Design tokens — kept in step with the sibling Bank Details / Cash
   Flow / Supplier Payment / Expenses / Income pages (warm paper
   surface, vermillion primary accent, magenta secondary). This page
   lives in the same product (Acc & Transaction Wing → Vouchers), and
   acts as the central register every voucher-producing page
   (Supplier Payment, Income, Contra Transfer...) ultimately feeds.
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

const VOUCHER_TYPES = [
  { id: "payment", name: "Payment voucher", short: "PV", icon: ArrowUpCircle, color: COLORS.vermillion, soft: vermillionSoft },
  { id: "receipt", name: "Receipt voucher", short: "RV", icon: ArrowDownCircle, color: green, soft: greenSoft },
  { id: "journal", name: "Journal voucher", short: "JV", icon: ScrollText, color: teal, soft: tealSoft },
  { id: "contra", name: "Contra voucher", short: "CV", icon: Repeat, color: COLORS.magenta, soft: magentaSoft },
];

function typeOf(id) {
  return VOUCHER_TYPES.find((t) => t.id === id) || VOUCHER_TYPES[0];
}

const ACCOUNTS = [
  { id: "cash", name: "Cash in hand" },
  { id: "BNK-001", name: "Islami Bank — Motijheel" },
  { id: "BNK-002", name: "Dutch-Bangla — Agrabad" },
  { id: "BNK-003", name: "BRAC Bank — Gulshan" },
];

const TODAY = "22-07-2026";

/* Each voucher is the paper trail a transaction elsewhere in the suite
   already produced — a Supplier Payment creates a PV, an Income entry
   creates an RV, a Contra Transfer creates a CV, and manual
   adjustments create a JV. This page is their shared register. */
const INITIAL_VOUCHERS = [
  { id: "PV-1042", type: "payment", date: "22-07-2026", party: "Bengal Rice Mills", account: "cash", amount: 30000, narration: "Partial payment against BILL-7760", preparedBy: "Abdur Rahim" },
  { id: "RV-2231", type: "receipt", date: "22-07-2026", party: "Counter sales — evening shift", account: "cash", amount: 68400, narration: "Daily cash sales deposit", preparedBy: "Nasrin Akter" },
  { id: "CV-0118", type: "contra", date: "21-07-2026", party: "Islami Bank ⇄ Cash", account: "BNK-001", amount: 50000, narration: "Cash deposited into bank", preparedBy: "Abdur Rahim" },
  { id: "PV-1041", type: "payment", date: "21-07-2026", party: "Padma Edible Oil Ltd.", account: "BNK-002", amount: 100000, narration: "Cheque issued against outstanding bill", preparedBy: "Abdur Rahim" },
  { id: "JV-0056", type: "journal", date: "20-07-2026", party: "Depreciation adjustment", account: "cash", amount: 8500, narration: "Monthly depreciation — showroom fixtures", preparedBy: "Nasrin Akter" },
  { id: "RV-2228", type: "receipt", date: "20-07-2026", party: "Rent received — Anika Store", account: "BNK-002", amount: 18000, narration: "Storage space rented out", preparedBy: "Nasrin Akter" },
  { id: "PV-1038", type: "payment", date: "18-07-2026", party: "Karim Properties", account: "BNK-002", amount: 45000, narration: "Shop rent — July", preparedBy: "Abdur Rahim" },
  { id: "PV-1035", type: "payment", date: "15-07-2026", party: "Staff (6 persons)", account: "BNK-001", amount: 62000, narration: "Mid-month staff salary", preparedBy: "Abdur Rahim" },
  { id: "CV-0114", type: "contra", date: "12-07-2026", party: "Cash ⇄ BRAC Bank", account: "BNK-003", amount: 20000, narration: "Bank withdrawal for petty cash", preparedBy: "Nasrin Akter" },
  { id: "JV-0052", type: "journal", date: "08-07-2026", party: "Opening balance correction", account: "cash", amount: 1200, narration: "Prior period cash count adjustment", preparedBy: "Abdur Rahim" },
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

/* ---------------------------------------------------------------------
   Signature element: a printable voucher document — double-ruled
   border, serial number, tear-off perforation, and Prepared /
   Checked / Approved signature blocks. This is the one thing that
   makes a "vouchers" page distinct from every other ledger in the
   suite: the artifact itself is a physical paper form in Bangladeshi
   bookkeeping practice, so viewing one should feel like pulling the
   actual carbon-copy slip out of a voucher book.
--------------------------------------------------------------------- */
function VoucherDocument({ voucher, onClose }) {
  if (!voucher) return null;
  const t = typeOf(voucher.type);
  const Icon = t.icon;
  const acct = ACCOUNTS.find((a) => a.id === voucher.account);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(36,28,26,0.5)" }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ backgroundColor: COLORS.panel, fontFamily: FONTS.BODY }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 z-10" style={{ borderColor: COLORS.line, backgroundColor: COLORS.panel }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: t.soft }}>
              <Icon size={15} style={{ color: t.color }} />
            </div>
            <h2 className="text-[14px] font-bold" style={{ color: COLORS.ink }}>{t.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11.5px] font-semibold text-white"
              style={{ backgroundColor: t.color }}
            >
              <Printer size={12} />
              Print
            </button>
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5">
              <X size={15} style={{ color: COLORS.muted }} />
            </button>
          </div>
        </div>

        {/* The voucher paper itself */}
        <div className="p-5">
          <div
            className="rounded-lg p-5 relative"
            style={{ border: `2px solid ${t.color}`, backgroundColor: COLORS.paper }}
          >
            {/* corner serial tab */}
            <div
              className="absolute -top-3 left-5 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold text-white"
              style={{ backgroundColor: t.color, fontFamily: FONTS.MONO }}
            >
              {voucher.id}
            </div>

            <div className="flex items-start justify-between mb-4 pt-1">
              <div>
                <div className="text-[13px] font-bold uppercase tracking-wide" style={{ color: t.color }}>
                  {t.name}
                </div>
                <div className="text-[10.5px]" style={{ color: COLORS.muted }}>
                  {t.short} · Wholesale Accounting Register
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[12px]" style={{ color: COLORS.muted }}>
                <CalendarDays size={12} />
                <span style={{ fontFamily: FONTS.MONO }}>{voucher.date}</span>
              </div>
            </div>

            <div className="border-t border-dashed my-3" style={{ borderColor: t.color }} />

            <div className="space-y-2.5 text-[12.5px]">
              <div className="flex items-center justify-between">
                <span style={{ color: COLORS.muted }}>Party / Source</span>
                <span className="font-semibold text-right" style={{ color: COLORS.ink }}>{voucher.party}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: COLORS.muted }}>Account</span>
                <span className="font-semibold flex items-center gap-1.5" style={{ color: COLORS.ink }}>
                  {acct?.id === "cash" ? <Banknote size={12} /> : <Landmark size={12} />}
                  {acct?.name || voucher.account}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: COLORS.muted }}>Narration</span>
                <span className="font-medium text-right max-w-[65%]" style={{ color: COLORS.ink }}>{voucher.narration}</span>
              </div>
            </div>

            <div className="border-t border-dashed my-3.5" style={{ borderColor: t.color }} />

            <div className="text-center py-2">
              <div className="text-[10.5px] font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.muted }}>
                Amount
              </div>
              <div className="text-[26px] font-bold" style={{ color: t.color, fontFamily: FONTS.MONO }}>
                {taka(voucher.amount)}
              </div>
            </div>

            {/* Perforation / tear-off line */}
            <div className="relative my-4 flex items-center">
              <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: COLORS.line }} />
              <span className="mx-2 text-[10px] uppercase tracking-widest" style={{ color: COLORS.muted }}>tear here</span>
              <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: COLORS.line }} />
            </div>

            {/* Signature blocks */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              {[
                { label: "Prepared by", name: voucher.preparedBy },
                { label: "Checked by", name: "" },
                { label: "Approved by", name: "" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="h-8 flex items-end justify-center">
                    {s.name && (
                      <span className="text-[11px] font-semibold italic" style={{ color: COLORS.ink }}>{s.name}</span>
                    )}
                  </div>
                  <div className="border-t pt-1" style={{ borderColor: COLORS.muted }}>
                    <span className="text-[10px] uppercase tracking-wide" style={{ color: COLORS.muted }}>{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VouchersAcc({ onNavigate }) {
  const [vouchers] = React.useState(INITIAL_VOUCHERS);
  const [tab, setTab] = React.useState("ALL");
  const [query, setQuery] = React.useState("");
  const [accountFilter, setAccountFilter] = React.useState("ALL");
  const [selected, setSelected] = React.useState(null);

  const filtered = vouchers
    .filter((v) => tab === "ALL" || v.type === tab)
    .filter((v) => {
      const matchesQuery = [v.id, v.party, v.narration].join(" ").toLowerCase().includes(query.toLowerCase());
      const matchesAccount = accountFilter === "ALL" || v.account === accountFilter;
      return matchesQuery && matchesAccount;
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  const countBy = (id) => vouchers.filter((v) => v.type === id).length;
  const todayCount = vouchers.filter((v) => v.date === TODAY).length;

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: vermillionSoft }}>
            <BookText size={16} style={{ color: COLORS.vermillion }} />
          </div>
          <div>
            <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>Vouchers</h1>
            <p className="text-[12px]" style={{ color: COLORS.muted }}>
              Every payment, receipt, journal and contra voucher in one register
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

      {/* Summary cards — one per voucher type */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {VOUCHER_TYPES.map((t) => (
          <StatCard
            key={t.id}
            icon={t.icon}
            label={t.name}
            value={countBy(t.id)}
            sub={`${t.short} series`}
            color={t.color}
            soft={t.soft}
          />
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl mb-4 w-fit" style={{ backgroundColor: COLORS.panel, border: `1px solid ${COLORS.line}` }}>
        <button
          onClick={() => setTab("ALL")}
          className="rounded-lg px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors"
          style={{ backgroundColor: tab === "ALL" ? grayaSoft : "transparent", color: tab === "ALL" ? COLORS.ink : COLORS.muted }}
        >
          All vouchers
        </button>
        {VOUCHER_TYPES.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="rounded-lg px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors"
              style={{ backgroundColor: active ? t.soft : "transparent", color: active ? t.color : COLORS.muted }}
            >
              {t.short}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 border flex-1 min-w-[220px]" style={{ borderColor: COLORS.line, backgroundColor: COLORS.panel }}>
          <Search size={14} style={{ color: COLORS.muted }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search voucher ID / party / narration"
            className="bg-transparent outline-none text-[13px] w-full"
            style={{ color: COLORS.ink }}
          />
        </div>

        <Select
          value={accountFilter}
          onChange={setAccountFilter}
          icon={Filter}
          options={[{ id: "ALL", name: "All accounts" }, ...ACCOUNTS]}
        />
      </div>

      {/* Vouchers table */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr>
                {["Voucher", "Party / Source", "Account", "Date", "Amount", ""].map((label) => (
                  <th key={label} className="text-left px-5 py-3 text-white" style={{ backgroundColor: COLORS.vermillion }}>
                    <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => {
                const t = typeOf(v.type);
                const Icon = t.icon;
                const acct = ACCOUNTS.find((a) => a.id === v.account);
                return (
                  <tr
                    key={v.id}
                    onClick={() => setSelected(v)}
                    className="border-b hover:bg-black/[0.02] transition-colors cursor-pointer"
                    style={{ borderColor: COLORS.line }}
                  >
                    <td className="px-5 py-3.5" style={{ color: COLORS.ink }}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: t.soft }}>
                          <Icon size={14} style={{ color: t.color }} />
                        </div>
                        <div>
                          <div className="font-semibold" style={{ fontFamily: FONTS.MONO, fontSize: 12.5 }}>{v.id}</div>
                          <div className="text-[11px]" style={{ color: t.color }}>{t.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5" style={{ color: COLORS.ink }}>
                      <div className="font-medium">{v.party}</div>
                      <div className="text-[11px] truncate max-w-[220px]" style={{ color: COLORS.muted }}>{v.narration}</div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: COLORS.muted }}>
                      <div className="flex items-center gap-1.5 text-[12.5px]">
                        {acct?.id === "cash" ? <Banknote size={12} /> : <Landmark size={12} />}
                        {acct?.name || v.account}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: COLORS.muted, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                      {v.date}
                    </td>
                    <td className="px-5 py-3.5 font-semibold whitespace-nowrap" style={{ color: t.color, fontFamily: FONTS.MONO }}>
                      {taka(v.amount)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <ChevronRight size={15} style={{ color: COLORS.muted }} />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-[13px]" style={{ color: COLORS.muted }}>
                    No vouchers match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Voucher document viewer */}
      <VoucherDocument voucher={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

export default VouchersAcc;