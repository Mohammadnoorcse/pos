import React from "react";
import {
  Boxes,
  Search,
  ChevronDown,
  AlertTriangle,
  PackageCheck,
  PackageX,
  Filter,
  Download,
  ArrowUpDown,
  Warehouse,
  Layers,
  TrendingUp,
  ScanBarcode,
  Plus,
  X,
} from "lucide-react";
import { COLORS, FONTS } from "../../constants";

// Same design tokens used across GodownDashboardPage.jsx / ProductReturnPage.jsx / SupplierLedgerPage.jsx
const vermillionSoft = `${COLORS.vermillionSoft || COLORS.vermillion + "1A"}`;
const magentaSoft = COLORS.magentaSoft || `${COLORS.magenta}1A`;
const greenSoft = "#E7F6EC";
const green = "#1E9E5A";
const amberSoft = "#FFF4E0";
const amber = "#B8790A";

const GODOWNS = [
  { id: "GDN-01", name: "Central Godown" },
  { id: "GDN-02", name: "Chattogram Warehouse" },
  { id: "GDN-03", name: "Bogura Storage Unit" },
  { id: "GDN-04", name: "Feni Sub-Godown" },
];

const CATEGORIES = ["All categories", "Rice & Grains", "Edible Oil", "Spices", "Pulses", "Beverages", "Packaging"];

const STOCK_ITEMS = [
  { sku: "RCE-0091", name: "Miniket Rice 50kg", category: "Rice & Grains", godown: "GDN-01", qty: 340, unit: "bag", reorder: 100, rate: 2650, updated: "21-07-2026" },
  { sku: "OIL-0142", name: "Soybean Oil 5L", category: "Edible Oil", godown: "GDN-01", qty: 58, unit: "ctn", reorder: 60, rate: 890, updated: "21-07-2026" },
  { sku: "SPC-0033", name: "Turmeric Powder 200g", category: "Spices", godown: "GDN-01", qty: 12, unit: "ctn", reorder: 40, rate: 210, updated: "20-07-2026" },
  { sku: "PLS-0071", name: "Masoor Dal 25kg", category: "Pulses", godown: "GDN-02", qty: 210, unit: "bag", reorder: 50, rate: 3120, updated: "19-07-2026" },
  { sku: "BEV-0018", name: "Mineral Water 1L", category: "Beverages", godown: "GDN-02", qty: 640, unit: "ctn", reorder: 150, rate: 240, updated: "21-07-2026" },
  { sku: "PKG-0055", name: "Poly Bag Roll 12in", category: "Packaging", godown: "GDN-03", qty: 22, unit: "roll", reorder: 25, rate: 480, updated: "18-07-2026" },
  { sku: "RCE-0104", name: "Nazirshail Rice 50kg", category: "Rice & Grains", godown: "GDN-03", qty: 0, unit: "bag", reorder: 80, rate: 2800, updated: "17-07-2026" },
  { sku: "OIL-0150", name: "Mustard Oil 5L", category: "Edible Oil", godown: "GDN-04", qty: 95, unit: "ctn", reorder: 40, rate: 950, updated: "20-07-2026" },
  { sku: "SPC-0040", name: "Cumin Seed 100g", category: "Spices", godown: "GDN-02", qty: 76, unit: "ctn", reorder: 30, rate: 165, updated: "21-07-2026" },
  { sku: "PLS-0080", name: "Chickpea 25kg", category: "Pulses", godown: "GDN-01", qty: 18, unit: "bag", reorder: 35, rate: 2950, updated: "16-07-2026" },
];

function stockStatus(item) {
  if (item.qty === 0) return { label: "Out of stock", color: COLORS.vermillion, soft: vermillionSoft, icon: PackageX };
  if (item.qty <= item.reorder) return { label: "Low stock", color: amber, soft: amberSoft, icon: AlertTriangle };
  return { label: "In stock", color: green, soft: greenSoft, icon: PackageCheck };
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

function AddStockModal({ onClose, onSave }) {
  const [form, setForm] = React.useState({
    sku: STOCK_ITEMS[0].sku,
    godown: GODOWNS[0].id,
    qty: "",
    rate: "",
    note: "",
  });
  const [error, setError] = React.useState("");

  const selectedItem = STOCK_ITEMS.find((it) => it.sku === form.sku);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = () => {
    const qtyNum = Number(form.qty);
    if (!qtyNum || qtyNum <= 0) {
      setError("Valid quantity দিন");
      return;
    }
    onSave({ ...form, qty: qtyNum, rate: form.rate ? Number(form.rate) : selectedItem.rate });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border overflow-hidden"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line, fontFamily: FONTS.BODY }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: COLORS.line }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: vermillionSoft }}>
              <Plus size={15} style={{ color: COLORS.vermillion }} />
            </div>
            <h2 className="text-[14.5px] font-bold" style={{ color: COLORS.ink }}>Add stock</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5">
            <X size={15} style={{ color: COLORS.muted }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3.5">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
              Item
            </label>
            <select
              value={form.sku}
              onChange={update("sku")}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-[13px] outline-none"
              style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.paper }}
            >
              {STOCK_ITEMS.map((it) => (
                <option key={it.sku} value={it.sku}>
                  {it.sku} — {it.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
              Godown
            </label>
            <select
              value={form.godown}
              onChange={update("godown")}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-[13px] outline-none"
              style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.paper }}
            >
              {GODOWNS.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
                Quantity ({selectedItem.unit})
              </label>
              <input
                type="number"
                min="1"
                value={form.qty}
                onChange={update("qty")}
                placeholder="0"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-[13px] outline-none"
                style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.paper, fontFamily: FONTS.MONO }}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
                Rate (৳)
              </label>
              <input
                type="number"
                min="0"
                value={form.rate}
                onChange={update("rate")}
                placeholder={String(selectedItem.rate)}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-[13px] outline-none"
                style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.paper, fontFamily: FONTS.MONO }}
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
              Note (optional)
            </label>
            <textarea
              value={form.note}
              onChange={update("note")}
              rows={2}
              placeholder="e.g. Purchase invoice #, supplier name"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-[13px] outline-none resize-none"
              style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.paper }}
            />
          </div>

          {error && (
            <div className="text-[12px] font-semibold" style={{ color: COLORS.vermillion }}>{error}</div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t" style={{ borderColor: COLORS.line }}>
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-[12.5px] font-semibold border"
            style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.panel }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg px-4 py-2 text-[12.5px] font-semibold text-white"
            style={{ backgroundColor: COLORS.vermillion }}
          >
            Add to stock
          </button>
        </div>
      </div>
    </div>
  );
}

export function CurrentStockInfoPage({ onNavigate }) {
  const [query, setQuery] = React.useState("");
  const [godown, setGodown] = React.useState("ALL");
  const [category, setCategory] = React.useState("All categories");
  const [sortKey, setSortKey] = React.useState("name");
  const [sortDir, setSortDir] = React.useState(1);
  const [items, setItems] = React.useState(STOCK_ITEMS);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [toast, setToast] = React.useState("");

  const godownName = (id) => GODOWNS.find((g) => g.id === id)?.name || id;

  const handleAddStock = ({ sku, godown: gId, qty, rate }) => {
    setItems((prev) =>
      prev.map((it) =>
        it.sku === sku && it.godown === gId
          ? { ...it, qty: it.qty + qty, rate, updated: "22-07-2026" }
          : it
      )
    );
    setShowAddModal(false);
    setToast(`${qty} unit "${sku}" stock-এ যোগ হয়েছে`);
    setTimeout(() => setToast(""), 3000);
  };

  const filtered = items.filter((it) => {
    const matchesQuery = [it.sku, it.name, it.category].join(" ").toLowerCase().includes(query.toLowerCase());
    const matchesGodown = godown === "ALL" || it.godown === godown;
    const matchesCategory = category === "All categories" || it.category === category;
    return matchesQuery && matchesGodown && matchesCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    let av = a[sortKey];
    let bv = b[sortKey];
    if (typeof av === "string") {
      return av.localeCompare(bv) * sortDir;
    }
    return (av - bv) * sortDir;
  });

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => -d);
    } else {
      setSortKey(key);
      setSortDir(1);
    }
  };

  const totalSkus = filtered.length;
  const totalUnits = filtered.reduce((s, it) => s + it.qty, 0);
  const totalValue = filtered.reduce((s, it) => s + it.qty * it.rate, 0);
  const lowOrOut = filtered.filter((it) => it.qty <= it.reorder).length;

  const SortHeader = ({ label, sortField }) => (
    <button
      onClick={() => toggleSort(sortField)}
      className="flex items-center gap-1 text-left font-semibold text-[11px] uppercase tracking-wide"
    >
      {label}
      <ArrowUpDown size={11} className="opacity-70" />
    </button>
  );

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: magentaSoft }}>
            <Boxes size={16} style={{ color: COLORS.magenta }} />
          </div>
          <div>
            <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>
              Current Stock Info
            </h1>
            <p className="text-[12px]" style={{ color: COLORS.muted }}>
              Live item-level stock across all godowns
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold border"
            style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.panel }}
          >
            <Download size={13} />
            Export
          </button>
          <button
            onClick={() => onNavigate && onNavigate("stock-transfer")}
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold border"
            style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.panel }}
          >
            <ScanBarcode size={13} />
            Scan / adjust
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold text-white"
            style={{ backgroundColor: COLORS.vermillion }}
          >
            <Plus size={13} />
            Add stock
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <StatCard icon={Layers} label="SKUs listed" value={totalSkus} color={COLORS.magenta} soft={magentaSoft} />
        <StatCard icon={Boxes} label="Total units" value={totalUnits.toLocaleString()} color={COLORS.ink} soft={COLORS.paper} />
        <StatCard icon={TrendingUp} label="Stock value" value={totalValue.toLocaleString()} color={COLORS.vermillion} soft={vermillionSoft} />
        <StatCard
          icon={AlertTriangle}
          label="Low / out of stock"
          value={lowOrOut}
          sub={lowOrOut > 0 ? "Needs attention" : "All good"}
          color={lowOrOut > 0 ? amber : green}
          soft={lowOrOut > 0 ? amberSoft : greenSoft}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 border flex-1 min-w-[220px]" style={{ borderColor: COLORS.line, backgroundColor: COLORS.panel }}>
          <Search size={14} style={{ color: COLORS.muted }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search SKU / item / category"
            className="bg-transparent outline-none text-[13px] w-full"
            style={{ color: COLORS.ink }}
          />
        </div>

        <Select
          value={godown}
          onChange={setGodown}
          icon={Warehouse}
          options={[{ id: "ALL", name: "All godowns" }, ...GODOWNS]}
        />
        <Select value={category} onChange={setCategory} icon={Filter} options={CATEGORIES} />
      </div>

      {/* Stock table */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr>
                {[
                  { label: "SKU", key: "sku" },
                  { label: "Item", key: "name" },
                  { label: "Godown", key: "godown" },
                  { label: "Qty", key: "qty" },
                  { label: "Reorder level", key: "reorder" },
                  { label: "Rate", key: "rate" },
                  { label: "Value", key: "value" },
                  { label: "Updated", key: "updated" },
                  { label: "Status", key: null },
                ].map((col) => (
                  <th key={col.label} className="text-left px-5 py-3 text-white" style={{ backgroundColor: COLORS.vermillion }}>
                    {col.key ? <SortHeader label={col.label} sortField={col.key} /> : (
                      <span className="text-[11px] font-semibold uppercase tracking-wide">{col.label}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((it) => {
                const status = stockStatus(it);
                const StatusIcon = status.icon;
                const value = it.qty * it.rate;
                return (
                  <tr key={it.sku} className="border-b hover:bg-black/[0.02] transition-colors" style={{ borderColor: COLORS.line }}>
                    <td className="px-5 py-3.5 font-semibold whitespace-nowrap" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                      {it.sku}
                    </td>
                    <td className="px-5 py-3.5" style={{ color: COLORS.ink }}>
                      <div className="font-semibold">{it.name}</div>
                      <div className="text-[11px]" style={{ color: COLORS.muted }}>{it.category}</div>
                    </td>
                    <td className="px-5 py-3.5" style={{ color: COLORS.ink }}>{godownName(it.godown)}</td>
                    <td className="px-5 py-3.5 font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                      {it.qty.toLocaleString()} <span className="font-normal text-[11px]" style={{ color: COLORS.muted }}>{it.unit}</span>
                    </td>
                    <td className="px-5 py-3.5" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>{it.reorder}</td>
                    <td className="px-5 py-3.5" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{it.rate.toLocaleString()}</td>
                    <td className="px-5 py-3.5 font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{value.toLocaleString()}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: COLORS.muted, fontFamily: FONTS.MONO, fontSize: 12.5 }}>{it.updated}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
                        style={{ backgroundColor: status.soft, color: status.color }}
                      >
                        <StatusIcon size={11} />
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-[13px]" style={{ color: COLORS.muted }}>
                    No stock items match your filters.
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
          style={{ backgroundColor: green }}
        >
          <PackageCheck size={14} />
          {toast}
        </div>
      )}

      {/* Add stock modal */}
      {showAddModal && (
        <AddStockModal onClose={() => setShowAddModal(false)} onSave={handleAddStock} />
      )}
    </div>
  );
}

export default CurrentStockInfoPage;