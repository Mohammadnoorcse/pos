import React from "react";
import { Search, ChevronLeft, ChevronRight, Undo2, Plus, X, Printer, Calendar, Hash, Phone, MapPin, ReceiptText, User, Building2, PackageX } from "lucide-react";
import { COLORS, FONTS } from "../../constants";

// Same design tokens used across PurchasePage.jsx / SupplierPaymentPage.jsx / SupplierInvoicesPage.jsx
const magentaSoft = COLORS.magentaSoft || `${COLORS.magenta}1A`;
const vermillionSoft = `${COLORS.vermillionSoft || COLORS.vermillion + "1A"}`;

const SUPPLIERS = [
  { id: 1, name: "Matador", company: "Matador BD", phone: "01784848944", address: "Mirpur-10, Dhaka" },
  { id: 2, name: "Siraj", company: "Siraj Enterprise", phone: "01717777744", address: "Chawkbazar, Chattogram" },
  { id: 3, name: "Sohag Ahmed", company: "Cock", phone: "01766554433", address: "Bogura Sadar, Bogura" },
  { id: 4, name: "nazrul", company: "Allahr Dan 4", phone: "01655221199", address: "Feni Sadar, Feni" },
];

// Purchased products available to return, keyed by supplier id (mock stock/purchase lines)
const SUPPLIER_PRODUCTS = {
  1: [
    { id: "P-1001", name: "Napa 500mg (Box)", invRef: "STB/230710646/98", unitPrice: 120, purchasedQty: 40 },
    { id: "P-1002", name: "Seclo 20mg (Box)", invRef: "STB/230710646/98", unitPrice: 210, purchasedQty: 20 },
  ],
  2: [
    { id: "P-1003", name: "7up Can (24pcs)", invRef: "STB/230710646/97", unitPrice: 850, purchasedQty: 15 },
  ],
  3: [
    { id: "P-1004", name: "Cock Detergent 1kg", invRef: "STB/230710646/93", unitPrice: 180, purchasedQty: 30 },
  ],
  4: [
    { id: "P-1005", name: "Allahr Dan Chanachur 200g", invRef: "STB/230710646/94", unitPrice: 40, purchasedQty: 100 },
  ],
};

const REASONS = ["Damaged", "Expired", "Wrong item", "Excess stock", "Quality issue"];

const INITIAL_RETURNS = [
  {
    id: "RTN-3041",
    date: "19-04-2025",
    supplier: "Matador",
    company: "Matador BD",
    phone: "01784848944",
    address: "Mirpur-10, Dhaka",
    invRef: "STB/230710646/98",
    reason: "Damaged",
    note: "Box crushed during transport",
    items: [{ name: "Napa 500mg (Box)", qty: 5, unitPrice: 120 }],
    initiatedBy: "Store Manager",
  },
  {
    id: "RTN-3037",
    date: "13-04-2025",
    supplier: "kudus",
    company: "7up",
    phone: "01789654131",
    address: "Motijheel, Dhaka",
    invRef: "STB/230710646/97",
    reason: "Excess stock",
    note: "",
    items: [{ name: "7up Can (24pcs)", qty: 3, unitPrice: 850 }],
    initiatedBy: "Karim Uddin (Accounts)",
  },
  {
    id: "RTN-3029",
    date: "04-04-2025",
    supplier: "Sohag Ahmed",
    company: "Cock",
    phone: "01766554433",
    address: "Bogura Sadar, Bogura",
    invRef: "STB/230710646/93",
    reason: "Expired",
    note: "Batch near expiry, returned before sale",
    items: [{ name: "Cock Detergent 1kg", qty: 8, unitPrice: 180 }],
    initiatedBy: "Store Manager",
  },
];

function lineTotal(items) {
  return items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
}

function DetailRow({ icon: Icon, label, value, valueColor }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.paper }}>
        <Icon size={14} style={{ color: COLORS.muted }} />
      </div>
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
          {label}
        </div>
        <div className="text-[14px] font-semibold mt-0.5" style={{ color: valueColor || COLORS.ink }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function ReturnDetailModal({ row, onClose }) {
  if (!row) return null;
  const total = lineTotal(row.items);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(36,34,32,0.45)" }}
      onClick={onClose}
    >
      <div
        id="return-detail-print"
        className="w-full max-w-2xl rounded-2xl border overflow-hidden shadow-xl max-h-[90vh] flex flex-col"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b print:hidden shrink-0" style={{ borderColor: COLORS.line }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: vermillionSoft }}>
              <Undo2 size={16} style={{ color: COLORS.vermillion }} />
            </div>
            <h2 className="text-[16px] font-bold" style={{ color: COLORS.ink }}>
              Return details
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-black/5" style={{ color: COLORS.muted }}>
            <X size={16} />
          </button>
        </div>

        {/* Scrollable printable content */}
        <div className="px-6 py-5 overflow-y-auto">
          {/* Title block */}
          <div className="flex items-start justify-between pb-4 mb-4 border-b" style={{ borderColor: COLORS.line }}>
            <div>
              <div className="text-[20px] font-bold" style={{ color: COLORS.ink }}>{row.supplier}</div>
              <div className="text-[12.5px] mt-0.5" style={{ color: COLORS.muted }}>{row.company}</div>
              <div className="text-[12px] mt-1.5" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>{row.id}</div>
            </div>
            <div className="text-right">
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{ backgroundColor: "#FFF4E0", color: "#B8790A" }}
              >
                {row.reason}
              </span>
              <div className="text-[11px] mt-1.5" style={{ color: COLORS.muted }}>{row.date}</div>
            </div>
          </div>

          {/* Supplier contact */}
          <div className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: COLORS.muted }}>
            Supplier information
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 divide-y sm:divide-y-0" style={{ borderColor: COLORS.line }}>
            <DetailRow icon={Phone} label="Phone" value={row.phone} />
            <DetailRow icon={MapPin} label="Address" value={row.address} />
            <DetailRow icon={Building2} label="Company" value={row.company} />
            <DetailRow icon={Hash} label="Return id" value={row.id} valueColor={COLORS.vermillion} />
          </div>

          {/* Invoice reference */}
          <div className="text-[11px] font-semibold uppercase tracking-wide mt-4 mb-1" style={{ color: COLORS.muted }}>
            Against invoice
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: COLORS.paper }}>
            <div className="flex items-center gap-2">
              <ReceiptText size={14} style={{ color: COLORS.muted }} />
              <span className="text-[13px] font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{row.invRef}</span>
            </div>

            <div className="mt-3 divide-y" style={{ borderColor: COLORS.line }}>
              {row.items.map((it, i) => (
                <div key={i} className="flex items-center justify-between py-2 text-[13px]">
                  <div style={{ color: COLORS.ink }}>{it.name}</div>
                  <div className="flex items-center gap-4" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>
                    <span>{it.qty} × {it.unitPrice.toLocaleString()}</span>
                    <span className="font-bold" style={{ color: COLORS.ink }}>{(it.qty * it.unitPrice).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Return meta */}
          <div className="text-[11px] font-semibold uppercase tracking-wide mt-4 mb-1" style={{ color: COLORS.muted }}>
            Return record
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 divide-y sm:divide-y-0" style={{ borderColor: COLORS.line }}>
            <DetailRow icon={Calendar} label="Return date" value={row.date} />
            <DetailRow icon={PackageX} label="Reason" value={row.reason} />
            <DetailRow icon={User} label="Initiated by" value={row.initiatedBy} />
          </div>
          {row.note && (
            <div className="mt-3 rounded-lg px-3.5 py-2.5 text-[12.5px]" style={{ backgroundColor: COLORS.paper, color: COLORS.ink }}>
              <span className="font-semibold" style={{ color: COLORS.muted }}>Note: </span>
              {row.note}
            </div>
          )}

          {/* Total value — headline */}
          <div className="rounded-xl p-4 mt-4" style={{ backgroundColor: vermillionSoft }}>
            <div className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.ink }}>
              Total value returned
            </div>
            <div className="text-[26px] font-bold mt-0.5" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>
              {total.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t print:hidden shrink-0" style={{ borderColor: COLORS.line }}>
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-[13px] font-semibold border" style={{ borderColor: COLORS.line, color: COLORS.ink }}>
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold text-white"
            style={{ backgroundColor: COLORS.vermillion }}
          >
            <Printer size={14} />
            Print
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #return-detail-print, #return-detail-print * { visibility: visible; }
          #return-detail-print { position: fixed; inset: 0; margin: auto; box-shadow: none; max-height: none; }
        }
      `}</style>
    </div>
  );
}

function AddReturnModal({ open, onClose, onSave }) {
  const [supplierId, setSupplierId] = React.useState("");
  const [reason, setReason] = React.useState(REASONS[0]);
  const [date, setDate] = React.useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = React.useState("");
  // selections keyed by productId -> { checked, qty }
  const [selections, setSelections] = React.useState({});

  if (!open) return null;

  const supplier = SUPPLIERS.find((s) => String(s.id) === supplierId);
  const products = supplierId ? SUPPLIER_PRODUCTS[supplierId] || [] : [];

  const toggleProduct = (product) => {
    setSelections((prev) => {
      const existing = prev[product.id];
      if (existing?.checked) {
        const next = { ...prev };
        delete next[product.id];
        return next;
      }
      return { ...prev, [product.id]: { checked: true, qty: 1 } };
    });
  };

  const updateQty = (productId, qty) => {
    setSelections((prev) => ({ ...prev, [productId]: { ...prev[productId], qty } }));
  };

  const resolvedItems = Object.entries(selections)
    .map(([productId, sel]) => {
      const p = products.find((p) => p.id === productId);
      if (!p || !sel.checked) return null;
      return { name: p.name, qty: Number(sel.qty) || 0, unitPrice: p.unitPrice, purchasedQty: p.purchasedQty };
    })
    .filter((it) => it && it.qty > 0);

  const total = lineTotal(resolvedItems);
  const invRef = products[0]?.invRef || "—";

  const handleSave = () => {
    if (!supplier || resolvedItems.length === 0) return;
    onSave({
      id: `RTN-${Math.floor(3000 + Math.random() * 900)}`,
      date: date.split("-").reverse().join("-"),
      supplier: supplier.name,
      company: supplier.company,
      phone: supplier.phone,
      address: supplier.address,
      invRef,
      reason,
      note,
      items: resolvedItems.map(({ name, qty, unitPrice }) => ({ name, qty, unitPrice })),
      initiatedBy: "You",
    });
    setSupplierId("");
    setSelections({});
    setNote("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(36,34,32,0.45)" }} onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl border overflow-hidden shadow-xl max-h-[90vh] flex flex-col"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: COLORS.line }}>
          <h2 className="text-[16px] font-bold" style={{ color: COLORS.ink }}>
            Return product to supplier
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-black/5" style={{ color: COLORS.muted }}>
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-3.5 overflow-y-auto">
          <div>
            <label className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
              Supplier
            </label>
            <select
              value={supplierId}
              onChange={(e) => {
                setSupplierId(e.target.value);
                setSelections({});
              }}
              className="w-full mt-1 rounded-lg px-3 py-2.5 border text-[13px] outline-none"
              style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.paper }}
            >
              <option value="">Select supplier</option>
              {SUPPLIERS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.company})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
                Return date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mt-1 rounded-lg px-3 py-2.5 border text-[13px] outline-none"
                style={{ borderColor: COLORS.line, color: COLORS.ink }}
              />
            </div>
            <div>
              <label className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
                Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full mt-1 rounded-lg px-3 py-2.5 border text-[13px] outline-none"
                style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.paper }}
              >
                {REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Product checklist */}
          <div>
            <label className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
              Products to return
            </label>

            {!supplierId && (
              <div className="mt-2 rounded-lg px-3 py-2.5 text-[12.5px]" style={{ backgroundColor: COLORS.paper, color: COLORS.muted }}>
                Select a supplier to see their purchased products.
              </div>
            )}

            {supplierId && products.length === 0 && (
              <div className="mt-2 rounded-lg px-3 py-2.5 text-[12.5px]" style={{ backgroundColor: COLORS.paper, color: COLORS.muted }}>
                No purchased products found for this supplier.
              </div>
            )}

            <div className="space-y-2 mt-2">
              {products.map((p) => {
                const sel = selections[p.id];
                const checked = !!sel?.checked;
                const qty = sel?.qty ?? 1;
                const overLimit = checked && Number(qty) > p.purchasedQty;
                return (
                  <div
                    key={p.id}
                    className="rounded-lg border p-2.5"
                    style={{
                      borderColor: checked ? COLORS.vermillion : COLORS.line,
                      backgroundColor: checked ? vermillionSoft : COLORS.paper,
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleProduct(p)}
                        className="w-4 h-4 shrink-0 accent-current"
                        style={{ color: COLORS.vermillion }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold truncate" style={{ color: COLORS.ink }}>{p.name}</div>
                        <div className="text-[11px]" style={{ color: COLORS.muted }}>
                          Purchased {p.purchasedQty} · Unit {p.unitPrice.toLocaleString()}
                        </div>
                      </div>

                      {checked && (
                        <>
                          <input
                            type="number"
                            min={1}
                            max={p.purchasedQty}
                            value={qty}
                            onChange={(e) => updateQty(p.id, e.target.value)}
                            className="w-16 rounded-md px-2 py-1.5 border text-[12.5px] outline-none text-right"
                            style={{
                              borderColor: overLimit ? COLORS.vermillion : COLORS.line,
                              color: COLORS.ink,
                              fontFamily: FONTS.MONO,
                              backgroundColor: COLORS.panel,
                            }}
                          />
                          <span className="text-[12px] w-20 text-right font-bold shrink-0" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>
                            {((Number(qty) || 0) * p.unitPrice).toLocaleString()}
                          </span>
                        </>
                      )}
                    </div>
                    {overLimit && (
                      <div className="text-[11px] mt-1.5 pl-6.5 ml-6" style={{ color: COLORS.vermillion }}>
                        Only {p.purchasedQty} were purchased.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {resolvedItems.length > 0 && (
              <div className="flex items-center justify-between rounded-lg px-3.5 py-2.5 mt-2" style={{ backgroundColor: vermillionSoft }}>
                <span className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: COLORS.ink }}>Total value</span>
                <span className="text-[15px] font-bold" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>{total.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
              Note (optional)
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Condition of goods, agreed resolution"
              className="w-full mt-1 rounded-lg px-3 py-2.5 border text-[13px] outline-none"
              style={{ borderColor: COLORS.line, color: COLORS.ink }}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t shrink-0" style={{ borderColor: COLORS.line }}>
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-[13px] font-semibold border" style={{ borderColor: COLORS.line, color: COLORS.ink }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!supplier || resolvedItems.length === 0}
            className="rounded-lg px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-40"
            style={{ backgroundColor: COLORS.vermillion }}
          >
            Save return
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductReturnPage() {
  const [returns, setReturns] = React.useState(INITIAL_RETURNS);
  const [query, setQuery] = React.useState("");
  const [perPage, setPerPage] = React.useState(100);
  const [selected, setSelected] = React.useState(null);
  const [addOpen, setAddOpen] = React.useState(false);

  const filtered = returns.filter((r) =>
    [r.supplier, r.company, r.id, r.invRef, r.reason].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  const totalValue = filtered.reduce((sum, r) => sum + lineTotal(r.items), 0);
  const totalUnits = filtered.reduce((sum, r) => sum + r.items.reduce((s, it) => s + it.qty, 0), 0);

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="rounded-2xl border p-4" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
          <div className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
            Total returns
          </div>
          <div className="text-[22px] font-bold mt-1" style={{ color: COLORS.ink }}>
            {filtered.length}
          </div>
        </div>
        <div className="rounded-2xl border p-4" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
          <div className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
            Units returned
          </div>
          <div className="text-[22px] font-bold mt-1" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
            {totalUnits}
          </div>
        </div>
        <div className="rounded-2xl border p-4" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
          <div className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
            Total value returned
          </div>
          <div className="text-[22px] font-bold mt-1" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>
            {totalValue.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
        {/* Header */}
        <div className="flex flex-col gap-4 px-6 py-5 border-b" style={{ borderColor: COLORS.line }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: vermillionSoft }}>
                <Undo2 size={16} style={{ color: COLORS.vermillion }} />
              </div>
              <div>
                <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>
                  Product Return
                </h1>
                <p className="text-[12px]" style={{ color: COLORS.muted }}>
                  Return products back to suppliers and track history
                </p>
              </div>
            </div>

            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold text-white self-start sm:self-auto"
              style={{ backgroundColor: COLORS.vermillion }}
            >
              <Plus size={14} />
              Add return
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-[13px]" style={{ color: COLORS.muted }}>
              <span>Show</span>
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="rounded-md px-2 py-1.5 border text-[13px] outline-none"
                style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.paper }}
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span>entries</span>
            </div>

            <div className="flex items-center gap-2 rounded-lg px-3 py-2 border flex-1 min-w-[200px]" style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper }}>
              <Search size={14} style={{ color: COLORS.muted }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search supplier / return id / reason"
                className="bg-transparent outline-none text-[13px] w-full"
                style={{ color: COLORS.ink }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr>
                {["Date", "Return id", "Supplier", "Against invoice", "Reason", "Items", "Value"].map((h) => (
                  <th key={h} className="text-left font-semibold text-[11px] uppercase tracking-wide px-5 py-3 text-white" style={{ backgroundColor: COLORS.vermillion }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, perPage).map((row) => {
                const value = lineTotal(row.items);
                const units = row.items.reduce((s, it) => s + it.qty, 0);
                return (
                  <tr key={row.id} onClick={() => setSelected(row)} className="border-b hover:bg-black/[0.02] transition-colors cursor-pointer" style={{ borderColor: COLORS.line }}>
                    <td className="px-5 py-3.5 align-top whitespace-nowrap" style={{ color: COLORS.ink, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                      {row.date}
                    </td>
                    <td className="px-5 py-3.5 align-top font-semibold" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                      {row.id}
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <div className="font-semibold hover:underline" style={{ color: COLORS.ink }}>{row.supplier}</div>
                      <div className="text-[11.5px] mt-0.5" style={{ color: COLORS.muted }}>{row.company}</div>
                    </td>
                    <td className="px-5 py-3.5 align-top" style={{ color: COLORS.ink, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                      {row.invRef}
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ backgroundColor: "#FFF4E0", color: "#B8790A" }}>
                        {row.reason}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 align-top" style={{ color: COLORS.ink, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                      {units}
                    </td>
                    <td className="px-5 py-3.5 align-top font-bold" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>
                      {value.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[13px]" style={{ color: COLORS.muted }}>
                    No returns found.
                  </td>
                </tr>
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr style={{ backgroundColor: vermillionSoft }}>
                  <td colSpan={5} className="px-5 py-3 font-bold text-[12px] uppercase tracking-wide" style={{ color: COLORS.ink }}>Total</td>
                  <td className="px-5 py-3 font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{totalUnits}</td>
                  <td className="px-5 py-3 font-bold" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>{totalValue.toLocaleString()}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Footer / pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t text-[13px]" style={{ borderColor: COLORS.line, color: COLORS.muted }}>
          <span>Showing 1 to {Math.min(perPage, filtered.length)} of {filtered.length} entries</span>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded-md border flex items-center justify-center disabled:opacity-40" style={{ borderColor: COLORS.line, color: COLORS.muted }} disabled>
              <ChevronLeft size={14} />
            </button>
            <span className="w-8 h-8 rounded-md flex items-center justify-center font-semibold text-white" style={{ backgroundColor: COLORS.vermillion }}>1</span>
            <button className="w-8 h-8 rounded-md border flex items-center justify-center" style={{ borderColor: COLORS.line, color: COLORS.ink }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <ReturnDetailModal row={selected} onClose={() => setSelected(null)} />
      <AddReturnModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(ret) => {
          setReturns((prev) => [ret, ...prev]);
          setAddOpen(false);
        }}
      />
    </div>
  );
}

export default ProductReturnPage;