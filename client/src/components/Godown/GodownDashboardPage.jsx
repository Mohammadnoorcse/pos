import React from "react";
import {
  Warehouse,
  Boxes,
  ArrowLeftRight,
  AlertTriangle,
  MapPin,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Search,
  Plus,
  Truck,
  PackageCheck,
  PackageX,
} from "lucide-react";
import { COLORS, FONTS } from "../../constants";

// Same design tokens used across ProductReturnPage.jsx / SupplierLedgerPage.jsx
const vermillionSoft = `${COLORS.vermillionSoft || COLORS.vermillion + "1A"}`;
const magentaSoft = COLORS.magentaSoft || `${COLORS.magenta}1A`;
const greenSoft = "#E7F6EC";
const green = "#1E9E5A";
const amberSoft = "#FFF4E0";
const amber = "#B8790A";

const GODOWNS = [
  {
    id: "GDN-01",
    name: "Central Godown",
    location: "Mirpur-10, Dhaka",
    manager: "Rafiqul Islam",
    totalItems: 4820,
    stockValue: 1284500,
    capacityUsed: 78,
    lowStockCount: 6,
  },
  {
    id: "GDN-02",
    name: "Chattogram Warehouse",
    location: "Agrabad, Chattogram",
    manager: "Kamal Hossain",
    totalItems: 2310,
    stockValue: 642300,
    capacityUsed: 54,
    lowStockCount: 2,
  },
  {
    id: "GDN-03",
    name: "Bogura Storage Unit",
    location: "Bogura Sadar, Bogura",
    manager: "Sohag Ahmed",
    totalItems: 1180,
    stockValue: 298750,
    capacityUsed: 91,
    lowStockCount: 9,
  },
  {
    id: "GDN-04",
    name: "Feni Sub-Godown",
    location: "Feni Sadar, Feni",
    manager: "Nazrul Islam",
    totalItems: 640,
    stockValue: 118900,
    capacityUsed: 33,
    lowStockCount: 0,
  },
];

const RECENT_TRANSFERS = [
  { id: "TRF-2201", date: "20-07-2026", from: "Central Godown", to: "Chattogram Warehouse", items: 120, status: "Completed" },
  { id: "TRF-2198", date: "19-07-2026", from: "Bogura Storage Unit", to: "Central Godown", items: 45, status: "In transit" },
  { id: "TRF-2195", date: "17-07-2026", from: "Central Godown", to: "Feni Sub-Godown", items: 80, status: "Completed" },
  { id: "TRF-2190", date: "15-07-2026", from: "Chattogram Warehouse", to: "Bogura Storage Unit", items: 30, status: "Cancelled" },
];

const STATUS_META = {
  Completed: { color: green, soft: greenSoft },
  "In transit": { color: amber, soft: amberSoft },
  Cancelled: { color: COLORS.vermillion, soft: vermillionSoft },
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

function CapacityBar({ percent }) {
  const color = percent >= 85 ? COLORS.vermillion : percent >= 60 ? amber : green;
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.paper }}>
      <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: color }} />
    </div>
  );
}

function GodownCard({ godown, onClick }) {
  const capColor = godown.capacityUsed >= 85 ? COLORS.vermillion : godown.capacityUsed >= 60 ? amber : green;
  return (
    <div
      onClick={onClick}
      className="rounded-2xl border p-4 cursor-pointer transition-transform hover:-translate-y-0.5 hover:shadow-md"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: magentaSoft }}>
            <Warehouse size={18} style={{ color: COLORS.magenta }} />
          </div>
          <div>
            <div className="text-[14px] font-bold" style={{ color: COLORS.ink }}>{godown.name}</div>
            <div className="flex items-center gap-1 text-[11.5px] mt-0.5" style={{ color: COLORS.muted }}>
              <MapPin size={11} />
              {godown.location}
            </div>
          </div>
        </div>
        <ChevronRight size={16} style={{ color: COLORS.muted }} className="shrink-0" />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="rounded-lg px-3 py-2.5" style={{ backgroundColor: COLORS.paper }}>
          <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Items in stock</div>
          <div className="text-[15px] font-bold mt-0.5" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
            {godown.totalItems.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg px-3 py-2.5" style={{ backgroundColor: COLORS.paper }}>
          <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Stock value</div>
          <div className="text-[15px] font-bold mt-0.5" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>
            {godown.stockValue.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="mt-3.5">
        <div className="flex items-center justify-between text-[11px] mb-1" style={{ color: COLORS.muted }}>
          <span>Capacity used</span>
          <span className="font-bold" style={{ color: capColor, fontFamily: FONTS.MONO }}>{godown.capacityUsed}%</span>
        </div>
        <CapacityBar percent={godown.capacityUsed} />
      </div>

      <div className="flex items-center justify-between mt-3.5 pt-3 border-t" style={{ borderColor: COLORS.line }}>
        <span className="text-[11.5px]" style={{ color: COLORS.muted }}>
          Manager: <span className="font-semibold" style={{ color: COLORS.ink }}>{godown.manager}</span>
        </span>
        {godown.lowStockCount > 0 ? (
          <span className="flex items-center gap-1 text-[11.5px] font-semibold" style={{ color: amber }}>
            <AlertTriangle size={12} />
            {godown.lowStockCount} low stock
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[11.5px] font-semibold" style={{ color: green }}>
            <PackageCheck size={12} />
            All stocked
          </span>
        )}
      </div>
    </div>
  );
}

export function GodownDashboardPage({ onNavigate }) {
  const [query, setQuery] = React.useState("");

  const filtered = GODOWNS.filter((g) =>
    [g.name, g.location, g.manager, g.id].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  const totalGodowns = GODOWNS.length;
  const totalItems = GODOWNS.reduce((s, g) => s + g.totalItems, 0);
  const totalValue = GODOWNS.reduce((s, g) => s + g.stockValue, 0);
  const totalLowStock = GODOWNS.reduce((s, g) => s + g.lowStockCount, 0);

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: magentaSoft }}>
            <Warehouse size={16} style={{ color: COLORS.magenta }} />
          </div>
          <div>
            <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>
              Godown Dashboard
            </h1>
            <p className="text-[12px]" style={{ color: COLORS.muted }}>
              Overview of all godowns, stock levels &amp; transfer activity
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate && onNavigate("stock-transfer")}
          className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold text-white self-start sm:self-auto"
          style={{ backgroundColor: COLORS.vermillion }}
        >
          <ArrowLeftRight size={14} />
          New stock transfer
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <StatCard icon={Warehouse} label="Total godowns" value={totalGodowns} color={COLORS.magenta} soft={magentaSoft} />
        <StatCard icon={Boxes} label="Items in stock" value={totalItems.toLocaleString()} color={COLORS.ink} soft={COLORS.paper} />
        <StatCard icon={TrendingUp} label="Total stock value" value={totalValue.toLocaleString()} color={COLORS.vermillion} soft={vermillionSoft} />
        <StatCard
          icon={AlertTriangle}
          label="Low stock alerts"
          value={totalLowStock}
          sub={totalLowStock > 0 ? "Needs attention" : "All good"}
          color={totalLowStock > 0 ? amber : green}
          soft={totalLowStock > 0 ? amberSoft : greenSoft}
        />
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 rounded-lg px-3 py-2 border mb-4 max-w-md" style={{ borderColor: COLORS.line, backgroundColor: COLORS.panel }}>
        <Search size={14} style={{ color: COLORS.muted }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search godown / location / manager"
          className="bg-transparent outline-none text-[13px] w-full"
          style={{ color: COLORS.ink }}
        />
      </div>

      {/* Godown cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {filtered.map((g) => (
          <GodownCard key={g.id} godown={g} onClick={() => onNavigate && onNavigate("current-stock-info")} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-10 text-[13px]" style={{ color: COLORS.muted }}>
            No godowns match your search.
          </div>
        )}
      </div>

      {/* Recent transfer activity */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: COLORS.line }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: vermillionSoft }}>
              <Truck size={14} style={{ color: COLORS.vermillion }} />
            </div>
            <h2 className="text-[14.5px] font-bold" style={{ color: COLORS.ink }}>Recent stock transfers</h2>
          </div>
          <button
            onClick={() => onNavigate && onNavigate("transfer-histories")}
            className="text-[12.5px] font-semibold flex items-center gap-1"
            style={{ color: COLORS.vermillion }}
          >
            View all
            <ChevronRight size={13} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr>
                {["Date", "Transfer id", "From", "To", "Items", "Status"].map((h) => (
                  <th key={h} className="text-left font-semibold text-[11px] uppercase tracking-wide px-5 py-3 text-white" style={{ backgroundColor: COLORS.vermillion }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_TRANSFERS.map((t) => {
                const meta = STATUS_META[t.status];
                return (
                  <tr key={t.id} className="border-b hover:bg-black/[0.02] transition-colors" style={{ borderColor: COLORS.line }}>
                    <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: COLORS.ink, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                      {t.date}
                    </td>
                    <td className="px-5 py-3.5 font-semibold" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                      {t.id}
                    </td>
                    <td className="px-5 py-3.5" style={{ color: COLORS.ink }}>{t.from}</td>
                    <td className="px-5 py-3.5" style={{ color: COLORS.ink }}>{t.to}</td>
                    <td className="px-5 py-3.5 font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{t.items}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
                        style={{ backgroundColor: meta.soft, color: meta.color }}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GodownDashboardPage;