import React, { useState, useEffect, useCallback } from "react";
import { Search, Plus, X, CheckCircle2, Printer, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { COLORS, FONTS } from "../../constants";
import { fetchPurchases, createPurchase } from "../../api/supplier/purchaseService";
import { fetchSuppliers } from "../../api/supplier/supplierPaymentService";

// API সাপ্লায়ার রেকর্ডকে dropdown-এর জন্য { id, label } shape-এ ম্যাপ করা
function mapSupplierOption(s) {
  return { id: s.id, label: s.company ? `${s.name}(${s.company})` : s.name };
}

// API purchase রেকর্ডকে লিস্টের জন্য সহজবোধ্য shape-এ ম্যাপ করা
function mapPurchase(p) {
  return {
    id: p.id,
    invoiceNo: p.invoice_no,
    date: p.purchase_date,
    supplierLabel: p.supplier ? (p.supplier.company ? `${p.supplier.name}(${p.supplier.company})` : p.supplier.name) : "—",
    items: (p.items || []).map((it) => ({ id: it.id, name: it.name, qty: it.qty, price: Number(it.price) })),
    total: Number(p.total ?? 0),
    paid: Number(p.paid ?? 0),
    due: Number(p.due ?? 0),
    status: p.status,
  };
}

/* ---------------- Add Purchase Modal ---------------- */
function AddPurchaseModal({ suppliers, onSave, onCancel, saving }) {
  const [supplierId, setSupplierId] = React.useState("");
  const [supplierOpen, setSupplierOpen] = React.useState(false);
  const [supplierQuery, setSupplierQuery] = React.useState("");

  const [purchaseDate, setPurchaseDate] = React.useState(() => new Date().toISOString().slice(0, 10));
  const [initialPaid, setInitialPaid] = React.useState("");

  const [items, setItems] = React.useState([]);
  const [name, setName] = React.useState("");
  const [qty, setQty] = React.useState(1);
  const [price, setPrice] = React.useState(0);

  const [formError, setFormError] = React.useState(null);

  const selectedSupplier = suppliers.find((s) => s.id === supplierId) || null;

  const filteredSuppliers = suppliers.filter((s) =>
    s.label.toLowerCase().includes(supplierQuery.toLowerCase())
  );

  const itemTotal = (Number(qty) || 0) * (Number(price) || 0);

  const addItemRow = () => {
    if (!name.trim()) return;
    setItems((prev) => [
      ...prev,
      { id: Date.now(), name: name.trim(), qty: Number(qty) || 0, price: Number(price) || 0 },
    ]);
    setName("");
    setQty(1);
    setPrice(0);
  };

  const removeItemRow = (id) => setItems((prev) => prev.filter((it) => it.id !== id));

  const grandTotal = items.reduce((sum, it) => sum + it.qty * it.price, 0);

  const canSave = selectedSupplier && items.length > 0 && purchaseDate && !saving;

  const handleSave = async () => {
    if (!canSave) return;
    setFormError(null);
    try {
      await onSave({
        supplier_id: selectedSupplier.id,
        purchase_date: purchaseDate,
        items: items.map((it) => ({ name: it.name, qty: it.qty, price: it.price })),
        ...(initialPaid ? { initial_paid: Number(initialPaid) } : {}),
      });
    } catch (err) {
      setFormError(err.message || "পারচেজ সেভ করতে সমস্যা হয়েছে।");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border overflow-hidden shadow-xl"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
      >
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b"
          style={{ borderColor: COLORS.line }}
        >
          <h3 className="text-[15px] font-semibold" style={{ color: COLORS.ink }}>
            Add Purchase
          </h3>
          <button onClick={onCancel} style={{ color: COLORS.muted }}>
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
          {formError && (
            <div className="rounded-md px-3 py-2 text-[12.5px]" style={{ backgroundColor: `${COLORS.vermillion}1A`, color: COLORS.vermillion }}>
              {formError}
            </div>
          )}

          {/* Supplier select */}
          <div>
            <label className="text-[12px] font-semibold" style={{ color: COLORS.muted }}>
              Supplier
            </label>
            <div className="relative mt-1">
              <button
                onClick={() => setSupplierOpen((o) => !o)}
                className="w-full flex items-center justify-between rounded-md px-3 py-2.5 border text-[13px]"
                style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.paper }}
              >
                <span>{selectedSupplier ? selectedSupplier.label : "-- Select supplier --"}</span>
                <span style={{ color: COLORS.muted }}>▾</span>
              </button>

              {supplierOpen && (
                <div
                  className="absolute z-20 mt-1 w-full rounded-lg border overflow-hidden shadow-lg"
                  style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
                >
                  <div className="p-2 border-b" style={{ borderColor: COLORS.line }}>
                    <div
                      className="flex items-center gap-2 rounded-md px-2.5 py-1.5 border"
                      style={{ borderColor: COLORS.magenta }}
                    >
                      <Search size={13} style={{ color: COLORS.muted }} />
                      <input
                        autoFocus
                        value={supplierQuery}
                        onChange={(e) => setSupplierQuery(e.target.value)}
                        placeholder="Search supplier..."
                        className="bg-transparent outline-none text-[13px] w-full"
                        style={{ color: COLORS.ink }}
                      />
                    </div>
                  </div>
                  <div className="max-h-52 overflow-y-auto">
                    {filteredSuppliers.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSupplierId(s.id);
                          setSupplierOpen(false);
                          setSupplierQuery("");
                        }}
                        className="w-full text-left px-3.5 py-2.5 text-[13px] border-b hover:bg-black/5"
                        style={{ borderColor: COLORS.line, color: COLORS.ink }}
                      >
                        {s.label}
                      </button>
                    ))}
                    {filteredSuppliers.length === 0 && (
                      <div className="px-3.5 py-3 text-[13px]" style={{ color: COLORS.muted }}>
                        No suppliers found.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Purchase date + initial payment */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-semibold" style={{ color: COLORS.muted }}>
                Purchase date
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full mt-1 rounded-md px-3 py-2 text-[13px] border outline-none"
                style={{ borderColor: COLORS.line, color: COLORS.ink }}
              />
            </div>
            <div>
              <label className="text-[12px] font-semibold" style={{ color: COLORS.muted }}>
                Initial payment (optional)
              </label>
              <input
                type="number"
                value={initialPaid}
                onChange={(e) => setInitialPaid(e.target.value)}
                placeholder="0"
                className="w-full mt-1 rounded-md px-3 py-2 text-[13px] border outline-none"
                style={{ borderColor: COLORS.line, color: COLORS.ink, fontFamily: FONTS.MONO }}
              />
            </div>
          </div>

          {/* Product entry row */}
          <div>
            <label className="text-[12px] font-semibold" style={{ color: COLORS.muted }}>
              Product
            </label>
            <div className="flex flex-col sm:flex-row gap-2 mt-1">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product name"
                className="flex-1 rounded-md px-3 py-2 text-[13px] border outline-none"
                style={{ borderColor: COLORS.line, color: COLORS.ink }}
              />
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="Quantity"
                className="w-full sm:w-24 rounded-md px-3 py-2 text-[13px] border outline-none"
                style={{ borderColor: COLORS.line, color: COLORS.ink, fontFamily: FONTS.MONO }}
              />
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Purchase price"
                className="w-full sm:w-32 rounded-md px-3 py-2 text-[13px] border outline-none"
                style={{ borderColor: COLORS.line, color: COLORS.ink, fontFamily: FONTS.MONO }}
              />
              <div
                className="w-full sm:w-28 rounded-md px-3 py-2 text-[13px] flex items-center justify-center font-semibold"
                style={{ backgroundColor: COLORS.paper, color: COLORS.magenta, fontFamily: FONTS.MONO }}
              >
                {itemTotal.toFixed(2)}
              </div>
              <button
                onClick={addItemRow}
                className="px-4 py-2 rounded-md text-[13px] font-semibold text-white flex items-center justify-center gap-1.5"
                style={{ backgroundColor: COLORS.magenta }}
              >
                <Plus size={15} />
                Add
              </button>
            </div>
          </div>

          {/* Added items table */}
          {items.length > 0 && (
            <div className="rounded-lg border overflow-hidden" style={{ borderColor: COLORS.line }}>
              <table className="w-full text-[13px] border-collapse">
                <thead>
                  <tr className="text-white">
                    {["Product", "Qty", "Price", "Total", ""].map((h) => (
                      <th
                        key={h}
                        className="text-left font-semibold text-[11px] uppercase tracking-wide px-3 py-2"
                        style={{ backgroundColor: COLORS.magenta }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id} className="border-b" style={{ borderColor: COLORS.line }}>
                      <td className="px-3 py-2" style={{ color: COLORS.ink }}>{it.name}</td>
                      <td className="px-3 py-2" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{it.qty}</td>
                      <td className="px-3 py-2" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{it.price}</td>
                      <td className="px-3 py-2 font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                        {(it.qty * it.price).toFixed(2)}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => removeItemRow(it.id)}
                          className="w-6 h-6 rounded flex items-center justify-center text-white"
                          style={{ backgroundColor: COLORS.vermillion }}
                        >
                          <X size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-[13px] font-semibold" style={{ color: COLORS.muted }}>
              Grand Total
            </span>
            <span className="text-[16px] font-bold" style={{ color: COLORS.magenta, fontFamily: FONTS.MONO }}>
              {grandTotal.toFixed(2)}
            </span>
          </div>
        </div>

        <div
          className="flex items-center justify-end gap-2 px-5 py-3.5 border-t"
          style={{ borderColor: COLORS.line }}
        >
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md text-[13px] font-semibold border"
            style={{ borderColor: COLORS.line, color: COLORS.ink }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="px-4 py-2 rounded-md text-[13px] font-semibold text-white flex items-center gap-1.5 disabled:opacity-40"
            style={{ backgroundColor: COLORS.magenta }}
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
            Save Purchase
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Purchase List (default view) ---------------- */
function PurchaseList({ purchases, loading, error, query, onQueryChange, onAddClick, onPrint, page, lastPage, totalCount, onPageChange }) {
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-3.5 border-b"
        style={{ borderColor: COLORS.line }}
      >
        <h3 className="text-[15px] font-semibold" style={{ color: COLORS.ink }}>
          Purchase List
        </h3>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center gap-2 rounded-md px-3 py-2 border" style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper }}>
            <Search size={14} style={{ color: COLORS.muted }} />
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search invoice / supplier"
              className="bg-transparent outline-none text-[13px] w-full sm:w-48"
              style={{ color: COLORS.ink }}
            />
          </div>
          <button
            onClick={onPrint}
            className="px-4 py-2 rounded-md text-[13px] font-semibold border flex items-center justify-center gap-1.5"
            style={{ borderColor: COLORS.line, color: COLORS.ink }}
          >
            <Printer size={15} />
            Print Report
          </button>
          <button
            onClick={onAddClick}
            className="px-4 py-2 rounded-md text-[13px] font-semibold text-white flex items-center justify-center gap-1.5"
            style={{ backgroundColor: COLORS.magenta }}
          >
            <Plus size={15} />
            Add Purchase
          </button>
        </div>
      </div>

      <div id="purchase-print-area" className="overflow-x-auto">
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
              <tr className="text-white">
                {["Date", "Invoice", "Supplier", "Products", "Total", "Due"].map((h) => (
                  <th
                    key={h}
                    className="text-left font-semibold text-[11px] uppercase tracking-wide px-3 py-2.5"
                    style={{ backgroundColor: COLORS.magenta }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p.id} className="border-b align-top" style={{ borderColor: COLORS.line }}>
                  <td className="px-3 py-3" style={{ color: COLORS.ink }}>{p.date}</td>
                  <td className="px-3 py-3" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{p.invoiceNo}</td>
                  <td className="px-3 py-3 font-semibold" style={{ color: COLORS.ink }}>{p.supplierLabel}</td>
                  <td className="px-3 py-3" style={{ color: COLORS.muted }}>
                    {p.items.map((it) => `${it.name} (${it.qty} × ${it.price})`).join(", ")}
                  </td>
                  <td className="px-3 py-3 font-bold" style={{ color: COLORS.magenta, fontFamily: FONTS.MONO }}>
                    {p.total.toFixed(2)}
                  </td>
                  <td className="px-3 py-3 font-bold" style={{ color: p.due > 0 ? COLORS.vermillion : "#1E8A4C", fontFamily: FONTS.MONO }}>
                    {p.due.toFixed(2)}
                  </td>
                </tr>
              ))}
              {purchases.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-10 text-center" style={{ color: COLORS.muted }}>
                    No purchases yet. Click "Add Purchase" to create one.
                  </td>
                </tr>
              )}
            </tbody>
            {purchases.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan={4} className="px-3 py-3 text-right font-semibold" style={{ color: COLORS.muted }}>
                    Total (this page)
                  </td>
                  <td className="px-3 py-3 font-bold" style={{ color: COLORS.magenta, fontFamily: FONTS.MONO }}>
                    {purchases.reduce((s, p) => s + p.total, 0).toFixed(2)}
                  </td>
                  <td className="px-3 py-3 font-bold" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>
                    {purchases.reduce((s, p) => s + p.due, 0).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        )}
      </div>

      {!loading && !error && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t text-[13px]" style={{ borderColor: COLORS.line, color: COLORS.muted }}>
          <span>Showing page {page} of {lastPage} — {totalCount} purchases total</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="w-8 h-8 rounded-md border flex items-center justify-center disabled:opacity-40"
              style={{ borderColor: COLORS.line, color: COLORS.muted }}
            >
              <ChevronLeft size={14} />
            </button>
            <span className="w-8 h-8 rounded-md flex items-center justify-center font-semibold text-white" style={{ backgroundColor: COLORS.magenta }}>
              {page}
            </span>
            <button
              onClick={() => onPageChange(Math.min(lastPage, page + 1))}
              disabled={page >= lastPage}
              className="w-8 h-8 rounded-md border flex items-center justify-center disabled:opacity-40"
              style={{ borderColor: COLORS.line, color: COLORS.ink }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Page ---------------- */
export function PurchasePage() {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadPurchases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPurchases({ search: query || undefined, per_page: 100, page });
      const rows = (data.data || []).map(mapPurchase);
      setPurchases(rows);
      setTotalCount(data.total ?? rows.length);
      setLastPage(data.last_page ?? 1);
    } catch (err) {
      console.error("Error loading purchases:", err);
      setError("পারচেজ লিস্ট লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }, [query, page]);

  useEffect(() => {
    loadPurchases();
  }, [loadPurchases]);

  // সাপ্লায়ার লিস্ট — একবারই লোড হয়
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchSuppliers();
        const list = data.data || data || [];
        setSuppliers(list.map(mapSupplierOption));
      } catch (err) {
        console.error("Error loading suppliers:", err);
      }
    })();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const handleSavePurchase = async (payload) => {
    setSaving(true);
    try {
      await createPurchase(payload);
      setShowModal(false);
      setPage(1);
      await loadPurchases();
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY }}>
      <PurchaseList
        purchases={purchases}
        loading={loading}
        error={error}
        query={query}
        onQueryChange={setQuery}
        onAddClick={() => setShowModal(true)}
        onPrint={handlePrint}
        page={page}
        lastPage={lastPage}
        totalCount={totalCount}
        onPageChange={setPage}
      />

      {showModal && (
        <AddPurchaseModal
          suppliers={suppliers}
          onSave={handleSavePurchase}
          onCancel={() => setShowModal(false)}
          saving={saving}
        />
      )}
    </div>
  );
}

export default PurchasePage;