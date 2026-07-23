import React, { useState, useMemo } from "react";
import { Search, X, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { COLORS, PETALS, FONTS } from "../../../constants";

const invoices = [
  {
    date: "27-04-2025",
    customer: "Mizan Sanitary Home",
    phone: "01711212121",
    invNum: "#S/230710646/439/261/603",
    createdBy: "SOHAG AHMED MOON",
    createdByPhone: "01676526444",
    createdAt: "27-04-2025 05:46:50 PM",
  },
  {
    date: "23-04-2025",
    customer: "n",
    phone: "01627382867",
    invNum: "#S/230710646/321/261/602",
    createdBy: "SOHAG AHMED MOON",
    createdByPhone: "01676526444",
    createdAt: "23-04-2025 12:43:24 PM",
  },
  {
    date: "21-04-2025",
    customer: "Walking Customer",
    phone: "p230710646",
    invNum: "#S/230710646/691/261/601",
    createdBy: "SOHAG AHMED MOON",
    createdByPhone: "01676526444",
    createdAt: "21-04-2025 04:31:03 PM",
  },
];

const initialItems = [
  {
    id: 1,
    name: "Ghee 800gm",
    salesPrice: 350,
    discountLabel: "percent(10)",
    vat: "0%",
    restQty: 1,
    qty: 1,
    price: 350,
    subtotal: 315,
    checked: false,
  },
  {
    id: 2,
    name: "Fresh Facial Tissue",
    salesPrice: 301,
    discountLabel: "flat(50)",
    vat: "0%",
    restQty: 1,
    qty: 1,
    price: 301,
    subtotal: 251,
    checked: false,
  },
];

function ReturnForm({ invoice, onBack }) {
  const [items, setItems] = useState(initialItems);
  const [paidToCustomer, setPaidToCustomer] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("2025-04-27");

  function updateQty(id, qty) {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const q = Math.max(0, Math.min(it.restQty, Number(qty) || 0));
        const ratio = it.subtotal / it.qty || it.price;
        return { ...it, qty: q, subtotal: Math.round(ratio * q) };
      })
    );
  }

  function toggleCheck(id) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it)));
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  const totalGross = useMemo(() => items.reduce((s, it) => s + it.price * it.qty, 0), [items]);
  const discountTk = useMemo(
    () => items.reduce((s, it) => s + (it.price * it.qty - it.subtotal), 0),
    [items]
  );
  const subTotal = totalGross - discountTk;
  const extraFine = 0;
  const totalPayable = subTotal - extraFine;
  const customerDue = 700;
  const totalWithCurrentDue = customerDue - totalPayable;
  const customerBalance = 700;

  return (
    <div className="mx-auto max-w-6xl">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-sm font-semibold hover:opacity-80"
        style={{ color: COLORS.accent, fontFamily: FONTS.HEAD }}
      >
        <ChevronLeft className="h-4 w-4" />
        Back to invoices
      </button>

      <div className="flex flex-col gap-5 lg:flex-row">
        {/* Left: return table */}
        <div
          className="flex-1 overflow-hidden rounded-2xl border relative"
          style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        >
          <ScallopBorder id="scallop-return-table" colors={PETALS} />

          <div className="border-b px-6 py-5 text-sm" style={{ borderColor: COLORS.line }}>
            <div style={{ color: COLORS.ink }}>
              You are Returning From{" "}
              <span className="font-semibold" style={{ color: COLORS.teal }}>
                → My Shop
              </span>
            </div>
            <div style={{ color: COLORS.ink }}>
              Sold From{" "}
              <span className="font-semibold" style={{ color: COLORS.teal }}>
                → My Shop, Shop-1205, Lift-0 Saha Ali Plaza, Mirpur-10, Dhaka-1216
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span style={{ color: COLORS.muted }}>
                যে যে প্রোডাক্ট রিটার্ন করব সেগুলো রেখে বাকি গুলো ডিলিট করে দিতে হবে।
              </span>
              <span
                className="rounded-md px-2 py-1 font-semibold text-white"
                style={{ backgroundColor: COLORS.rust }}
              >
                1 Times Return Running
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr style={{ backgroundColor: COLORS.ink }}>
                  <th className="w-10 px-4 py-3"></th>
                  <th
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white"
                    style={{ fontFamily: FONTS.HEAD }}
                  >
                    Action
                  </th>
                  <th
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white"
                    style={{ fontFamily: FONTS.HEAD }}
                  >
                    Product Info
                  </th>
                  <th
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white"
                    style={{ fontFamily: FONTS.HEAD }}
                  >
                    Quantity
                  </th>
                  <th
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white"
                    style={{ fontFamily: FONTS.HEAD }}
                  >
                    Price
                  </th>
                  <th
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white"
                    style={{ fontFamily: FONTS.HEAD }}
                  >
                    Subtotal
                  </th>
                  <th
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white"
                    style={{ fontFamily: FONTS.HEAD }}
                  >
                    X
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} className="border-b" style={{ borderColor: COLORS.line }}>
                    <td className="px-4 py-4 align-top">
                      <input
                        type="checkbox"
                        checked={it.checked}
                        onChange={() => toggleCheck(it.id)}
                        style={{ accentColor: COLORS.forest }}
                      />
                    </td>
                    <td className="px-4 py-4 align-top">
                      <select
                        className="rounded-lg border-[1.5px] px-2 py-1.5 text-sm outline-none"
                        style={{
                          borderColor: COLORS.line,
                          backgroundColor: COLORS.paper,
                          color: COLORS.muted,
                          fontFamily: FONTS.BODY,
                        }}
                      >
                        <option>-- Select --</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center gap-1.5 font-semibold" style={{ color: COLORS.teal }}>
                        {it.name}
                        <Plus className="h-4 w-4 rounded-full bg-orange-400 p-0.5 text-white" />
                      </div>
                      <div className="mt-1 text-xs" style={{ color: COLORS.muted }}>
                        Sales Price: {it.salesPrice}, Discount: {it.discountLabel}, VAT: {it.vat}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="mb-1 text-xs font-semibold" style={{ color: COLORS.rust }}>
                        Rest Qty: {it.restQty}
                      </div>
                      <input
                        type="number"
                        min={0}
                        max={it.restQty}
                        value={it.qty}
                        onChange={(e) => updateQty(it.id, e.target.value)}
                        className="w-20 rounded-lg border-[1.5px] px-2.5 py-1.5 text-sm outline-none"
                        style={{
                          borderColor: COLORS.line,
                          backgroundColor: COLORS.paper,
                          color: COLORS.ink,
                          fontFamily: FONTS.BODY,
                        }}
                      />
                      <div className="mt-1 text-xs" style={{ color: COLORS.muted }}>
                        pcs
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top font-medium" style={{ color: COLORS.ink }}>
                      {it.price}
                    </td>
                    <td className="px-4 py-4 align-top font-semibold" style={{ color: COLORS.ink }}>
                      {it.subtotal}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <button
                        onClick={() => removeItem(it.id)}
                        className="rounded-lg p-2 text-white transition-colors hover:opacity-90"
                        style={{ backgroundColor: COLORS.rust }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center" style={{ color: COLORS.muted }}>
                      No items left to return.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: summary panel */}
        <div className="w-full space-y-3.5 lg:w-80">
          <div
            className="rounded-xl px-5 py-3 text-center text-sm font-bold text-white"
            style={{ backgroundColor: COLORS.forest, fontFamily: FONTS.HEAD }}
          >
            {invoice.customer}
          </div>

          <SummaryRow label="Total Gross" value={totalGross} />
          <SummaryRow label="Discount TK" value={discountTk} />
          <SummaryRow label="Sub Total" value={subTotal} />
          <SummaryRow
            label={
              <>
                Extra Fine
                <div className="text-xs font-normal" style={{ color: COLORS.rust }}>
                  (অতিরিক্ত জরিমানা)
                </div>
              </>
            }
            value={extraFine}
            tone="rust"
          />
          <SummaryRow
            label={
              <>
                Total Payable
                <div className="text-xs font-normal" style={{ color: COLORS.muted }}>
                  (কাস্টমার পাবে)
                </div>
              </>
            }
            value={totalPayable}
            tone="teal"
            labelClass={COLORS.accent}
          />
          <SummaryRow
            label={
              <>
                Customer Due
                <div className="text-xs font-normal" style={{ color: COLORS.rust }}>
                  (কাস্টমার থেকে পাবে)
                </div>
              </>
            }
            value={customerDue}
          />
          <SummaryRow
            label={
              <>
                Total With inv &amp; current due
                <div className="text-xs font-normal" style={{ color: COLORS.teal }}>
                  (বর্তমানে কাস্টমার পাবে)
                </div>
              </>
            }
            value={totalWithCurrentDue}
          />

          <div>
            <label
              className="mb-1 block text-sm font-semibold"
              style={{ color: COLORS.teal, fontFamily: FONTS.HEAD }}
            >
              Paid to customer
              <span className="ml-1 text-xs font-normal" style={{ color: COLORS.muted }}>
                (কাস্টমার ফেরত পাবে)
              </span>
            </label>
            <input
              value={paidToCustomer}
              onChange={(e) => setPaidToCustomer(e.target.value)}
              className="w-full rounded-lg border-[1.5px] px-3 py-2 text-sm outline-none"
              style={{
                borderColor: COLORS.line,
                backgroundColor: COLORS.paper,
                color: COLORS.ink,
                fontFamily: FONTS.BODY,
              }}
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-semibold"
              style={{ color: COLORS.rust, fontFamily: FONTS.HEAD }}
            >
              Customer Bl
              <span className="ml-1 text-xs font-normal" style={{ color: COLORS.muted }}>
                (কাস্টমারের বর্তমান ব্যালান্স)
              </span>
            </label>
            <input
              disabled
              value={customerBalance}
              className="w-full rounded-lg border-[1.5px] px-3 py-2 text-sm outline-none"
              style={{
                borderColor: COLORS.line,
                backgroundColor: COLORS.paper,
                color: COLORS.muted,
                fontFamily: FONTS.BODY,
              }}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.HEAD }}>
              Note
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-lg border-[1.5px] px-3 py-2 text-sm outline-none"
              style={{
                borderColor: COLORS.line,
                backgroundColor: COLORS.paper,
                color: COLORS.ink,
                fontFamily: FONTS.BODY,
              }}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.HEAD }}>
              Date <span style={{ color: COLORS.rust }}>*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border-[1.5px] px-3 py-2 text-sm outline-none"
              style={{
                borderColor: COLORS.line,
                backgroundColor: COLORS.paper,
                color: COLORS.ink,
                fontFamily: FONTS.BODY,
              }}
            />
          </div>

          <button
            className="w-full rounded-lg py-2.5 text-sm font-bold text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: COLORS.teal }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, tone, labelClass }) {
  let bgColor = COLORS.paper;
  let textColor = COLORS.ink;

  if (tone === "teal") {
    bgColor = COLORS.teal;
    textColor = "white";
  } else if (tone === "rust") {
    bgColor = COLORS.rust;
    textColor = "white";
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-sm font-semibold" style={{ color: labelClass || COLORS.ink }}>
        {label}
      </div>
      <div
        className="min-w-[70px] rounded-lg px-3 py-1.5 text-right text-sm font-bold"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {value}
      </div>
    </div>
  );
}

export function ReturnableInvoices() {
  const [view, setView] = useState("list");
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [invNumber, setInvNumber] = useState("");
  const [nameOrPhone, setNameOrPhone] = useState("");
  const [dateType, setDateType] = useState("");
  const [page, setPage] = useState(1);

  const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  if (view === "return" && activeInvoice) {
    return (
      <div style={{ backgroundColor: COLORS.page, minHeight: "100vh" }} className="p-7 font-sans">
        <div className="mx-auto mb-6 h-1.5 max-w-6xl rounded-full bg-gradient-to-r from-pink-500 via-orange-400 via-teal-500 to-violet-600" />
        <ReturnForm invoice={activeInvoice} onBack={() => setView("list")} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: COLORS.page, minHeight: "100vh" }} className="p-7 font-sans">
      <div className="mx-auto mb-6 h-1.5 max-w-6xl rounded-full bg-gradient-to-r from-pink-500 via-orange-400 via-teal-500 to-violet-600" />

      <div
        className="mx-auto max-w-6xl overflow-hidden rounded-2xl border relative"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
      >
        <ScallopBorder id="scallop-returnable-header" colors={PETALS} />

        {/* header */}
        <div className="border-b px-7 py-6" style={{ borderColor: COLORS.line }}>
          <h1
            className="mb-5 text-2xl font-bold tracking-tight"
            style={{ color: COLORS.rust, fontFamily: FONTS.HEAD }}
          >
            Returnable Product invoices.
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <input
              value={invNumber}
              onChange={(e) => setInvNumber(e.target.value)}
              placeholder="Invoice Number [without #]"
              className="min-w-[220px] flex-1 rounded-xl border-[1.5px] px-3.5 py-2.5 text-sm outline-none"
              style={{
                borderColor: COLORS.line,
                backgroundColor: COLORS.paper,
                color: COLORS.ink,
                fontFamily: FONTS.BODY,
              }}
            />
            <input
              value={nameOrPhone}
              onChange={(e) => setNameOrPhone(e.target.value)}
              placeholder="Name or Phone Number"
              className="min-w-[220px] flex-1 rounded-xl border-[1.5px] px-3.5 py-2.5 text-sm outline-none"
              style={{
                borderColor: COLORS.line,
                backgroundColor: COLORS.paper,
                color: COLORS.ink,
                fontFamily: FONTS.BODY,
              }}
            />
            <select
              value={dateType}
              onChange={(e) => setDateType(e.target.value)}
              className="min-w-[200px] rounded-xl border-[1.5px] px-3.5 py-2.5 text-sm outline-none"
              style={{
                borderColor: COLORS.line,
                backgroundColor: COLORS.paper,
                color: COLORS.ink,
                fontFamily: FONTS.BODY,
              }}
            >
              <option value="">Select Date Type</option>
              <option>Created Date</option>
              <option>Invoice Date</option>
            </select>
            <button
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: COLORS.teal }}
            >
              <Search className="h-4 w-4" />
              Search
            </button>
            <button
              onClick={() => {
                setInvNumber("");
                setNameOrPhone("");
                setDateType("");
              }}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: COLORS.rust }}
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>

        {/* table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr style={{ backgroundColor: COLORS.ink }}>
                {["Date", "Customer Info", "Others Info", "Action"].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-white"
                    style={{ fontFamily: FONTS.HEAD }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => (
                <tr
                  key={i}
                  className="border-b transition-colors"
                  style={{
                    borderColor: COLORS.line,
                    backgroundColor: i % 2 === 1 ? COLORS.paper + "20" : "transparent",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.paper + "40")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = i % 2 === 1 ? COLORS.paper + "20" : "transparent")}
                >
                  <td className="px-4 py-4 align-top font-medium" style={{ color: COLORS.muted }}>
                    {inv.date}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.HEAD }}>
                      {inv.customer}
                    </div>
                    <div className="text-xs" style={{ color: COLORS.muted }}>
                      [{inv.phone}]
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top text-xs leading-relaxed">
                    <div style={{ color: COLORS.muted }}>
                      Inv Num: <span className="font-semibold" style={{ color: COLORS.accent }}>
                        {inv.invNum}
                      </span>
                    </div>
                    <div style={{ color: COLORS.muted }}>
                      Created By:{" "}
                      <span className="font-semibold" style={{ color: COLORS.ink }}>
                        {inv.createdBy} ({inv.createdByPhone})
                      </span>
                    </div>
                    <div style={{ color: COLORS.muted }}>
                      Created at: <span className="font-semibold" style={{ color: COLORS.teal }}>
                        {inv.createdAt}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex overflow-hidden rounded-lg">
                      <button
                        className="px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
                        style={{ backgroundColor: COLORS.teal }}
                      >
                        Invoice
                      </button>
                      <button
                        onClick={() => {
                          setActiveInvoice(inv);
                          setView("return");
                        }}
                        className="px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
                        style={{ backgroundColor: COLORS.rust }}
                      >
                        Return
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* footer / pagination */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-7 py-6">
          <p className="text-sm" style={{ color: COLORS.muted }}>
            Showing 1 to 30 of 625 entries
          </p>

          <div className="flex items-center gap-1.5">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg border-[1.5px] transition-colors hover:bg-opacity-50 disabled:opacity-40"
              style={{
                borderColor: COLORS.line,
                color: COLORS.muted,
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {pages.map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className="h-8 w-8 rounded-lg text-sm font-semibold transition-colors"
                style={{
                  borderBottom: page === n ? `2px solid ${COLORS.forest}` : "none",
                  color: page === n ? COLORS.forest : COLORS.muted,
                }}
              >
                {n}
              </button>
            ))}
            <span style={{ color: COLORS.line }}>...</span>
            <button
              onClick={() => setPage(20)}
              className="h-8 min-w-8 rounded-lg px-1.5 text-sm font-semibold transition-colors"
              style={{
                borderBottom: page === 20 ? `2px solid ${COLORS.forest}` : "none",
                color: page === 20 ? COLORS.forest : COLORS.muted,
              }}
            >
              20
            </button>
            <button
              onClick={() => setPage(21)}
              className="h-8 min-w-8 rounded-lg px-1.5 text-sm font-semibold transition-colors"
              style={{
                borderBottom: page === 21 ? `2px solid ${COLORS.forest}` : "none",
                color: page === 21 ? COLORS.forest : COLORS.muted,
              }}
            >
              21
            </button>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg border-[1.5px] transition-colors hover:bg-opacity-50"
              style={{
                borderColor: COLORS.line,
                color: COLORS.muted,
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}