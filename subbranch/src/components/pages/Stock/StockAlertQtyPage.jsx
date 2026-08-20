import React, { useState, useEffect, useCallback } from "react";
import { Bell, Package, Search, ChevronDown, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { COLORS, PETALS, FONTS, SUB_BRANCH_ID } from "../../../constants";
import { stockAlertSeverity } from "../../../utils";
import { fetchStockAlerts } from "../../../api/productStockService.js";

export function StockAlertQtyPage({ branchId: branchIdProp = null }) {
  // Sub-branch হলে সবসময় নিজের SUB_BRANCH_ID ব্যবহার হবে (অন্য ব্রাঞ্চের ডেটা আসবে না)।
  // Main branch হলে (SUB_BRANCH_ID নেই) parent থেকে দেওয়া branchIdProp (থাকলে) ব্যবহার হবে,
  // নাহলে filter ছাড়া সব ব্রাঞ্চ মিলিয়ে দেখাবে।
  const branchId = SUB_BRANCH_ID ? String(SUB_BRANCH_ID) : branchIdProp;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination State
  const [query, setQuery] = useState("");
  const [showEntries, setShowEntries] = useState("100");
  const [page, setPage] = useState(1);

  // Pagination Metadata from Laravel API
  const [paginationMeta, setPaginationMeta] = useState({
    total: 0,
    from: 0,
    to: 0,
    lastPage: 1,
  });

  // Fetch API Data
  const loadAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        per_page: showEntries,
      };

      if (query.trim()) params.search = query.trim();
      if (branchId) params.branch_id = branchId;

      const res = await fetchStockAlerts(params);

      // Map API response to Component State
      setItems(res.data || []);
      setPaginationMeta({
        total: res.total || 0,
        from: res.from || 0,
        to: res.to || 0,
        lastPage: res.last_page || 1,
      });
    } catch (err) {
      console.error("Error fetching stock alerts:", err);
      setError("স্টক অ্যালার্ট তথ্য লোড করতে ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  }, [page, showEntries, query, branchId]);

  // Debounce API Call on Search & Immediate Call on Page/Limit Change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadAlerts();
    }, 300);

    return () => clearTimeout(timer);
  }, [loadAlerts]);

  return (
    <div
      className="relative rounded-2xl border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-stock-alert-qty" colors={PETALS} />

      {/* HEADER */}
      <div
        className="p-5 pt-7 pb-4 flex items-center justify-between flex-wrap gap-3"
        style={{ borderBottom: `1px dashed ${COLORS.line}` }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: COLORS.peacockTint, color: COLORS.peacock }}
          >
            <Bell size={16} strokeWidth={2.2} />
          </div>
          <div>
            <h2
              className="font-bold text-[16px] leading-tight"
              style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
            >
              Stock Alert Quantity
            </h2>
            <p className="text-[11.5px]" style={{ color: COLORS.muted }}>
              যেসব পণ্যের মজুদ Alert Quantity-তে বা তার নিচে পৌঁছেছে
            </p>
          </div>
        </div>
        <span
          className="text-[11px] font-bold px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: COLORS.vermillionTint,
            color: COLORS.vermillion,
          }}
        >
          {paginationMeta.total} {paginationMeta.total === 1 ? "item" : "items"} need attention
        </span>
      </div>

      {/* SHOW ENTRIES + SEARCH */}
      <div className="px-5 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-[12.5px] font-medium" style={{ color: COLORS.muted }}>
          Show
          <div className="relative">
            <select
              value={showEntries}
              onChange={(e) => {
                setShowEntries(e.target.value);
                setPage(1);
              }}
              className="appearance-none rounded-lg pl-2.5 pr-6 py-1.5 text-[12.5px] font-semibold border outline-none cursor-pointer"
              style={{
                backgroundColor: COLORS.paper,
                borderColor: COLORS.line,
                color: COLORS.ink,
                fontFamily: FONTS.BODY,
              }}
            >
              {["10", "25", "50", "100"].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: COLORS.muted }}
            />
          </div>
          entries
        </div>

        <div
          className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] border"
          style={{
            backgroundColor: COLORS.paper,
            borderColor: COLORS.line,
            color: COLORS.muted,
          }}
        >
          <span className="text-[12.5px] font-semibold" style={{ color: COLORS.ink }}>
            Search:
          </span>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Name or barcode..."
            className="bg-transparent outline-none text-[13px] w-40"
            style={{ color: COLORS.ink, fontFamily: FONTS.BODY }}
          />
          <Search size={14} />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto px-5">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left" style={{ color: COLORS.muted }}>
              <th
                className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                style={{ borderColor: COLORS.line }}
              >
                Product Name
              </th>
              <th
                className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                style={{ borderColor: COLORS.line }}
              >
                Product Barcode
              </th>
              <th
                className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-center"
                style={{ borderColor: COLORS.line }}
              >
                Alert Quantity
              </th>
              <th
                className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-center"
                style={{ borderColor: COLORS.line }}
              >
                Current Stock
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    <span>ডাটা লোড হচ্ছে...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-10 text-center text-[13px]"
                  style={{ color: COLORS.muted }}
                >
                  No low-stock products match your criteria.
                </td>
              </tr>
            ) : (
              items.map((item, i) => {
                // Normalize snake_case API data for utility function
                const normalizedItem = {
                  ...item,
                  name: item.title || item.name,
                  alertQty: item.alert_quantity ?? item.alertQty,
                  currentStock: item.current_stock ?? item.currentStock,
                };

                const severity = stockAlertSeverity(normalizedItem);

                return (
                  <tr
                    key={item.id}
                    style={
                      i !== items.length - 1
                        ? { borderBottom: `1px dashed ${COLORS.line}` }
                        : undefined
                    }
                  >
                    <td className="py-3.5 px-2.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: severity.bg,
                            color: severity.color,
                          }}
                        >
                          <Package size={14} />
                        </div>
                        <span className="font-semibold" style={{ color: COLORS.ink }}>
                          {item.title || item.name}
                        </span>
                      </div>
                    </td>
                    <td
                      className="py-3.5 px-2.5"
                      style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}
                    >
                      {item.barcode || "—"}
                    </td>
                    <td
                      className="py-3.5 px-2.5 text-center font-semibold"
                      style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}
                    >
                      {item.alert_quantity}
                    </td>
                    <td className="py-3.5 px-2.5 text-center">
                      <span
                        className="text-[12.5px] font-bold px-2.5 py-1 rounded-lg"
                        style={{
                          backgroundColor: severity.bg,
                          color: severity.color,
                          fontFamily: FONTS.MONO,
                        }}
                        title={severity.label}
                      >
                        {item.current_stock}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER: Entry count + Pagination */}
      <div
        className="px-5 py-4 mt-2 flex items-center justify-between flex-wrap gap-3"
        style={{ borderTop: `1px dashed ${COLORS.line}` }}
      >
        <span className="text-[12.5px]" style={{ color: COLORS.muted }}>
          {paginationMeta.total === 0
            ? "Showing 0 entries"
            : `Showing ${paginationMeta.from} to ${paginationMeta.to} of ${paginationMeta.total} entries`}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            className="flex items-center gap-1 text-[12.5px] font-semibold px-3 py-1.5 rounded-lg border disabled:opacity-40"
            style={{
              borderColor: COLORS.line,
              color: COLORS.muted,
              backgroundColor: COLORS.panel,
            }}
          >
            <ChevronLeft size={13} /> Previous
          </button>
          <span
            className="text-[12.5px] font-bold w-8 h-8 flex items-center justify-center rounded-lg"
            style={{
              backgroundColor: COLORS.peacockTint,
              color: COLORS.peacock,
              fontFamily: FONTS.MONO,
            }}
          >
            {page}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(paginationMeta.lastPage, p + 1))}
            disabled={page >= paginationMeta.lastPage || loading}
            className="flex items-center gap-1 text-[12.5px] font-semibold px-3 py-1.5 rounded-lg border disabled:opacity-40"
            style={{
              borderColor: COLORS.line,
              color: COLORS.muted,
              backgroundColor: COLORS.panel,
            }}
          >
            Next <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}