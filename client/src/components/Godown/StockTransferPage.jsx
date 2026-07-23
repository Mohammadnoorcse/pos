import React from "react";
import {
  Repeat,
  Search,
  ChevronDown,
  ChevronRight,
  Filter,
  Download,
  Plus,
  X,
  Truck,
  PackageCheck,
  Clock,
  CircleDot,
  Warehouse,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { COLORS, FONTS } from "../../constants";

// Same design tokens used across GodownDashboardPage.jsx / CurrentStockInfoPage.jsx / SupplierLedgerPage.jsx
const vermillionSoft = `${COLORS.vermillionSoft || COLORS.vermillion + "1A"}`;
const magentaSoft = COLORS.magentaSoft || `${COLORS.magenta}1A`;
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

const ITEMS = [
  { sku: "RCE-0091", name: "Miniket Rice 50kg", unit: "bag", available: { "GDN-01": 340, "GDN-02": 0, "GDN-03": 0, "GDN-04": 0 } },
  { sku: "OIL-0142", name: "Soybean Oil 5L", unit: "ctn", available: { "GDN-01": 58, "GDN-02": 0, "GDN-03": 0, "GDN-04": 0 } },
  { sku: "SPC-0033", name: "Turmeric Powder 200g", unit: "ctn", available: { "GDN-01": 12, "GDN-02": 0, "GDN-03": 0, "GDN-04": 0 } },
  { sku: "PLS-0071", name: "Masoor Dal 25kg", unit: "bag", available: { "GDN-01": 0, "GDN-02": 210, "GDN-03": 0, "GDN-04": 0 } },
  { sku: "BEV-0018", name: "Mineral Water 1L", unit: "ctn", available: { "GDN-01": 0, "GDN-02": 640, "GDN-03": 0, "GDN-04": 0 } },
  { sku: "PKG-0055", name: "Poly Bag Roll 12in", unit: "roll", available: { "GDN-01": 0, "GDN-02": 0, "GDN-03": 22, "GDN-04": 0 } },
  { sku: "OIL-0150", name: "Mustard Oil 5L", unit: "ctn", available: { "GDN-01": 0, "GDN-02": 0, "GDN-03": 0, "GDN-04": 95 } },
  { sku: "SPC-0040", name: "Cumin Seed 100g", unit: "ctn", available: { "GDN-01": 0, "GDN-02": 76, "GDN-03": 0, "GDN-04": 0 } },
];

const STATUS_META = {
  pending: { label: "Pending", color: amber, soft: amberSoft, icon: Clock },
  in_transit: { label: "In transit", color: blue, soft: blueSoft, icon: Truck },
  completed: { label: "Completed", color: green, soft: greenSoft, icon: PackageCheck },
};

const INITIAL_TRANSFERS = [
  { id: "TRF-1042", sku: "RCE-0091", name: "Miniket Rice 50kg", unit: "bag", qty: 60, from: "GDN-01", to: "GDN-03", status: "pending", requestedBy: "Rafiq Islam", requestedOn: "22-07-2026", note: "Bogura counter running low" },
  { id: "TRF-1041", sku: "OIL-0142", name: "Soybean Oil 5L", unit: "ctn", qty: 20, from: "GDN-01", to: "GDN-02", status: "in_transit", requestedBy: "Nasrin Akter", requestedOn: "21-07-2026", note: "" },
  { id: "TRF-1039", sku: "BEV-0018", name: "Mineral Water 1L", unit: "ctn", qty: 150, from: "GDN-02", to: "GDN-04", status: "in_transit", requestedBy: "Shakil Ahmed", requestedOn: "21-07-2026", note: "Feni event stock" },
  { id: "TRF-1035", sku: "SPC-0040", name: "Cumin Seed 100g", unit: "ctn", qty: 30, from: "GDN-02", to: "GDN-01", status: "completed", requestedBy: "Rafiq Islam", requestedOn: "19-07-2026", receivedOn: "20-07-2026", note: "" },
  { id: "TRF-1031", sku: "OIL-0150", name: "Mustard Oil 5L", unit: "ctn", qty: 40, from: "GDN-04", to: "GDN-01", status: "completed", requestedBy: "Nasrin Akter", requestedOn: "17-07-2026", receivedOn: "18-07-2026", note: "" },
  { id: "TRF-1028", sku: "PKG-0055", name: "Poly Bag Roll 12in", unit: "roll", qty: 10, from: "GDN-03", to: "GDN-02", status: "completed", requestedBy: "Shakil Ahmed", requestedOn: "15-07-2026", receivedOn: "16-07-2026", note: "" },
];

function godownName(id) {
  return GODOWNS.find((g) => g.id === id)?.name || id;
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
  const meta = STATUS_META[status];
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

function NewTransferModal({ onClose, onCreate }) {
  const [form, setForm] = React.useState({
    sku: ITEMS[0].sku,
    from: GODOWNS[0].id,
    to: GODOWNS[1].id,
    qty: "",
    note: "",
  });
  const [error, setError] = React.useState("");

  const selectedItem = ITEMS.find((it) => it.sku === form.sku);
  const availableAtSource = selectedItem.available[form.from] || 0;

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleCreate = () => {
    const qtyNum = Number(form.qty);
    if (form.from === form.to) {
      setError("Source ও destination godown ভিন্ন হতে হবে");
      return;
    }
    if (!qtyNum || qtyNum <= 0) {
      setError("সঠিক quantity দিন");
      return;
    }
    if (qtyNum > availableAtSource) {
      setError(`${godownName(form.from)}-এ মাত্র ${availableAtSource} ${selectedItem.unit} আছে`);
      return;
    }
    onCreate({ ...form, qty: qtyNum, sku: form.sku, name: selectedItem.name, unit: selectedItem.unit });
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
              <Repeat size={15} style={{ color: COLORS.vermillion }} />
            </div>
            <h2 className="text-[14.5px] font-bold" style={{ color: COLORS.ink }}>New stock transfer</h2>
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
              {ITEMS.map((it) => (
                <option key={it.sku} value={it.sku}>
                  {it.sku} — {it.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 items-end">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
                From godown
              </label>
              <select
                value={form.from}
                onChange={update("from")}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-[13px] outline-none"
                style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.paper }}
              >
                {GODOWNS.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
                To godown
              </label>
              <select
                value={form.to}
                onChange={update("to")}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-[13px] outline-none"
                style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.paper }}
              >
                {GODOWNS.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-[11.5px] flex items-center gap-1.5" style={{ color: COLORS.muted }}>
            <Warehouse size={12} />
            Available at source: <span style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{availableAtSource} {selectedItem.unit}</span>
          </div>

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
              Note (optional)
            </label>
            <textarea
              value={form.note}
              onChange={update("note")}
              rows={2}
              placeholder="e.g. reason for transfer"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-[13px] outline-none resize-none"
              style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.paper }}
            />
          </div>

          {error && (
            <div className="flex items-start gap-1.5 text-[12px] font-semibold" style={{ color: COLORS.vermillion }}>
              <AlertTriangle size={13} className="mt-[1px] shrink-0" />
              {error}
            </div>
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
            onClick={handleCreate}
            className="rounded-lg px-4 py-2 text-[12.5px] font-semibold text-white"
            style={{ backgroundColor: COLORS.vermillion }}
          >
            Create transfer
          </button>
        </div>
      </div>
    </div>
  );
}

export function StockTransferPage({ onNavigate }) {
  const [transfers, setTransfers] = React.useState(INITIAL_TRANSFERS);
  const [query, setQuery] = React.useState("");
  const [fromFilter, setFromFilter] = React.useState("ALL");
  const [toFilter, setToFilter] = React.useState("ALL");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [showNewModal, setShowNewModal] = React.useState(false);
  const [toast, setToast] = React.useState("");

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleCreate = (form) => {
    const newTransfer = {
      id: `TRF-${1043 + transfers.length}`,
      sku: form.sku,
      name: form.name,
      unit: form.unit,
      qty: form.qty,
      from: form.from,
      to: form.to,
      status: "pending",
      requestedBy: "You",
      requestedOn: "22-07-2026",
      note: form.note,
    };
    setTransfers((prev) => [newTransfer, ...prev]);
    setShowNewModal(false);
    notify(`${newTransfer.id} তৈরি হয়েছে — dispatch-এর অপেক্ষায়`);
  };

  const advanceStatus = (id) => {
    setTransfers((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (t.status === "pending") {
          notify(`${t.id} dispatch হয়েছে`);
          return { ...t, status: "in_transit" };
        }
        if (t.status === "in_transit") {
          notify(`${t.id} ${godownName(t.to)}-এ receive হয়েছে`);
          return { ...t, status: "completed", receivedOn: "22-07-2026" };
        }
        return t;
      })
    );
  };

  const filtered = transfers.filter((t) => {
    const matchesQuery = [t.id, t.sku, t.name].join(" ").toLowerCase().includes(query.toLowerCase());
    const matchesFrom = fromFilter === "ALL" || t.from === fromFilter;
    const matchesTo = toFilter === "ALL" || t.to === toFilter;
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchesQuery && matchesFrom && matchesTo && matchesStatus;
  });

  const pendingCount = transfers.filter((t) => t.status === "pending").length;
  const inTransitCount = transfers.filter((t) => t.status === "in_transit").length;
  const completedToday = transfers.filter((t) => t.status === "completed" && t.receivedOn === "22-07-2026").length;
  const unitsInTransit = transfers
    .filter((t) => t.status === "pending" || t.status === "in_transit")
    .reduce((s, t) => s + t.qty, 0);

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: magentaSoft }}>
            <Repeat size={16} style={{ color: COLORS.magenta }} />
          </div>
          <div>
            <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>
              Stock Transfer
            </h1>
            <p className="text-[12px]" style={{ color: COLORS.muted }}>
              Move stock between godowns and track dispatch to receipt
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
            onClick={() => onNavigate && onNavigate("current-stock-info")}
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold border"
            style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.panel }}
          >
            <Warehouse size={13} />
            View stock
          </button>
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold text-white"
            style={{ backgroundColor: COLORS.vermillion }}
          >
            <Plus size={13} />
            New transfer
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <StatCard icon={Clock} label="Pending" value={pendingCount} sub={pendingCount > 0 ? "Awaiting dispatch" : "All clear"} color={amber} soft={amberSoft} />
        <StatCard icon={Truck} label="In transit" value={inTransitCount} sub="Between godowns" color={blue} soft={blueSoft} />
        <StatCard icon={PackageCheck} label="Completed today" value={completedToday} color={green} soft={greenSoft} />
        <StatCard icon={CircleDot} label="Units in motion" value={unitsInTransit.toLocaleString()} color={COLORS.vermillion} soft={vermillionSoft} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 border flex-1 min-w-[220px]" style={{ borderColor: COLORS.line, backgroundColor: COLORS.panel }}>
          <Search size={14} style={{ color: COLORS.muted }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search transfer ID / SKU / item"
            className="bg-transparent outline-none text-[13px] w-full"
            style={{ color: COLORS.ink }}
          />
        </div>

        <Select value={fromFilter} onChange={setFromFilter} icon={Warehouse} options={[{ id: "ALL", name: "Any source" }, ...GODOWNS]} />
        <Select value={toFilter} onChange={setToFilter} icon={Warehouse} options={[{ id: "ALL", name: "Any destination" }, ...GODOWNS]} />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          icon={Filter}
          options={[
            { id: "ALL", name: "All statuses" },
            { id: "pending", name: "Pending" },
            { id: "in_transit", name: "In transit" },
            { id: "completed", name: "Completed" },
          ]}
        />
      </div>

      {/* Transfers table */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr>
                {["Transfer ID", "Item", "Route", "Qty", "Requested", "Status", "Action"].map((label) => (
                  <th key={label} className="text-left px-5 py-3 text-white" style={{ backgroundColor: COLORS.vermillion }}>
                    <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b hover:bg-black/[0.02] transition-colors" style={{ borderColor: COLORS.line }}>
                  <td className="px-5 py-3.5 font-semibold whitespace-nowrap" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                    {t.id}
                  </td>
                  <td className="px-5 py-3.5" style={{ color: COLORS.ink }}>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-[11px]" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>{t.sku}</div>
                  </td>
                  <td className="px-5 py-3.5" style={{ color: COLORS.ink }}>
                    <div className="flex items-center gap-1.5 text-[12.5px] whitespace-nowrap">
                      <span>{godownName(t.from)}</span>
                      <ArrowRight size={12} style={{ color: COLORS.muted }} />
                      <span>{godownName(t.to)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                    {t.qty.toLocaleString()} <span className="font-normal text-[11px]" style={{ color: COLORS.muted }}>{t.unit}</span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: COLORS.muted, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                    <div>{t.requestedOn}</div>
                    <div className="text-[11px]" style={{ fontFamily: FONTS.BODY }}>{t.requestedBy}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusPill status={t.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    {t.status !== "completed" ? (
                      <button
                        onClick={() => advanceStatus(t.id)}
                        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold border whitespace-nowrap"
                        style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.paper }}
                      >
                        {t.status === "pending" ? "Dispatch" : "Receive"}
                        <ChevronRight size={12} />
                      </button>
                    ) : (
                      <span className="text-[11.5px]" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>{t.receivedOn}</span>
                    )}
                  </td>
                </tr>
              ))}
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

      {/* New transfer modal */}
      {showNewModal && (
        <NewTransferModal onClose={() => setShowNewModal(false)} onCreate={handleCreate} />
      )}
    </div>
  );
}

export default StockTransferPage;