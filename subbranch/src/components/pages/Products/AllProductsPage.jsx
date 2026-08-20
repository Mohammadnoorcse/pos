import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, Pencil, Trash2, Plus, Package, X, Loader2 } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { FieldLabel } from "../../shared/FormElements";
import { COLORS, PETALS, FONTS } from "../../../constants";

// API Services
import {
  fetchProducts,
  updateProduct,
  deleteProduct,
} from "../../../api/productService";
import { fetchBranches } from "../../../api/branchService";

/* ==========================================================================
   1. EDIT PRODUCT MODAL COMPONENT
   ========================================================================== */
function EditProductModal({ product, onClose, onSave }) {
  const [title, setTitle] = useState(product.title || product.name || "");
  const [branchId, setBranchId] = useState(
    String(product.branch_id || product.branch?.id || "")
  );
  const [branches, setBranches] = useState([]);
  const [purchasePrice, setPurchasePrice] = useState(
    String(product.purchase_price || product.purchase || "")
  );
  const [sellingPrice, setSellingPrice] = useState(
    String(product.selling_price || product.selling || "")
  );
  const [stockQty, setStockQty] = useState(
    String(product.stock_qty ?? product.stock ?? "0")
  );
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const res = await fetchBranches();
        setBranches(res.data || res);
      } catch (err) {
        console.error("Failed to load branches:", err);
      }
    };
    loadBranches();
  }, []);

  const fieldStyle = {
    backgroundColor: COLORS.paper,
    borderColor: COLORS.line,
    color: COLORS.ink,
    fontFamily: FONTS.BODY,
  };
  const fieldClass = "w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none";

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || !branchId) return;

    setLoading(true);
    try {
      const payload = {
        title: trimmedTitle,
        branch_id: branchId,
        purchase_price: parseFloat(purchasePrice) || 0,
        selling_price: parseFloat(sellingPrice) || 0,
        stock_qty: parseInt(stockQty, 10) || 0,
        category_id: product.category_id || product.category?.id,
        unit_type_id: product.unit_type_id || product.unit_type?.id,
        brand_id: product.brand_id || product.brand?.id,
      };

      const updatedData = await updateProduct(product.id, payload);
      // Fallback merge in case the API response doesn't echo stock_qty/branch back
      onSave({ ...updatedData, stock_qty: payload.stock_qty, branch_id: payload.branch_id });
    } catch (err) {
      alert("Failed to update product: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: "rgba(43,35,32,0.45)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-lg max-h-[92vh] sm:max-h-[85vh] overflow-hidden rounded-t-2xl sm:rounded-2xl border flex flex-col"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        onClick={(e) => e.stopPropagation()}
      >
        <ScallopBorder id="scallop-edit-product" colors={PETALS} />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-7 pb-3 shrink-0">
          <h3
            className="font-bold text-[16px]"
            style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
          >
            Edit Product
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: COLORS.paper, color: COLORS.muted }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 pb-6 overflow-y-auto space-y-4">
          <div>
            <FieldLabel required>Product Title</FieldLabel>
            <input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={fieldClass}
              style={fieldStyle}
            />
          </div>

          <div>
            <FieldLabel required>Branch</FieldLabel>
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className={fieldClass}
              style={fieldStyle}
              required
            >
              <option value="">-- Select Branch --</option>
              {branches.map((br) => (
                <option key={br.id} value={br.id}>{br.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Category</FieldLabel>
              <input
                value={product.category?.name || product.category || "—"}
                disabled
                className={`${fieldClass} opacity-60 cursor-not-allowed`}
                style={fieldStyle}
              />
            </div>
            <div>
              <FieldLabel>Brand</FieldLabel>
              <input
                value={product.brand?.name || product.brand || "N/A"}
                disabled
                className={`${fieldClass} opacity-60 cursor-not-allowed`}
                style={fieldStyle}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <FieldLabel>Purchase Price</FieldLabel>
              <input
                type="number"
                step="0.01"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                className={fieldClass}
                style={{ ...fieldStyle, fontFamily: FONTS.MONO }}
              />
            </div>
            <div>
              <FieldLabel>Selling Price</FieldLabel>
              <input
                type="number"
                step="0.01"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                className={fieldClass}
                style={{ ...fieldStyle, fontFamily: FONTS.MONO }}
              />
            </div>
            <div>
              <FieldLabel>Stock Quantity</FieldLabel>
              <input
                type="number"
                min="0"
                step="1"
                value={stockQty}
                onChange={(e) => setStockQty(e.target.value)}
                className={fieldClass}
                style={{ ...fieldStyle, fontFamily: FONTS.MONO }}
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-2.5 pt-2">
            <button
              onClick={onClose}
              type="button"
              className="font-semibold text-[13px] px-5 py-2.5 rounded-lg border"
              style={{
                borderColor: COLORS.line,
                color: COLORS.muted,
                backgroundColor: COLORS.panel,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || !branchId || loading}
              className="text-white font-semibold text-[13px] px-5 py-2.5 rounded-lg shadow-md disabled:opacity-40 flex items-center gap-2"
              style={{
                backgroundColor: COLORS.magenta,
                boxShadow: `0 4px 10px ${COLORS.magenta}40`,
              }}
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. MAIN ALL PRODUCTS PAGE COMPONENT
   ========================================================================== */
export function AllProductsPage({ onNavigate }) {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  // 1. API থেকে প্রোডাক্ট লিস্ট নিয়ে আসা
  const loadProducts = useCallback(async (searchQuery = "") => {
    setLoading(true);
    try {
      const response = await fetchProducts({ search: searchQuery });
      // Laravel Pagination response
      setProducts(response.data || response);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial Fetch
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Search Debounce Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts(query);
    }, 400);

    return () => clearTimeout(timer);
  }, [query, loadProducts]);

  // 2. প্রোডাক্ট ডিলিট করা
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to delete product: " + err.message);
    }
  };

  // 3. এডিট করার পর UI আপডেট করা
  const handleSaveProduct = (updated) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
    );
    setEditingProduct(null);
  };

  return (
    <div
      className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-all-products" colors={PETALS} />

      {/* Header Section */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2
          className="font-bold text-[16px]"
          style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
        >
          All Products
        </h2>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search Bar */}
          <div
            className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] border"
            style={{
              backgroundColor: COLORS.paper,
              borderColor: COLORS.line,
              color: COLORS.muted,
            }}
          >
            <Search size={14} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search product, barcode…"
              className="bg-transparent outline-none text-[13px] w-44"
              style={{ color: COLORS.ink, fontFamily: FONTS.BODY }}
            />
          </div>

          {/* Add New Product Button */}
          <button
            onClick={() => onNavigate && onNavigate("add-new-product")}
            className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md"
            style={{
              backgroundColor: COLORS.magenta,
              boxShadow: `0 4px 10px ${COLORS.magenta}40`,
            }}
          >
            <Plus size={14} /> Add New Product
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left" style={{ color: COLORS.muted }}>
              <th
                className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                style={{ borderColor: COLORS.line }}
              >
                SI
              </th>
              <th
                className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                style={{ borderColor: COLORS.line }}
              >
                Product
              </th>
              <th
                className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                style={{ borderColor: COLORS.line }}
              >
                Branch
              </th>
              <th
                className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                style={{ borderColor: COLORS.line }}
              >
                Category
              </th>
              <th
                className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                style={{ borderColor: COLORS.line }}
              >
                Brand
              </th>
              <th
                className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-right"
                style={{ borderColor: COLORS.line }}
              >
                Purchase
              </th>
              <th
                className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-right"
                style={{ borderColor: COLORS.line }}
              >
                Selling
              </th>
              <th
                className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-center"
                style={{ borderColor: COLORS.line }}
              >
                Stock
              </th>
              <th
                className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                style={{ borderColor: COLORS.line }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="py-12 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm" style={{ color: COLORS.muted }}>
                    <Loader2 size={18} className="animate-spin" />
                    Loading products...
                  </div>
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((p, i) => {
                // branch_stock ব্যাকএন্ড থেকে আসে (product_stocks টেবিল থেকে, transfer সহ)
                // p.stock_qty শুধু প্রোডাক্টের নিজস্ব/home ব্রাঞ্চের কলাম — transfer এ আপডেট হয় না
                const stockQty = p.branch_stock ?? p.stock_qty ?? p.stock ?? 0;
                const categoryName = p.category?.name || p.category || "Uncategorized";
                const brandName = p.brand?.name || p.brand || "—";
                const branchName = p.branch?.name || p.branch || "—";
                const title = p.title || p.name;

                return (
                  <tr
                    key={p.id}
                    style={
                      i !== products.length - 1
                        ? { borderBottom: `1px solid ${COLORS.line}` }
                        : undefined
                    }
                  >
                    <td className="py-3 px-2.5" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>
                      {p.id}
                    </td>
                    <td className="py-3 px-2.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden"
                          style={{
                            backgroundColor: COLORS.magentaTint,
                            color: COLORS.magenta,
                          }}
                        >
                          {p.image_path ? (
                            <img
                              src={`${import.meta.env.VITE_STORAGE_URL || "http://localhost:8000/storage"}/${p.image_path}`}
                              alt={title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package size={14} />
                          )}
                        </div>
                        <span className="font-semibold" style={{ color: COLORS.ink }}>
                          {title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2.5" style={{ color: COLORS.muted }}>
                      {branchName}
                    </td>
                    <td className="py-3 px-2.5" style={{ color: COLORS.muted }}>
                      {categoryName}
                    </td>
                    <td className="py-3 px-2.5" style={{ color: COLORS.muted }}>
                      {brandName}
                    </td>
                    <td
                      className="py-3 px-2.5 text-right font-semibold"
                      style={{ fontFamily: FONTS.MONO, color: COLORS.ink }}
                    >
                      ৳{parseFloat(p.purchase_price || p.purchase || 0).toFixed(2)}
                    </td>
                    <td
                      className="py-3 px-2.5 text-right font-semibold"
                      style={{ fontFamily: FONTS.MONO, color: COLORS.ink }}
                    >
                      ৳{parseFloat(p.selling_price || p.selling || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-2.5 text-center">
                      <span
                        className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                        style={
                          stockQty <= (p.alert_quantity || 3)
                            ? {
                                backgroundColor: COLORS.vermillionTint,
                                color: COLORS.vermillion,
                              }
                            : { backgroundColor: COLORS.forestTint, color: COLORS.forestDark }
                        }
                      >
                        {stockQty} pcs
                      </span>
                    </td>
                    <td className="py-3 px-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-opacity hover:opacity-90"
                          style={{ backgroundColor: COLORS.peacock }}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-opacity hover:opacity-90"
                          style={{ backgroundColor: COLORS.vermillion }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="py-8 text-center text-[13px]"
                  style={{ color: COLORS.muted }}
                >
                  No products match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal Component */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}