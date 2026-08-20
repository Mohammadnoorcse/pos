import React, { useState, useEffect, useCallback } from "react";
import {
  Wallet,
  CalendarDays,
  CalendarRange,
  TrendingUp,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { COLORS, PETALS, FONTS } from "../../../constants";
import {
  fetchCrmSummary,
  fetchCrmSoldProducts,
  fetchCrmSalesList,
} from "../../../api/crmSalesService";

const money = (v) =>
  "৳" + Number(v || 0).toLocaleString("en-BD", { maximumFractionDigits: 2 });

function SummaryCard({ icon: Icon, label, value, sub, accent, patternId }) {
  return (
    <div
      className="relative rounded-2xl border p-4 pt-5 overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id={patternId} colors={PETALS} />
      <div className="flex items-center justify-between mb-3 mt-1">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: accent + "22", color: accent }}
        >
          <Icon size={16} strokeWidth={2.2} />
        </div>
      </div>
      <div
        className="text-[12px] font-semibold mb-1"
        style={{ color: COLORS.muted, fontFamily: FONTS.BODY }}
      >
        {label}
      </div>
      <div
        className="text-[21px] font-bold tracking-tight"
        style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}
      >
        {value}
      </div>
      {sub && (
        <div
          className="text-[11px] font-medium mt-1"
          style={{ color: COLORS.muted, fontFamily: FONTS.BODY }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

const RANGES = [
  { key: "today", label: "আজকে" },
  { key: "month", label: "এই মাসে" },
  { key: "year", label: "এই বছরে" },
  { key: "all", label: "সর্বমোট" },
];

export function CrmSalesOverviewTab() {
  // KPI summary state
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  // Sub view: sold products vs invoice list
  const [view, setView] = useState("products"); // 'products' | 'invoices'
  const [range, setRange] = useState("today");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [rowsLoading, setRowsLoading] = useState(true);
  const [rowsError, setRowsError] = useState(null);

  // Load KPI summary once
  useEffect(() => {
    (async () => {
      try {
        setSummaryLoading(true);
        const data = await fetchCrmSummary();
        setSummary(data);
      } catch (err) {
        console.error("Error loading CRM summary:", err);
      } finally {
        setSummaryLoading(false);
      }
    })();
  }, []);

  const loadRows = useCallback(async () => {
    try {
      setRowsLoading(true);
      setRowsError(null);
      const params = { range, page, per_page: 10 };
      if (search) params.search = search;

      const data =
        view === "products"
          ? await fetchCrmSoldProducts(params)
          : await fetchCrmSalesList(params);

      setRows(data.data || []);
      setMeta({
        current_page: data.current_page || 1,
        last_page: data.last_page || 1,
        total: data.total || 0,
      });
    } catch (err) {
      console.error("Error loading CRM sales rows:", err);
      setRowsError("ডাটা লোড করতে সমস্যা হয়েছে।");
    } finally {
      setRowsLoading(false);
    }
  }, [view, range, search, page]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  // Reset to page 1 when switching view/range/search
  useEffect(() => {
    setPage(1);
  }, [view, range, search]);

  return (
    <div>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryLoading ? (
          <div className="col-span-full flex items-center justify-center py-8 gap-2" style={{ color: COLORS.muted }}>
            <Loader2 className="animate-spin" size={18} />
            <span>সামারি লোড হচ্ছে...</span>
          </div>
        ) : (
          <>
            <SummaryCard
              icon={CalendarDays}
              label="আজকের সেল"
              value={money(summary?.today?.total)}
              sub={`${summary?.today?.txns ?? 0}টি ইনভয়েস`}
              accent={COLORS.magenta}
              patternId="scallop-crm-today"
            />
            <SummaryCard
              icon={CalendarRange}
              label="এই মাসের সেল"
              value={money(summary?.this_month?.total)}
              sub={`${summary?.this_month?.txns ?? 0}টি ইনভয়েস`}
              accent={COLORS.peacock}
              patternId="scallop-crm-month"
            />
            <SummaryCard
              icon={TrendingUp}
              label="এই বছরের সেল"
              value={money(summary?.this_year?.total)}
              sub={`${summary?.this_year?.txns ?? 0}টি ইনভয়েস`}
              accent={COLORS.forest}
              patternId="scallop-crm-year"
            />
            <SummaryCard
              icon={Wallet}
              label="সর্বমোট সেল"
              value={money(summary?.all_time?.total)}
              sub={`${summary?.all_time?.txns ?? 0}টি ইনভয়েস (এখন পর্যন্ত)`}
              accent={COLORS.marigold}
              patternId="scallop-crm-alltime"
            />
          </>
        )}
      </div>

      {/* Toolbar: view switch + range filter + search */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: COLORS.line }}>
          {[
            { key: "products", label: "কি সেল হচ্ছে" },
            { key: "invoices", label: "কে সেল করলো" },
          ].map((v) => (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              className="px-4 py-2 text-[12.5px] font-semibold transition-colors"
              style={{
                backgroundColor: view === v.key ? COLORS.magenta : "transparent",
                color: view === v.key ? "#fff" : COLORS.muted,
                fontFamily: FONTS.BODY,
              }}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: COLORS.line }}>
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className="px-3 py-2 text-[12px] font-semibold transition-colors"
                style={{
                  backgroundColor: range === r.key ? COLORS.peacock : "transparent",
                  color: range === r.key ? "#fff" : COLORS.muted,
                  fontFamily: FONTS.BODY,
                }}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2"
              style={{ color: COLORS.muted }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={view === "products" ? "প্রোডাক্ট খুঁজুন..." : "ইনভয়েস/কাস্টমার খুঁজুন..."}
              className="pl-8 pr-3 py-2 rounded-lg border text-[12.5px] outline-none"
              style={{ borderColor: COLORS.line, fontFamily: FONTS.BODY, color: COLORS.ink }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {rowsLoading ? (
          <div className="flex items-center justify-center py-10 gap-2" style={{ color: COLORS.muted }}>
            <Loader2 className="animate-spin" size={20} />
            <span>ডাটা লোড হচ্ছে...</span>
          </div>
        ) : rowsError ? (
          <div className="text-center py-8 text-red-500">{rowsError}</div>
        ) : view === "products" ? (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left" style={{ color: COLORS.muted }}>
                {["SI", "Product", "Category", "Qty Sold", "Invoices", "Revenue"].map((h) => (
                  <th
                    key={h}
                    className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                    style={{ borderColor: COLORS.line }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <tr
                  key={p.product_id}
                  style={i !== rows.length - 1 ? { borderBottom: `1px solid ${COLORS.line}` } : undefined}
                >
                  <td className="py-3 px-2.5" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>
                    {(meta.current_page - 1) * 10 + i + 1}
                  </td>
                  <td className="py-3 px-2.5 font-semibold" style={{ color: COLORS.ink }}>
                    {p.name}
                  </td>
                  <td className="py-3 px-2.5" style={{ color: COLORS.muted }}>
                    {p.category}
                  </td>
                  <td className="py-3 px-2.5" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                    {p.qty_sold}
                  </td>
                  <td className="py-3 px-2.5" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>
                    {p.invoices}
                  </td>
                  <td className="py-3 px-2.5 font-semibold" style={{ color: COLORS.forest, fontFamily: FONTS.MONO }}>
                    {money(p.revenue)}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[13px]" style={{ color: COLORS.muted }}>
                    এই সময়ে কোনো প্রোডাক্ট সেল হয়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left" style={{ color: COLORS.muted }}>
                {["Invoice", "Customer", "Branch", "Sold By", "Total", "Paid", "Due", "Status", "Date"].map((h) => (
                  <th
                    key={h}
                    className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                    style={{ borderColor: COLORS.line }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((s, i) => (
                <tr
                  key={s.id}
                  style={i !== rows.length - 1 ? { borderBottom: `1px solid ${COLORS.line}` } : undefined}
                >
                  <td className="py-3 px-2.5 font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                    {s.invoice_no}
                  </td>
                  <td className="py-3 px-2.5" style={{ color: COLORS.ink }}>
                    {s.customer}
                  </td>
                  <td className="py-3 px-2.5" style={{ color: COLORS.muted }}>
                    {s.branch}
                  </td>
                  <td className="py-3 px-2.5" style={{ color: COLORS.muted }}>
                    {s.sold_by}
                  </td>
                  <td className="py-3 px-2.5 font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                    {money(s.total)}
                  </td>
                  <td className="py-3 px-2.5" style={{ color: COLORS.forest, fontFamily: FONTS.MONO }}>
                    {money(s.paid)}
                  </td>
                  <td className="py-3 px-2.5" style={{ color: s.due > 0 ? COLORS.vermillion : COLORS.muted, fontFamily: FONTS.MONO }}>
                    {money(s.due)}
                  </td>
                  <td className="py-3 px-2.5">
                    <span
                      className="px-2 py-1 rounded-md text-[11px] font-semibold"
                      style={{
                        backgroundColor: s.status === "paid" ? COLORS.forestTint : COLORS.marigoldTint,
                        color: s.status === "paid" ? COLORS.forestDark : COLORS.rust,
                      }}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-2.5" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>
                    {s.sale_date}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[13px]" style={{ color: COLORS.muted }}>
                    এই সময়ে কোনো সেল হয়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!rowsLoading && !rowsError && meta.last_page > 1 && (
        <div className="flex items-center justify-between mt-4 text-[12px]" style={{ color: COLORS.muted }}>
          <span>মোট {meta.total} টি রেকর্ড</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={meta.current_page <= 1}
              className="w-8 h-8 rounded-lg border flex items-center justify-center disabled:opacity-40"
              style={{ borderColor: COLORS.line }}
            >
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontFamily: FONTS.MONO }}>
              {meta.current_page} / {meta.last_page}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              disabled={meta.current_page >= meta.last_page}
              className="w-8 h-8 rounded-lg border flex items-center justify-center disabled:opacity-40"
              style={{ borderColor: COLORS.line }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
