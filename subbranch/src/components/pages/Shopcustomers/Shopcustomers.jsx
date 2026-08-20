import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Printer,
  ChevronDown,
  User,
  Phone,
  Mail,
  MapPin,
  Wallet,
  ChevronLeft,
  X,
  ShoppingBag,
  RotateCcw,
  Banknote,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { COLORS, PETALS, FONTS, SUB_BRANCH_ID } from "../../../constants";

// 🔗 API সার্ভিস ইমপোর্ট করুন (আপনার ফাইল পাথ অনুযায়ী পাথ ঠিক করে নিন)
import {
  fetchCustomers,
  fetchCustomerHistory,
} from "../../../api/customerService.js";

// =================================================================
// 1. ACTION MENU COMPONENT  (fixed-position dropdown, no clipping)
// =================================================================
function ActionMenu({ onLedger, onHistory }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, openUp: false });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const items = [
    { label: "Active", style: `bg-teal-500 text-white hover:bg-teal-600` },
    {
      label: "Edit",
      style: `text-slate-700 hover:bg-opacity-50`,
      bg: COLORS.paper,
    },
    {
      label: "Ledger",
      style: `text-slate-700 hover:bg-opacity-50`,
      bg: COLORS.paper,
      action: onLedger,
    },
    {
      label: "Purchase History",
      style: `text-slate-700 hover:bg-opacity-50`,
      bg: COLORS.paper,
      action: onHistory,
    },
    {
      label: "Take Payment",
      style: `text-slate-700 hover:bg-opacity-50`,
      bg: COLORS.paper,
    },
  ];

  const MENU_WIDTH = 224; // w-56
  const MENU_HEIGHT_ESTIMATE = items.length * 40 + 16;

  const computePosition = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const viewportW = window.innerWidth;

    const spaceBelow = viewportH - rect.bottom;
    const openUp =
      spaceBelow < MENU_HEIGHT_ESTIMATE && rect.top > MENU_HEIGHT_ESTIMATE;

    let left = rect.right - MENU_WIDTH;
    left = Math.max(8, Math.min(left, viewportW - MENU_WIDTH - 8));

    const top = openUp ? rect.top - 6 : rect.bottom + 6;

    setPos({ top, left, openUp });
  }, []);

  useEffect(() => {
    if (!open) return;
    computePosition();

    function handleClickOutside(e) {
      if (
        btnRef.current &&
        !btnRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    function handleReposition() {
      computePosition();
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [open, computePosition]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
        style={{ backgroundColor: COLORS.forest }}
      >
        Action
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div
          ref={menuRef}
          className="fixed z-[999] w-56 overflow-hidden rounded-xl border py-1.5 shadow-[0_8px_24px_rgba(76,50,179,0.14)]"
          style={{
            top: pos.top,
            left: pos.left,
            transform: pos.openUp ? "translateY(-100%)" : "none",
            backgroundColor: COLORS.panel,
            borderColor: COLORS.line,
          }}
        >
          {items.map((it) => (
            <button
              key={it.label}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                it.action && it.action();
              }}
              className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm font-medium transition-colors hover:bg-black/5`}
              style={{ color: COLORS.ink }}
            >
              <span>{it.label}</span>
              {it.tag && (
                <span
                  className="text-xs font-semibold"
                  style={{ color: COLORS.rust }}
                >
                  ({it.tag})
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

// =================================================================
// 2. CUSTOMER HISTORY MODAL (API INTEGRATED)
// =================================================================
function CustomerHistoryModal({ customer, onClose }) {
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState({
    summary: {
      total_purchase: 0,
      total_payment: 0,
      total_return: 0,
      total_due: 0,
    },
    timeline: [],
    products: [],
  });

  useEffect(() => {
    if (customer?.id) {
      setLoading(true);
      fetchCustomerHistory(customer.id)
        .then((data) => {
          setHistoryData({
            summary: data.summary || {},
            timeline: data.timeline || [],
            products: data.products || [],
          });
        })
        .catch((err) => console.error("Error fetching history:", err))
        .finally(() => setLoading(false));
    }
  }, [customer]);

  const { summary, timeline } = historyData;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border relative"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        onClick={(e) => e.stopPropagation()}
      >
        <ScallopBorder id="scallop-history-modal" colors={PETALS} />

        {/* Header */}
        <div
          className="flex items-start justify-between gap-3 border-b px-4 py-4 sm:px-6 sm:py-5"
          style={{ borderColor: COLORS.line }}
        >
          <div className="min-w-0">
            <h2
              className="truncate text-base font-bold sm:text-lg"
              style={{ color: COLORS.accent, fontFamily: FONTS.HEAD }}
            >
              {customer.name} — Purchase &amp; Return History
            </h2>
            <p className="mt-0.5 text-xs" style={{ color: COLORS.muted }}>
              Phone: {customer.phone || "N/A"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 hover:opacity-70"
            style={{ color: COLORS.muted }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2
              className="h-8 w-8 animate-spin"
              style={{ color: COLORS.accent }}
            />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-white"
                style={{ backgroundColor: COLORS.teal }}
              >
                <ShoppingBag className="h-5 w-5 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-wide opacity-90">
                    Total Purchase
                  </div>
                  <div className="text-lg font-bold">
                    {Number(summary.total_purchase || 0).toFixed(2)}
                  </div>
                </div>
              </div>
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-white"
                style={{ backgroundColor: COLORS.forest }}
              >
                <Banknote className="h-5 w-5 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-wide opacity-90">
                    Total Payment
                  </div>
                  <div className="text-lg font-bold">
                    {Number(summary.total_payment || 0).toFixed(2)}
                  </div>
                </div>
              </div>
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-white"
                style={{ backgroundColor: COLORS.rust }}
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-wide opacity-90">
                    Total Due
                  </div>
                  <div className="text-lg font-bold">
                    {Number(summary.total_due || 0).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Total Return Note */}
            {summary.total_return > 0 && (
              <div
                className="px-4 pb-1 text-xs font-medium sm:px-6"
                style={{ color: COLORS.muted }}
              >
                Includes total returned products worth{" "}
                <span className="font-bold" style={{ color: COLORS.rust }}>
                  {Number(summary.total_return).toFixed(2)}
                </span>
                .
              </div>
            )}

            {/* Timeline Table */}
            <div className="mt-2 flex-1 overflow-y-auto overflow-x-auto px-4 pb-4 sm:px-6 sm:pb-6">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr style={{ backgroundColor: COLORS.paper }}>
                    {["Ref/ID", "Type", "Date", "Note", "Amount"].map(
                      (h, i) => (
                        <th
                          key={h}
                          className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide ${
                            i === 0 ? "rounded-tl-lg" : ""
                          } ${i === 4 ? "rounded-tr-lg" : ""}`}
                          style={{
                            borderColor: COLORS.line,
                            color: COLORS.accent,
                            fontFamily: FONTS.HEAD,
                          }}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {timeline.map((e, idx) => (
                    <tr
                      key={e.id || idx}
                      className="border-b"
                      style={{ borderColor: COLORS.line }}
                    >
                      <td
                        className="px-3 py-2.5 font-semibold"
                        style={{ color: COLORS.ink }}
                      >
                        {e.id}
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className="rounded-full px-2.5 py-1 text-xs font-bold text-white capitalize"
                          style={{
                            backgroundColor:
                              e.type === "purchase"
                                ? COLORS.teal
                                : e.type === "payment"
                                  ? COLORS.forest
                                  : COLORS.rust,
                          }}
                        >
                          {e.type}
                        </span>
                      </td>
                      <td
                        className="px-3 py-2.5 whitespace-nowrap"
                        style={{ color: COLORS.muted }}
                      >
                        {e.date}
                      </td>
                      <td
                        className="px-3 py-2.5"
                        style={{ color: COLORS.muted }}
                      >
                        {e.note}
                      </td>
                      <td
                        className="px-3 py-2.5 font-semibold whitespace-nowrap"
                        style={{
                          color:
                            e.type === "purchase"
                              ? COLORS.teal
                              : e.type === "payment"
                                ? COLORS.forest
                                : COLORS.rust,
                        }}
                      >
                        {Number(e.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {timeline.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-8 text-center"
                        style={{ color: COLORS.muted }}
                      >
                        No history found for this customer.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// =================================================================
// 3. CUSTOMER LEDGER VIEW (API INTEGRATED)
// =================================================================
function CustomerLedger({ customer, onBack }) {
  const [tab, setTab] = useState("Invoice");
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState({
    summary: {
      total_purchase: 0,
      total_payment: 0,
      total_return: 0,
      total_due: 0,
    },
    timeline: [],
  });

  useEffect(() => {
    if (customer?.id) {
      setLoading(true);
      fetchCustomerHistory(customer.id)
        .then((data) => {
          setHistoryData({
            summary: data.summary || {},
            timeline: data.timeline || [],
          });
        })
        .catch((err) => console.error("Error fetching ledger history:", err))
        .finally(() => setLoading(false));
    }
  }, [customer]);

  const { summary, timeline } = historyData;

  const rows = [
    {
      label: "Total Sell (Purchase)",
      value: Number(summary.total_purchase || 0).toFixed(2),
      tone: "green",
    },
    {
      label: "Total Payment",
      value: Number(summary.total_payment || 0).toFixed(2),
      tone: "red",
    },
    {
      label: "Total Return",
      value: Number(summary.total_return || 0).toFixed(2),
      tone: "red",
    },
  ];

  const filteredTimeline = timeline.filter((item) => {
    if (tab === "Invoice") return item.type === "purchase";
    if (tab === "Payment") return item.type === "payment";
    if (tab === "Returned Product") return item.type === "return";
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-sm font-semibold hover:opacity-80"
        style={{ color: COLORS.accent, fontFamily: FONTS.HEAD }}
      >
        <ChevronLeft className="h-4 w-4" />
        Back to customers
      </button>

      <div className="flex flex-col gap-5 lg:flex-row">
        {/* Balance Sheet Card */}
        <div
          className="flex-1 overflow-hidden rounded-2xl border relative"
          style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        >
          <ScallopBorder id="scallop-ledger-balance" colors={PETALS} />

          <div
            className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-4 sm:px-6 sm:py-5"
            style={{ borderColor: COLORS.line }}
          >
            <h1
              className="text-lg font-bold sm:text-xl"
              style={{ color: COLORS.muted, fontFamily: FONTS.HEAD }}
            >
              Customer Ledger
            </h1>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2
                className="h-8 w-8 animate-spin"
                style={{ color: COLORS.accent }}
              />
            </div>
          ) : (
            <div className="overflow-x-auto p-4 sm:p-6">
              <table className="w-full min-w-[400px] overflow-hidden rounded-xl border-collapse text-sm">
                <thead>
                  <tr style={{ backgroundColor: COLORS.ink }}>
                    <th
                      colSpan={2}
                      className="px-4 py-3 text-center text-sm font-bold tracking-wide text-white"
                    >
                      Balance Sheet
                    </th>
                  </tr>
                  <tr className="border-b" style={{ borderColor: COLORS.line }}>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                      style={{ color: COLORS.muted }}
                    >
                      Info
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                      style={{ color: COLORS.muted }}
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.label}
                      className="border-b"
                      style={{ borderColor: COLORS.line }}
                    >
                      <td
                        className="px-4 py-3 font-medium"
                        style={{ color: COLORS.ink }}
                      >
                        {r.label}
                      </td>
                      <td className="p-0">
                        <div
                          className="px-4 py-3 font-semibold"
                          style={{
                            backgroundColor:
                              r.tone === "green" ? "#0d9488" : "#C23B6D",
                            color: "white",
                          }}
                        >
                          ৳ {r.value}
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td
                      className="px-4 py-3 font-bold text-base"
                      colSpan={2}
                      style={{ color: COLORS.ink }}
                    >
                      Calculated Balance (Due) = ৳{" "}
                      {Number(summary.total_due || 0).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Tabs */}
          <div
            className="flex flex-wrap gap-4 border-t px-4 py-4 sm:gap-6 sm:px-6"
            style={{ borderColor: COLORS.line }}
          >
            {["Invoice", "Payment", "Returned Product"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="text-sm font-semibold transition-colors"
                style={{
                  color: tab === t ? COLORS.accent : COLORS.muted,
                  fontFamily: FONTS.HEAD,
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Tab Details */}
          <div className="overflow-x-auto px-4 pb-6 text-sm sm:px-6">
            <table className="w-full min-w-[480px] border-collapse text-left">
              <thead>
                <tr className="border-b" style={{ borderColor: COLORS.line }}>
                  <th className="py-2">ID</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Note</th>
                  <th className="py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredTimeline.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b"
                    style={{ borderColor: COLORS.line }}
                  >
                    <td className="py-2 font-semibold">{item.id}</td>
                    <td
                      className="py-2 text-xs whitespace-nowrap"
                      style={{ color: COLORS.muted }}
                    >
                      {item.date}
                    </td>
                    <td
                      className="py-2 text-xs"
                      style={{ color: COLORS.muted }}
                    >
                      {item.note}
                    </td>
                    <td className="py-2 font-bold whitespace-nowrap">
                      ৳ {Number(item.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
                {filteredTimeline.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-4 text-center"
                      style={{ color: COLORS.muted }}
                    >
                      No {tab.toLowerCase()} entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Info Card */}
        <div
          className="w-full overflow-hidden rounded-2xl border lg:w-72 relative h-fit"
          style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        >
          <ScallopBorder id="scallop-customer-info" colors={PETALS} />

          <div
            className="flex items-center gap-2 px-5 py-4 text-sm font-bold uppercase tracking-wide text-white"
            style={{ backgroundColor: COLORS.ink }}
          >
            <User className="h-4 w-4" />
            Customer Info
          </div>
          <div className="space-y-4 px-5 py-5">
            <div
              className="flex items-center gap-3 text-sm font-semibold"
              style={{ color: COLORS.ink }}
            >
              <User
                className="h-4 w-4 shrink-0"
                style={{ color: COLORS.accent }}
              />
              <span className="break-words">{customer.name}</span>
            </div>
            <div
              className="flex items-center gap-3 text-sm"
              style={{ color: COLORS.muted }}
            >
              <Phone
                className="h-4 w-4 shrink-0"
                style={{ color: COLORS.accent }}
              />
              {customer.phone || "N/A"}
            </div>
            <div
              className="flex items-center gap-3 text-sm"
              style={{ color: COLORS.muted }}
            >
              <MapPin
                className="h-4 w-4 shrink-0"
                style={{ color: COLORS.accent }}
              />
              <span className="break-words">{customer.address || "N/A"}</span>
            </div>
            <div
              className="flex items-center gap-3 text-sm font-bold"
              style={{ color: COLORS.teal }}
            >
              <Wallet
                className="h-4 w-4 shrink-0"
                style={{ color: COLORS.accent }}
              />
              Due: ৳ {Number(summary.total_due || 0).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =================================================================
// 4. MAIN SHOP CUSTOMERS COMPONENT
// =================================================================
export function ShopCustomers() {
  const [view, setView] = useState("list");
  const [search, setSearch] = useState("");
  const [historyCustomer, setHistoryCustomer] = useState(null);
  const [selectedLedgerCustomer, setSelectedLedgerCustomer] = useState(null);

  // API State
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, last_page: 1 });

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchCustomers({
        search,
        per_page: perPage,
        page,
        // Sub-branch ইউজার শুধু নিজের ব্রাঞ্চের কাস্টমারই দেখবে — main branch
        // এর ক্ষেত্রে SUB_BRANCH_ID না থাকায় filter apply হবে না, সব দেখাবে।
        ...(SUB_BRANCH_ID ? { branch_id: SUB_BRANCH_ID } : {}),
      });

      if (response.data) {
        setCustomers(response.data);
        setMeta({
          total: response.total || response.data.length,
          last_page: response.last_page || 1,
        });
      } else {
        setCustomers(Array.isArray(response) ? response : []);
      }
    } catch (error) {
      console.error("Failed to load customers:", error);
    } finally {
      setLoading(false);
    }
  }, [search, perPage, page]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  return (
    <div
      style={{ backgroundColor: COLORS.page, minHeight: "100vh" }}
      className="p-3 font-sans sm:p-7"
    >
      <div className="mx-auto mb-6 h-1.5 max-w-6xl rounded-full bg-gradient-to-r from-pink-500 via-orange-400 via-teal-500 to-violet-600" />

      {view === "ledger" && selectedLedgerCustomer ? (
        <CustomerLedger
          customer={selectedLedgerCustomer}
          onBack={() => setView("list")}
        />
      ) : (
        <div
          className="mx-auto max-w-6xl overflow-visible rounded-2xl border relative"
          style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        >
          <ScallopBorder id="scallop-customers-header" colors={PETALS} />

          {/* Header */}
          <div
            className="flex flex-wrap items-start justify-between gap-4 border-b px-4 py-5 sm:px-7 sm:py-6"
            style={{ borderColor: COLORS.line }}
          >
            <h1
              className="text-xl font-bold tracking-tight sm:text-2xl"
              style={{ color: COLORS.accent, fontFamily: FONTS.HEAD }}
            >
              Shop Customers
            </h1>

            <div className="flex items-center gap-4">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90 sm:px-5"
                style={{ backgroundColor: COLORS.teal }}
              >
                <Printer className="h-4 w-4" />
                Print List
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-5 sm:gap-4 sm:px-7">
            <div
              className="flex items-center gap-2 text-sm"
              style={{ color: COLORS.muted }}
            >
              <span>Show</span>
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="rounded-lg border-[1.5px] px-2.5 py-1.5 text-sm outline-none"
                style={{
                  borderColor: COLORS.line,
                  backgroundColor: COLORS.paper,
                  color: COLORS.ink,
                  fontFamily: FONTS.BODY,
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries</span>
            </div>

            <div className="flex w-full items-center gap-2 sm:w-auto">
              <span
                className="text-sm font-medium"
                style={{ color: COLORS.muted }}
              >
                Search:
              </span>
              <input
                value={search}
                placeholder="Search name / phone..."
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border-[1.5px] px-3.5 py-2 text-sm outline-none sm:w-56"
                style={{
                  borderColor: COLORS.line,
                  backgroundColor: COLORS.paper,
                  color: COLORS.ink,
                  fontFamily: FONTS.BODY,
                }}
              />
            </div>
          </div>

          {/* Customer Table */}
          <div className="mt-5 overflow-x-auto px-4 pb-7 sm:px-7">
            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <Loader2
                  className="h-8 w-8 animate-spin"
                  style={{ color: COLORS.accent }}
                />
              </div>
            ) : (
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr style={{ backgroundColor: COLORS.paper }}>
                    {[
                      "Customer Name",
                      "Phone",
                      "Branch ID",
                      "Sales Count",
                      "Action",
                    ].map((h, i) => (
                      <th
                        key={h}
                        className={`whitespace-nowrap border-b-2 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide ${
                          i === 0 ? "rounded-tl-xl" : ""
                        } ${i === 4 ? "rounded-tr-xl" : ""}`}
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
                  {customers.map((c) => (
                    <tr
                      key={c.id}
                      className="cursor-pointer border-b transition-colors"
                      style={{ borderColor: COLORS.line }}
                      onClick={() => setHistoryCustomer(c)}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          COLORS.paper + "40")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <td
                        className="px-4 py-4 font-semibold"
                        style={{ color: COLORS.ink }}
                      >
                        {c.name}
                      </td>
                      <td className="px-4 py-4" style={{ color: COLORS.muted }}>
                        {c.phone || "—"}
                      </td>
                      <td className="px-4 py-4" style={{ color: COLORS.muted }}>
                        {c.branch_id || "—"}
                      </td>
                      <td
                        className="px-4 py-4 font-medium"
                        style={{ color: COLORS.teal }}
                      >
                        {c.sales_count ?? 0} Sales
                      </td>
                      <td
                        className="px-4 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ActionMenu
                          onLedger={() => {
                            setSelectedLedgerCustomer(c);
                            setView("ledger");
                          }}
                          onHistory={() => setHistoryCustomer(c)}
                        />
                      </td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-10 text-center"
                        style={{ color: COLORS.muted }}
                      >
                        No matching customers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Customer History Modal */}
      {historyCustomer && (
        <CustomerHistoryModal
          customer={historyCustomer}
          onClose={() => setHistoryCustomer(null)}
        />
      )}
    </div>
  );
}