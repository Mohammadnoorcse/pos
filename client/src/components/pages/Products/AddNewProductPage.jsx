import React from "react";
import { ImageIcon } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { FieldLabel, TextField, SelectField, RadioOption } from "../../shared/FormElements";
import { BarcodeSVG } from "../../../utils";
import { COLORS, PETALS, FONTS } from "../../../constants";

export function AddNewProductPage() {
  const [discountStatus, setDiscountStatus] = React.useState("No");
  const [vatStatus, setVatStatus] = React.useState("No");
  const [fileName, setFileName] = React.useState("");
  const [barcode, setBarcode] = React.useState("");
  const [generatedCode, setGeneratedCode] = React.useState("");
  const [showBarcode, setShowBarcode] = React.useState(false);

  const handleGenerateBarcode = () => {
    const trimmed = barcode.trim();
    const code =
      trimmed || Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join("");
    setBarcode(code);
    setGeneratedCode(code);
    setShowBarcode(true);
  };

  return (
    <div
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
        <div>
          <FieldLabel required>Product Title</FieldLabel>
          <textarea
            rows={1}
            placeholder="e.g. Cotton Panjabi — Full Sleeve"
            className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none resize-y"
            style={{
              backgroundColor: COLORS.paper,
              borderColor: COLORS.line,
              color: COLORS.ink,
              fontFamily: FONTS.BODY,
            }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <SelectField
            label="Product Brand"
            placeholder="-- Select Brand --"
            options={["Aarong", "Yellow", "Ecstasy", "Sailor"]}
          />
          <SelectField
            label="Product Category"
            required
            placeholder="-- Select Category --"
            options={["Panjabi", "Shirt", "Jeans", "T-Shirt", "Kids Wear"]}
          />
          <SelectField
            label="Unit Type"
            required
            placeholder="-- Select Unit Type --"
            options={["Pcs", "Kg", "Dozen", "Box"]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-end">
          <TextField label="Purchase Price" required placeholder="0.00" />
          <TextField label="Selling Price" required placeholder="0.00" />
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
                  {fileName || "No file chosen"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
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

        <div
          className="relative rounded-2xl p-5 border"
          style={{ backgroundColor: COLORS.paper, borderColor: COLORS.line }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <FieldLabel>Discount Status</FieldLabel>
              <div className="flex items-center gap-5 mt-1">
                <RadioOption
                  name="discount"
                  label="Flat"
                  value="Flat"
                  checked={discountStatus === "Flat"}
                  onChange={setDiscountStatus}
                  dotColor={COLORS.forest}
                />
                <RadioOption
                  name="discount"
                  label="Percent"
                  value="Percent"
                  checked={discountStatus === "Percent"}
                  onChange={setDiscountStatus}
                  dotColor={COLORS.peacock}
                />
                <RadioOption
                  name="discount"
                  label="No"
                  value="No"
                  checked={discountStatus === "No"}
                  onChange={setDiscountStatus}
                  dotColor={COLORS.vermillion}
                />
              </div>
            </div>

            <div>
              <FieldLabel>Vat Status</FieldLabel>
              <div className="flex items-center gap-5 mt-1">
                <RadioOption
                  name="vat"
                  label="Yes"
                  value="Yes"
                  checked={vatStatus === "Yes"}
                  onChange={setVatStatus}
                  dotColor={COLORS.forest}
                />
                <RadioOption
                  name="vat"
                  label="No"
                  value="No"
                  checked={vatStatus === "No"}
                  onChange={setVatStatus}
                  dotColor={COLORS.vermillion}
                />
              </div>
            </div>

            <div>
              <FieldLabel>Alert Quantity</FieldLabel>
              <p className="text-[11.5px] mb-2 -mt-1" style={{ color: COLORS.muted }}>
                When the alert quantity reached it will show in{" "}
                <span className="font-semibold cursor-pointer" style={{ color: COLORS.peacock }}>
                  here
                </span>
              </p>
              <input
                placeholder="0"
                className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <FieldLabel>Description</FieldLabel>
            <textarea
              rows={4}
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
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
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

        {showBarcode && (
          <div
            className="rounded-2xl border p-6 flex flex-col items-center justify-center gap-3"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
          >
            <div className="w-full max-w-md">
              <BarcodeSVG value={generatedCode} />
            </div>
            <div
              className="font-bold text-[13.5px] tracking-[0.35em]"
              style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}
            >
              {generatedCode}
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end gap-3">
          <button
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
            className="text-white font-semibold text-[13px] px-5 py-2.5 rounded-lg shadow-md"
            style={{
              backgroundColor: COLORS.magenta,
              boxShadow: `0 4px 10px ${COLORS.magenta}40`,
            }}
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}