import React from "react";
import {
  BarChart3,
  Search,
  ChevronDown,
  Filter,
  Download,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Warehouse,
  ArrowLeft,
  ArrowRight,
  ListTree,
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

/* ---------------------------------------------------------------------
   House style, shared with Stock Transfer / Stock Transfer Invoices.
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
const amberSoft = "#FFF4E0";
const amber = "#B8790A";
const blueSoft = "#E8EEFC";
const blue = "#2657C7";

const GODOWNS = [
  { id: "GDN-01", name: "Central Godown" },
  { id: "GDN-02", name: "Chattogram Warehouse" },
  { id: "GDN-03", name: "Bogura Storage Unit" },
  { id: "GDN-04", name: "Feni Sub-Godown" },
];
function godownName(id) {
  return GODOWNS.find((g) => g.id === id)?.name || id;
}

const MOVE_META = {
  purchase_in: { label: "Purchase in", color: green, soft: greenSoft },
  transfer_in: { label: "Transfer in", color: blue, soft: blueSoft },
  transfer_out: { label: "Transfer out", color: amber, soft: amberSoft },
  sales_out: { label: "Sales out", color: COLORS.vermillion, soft: vermillionSoft },
};

function taka(n) {
  return "৳" + Math.round(n).toLocaleString("en-BD");
}

/* Report rows — closing balances match the availability figures used on
   Current Stock / Stock Transfer, and transfer references (TRF-...) tie
   back to the completed transfers on that page, so the three reports
   agree with each other. */
const REPORT_ROWS = [
  {
    sku: "RCE-0091", name: "Miniket Rice 50kg", unit: "bag", rate: 3200, godown: "GDN-01",
    opening: 280, inQty: 220, outQty: 160,
    ledger: [
      { date: "05-07-2026", type: "purchase_in", ref: "PO-2287", qty: 140 },
      { date: "09-07-2026", type: "purchase_in", ref: "PO-2299", qty: 80 },
      { date: "14-07-2026", type: "sales_out", ref: "SO-6612", qty: -95 },
      { date: "20-07-2026", type: "sales_out", ref: "SO-6650", qty: -65 },
    ],
  },
  {
    sku: "OIL-0142", name: "Soybean Oil 5L", unit: "ctn", rate: 5400, godown: "GDN-01",
    opening: 40, inQty: 48, outQty: 30,
    ledger: [
      { date: "06-07-2026", type: "purchase_in", ref: "PO-2290", qty: 28 },
      { date: "12-07-2026", type: "transfer_out", ref: "TRF-1041", qty: -20 },
      { date: "18-07-2026", type: "purchase_in", ref: "PO-2305", qty: 20 },
      { date: "21-07-2026", type: "sales_out", ref: "SO-6660", qty: -10 },
    ],
  },
  {
    sku: "SPC-0033", name: "Turmeric Powder 200g", unit: "ctn", rate: 1800, godown: "GDN-01",
    opening: 20, inQty: 10, outQty: 18,
    ledger: [
      { date: "08-07-2026", type: "purchase_in", ref: "PO-2294", qty: 10 },
      { date: "16-07-2026", type: "sales_out", ref: "SO-6630", qty: -18 },
    ],
  },
  {
    sku: "PLS-0071", name: "Masoor Dal 25kg", unit: "bag", rate: 2850, godown: "GDN-02",
    opening: 180, inQty: 90, outQty: 60,
    ledger: [
      { date: "07-07-2026", type: "purchase_in", ref: "PO-2292", qty: 90 },
      { date: "19-07-2026", type: "sales_out", ref: "SO-6645", qty: -60 },
    ],
  },
  {
    sku: "BEV-0018", name: "Mineral Water 1L", unit: "ctn", rate: 320, godown: "GDN-02",
    opening: 520, inQty: 340, outQty: 220,
    ledger: [
      { date: "04-07-2026", type: "purchase_in", ref: "PO-2280", qty: 340 },
      { date: "21-07-2026", type: "transfer_out", ref: "TRF-1039", qty: -150 },
      { date: "22-07-2026", type: "sales_out", ref: "SO-6665", qty: -70 },
    ],
  },
  {
    sku: "SPC-0040", name: "Cumin Seed 100g", unit: "ctn", rate: 2200, godown: "GDN-02",
    opening: 66, inQty: 40, outQty: 30,
    ledger: [
      { date: "09-07-2026", type: "purchase_in", ref: "PO-2296", qty: 40 },
      { date: "19-07-2026", type: "transfer_out", ref: "TRF-1035", qty: -30 },
    ],
  },
  {
    sku: "PKG-0055", name: "Poly Bag Roll 12in", unit: "roll", rate: 450, godown: "GDN-03",
    opening: 15, inQty: 17, outQty: 10,
    ledger: [
      { date: "10-07-2026", type: "purchase_in", ref: "PO-2298", qty: 17 },
      { date: "15-07-2026", type: "transfer_out", ref: "TRF-1028", qty: -10 },
    ],
  },
  {
    sku: "OIL-0150", name: "Mustard Oil 5L", unit: "ctn", rate: 5100, godown: "GDN-04",
    opening: 70, inQty: 65, outQty: 40,
    ledger: [
      { date: "08-07-2026", type: "purchase_in", ref: "PO-2293", qty: 65 },
      { date: "17-07-2026", type: "transfer_out", ref: "TRF-1031", qty: -40 },
    ],
  },
].map((r) => ({ ...r, closing: r.opening + r.inQty - r.outQty }));

/* Illustrative daily value trend for the report period (in thousands of taka). */
const DAILY_TREND = [
  { date: "09 Jul", in: 42, out: 18 },
  { date: "10 Jul", in: 17, out: 22 },
  { date: "11 Jul", in: 9, out: 14 },
  { date: "12 Jul", in: 28, out: 20 },
  { date: "13 Jul", in: 6, out: 8 },
  { date: "14 Jul", in: 15, out: 95 },
  { date: "15 Jul", in: 12, out: 24 },
  { date: "16 Jul", in: 8, out: 32 },
  { date: "17 Jul", in: 65, out: 40 },
  { date: "18 Jul", in: 20, out: 6 },
  { date: "19 Jul", in: 130, out: 90 },
  { date: "20 Jul", in: 22, out: 65 },
  { date: "21 Jul", in: 34, out: 25 },
  { date: "22 Jul", in: 21, out: 22 },
];

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

/* Signature element: a compact diverging bar per row — out grows left
   from the centre line, in grows right — so the shape of the movement
   is visible at a glance without opening anything. */
function MovementBar({ inQty, outQty }) {
  const max = Math.max(inQty, outQty, 1);
  const inPct = (inQty / max) * 100;
  const outPct = (outQty / max) * 100;
  return (
    <div className="flex items-center gap-1.5 w-full min-w-[110px]">
      <div className="flex-1 h-2 rounded-l-full overflow-hidden flex justify-end" style={{ backgroundColor: COLORS.line }}>
        <div className="h-full rounded-l-full" style={{ width: `${outPct}%`, backgroundColor: COLORS.vermillion }} />
      </div>
      <div className="w-px h-3.5" style={{ backgroundColor: COLORS.muted }} />
      <div className="flex-1 h-2 rounded-r-full overflow-hidden" style={{ backgroundColor: COLORS.line }}>
        <div className="h-full rounded-r-full" style={{ width: `${inPct}%`, backgroundColor: green }} />
      </div>
    </div>
  );
}

function LedgerDrawer({ row, onClose }) {
  if (!row) return null;
  let running = row.opening;
  const rows = row.ledger.map((tx) => {
    running += tx.qty;
    return { ...tx, balance: running };
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ backgroundColor: "rgba(36,28,26,0.45)" }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-full w-full max-w-md flex flex-col animate-[slideIn_0.2s_ease-out]"
        style={{ backgroundColor: COLORS.panel, fontFamily: FONTS.BODY }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: COLORS.line }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: magentaSoft }}>
              <ListTree size={15} style={{ color: COLORS.magenta }} />
            </div>
            <div>
              <h2 className="text-[14.5px] font-bold" style={{ color: COLORS.ink }}>{row.name}</h2>
              <p className="text-[11px]" style={{ color: COLORS.muted }}>{row.sku} · {godownName(row.godown)}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5">
            <X size={15} style={{ color: COLORS.muted }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            <div className="rounded-xl border p-3" style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper }}>
              <div className="text-[10px] uppercase tracking-wide" style={{ color: COLORS.muted }}>Opening</div>
              <div className="text-[15px] font-bold mt-0.5" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{row.opening} {row.unit}</div>
            </div>
            <div className="rounded-xl border p-3" style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper }}>
              <div className="text-[10px] uppercase tracking-wide" style={{ color: COLORS.muted }}>Net change</div>
              <div className="text-[15px] font-bold mt-0.5" style={{ color: row.inQty - row.outQty >= 0 ? green : COLORS.vermillion, fontFamily: FONTS.MONO }}>
                {row.inQty - row.outQty >= 0 ? "+" : ""}{row.inQty - row.outQty} {row.unit}
              </div>
            </div>
            <div className="rounded-xl border p-3" style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper }}>
              <div className="text-[10px] uppercase tracking-wide" style={{ color: COLORS.muted }}>Closing</div>
              <div className="text-[15px] font-bold mt-0.5" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{row.closing} {row.unit}</div>
            </div>
          </div>

          <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: COLORS.muted }}>
            Movement ledger
          </div>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: COLORS.line }}>
            <table className="w-full text-[12px]">
              <thead>
                <tr style={{ backgroundColor: COLORS.paper }}>
                  <th className="text-left px-3 py-2 font-semibold uppercase tracking-wide text-[10px]" style={{ color: COLORS.muted }}>Date</th>
                  <th className="text-left px-3 py-2 font-semibold uppercase tracking-wide text-[10px]" style={{ color: COLORS.muted }}>Type</th>
                  <th className="text-left px-3 py-2 font-semibold uppercase tracking-wide text-[10px]" style={{ color: COLORS.muted }}>Ref</th>
                  <th className="text-right px-3 py-2 font-semibold uppercase tracking-wide text-[10px]" style={{ color: COLORS.muted }}>Qty</th>
                  <th className="text-right px-3 py-2 font-semibold uppercase tracking-wide text-[10px]" style={{ color: COLORS.muted }}>Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t" style={{ borderColor: COLORS.line }}>
                  <td className="px-3 py-2 text-[11px]" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }} colSpan={3}>Opening balance</td>
                  <td className="px-3 py-2 text-right" />
                  <td className="px-3 py-2 text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{row.opening}</td>
                </tr>
                {rows.map((tx, i) => {
                  const meta = MOVE_META[tx.type];
                  return (
                    <tr key={i} className="border-t" style={{ borderColor: COLORS.line }}>
                      <td className="px-3 py-2 whitespace-nowrap" style={{ color: COLORS.muted, fontFamily: FONTS.MONO, fontSize: 11.5 }}>{tx.date}</td>
                      <td className="px-3 py-2">
                        <span className="inline-flex px-1.5 py-0.5 rounded-full text-[10.5px] font-semibold whitespace-nowrap" style={{ backgroundColor: meta.soft, color: meta.color }}>
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap" style={{ color: COLORS.ink, fontFamily: FONTS.MONO, fontSize: 11.5 }}>{tx.ref}</td>
                      <td className="px-3 py-2 text-right font-semibold whitespace-nowrap" style={{ color: tx.qty >= 0 ? green : COLORS.vermillion, fontFamily: FONTS.MONO }}>
                        {tx.qty >= 0 ? "+" : ""}{tx.qty}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{tx.balance}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StockInOutReportPage({ onNavigate }) {
  const [query, setQuery] = React.useState("");
  const [godownFilter, setGodownFilter] = React.useState("ALL");
  const [trendFilter, setTrendFilter] = React.useState("ALL");
  const [active, setActive] = React.useState(null);

  const filtered = REPORT_ROWS.filter((r) => {
    const matchesQuery = [r.sku, r.name].join(" ").toLowerCase().includes(query.toLowerCase());
    const matchesGodown = godownFilter === "ALL" || r.godown === godownFilter;
    const net = r.inQty - r.outQty;
    const matchesTrend = trendFilter === "ALL" || (trendFilter === "up" ? net >= 0 : net < 0);
    return matchesQuery && matchesGodown && matchesTrend;
  });

  const valueIn = REPORT_ROWS.reduce((s, r) => s + r.inQty * r.rate, 0);
  const valueOut = REPORT_ROWS.reduce((s, r) => s + r.outQty * r.rate, 0);
  const netValue = valueIn - valueOut;
  const closingValue = REPORT_ROWS.reduce((s, r) => s + r.closing * r.rate, 0);

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      <style>{`@keyframes slideIn { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: magentaSoft }}>
            <BarChart3 size={16} style={{ color: COLORS.magenta }} />
          </div>
          <div>
            <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>
              Stock In / Out Report
            </h1>
            <p className="text-[12px]" style={{ color: COLORS.muted }}>
              Opening, movement and closing balance by item — 01 Jul to 22 Jul 2026
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onNavigate && onNavigate("stock-transfer")}
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold border"
            style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.panel }}
          >
            <ArrowLeft size={13} />
            Transfers
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
        <StatCard icon={ArrowDownRight} label="Stock in" value={taka(valueIn)} sub="Received this period" color={green} soft={greenSoft} />
        <StatCard icon={ArrowUpRight} label="Stock out" value={taka(valueOut)} sub="Dispatched this period" color={COLORS.vermillion} soft={vermillionSoft} />
        <StatCard
          icon={netValue >= 0 ? TrendingUp : TrendingDown}
          label="Net change"
          value={`${netValue >= 0 ? "+" : ""}${taka(netValue)}`}
          sub={netValue >= 0 ? "Stock building up" : "Stock drawing down"}
          color={netValue >= 0 ? green : COLORS.vermillion}
          soft={netValue >= 0 ? greenSoft : vermillionSoft}
        />
        <StatCard icon={Wallet} label="Closing stock value" value={taka(closingValue)} color={blue} soft={blueSoft} />
      </div>

      {/* Trend chart */}
      <div className="rounded-2xl border p-4 mb-5" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[12.5px] font-semibold" style={{ color: COLORS.ink }}>Daily movement value (৳ thousands)</div>
          <div className="flex items-center gap-3 text-[11px]" style={{ color: COLORS.muted }}>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: green }} />In</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.vermillion }} />Out</span>
          </div>
        </div>
        <div style={{ width: "100%", height: 200 }}>
          <ResponsiveContainer>
            <BarChart data={DAILY_TREND} barGap={2}>
              <CartesianGrid stroke={COLORS.line} vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: COLORS.muted }} axisLine={{ stroke: COLORS.line }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: COLORS.muted }} axisLine={false} tickLine={false} width={30} />
              <Tooltip
                contentStyle={{ borderRadius: 10, borderColor: COLORS.line, fontSize: 12, fontFamily: FONTS.BODY }}
                labelStyle={{ color: COLORS.ink, fontWeight: 600 }}
              />
              <Bar dataKey="in" fill={green} radius={[3, 3, 0, 0]} />
              <Bar dataKey="out" fill={COLORS.vermillion} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 border flex-1 min-w-[220px]" style={{ borderColor: COLORS.line, backgroundColor: COLORS.panel }}>
          <Search size={14} style={{ color: COLORS.muted }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search item / SKU"
            className="bg-transparent outline-none text-[13px] w-full"
            style={{ color: COLORS.ink }}
          />
        </div>
        <Select value={godownFilter} onChange={setGodownFilter} icon={Warehouse} options={[{ id: "ALL", name: "Any godown" }, ...GODOWNS]} />
        <Select
          value={trendFilter}
          onChange={setTrendFilter}
          icon={Filter}
          options={[
            { id: "ALL", name: "All movement" },
            { id: "up", name: "Net increase" },
            { id: "down", name: "Net decrease" },
          ]}
        />
      </div>

      {/* Report table */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr>
                {["Item", "Godown", "Opening", "In", "Out", "Closing", "Movement", ""].map((label) => (
                  <th key={label} className="text-left px-5 py-3 text-white" style={{ backgroundColor: COLORS.vermillion }}>
                    <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={`${r.sku}-${r.godown}`}
                  className="border-b hover:bg-black/[0.02] transition-colors cursor-pointer"
                  style={{ borderColor: COLORS.line }}
                  onClick={() => setActive(r)}
                >
                  <td className="px-5 py-3.5" style={{ color: COLORS.ink }}>
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-[11px]" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>{r.sku}</div>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: COLORS.ink }}>
                    <div className="flex items-center gap-1.5 text-[12.5px]">
                      <Warehouse size={12} style={{ color: COLORS.muted }} />
                      {godownName(r.godown)}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>
                    {r.opening} <span className="text-[11px]">{r.unit}</span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap font-semibold" style={{ color: green, fontFamily: FONTS.MONO }}>
                    +{r.inQty}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap font-semibold" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>
                    −{r.outQty}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                    {r.closing} <span className="font-normal text-[11px]" style={{ color: COLORS.muted }}>{r.unit}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <MovementBar inQty={r.inQty} outQty={r.outQty} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); setActive(r); }}
                      className="text-[11.5px] font-semibold whitespace-nowrap"
                      style={{ color: COLORS.magenta }}
                    >
                      View ledger
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-[13px]" style={{ color: COLORS.muted }}>
                    No items match your filters.
                  </td>
                </tr>
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr style={{ backgroundColor: COLORS.paper }}>
                  <td className="px-5 py-3 font-semibold" style={{ color: COLORS.ink }} colSpan={3}>Total</td>
                  <td className="px-5 py-3 font-bold whitespace-nowrap" style={{ color: green, fontFamily: FONTS.MONO }}>
                    +{filtered.reduce((s, r) => s + r.inQty, 0)}
                  </td>
                  <td className="px-5 py-3 font-bold whitespace-nowrap" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>
                    −{filtered.reduce((s, r) => s + r.outQty, 0)}
                  </td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      <LedgerDrawer row={active} onClose={() => setActive(null)} />
    </div>
  );
}

export default StockInOutReportPage;