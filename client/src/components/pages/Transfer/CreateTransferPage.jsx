import React from "react";
import {
  ArrowLeft,
  Barcode,
  ArrowRightLeft,
  CheckCircle2,
  Trash2,
  Plus,
} from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { FieldLabel } from "../../shared/FormElements";
import { COLORS, PETALS, FONTS, DEFAULT_SHOP_BRANCHES, DEMO_TRANSFER_STOCK } from "../../../constants";
import { todayISO } from "../../../utils";
import { ChevronDown, PackageCheck } from "lucide-react";

function TransferBranchSelect({
  label,
  value,
  onChange,
  options,
  accentColor,
  placeholder,
}) {
  return (
    <div className="relative flex-1 min-w-[200px]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-full pl-4 pr-9 py-3 text-[13px] font-semibold border outline-none cursor-pointer shadow-sm"
        style={{
          backgroundColor: COLORS.panel,
          borderColor: value ? accentColor : COLORS.line,
          color: value ? COLORS.ink : COLORS.muted,
          fontFamily: FONTS.BODY,
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.id} value={o.name}>
            {o.name}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: accentColor }}
      />
    </div>
  );
}

export function CreateTransferPage({ mode = "B2B_B2G", onConfirm }) {
  const isG2B = mode === "G2B";
  const accent = isG2B ? COLORS.peacock : COLORS.purple;
  const accentTint = isG2B ? COLORS.peacockTint : COLORS.purpleTint;

  const senderOptions = isG2B
    ? DEFAULT_SHOP_BRANCHES.filter((b) => b.type === "godown")
    : DEFAULT_SHOP_BRANCHES;
  const receiverOptionsFor = (senderName) =>
    isG2B
      ? DEFAULT_SHOP_BRANCHES.filter((b) => b.type === "shop" && b.name !== senderName)
      : DEFAULT_SHOP_BRANCHES.filter((b) => b.name !== senderName);

  const [step, setStep] = React.useState(1);
  const [sender, setSender] = React.useState("");
  const [receiver, setReceiver] = React.useState("");
  const [barcodeQuery, setBarcodeQuery] = React.useState("");
  const [cart, setCart] = React.useState([]);
  const [note, setNote] = React.useState("");
  const [date, setDate] = React.useState(todayISO());
  const [confirmed, setConfirmed] = React.useState(false);

  const receiverOptions = receiverOptionsFor(sender);

  const filteredStock = DEMO_TRANSFER_STOCK.filter((p) =>
    (p.name + " " + p.brand).toLowerCase().includes(barcodeQuery.toLowerCase())
  );

  const handleNext = () => {
    if (!sender || !receiver) return;
    setStep(2);
  };

  const handleBackToSelect = () => {
    setStep(1);
    setCart([]);
    setConfirmed(false);
  };

  const addToCart = (product) => {
    setCart((prev) => {
      if (prev.some((c) => c.productId === product.id)) return prev;
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          brand: product.brand,
          lot: product.lot,
          discount: product.discount,
          vat: product.vat,
          price: product.price,
          qty: "",
          maxQty: product.stockUnit,
          unitLabel: product.unitLabel,
        },
      ];
    });
  };

  const removeFromCart = (productId) =>
    setCart((prev) => prev.filter((c) => c.productId !== productId));

  const updateCartField = (productId, field, value) =>
    setCart((prev) =>
      prev.map((c) => (c.productId === productId ? { ...c, [field]: value } : c))
    );

  const total = cart.reduce((sum, c) => sum + (Number(c.qty) || 0) * (Number(c.price) || 0), 0);

  const handleConfirm = () => {
    if (cart.length === 0 || !note.trim()) return;
    const record = {
      id: Date.now(),
      type: isG2B ? "G2B" : "B2B/B2G",
      from: sender,
      to: receiver,
      date,
      note: note.trim(),
      items: cart.map((c) => ({
        name: c.name,
        qty: Number(c.qty) || 0,
        price: Number(c.price) || 0,
        unitLabel: c.unitLabel,
      })),
      total,
    };
    onConfirm && onConfirm(record);
    setConfirmed(true);
    setCart([]);
    setNote("");
    setBarcodeQuery("");
    setTimeout(() => setConfirmed(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* STEP 1: sender / receiver selector */}
      <div
        className="relative rounded-3xl border p-4 overflow-hidden flex flex-wrap items-center gap-3"
        style={{
          backgroundColor: COLORS.panel,
          borderColor: COLORS.line,
          boxShadow: "0 6px 18px rgba(43,35,32,0.06)",
        }}
      >
        <ScallopBorder id={`scallop-transfer-select-${mode}`} colors={PETALS} />
        <TransferBranchSelect
          label="Sender"
          value={sender}
          onChange={(v) => {
            setSender(v);
            if (receiver === v) setReceiver("");
          }}
          options={senderOptions}
          accentColor={accent}
          placeholder={isG2B ? "-- Select Sender Godown --" : "-- Select Sender Branch --"}
        />
        <TransferBranchSelect
          label="Receiver"
          value={receiver}
          onChange={setReceiver}
          options={receiverOptions}
          accentColor={accent}
          placeholder={isG2B ? "-- Select Receiving Shop --" : "-- Select Receivable Place --"}
        />
        <button
          onClick={handleNext}
          disabled={!sender || !receiver}
          className="text-white font-bold text-[13px] px-6 py-3 rounded-full shadow-md disabled:opacity-40 shrink-0"
          style={{
            backgroundColor: accent,
            boxShadow: `0 4px 12px ${accent}55`,
          }}
        >
          Next
        </button>
        {step === 2 && (
          <button
            onClick={handleBackToSelect}
            className="flex items-center gap-1.5 text-[12.5px] font-semibold px-3 py-2 rounded-full border ml-auto"
            style={{ borderColor: COLORS.line, color: COLORS.muted }}
          >
            <ArrowLeft size={13} /> Change Branches
          </button>
        )}
      </div>

      {confirmed && (
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-2.5 border"
          style={{
            backgroundColor: COLORS.forestTint,
            borderColor: COLORS.forest,
            color: COLORS.forestDark,
          }}
        >
          <PackageCheck size={17} />
          <span className="text-[13px] font-semibold">
            Stock transfer confirmed — {sender} → {receiver}. See it under Transfered Histories.
          </span>
        </div>
      )}

      {step === 2 && sender && receiver && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-5 items-start">
          {/* LEFT: products from sender branch */}
          <div
            className="relative rounded-2xl p-5 pt-6 border overflow-hidden"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
          >
            <ScallopBorder id={`scallop-transfer-products-${mode}`} colors={PETALS} />
            <h3
              className="font-bold text-[15px] mb-3"
              style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
            >
              Products From {sender}
            </h3>
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 border mb-3"
              style={{
                backgroundColor: COLORS.paper,
                borderColor: COLORS.line,
                color: COLORS.muted,
              }}
            >
              <Barcode size={15} />
              <input
                value={barcodeQuery}
                onChange={(e) => setBarcodeQuery(e.target.value)}
                placeholder="Search product or scan barcode…"
                className="bg-transparent outline-none flex-1 text-[13px]"
                style={{ color: COLORS.ink, fontFamily: FONTS.BODY }}
              />
            </div>

            <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
              {filteredStock.map((p) => {
                const inCart = cart.some((c) => c.productId === p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => !inCart && addToCart(p)}
                    className="rounded-xl border p-3 cursor-pointer transition-colors"
                    style={{
                      borderColor: inCart ? accent : COLORS.line,
                      backgroundColor: inCart ? accentTint : COLORS.paper,
                      opacity: inCart ? 0.6 : 1,
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="font-bold text-[13px]"
                        style={{
                          color: COLORS.forestDark,
                          fontFamily: FONTS.HEAD,
                        }}
                      >
                        {p.name}
                      </span>
                      {inCart && <CheckCircle2 size={15} style={{ color: accent }} />}
                    </div>
                    <div className="text-[11.5px] mt-1" style={{ color: COLORS.muted }}>
                      Brand: {p.brand}, Lot Number: {p.lot}, Sales Price: {p.price},
                      Discount: {p.discount}, VAT: {p.vat}
                    </div>
                    <div className="text-[11px] font-semibold mt-1" style={{ color: COLORS.rust }}>
                      Stock Unit: {p.stockUnit} {p.unitLabel}
                    </div>
                  </div>
                );
              })}
              {filteredStock.length === 0 && (
                <div className="text-[12.5px] text-center py-8" style={{ color: COLORS.muted }}>
                  No products match your search.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: transfer builder */}
          <div
            className="relative rounded-2xl p-5 pt-6 border overflow-hidden"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
          >
            <ScallopBorder id={`scallop-transfer-builder-${mode}`} colors={PETALS} />
            <h3
              className="font-bold text-[15px] mb-4"
              style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
            >
              {sender} To <span style={{ color: accent }}>{receiver}</span> Transfer Product
            </h3>

            <div className="overflow-x-auto rounded-xl border mb-4" style={{ borderColor: COLORS.line }}>
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr style={{ backgroundColor: accent }}>
                    <th className="text-left font-bold text-white text-[11px] uppercase tracking-wide py-2.5 px-3">
                      Product Info
                    </th>
                    <th className="text-left font-bold text-white text-[11px] uppercase tracking-wide py-2.5 px-3">
                      Quantity
                    </th>
                    <th className="text-left font-bold text-white text-[11px] uppercase tracking-wide py-2.5 px-3">
                      P Price
                    </th>
                    <th className="text-right font-bold text-white text-[11px] uppercase tracking-wide py-2.5 px-3">
                      Total Price
                    </th>
                    <th className="text-center font-bold text-white text-[11px] uppercase tracking-wide py-2.5 px-3">
                      X
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((c, i) => {
                    const qtyNum = Number(c.qty) || 0;
                    const overMax = qtyNum > c.maxQty;
                    return (
                      <tr
                        key={c.productId}
                        style={
                          i !== cart.length - 1
                            ? { borderBottom: `1px solid ${COLORS.line}` }
                            : undefined
                        }
                      >
                        <td className="py-3 px-3">
                          <div className="font-semibold" style={{ color: COLORS.forestDark }}>
                            {c.name}
                          </div>
                          <div className="text-[10.5px]" style={{ color: COLORS.muted }}>
                            Lot: {c.lot} · Discount: {c.discount} · VAT: {c.vat}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            min={0}
                            value={c.qty}
                            onChange={(e) =>
                              updateCartField(c.productId, "qty", e.target.value)
                            }
                            placeholder="0"
                            className="w-20 rounded-lg px-2.5 py-1.5 text-[12.5px] border outline-none"
                            style={{
                              backgroundColor: COLORS.paper,
                              borderColor: overMax ? COLORS.vermillion : COLORS.line,
                              color: COLORS.ink,
                              fontFamily: FONTS.MONO,
                            }}
                          />
                          <div
                            className="text-[10px] font-semibold mt-1"
                            style={{
                              color: overMax ? COLORS.vermillion : COLORS.rust,
                            }}
                          >
                            Max: {c.maxQty} {c.unitLabel}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            min={0}
                            value={c.price}
                            onChange={(e) =>
                              updateCartField(c.productId, "price", e.target.value)
                            }
                            className="w-20 rounded-lg px-2.5 py-1.5 text-[12.5px] border outline-none"
                            style={{
                              backgroundColor: COLORS.paper,
                              borderColor: COLORS.line,
                              color: COLORS.ink,
                              fontFamily: FONTS.MONO,
                            }}
                          />
                        </td>
                        <td
                          className="py-3 px-3 text-right font-bold"
                          style={{
                            color: COLORS.ink,
                            fontFamily: FONTS.MONO,
                          }}
                        >
                          {(qtyNum * (Number(c.price) || 0)).toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => removeFromCart(c.productId)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white mx-auto"
                            style={{ backgroundColor: COLORS.vermillion }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {cart.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-[12.5px]"
                        style={{ color: COLORS.muted }}
                      >
                        Click a product on the left to add it here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <FieldLabel required>Note</FieldLabel>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Note"
                  className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none resize-none"
                  style={{
                    backgroundColor: COLORS.paper,
                    borderColor: COLORS.line,
                    color: COLORS.ink,
                    fontFamily: FONTS.BODY,
                  }}
                />
              </div>
              <div className="space-y-4">
                <div>
                  <FieldLabel required>Total</FieldLabel>
                  <div
                    className="w-full rounded-lg px-3.5 py-2.5 text-[14px] font-bold border"
                    style={{
                      backgroundColor: COLORS.paper,
                      borderColor: COLORS.line,
                      color: accent,
                      fontFamily: FONTS.MONO,
                    }}
                  >
                    ৳{total.toFixed(2)}
                  </div>
                </div>
                <div>
                  <FieldLabel required>Date</FieldLabel>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none"
                    style={{
                      backgroundColor: COLORS.paper,
                      borderColor: COLORS.line,
                      color: COLORS.ink,
                      fontFamily: FONTS.BODY,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleConfirm}
                disabled={
                  cart.length === 0 ||
                  !note.trim() ||
                  cart.some(
                    (c) =>
                      !c.qty ||
                      Number(c.qty) <= 0 ||
                      Number(c.qty) > c.maxQty
                  )
                }
                className="text-white font-bold text-[13.5px] px-6 py-3 rounded-lg shadow-md disabled:opacity-40 flex items-center gap-2"
                style={{
                  backgroundColor: accent,
                  boxShadow: `0 4px 12px ${accent}55`,
                }}
              >
                <ArrowRightLeft size={15} /> Confirm Stock Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}