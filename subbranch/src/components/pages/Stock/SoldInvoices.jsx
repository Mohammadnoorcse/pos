import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, ChevronDown, ChevronLeft, ChevronRight, Loader2, Printer } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { COLORS, PETALS, FONTS, SUB_BRANCH_ID } from "../../../constants";
import { fetchSoldInvoices } from "../../../api/soldInvoicesService";

function ActionMenu({ invoice, onViewInvoice }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const items = ["POS", "Invoice", "Half Page", "Half Page V2"];

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
        style={{ backgroundColor: COLORS.forest }}
      >
        Action
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div
          className="absolute left-0 z-10 mt-1.5 w-40 overflow-hidden rounded-xl border py-1.5 shadow-[0_8px_24px_rgba(76,50,179,0.14)]"
          style={{
            backgroundColor: COLORS.panel,
            borderColor: COLORS.line,
          }}
        >
          {items.map((it) => (
            <button
              key={it}
              onClick={() => {
                setOpen(false);
                if (it === "Invoice") {
                  onViewInvoice(invoice);
                }
              }}
              className="block w-full px-4 py-2 text-left text-sm font-medium transition-colors hover:bg-opacity-50"
              style={{
                color: COLORS.ink,
                backgroundColor: "transparent",
              }}
            >
              {it}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function formatMoney(n) {
  return Number(n || 0).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function InvoiceDetailModal({ invoice, onClose }) {
  const customerName =
    typeof invoice.customer === "object" && invoice.customer !== null
      ? invoice.customer.name
      : invoice.customer || "Walking Customer";

  const customerPhone =
    typeof invoice.customer === "object" && invoice.customer !== null
      ? invoice.customer.phone
      : invoice.phone || "N/A";

  const branchName = invoice.branch?.name || invoice.branch || "N/A";
  const branchAddress = invoice.branch?.address;

  const items = Array.isArray(invoice.items) ? invoice.items : [];

  const saleDate = invoice.sale_date || invoice.date;
  const createdAtFormatted = invoice.created_at
    ? new Date(invoice.created_at).toLocaleString()
    : invoice.createdAt;

  const badgeColor =
    invoice.status === "Paid" ? COLORS.teal : invoice.status === "Partial" ? COLORS.rust : COLORS.muted;

  function handlePrint() {
    const printContents = document.getElementById("sold-invoice-print-area")?.innerHTML;
    if (!printContents) return;

    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${invoice.invoice_no || ""}</title>
          <style>
            body { font-family: sans-serif; padding: 24px; color: #222; }
            h2 { margin-bottom: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
            th, td { padding: 6px 8px; text-align: left; border-bottom: 1px solid #eee; }
            th { text-transform: uppercase; font-size: 11px; color: #777; }
            .right { text-align: right; }
            .row { display: flex; justify-content: space-between; padding: 4px 0; }
            .label { color: #777; font-size: 13px; }
            .value { font-weight: 600; font-size: 13px; }
            .badge { display: inline-block; padding: 2px 10px; border-radius: 6px; color: #fff; font-size: 12px; font-weight: bold; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ backgroundColor: COLORS.panel }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10"
          style={{ borderColor: COLORS.line, backgroundColor: COLORS.panel }}
        >
          <h2 className="text-lg font-bold" style={{ color: COLORS.accent, fontFamily: FONTS.HEAD }}>
            Invoice Details
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
            style={{ color: COLORS.ink }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Printable Content */}
        <div id="sold-invoice-print-area" className="px-6 py-5">
          <div className="flex items-start justify-between flex-wrap gap-2 mb-4">
            <div>
              <h2 style={{ color: COLORS.accent, fontFamily: FONTS.HEAD, margin: 0 }}>
                Invoice #{invoice.invoice_no}
              </h2>
              <div className="text-xs mt-1" style={{ color: COLORS.muted }}>
                {branchName}{branchAddress ? ` — ${branchAddress}` : ""}
              </div>
            </div>
            <span
              className="badge inline-block rounded-md px-2.5 py-1 text-xs font-bold text-white"
              style={{ backgroundColor: badgeColor }}
            >
              {invoice.status || "Unpaid"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-4 text-sm">
            <div className="row flex justify-between py-1 border-b" style={{ borderColor: COLORS.line }}>
              <span className="label text-xs" style={{ color: COLORS.muted }}>Customer</span>
              <span className="value font-semibold" style={{ color: COLORS.ink }}>{customerName}</span>
            </div>
            <div className="row flex justify-between py-1 border-b" style={{ borderColor: COLORS.line }}>
              <span className="label text-xs" style={{ color: COLORS.muted }}>Phone</span>
              <span className="value font-semibold" style={{ color: COLORS.ink }}>{customerPhone}</span>
            </div>
            <div className="row flex justify-between py-1 border-b" style={{ borderColor: COLORS.line }}>
              <span className="label text-xs" style={{ color: COLORS.muted }}>Sale Date</span>
              <span className="value font-semibold" style={{ color: COLORS.ink }}>{saleDate}</span>
            </div>
            <div className="row flex justify-between py-1 border-b" style={{ borderColor: COLORS.line }}>
              <span className="label text-xs" style={{ color: COLORS.muted }}>Created At</span>
              <span className="value font-semibold" style={{ color: COLORS.ink }}>{createdAtFormatted}</span>
            </div>
          </div>

          {/* Line items */}
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: COLORS.paper }}>
                <th className="px-2.5 py-2 text-left text-xs font-bold uppercase" style={{ color: COLORS.accent }}>Product</th>
                <th className="px-2.5 py-2 text-left text-xs font-bold uppercase" style={{ color: COLORS.accent }}>Barcode</th>
                <th className="px-2.5 py-2 text-right text-xs font-bold uppercase" style={{ color: COLORS.accent }}>Qty</th>
                <th className="px-2.5 py-2 text-right text-xs font-bold uppercase" style={{ color: COLORS.accent }}>Unit Price</th>
                <th className="px-2.5 py-2 text-right text-xs font-bold uppercase" style={{ color: COLORS.accent }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-2.5 py-4 text-center text-xs" style={{ color: COLORS.muted }}>
                    No line items found.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b" style={{ borderColor: COLORS.line }}>
                    <td className="px-2.5 py-2 font-medium" style={{ color: COLORS.ink }}>
                      {item.product?.title || item.product_name || "N/A"}
                    </td>
                    <td className="px-2.5 py-2 text-xs" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>
                      {item.product?.barcode || "N/A"}
                    </td>
                    <td className="px-2.5 py-2 text-right" style={{ color: COLORS.ink }}>{item.quantity}</td>
                    <td className="px-2.5 py-2 text-right" style={{ color: COLORS.ink }}>৳{formatMoney(item.unit_price)}</td>
                    <td className="px-2.5 py-2 text-right font-semibold" style={{ color: COLORS.accent }}>৳{formatMoney(item.total)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mt-4 ml-auto max-w-xs space-y-1">
            <div className="row flex justify-between py-1 border-b" style={{ borderColor: COLORS.line }}>
              <span className="label text-xs" style={{ color: COLORS.muted }}>Sub Total</span>
              <span className="value" style={{ color: COLORS.ink }}>৳{formatMoney(invoice.sub_total)}</span>
            </div>
            <div className="row flex justify-between py-1 border-b" style={{ borderColor: COLORS.line }}>
              <span className="label text-xs" style={{ color: COLORS.muted }}>Discount</span>
              <span className="value" style={{ color: COLORS.ink }}>৳{formatMoney(invoice.discount)}</span>
            </div>
            <div className="row flex justify-between py-1 border-b" style={{ borderColor: COLORS.line }}>
              <span className="label text-xs" style={{ color: COLORS.muted }}>VAT</span>
              <span className="value" style={{ color: COLORS.ink }}>৳{formatMoney(invoice.vat)}</span>
            </div>
            <div className="row flex justify-between py-1 border-b" style={{ borderColor: COLORS.line }}>
              <span className="label text-xs font-bold" style={{ color: COLORS.ink }}>Total</span>
              <span className="value font-bold" style={{ color: COLORS.ink }}>৳{formatMoney(invoice.total)}</span>
            </div>
            <div className="row flex justify-between py-1 border-b" style={{ borderColor: COLORS.line }}>
              <span className="label text-xs font-bold" style={{ color: COLORS.ink }}>Paid</span>
              <span className="value font-bold" style={{ color: COLORS.teal }}>৳{formatMoney(invoice.paid)}</span>
            </div>
            <div className="row flex justify-between py-1">
              <span className="label text-xs font-bold" style={{ color: COLORS.ink }}>Due</span>
              <span className="value font-bold" style={{ color: Number(invoice.due) > 0 ? COLORS.rust : COLORS.ink }}>
                ৳{formatMoney(invoice.due)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4 border-t sticky bottom-0"
          style={{ borderColor: COLORS.line, backgroundColor: COLORS.panel }}
        >
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold transition-colors hover:opacity-80"
            style={{ backgroundColor: COLORS.paper, color: COLORS.ink }}
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: COLORS.forest }}
          >
            <Printer size={15} />
            Print
          </button>
        </div>
      </div>
    </div>
  );
}

export function SoldInvoices() {
  const [invNumber, setInvNumber] = useState("");
  const [nameOrPhone, setNameOrPhone] = useState("");
  const [dateType, setDateType] = useState("");

  // Applied filters — only updated when the user clicks "Search" or "Clear",
  // so typing doesn't refetch on every keystroke.
  const [appliedFilters, setAppliedFilters] = useState({ invNumber: "", nameOrPhone: "", dateType: "" });

  const [page, setPage] = useState(1);
  const [invoices, setInvoices] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0, from: 0, to: 0, per_page: 30 });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Detail modal state
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const loadInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchSoldInvoices({
        invoice_no: appliedFilters.invNumber,
        name_or_phone: appliedFilters.nameOrPhone,
        date_type: appliedFilters.dateType,
        page,
        per_page: meta.per_page,
        // এই ব্রাঞ্চ ইউজার শুধু নিজের ব্রাঞ্চের সোল্ড ইনভয়েসই দেখবে — main branch
        // এর ক্ষেত্রে SUB_BRANCH_ID না থাকায় filter apply হবে না, সব দেখাবে।
        ...(SUB_BRANCH_ID ? { branch_id: SUB_BRANCH_ID } : {}),
      });

      // Laravel pagination wrapper
      const data = response.data || [];
      let list = Array.isArray(data) ? data : [];

      // Safety net: backend যদি এখনো branch_id সাপোর্ট না করে, তাহলেও
      // sub-branch ইউজার অন্য ব্রাঞ্চের ইনভয়েস দেখবে না।
      if (SUB_BRANCH_ID) {
        list = list.filter((inv) => {
          const branchId = inv.branch_id ?? inv.branch?.id ?? null;
          return branchId != null && String(branchId) === String(SUB_BRANCH_ID);
        });
      }

      setInvoices(list);
      setMeta({
        current_page: response.current_page ?? 1,
        last_page: response.last_page ?? 1,
        total: response.total ?? data.length,
        from: response.from ?? 0,
        to: response.to ?? 0,
        per_page: response.per_page ?? meta.per_page,
      });
    } catch (err) {
      console.error("Error loading sold invoices:", err);
      setError("Failed to load invoices. Please try again.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters, page]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  function handleSearch() {
    setPage(1);
    setAppliedFilters({ invNumber, nameOrPhone, dateType });
  }

  function handleClear() {
    setInvNumber("");
    setNameOrPhone("");
    setDateType("");
    setPage(1);
    setAppliedFilters({ invNumber: "", nameOrPhone: "", dateType: "" });
  }

  // Build a compact page list: first, last, current +/-2, with ellipses
  function getPageNumbers() {
    const total = meta.last_page;
    const current = meta.current_page;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pagesSet = new Set([1, 2, total - 1, total, current - 1, current, current + 1]);
    return Array.from(pagesSet)
      .filter((p) => p >= 1 && p <= total)
      .sort((a, b) => a - b);
  }

  const pageNumbers = getPageNumbers();

  return (
    <div style={{ backgroundColor: COLORS.page, minHeight: "100vh" }} className="p-7 font-sans">
      <div className="mx-auto mb-6 h-1.5 max-w-6xl rounded-full bg-gradient-to-r from-pink-500 via-orange-400 via-teal-500 to-violet-600" />

      <div
        className="mx-auto max-w-6xl overflow-hidden rounded-2xl border relative"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
      >
        <ScallopBorder id="scallop-invoices-header" colors={PETALS} />

        {/* header */}
        <div className="border-b px-7 py-6" style={{ borderColor: COLORS.line }}>
          <h1
            className="mb-5 text-2xl font-bold tracking-tight"
            style={{ color: COLORS.accent, fontFamily: FONTS.HEAD }}
          >
            Sold Invoices
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <input
              value={invNumber}
              onChange={(e) => setInvNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Invoice Number [without #]"
              className="min-w-[220px] flex-1 rounded-xl border-[1.5px] px-3.5 py-2.5 text-sm outline-none"
              style={{
                borderColor: COLORS.line,
                backgroundColor: COLORS.paper,
                color: COLORS.ink,
                fontFamily: FONTS.BODY,
              }}
            />
            <input
              value={nameOrPhone}
              onChange={(e) => setNameOrPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Name or Phone Number"
              className="min-w-[220px] flex-1 rounded-xl border-[1.5px] px-3.5 py-2.5 text-sm outline-none"
              style={{
                borderColor: COLORS.line,
                backgroundColor: COLORS.paper,
                color: COLORS.ink,
                fontFamily: FONTS.BODY,
              }}
            />
            <select
              value={dateType}
              onChange={(e) => setDateType(e.target.value)}
              className="min-w-[200px] rounded-xl border-[1.5px] px-3.5 py-2.5 text-sm outline-none"
              style={{
                borderColor: COLORS.line,
                backgroundColor: COLORS.paper,
                color: COLORS.ink,
                fontFamily: FONTS.BODY,
              }}
            >
              <option value="">Select Date Type</option>
              <option>Created Date</option>
              <option>Invoice Date</option>
            </select>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: COLORS.teal }}
            >
              <Search className="h-4 w-4" />
              Search
            </button>
            <button
              onClick={handleClear}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: COLORS.rust }}
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>

        {/* ERROR NOTIFICATION */}
        {error && (
          <div className="mx-7 mt-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-semibold border border-red-200">
            {error}
          </div>
        )}

        {/* table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr style={{ backgroundColor: COLORS.ink }}>
                {["Date", "Customer Info", "Others Info", "Action"].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-white"
                    style={{ fontFamily: FONTS.HEAD }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center" style={{ color: COLORS.muted }}>
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin h-5 w-5" style={{ color: COLORS.accent }} />
                      <span>Loading invoices...</span>
                    </div>
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center" style={{ color: COLORS.muted }}>
                    No matching invoices found.
                  </td>
                </tr>
              ) : (
                invoices.map((inv, i) => {
                  const customerName =
                    typeof inv.customer === "object" && inv.customer !== null
                      ? inv.customer.name
                      : inv.customer || "Walking Customer";

                  const customerPhone =
                    typeof inv.customer === "object" && inv.customer !== null
                      ? inv.customer.phone
                      : inv.phone || "N/A";

                  const saleDate = inv.sale_date || inv.date;
                  const invoiceNo = inv.invoice_no || inv.invNum || inv.invoice_number;
                  const createdByName = inv.created_by_user?.name || inv.createdBy;
                  const createdByPhone = inv.created_by_user?.phone || inv.createdByPhone;
                  const createdAtFormatted = inv.created_at
                    ? new Date(inv.created_at).toLocaleString()
                    : inv.createdAt;

                  return (
                    <tr
                      key={inv.id ?? i}
                      className="border-b transition-colors"
                      style={{
                        borderColor: COLORS.line,
                        backgroundColor: i % 2 === 1 ? COLORS.paper + "20" : "transparent",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.paper + "40")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = i % 2 === 1 ? COLORS.paper + "20" : "transparent")}
                    >
                      <td className="px-4 py-4 align-top font-medium" style={{ color: COLORS.muted }}>
                        {saleDate}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.HEAD }}>
                          {customerName}
                        </div>
                        <div className="text-xs" style={{ color: COLORS.muted }}>
                          [{customerPhone}]
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top text-xs leading-relaxed">
                        <div style={{ color: COLORS.muted }}>
                          Inv Num: <span className="font-semibold" style={{ color: COLORS.accent }}>
                            #{invoiceNo}
                          </span>
                        </div>
                        {createdByName && (
                          <div style={{ color: COLORS.muted }}>
                            Created By:{" "}
                            <span className="font-semibold" style={{ color: COLORS.ink }}>
                              {createdByName}{createdByPhone ? ` (${createdByPhone})` : ""}
                            </span>
                          </div>
                        )}
                        <div style={{ color: COLORS.muted }}>
                          Created at: <span className="font-semibold" style={{ color: COLORS.teal }}>
                            {createdAtFormatted}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <ActionMenu invoice={inv} onViewInvoice={setSelectedInvoice} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* footer / pagination */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-7 py-6">
          <p className="text-sm" style={{ color: COLORS.muted }}>
            {meta.total > 0
              ? `Showing ${meta.from} to ${meta.to} of ${meta.total} entries`
              : "No entries"}
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={meta.current_page <= 1 || loading}
              className="flex h-8 w-8 items-center justify-center rounded-lg border-[1.5px] transition-colors hover:bg-opacity-50 disabled:opacity-40"
              style={{
                borderColor: COLORS.line,
                color: COLORS.muted,
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {pageNumbers.map((n, idx) => {
              const prev = pageNumbers[idx - 1];
              const showEllipsis = prev !== undefined && n - prev > 1;
              return (
                <React.Fragment key={n}>
                  {showEllipsis && <span style={{ color: COLORS.line }}>...</span>}
                  <button
                    onClick={() => setPage(n)}
                    disabled={loading}
                    className="h-8 w-8 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
                    style={{
                      borderBottom: meta.current_page === n ? `2px solid ${COLORS.forest}` : "none",
                      color: meta.current_page === n ? COLORS.forest : COLORS.muted,
                    }}
                  >
                    {n}
                  </button>
                </React.Fragment>
              );
            })}

            <button
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              disabled={meta.current_page >= meta.last_page || loading}
              className="flex h-8 w-8 items-center justify-center rounded-lg border-[1.5px] transition-colors hover:bg-opacity-50 disabled:opacity-40"
              style={{
                borderColor: COLORS.line,
                color: COLORS.muted,
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {selectedInvoice && (
        <InvoiceDetailModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      )}
    </div>
  );
}

export default SoldInvoices;