import React, { useState, useMemo, useCallback } from "react";
import {
  Search,
  Download,
  Printer,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  PackageCheck,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* THEME — same palette family as ProductStocksPage                    */
/* ------------------------------------------------------------------ */
const COLORS = {
  page: "#FBF3E2",
  panel: "#FFFFFF",
  paper: "#FBF8F1",
  ink: "#2B2A28",
  muted: "#948C7C",
  line: "#EDE4D0",

  peacock: "#1E8A83",
  peacockTint: "#DCF2EF",
  marigold: "#DE8A2A",
  marigoldTint: "#FBEBD6",
  rust: "#B4692E",
  rustTint: "#F7EAD9",
  purple: "#6E3FA3",
  purpleTint: "#EDE3F7",
  forest: "#2E7D4F",
  forestDark: "#1F5C3D",
  forestTint: "#DFEFE4",
  magenta: "#C2255C",
  magentaTint: "#FBE3EC",
  vermillion: "#C23B2E",
  vermillionTint: "#F8E1DC",
};
const PETALS = [COLORS.magenta, COLORS.marigold, COLORS.peacock, COLORS.forest, COLORS.purple];
const FONTS = {
  HEAD: "'Baloo 2', 'Hind Siliguri', sans-serif",
  BODY: "'Hind Siliguri', 'Inter', sans-serif",
  MONO: "'Roboto Mono', monospace",
};

function formatCurrency(n) {
  return Number(n || 0).toLocaleString("en-BD", { maximumFractionDigits: 0 });
}

/* ------------------------------------------------------------------ */
/* SCALLOP BORDER — decorative top strip                               */
/* ------------------------------------------------------------------ */
function ScallopBorder({ id, colors }) {
  const count = 24;
  const w = 100 / count;
  return (
    <svg
      viewBox="0 0 100 3"
      preserveAspectRatio="none"
      className="absolute top-0 left-0 w-full h-[10px]"
    >
      {Array.from({ length: count }).map((_, i) => (
        <circle key={i} cx={w * i + w / 2} cy="0" r={w / 2} fill={colors[i % colors.length]} />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* SELECT (matches StockFilterSelect)                                   */
/* ------------------------------------------------------------------ */
function FilterSelect({ value, onChange, options, accentColor = COLORS.peacock }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-lg pl-3 pr-8 py-2 text-[12.5px] font-semibold border outline-none cursor-pointer"
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
        style={{ color: accentColor }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* STAT CARD                                                            */
/* ------------------------------------------------------------------ */
function StatCard({ icon: Icon, label, value, sub, color, tint }) {
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
          <div className="text-[11px] font-medium mt-0.5" style={{ color }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MOCK DATA — replace with real API data later                        */
/* ------------------------------------------------------------------ */
const BRANCH_SUMMARY = [
  { id: 1, name: "Gulshan Branch", sold_qty: 1240, sold_value: 386500, returned_qty: 32, returned_value: 9800, damaged_qty: 6, damaged_value: 2100 },
  { id: 2, name: "Mirpur Branch", sold_qty: 980, sold_value: 271200, returned_qty: 21, returned_value: 6400, damaged_qty: 4, damaged_value: 1350 },
  { id: 3, name: "Uttara Branch", sold_qty: 1510, sold_value: 452900, returned_qty: 45, returned_value: 13200, damaged_qty: 9, damaged_value: 3600 },
  { id: 4, name: "Banani Branch", sold_qty: 760, sold_value: 198700, returned_qty: 12, returned_value: 3900, damaged_qty: 2, damaged_value: 800 },
];

const DAMAGED_PRODUCTS = [
  { id: 1, name: "Fresh Milk 1L", barcode: "8901030123", branch: "Uttara Branch", qty: 5, reason: "মেয়াদ উত্তীর্ণ", value: 1250, date: "22 Jul 2026" },
  { id: 2, name: "Basmati Rice 5kg", barcode: "8901030456", branch: "Gulshan Branch", qty: 3, reason: "প্যাকেজিং ড্যামেজ", value: 1650, date: "20 Jul 2026" },
  { id: 3, name: "Cooking Oil 2L", barcode: "8901030789", branch: "Mirpur Branch", qty: 4, reason: "লিকেজ", value: 1350, date: "19 Jul 2026" },
  { id: 4, name: "Biscuit Pack", barcode: "8901030999", branch: "Uttara Branch", qty: 6, reason: "মেয়াদ উত্তীর্ণ", value: 720, date: "18 Jul 2026" },
  { id: 5, name: "Detergent Powder 1kg", barcode: "8901031111", branch: "Banani Branch", qty: 2, reason: "প্যাকেজিং ড্যামেজ", value: 800, date: "17 Jul 2026" },
];

const SOLD_PRODUCTS = [
  { id: 1, name: "Fresh Milk 1L", barcode: "8901030123", branch: "Uttara Branch", qty: 210, value: 65400, date: "23 Jul 2026" },
  { id: 2, name: "Basmati Rice 5kg", barcode: "8901030456", branch: "Gulshan Branch", qty: 340, value: 108800, date: "23 Jul 2026" },
  { id: 3, name: "Cooking Oil 2L", barcode: "8901030789", branch: "Mirpur Branch", qty: 180, value: 54000, date: "22 Jul 2026" },
  { id: 4, name: "Biscuit Pack", barcode: "8901030999", branch: "Uttara Branch", qty: 460, value: 55200, date: "22 Jul 2026" },
  { id: 5, name: "Detergent Powder 1kg", barcode: "8901031111", branch: "Banani Branch", qty: 150, value: 45000, date: "21 Jul 2026" },
  { id: 6, name: "Shirt - Blue L", barcode: "8901032222", branch: "Gulshan Branch", qty: 90, value: 81000, date: "21 Jul 2026" },
  { id: 7, name: "LED Bulb 9W", barcode: "8901033333", branch: "Banani Branch", qty: 220, value: 71500, date: "20 Jul 2026" },
  { id: 8, name: "Fresh Milk 1L", barcode: "8901030123", branch: "Mirpur Branch", qty: 175, value: 54500, date: "20 Jul 2026" },
];

const RETURNED_PRODUCTS = [
  { id: 1, name: "Fresh Milk 1L", barcode: "8901030123", branch: "Uttara Branch", qty: 10, reason: "গ্রাহক পছন্দ হয়নি", value: 3200, date: "23 Jul 2026" },
  { id: 2, name: "Shirt - Blue L", barcode: "8901032222", branch: "Gulshan Branch", qty: 6, reason: "সাইজ মিসম্যাচ", value: 5400, date: "21 Jul 2026" },
  { id: 3, name: "LED Bulb 9W", barcode: "8901033333", branch: "Banani Branch", qty: 12, reason: "ত্রুটিপূর্ণ", value: 3900, date: "20 Jul 2026" },
];

export function ProductSummaryPage() {
  const [branchId, setBranchId] = useState("");
  const [range, setRange] = useState("this_month");
  const [query, setQuery] = useState("");

  const filteredBranches = useMemo(() => {
    if (!branchId) return BRANCH_SUMMARY;
    return BRANCH_SUMMARY.filter((b) => String(b.id) === branchId);
  }, [branchId]);

  const totals = useMemo(() => {
    return filteredBranches.reduce(
      (acc, b) => ({
        sold_qty: acc.sold_qty + b.sold_qty,
        sold_value: acc.sold_value + b.sold_value,
        returned_qty: acc.returned_qty + b.returned_qty,
        returned_value: acc.returned_value + b.returned_value,
        damaged_qty: acc.damaged_qty + b.damaged_qty,
        damaged_value: acc.damaged_value + b.damaged_value,
      }),
      { sold_qty: 0, sold_value: 0, returned_qty: 0, returned_value: 0, damaged_qty: 0, damaged_value: 0 }
    );
  }, [filteredBranches]);

  const netRevenue = totals.sold_value - totals.returned_value - totals.damaged_value;

  const selectedBranchName = useMemo(() => {
    if (!branchId) return null;
    return BRANCH_SUMMARY.find((b) => String(b.id) === branchId)?.name || null;
  }, [branchId]);

  const matchesFilters = useCallback(
    (d) => {
      const matchesQuery = d.name.toLowerCase().includes(query.toLowerCase()) || d.barcode.includes(query);
      const matchesBranch = !selectedBranchName || d.branch === selectedBranchName;
      return matchesQuery && matchesBranch;
    },
    [query, selectedBranchName]
  );

  const filteredSold = useMemo(() => SOLD_PRODUCTS.filter(matchesFilters), [matchesFilters]);
  const filteredDamaged = useMemo(() => DAMAGED_PRODUCTS.filter(matchesFilters), [matchesFilters]);
  const filteredReturned = useMemo(() => RETURNED_PRODUCTS.filter(matchesFilters), [matchesFilters]);

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: COLORS.page }}>
      <div className="max-w-6xl mx-auto space-y-5">
        {/* ============ MAIN CARD ============ */}
        <div className="relative rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
          <ScallopBorder id="scallop-product-summary" colors={PETALS} />

          <div className="p-5 pt-7 pb-4 flex items-center justify-between flex-wrap gap-3" style={{ borderBottom: `1px dashed ${COLORS.line}` }}>
            <div>
              <h2 className="font-bold text-[16px]" style={{ fontFamily: FONTS.HEAD, color: COLORS.forestDark }}>
                Product Sales Summary
              </h2>
              <p className="text-[12px] mt-0.5" style={{ color: COLORS.muted }}>
                বিক্রয়, রিটার্ন ও ড্যামেজ প্রোডাক্টের সামগ্রিক প্রতিবেদন
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <FilterSelect
                value={branchId}
                onChange={setBranchId}
                options={[{ value: "", label: "All Branches" }, ...BRANCH_SUMMARY.map((b) => ({ value: String(b.id), label: b.name }))]}
                accentColor={COLORS.peacock}
              />
              <FilterSelect
                value={range}
                onChange={setRange}
                options={[
                  { value: "today", label: "Today" },
                  { value: "this_week", label: "This Week" },
                  { value: "this_month", label: "This Month" },
                  { value: "this_year", label: "This Year" },
                ]}
                accentColor={COLORS.marigold}
              />

              <button
                onClick={() => window.print()}
                className="text-white font-semibold text-[12.5px] px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-md hover:opacity-90 transition-opacity"
                style={{ backgroundColor: COLORS.purple, boxShadow: `0 4px 10px ${COLORS.purple}40` }}
              >
                <Printer size={13} /> Print
              </button>
              <button
                className="text-white font-semibold text-[12.5px] px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-md hover:opacity-90 transition-opacity"
                style={{ backgroundColor: COLORS.forest, boxShadow: `0 4px 10px ${COLORS.forest}40` }}
              >
                <Download size={13} /> Download
              </button>
            </div>
          </div>

          <div className="p-5 flex flex-wrap gap-3" style={{ borderBottom: `1px dashed ${COLORS.line}` }}>
            <StatCard icon={TrendingUp} label="Total Sold" value={`${totals.sold_qty.toLocaleString()} pcs`} sub={`৳${formatCurrency(totals.sold_value)}`} color={COLORS.forestDark} tint={COLORS.forestTint} />
            <StatCard icon={TrendingDown} label="Total Returned" value={`${totals.returned_qty.toLocaleString()} pcs`} sub={`৳${formatCurrency(totals.returned_value)}`} color={COLORS.magenta} tint={COLORS.magentaTint} />
            <StatCard icon={AlertTriangle} label="Total Damaged" value={`${totals.damaged_qty.toLocaleString()} pcs`} sub={`৳${formatCurrency(totals.damaged_value)}`} color={COLORS.vermillion} tint={COLORS.vermillionTint} />
            <StatCard icon={PackageCheck} label="Net Revenue" value={`৳${formatCurrency(netRevenue)}`} sub="বিক্রয় − রিটার্ন − ড্যামেজ" color={COLORS.purple} tint={COLORS.purpleTint} />
          </div>

          <div className="px-5 py-3 flex items-center justify-end">
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
        </div>

        {/* ============ BRANCH-WISE TABLE ============ */}
        <div className="relative rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
          <ScallopBorder id="scallop-branch-wise" colors={PETALS} />
          <div className="p-5 pt-7">
            <h3 className="font-bold text-[14.5px] mb-3" style={{ fontFamily: FONTS.HEAD, color: COLORS.forestDark }}>
              শাখা অনুযায়ী বিক্রয় (Branch-wise Sales)
              {selectedBranchName && <span className="font-medium text-[12.5px]" style={{ color: COLORS.muted }}> — {selectedBranchName}</span>}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left" style={{ color: COLORS.muted }}>
                    {["Branch", "Sold Qty", "Sold Value", "Returned Qty", "Returned Value", "Damaged Qty", "Damaged Value"].map((h, i) => (
                      <th key={h} className={`font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b ${i > 0 ? "text-right" : ""}`} style={{ borderColor: COLORS.line }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredBranches.map((b, i) => (
                    <tr key={b.id} style={i !== filteredBranches.length - 1 ? { borderBottom: `1px dashed ${COLORS.line}` } : undefined}>
                      <td className="py-3 px-2.5 font-semibold" style={{ color: COLORS.purple }}>{b.name}</td>
                      <td className="py-3 px-2.5 text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{b.sold_qty.toLocaleString()}</td>
                      <td className="py-3 px-2.5 text-right font-bold" style={{ color: COLORS.forestDark, fontFamily: FONTS.MONO }}>৳{formatCurrency(b.sold_value)}</td>
                      <td className="py-3 px-2.5 text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{b.returned_qty.toLocaleString()}</td>
                      <td className="py-3 px-2.5 text-right font-bold" style={{ color: COLORS.magenta, fontFamily: FONTS.MONO }}>৳{formatCurrency(b.returned_value)}</td>
                      <td className="py-3 px-2.5 text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{b.damaged_qty.toLocaleString()}</td>
                      <td className="py-3 px-2.5 text-right font-bold" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>৳{formatCurrency(b.damaged_value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ============ SOLD PRODUCTS TABLE ============ */}
        <div className="relative rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
          <ScallopBorder id="scallop-sold" colors={PETALS} />
          <div className="p-5 pt-7">
            <h3 className="font-bold text-[14.5px] mb-3" style={{ fontFamily: FONTS.HEAD, color: COLORS.forest }}>
              বিক্রিত প্রোডাক্ট (Sold Products)
              {selectedBranchName && <span className="font-medium text-[12.5px]" style={{ color: COLORS.muted }}> — {selectedBranchName}</span>}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left" style={{ color: COLORS.muted }}>
                    {["Product", "Barcode", "Branch", "Qty Sold", "Value", "Date"].map((h, i) => (
                      <th key={h} className={`font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b ${i >= 3 ? "text-right" : ""}`} style={{ borderColor: COLORS.line }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredSold.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[13px]" style={{ color: COLORS.muted }}>কোন বিক্রয় তথ্য পাওয়া যায়নি।</td>
                    </tr>
                  ) : (
                    filteredSold.map((d, i) => (
                      <tr key={d.id} style={i !== filteredSold.length - 1 ? { borderBottom: `1px dashed ${COLORS.line}` } : undefined}>
                        <td className="py-3 px-2.5 font-semibold" style={{ color: COLORS.purple }}>{d.name}</td>
                        <td className="py-3 px-2.5" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{d.barcode}</td>
                        <td className="py-3 px-2.5 text-right" style={{ color: COLORS.ink }}>{d.branch}</td>
                        <td className="py-3 px-2.5 text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{d.qty}</td>
                        <td className="py-3 px-2.5 text-right font-bold" style={{ color: COLORS.forestDark, fontFamily: FONTS.MONO }}>৳{formatCurrency(d.value)}</td>
                        <td className="py-3 px-2.5 text-right text-[12px]" style={{ color: COLORS.muted }}>{d.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ============ RETURNED PRODUCTS TABLE ============ */}
        <div className="relative rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
          <ScallopBorder id="scallop-returned" colors={PETALS} />
          <div className="p-5 pt-7">
            <h3 className="font-bold text-[14.5px] mb-3" style={{ fontFamily: FONTS.HEAD, color: COLORS.magenta }}>
              রিটার্ন হওয়া প্রোডাক্ট (Returned Products)
              {selectedBranchName && <span className="font-medium text-[12.5px]" style={{ color: COLORS.muted }}> — {selectedBranchName}</span>}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left" style={{ color: COLORS.muted }}>
                    {["Product", "Barcode", "Branch", "Qty", "Reason", "Value", "Date"].map((h, i) => (
                      <th key={h} className={`font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b ${i >= 3 && i !== 4 ? "text-right" : ""}`} style={{ borderColor: COLORS.line }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredReturned.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[13px]" style={{ color: COLORS.muted }}>কোন রিটার্ন তথ্য পাওয়া যায়নি।</td>
                    </tr>
                  ) : (
                    filteredReturned.map((d, i) => (
                      <tr key={d.id} style={i !== filteredReturned.length - 1 ? { borderBottom: `1px dashed ${COLORS.line}` } : undefined}>
                        <td className="py-3 px-2.5 font-semibold" style={{ color: COLORS.purple }}>{d.name}</td>
                        <td className="py-3 px-2.5" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{d.barcode}</td>
                        <td className="py-3 px-2.5 text-right" style={{ color: COLORS.ink }}>{d.branch}</td>
                        <td className="py-3 px-2.5 text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{d.qty}</td>
                        <td className="py-3 px-2.5">
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: COLORS.magentaTint, color: COLORS.magenta }}>{d.reason}</span>
                        </td>
                        <td className="py-3 px-2.5 text-right font-bold" style={{ color: COLORS.magenta, fontFamily: FONTS.MONO }}>৳{formatCurrency(d.value)}</td>
                        <td className="py-3 px-2.5 text-right text-[12px]" style={{ color: COLORS.muted }}>{d.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ============ DAMAGED PRODUCTS TABLE ============ */}
        <div className="relative rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
          <ScallopBorder id="scallop-damaged" colors={PETALS} />
          <div className="p-5 pt-7 pb-6">
            <h3 className="font-bold text-[14.5px] mb-3" style={{ fontFamily: FONTS.HEAD, color: COLORS.vermillion }}>
              ড্যামেজ প্রোডাক্ট (Damaged Products)
              {selectedBranchName && <span className="font-medium text-[12.5px]" style={{ color: COLORS.muted }}> — {selectedBranchName}</span>}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left" style={{ color: COLORS.muted }}>
                    {["Product", "Barcode", "Branch", "Qty", "Reason", "Value", "Date"].map((h, i) => (
                      <th key={h} className={`font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b ${i >= 3 && i !== 4 ? "text-right" : ""}`} style={{ borderColor: COLORS.line }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredDamaged.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[13px]" style={{ color: COLORS.muted }}>কোন ড্যামেজ প্রোডাক্ট তথ্য পাওয়া যায়নি।</td>
                    </tr>
                  ) : (
                    filteredDamaged.map((d, i) => (
                      <tr key={d.id} style={i !== filteredDamaged.length - 1 ? { borderBottom: `1px dashed ${COLORS.line}` } : undefined}>
                        <td className="py-3 px-2.5 font-semibold" style={{ color: COLORS.purple }}>{d.name}</td>
                        <td className="py-3 px-2.5" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{d.barcode}</td>
                        <td className="py-3 px-2.5 text-right" style={{ color: COLORS.ink }}>{d.branch}</td>
                        <td className="py-3 px-2.5 text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{d.qty}</td>
                        <td className="py-3 px-2.5">
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: COLORS.vermillionTint, color: COLORS.vermillion }}>{d.reason}</span>
                        </td>
                        <td className="py-3 px-2.5 text-right font-bold" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>৳{formatCurrency(d.value)}</td>
                        <td className="py-3 px-2.5 text-right text-[12px]" style={{ color: COLORS.muted }}>{d.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductSummaryPage;