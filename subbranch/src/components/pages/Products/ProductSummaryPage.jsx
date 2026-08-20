import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import {
  Search,
  Download,
  Printer,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  PackageCheck,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  fetchBranches,
  fetchSoldProducts,
  fetchReturnedProducts,
  fetchDamagedRecords,
} from "../../../api/productSummaryService";
import { SUB_BRANCH_ID } from "../../../constants";

/* ------------------------------------------------------------------ */
/* THEME & UTILS                                                      */
/* ------------------------------------------------------------------ */
const COLORS = {
  page: "#F6F5F2",
  panel: "#FFFFFF",
  paper: "#FAFAF8",
  ink: "#26251F",
  muted: "#8A8577",
  line: "#E8E5DD",
  accent: "#1E6E5C",
  accentTint: "#E2EFEA",
  warn: "#B5482E",
  warnTint: "#F3E3DE",
};

const FONTS = {
  HEAD: "'Baloo 2', 'Hind Siliguri', sans-serif",
  BODY: "'Hind Siliguri', 'Inter', sans-serif",
  MONO: "'Roboto Mono', monospace",
};

function formatCurrency(n) {
  return Number(n || 0).toLocaleString("en-BD", { maximumFractionDigits: 0 });
}

/* ------------------------------------------------------------------ */
/* SELECT                                                             */
/* ------------------------------------------------------------------ */
const FilterSelect = memo(function FilterSelect({ value, onChange, options, disabled }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="appearance-none rounded-lg pl-3 pr-8 py-2 text-[12.5px] font-semibold border outline-none cursor-pointer disabled:opacity-50"
        style={{
          backgroundColor: COLORS.panel,
          borderColor: COLORS.line,
          color: COLORS.ink,
          fontFamily: FONTS.BODY,
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: COLORS.muted }}
      />
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* STAT CARD                                                          */
/* ------------------------------------------------------------------ */
const StatCard = memo(function StatCard({ icon: Icon, label, value, sub, tone = "neutral" }) {
  const color = tone === "warn" ? COLORS.warn : tone === "accent" ? COLORS.accent : COLORS.ink;
  const tint = tone === "warn" ? COLORS.warnTint : tone === "accent" ? COLORS.accentTint : COLORS.paper;
  return (
    <div
      className="rounded-xl border px-4 py-3.5 flex items-start gap-3 min-w-[200px] flex-1"
      style={{ backgroundColor: COLORS.paper, borderColor: COLORS.line }}
    >
      <div
        className="rounded-lg p-2 flex items-center justify-center shrink-0"
        style={{ backgroundColor: tint, color }}
      >
        <Icon size={17} />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-bold uppercase tracking-wide" style={{ color: COLORS.muted, fontFamily: FONTS.BODY }}>
          {label}
        </div>
        <div className="text-[17px] font-extrabold leading-tight truncate" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
          {value}
        </div>
        {sub && (
          <div className="text-[11px] font-medium mt-0.5" style={{ color: COLORS.muted }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* SECTION WRAPPER                                                    */
/* ------------------------------------------------------------------ */
const Section = memo(function Section({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
      <div className="h-[3px] w-full" style={{ backgroundColor: COLORS.accent }} />
      <div className="p-5">
        {title && (
          <h3 className="font-bold text-[14.5px] mb-3" style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}>
            {title}
            {subtitle && <span className="font-medium text-[12.5px]" style={{ color: COLORS.muted }}> — {subtitle}</span>}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
});

const RANGE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "this_week", label: "This Week" },
  { value: "this_month", label: "This Month" },
  { value: "this_year", label: "This Year" },
];

const BRANCH_HEADERS = ["Branch", "Sold Qty", "Sold Value", "Returned Qty", "Returned Value", "Damaged Qty", "Damaged Value"];
const BRANCH_MONEY_HEADERS = ["Branch", "Invoices", "Total Sale Value", "Paid Amount", "Due Amount"];
const SOLD_HEADERS = ["Product", "Barcode", "Branch", "Qty Sold", "Value", "Date"];
const RETURN_HEADERS = ["Product", "Barcode", "Branch", "Qty", "Reason", "Value", "Date"];

/* ------------------------------------------------------------------ */
/* TABLE ROWS                                                         */
/* ------------------------------------------------------------------ */
const BranchRow = memo(function BranchRow({ b, isLast }) {
  return (
    <tr style={!isLast ? { borderBottom: `1px solid ${COLORS.line}` } : undefined}>
      <td className="py-3 px-2.5 font-semibold" style={{ color: COLORS.ink }}>{b.name}</td>
      <td className="py-3 px-2.5 text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{(b.sold_qty || 0).toLocaleString()}</td>
      <td className="py-3 px-2.5 text-right font-bold" style={{ color: COLORS.accent, fontFamily: FONTS.MONO }}>৳{formatCurrency(b.sold_value)}</td>
      <td className="py-3 px-2.5 text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{(b.returned_qty || 0).toLocaleString()}</td>
      <td className="py-3 px-2.5 text-right font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>৳{formatCurrency(b.returned_value)}</td>
      <td className="py-3 px-2.5 text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{(b.damaged_qty || 0).toLocaleString()}</td>
      <td className="py-3 px-2.5 text-right font-bold" style={{ color: COLORS.warn, fontFamily: FONTS.MONO }}>৳{formatCurrency(b.damaged_value)}</td>
    </tr>
  );
});

const BranchMoneyRow = memo(function BranchMoneyRow({ b, isLast }) {
  return (
    <tr style={!isLast ? { borderBottom: `1px solid ${COLORS.line}` } : undefined}>
      <td className="py-3 px-2.5 font-semibold" style={{ color: COLORS.ink }}>{b.name}</td>
      <td className="py-3 px-2.5 text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{b.invoice_count.toLocaleString()}</td>
      <td className="py-3 px-2.5 text-right font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>৳{formatCurrency(b.total_value)}</td>
      <td className="py-3 px-2.5 text-right font-bold" style={{ color: COLORS.accent, fontFamily: FONTS.MONO }}>৳{formatCurrency(b.paid_value)}</td>
      <td className="py-3 px-2.5 text-right font-bold" style={{ color: b.due_value > 0 ? COLORS.warn : COLORS.ink, fontFamily: FONTS.MONO }}>৳{formatCurrency(b.due_value)}</td>
    </tr>
  );
});

const SoldRow = memo(function SoldRow({ d, isLast }) {
  return (
    <tr style={!isLast ? { borderBottom: `1px solid ${COLORS.line}` } : undefined}>
      <td className="py-3 px-2.5 font-semibold" style={{ color: COLORS.ink }}>{d.product_name || d.name || "N/A"}</td>
      <td className="py-3 px-2.5" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>{d.barcode || "N/A"}</td>
      <td className="py-3 px-2.5 text-right" style={{ color: COLORS.ink }}>{d.branch?.name || d.branch || "N/A"}</td>
      <td className="py-3 px-2.5 text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{d.qty || d.quantity || 1}</td>
      <td className="py-3 px-2.5 text-right font-bold" style={{ color: COLORS.accent, fontFamily: FONTS.MONO }}>৳{formatCurrency(d.value || d.total || 0)}</td>
      <td className="py-3 px-2.5 text-right text-[12px]" style={{ color: COLORS.muted }}>{d.created_at ? new Date(d.created_at).toLocaleDateString("en-GB") : d.date || "-"}</td>
    </tr>
  );
});

const ReturnedRow = memo(function ReturnedRow({ d, isLast }) {
  return (
    <tr style={!isLast ? { borderBottom: `1px solid ${COLORS.line}` } : undefined}>
      <td className="py-3 px-2.5 font-semibold" style={{ color: COLORS.ink }}>{d.product_name || d.name || "N/A"}</td>
      <td className="py-3 px-2.5" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>{d.barcode || "N/A"}</td>
      <td className="py-3 px-2.5 text-right" style={{ color: COLORS.ink }}>{d.branch?.name || d.branch || "N/A"}</td>
      <td className="py-3 px-2.5 text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{d.qty || d.quantity || 1}</td>
      <td className="py-3 px-2.5">
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border" style={{ borderColor: COLORS.line, color: COLORS.ink }}>
          {d.reason || "N/A"}
        </span>
      </td>
      <td className="py-3 px-2.5 text-right font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>৳{formatCurrency(d.value || d.amount || 0)}</td>
      <td className="py-3 px-2.5 text-right text-[12px]" style={{ color: COLORS.muted }}>{d.created_at ? new Date(d.created_at).toLocaleDateString("en-GB") : d.date || "-"}</td>
    </tr>
  );
});

const DamagedRow = memo(function DamagedRow({ d, isLast }) {
  return (
    <tr style={!isLast ? { borderBottom: `1px solid ${COLORS.line}` } : undefined}>
      <td className="py-3 px-2.5 font-semibold" style={{ color: COLORS.ink }}>{d.product?.name || d.name || "N/A"}</td>
      <td className="py-3 px-2.5" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>{d.product?.barcode || d.barcode || "N/A"}</td>
      <td className="py-3 px-2.5 text-right" style={{ color: COLORS.ink }}>{d.branch?.name || d.branch || "N/A"}</td>
      <td className="py-3 px-2.5 text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{d.qty || d.quantity || 1}</td>
      <td className="py-3 px-2.5">
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: COLORS.warnTint, color: COLORS.warn }}>
          {d.reason || "Damaged"}
        </span>
      </td>
      <td className="py-3 px-2.5 text-right font-bold" style={{ color: COLORS.warn, fontFamily: FONTS.MONO }}>৳{formatCurrency(d.value || d.amount || 0)}</td>
      <td className="py-3 px-2.5 text-right text-[12px]" style={{ color: COLORS.muted }}>{d.created_at ? new Date(d.created_at).toLocaleDateString("en-GB") : d.date || "-"}</td>
    </tr>
  );
});

/* ------------------------------------------------------------------ */
/* MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */
export function ProductSummaryPage() {
  // Sub-branch হলে নিজের ব্রাঞ্চেই আটকে থাকবে (dropdown দেখানো হবে না)।
  // Main branch হলে ডিফল্টে "All Branches" (সব ব্রাঞ্চ মিলিয়ে) দেখাবে, চাইলে dropdown দিয়ে একটাও বেছে নিতে পারবে।
  const isMainBranch = !SUB_BRANCH_ID;

  const [branchList, setBranchList] = useState([]);
  const [branchId, setBranchId] = useState(SUB_BRANCH_ID ? String(SUB_BRANCH_ID) : "");
  const [range, setRange] = useState("this_month");
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("sold");

  // Data states
  const [branchSummary, setBranchSummary] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);
  const [returnedProducts, setReturnedProducts] = useState([]);
  const [damagedProducts, setDamagedProducts] = useState([]);

  // Async States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Initial Load: Fetch Branches List (শুধু Main Branch dropdown দেখানোর জন্য দরকার)
  useEffect(() => {
    if (!isMainBranch) return;
    const loadBranches = async () => {
      try {
        const res = await fetchBranches();
        const data = res.data || res || [];
        setBranchList(data);
      } catch (err) {
        console.error("Failed to load branches:", err);
      }
    };
    loadBranches();
  }, [isMainBranch]);

  // 2. Fetch Data according to filters
  const loadReportData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        branch_id: branchId,
        range: range,
        search: query,
      };

      // Concurrent fetching for tables
      const [soldRes, returnedRes, damagedRes] = await Promise.all([
        fetchSoldProducts(params).catch(() => ({ data: [] })),
        fetchReturnedProducts(params).catch(() => ({ data: [] })),
        fetchDamagedRecords(params).catch(() => ({ data: [] })),
      ]);

      const soldData = soldRes.data?.data || soldRes.data || soldRes || [];
      const returnedData = returnedRes.data?.data || returnedRes.data || returnedRes || [];
      const damagedData = damagedRes.data?.data || damagedRes.data || damagedRes || [];

      setSoldProducts(Array.isArray(soldData) ? soldData : []);
      setReturnedProducts(Array.isArray(returnedData) ? returnedData : []);
      setDamagedProducts(Array.isArray(damagedData) ? damagedData : []);

    } catch (err) {
      console.error("Error loading summary report:", err);
      setError("প্রতিবেদন লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }, [branchId, range, query]);

  useEffect(() => {
    loadReportData();
  }, [loadReportData]);

  // Transform branch options for Select (শুধু Main Branch-এর জন্য ব্যবহার হয়)
  const branchOptions = useMemo(
    () => [{ value: "", label: "All Branches" }, ...branchList.map((b) => ({ value: String(b.id), label: b.name }))],
    [branchList]
  );

  const selectedBranchName = useMemo(() => {
    if (!branchId) return isMainBranch ? "All Branches" : null;
    return branchList.find((b) => String(b.id) === branchId)?.name || null;
  }, [branchId, branchList, isMainBranch]);

  // Aggregated totals calculated dynamically from loaded sets
  const totals = useMemo(() => {
    const sold_qty = soldProducts.reduce((sum, item) => sum + Number(item.qty || item.quantity || 1), 0);
    const sold_value = soldProducts.reduce((sum, item) => sum + Number(item.value || item.total || 0), 0);

    const returned_qty = returnedProducts.reduce((sum, item) => sum + Number(item.qty || item.quantity || 1), 0);
    const returned_value = returnedProducts.reduce((sum, item) => sum + Number(item.value || item.amount || 0), 0);

    const damaged_qty = damagedProducts.reduce((sum, item) => sum + Number(item.qty || item.quantity || 1), 0);
    const damaged_value = damagedProducts.reduce((sum, item) => sum + Number(item.value || item.amount || 0), 0);

    return { sold_qty, sold_value, returned_qty, returned_value, damaged_qty, damaged_value };
  }, [soldProducts, returnedProducts, damagedProducts]);

  const netRevenue = totals.sold_value - totals.returned_value - totals.damaged_value;

  // Branch-wise Total Sale Value / Paid / Due — derived from the sales (soldProducts) records,
  // since each sale row already carries branch, total, paid, and due fields.
  const branchMoneySummary = useMemo(() => {
    const map = new Map();

    soldProducts.forEach((sale) => {
      const branchName = sale.branch?.name || sale.branch || "Unknown Branch";
      const branchKey = sale.branch?.id ?? branchName;

      if (!map.has(branchKey)) {
        map.set(branchKey, { name: branchName, invoice_count: 0, total_value: 0, paid_value: 0, due_value: 0 });
      }

      const entry = map.get(branchKey);
      entry.invoice_count += 1;
      entry.total_value += Number(sale.total || 0);
      entry.paid_value += Number(sale.paid || 0);
      entry.due_value += Number(sale.due || 0);
    });

    return Array.from(map.values()).sort((a, b) => b.total_value - a.total_value);
  }, [soldProducts]);

  const tabs = [
    { id: "sold", label: "Sold Products", count: soldProducts.length },
    { id: "returned", label: "Returned Products", count: returnedProducts.length },
    { id: "damaged", label: "Damaged Products", count: damagedProducts.length },
  ];

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: COLORS.page }}>
      <div className="max-w-6xl mx-auto space-y-5">
        {/* ============ HEADER CARD ============ */}
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
          <div className="h-[3px] w-full" style={{ backgroundColor: COLORS.accent }} />

          <div className="p-5 pb-4 flex items-center justify-between flex-wrap gap-3" style={{ borderBottom: `1px solid ${COLORS.line}` }}>
            <div>
              <h2 className="font-bold text-[16px]" style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}>
                Product Sales Summary
              </h2>
              <p className="text-[12px] mt-0.5" style={{ color: COLORS.muted }}>
                বিক্রয়, রিটার্ন ও ড্যামেজ প্রোডাক্টের সামগ্রিক প্রতিবেদন
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Branch Filter — শুধু Main Branch থেকে দেখানো হয়; Sub-branch নিজের ব্রাঞ্চেই আটকে থাকে */}
              {isMainBranch && (
                <FilterSelect value={branchId} onChange={setBranchId} options={branchOptions} disabled={loading} />
              )}
              <FilterSelect value={range} onChange={setRange} options={RANGE_OPTIONS} disabled={loading} />

              <button
                onClick={loadReportData}
                disabled={loading}
                className="p-2 rounded-lg border hover:bg-black/[0.02] transition-colors"
                style={{ borderColor: COLORS.line, color: COLORS.ink }}
                title="Reload Data"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              </button>

              <button
                onClick={() => window.print()}
                className="font-semibold text-[12.5px] px-3.5 py-2 rounded-lg flex items-center gap-1.5 border hover:bg-black/[0.02] transition-colors"
                style={{ borderColor: COLORS.line, color: COLORS.ink }}
              >
                <Printer size={13} /> Print
              </button>
              <button
                className="text-white font-semibold text-[12.5px] px-3.5 py-2 rounded-lg flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: COLORS.accent }}
              >
                <Download size={13} /> Download
              </button>
            </div>
          </div>

          {/* STAT CARDS */}
          <div className="p-5 flex flex-wrap gap-3">
            <StatCard icon={TrendingUp} label="Total Sold" value={`${totals.sold_qty.toLocaleString()} pcs`} sub={`৳${formatCurrency(totals.sold_value)}`} tone="accent" />
            <StatCard icon={TrendingDown} label="Total Returned" value={`${totals.returned_qty.toLocaleString()} pcs`} sub={`৳${formatCurrency(totals.returned_value)}`} tone="neutral" />
            <StatCard icon={AlertTriangle} label="Total Damaged" value={`${totals.damaged_qty.toLocaleString()} pcs`} sub={`৳${formatCurrency(totals.damaged_value)}`} tone="warn" />
            <StatCard icon={PackageCheck} label="Net Revenue" value={`৳${formatCurrency(netRevenue)}`} sub="বিক্রয় − রিটার্ন − ড্যামেজ" tone="accent" />
          </div>
        </div>

        {/* BRANCH-WISE SALE / PAID / DUE SUMMARY — শুধু Main Branch-এর জন্য প্রাসঙ্গিক (একাধিক ব্রাঞ্চ থাকলে) */}
        {!loading && isMainBranch && branchMoneySummary.length > 0 && (
          <Section title="ব্রাঞ্চ-ভিত্তিক বিক্রয়, পেমেন্ট ও বাকি (Due) সামারি">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left" style={{ color: COLORS.muted }}>
                    {BRANCH_MONEY_HEADERS.map((h, i) => (
                      <th key={h} className={`font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b ${i >= 1 ? "text-right" : ""}`} style={{ borderColor: COLORS.line }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {branchMoneySummary.map((b, i) => (
                    <BranchMoneyRow key={b.name} b={b} isLast={i === branchMoneySummary.length - 1} />
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: `2px solid ${COLORS.line}` }}>
                    <td className="py-2.5 px-2.5 font-bold text-[12px] uppercase" style={{ color: COLORS.muted }}>Total</td>
                    <td className="py-2.5 px-2.5 text-right font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                      {branchMoneySummary.reduce((s, b) => s + b.invoice_count, 0).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                      ৳{formatCurrency(branchMoneySummary.reduce((s, b) => s + b.total_value, 0))}
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-bold" style={{ color: COLORS.accent, fontFamily: FONTS.MONO }}>
                      ৳{formatCurrency(branchMoneySummary.reduce((s, b) => s + b.paid_value, 0))}
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-bold" style={{ color: COLORS.warn, fontFamily: FONTS.MONO }}>
                      ৳{formatCurrency(branchMoneySummary.reduce((s, b) => s + b.due_value, 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Section>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="p-4 rounded-xl text-center text-sm border bg-red-50 text-red-600 border-red-200">
            {error}
          </div>
        )}

        {/* LOADING INDICATOR */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-500 gap-2">
            <Loader2 className="animate-spin" size={24} style={{ color: COLORS.accent }} />
            <span className="text-sm font-medium">প্রতিবেদন লোড করা হচ্ছে...</span>
          </div>
        ) : (
          <>
            {/* ============ TAB BUTTONS & SEARCH BAR ============ */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl border flex items-center justify-between flex-wrap gap-3" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
                <div className="flex items-center gap-2 flex-wrap">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="font-semibold text-[12.5px] px-3.5 py-2 rounded-lg flex items-center gap-2 border transition-all duration-150 cursor-pointer"
                        style={{
                          backgroundColor: isActive ? COLORS.accent : COLORS.paper,
                          color: isActive ? "#FFFFFF" : COLORS.ink,
                          borderColor: isActive ? COLORS.accent : COLORS.line,
                        }}
                      >
                        <span>{tab.label}</span>
                        <span
                          className="text-[11px] px-2 py-0.5 rounded-full font-mono"
                          style={{
                            backgroundColor: isActive ? "rgba(255, 255, 255, 0.2)" : COLORS.panel,
                            color: isActive ? "#FFFFFF" : COLORS.muted,
                            border: isActive ? "none" : `1px solid ${COLORS.line}`,
                          }}
                        >
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* SEARCH BOX */}
                <div className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] border" style={{ backgroundColor: COLORS.paper, borderColor: COLORS.line, color: COLORS.muted }}>
                  <Search size={14} />
                  <span className="text-[12.5px] font-semibold" style={{ color: COLORS.ink }}>
                    Search:
                  </span>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Name or Barcode..."
                    className="bg-transparent outline-none text-[13px] w-44"
                    style={{ color: COLORS.ink, fontFamily: FONTS.BODY }}
                  />
                </div>
              </div>

              {/* CONDITIONALLY RENDERED TABLES */}
              {activeTab === "sold" && (
                <Section title="বিক্রিত প্রোডাক্ট (Sold Products)" subtitle={selectedBranchName}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[13px]">
                      <thead>
                        <tr className="text-left" style={{ color: COLORS.muted }}>
                          {SOLD_HEADERS.map((h, i) => (
                            <th key={h} className={`font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b ${i >= 3 ? "text-right" : ""}`} style={{ borderColor: COLORS.line }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {soldProducts.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-[13px]" style={{ color: COLORS.muted }}>কোন বিক্রয় তথ্য পাওয়া যায়নি।</td>
                          </tr>
                        ) : (
                          soldProducts.map((d, i) => (
                            <SoldRow key={d.id || i} d={d} isLast={i === soldProducts.length - 1} />
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Section>
              )}

              {activeTab === "returned" && (
                <Section title="রিটার্ন হওয়া প্রোডাক্ট (Returned Products)" subtitle={selectedBranchName}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[13px]">
                      <thead>
                        <tr className="text-left" style={{ color: COLORS.muted }}>
                          {RETURN_HEADERS.map((h, i) => (
                            <th key={h} className={`font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b ${i >= 3 && i !== 4 ? "text-right" : ""}`} style={{ borderColor: COLORS.line }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {returnedProducts.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-[13px]" style={{ color: COLORS.muted }}>কোন রিটার্ন তথ্য পাওয়া যায়নি।</td>
                          </tr>
                        ) : (
                          returnedProducts.map((d, i) => (
                            <ReturnedRow key={d.id || i} d={d} isLast={i === returnedProducts.length - 1} />
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Section>
              )}

              {activeTab === "damaged" && (
                <Section title="ড্যামেজ প্রোডাক্ট (Damaged Products)" subtitle={selectedBranchName}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[13px]">
                      <thead>
                        <tr className="text-left" style={{ color: COLORS.muted }}>
                          {RETURN_HEADERS.map((h, i) => (
                            <th key={h} className={`font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b ${i >= 3 && i !== 4 ? "text-right" : ""}`} style={{ borderColor: COLORS.line }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {damagedProducts.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-[13px]" style={{ color: COLORS.muted }}>কোন ড্যামেজ প্রোডাক্ট তথ্য পাওয়া যায়নি।</td>
                          </tr>
                        ) : (
                          damagedProducts.map((d, i) => (
                            <DamagedRow key={d.id || i} d={d} isLast={i === damagedProducts.length - 1} />
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Section>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductSummaryPage;