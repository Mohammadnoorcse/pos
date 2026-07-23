import React from "react";
import { Plus, Printer, Trash2, RefreshCcw } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { FieldLabel } from "../../shared/FormElements";
import { BarcodeSVG } from "../../../utils";
import { COLORS, PETALS, FONTS } from "../../../constants";

function LabelCard({ title, price, code }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-1 border border-dashed rounded-md py-2.5 px-2 bg-white break-inside-avoid"
      style={{ borderColor: "#D8D0C0" }}
    >
      <div className="text-[10px] font-bold truncate w-full text-center" style={{ color: "#141414" }}>
        {title || "Product Name"}
      </div>
      <div className="w-full px-1">
        <BarcodeSVG value={code} />
      </div>
      <div className="text-[9px] font-mono tracking-[0.2em]" style={{ color: "#141414" }}>
        {code}
      </div>
      {price && (
        <div className="text-[11px] font-extrabold" style={{ color: "#141414" }}>
          ৳{price}
        </div>
      )}
    </div>
  );
}

export function PrintBarcodeLabelsPage() {
  const [title, setTitle] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [code, setCode] = React.useState("");
  const [qty, setQty] = React.useState(6);
  const [items, setItems] = React.useState([]);

  const randomCode = () =>
    Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join("");

  const handleNewBarcode = () => setCode(randomCode());

  const handleAddToSheet = () => {
    const finalCode = code.trim() || randomCode();
    const nextId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    setItems((prev) => [
      ...prev,
      {
        id: nextId,
        title: title.trim() || "Product Name",
        price: price.trim(),
        code: finalCode,
        qty: Math.max(1, Number(qty) || 1),
      },
    ]);
    setTitle("");
    setPrice("");
    setCode("");
    setQty(6);
  };

  const handleRemove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const handleRegenerateItem = (id) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, code: randomCode() } : i)));

  const totalLabels = items.reduce((sum, i) => sum + i.qty, 0);

  const handlePrint = () => window.print();

  const inputStyle = {
    backgroundColor: COLORS.paper,
    borderColor: COLORS.line,
    color: COLORS.ink,
    fontFamily: FONTS.BODY,
  };
  const inputClass = "w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-5 items-start">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #label-print-area, #label-print-area * { visibility: visible; }
          #label-print-area {
            position: absolute; left: 0; top: 0; width: 100%;
            background: #fff !important; padding: 12px;
          }
        }
      `}</style>

      {/* LEFT: builder form (hidden on print) */}
      <div
        className="relative rounded-2xl p-6 pt-7 border overflow-hidden print:hidden"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
      >
        <ScallopBorder id="scallop-label-form" colors={PETALS} />
        <h2
          className="font-bold text-[16px] mb-5"
          style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
        >
          Add Label
        </h2>

        <div className="space-y-4">
          <div>
            <FieldLabel>Product Title</FieldLabel>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cotton Panjabi — L"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Price</FieldLabel>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <FieldLabel>Copies</FieldLabel>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Barcode</FieldLabel>
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Type or generate"
                className={inputClass}
                style={{ ...inputStyle, fontFamily: FONTS.MONO }}
              />
              <button
                onClick={handleNewBarcode}
                title="Generate new barcode"
                className="shrink-0 w-11 rounded-lg border flex items-center justify-center"
                style={{
                  borderColor: COLORS.line,
                  backgroundColor: COLORS.peacockTint,
                  color: COLORS.peacock,
                }}
              >
                <RefreshCcw size={15} />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToSheet}
            className="w-full text-white font-semibold text-[13px] py-2.5 rounded-lg shadow-md flex items-center justify-center gap-1.5"
            style={{
              backgroundColor: COLORS.magenta,
              boxShadow: `0 4px 10px ${COLORS.magenta}40`,
            }}
          >
            <Plus size={14} /> Add to Sheet
          </button>
        </div>
      </div>

      {/* RIGHT: label sheet preview + print */}
      <div
        className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
      >
        <ScallopBorder id="scallop-label-sheet" colors={PETALS} />

        <div className="flex items-center justify-between mb-4 flex-wrap gap-3 print:hidden">
          <h2
            className="font-bold text-[16px] flex items-center gap-2"
            style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
          >
            Label Sheet
            <span
              className="text-[10.5px] font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: COLORS.forestTint, color: COLORS.forestDark }}
            >
              {totalLabels} labels
            </span>
          </h2>
          <button
            onClick={handlePrint}
            disabled={items.length === 0}
            className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md disabled:opacity-40"
            style={{
              backgroundColor: COLORS.forest,
              boxShadow: `0 4px 10px ${COLORS.forest}40`,
            }}
          >
            <Printer size={14} /> Print Labels
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center print:hidden">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: COLORS.marigoldTint,
                color: COLORS.rust,
              }}
            >
              <Printer size={20} />
            </div>
            <p className="text-[13px]" style={{ color: COLORS.muted }}>
              Add a product on the left to build your label sheet.
            </p>
          </div>
        ) : (
          <>
            <div id="label-print-area" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {items.flatMap((item) =>
                Array.from({ length: item.qty }, (_, k) => (
                  <LabelCard
                    key={`${item.id}-${k}`}
                    title={item.title}
                    price={item.price}
                    code={item.code}
                  />
                ))
              )}
            </div>

            <div className="mt-5 pt-4 print:hidden" style={{ borderTop: `1px dashed ${COLORS.line}` }}>
              <div
                className="text-[12.5px] font-bold mb-2.5"
                style={{ color: COLORS.ink, fontFamily: FONTS.HEAD }}
              >
                Items in this sheet
              </div>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 border"
                    style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper }}
                  >
                    <div className="min-w-0">
                      <div
                        className="text-[12.5px] font-semibold truncate"
                        style={{ color: COLORS.ink }}
                      >
                        {item.title}{" "}
                        {item.price && (
                          <span style={{ color: COLORS.muted }}>·৳{item.price}</span>
                        )}
                      </div>
                      <div className="text-[11px]" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>
                        {item.code} · {item.qty} copies
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleRegenerateItem(item.id)}
                        title="Regenerate barcode"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: COLORS.peacock }}
                      >
                        <RefreshCcw size={13} />
                      </button>
                      <button
                        onClick={() => handleRemove(item.id)}
                        title="Remove"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: COLORS.vermillion }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}