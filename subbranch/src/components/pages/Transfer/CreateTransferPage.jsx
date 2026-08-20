import React from "react";
import {
  ArrowLeft,
  Barcode,
  ArrowRightLeft,
  CheckCircle2,
  Trash2,
  Loader2,
} from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { FieldLabel } from "../../shared/FormElements";
import { COLORS, PETALS, FONTS, SUB_BRANCH_ID } from "../../../constants";
import { todayISO } from "../../../utils";
import { ChevronDown, PackageCheck } from "lucide-react";
import { fetchBranches } from "../../../api/branchService";
import { fetchProducts } from "../../../api/productService";
import { createStockTransfer } from "../../../api/stockTransferService";

// ---------------------------------------------------------------------------
// Normalizers — adjust the fallback keys below if your API field names
// differ from what this UI expects.
// ---------------------------------------------------------------------------
function normalizeBranch(b) {
  return {
    id: b.id,
    name: b.name ?? b.branch_name ?? "Unnamed",
    type: b.type ?? b.branch_type ?? "shop", // "godown" | "shop"
  };
}

// Products come straight from productService (fetchProducts), which returns
// each product's own branch_id — there's no separate stock-transfer row/lot
// concept here, so we normalize the product object itself.
function normalizeProductRow(p) {
  return {
    id: `${p.id}`,
    productId: p.id,
    variantId: null,
    name: p.title ?? p.name ?? "Unnamed",
    brand: p.brand?.name ?? p.brand ?? "N/A",
    lot: p.lot_number ?? p.lot ?? "N/A",
    discount: p.discount_value ?? p.discount ?? 0,
    vat: p.vat_percent ?? p.vat ?? 0,
    price: Number(p.selling_price ?? p.selling ?? p.price ?? 0),
    stockUnit: Number(p.stock_qty ?? p.stock ?? 0),
    unitLabel: p.unit_type?.name ?? p.unit ?? "pcs",
  };
}

// Pull a list out of whatever shape the API returns:
// { data: [...] }, { data: { data: [...] } } (Laravel paginator), or a bare array.
function extractList(res) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
}

function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function TransferBranchSelect({
  label,
  value,
  onChange,
  options,
  accentColor,
  placeholder,
  disabled = false,
}) {
  return (
    <div className="relative flex-1 min-w-[200px]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full appearance-none rounded-full pl-4 pr-9 py-3 text-[13px] font-semibold border outline-none cursor-pointer shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        style={{
          backgroundColor: disabled ? COLORS.paper : COLORS.panel,
          borderColor: value ? accentColor : COLORS.line,
          color: value ? COLORS.ink : COLORS.muted,
          fontFamily: FONTS.BODY,
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
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

  // -- Branches ------------------------------------------------------------
  const [branches, setBranches] = React.useState([]);
  const [branchesLoading, setBranchesLoading] = React.useState(false);

  React.useEffect(() => {
    setBranchesLoading(true);
    fetchBranches()
      .then((res) => setBranches(extractList(res).map(normalizeBranch)))
      .catch(() => setBranches([]))
      .finally(() => setBranchesLoading(false));
  }, []);

  // Sub-branch ইউজারের জন্য sender সবসময় নিজের ব্রাঞ্চে ফিক্সড থাকবে — অন্য কোনো
  // ব্রাঞ্চ sender হিসেবে বাছা যাবে না, এবং শুধু নিজের ব্রাঞ্চের স্টকই দেখাবে।
  const isSubBranch = !!SUB_BRANCH_ID;

  const senderOptions = isSubBranch
    ? branches.filter((b) => String(b.id) === String(SUB_BRANCH_ID))
    : isG2B
    ? branches.filter((b) => b.type === "godown")
    : branches;
  const receiverOptionsFor = (senderId) =>
    isG2B
      ? branches.filter((b) => b.type === "shop" && String(b.id) !== String(senderId))
      : branches.filter((b) => String(b.id) !== String(senderId));

  const [step, setStep] = React.useState(1);
  const [sender, setSender] = React.useState(isSubBranch ? String(SUB_BRANCH_ID) : ""); // branch id
  const [receiver, setReceiver] = React.useState(""); // branch id
  const [barcodeQuery, setBarcodeQuery] = React.useState("");
  const debouncedQuery = useDebouncedValue(barcodeQuery, 350);
  const [cart, setCart] = React.useState([]);
  const [note, setNote] = React.useState("");
  const [date, setDate] = React.useState(todayISO());
  const [confirmed, setConfirmed] = React.useState(false);

  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState(null);

  // -- Sender stock ----------------------------------------------------------
  // Loads as soon as a sender branch is picked — no need to wait for "Next".
  const [stock, setStock] = React.useState([]);
  const [stockLoading, setStockLoading] = React.useState(false);

  React.useEffect(() => {
    if (!sender) {
      setStock([]);
      return;
    }
    let cancelled = false;
    setStockLoading(true);
    fetchProducts(debouncedQuery ? { search: debouncedQuery } : {})
      .then((res) => {
        if (cancelled) return;
        // Match product.branch_id against the selected sender branch id.
        // Loose (==) comparison since branch id may come back as a string
        // from the <select> while product.branch_id is numeric.
        const matched = extractList(res).filter(
          (p) => p.branch_id != null && String(p.branch_id) === String(sender)
        );
        setStock(matched.map(normalizeProductRow));
      })
      .catch(() => {
        if (!cancelled) setStock([]);
      })
      .finally(() => {
        if (!cancelled) setStockLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sender, debouncedQuery]);

  const receiverOptions = receiverOptionsFor(sender);
  const senderName = branches.find((b) => String(b.id) === String(sender))?.name || "";
  const receiverName = branches.find((b) => String(b.id) === String(receiver))?.name || "";

  const handleNext = () => {
    if (!sender || !receiver) return;
    setStep(2);
  };

  const handleBackToSelect = () => {
    setStep(1);
    setCart([]);
    setBarcodeQuery("");
    setConfirmed(false);
    setError(null);
    // Note: stock is intentionally left loaded since it's tied to `sender`, not to step.
  };

  const addToCart = (product) => {
    setCart((prev) => {
      if (prev.some((c) => c.rowId === product.id)) return prev;
      return [
        ...prev,
        {
          rowId: product.id,
          productId: product.productId,
          variantId: product.variantId,
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

  const removeFromCart = (rowId) =>
    setCart((prev) => prev.filter((c) => c.rowId !== rowId));

  const updateCartField = (rowId, field, value) =>
    setCart((prev) =>
      prev.map((c) => (c.rowId === rowId ? { ...c, [field]: value } : c))
    );

  const total = cart.reduce((sum, c) => sum + (Number(c.qty) || 0) * (Number(c.price) || 0), 0);

  const handleConfirm = async () => {
    if (cart.length === 0 || !note.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        type: mode, // "B2B_B2G" | "G2B"
        from_branch_id: sender,
        to_branch_id: receiver,
        transfer_date: date,
        note: note.trim(),
        items: cart.map((c) => ({
          product_id: c.productId,
          product_variant_id: c.variantId,
          quantity: Number(c.qty) || 0,
          price: Number(c.price) || 0,
        })),
      };

      const created = await createStockTransfer(payload);
      const record = created?.data ?? created;

      onConfirm && onConfirm(record);
      setConfirmed(true);
      setCart([]);
      setNote("");
      setBarcodeQuery("");
      // refresh stock so quantities reflect the transfer just made
      fetchProducts()
        .then((res) => {
          const matched = extractList(res).filter(
            (p) => p.branch_id != null && String(p.branch_id) === String(sender)
          );
          setStock(matched.map(normalizeProductRow));
        })
        .catch(() => {});
      setTimeout(() => setConfirmed(false), 2500);
    } catch (err) {
      setError(err.message || "ট্রান্সফার সম্পন্ন করা যায়নি");
    } finally {
      setSaving(false);
    }
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
            if (isSubBranch) return; // sub-branch sender লকড, পরিবর্তন করা যাবে না
            setSender(v);
            if (receiver === v) setReceiver("");
          }}
          options={senderOptions}
          accentColor={accent}
          disabled={isSubBranch}
          placeholder={
            branchesLoading
              ? "Loading branches…"
              : isG2B
              ? "-- Select Sender Godown --"
              : "-- Select Sender Branch --"
          }
        />
        {sender && (
          <span
            className="text-[11.5px] font-semibold px-3 py-1.5 rounded-full shrink-0"
            style={{ backgroundColor: accentTint, color: accent }}
          >
            {stockLoading ? "Checking stock…" : `${stock.length} product${stock.length === 1 ? "" : "s"} available`}
          </span>
        )}
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

      {error && (
        <div
          className="rounded-xl px-4 py-3 text-[12.5px] font-semibold border"
          style={{ backgroundColor: COLORS.vermillionTint, borderColor: COLORS.vermillion, color: COLORS.vermillion }}
        >
          {error}
        </div>
      )}

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
            Stock transfer confirmed — {senderName} → {receiverName}. See it under Transfered Histories.
          </span>
        </div>
      )}

      {/* Sender's product list shows as soon as a sender branch is picked —
          it no longer waits for step 2 / receiver selection. */}
      {sender && (
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
              Products From {senderName}
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
              {stockLoading && <Loader2 size={14} className="animate-spin" />}
            </div>

            <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
              {!stockLoading &&
                stock.map((p) => {
                  const inCart = cart.some((c) => c.rowId === p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        // Selecting a product from the sender's stock now also
                        // takes the user into the transfer builder (step 2) if
                        // a receiver has already been chosen.
                        if (!inCart) addToCart(p);
                        if (receiver && step !== 2) setStep(2);
                      }}
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
              {stockLoading && (
                <div className="flex items-center justify-center gap-2 py-10" style={{ color: COLORS.muted }}>
                  <Loader2 size={16} className="animate-spin" /> Loading stock…
                </div>
              )}
              {!stockLoading && stock.length === 0 && (
                <div className="text-[12.5px] text-center py-8" style={{ color: COLORS.muted }}>
                  No products match your search.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: transfer builder — only meaningful once a receiver is chosen too */}
          {step === 2 && receiver ? (
            <div
              className="relative rounded-2xl p-5 pt-6 border overflow-hidden"
              style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
            >
              <ScallopBorder id={`scallop-transfer-builder-${mode}`} colors={PETALS} />
              <h3
                className="font-bold text-[15px] mb-4"
                style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
              >
                {senderName} To <span style={{ color: accent }}>{receiverName}</span> Transfer Product
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
                          key={c.rowId}
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
                                updateCartField(c.rowId, "qty", e.target.value)
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
                                updateCartField(c.rowId, "price", e.target.value)
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
                              onClick={() => removeFromCart(c.rowId)}
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
                    saving ||
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
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <ArrowRightLeft size={15} />}
                  {saving ? "Saving…" : "Confirm Stock Transfer"}
                </button>
              </div>
            </div>
          ) : (
            <div
              className="relative rounded-2xl p-5 pt-6 border overflow-hidden flex items-center justify-center text-center"
              style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line, color: COLORS.muted, minHeight: 200 }}
            >
              <span className="text-[13px]">
                Select a receiver branch and click <b>Next</b> to start building the transfer.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}