import React, { useState, useEffect, useCallback } from "react";
import { Search, Download, Printer, ChevronDown, Loader2, Edit3, X, Check } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { COLORS, PETALS, FONTS, SUB_BRANCH_ID } from "../../../constants";
import { formatCurrency } from "../../../utils";
import { fetchProductStocks, updateProductStock } from "../../../api/productStockService";
import { fetchBranches } from "../../../api/branchService";

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
  const [branchId, setBranchId] = useState(SUB_BRANCH_ID ? String(SUB_BRANCH_ID) : "");
  const [stockType, setStockType] = useState("all"); // 'all', 'active'
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [query, setQuery] = useState("");
  const [perPage, setPerPage] = useState("100");

  // Main branch (SUB_BRANCH_ID না থাকলে) সব ব্রাঞ্চের লিস্ট লোড করা হবে,
  // যাতে চাইলে নির্দিষ্ট একটা ব্রাঞ্চ বেছেও দেখা যায়। Sub-branch ইউজার নিজের ব্রাঞ্চেই আটকে থাকবে।
  const isMainBranch = !SUB_BRANCH_ID;
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    if (!isMainBranch) return;
    const loadBranches = async () => {
      try {
        const res = await fetchBranches();
        setBranches(res.data || res);
      } catch (err) {
        console.error("Failed to load branches:", err);
      }
    };
    loadBranches();
  }, [isMainBranch]);

  // Stock Update Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updateAction, setUpdateAction] = useState("add"); // 'add', 'subtract', 'set'
  const [updateQty, setUpdateQty] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

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
      
      const stockData = response.data?.data || response.data || [];
      setStocks(stockData);

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
    }, 300);

    return () => clearTimeout(timer);
  }, [loadStocks]);

  // Modal Open Handler
  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setUpdateAction("add");
    setUpdateQty("");
    setUpdateError("");
    setIsModalOpen(true);
  };

  // Submit Stock Update
  const handleSaveStock = async (e) => {
    e.preventDefault();
    if (!updateQty || isNaN(updateQty) || Number(updateQty) < 0) {
      setUpdateError("সঠিক পরিমাণের সংখ্যা লিখুন।");
      return;
    }

    try {
      setIsUpdating(true);
      setUpdateError("");

      const productId = selectedItem.product_id || selectedItem.id;
      const targetBranchId = selectedItem.stocks?.[0]?.branch_id || branchId || 1; // Default branch fallback

      await updateProductStock(productId, {
        branch_id: targetBranchId,
        product_variant_id: selectedItem.product_variant_id || null,
        quantity: parseInt(updateQty, 10),
        action: updateAction,
      });

      setIsModalOpen(false);
      loadStocks(); // Reload updated table & summary
    } catch (err) {
      console.error("Failed to update stock:", err);
      setUpdateError(err.message || "স্টক আপডেট করতে ব্যর্থ হয়েছে।");
    } finally {
      setIsUpdating(false);
    }
  };

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
          {/* Branch Filter — শুধু Main Branch থেকে দেখানো হয়; Sub-branch নিজের ব্রাঞ্চেই আটকে থাকে */}
          {isMainBranch && (
            <StockFilterSelect
              value={branchId}
              onChange={(val) => setBranchId(val)}
              options={[
                { value: "", label: "All Branches" },
                ...branches.map((b) => ({ value: String(b.id), label: b.name })),
              ]}
              accentColor={COLORS.forest}
            />
          )}

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

          {/* Brand Filter */}
          <StockFilterSelect
            value={brandId}
            onChange={(val) => setBrandId(val)}
            options={[{ value: "", label: "All Brands" }]}
            accentColor={COLORS.marigold}
          />

          {/* Category Filter */}
          <StockFilterSelect
            value={categoryId}
            onChange={(val) => setCategoryId(val)}
            options={[{ value: "", label: "All Categories" }]}
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
                {isMainBranch && (
                  <th
                    className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                    style={{ borderColor: COLORS.line }}
                  >
                    Branch
                  </th>
                )}
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
                <th
                  className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-center"
                  style={{ borderColor: COLORS.line }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {stocks.length === 0 ? (
                <tr>
                  <td
                    colSpan={isMainBranch ? 8 : 7}
                    className="py-8 text-center text-[13px]"
                    style={{ color: COLORS.muted }}
                  >
                    কোন প্রোডাক্টের স্টক তথ্য পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                stocks.map((item, i) => {
                  const product = item.product || item;
                  // branch_stock ব্যাকএন্ড থেকে আসে — শুধু সিলেক্ট করা ব্রাঞ্চের কোয়ান্টিটি।
                  // item.stock_qty প্রোডাক্টের গ্লোবাল (সব ব্রাঞ্চ মিলিয়ে) সংখ্যা, তাই এখানে ব্যবহার করা যাবে না।
                  const currentQuantity = item.branch_stock ?? item.quantity ?? 0;
                  const variantValues = item.variant?.values?.map((v) => v.name).join(", ");
                  // নির্দিষ্ট ব্রাঞ্চ ফিল্টার করা থাকলে সেই ব্রাঞ্চের নাম, নাহলে "All Branches" (মোট যোগফল)
                  const rowBranchName = branchId
                    ? branches.find((b) => String(b.id) === String(branchId))?.name || "—"
                    : "All Branches";

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
                          {item.stocks?.[0]?.lot_no ? `Lot: ${item.stocks[0].lot_no}` : "No Lot"}
                        </div>
                      </td>
                      {isMainBranch && (
                        <td className="py-3 px-2.5" style={{ color: COLORS.muted }}>
                          {rowBranchName}
                        </td>
                      )}
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
                            currentQuantity <= (product.alert_quantity || 5)
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
                          {currentQuantity}
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
                      <td className="py-3 px-2.5 text-center">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-1.5 rounded-lg border hover:opacity-80 transition-opacity"
                          title="Update Stock"
                          style={{
                            backgroundColor: COLORS.paper,
                            borderColor: COLORS.line,
                            color: COLORS.peacock,
                          }}
                        >
                          <Edit3 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* STOCK UPDATE MODAL */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden p-6 relative animate-in fade-in zoom-in duration-150"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>

            <h3
              className="text-lg font-bold mb-1"
              style={{ fontFamily: FONTS.HEAD, color: COLORS.forestDark }}
            >
              Update Stock Quantity
            </h3>
            <p className="text-[13px] mb-4" style={{ color: COLORS.muted }}>
              Product: <span className="font-semibold text-slate-800">{(selectedItem.product || selectedItem).title}</span>
            </p>

            {updateError && (
              <div className="mb-3 p-2.5 rounded-lg text-[12px] bg-red-50 text-red-600 border border-red-200">
                {updateError}
              </div>
            )}

            <form onSubmit={handleSaveStock} className="space-y-4">
              {/* Action Selector */}
              <div>
                <label className="block text-[12px] font-semibold mb-1.5" style={{ color: COLORS.ink }}>
                  Update Action
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "add", label: "Add (+)" },
                    { id: "subtract", label: "Subtract (-)" },
                    { id: "set", label: "Set Exact" },
                  ].map((act) => (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => setUpdateAction(act.id)}
                      className={`py-2 text-[12px] font-semibold rounded-lg border transition-all ${
                        updateAction === act.id ? "shadow-sm" : ""
                      }`}
                      style={{
                        backgroundColor: updateAction === act.id ? COLORS.peacock : COLORS.paper,
                        color: updateAction === act.id ? "#ffffff" : COLORS.ink,
                        borderColor: updateAction === act.id ? COLORS.peacock : COLORS.line,
                      }}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Input */}
              <div>
                <label className="block text-[12px] font-semibold mb-1.5" style={{ color: COLORS.ink }}>
                  Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={updateQty}
                  onChange={(e) => setUpdateQty(e.target.value)}
                  placeholder="Enter quantity..."
                  className="w-full px-3 py-2 rounded-lg border outline-none text-[13px]"
                  style={{
                    backgroundColor: COLORS.paper,
                    borderColor: COLORS.line,
                    color: COLORS.ink,
                    fontFamily: FONTS.MONO,
                  }}
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-[12.5px] font-semibold border hover:bg-slate-100"
                  style={{ borderColor: COLORS.line, color: COLORS.ink }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-lg text-[12.5px] font-semibold text-white flex items-center gap-1.5 shadow-md disabled:opacity-50"
                  style={{ backgroundColor: COLORS.forest }}
                >
                  {isUpdating ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}