import React, { useState, useEffect, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, Undo2, Plus, X, Printer, Calendar, Hash, Phone, MapPin, ReceiptText, User, Building2, PackageX, Loader2, Trash2 } from "lucide-react";
import { COLORS, FONTS } from "../../constants";
import {
  fetchPurchaseReturns,
  createPurchaseReturn,
  deletePurchaseReturn,
} from "../../api/supplier/purchaseReturnService";
import { fetchSuppliers } from "../../api/supplier/supplierPaymentService";
import { fetchPurchases } from "../../api/supplier/purchaseService";

// Same design tokens used across PurchasePage.jsx / SupplierPaymentPage.jsx / SupplierInvoicesPage.jsx
const magentaSoft = COLORS.magentaSoft || `${COLORS.magenta}1A`;
const vermillionSoft = `${COLORS.vermillionSoft || COLORS.vermillion + "1A"}`;

const REASONS = ["Damaged", "Expired", "Wrong item", "Excess stock", "Quality issue"];

function lineTotal(items) {
  return items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
}

// API থেকে আসা raw return রেকর্ডকে UI-এর জন্য সহজবোধ্য shape-এ ম্যাপ করা
function mapReturn(r) {
  return {
    id: r.return_no || `RTN-${r.id}`,
    rawId: r.id,
    purchaseId: r.purchase_id,
    date: r.return_date,
    supplier: r.supplier?.name || "—",
    company: r.supplier?.company || "—",
    phone: r.supplier?.phone || "—",
    address: r.supplier?.address || "—",
    invRef: r.purchase?.invoice_no || "—",
    invTotal: Number(r.purchase?.total ?? 0),
    invDue: Number(r.purchase?.due ?? 0),
    invReceivable: Number(r.purchase?.receivable ?? 0),
    reason: r.reason || "—",
    note: r.reason && r.reason.length > 40 ? "" : "",
    items: (r.items || []).map((it) => ({ name: it.name, qty: it.qty, unitPrice: Number(it.price) })),
    initiatedBy: r.creator?.name || "—",
  };
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

function ReturnDetailModal({ row, onClose, onDelete, deleting }) {
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ReceiptText size={14} style={{ color: COLORS.muted }} />
                <span className="text-[13px] font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{row.invRef}</span>
              </div>
              {row.invReceivable > 0 ? (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#E9F0FF", color: "#2A5CCB" }}>
                  Receivable {row.invReceivable.toLocaleString()}
                </span>
              ) : (
                <span
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={row.invDue <= 0 ? { backgroundColor: "#E9F7EE", color: "#1E8A4C" } : { backgroundColor: "#FFF4E0", color: "#B8790A" }}
                >
                  {row.invDue <= 0 ? "Fully settled" : `Remaining due ${row.invDue.toLocaleString()}`}
                </span>
              )}
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
          <button
            onClick={() => onDelete(row)}
            disabled={deleting}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold border disabled:opacity-40"
            style={{ borderColor: COLORS.vermillion, color: COLORS.vermillion }}
          >
            {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Delete
          </button>
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

function AddReturnModal({ open, onClose, onSave, suppliers, saving }) {
  const [supplierId, setSupplierId] = React.useState("");
  const [reason, setReason] = React.useState(REASONS[0]);
  const [date, setDate] = React.useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = React.useState("");
  const [formError, setFormError] = React.useState(null);

  // সাপ্লায়ারের ইনভয়েসগুলো (রিটার্ন করার জন্য যে-কোনো ইনভয়েস বাছাই করা যায়)
  const [invoices, setInvoices] = React.useState([]);
  const [invoicesLoading, setInvoicesLoading] = React.useState(false);
  const [purchaseId, setPurchaseId] = React.useState("");

  // selections keyed by purchase_item_id -> { checked, qty }
  const [selections, setSelections] = React.useState({});

  const supplier = suppliers.find((s) => String(s.id) === supplierId);
  const selectedPurchase = invoices.find((inv) => String(inv.id) === purchaseId);
  const products = selectedPurchase?.items || [];

  // সাপ্লায়ার বদলালে তার ইনভয়েস লিস্ট লোড করা
  useEffect(() => {
    setPurchaseId("");
    setInvoices([]);
    setSelections({});
    if (!supplierId) return;

    let cancelled = false;
    (async () => {
      try {
        setInvoicesLoading(true);
        const data = await fetchPurchases({ supplier_id: supplierId, per_page: 100 });
        if (!cancelled) setInvoices(data.data || []);
      } catch (err) {
        console.error("Error loading supplier invoices:", err);
      } finally {
        if (!cancelled) setInvoicesLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [supplierId]);

  if (!open) return null;

  const toggleProduct = (item) => {
    setSelections((prev) => {
      const existing = prev[item.id];
      if (existing?.checked) {
        const next = { ...prev };
        delete next[item.id];
        return next;
      }
      return { ...prev, [item.id]: { checked: true, qty: 1 } };
    });
  };

  const updateQty = (itemId, qty) => {
    setSelections((prev) => ({ ...prev, [itemId]: { ...prev[itemId], qty } }));
  };

  const resolvedItems = Object.entries(selections)
    .map(([itemId, sel]) => {
      const p = products.find((p) => String(p.id) === itemId);
      if (!p || !sel.checked) return null;
      return {
        purchase_item_id: p.id,
        product_id: p.product_id ?? null,
        name: p.name,
        qty: Number(sel.qty) || 0,
        price: Number(p.price),
        purchasedQty: p.qty,
      };
    })
    .filter((it) => it && it.qty > 0);

  const total = lineTotal(resolvedItems.map((it) => ({ qty: it.qty, unitPrice: it.price })));

  const handleSave = async () => {
    if (!supplier || !purchaseId || resolvedItems.length === 0) return;
    setFormError(null);
    try {
      await onSave({
        purchase_id: Number(purchaseId),
        reason,
        return_date: date,
        items: resolvedItems.map(({ purchase_item_id, product_id, name, qty, price }) => ({
          purchase_item_id,
          product_id,
          name,
          qty,
          price,
        })),
      });
      setSupplierId("");
      setPurchaseId("");
      setInvoices([]);
      setSelections({});
      setNote("");
    } catch (err) {
      setFormError(err.message || "রিটার্ন সেভ করতে সমস্যা হয়েছে।");
    }
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
          {formError && (
            <div className="rounded-lg px-3 py-2 text-[12.5px]" style={{ backgroundColor: vermillionSoft, color: COLORS.vermillion }}>
              {formError}
            </div>
          )}

          <div>
            <label className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
              Supplier
            </label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full mt-1 rounded-lg px-3 py-2.5 border text-[13px] outline-none"
              style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.paper }}
            >
              <option value="">Select supplier</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.company})
                </option>
              ))}
            </select>
          </div>

          {/* Invoice picker — appears once a supplier is chosen */}
          {supplierId && (
            <div>
              <label className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
                Against invoice
              </label>
              {invoicesLoading ? (
                <div className="flex items-center gap-2 mt-1.5 text-[12.5px]" style={{ color: COLORS.muted }}>
                  <Loader2 size={13} className="animate-spin" />
                  Loading invoices...
                </div>
              ) : (
                <>
                  <select
                    value={purchaseId}
                    onChange={(e) => {
                      setPurchaseId(e.target.value);
                      setSelections({});
                    }}
                    className="w-full mt-1 rounded-lg px-3 py-2.5 border text-[13px] outline-none"
                    style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.paper }}
                  >
                    <option value="">Select invoice</option>
                    {invoices.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.invoice_no} — total {Number(inv.total).toLocaleString()}
                      </option>
                    ))}
                  </select>
                  {invoices.length === 0 && (
                    <div className="text-[11.5px] mt-1" style={{ color: COLORS.muted }}>
                      No purchase invoices found for this supplier.
                    </div>
                  )}
                </>
              )}
            </div>
          )}

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
                Select a supplier to see their invoices.
              </div>
            )}

            {supplierId && !purchaseId && !invoicesLoading && (
              <div className="mt-2 rounded-lg px-3 py-2.5 text-[12.5px]" style={{ backgroundColor: COLORS.paper, color: COLORS.muted }}>
                Select an invoice to see its purchased items.
              </div>
            )}

            {purchaseId && products.length === 0 && (
              <div className="mt-2 rounded-lg px-3 py-2.5 text-[12.5px]" style={{ backgroundColor: COLORS.paper, color: COLORS.muted }}>
                No items found on this invoice.
              </div>
            )}

            <div className="space-y-2 mt-2">
              {products.map((p) => {
                const sel = selections[p.id];
                const checked = !!sel?.checked;
                const qty = sel?.qty ?? 1;
                const overLimit = checked && Number(qty) > p.qty;
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
                          Purchased {p.qty} · Unit {Number(p.price).toLocaleString()}
                        </div>
                      </div>

                      {checked && (
                        <>
                          <input
                            type="number"
                            min={1}
                            max={p.qty}
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
                            {((Number(qty) || 0) * Number(p.price)).toLocaleString()}
                          </span>
                        </>
                      )}
                    </div>
                    {overLimit && (
                      <div className="text-[11px] mt-1.5 pl-6.5 ml-6" style={{ color: COLORS.vermillion }}>
                        Only {p.qty} were purchased.
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
            disabled={!supplier || !purchaseId || resolvedItems.length === 0 || saving}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-40"
            style={{ backgroundColor: COLORS.vermillion }}
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Save return
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductReturnPage() {
  const [returns, setReturns] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [perPage, setPerPage] = useState(100);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [selected, setSelected] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // রিটার্ন লিস্ট লোড করা
  const loadReturns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPurchaseReturns({
        search: query || undefined,
        per_page: perPage,
        page,
      });
      const rows = (data.data || []).map(mapReturn);
      setReturns(rows);
      setTotalCount(data.total ?? rows.length);
      setLastPage(data.last_page ?? 1);
    } catch (err) {
      console.error("Error loading purchase returns:", err);
      setError("রিটার্ন লিস্ট লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }, [query, perPage, page]);

  useEffect(() => {
    loadReturns();
  }, [loadReturns]);

  // সাপ্লায়ার লিস্ট (Add return মডালের জন্য) — একবারই লোড হয়
  const loadSuppliers = useCallback(async () => {
    try {
      const data = await fetchSuppliers();
      setSuppliers(data.data || data || []);
    } catch (err) {
      console.error("Error loading suppliers:", err);
    }
  }, []);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  // সার্চ পরিবর্তন হলে প্রথম পেজে ফিরিয়ে আনা
  useEffect(() => {
    setPage(1);
  }, [query, perPage]);

  const totalValue = returns.reduce((sum, r) => sum + lineTotal(r.items), 0);
  const totalUnits = returns.reduce((sum, r) => sum + r.items.reduce((s, it) => s + it.qty, 0), 0);

  // নতুন রিটার্ন সেভ করা
  const handleSaveReturn = async (payload) => {
    setSaving(true);
    try {
      await createPurchaseReturn(payload);
      setAddOpen(false);
      setPage(1);
      // রিটার্ন এবং সাপ্লায়ার (due/receivable আপডেট হওয়ার কারণে) — দুটোই রিফ্রেশ করা
      await Promise.all([loadReturns(), loadSuppliers()]);
    } finally {
      setSaving(false);
    }
  };

  // রিটার্ন ডিলিট করা
  const handleDeleteReturn = async (row) => {
    if (!window.confirm(`${row.id} রিটার্নটি ডিলিট করবেন?`)) return;
    setDeleting(true);
    try {
      await deletePurchaseReturn(row.rawId);
      setSelected(null);
      await Promise.all([loadReturns(), loadSuppliers()]);
    } catch (err) {
      console.error("Error deleting return:", err);
      alert("রিটার্ন ডিলিট করতে সমস্যা হয়েছে।");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="rounded-2xl border p-4" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
          <div className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
            Total returns
          </div>
          <div className="text-[22px] font-bold mt-1" style={{ color: COLORS.ink }}>
            {totalCount}
          </div>
        </div>
        <div className="rounded-2xl border p-4" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
          <div className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
            Units returned (this page)
          </div>
          <div className="text-[22px] font-bold mt-1" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
            {totalUnits}
          </div>
        </div>
        <div className="rounded-2xl border p-4" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
          <div className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
            Total value returned (this page)
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
                placeholder="Search supplier / return id"
                className="bg-transparent outline-none text-[13px] w-full"
                style={{ color: COLORS.ink }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-14 gap-2" style={{ color: COLORS.muted }}>
              <Loader2 className="animate-spin" size={20} />
              <span>ডাটা লোড হচ্ছে...</span>
            </div>
          ) : error ? (
            <div className="text-center py-10" style={{ color: COLORS.vermillion }}>{error}</div>
          ) : (
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
                {returns.map((row) => {
                  const value = lineTotal(row.items);
                  const units = row.items.reduce((s, it) => s + it.qty, 0);
                  return (
                    <tr key={row.rawId} onClick={() => setSelected(row)} className="border-b hover:bg-black/[0.02] transition-colors cursor-pointer" style={{ borderColor: COLORS.line }}>
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
                {returns.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-[13px]" style={{ color: COLORS.muted }}>
                      No returns found.
                    </td>
                  </tr>
                )}
              </tbody>
              {returns.length > 0 && (
                <tfoot>
                  <tr style={{ backgroundColor: vermillionSoft }}>
                    <td colSpan={5} className="px-5 py-3 font-bold text-[12px] uppercase tracking-wide" style={{ color: COLORS.ink }}>Total (this page)</td>
                    <td className="px-5 py-3 font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{totalUnits}</td>
                    <td className="px-5 py-3 font-bold" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>{totalValue.toLocaleString()}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          )}
        </div>

        {/* Footer / pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t text-[13px]" style={{ borderColor: COLORS.line, color: COLORS.muted }}>
          <span>
            Showing page {page} of {lastPage} — {totalCount} entries total
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="w-8 h-8 rounded-md border flex items-center justify-center disabled:opacity-40"
              style={{ borderColor: COLORS.line, color: COLORS.muted }}
            >
              <ChevronLeft size={14} />
            </button>
            <span className="w-8 h-8 rounded-md flex items-center justify-center font-semibold text-white" style={{ backgroundColor: COLORS.vermillion }}>
              {page}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
              disabled={page >= lastPage}
              className="w-8 h-8 rounded-md border flex items-center justify-center disabled:opacity-40"
              style={{ borderColor: COLORS.line, color: COLORS.ink }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <ReturnDetailModal row={selected} onClose={() => setSelected(null)} onDelete={handleDeleteReturn} deleting={deleting} />
      <AddReturnModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleSaveReturn}
        suppliers={suppliers}
        saving={saving}
      />
    </div>
  );
}

export default ProductReturnPage;