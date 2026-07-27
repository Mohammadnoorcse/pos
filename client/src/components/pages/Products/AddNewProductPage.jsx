import React, { useState, useEffect } from "react";
import { ImageIcon } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { FieldLabel, TextField, SelectField, RadioOption } from "../../shared/FormElements";
import { BarcodeSVG } from "../../../utils";
import { COLORS, PETALS, FONTS } from "../../../constants";

// API Helpers
import { fetchBrands } from "../../../api/brandService";
import { fetchCategories } from "../../../api/categoryService";
import { fetchUnitTypes } from "../../../api/unitTypeService";
import { fetchBranches } from "../../../api/branchService";
import { createProduct, generateBarcode } from "../../../api/productService";

export function AddNewProductPage() {
  // Option lists from API
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [unitTypes, setUnitTypes] = useState([]);
  const [branches, setBranches] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    branch_id: "",
    brand_id: "",
    category_id: "",
    unit_type_id: "",
    purchase_price: "",
    selling_price: "",
    discount_status: "No",
    discount_value: "0",
    vat_status: "No",
    vat_percent: "0",
    alert_quantity: "0",
    description: "",
    barcode: "",
    stock_qty: "0",

  });

  const [imageFile, setImageFile] = useState(null);
  const [showBarcode, setShowBarcode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch Dropdown options on mount
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [brandRes, categoryRes, unitRes, branchRes] = await Promise.all([
          fetchBrands(),
          fetchCategories(),
          fetchUnitTypes(),
          fetchBranches(),
        ]);
        setBrands(brandRes.data || brandRes);
        setCategories(categoryRes.data || categoryRes);
        setUnitTypes(unitRes.data || unitRes);
        setBranches(branchRes.data || branchRes);
      } catch (err) {
        console.error("Failed to load options:", err);
      }
    };
    loadDropdownData();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateBarcode = async () => {
    try {
      const res = await generateBarcode();
      handleChange("barcode", res.barcode);
      setShowBarcode(true);
    } catch (err) {
      alert("Failed to generate barcode: " + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log(formData);
      const payload = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val !== null && val !== undefined) {
          payload.append(key, val);
        }
      });

      if (imageFile) {
        payload.append("image", imageFile);
      }

      await createProduct(payload);
      alert("Product created successfully!");
    } catch (err) {
      alert("Error creating product: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-add-product" colors={PETALS} />
      <h2
        className="font-bold text-[16px] mb-5"
        style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
      >
        Add New Product
      </h2>

      <div className="space-y-5">
        {/* Title */}
        <div>
          <FieldLabel required>Product Title</FieldLabel>
          <textarea
            rows={1}
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="e.g. Cotton Panjabi — Full Sleeve"
            className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none resize-y"
            style={{
              backgroundColor: COLORS.paper,
              borderColor: COLORS.line,
              color: COLORS.ink,
              fontFamily: FONTS.BODY,
            }}
            required
          />
        </div>

        {/* Branch */}
        <div>
          <FieldLabel required>Branch</FieldLabel>
          <select
            value={formData.branch_id}
            onChange={(e) => handleChange("branch_id", e.target.value)}
            className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none"
            style={{ backgroundColor: COLORS.paper, borderColor: COLORS.line, color: COLORS.ink }}
            required
          >
            <option value="">-- Select Branch --</option>
            {branches.map((br) => (
              <option key={br.id} value={br.id}>{br.name}</option>
            ))}
          </select>
        </div>

        {/* Brand, Category, Unit Type */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <FieldLabel>Product Brand</FieldLabel>
            <select
              value={formData.brand_id}
              onChange={(e) => handleChange("brand_id", e.target.value)}
              className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none"
              style={{ backgroundColor: COLORS.paper, borderColor: COLORS.line, color: COLORS.ink }}
            >
              <option value="">-- Select Brand --</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel required>Product Category</FieldLabel>
            <select
              value={formData.category_id}
              onChange={(e) => handleChange("category_id", e.target.value)}
              className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none"
              style={{ backgroundColor: COLORS.paper, borderColor: COLORS.line, color: COLORS.ink }}
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel required>Unit Type</FieldLabel>
            <select
              value={formData.unit_type_id}
              onChange={(e) => handleChange("unit_type_id", e.target.value)}
              className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none"
              style={{ backgroundColor: COLORS.paper, borderColor: COLORS.line, color: COLORS.ink }}
              required
            >
              <option value="">-- Select Unit Type --</option>
              {unitTypes.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing & Image */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-end">
<TextField
  label="Purchase Price"
  type="number"
  required
  placeholder="0.00"
  value={formData.purchase_price}
  onChange={(e) => handleChange("purchase_price", e.target.value)}
/>

<TextField
  label="Selling Price"
  type="number"
  required
  placeholder="0.00"
  value={formData.selling_price}
  onChange={(e) => handleChange("selling_price", e.target.value)}
/>
<TextField
    label="Stock Quantity"
    type="number"
    min="0"
    placeholder="0"
    value={formData.stock_qty}
    onChange={(e) => handleChange("stock_qty", e.target.value)}
  />
          <div>
            <FieldLabel>Image (80 X 80)</FieldLabel>
            <div className="flex items-center gap-3">
              <label
                className="flex items-center gap-2 rounded-lg border cursor-pointer overflow-hidden text-[12.5px] font-medium shrink-0"
                style={{
                  borderColor: COLORS.line,
                  backgroundColor: COLORS.paper,
                  color: COLORS.muted,
                }}
              >
                <span
                  className="px-3 py-2.5 font-semibold"
                  style={{ backgroundColor: COLORS.line, color: COLORS.ink }}
                >
                  Choose File
                </span>
                <span className="pr-3 truncate max-w-[100px]">
                  {imageFile ? imageFile.name : "No file chosen"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </label>
              <div
                className="w-11 h-11 rounded-lg border flex items-center justify-center shrink-0"
                style={{
                  borderColor: COLORS.line,
                  backgroundColor: COLORS.paper,
                  color: COLORS.muted,
                }}
              >
                <ImageIcon size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Status Settings */}
        <div
          className="relative rounded-2xl p-5 border"
          style={{ backgroundColor: COLORS.paper, borderColor: COLORS.line }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <FieldLabel>Discount Status</FieldLabel>
              <div className="flex items-center gap-5 mt-1">
                {["Flat", "Percent", "No"].map((status) => (
                  <RadioOption
                    key={status}
                    name="discount"
                    label={status}
                    value={status}
                    checked={formData.discount_status === status}
                    onChange={(val) => handleChange("discount_status", val)}
                    dotColor={status === "No" ? COLORS.vermillion : COLORS.forest}
                  />
                ))}
              </div>
            </div>

            <div>
              <FieldLabel>Vat Status</FieldLabel>
              <div className="flex items-center gap-5 mt-1">
                {["Yes", "No"].map((status) => (
                  <RadioOption
                    key={status}
                    name="vat"
                    label={status}
                    value={status}
                    checked={formData.vat_status === status}
                    onChange={(val) => handleChange("vat_status", val)}
                    dotColor={status === "No" ? COLORS.vermillion : COLORS.forest}
                  />
                ))}
              </div>
            </div>

            <div>
              <FieldLabel>Alert Quantity</FieldLabel>
              <input
                type="number"
                placeholder="0"
                value={formData.alert_quantity}
                onChange={(e) => handleChange("alert_quantity", e.target.value)}
                className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none mt-1"
                style={{
                  backgroundColor: COLORS.panel,
                  borderColor: COLORS.line,
                  color: COLORS.ink,
                  fontFamily: FONTS.BODY,
                }}
              />
            </div>
          </div>
        </div>

        {/* Description & Barcode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <FieldLabel>Description</FieldLabel>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Short product description…"
              className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none resize-y"
              style={{
                backgroundColor: COLORS.paper,
                borderColor: COLORS.line,
                color: COLORS.ink,
                fontFamily: FONTS.BODY,
              }}
            />
          </div>

          <div>
            <FieldLabel>Barcode</FieldLabel>
            <input
              value={formData.barcode}
              onChange={(e) => handleChange("barcode", e.target.value)}
              placeholder="Barcode will appear here"
              className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none mb-3"
              style={{
                backgroundColor: COLORS.paper,
                borderColor: COLORS.line,
                color: COLORS.ink,
                fontFamily: FONTS.MONO,
              }}
            />
            <button
              type="button"
              onClick={handleGenerateBarcode}
              className="w-full text-white font-bold text-[13.5px] py-3 rounded-lg shadow-md"
              style={{
                backgroundColor: COLORS.forest,
                boxShadow: `0 4px 10px ${COLORS.forest}40`,
              }}
            >
              Generate Barcode
            </button>
          </div>
        </div>

        {/* Barcode Display Card */}
        {showBarcode && formData.barcode && (
          <div
            className="rounded-2xl border p-6 flex flex-col items-center justify-center gap-3"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
          >
            <div className="w-full max-w-md">
              <BarcodeSVG value={formData.barcode} />
            </div>
            <div
              className="font-bold text-[13.5px] tracking-[0.35em]"
              style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}
            >
              {formData.barcode}
            </div>
          </div>
        )}

        {/* Submit Actions */}
        <div className="pt-2 flex justify-end gap-3">
          <button
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
            type="submit"
            disabled={loading}
            className="text-white font-semibold text-[13px] px-5 py-2.5 rounded-lg shadow-md disabled:opacity-50"
            style={{
              backgroundColor: COLORS.magenta,
              boxShadow: `0 4px 10px ${COLORS.magenta}40`,
            }}
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>
    </form>
  );
}