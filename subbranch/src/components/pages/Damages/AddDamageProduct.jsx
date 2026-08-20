import React, { useState, useEffect } from "react";
import { Search, Plus, ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { COLORS, PETALS, FONTS, SUB_BRANCH_ID } from "../../../constants";
import { fetchDamageProducts, createDamageRecord } from "../../../api/damageService";

export function AddDamageProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [perPage, setPerPage] = useState(100);
  const [page, setPage] = useState(1);

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load Products
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { search: query, page, per_page: perPage };
      // এই ব্রাঞ্চের প্রোডাক্ট (নিজস্ব + transfer হয়ে আসা) — শুধু এগুলোই দেখাবে।
      if (SUB_BRANCH_ID) params.branch_id = SUB_BRANCH_ID;
      const data = await fetchDamageProducts(params);
      setProducts(data.data || data || []);
    } catch (err) {
      console.error("Error loading damage products:", err);
      setError("প্রোডাক্ট লিস্ট লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [query, page, perPage]);

  // Modal Open Handler (Auto-fill price if available from product)
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setQuantity("");
    setPurchasePrice(product.purchase_price || product.pp || "");
    setSellingPrice(product.selling_price || product.sales_price || product.sp || product.price || "");
    setDate(new Date().toISOString().split("T")[0]);
    setReason("");
  };

  // Submit Damage Record
  const handleSubmitDamage = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !quantity || !purchasePrice) return;

    try {
      setSubmitting(true);
      
      const payload = {
        product_id: selectedProduct.id,
        // এই ব্রাঞ্চ থেকেই স্টক কাটা হবে — না দিলে backend কোন ব্রাঞ্চের স্টক
        // কমাবে বুঝতে পারবে না (branch_id nullable বলে ভুল/কোনো row নাও মিলতে পারে)।
        branch_id: SUB_BRANCH_ID || selectedProduct.branch_id || null,
        quantity: Number(quantity),
        purchase_price: Number(purchasePrice),
        sales_price: Number(sellingPrice) || 0,
        date: date,
        reason: reason,
      };

      await createDamageRecord(payload);

      alert("ড্যামেজ রেকর্ড সফলভাবে যুক্ত হয়েছে!");
      setSelectedProduct(null);
      loadProducts();
    } catch (err) {
      console.error("Error creating damage record:", err);
      alert(err.message || "ড্যামেজ তথ্য সেভ করতে ব্যর্থ হয়েছে।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: COLORS.page, minHeight: "100vh" }} className="p-7 font-sans">
      <div className="mx-auto mb-6 h-1.5 max-w-5xl rounded-full bg-gradient-to-r from-pink-500 via-orange-400 via-teal-500 to-violet-600" />

      <div
        className="mx-auto max-w-5xl overflow-hidden rounded-2xl border relative"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
      >
        <ScallopBorder id="scallop-damage-header" colors={PETALS} />

        {/* Header */}
        <div className="border-b px-7 py-6" style={{ borderColor: COLORS.line }}>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: COLORS.accent, fontFamily: FONTS.HEAD }}
          >
            Add Damage Product
          </h1>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-7 pt-5">
          <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.muted }}>
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
              <option value={100}>100</option>
              <option value={50}>50</option>
              <option value={25}>25</option>
              <option value={10}>10</option>
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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-64 rounded-xl border-[1.5px] py-2 pl-9 pr-3 text-sm outline-none"
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

        {/* Table Area */}
        <div className="mt-5 overflow-x-auto px-7">
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-slate-500">
              <Loader2 className="animate-spin" size={20} />
              <span>ডাটা লোড হচ্ছে...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr style={{ backgroundColor: COLORS.paper }}>
                  <th
                    className="whitespace-nowrap rounded-tl-xl border-b-2 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{ borderColor: COLORS.line, color: COLORS.accent, fontFamily: FONTS.HEAD }}
                  >
                    Product Name
                  </th>
                  <th
                    className="whitespace-nowrap border-b-2 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{ borderColor: COLORS.line, color: COLORS.accent, fontFamily: FONTS.HEAD }}
                  >
                    Product Barcode
                  </th>
                  <th
                    className="whitespace-nowrap rounded-tr-xl border-b-2 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{ borderColor: COLORS.line, color: COLORS.accent, fontFamily: FONTS.HEAD }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-10 text-center" style={{ color: COLORS.muted }}>
                      No matching products found.
                    </td>
                  </tr>
                ) : (
                  products.map((p, i) => (
                    <tr
                      key={p.id || i}
                      className="border-b transition-colors"
                      style={{ borderColor: COLORS.line }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.paper + "40")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <td className="px-4 py-4 font-medium" style={{ color: COLORS.ink }}>
                        {p.name}
                      </td>
                      <td className="px-4 py-4" style={{ color: COLORS.muted }}>
                        {p.barcode || "—"}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleOpenModal(p)}
                          className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
                          style={{ backgroundColor: COLORS.rust }}
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer / Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-7 py-6">
          <p className="text-sm" style={{ color: COLORS.muted }}>
            Showing {products.length} entries
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="flex items-center gap-1 rounded-lg border-[1.5px] px-3 py-1.5 text-sm font-medium transition-colors hover:bg-opacity-50 disabled:opacity-40"
              style={{ borderColor: COLORS.line, color: COLORS.muted, backgroundColor: COLORS.paper }}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <span className="px-3 py-1 text-sm font-semibold" style={{ color: COLORS.ink }}>
              Page {page}
            </span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="flex items-center gap-1 rounded-lg border-[1.5px] px-3 py-1.5 text-sm font-medium transition-colors hover:bg-opacity-50"
              style={{ borderColor: COLORS.line, color: COLORS.muted, backgroundColor: COLORS.paper }}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Damage Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            className="w-full max-w-lg rounded-2xl p-6 shadow-xl relative border max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.ink, fontFamily: FONTS.HEAD }}>
              Add Damage: {selectedProduct.name}
            </h3>

            <form onSubmit={handleSubmitDamage} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: COLORS.muted }}>
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Qty"
                    className="w-full rounded-xl border-[1.5px] p-2.5 text-sm outline-none"
                    style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper, color: COLORS.ink }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: COLORS.muted }}>
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border-[1.5px] p-2.5 text-sm outline-none"
                    style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper, color: COLORS.ink }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: COLORS.muted }}>
                    Purchase Price (ক্রয়মূল্য) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    placeholder="Purchase Price"
                    className="w-full rounded-xl border-[1.5px] p-2.5 text-sm outline-none"
                    style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper, color: COLORS.ink }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: COLORS.muted }}>
                    Selling Price (বিক্রয়মূল্য)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder="Selling Price"
                    className="w-full rounded-xl border-[1.5px] p-2.5 text-sm outline-none"
                    style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper, color: COLORS.ink }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: COLORS.muted }}>
                  Reason / Notes
                </label>
                <textarea
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for damage..."
                  className="w-full rounded-xl border-[1.5px] p-2.5 text-sm outline-none resize-none"
                  style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper, color: COLORS.ink }}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 text-sm font-semibold rounded-lg border"
                  style={{ borderColor: COLORS.line, color: COLORS.muted }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-semibold rounded-lg text-white flex items-center gap-2"
                  style={{ backgroundColor: COLORS.rust }}
                >
                  {submitting && <Loader2 className="animate-spin" size={16} />}
                  Confirm Damage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}