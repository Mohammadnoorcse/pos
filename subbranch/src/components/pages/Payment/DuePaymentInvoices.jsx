import React, { useState, useEffect, useCallback } from "react";
import { Search, Loader2, RefreshCw, X, Printer } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { COLORS, PETALS, FONTS, SUB_BRANCH_ID } from "../../../constants";
import { fetchDueInvoices, toggleInvoicePaymentStatus } from "../../../api/duePaymentService";

export function DuePaymentInvoices() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState("100");

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

  // Modal state for invoice details
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Fetch data from API
  const loadInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchDueInvoices({
        from_date: fromDate,
        to_date: toDate,
        search: search,
        per_page: perPage,
        // Sub-branch ইউজার শুধু নিজের ব্রাঞ্চের due invoice-ই দেখবে — main branch
        // এ SUB_BRANCH_ID না থাকায় filter apply হবে না, সব ব্রাঞ্চ দেখাবে।
        ...(SUB_BRANCH_ID ? { branch_id: SUB_BRANCH_ID } : {}),
      });

      // Handle Laravel pagination wrapper (response.data.data) or simple array (response.data / response)
      const data = response.data?.data || response.data || response || [];
      let list = Array.isArray(data) ? data : [];

      // Safety net: if the backend doesn't yet honor branch_id, filter client-side
      // so sub-branch users never see another branch's invoices.
      if (SUB_BRANCH_ID) {
        list = list.filter((inv) => {
          const branchId = inv.branch_id ?? inv.branch?.id ?? null;
          return branchId != null && String(branchId) === String(SUB_BRANCH_ID);
        });
      }

      setInvoices(list);
    } catch (err) {
      console.error("Error loading due invoices:", err);
      setError("Failed to load invoice records. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, search, perPage]);

  // Initial load & automatic refetch when search or entries count change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadInvoices();
    }, 300); // 300ms debounce for search input

    return () => clearTimeout(timer);
  }, [loadInvoices]);

  // Handle Filter Button Click
  const handleFilter = (e) => {
    e.preventDefault();
    loadInvoices();
  };

  // Toggle Invoice Paid / Unpaid Status
  async function handleToggleStatus(inv) {
    const targetId = inv.id;
    const isCurrentlyPaid = inv.status === "Paid" || inv.paid === true;

    try {
      setUpdatingId(targetId);

      // Optimistic state update
      setInvoices((prev) =>
        prev.map((item) =>
          item.id === targetId
            ? { ...item, status: isCurrentlyPaid ? "Due" : "Paid", paid: !isCurrentlyPaid }
            : item
        )
      );

      await toggleInvoicePaymentStatus(targetId, isCurrentlyPaid);
    } catch (err) {
      console.error("Failed to update status:", err);
      // Revert status on failure
      setInvoices((prev) =>
        prev.map((item) =>
          item.id === targetId
            ? { ...item, status: isCurrentlyPaid ? "Paid" : "Due", paid: isCurrentlyPaid }
            : item
        )
      );
      alert("Could not update invoice status. Please check your network.");
    } finally {
      setUpdatingId(null);
    }
  }

  // Open the detail modal for a given invoice
  function handleOpenInvoice(inv) {
    setSelectedInvoice(inv);
  }

  function handleCloseModal() {
    setSelectedInvoice(null);
  }

  // Print only the modal's invoice content
  function handlePrintInvoice() {
    const printContents = document.getElementById("invoice-print-area")?.innerHTML;
    if (!printContents) return;

    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: sans-serif; padding: 24px; color: #222; }
            h2 { margin-bottom: 4px; }
            .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #eee; }
            .label { color: #777; font-size: 13px; }
            .value { font-weight: 600; font-size: 14px; }
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
    <div style={{ backgroundColor: COLORS.page, minHeight: "100vh" }} className="p-7 font-sans">
      <div className="mx-auto mb-6 h-1.5 max-w-6xl rounded-full bg-gradient-to-r from-pink-500 via-orange-400 via-teal-500 to-violet-600" />

      <div
        className="mx-auto max-w-6xl overflow-hidden rounded-2xl border relative"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
      >
        <ScallopBorder id="scallop-due-payment-header" colors={PETALS} />

        {/* HEADER & FILTER FORM */}
        <div className="border-b px-7 py-6" style={{ borderColor: COLORS.line }}>
          <div className="flex items-center justify-between mb-5">
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: COLORS.accent, fontFamily: FONTS.HEAD }}
            >
              Due Date Received Payment Invoices
            </h1>
            <button
              onClick={loadInvoices}
              disabled={loading}
              className="p-2 rounded-lg border hover:bg-black/5 transition-colors"
              style={{ borderColor: COLORS.line, color: COLORS.ink }}
              title="Refresh Data"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          <form onSubmit={handleFilter} className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                className="text-sm font-semibold"
                style={{ color: COLORS.ink, fontFamily: FONTS.HEAD }}
              >
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="rounded-xl border-[1.5px] px-3.5 py-2.5 text-sm outline-none"
                style={{
                  borderColor: COLORS.line,
                  backgroundColor: COLORS.paper,
                  color: COLORS.ink,
                  fontFamily: FONTS.BODY,
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                className="text-sm font-semibold"
                style={{ color: COLORS.ink, fontFamily: FONTS.HEAD }}
              >
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="rounded-xl border-[1.5px] px-3.5 py-2.5 text-sm outline-none"
                style={{
                  borderColor: COLORS.line,
                  backgroundColor: COLORS.paper,
                  color: COLORS.ink,
                  fontFamily: FONTS.BODY,
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: COLORS.forest }}
            >
              Filter
            </button>
          </form>
        </div>

        {/* CONTROLS (PAGINATION / SEARCH) */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-7 pt-5">
          <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.muted }}>
            <span>Show</span>
            <select
              value={perPage}
              onChange={(e) => setPerPage(e.target.value)}
              className="rounded-lg border-[1.5px] px-2.5 py-1.5 text-sm outline-none cursor-pointer"
              style={{
                borderColor: COLORS.line,
                backgroundColor: COLORS.paper,
                color: COLORS.ink,
                fontFamily: FONTS.BODY,
              }}
            >
              <option value="100">100</option>
              <option value="50">50</option>
              <option value="25">25</option>
              <option value="10">10</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: COLORS.muted }}>
              Search:
            </span>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: COLORS.line }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer..."
                className="w-56 rounded-xl border-[1.5px] py-2 pl-9 pr-3 text-sm outline-none"
                style={{
                  borderColor: COLORS.line,
                  backgroundColor: COLORS.paper,
                  color: COLORS.ink,
                  fontFamily: FONTS.BODY,
                }}
              />
            </div>
          </div>
        </div>

        {/* ERROR NOTIFICATION */}
        {error && (
          <div className="mx-7 mt-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-semibold border border-red-200">
            {error}
          </div>
        )}

        {/* TABLE */}
        <div className="mt-5 overflow-x-auto px-7 pb-7">
          <table className="w-full min-w-[800px] border-collapse text-sm">
            <thead>
              <tr style={{ backgroundColor: COLORS.paper }}>
                {["Date", "Customer Info", "Others Info", "Action"].map((h, i) => (
                  <th
                    key={h}
                    className={`whitespace-nowrap border-b-2 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide ${
                      i === 0 ? "rounded-tl-xl" : ""
                    } ${i === 3 ? "rounded-tr-xl" : ""}`}
                    style={{
                      borderColor: COLORS.line,
                      color: COLORS.accent,
                      fontFamily: FONTS.HEAD,
                    }}
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
                  const currentId = inv.id || i;
                  const isUpdating = updatingId === currentId;

                  // Extract customer details safely
                  const customerName =
                    typeof inv.customer === "object" && inv.customer !== null
                      ? inv.customer.name
                      : inv.customer || "Walking Customer";

                  const customerPhone =
                    typeof inv.customer === "object" && inv.customer !== null
                      ? inv.customer.phone
                      : inv.phone || "N/A";

                  // Status & Dates mapping from Laravel Schema
                  const isPaid = inv.status === "Paid" || inv.paid === true;
                  const saleDate = inv.sale_date || inv.date;
                  const invoiceNo = inv.invoice_no || inv.invNum || inv.invoice_number;
                  const createdAtFormatted = inv.created_at
                    ? new Date(inv.created_at).toLocaleString()
                    : inv.createdAt;

                  return (
                    <tr
                      key={currentId}
                      className="border-b transition-colors"
                      style={{ borderColor: COLORS.line }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = COLORS.paper + "40")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <td className="px-4 py-4 align-top font-medium" style={{ color: COLORS.muted }}>
                        {saleDate}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div
                          className="font-semibold"
                          style={{ color: COLORS.ink, fontFamily: FONTS.HEAD }}
                        >
                          {customerName}
                        </div>
                        <div className="text-xs" style={{ color: COLORS.muted }}>
                          [{customerPhone}]
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top text-xs leading-relaxed">
                        <span
                          className="mb-1.5 inline-block rounded-md px-2.5 py-1 text-xs font-bold text-white"
                          style={{
                            backgroundColor: isPaid ? COLORS.teal : COLORS.muted,
                          }}
                        >
                          {isPaid ? "Paid" : inv.status || "Unpaid"}
                        </span>
                        <div style={{ color: COLORS.muted }}>
                          Inv Num:{" "}
                          <span className="font-semibold" style={{ color: COLORS.accent }}>
                            {invoiceNo}
                          </span>
                        </div>
                        <div className="mb-1.5" style={{ color: COLORS.muted }}>
                          Created at:{" "}
                          <span className="font-semibold" style={{ color: COLORS.ink }}>
                            {createdAtFormatted}
                          </span>
                        </div>
                        <button
                          onClick={() => handleToggleStatus(inv)}
                          disabled={isUpdating}
                          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold text-white transition-colors hover:opacity-90 disabled:opacity-50"
                          style={{
                            backgroundColor: isPaid ? COLORS.rust : COLORS.teal,
                          }}
                        >
                          {isUpdating && <Loader2 className="animate-spin h-3 w-3" />}
                          {isPaid ? "Click To Unpaid" : "Click To Paid"}
                        </button>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <button
                          onClick={() => handleOpenInvoice(inv)}
                          className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
                          style={{ backgroundColor: COLORS.forest }}
                        >
                          Invoice
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INVOICE DETAIL MODAL */}
      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={handleCloseModal}
          onPrint={handlePrintInvoice}
        />
      )}
    </div>
  );
}

function InvoiceModal({ invoice, onClose, onPrint }) {
  const customerName =
    typeof invoice.customer === "object" && invoice.customer !== null
      ? invoice.customer.name
      : invoice.customer || "Walking Customer";

  const customerPhone =
    typeof invoice.customer === "object" && invoice.customer !== null
      ? invoice.customer.phone
      : invoice.phone || "N/A";

  const isPaid = invoice.status === "Paid";
  const badgeColor = isPaid ? COLORS.teal : invoice.status === "Partial" ? COLORS.rust : COLORS.muted;

  const invoiceNo = invoice.invoice_no || invoice.invNum || invoice.invoice_number;
  const saleDate = invoice.sale_date || invoice.date;
  const createdAtFormatted = invoice.created_at
    ? new Date(invoice.created_at).toLocaleString()
    : invoice.createdAt;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: COLORS.panel }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: COLORS.line }}
        >
          <h2
            className="text-lg font-bold"
            style={{ color: COLORS.accent, fontFamily: FONTS.HEAD }}
          >
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
        <div id="invoice-print-area" className="px-6 py-5">
          <h2 style={{ color: COLORS.accent, fontFamily: FONTS.HEAD }}>
            Invoice #{invoiceNo}
          </h2>
          <div className="mb-3">
            <span
              className="badge inline-block rounded-md px-2.5 py-1 text-xs font-bold text-white"
              style={{ backgroundColor: badgeColor }}
            >
              {invoice.status || (isPaid ? "Paid" : "Unpaid")}
            </span>
          </div>

          <DetailRow label="Customer Name" value={customerName} />
          <DetailRow label="Phone" value={customerPhone} />
          <DetailRow label="Sale Date" value={saleDate} />
          <DetailRow label="Created At" value={createdAtFormatted} />
          <DetailRow label="Sub Total" value={invoice.sub_total} />
          <DetailRow label="Discount" value={invoice.discount} />
          <DetailRow label="VAT" value={invoice.vat} />
          <DetailRow label="Total" value={invoice.total} bold />
          <DetailRow label="Paid Amount" value={invoice.paid} bold />
          <DetailRow label="Due Amount" value={invoice.due} bold />
        </div>

        {/* Modal Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4 border-t"
          style={{ borderColor: COLORS.line }}
        >
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold transition-colors hover:opacity-80"
            style={{ backgroundColor: COLORS.paper, color: COLORS.ink }}
          >
            Close
          </button>
          <button
            onClick={onPrint}
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

function DetailRow({ label, value, bold }) {
  return (
    <div className="row flex items-center justify-between py-1.5 border-b" style={{ borderColor: COLORS.line }}>
      <span className="label text-xs" style={{ color: COLORS.muted }}>
        {label}
      </span>
      <span
        className={`value text-sm ${bold ? "font-bold" : "font-semibold"}`}
        style={{ color: COLORS.ink }}
      >
        {value ?? "N/A"}
      </span>
    </div>
  );
}

export default DuePaymentInvoices;