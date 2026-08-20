import React from "react";
import { Search, ChevronLeft, ChevronRight, ReceiptText, Printer, X, Calendar, Hash, Building2, Boxes, Loader2, Phone, MapPin, Wallet, Undo2, CreditCard } from "lucide-react";
import { COLORS, FONTS, SUB_BRANCH_ID } from "../../constants";
import { fetchPurchases, fetchPurchase } from "../../api/supplier/purchaseService";

// Colors pulled directly from your existing constants file — same tokens as
// PurchasePage.jsx / SupplierInvoicesPage.jsx / DuePurchaseReportPage.jsx / DueConnectionReportPage.jsx.
const magentaSoft = COLORS.magentaSoft || `${COLORS.magenta}1A`;
const vermillionSoft = `${COLORS.vermillion}1A`;

function formatDisplayDate(isoDate) {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-GB").replace(/\//g, "-"); // dd-mm-yyyy
}

// Normalizes one API purchase row into what this table renders.
function mapRow(p) {
  const items = p.items || [];
  return {
    id: p.id,
    date: p.purchase_date,
    inv: p.invoice_no,
    supplier: p.supplier?.name ?? "—",
    company: p.supplier?.company ?? "—",
    items: items.length,
    qty: items.reduce((s, it) => s + Number(it.qty || 0), 0),
    amount: Number(p.total ?? 0),
    paid: Number(p.paid ?? 0),
    due: Number(p.due ?? 0),
    receivable: Number(p.receivable ?? 0),
    status: p.status,
  };
}

// Normalizes the full GET /api/purchases/{id} response for the detail modal.
function mapDetail(p) {
  return {
    id: p.id,
    invoice_no: p.invoice_no,
    date: p.purchase_date,
    total: Number(p.total ?? 0),
    paid: Number(p.paid ?? 0),
    due: Number(p.due ?? 0),
    returnTotal: Number(p.return_total ?? 0),
    receivable: Number(p.receivable ?? 0),
    status: p.status,
    supplier: {
      name: p.supplier?.name ?? "—",
      company: p.supplier?.company ?? "—",
      phone: p.supplier?.phone ?? "—",
      address: p.supplier?.address ?? "—",
    },
    items: (p.items || []).map((it) => ({
      name: it.name,
      qty: it.qty,
      price: Number(it.price),
      total: Number(it.total),
    })),
    payments: (p.payments || []).map((pay) => ({
      id: pay.payment_no,
      date: pay.paid_date,
      amount: Number(pay.amount),
      method: pay.method,
    })),
    returns: (p.returns || []).map((r) => ({
      id: r.return_no,
      date: r.return_date,
      total: Number(r.total),
      reason: r.reason,
      items: (r.items || []).map((it) => ({ name: it.name, qty: it.qty, price: Number(it.price) })),
    })),
  };
}

function StatusPill({ status }) {
  const styles =
    status === "Paid"
      ? { backgroundColor: "#E9F7EE", color: "#1E8A4C" }
      : status === "Receivable"
      ? { backgroundColor: "#E9F0FF", color: "#2A5CCB" }
      : status === "Partial"
      ? { backgroundColor: "#FFF4E0", color: "#B8790A" }
      : { backgroundColor: vermillionSoft, color: COLORS.vermillion };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold" style={styles}>
      {status || "Due"}
    </span>
  );
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

function InvoiceDetailModal({ purchaseId, onClose }) {
  const [detail, setDetail] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!purchaseId) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPurchase(purchaseId);
        if (!cancelled) setDetail(mapDetail(data));
      } catch (err) {
        console.error("Error loading invoice detail:", err);
        if (!cancelled) setError(err.message || "Failed to load invoice detail.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [purchaseId]);

  if (!purchaseId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(36,34,32,0.45)" }}
      onClick={onClose}
    >
      <div
        id="invoice-detail-print"
        className="w-full max-w-2xl rounded-2xl border overflow-hidden shadow-xl max-h-[90vh] flex flex-col"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b print:hidden shrink-0" style={{ borderColor: COLORS.line }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: magentaSoft }}>
              <ReceiptText size={16} style={{ color: COLORS.magenta }} />
            </div>
            <h2 className="text-[16px] font-bold" style={{ color: COLORS.ink }}>
              Invoice details
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-black/5" style={{ color: COLORS.muted }}>
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16" style={{ color: COLORS.muted }}>
            <Loader2 className="animate-spin" size={20} />
            Loading invoice...
          </div>
        ) : error ? (
          <div className="py-16 text-center text-[13px]" style={{ color: COLORS.vermillion }}>{error}</div>
        ) : !detail ? null : (
          <div className="px-6 py-5 overflow-y-auto">
            {/* Title block */}
            <div className="flex items-center justify-between pb-4 mb-1 border-b" style={{ borderColor: COLORS.line }}>
              <div>
                <div className="text-[18px] font-bold" style={{ color: COLORS.ink }}>{detail.supplier.name}</div>
                <div className="text-[12px] mt-0.5" style={{ color: COLORS.magenta, fontFamily: FONTS.MONO }}>{detail.invoice_no}</div>
              </div>
              <StatusPill status={detail.status} />
            </div>

            <div className="divide-y" style={{ borderColor: COLORS.line }}>
              <DetailRow icon={Calendar} label="Invoice date" value={formatDisplayDate(detail.date)} />
              <DetailRow icon={Building2} label="Company" value={detail.supplier.company} />
              <DetailRow icon={Phone} label="Phone" value={detail.supplier.phone} />
              <DetailRow icon={MapPin} label="Address" value={detail.supplier.address} />
              <DetailRow icon={Hash} label="Invoice number" value={detail.invoice_no} valueColor={COLORS.magenta} />
              <DetailRow icon={Boxes} label="Items / quantity" value={`${detail.items.length} items · ${detail.items.reduce((s, it) => s + it.qty, 0)} units`} />
            </div>

            {/* Amount summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 rounded-xl p-4" style={{ backgroundColor: COLORS.paper }}>
              <div>
                <div className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Amount</div>
                <div className="text-[16px] font-bold mt-0.5" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{detail.total.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Paid</div>
                <div className="text-[16px] font-bold mt-0.5" style={{ color: "#1E8A4C", fontFamily: FONTS.MONO }}>{detail.paid.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Returned</div>
                <div className="text-[16px] font-bold mt-0.5" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>{detail.returnTotal.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
                  {detail.receivable > 0 ? "Receivable" : "Due"}
                </div>
                <div
                  className="text-[16px] font-bold mt-0.5"
                  style={{ color: detail.receivable > 0 ? "#2A5CCB" : detail.due > 0 ? COLORS.vermillion : COLORS.muted, fontFamily: FONTS.MONO }}
                >
                  {(detail.receivable > 0 ? detail.receivable : detail.due).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Line items */}
            <div className="text-[11px] font-semibold uppercase tracking-wide mt-4 mb-1" style={{ color: COLORS.muted }}>
              Items purchased
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: COLORS.paper }}>
              <div className="divide-y" style={{ borderColor: COLORS.line }}>
                {detail.items.map((it, i) => (
                  <div key={i} className="flex items-center justify-between py-2 text-[13px]">
                    <div style={{ color: COLORS.ink }}>{it.name}</div>
                    <div className="flex items-center gap-4" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>
                      <span>{it.qty} × {it.price.toLocaleString()}</span>
                      <span className="font-bold" style={{ color: COLORS.ink }}>{it.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                {detail.items.length === 0 && (
                  <div className="py-2 text-[12.5px]" style={{ color: COLORS.muted }}>No items recorded.</div>
                )}
              </div>
            </div>

            {/* Payments made */}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide mt-4 mb-1" style={{ color: COLORS.muted }}>
              <Wallet size={12} /> Payments made ({detail.payments.length})
            </div>
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: COLORS.line }}>
              {detail.payments.length === 0 ? (
                <div className="px-3.5 py-3 text-[12.5px]" style={{ backgroundColor: COLORS.paper, color: COLORS.muted }}>
                  No payments recorded yet.
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: COLORS.line }}>
                  {detail.payments.map((pay, i) => (
                    <div key={i} className="flex items-center justify-between px-3.5 py-2.5" style={{ backgroundColor: COLORS.paper }}>
                      <div className="flex items-center gap-2 min-w-0">
                        <CreditCard size={13} style={{ color: COLORS.muted }} />
                        <div className="min-w-0">
                          <div className="text-[12.5px] font-semibold truncate" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{pay.id}</div>
                          <div className="text-[11px]" style={{ color: COLORS.muted }}>{formatDisplayDate(pay.date)} · {pay.method}</div>
                        </div>
                      </div>
                      <span className="text-[13px] font-bold shrink-0" style={{ color: "#1E8A4C", fontFamily: FONTS.MONO }}>
                        {pay.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Returns raised */}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide mt-4 mb-1" style={{ color: COLORS.muted }}>
              <Undo2 size={12} /> Returns raised ({detail.returns.length})
            </div>
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: COLORS.line }}>
              {detail.returns.length === 0 ? (
                <div className="px-3.5 py-3 text-[12.5px]" style={{ backgroundColor: COLORS.paper, color: COLORS.muted }}>
                  No returns raised against this invoice.
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: COLORS.line }}>
                  {detail.returns.map((r, i) => (
                    <div key={i} className="px-3.5 py-2.5" style={{ backgroundColor: COLORS.paper }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <Calendar size={13} style={{ color: COLORS.muted }} />
                          <div className="min-w-0">
                            <div className="text-[12.5px] font-semibold truncate" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{r.id}</div>
                            <div className="text-[11px]" style={{ color: COLORS.muted }}>{formatDisplayDate(r.date)} · {r.reason}</div>
                          </div>
                        </div>
                        <span className="text-[13px] font-bold shrink-0" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>
                          {r.total.toLocaleString()}
                        </span>
                      </div>
                      {r.items.length > 0 && (
                        <div className="mt-1.5 pl-5 text-[11.5px]" style={{ color: COLORS.muted }}>
                          {r.items.map((it, j) => (
                            <div key={j}>{it.name} × {it.qty}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t print:hidden shrink-0" style={{ borderColor: COLORS.line }}>
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-[13px] font-semibold border" style={{ borderColor: COLORS.line, color: COLORS.ink }}>
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold text-white"
            style={{ backgroundColor: COLORS.magenta }}
          >
            <Printer size={14} />
            Print
          </button>
        </div>
      </div>

      {/* Print-only styles: hide everything except the modal card when printing */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-detail-print, #invoice-detail-print * { visibility: visible; }
          #invoice-detail-print { position: fixed; inset: 0; margin: auto; box-shadow: none; max-height: none; }
        }
      `}</style>
    </div>
  );
}

export function PurchaseInvoiceReportPage() {
  const [query, setQuery] = React.useState("");
  const [perPage, setPerPage] = React.useState(100);
  const [page, setPage] = React.useState(1);
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");

  const [rows, setRows] = React.useState([]);
  const [meta, setMeta] = React.useState({ total: 0, current_page: 1, last_page: 1 });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const [selectedId, setSelectedId] = React.useState(null);

  const load = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchPurchases({
        search: query || undefined,
        per_page: perPage,
        page,
        ...(SUB_BRANCH_ID ? { branch_id: SUB_BRANCH_ID } : {}),
      });
      let data = res.data || [];
      // Client-side date-range narrowing (from/to) on top of the server page.
      if (from) data = data.filter((p) => p.purchase_date >= from);
      if (to) data = data.filter((p) => p.purchase_date <= to);
      setRows(data.map(mapRow));
      setMeta({ total: res.total ?? 0, current_page: res.current_page ?? 1, last_page: res.last_page ?? 1 });
    } catch (err) {
      console.error("Error loading purchase invoices:", err);
      setError(err.message || "Failed to load purchase invoices.");
    } finally {
      setLoading(false);
    }
  }, [query, perPage, page, from, to]);

  // Debounce search/date changes so we don't fire a request on every keystroke.
  React.useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      load();
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, perPage, from, to]);

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const totals = rows.reduce(
    (acc, r) => ({
      amount: acc.amount + r.amount,
      paid: acc.paid + r.paid,
      due: acc.due + r.due,
      items: acc.items + r.items,
      qty: acc.qty + r.qty,
    }),
    { amount: 0, paid: 0, due: 0, items: 0, qty: 0 }
  );

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        {[
          { label: "Total invoices", value: meta.total, color: COLORS.ink, mono: false },
          { label: "Total purchase amount", value: totals.amount, color: COLORS.ink, mono: true },
          { label: "Total paid", value: totals.paid, color: "#1E8A4C", mono: true },
          { label: "Total due", value: totals.due, color: COLORS.vermillion, mono: true },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border p-4" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
            <div className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
              {c.label}
            </div>
            <div className="text-[22px] font-bold mt-1" style={{ color: c.color, fontFamily: c.mono ? FONTS.MONO : FONTS.BODY }}>
              {c.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
        {/* Header */}
        <div className="flex flex-col gap-4 px-6 py-5 border-b" style={{ borderColor: COLORS.line }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: magentaSoft }}>
                <ReceiptText size={16} style={{ color: COLORS.magenta }} />
              </div>
              <div>
                <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>
                  Purchase Invoice Report
                </h1>
                <p className="text-[12px]" style={{ color: COLORS.muted }}>
                  {meta.total} invoice{meta.total !== 1 ? "s" : ""} &middot; {totals.items} items &middot; {totals.qty} units
                </p>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-white self-start sm:self-auto"
              style={{ backgroundColor: COLORS.magenta }}
            >
              <Printer size={14} />
              Print
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-[13px]" style={{ color: COLORS.muted }}>
              <span>From</span>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="rounded-md px-2.5 py-1.5 border text-[13px] outline-none"
                style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.paper }}
              />
              <span>To</span>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="rounded-md px-2.5 py-1.5 border text-[13px] outline-none"
                style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.paper }}
              />
            </div>

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
                placeholder="Search invoice / supplier"
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
                {["Date", "Inv num.", "Supplier", "Items", "Qty", "Amount", "Paid", "Due", "Status"].map((h) => (
                  <th key={h} className="text-left font-semibold text-[11px] uppercase tracking-wide px-5 py-3 text-white" style={{ backgroundColor: COLORS.magenta }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center" style={{ color: COLORS.muted }}>
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={18} />
                      Loading purchase invoices...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-[13px]" style={{ color: COLORS.vermillion }}>
                    {error}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-[13px]" style={{ color: COLORS.muted }}>
                    No purchase invoices found.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} onClick={() => setSelectedId(row.id)} className="border-b hover:bg-black/[0.02] transition-colors cursor-pointer" style={{ borderColor: COLORS.line }}>
                    <td className="px-5 py-3.5 align-top whitespace-nowrap" style={{ color: COLORS.ink, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                      {formatDisplayDate(row.date)}
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedId(row.id); }}
                        className="font-semibold hover:underline"
                        style={{ color: COLORS.magenta, fontFamily: FONTS.MONO, fontSize: 12.5 }}
                      >
                        {row.inv}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <div className="font-semibold hover:underline" style={{ color: COLORS.ink }}>{row.supplier}</div>
                      <div className="text-[11.5px] mt-0.5" style={{ color: COLORS.muted }}>{row.company}</div>
                    </td>
                    <td className="px-5 py-3.5 align-top" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{row.items}</td>
                    <td className="px-5 py-3.5 align-top" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{row.qty}</td>
                    <td className="px-5 py-3.5 align-top font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{row.amount.toLocaleString()}</td>
                    <td className="px-5 py-3.5 align-top" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{row.paid.toLocaleString()}</td>
                    <td className="px-5 py-3.5 align-top font-bold" style={{ color: (row.receivable > 0 || row.due > 0) ? COLORS.vermillion : COLORS.muted, fontFamily: FONTS.MONO }}>
                      {row.receivable > 0 ? `+${row.receivable.toLocaleString()}` : row.due.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <StatusPill status={row.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {!loading && !error && rows.length > 0 && (
              <tfoot>
                <tr style={{ backgroundColor: magentaSoft }}>
                  <td colSpan={3} className="px-5 py-3 font-bold text-[12px] uppercase tracking-wide" style={{ color: COLORS.ink }}>Total (this page)</td>
                  <td className="px-5 py-3 font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{totals.items}</td>
                  <td className="px-5 py-3 font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{totals.qty}</td>
                  <td className="px-5 py-3 font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{totals.amount.toLocaleString()}</td>
                  <td className="px-5 py-3 font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{totals.paid.toLocaleString()}</td>
                  <td className="px-5 py-3 font-bold" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>{totals.due.toLocaleString()}</td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Footer / pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t text-[13px]" style={{ borderColor: COLORS.line, color: COLORS.muted }}>
          <span>Page {meta.current_page} of {meta.last_page} · {meta.total} total entries</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={meta.current_page <= 1 || loading}
              className="w-8 h-8 rounded-md border flex items-center justify-center disabled:opacity-40"
              style={{ borderColor: COLORS.line, color: COLORS.muted }}
            >
              <ChevronLeft size={14} />
            </button>
            <span className="w-8 h-8 rounded-md flex items-center justify-center font-semibold text-white" style={{ backgroundColor: COLORS.magenta }}>
              {meta.current_page}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              disabled={meta.current_page >= meta.last_page || loading}
              className="w-8 h-8 rounded-md border flex items-center justify-center disabled:opacity-40"
              style={{ borderColor: COLORS.line, color: COLORS.ink }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <InvoiceDetailModal purchaseId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}

export default PurchaseInvoiceReportPage;