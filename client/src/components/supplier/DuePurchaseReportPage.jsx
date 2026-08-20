import React from "react";
import { Search, ChevronLeft, ChevronRight, AlertCircle, Printer, Loader2, X, Phone, MapPin, Building2, Hash, ReceiptText, Wallet, Undo2, Calendar, CreditCard, User } from "lucide-react";
import { COLORS, FONTS } from "../../constants";
import { fetchPurchases, fetchPurchase } from "../../api/supplier/purchaseService";

const magentaSoft = COLORS.magentaSoft || `${COLORS.magenta}1A`;
const vermillionSoft = `${COLORS.vermillion}1A`;

// Backend sends purchase_date as an ISO string (e.g. "2025-04-27"), so aging
// is computed straight off that rather than parsing a dd-mm-yyyy display string.
function agingLabel(isoDate) {
  const days = Math.floor((Date.now() - new Date(isoDate).getTime()) / 86400000);
  if (days > 60) return { label: `${days}d overdue`, tone: "danger" };
  if (days > 30) return { label: `${days}d`, tone: "warn" };
  return { label: `${days}d`, tone: "ok" };
}

function formatDisplayDate(isoDate) {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-GB").replace(/\//g, "-"); // dd-mm-yyyy
}

function AgingPill({ isoDate }) {
  const { label, tone } = agingLabel(isoDate);
  const styles =
    tone === "danger"
      ? { backgroundColor: vermillionSoft, color: COLORS.vermillion }
      : tone === "warn"
      ? { backgroundColor: "#FFF4E0", color: "#B8790A" }
      : { backgroundColor: "#E9F7EE", color: "#1E8A4C" };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold" style={styles}>
      {label}
    </span>
  );
}

// Normalizes one API purchase row into what this table renders.
function mapRow(p) {
  return {
    id: p.id,
    date: p.purchase_date,
    name: p.supplier?.name ?? "—",
    phone: p.supplier?.phone ?? "—",
    company: p.supplier?.company ?? "—",
    amount: Number(p.total ?? 0),
    paid: Number(p.paid ?? 0),
    due: Number(p.due ?? 0),
    inv: p.invoice_no,
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
      note: pay.note,
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

function PurchaseDetailModal({ purchaseId, onClose }) {
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
        console.error("Error loading purchase detail:", err);
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
        id="purchase-detail-print"
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
            <div className="flex items-start justify-between pb-4 mb-4 border-b" style={{ borderColor: COLORS.line }}>
              <div>
                <div className="text-[20px] font-bold" style={{ color: COLORS.ink }}>{detail.supplier.name}</div>
                <div className="text-[12.5px] mt-0.5" style={{ color: COLORS.muted }}>{detail.supplier.company}</div>
                <div className="text-[12px] mt-1.5" style={{ color: COLORS.magenta, fontFamily: FONTS.MONO }}>{detail.invoice_no}</div>
              </div>
              <div className="text-right">
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold"
                  style={
                    detail.status === "Paid"
                      ? { backgroundColor: "#E9F7EE", color: "#1E8A4C" }
                      : detail.status === "Receivable"
                      ? { backgroundColor: "#E9F0FF", color: "#2A5CCB" }
                      : detail.status === "Partial"
                      ? { backgroundColor: "#FFF4E0", color: "#B8790A" }
                      : { backgroundColor: vermillionSoft, color: COLORS.vermillion }
                  }
                >
                  {detail.status}
                </span>
                <div className="text-[11px] mt-1.5" style={{ color: COLORS.muted }}>{formatDisplayDate(detail.date)}</div>
              </div>
            </div>

            {/* Supplier contact */}
            <div className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: COLORS.muted }}>
              Supplier information
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 divide-y sm:divide-y-0" style={{ borderColor: COLORS.line }}>
              <DetailRow icon={Phone} label="Phone" value={detail.supplier.phone} />
              <DetailRow icon={MapPin} label="Address" value={detail.supplier.address} />
              <DetailRow icon={Building2} label="Company" value={detail.supplier.company} />
              <DetailRow icon={Hash} label="Invoice no." value={detail.invoice_no} valueColor={COLORS.magenta} />
            </div>

            {/* Amount summary */}
            <div className="text-[11px] font-semibold uppercase tracking-wide mt-4 mb-1" style={{ color: COLORS.muted }}>
              Amount summary
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: COLORS.paper }}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <div className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Invoice total</div>
                  <div className="text-[14px] font-bold mt-0.5" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{detail.total.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Paid</div>
                  <div className="text-[14px] font-bold mt-0.5" style={{ color: "#1E8A4C", fontFamily: FONTS.MONO }}>{detail.paid.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Returned</div>
                  <div className="text-[14px] font-bold mt-0.5" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>{detail.returnTotal.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
                    {detail.receivable > 0 ? "Receivable" : "Due"}
                  </div>
                  <div
                    className="text-[14px] font-bold mt-0.5"
                    style={{ color: detail.receivable > 0 ? "#2A5CCB" : detail.due > 0 ? COLORS.vermillion : COLORS.muted, fontFamily: FONTS.MONO }}
                  >
                    {(detail.receivable > 0 ? detail.receivable : detail.due).toLocaleString()}
                  </div>
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

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #purchase-detail-print, #purchase-detail-print * { visibility: visible; }
          #purchase-detail-print { position: fixed; inset: 0; margin: auto; box-shadow: none; max-height: none; }
        }
      `}</style>
    </div>
  );
}

export function DuePurchaseReportPage() {
  const [query, setQuery] = React.useState("");
  const [perPage, setPerPage] = React.useState(100);
  const [page, setPage] = React.useState(1);

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
        due_only: 1,
        search: query || undefined,
        per_page: perPage,
        page,
      });
      setRows((res.data || []).map(mapRow));
      setMeta({ total: res.total ?? 0, current_page: res.current_page ?? 1, last_page: res.last_page ?? 1 });
    } catch (err) {
      console.error("Error loading due purchases:", err);
      setError(err.message || "Failed to load due purchases.");
    } finally {
      setLoading(false);
    }
  }, [query, perPage, page]);

  // Debounce search so we don't fire a request on every keystroke.
  React.useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      load();
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, perPage]);

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const totals = rows.reduce(
    (acc, r) => ({
      amount: acc.amount + r.amount,
      paid: acc.paid + r.paid,
      due: acc.due + r.due,
    }),
    { amount: 0, paid: 0, due: 0 }
  );

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {[
          { label: "Total purchase amount", value: totals.amount, color: COLORS.ink },
          { label: "Total paid", value: totals.paid, color: "#1E8A4C" },
          { label: "Total due", value: totals.due, color: COLORS.vermillion },
        ].map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border p-4"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
          >
            <div className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
              {c.label}
            </div>
            <div className="text-[22px] font-bold mt-1" style={{ color: c.color, fontFamily: FONTS.MONO }}>
              {c.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
      >
        {/* Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-5 border-b"
          style={{ borderColor: COLORS.line }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: vermillionSoft }}
            >
              <AlertCircle size={16} style={{ color: COLORS.vermillion }} />
            </div>
            <div>
              <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>
                Due Purchase Report
              </h1>
              <p className="text-[12px]" style={{ color: COLORS.muted }}>
                {meta.total} supplier invoice{meta.total !== 1 ? "s" : ""} with outstanding balance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-[13px]" style={{ color: COLORS.muted }}>
              <span>Show</span>
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="rounded-md px-2 py-1.5 border text-[13px] outline-none"
                style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.paper }}
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span>entries</span>
            </div>

            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2 border w-full sm:w-64"
              style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper }}
            >
              <Search size={14} style={{ color: COLORS.muted }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search supplier"
                className="bg-transparent outline-none text-[13px] w-full"
                style={{ color: COLORS.ink }}
              />
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-white"
              style={{ backgroundColor: COLORS.magenta }}
            >
              <Printer size={14} />
              Print
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr>
                {["Date", "Supplier info", "Purchase amount", "Paid", "Due", "Aging", "Inv num."].map((h) => (
                  <th
                    key={h}
                    className="text-left font-semibold text-[11px] uppercase tracking-wide px-5 py-3 text-white"
                    style={{ backgroundColor: COLORS.magenta }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center" style={{ color: COLORS.muted }}>
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={18} />
                      Loading due purchases...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[13px]" style={{ color: COLORS.vermillion }}>
                    {error}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[13px]" style={{ color: COLORS.muted }}>
                    No due purchases found.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedId(row.id)}
                    className="border-b hover:bg-black/[0.02] transition-colors cursor-pointer"
                    style={{ borderColor: COLORS.line }}
                  >
                    <td className="px-5 py-3.5 align-top whitespace-nowrap" style={{ color: COLORS.ink, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                      {formatDisplayDate(row.date)}
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <div className="font-semibold" style={{ color: COLORS.ink }}>
                        {row.name}
                      </div>
                      <div className="text-[11.5px] mt-0.5" style={{ color: COLORS.muted }}>
                        Phone: {row.phone}
                      </div>
                      <div className="text-[11.5px]" style={{ color: COLORS.muted }}>
                        Company Name: {row.company}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 align-top font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                      {row.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 align-top" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                      {row.paid.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 align-top font-bold" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>
                      {row.due.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <AgingPill isoDate={row.date} />
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(row.id);
                        }}
                        className="font-semibold hover:underline"
                        style={{ color: COLORS.magenta, fontFamily: FONTS.MONO, fontSize: 12.5 }}
                      >
                        {row.inv}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {!loading && !error && rows.length > 0 && (
              <tfoot>
                <tr style={{ backgroundColor: magentaSoft }}>
                  <td colSpan={2} className="px-5 py-3 font-bold text-[12px] uppercase tracking-wide" style={{ color: COLORS.ink }}>
                    Total (this page)
                  </td>
                  <td className="px-5 py-3 font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                    {totals.amount.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                    {totals.paid.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 font-bold" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>
                    {totals.due.toLocaleString()}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Footer / pagination */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t text-[13px]"
          style={{ borderColor: COLORS.line, color: COLORS.muted }}
        >
          <span>
            Page {meta.current_page} of {meta.last_page} · {meta.total} total entries
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={meta.current_page <= 1 || loading}
              className="w-8 h-8 rounded-md border flex items-center justify-center disabled:opacity-40"
              style={{ borderColor: COLORS.line, color: COLORS.muted }}
            >
              <ChevronLeft size={14} />
            </button>
            <span
              className="w-8 h-8 rounded-md flex items-center justify-center font-semibold text-white"
              style={{ backgroundColor: COLORS.magenta }}
            >
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

      <PurchaseDetailModal purchaseId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}

export default DuePurchaseReportPage;