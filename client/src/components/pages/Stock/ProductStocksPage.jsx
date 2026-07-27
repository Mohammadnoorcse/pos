import React, { useState, useEffect, useCallback } from "react";
import { Search, Download, Printer, ChevronDown, Loader2 } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { COLORS, PETALS, FONTS } from "../../../constants";
import { formatCurrency } from "../../../utils";
import { fetchProductStocks } from "../../../api/productStockService";

function StockFilterSelect({ value, onChange, options, accentColor = COLORS.peacock }) {
  
  
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
          <option key={o.id ?? o.value ?? o} value={o.id ?? o.value ?? o}>
            {o.label ?? o.name ?? o}
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

export function ProductStocksPage() {
  const [stocks, setStocks] = useState([]);
  const [summary, setSummary] = useState({ total_purchase_value: 0, total_sale_value: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [branchId, setBranchId] = useState("");
  const [stockType, setStockType] = useState("all"); // 'all', 'active'
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [query, setQuery] = useState("");
  const [perPage, setPerPage] = useState("100");

  
  const loadStocks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        branch_id: branchId || undefined,
        search: query || undefined,
        active_only: stockType === "active" ? true : undefined,
        category_id: categoryId || undefined,
        brand_id: brandId || undefined,
        per_page: perPage,
      };

      const response = await fetchProductStocks(params);
      
      // Laravel Paginate Response Payload Structure
      const stockData = response.data?.data || response.data || [];
      setStocks(stockData);
      console.log('product stock',stockData)

      if (response.summary) {
        setSummary(response.summary);
      }
    } catch (err) {
      console.error("Error loading product stocks:", err);
      setError("স্টক ডাটা লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }, [branchId, query, stockType, categoryId, brandId, perPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadStocks();
    }, 300); // Search Input Debounce delay

    return () => clearTimeout(timer);
  }, [loadStocks]);
  

  return (
    <div
      className="relative rounded-2xl border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-product-stocks" colors={PETALS} />

      {/* HEADER: Title + Filters + Actions */}
      <div
        className="p-5 pt-7 pb-4 flex items-center justify-between flex-wrap gap-3"
        style={{ borderBottom: `1px dashed ${COLORS.line}` }}
      >
        <h2
          className="font-bold text-[16px]"
          style={{
            fontFamily: FONTS.HEAD,
            color: COLORS.forestDark,
          }}
        >
          Current Active Stock Ledger
        </h2>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Stock Status Filter */}
          <StockFilterSelect
            value={stockType}
            onChange={(val) => setStockType(val)}
            options={[
              { value: "all", label: "All Stock" },
              { value: "active", label: "Active Stock (>0)" },
            ]}
            accentColor={COLORS.peacock}
          />

          {/* Brand Filter Placeholder */}
          <StockFilterSelect
            value={brandId}
            onChange={(val) => setBrandId(val)}
            options={[
              { value: "", label: "All Brands" },
            ]}
            accentColor={COLORS.marigold}
          />

          {/* Category Filter Placeholder */}
          <StockFilterSelect
            value={categoryId}
            onChange={(val) => setCategoryId(val)}
            options={[
              { value: "", label: "All Categories" },
            ]}
            accentColor={COLORS.rust}
          />

          {/* Print & Download Actions */}
          <button
            onClick={() => window.print()}
            className="text-white font-semibold text-[12.5px] px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-md hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: COLORS.purple,
              boxShadow: `0 4px 10px ${COLORS.purple}40`,
            }}
          >
            <Printer size={13} /> Print
          </button>
          <button
            className="text-white font-semibold text-[12.5px] px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-md hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: COLORS.forest,
              boxShadow: `0 4px 10px ${COLORS.forest}40`,
            }}
          >
            <Download size={13} /> Download
          </button>
        </div>
      </div>

      {/* STATS SUMMARY */}
      <div
        className="px-5 py-3 flex flex-wrap gap-x-8 gap-y-1"
        style={{ borderBottom: `1px dashed ${COLORS.line}` }}
      >
        <div className="text-[13px]">
          <span className="font-semibold" style={{ color: COLORS.ink }}>
            Total PP:{" "}
          </span>
          <span
            className="font-bold"
            style={{
              color: COLORS.forestDark,
              fontFamily: FONTS.MONO,
            }}
          >
            ৳{formatCurrency(summary.total_purchase_value || 0)}
          </span>
        </div>
        <div className="text-[13px]">
          <span className="font-semibold" style={{ color: COLORS.ink }}>
            Estimate Sale Price:{" "}
          </span>
          <span
            className="font-bold"
            style={{
              color: COLORS.magenta,
              fontFamily: FONTS.MONO,
            }}
          >
            ৳{formatCurrency(summary.total_sale_value || 0)}
          </span>
        </div>
      </div>

      {/* SHOW ENTRIES + SEARCH */}
      <div className="px-5 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-[12.5px] font-medium" style={{ color: COLORS.muted }}>
          Show
          <div className="relative">
            <select
              value={perPage}
              onChange={(e) => setPerPage(e.target.value)}
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

      {/* TABLE AREA */}
      <div className="overflow-x-auto px-5 pb-6">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-500 gap-2">
            <Loader2 className="animate-spin" size={20} />
            <span>স্টক ডাটা লোড হচ্ছে...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
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
                  Barcode
                </th>
                <th
                  className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-right"
                  style={{ borderColor: COLORS.line }}
                >
                  Purchase Price
                </th>
                <th
                  className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-right"
                  style={{ borderColor: COLORS.line }}
                >
                  Sale Price
                </th>
                <th
                  className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-center"
                  style={{ borderColor: COLORS.line }}
                >
                  Current Stock
                </th>
                <th
                  className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-center"
                  style={{ borderColor: COLORS.line }}
                >
                  Alert Qty
                </th>
              </tr>
            </thead>
            <tbody>
              {stocks.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-[13px]"
                    style={{ color: COLORS.muted }}
                  >
                    কোন প্রোডাক্টের স্টক তথ্য পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                stocks.map((item, i) => {
                  const product = item.product || {};
                  const variantValues = item.variant?.values?.map((v) => v.name).join(", ");

                  return (
                    <tr
                      key={item.id}
                      style={
                        i !== stocks.length - 1
                          ? { borderBottom: `1px dashed ${COLORS.line}` }
                          : undefined
                      }
                    >
                      <td className="py-3 px-2.5">
                        <div className="font-semibold" style={{ color: COLORS.purple }}>
                          {product.title || "N/A"}
                          {variantValues && (
                            <span className="ml-1 text-[12px]" style={{ color: COLORS.magenta }}>
                              ({variantValues})
                            </span>
                          )}
                        </div>
                        <div className="text-[11px]" style={{ color: COLORS.muted }}>
                          {item.branch?.name && `Branch: ${item.branch.name} | `}
                          {item.lot_no ? `Lot: ${item.lot_no}` : "No Lot"}
                        </div>
                      </td>
                      <td className="py-3 px-2.5" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                        {product.barcode || "—"}
                      </td>
                      <td
                        className="py-3 px-2.5 text-right font-semibold"
                        style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}
                      >
                        ৳{formatCurrency(product.purchase_price || 0)}
                      </td>
                      <td
                        className="py-3 px-2.5 text-right font-semibold"
                        style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}
                      >
                        ৳{formatCurrency(product.selling_price || 0)}
                      </td>
                      <td className="py-3 px-2.5 text-center">
                        <span
                          className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                          style={
                            item.quantity <= (product.alert_quantity || 5)
                              ? {
                                  backgroundColor: COLORS.vermillionTint,
                                  color: COLORS.vermillion,
                                }
                              : {
                                  backgroundColor: COLORS.forestTint,
                                  color: COLORS.forestDark,
                                }
                          }
                        >
                          {item.quantity}
                        </span>
                      </td>
                      <td
                        className="py-3 px-2.5 text-center font-semibold"
                        style={{
                          color: (product.alert_quantity || 0) > 0 ? COLORS.rust : COLORS.muted,
                          fontFamily: FONTS.MONO,
                        }}
                      >
                        {product.alert_quantity || 0}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}