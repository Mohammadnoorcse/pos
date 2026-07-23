import React from "react";
import { Search, Pencil, Trash2, Plus, Package, X } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { FieldLabel } from "../../shared/FormElements";
import { COLORS, PETALS, FONTS, DEFAULT_ALL_PRODUCTS } from "../../../constants";

function EditProductModal({ product, onClose, onSave }) {
  const [name, setName] = React.useState(product.name);
  const [category, setCategory] = React.useState(product.category);
  const [brand, setBrand] = React.useState(product.brand);
  const [purchase, setPurchase] = React.useState(product.purchase);
  const [selling, setSelling] = React.useState(product.selling);
  const [stock, setStock] = React.useState(String(product.stock));
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const fieldStyle = {
    backgroundColor: COLORS.paper,
    borderColor: COLORS.line,
    color: COLORS.ink,
    fontFamily: FONTS.BODY,
  };
  const fieldClass = "w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none";

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave({
      ...product,
      name: trimmed,
      category: category.trim() || product.category,
      brand: brand.trim() || product.brand,
      purchase: purchase.trim() || product.purchase,
      selling: selling.trim() || product.selling,
      stock: Math.max(0, Number(stock) || 0),
    });
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

        <div className="px-6 pb-6 overflow-y-auto space-y-4">
          <div>
            <FieldLabel required>Product Name</FieldLabel>
            <input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
              style={fieldStyle}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Category</FieldLabel>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={fieldClass}
                style={fieldStyle}
              />
            </div>
            <div>
              <FieldLabel>Brand</FieldLabel>
              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className={fieldClass}
                style={fieldStyle}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <FieldLabel>Purchase Price</FieldLabel>
              <input
                value={purchase}
                onChange={(e) => setPurchase(e.target.value)}
                className={fieldClass}
                style={{ ...fieldStyle, fontFamily: FONTS.MONO }}
              />
            </div>
            <div>
              <FieldLabel>Selling Price</FieldLabel>
              <input
                value={selling}
                onChange={(e) => setSelling(e.target.value)}
                className={fieldClass}
                style={{ ...fieldStyle, fontFamily: FONTS.MONO }}
              />
            </div>
            <div>
              <FieldLabel>Stock</FieldLabel>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className={fieldClass}
                style={{ ...fieldStyle, fontFamily: FONTS.MONO }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              onClick={onClose}
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
              disabled={!name.trim()}
              className="text-white font-semibold text-[13px] px-5 py-2.5 rounded-lg shadow-md disabled:opacity-40"
              style={{
                backgroundColor: COLORS.magenta,
                boxShadow: `0 4px 10px ${COLORS.magenta}40`,
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AllProductsPage({ onNavigate }) {
  const [products, setProducts] = React.useState(DEFAULT_ALL_PRODUCTS);
  const [query, setQuery] = React.useState("");
  const [editingProduct, setEditingProduct] = React.useState(null);

  const handleDelete = (id) => setProducts((prev) => prev.filter((p) => p.id !== id));

  const handleSaveProduct = (updated) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditingProduct(null);
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      p.brand.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-all-products" colors={PETALS} />
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2
          className="font-bold text-[16px]"
          style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
        >
          All Products
        </h2>
        <div className="flex items-center gap-2.5 flex-wrap">
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
              placeholder="Search product, brand, category…"
              className="bg-transparent outline-none text-[13px] w-44"
              style={{ color: COLORS.ink, fontFamily: FONTS.BODY }}
            />
          </div>
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
            {filtered.map((p, i) => (
              <tr
                key={p.id}
                style={
                  i !== filtered.length - 1
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
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: COLORS.magentaTint,
                        color: COLORS.magenta,
                      }}
                    >
                      <Package size={14} />
                    </div>
                    <span className="font-semibold" style={{ color: COLORS.ink }}>
                      {p.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2.5" style={{ color: COLORS.muted }}>
                  {p.category}
                </td>
                <td className="py-3 px-2.5" style={{ color: COLORS.muted }}>
                  {p.brand}
                </td>
                <td
                  className="py-3 px-2.5 text-right font-semibold"
                  style={{ fontFamily: FONTS.MONO, color: COLORS.ink }}
                >
                  ৳{p.purchase}
                </td>
                <td
                  className="py-3 px-2.5 text-right font-semibold"
                  style={{ fontFamily: FONTS.MONO, color: COLORS.ink }}
                >
                  ৳{p.selling}
                </td>
                <td className="py-3 px-2.5 text-center">
                  <span
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                    style={
                      p.stock <= 3
                        ? {
                            backgroundColor: COLORS.vermillionTint,
                            color: COLORS.vermillion,
                          }
                        : { backgroundColor: COLORS.forestTint, color: COLORS.forestDark }
                    }
                  >
                    {p.stock} pcs
                  </span>
                </td>
                <td className="py-3 px-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: COLORS.peacock }}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: COLORS.vermillion }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={8}
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