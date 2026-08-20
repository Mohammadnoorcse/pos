import React from "react";
import {
  Users, Wallet, AlertCircle, ArrowUpRight, ArrowDownRight,
  Building2, ChevronRight, Clock, PhoneCall, Search, Plus,
  Sparkles,
} from "lucide-react";
import { COLORS, FONTS } from "../../constants";

// Same tokens used across PurchasePage.jsx / SupplierInvoicesPage.jsx /
// DuePurchaseReportPage.jsx / DueConnectionReportPage.jsx / SupplierPaymentPage.jsx.
const magentaSoft = COLORS.magentaSoft || `${COLORS.magenta}1A`;
const vermillionSoft = `${COLORS.vermillion}1A`;
const green = "#1E8A4C";
const greenSoft = "#E9F7EE";

const AVATAR_RAMP = [COLORS.magenta, COLORS.vermillion, "#1E8A4C", "#B8790A", "#6C63A8"];
const avatarColor = (name) => AVATAR_RAMP[name.charCodeAt(0) % AVATAR_RAMP.length];

const SUPPLIERS = [
  { id: 1, name: "Matador", company: "Matador BD", phone: "01784848944", due: 1500, lastPayment: "18-04-2025", trend: "up" },
  { id: 2, name: "Siraj", company: "Siraj Enterprise", phone: "01717777744", due: 6600, lastPayment: "02-04-2025", trend: "up" },
  { id: 3, name: "Sohag Ahmed", company: "Cock", phone: "01766554433", due: 2800, lastPayment: "05-04-2025", trend: "down" },
  { id: 4, name: "nazrul", company: "Allahr Dan 4", phone: "01655221199", due: 2300, lastPayment: "28-03-2025", trend: "up" },
  { id: 5, name: "kudus", company: "7up", phone: "01789654131", due: 0, lastPayment: "12-04-2025", trend: "down" },
  { id: 6, name: "Rahmat Ali", company: "Microlab", phone: "01911223344", due: 900, lastPayment: "20-03-2025", trend: "down" },
];

const RECENT_PAYMENTS = [
  { id: "PMT-2041", supplier: "Matador", date: "18-04-2025", method: "Cash", amount: 5000 },
  { id: "PMT-2038", supplier: "kudus", date: "12-04-2025", method: "Bank Transfer", amount: 6000 },
  { id: "PMT-2030", supplier: "Sohag Ahmed", date: "05-04-2025", method: "bKash", amount: 2000 },
  { id: "PMT-2019", supplier: "Rahmat Ali", date: "20-03-2025", method: "Cheque", amount: 3200 },
];

const MONTHLY = [
  { label: "Nov", purchase: 42000, paid: 38000 },
  { label: "Dec", purchase: 51000, paid: 47000 },
  { label: "Jan", purchase: 39000, paid: 39000 },
  { label: "Feb", purchase: 61000, paid: 52000 },
  { label: "Mar", purchase: 48000, paid: 44000 },
  { label: "Apr", purchase: 56000, paid: 41000 },
];

function Avatar({ name, size = 36 }) {
  const color = avatarColor(name);
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 font-bold text-white"
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.38 }}
    >
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}

function CollectionRing({ percent }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <div className="relative shrink-0" style={{ width: 112, height: 112 }}>
      <svg width="112" height="112" viewBox="0 0 112 112" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
        <circle
          cx="56" cy="56" r={r} fill="none" stroke="#fff" strokeWidth="10"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[22px] font-bold text-white" style={{ fontFamily: FONTS.MONO }}>{percent}%</span>
        <span className="text-[10px] font-semibold text-white/80 uppercase tracking-wide">Collected</span>
      </div>
    </div>
  );
}

function StatPill({ icon: Icon, label, value, valueColor }) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ backgroundColor: "rgba(255,255,255,0.14)" }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#fff" }}>
        <Icon size={15} style={{ color: valueColor }} />
      </div>
      <div className="min-w-0">
        <div className="text-[10.5px] font-semibold uppercase tracking-wide text-white/75">{label}</div>
        <div className="text-[15px] font-bold mt-0.5 truncate text-white" style={{ fontFamily: FONTS.MONO }}>{value}</div>
      </div>
    </div>
  );
}

function HeroBanner({ totalDue, totalPaidThisMonth, supplierCount, outstandingCount }) {
  const collectedPercent = Math.round((totalPaidThisMonth / (totalPaidThisMonth + totalDue)) * 100);
  return (
    <div className="rounded-2xl p-6 mb-5 relative overflow-hidden" style={{ backgroundColor: COLORS.magenta }}>
      <div className="absolute -right-6 -top-10 w-48 h-48 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
      <div className="absolute right-16 -bottom-16 w-40 h-40 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />

      <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="flex items-center gap-4">
          <CollectionRing percent={collectedPercent} />
          <div>
            <div className="flex items-center gap-1.5 text-white/80 text-[11.5px] font-semibold uppercase tracking-wide">
              <Sparkles size={12} />
              Supplier overview
            </div>
            <h1 className="text-[21px] font-bold text-white mt-1">
              {supplierCount} suppliers, {outstandingCount} need payment
            </h1>
            <p className="text-[12.5px] text-white/75 mt-1">
              Track dues, payments and supplier activity in one place
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 lg:ml-auto lg:min-w-[420px]">
          <StatPill icon={Users} label="Suppliers" value={supplierCount} valueColor={COLORS.ink} />
          <StatPill icon={AlertCircle} label="Outstanding due" value={totalDue.toLocaleString()} valueColor={COLORS.vermillion} />
          <StatPill icon={Wallet} label="Paid this month" value={totalPaidThisMonth.toLocaleString()} valueColor={green} />
        </div>
      </div>
    </div>
  );
}

function MonthlyBars() {
  const [hover, setHover] = React.useState(null);

  const W = 560, H = 230;
  const padL = 40, padR = 12, padT = 16, padB = 28;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const max = Math.max(...MONTHLY.map((m) => m.purchase)) * 1.15;
  const stepX = chartW / MONTHLY.length;
  const barW = Math.min(28, stepX * 0.42);

  const xFor = (i) => padL + stepX * i + stepX / 2;
  const yFor = (v) => padT + chartH - (v / max) * chartH;

  const linePoints = MONTHLY.map((m, i) => [xFor(i), yFor(m.paid)]);
  const linePath = linePoints
    .map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`))
    .join(" ");
  const areaPath = `${linePath} L ${linePoints[linePoints.length - 1][0]} ${padT + chartH} L ${linePoints[0][0]} ${padT + chartH} Z`;

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="rounded-2xl border p-5" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-[14.5px] font-bold" style={{ color: COLORS.ink }}>Purchase vs paid</h3>
          <p className="text-[12px] mt-0.5" style={{ color: COLORS.muted }}>Last 6 months</p>
        </div>
        <div className="flex items-center gap-3 text-[11.5px]" style={{ color: COLORS.muted }}>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: magentaSoft, border: `1px solid ${COLORS.magenta}` }} />Purchase</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: green }} />Paid</span>
        </div>
      </div>

      <div className="relative mt-3" onMouseLeave={() => setHover(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 220, overflow: "visible" }}>
          {gridLines.map((g) => (
            <line
              key={g}
              x1={padL} x2={W - padR}
              y1={padT + chartH * (1 - g)} y2={padT + chartH * (1 - g)}
              stroke={COLORS.line} strokeWidth="1"
            />
          ))}
          {gridLines.map((g) => (
            <text
              key={g}
              x={padL - 8} y={padT + chartH * (1 - g) + 3}
              textAnchor="end" fontSize="10" fill={COLORS.muted} fontFamily={FONTS.MONO}
            >
              {Math.round((max * g) / 1000)}k
            </text>
          ))}

          {MONTHLY.map((m, i) => (
            <rect
              key={m.label}
              x={xFor(i) - barW / 2}
              y={yFor(m.purchase)}
              width={barW}
              height={padT + chartH - yFor(m.purchase)}
              rx="6"
              fill={magentaSoft}
              stroke={COLORS.magenta}
              strokeWidth="1"
              opacity={hover === null || hover === i ? 1 : 0.45}
            />
          ))}

          <path d={areaPath} fill={green} opacity="0.08" />
          <path d={linePath} fill="none" stroke={green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {linePoints.map(([x, y], i) => (
            <circle
              key={i} cx={x} cy={y} r={hover === i ? 5.5 : 4}
              fill="#fff" stroke={green} strokeWidth="2.5"
            />
          ))}

          {MONTHLY.map((m, i) => (
            <g key={`hit-${m.label}`}>
              {hover === i && (
                <line x1={xFor(i)} x2={xFor(i)} y1={padT} y2={padT + chartH} stroke={COLORS.muted} strokeWidth="1" strokeDasharray="3 3" />
              )}
              <rect
                x={padL + stepX * i} y={padT} width={stepX} height={chartH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
              />
            </g>
          ))}

          {MONTHLY.map((m, i) => (
            <text
              key={m.label}
              x={xFor(i)} y={H - 6}
              textAnchor="middle" fontSize="11" fontWeight="600"
              fill={hover === i ? COLORS.ink : COLORS.muted}
            >
              {m.label}
            </text>
          ))}
        </svg>

        {hover !== null && (
          <div
            className="absolute pointer-events-none rounded-lg px-3 py-2 shadow-sm border text-[11.5px]"
            style={{
              left: `${(xFor(hover) / W) * 100}%`,
              top: yFor(Math.max(MONTHLY[hover].purchase, MONTHLY[hover].paid)) - 8,
              transform: "translate(-50%, -100%)",
              backgroundColor: COLORS.ink,
              borderColor: COLORS.ink,
              whiteSpace: "nowrap",
            }}
          >
            <div className="font-bold text-white mb-1">{MONTHLY[hover].label}</div>
            <div className="flex items-center gap-1.5 text-white/90">
              <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: COLORS.magenta }} />
              Purchase <span className="font-semibold" style={{ fontFamily: FONTS.MONO }}>{MONTHLY[hover].purchase.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/90">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: green }} />
              Paid <span className="font-semibold" style={{ fontFamily: FONTS.MONO }}>{MONTHLY[hover].paid.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TopDueSuppliers() {
  const sorted = [...SUPPLIERS].sort((a, b) => b.due - a.due);
  const maxDue = sorted[0]?.due || 1;

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: COLORS.line }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: vermillionSoft }}>
            <AlertCircle size={14} style={{ color: COLORS.vermillion }} />
          </div>
          <h3 className="text-[14.5px] font-bold" style={{ color: COLORS.ink }}>Outstanding suppliers</h3>
        </div>
        <button className="flex items-center gap-1 text-[12.5px] font-semibold" style={{ color: COLORS.magenta }}>
          View all <ChevronRight size={13} />
        </button>
      </div>

      <div className="divide-y" style={{ borderColor: COLORS.line }}>
        {sorted.map((s) => (
          <div key={s.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-black/[0.02] transition-colors cursor-pointer">
            <Avatar name={s.name} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13.5px] font-semibold truncate" style={{ color: COLORS.ink }}>{s.name}</span>
                <span
                  className="text-[13.5px] font-bold shrink-0"
                  style={{ color: s.due > 0 ? COLORS.vermillion : green, fontFamily: FONTS.MONO }}
                >
                  {s.due > 0 ? s.due.toLocaleString() : "Settled"}
                </span>
              </div>
              <div className="h-1.5 rounded-full mt-1.5 overflow-hidden" style={{ backgroundColor: COLORS.paper }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(s.due / maxDue) * 100}%`, backgroundColor: s.due > 0 ? COLORS.vermillion : green }}
                />
              </div>
              <div className="flex items-center gap-1 mt-1 text-[11px]" style={{ color: COLORS.muted }}>
                <Building2 size={10} />
                <span className="truncate">{s.company}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentPayments() {
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: COLORS.line }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: magentaSoft }}>
            <Wallet size={14} style={{ color: COLORS.magenta }} />
          </div>
          <h3 className="text-[14.5px] font-bold" style={{ color: COLORS.ink }}>Recent payments</h3>
        </div>
        <button className="flex items-center gap-1 text-[12.5px] font-semibold" style={{ color: COLORS.magenta }}>
          View all <ChevronRight size={13} />
        </button>
      </div>

      <div className="relative px-5 py-4">
        <div className="absolute left-[34px] top-4 bottom-4 w-px" style={{ backgroundColor: COLORS.line }} />
        <div className="space-y-4">
          {RECENT_PAYMENTS.map((p) => (
            <div key={p.id} className="flex items-start gap-3 relative">
              <div
                className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 mt-0.5 z-10 border-2"
                style={{ backgroundColor: greenSoft, borderColor: COLORS.panel }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: green }} />
              </div>
              <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold truncate" style={{ color: COLORS.ink }}>{p.supplier}</div>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[11px]" style={{ color: COLORS.muted }}>
                    <Clock size={10} />
                    {p.date}
                    <span className="px-1.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: COLORS.paper, color: COLORS.muted, fontSize: 10 }}>
                      {p.method}
                    </span>
                  </div>
                </div>
                <div className="text-[13px] font-bold shrink-0" style={{ color: green, fontFamily: FONTS.MONO }}>
                  +{p.amount.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SupplierDirectory({ query, setQuery }) {
  const filtered = SUPPLIERS.filter((s) =>
    [s.name, s.company, s.phone].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b" style={{ borderColor: COLORS.line }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: magentaSoft }}>
            <Users size={14} style={{ color: COLORS.magenta }} />
          </div>
          <div>
            <h3 className="text-[14.5px] font-bold" style={{ color: COLORS.ink }}>All suppliers</h3>
            <p className="text-[11.5px]" style={{ color: COLORS.muted }}>{SUPPLIERS.length} total</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg px-3 py-2 border" style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper }}>
            <Search size={13} style={{ color: COLORS.muted }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search supplier"
              className="bg-transparent outline-none text-[12.5px] w-32"
              style={{ color: COLORS.ink }}
            />
          </div>
          <button
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12.5px] font-semibold text-white shrink-0"
            style={{ backgroundColor: COLORS.magenta }}
          >
            <Plus size={13} />
            Add
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr>
              {["Supplier", "Company", "Phone", "Last payment", "Due"].map((h) => (
                <th key={h} className="text-left font-semibold text-[11px] uppercase tracking-wide px-5 py-3 text-white" style={{ backgroundColor: COLORS.magenta }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b hover:bg-black/[0.02] transition-colors cursor-pointer" style={{ borderColor: COLORS.line }}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={s.name} size={28} />
                    <span className="font-semibold" style={{ color: COLORS.ink }}>{s.name}</span>
                    {s.trend === "up" ? (
                      <ArrowUpRight size={13} style={{ color: COLORS.vermillion }} />
                    ) : (
                      <ArrowDownRight size={13} style={{ color: green }} />
                    )}
                  </div>
                </td>
                <td className="px-5 py-3" style={{ color: COLORS.muted }}>{s.company}</td>
                <td className="px-5 py-3" style={{ color: COLORS.ink, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                  <span className="inline-flex items-center gap-1.5">
                    <PhoneCall size={11} style={{ color: COLORS.muted }} />
                    {s.phone}
                  </span>
                </td>
                <td className="px-5 py-3" style={{ color: COLORS.ink, fontFamily: FONTS.MONO, fontSize: 12.5 }}>{s.lastPayment}</td>
                <td className="px-5 py-3 font-bold" style={{ color: s.due > 0 ? COLORS.vermillion : green, fontFamily: FONTS.MONO }}>
                  {s.due > 0 ? s.due.toLocaleString() : "Settled"}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-[13px]" style={{ color: COLORS.muted }}>
                  No suppliers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SupplierDashboardPage() {
  const [query, setQuery] = React.useState("");
  const totalDue = SUPPLIERS.reduce((sum, s) => sum + s.due, 0);
  const totalPaidThisMonth = RECENT_PAYMENTS.reduce((sum, p) => sum + p.amount, 0);
  const outstandingCount = SUPPLIERS.filter((s) => s.due > 0).length;

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      <HeroBanner
        totalDue={totalDue}
        totalPaidThisMonth={totalPaidThisMonth}
        supplierCount={SUPPLIERS.length}
        outstandingCount={outstandingCount}
      />

      {/* Middle row: chart + top due */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2">
          <MonthlyBars />
        </div>
        <TopDueSuppliers />
      </div>

      {/* Bottom row: payments + directory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <RecentPayments />
        <div className="lg:col-span-2">
          <SupplierDirectory query={query} setQuery={setQuery} />
        </div>
      </div>
    </div>
  );
}

export default SupplierDashboardPage;