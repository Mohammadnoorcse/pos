import React, { useState } from "react";
import { Search } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { COLORS, PETALS, FONTS } from "../../../constants";

const initialInvoices = [
  {
    date: "19-04-2025",
    customer: "Mizan Sanitary Home",
    phone: "01711212121",
    invNum: "#S/230710646/193/261/592",
    createdAt: "19-04-2025 11:21:22 AM",
    paid: true,
  },
  {
    date: "17-04-2025",
    customer: "Kishor",
    phone: "01834223297",
    invNum: "#S/230710646/438/261/586",
    createdAt: "17-04-2025 01:01:48 PM",
    paid: true,
  },
  {
    date: "15-04-2025",
    customer: "Walking Customer",
    phone: "p230710646",
    invNum: "#S/230710646/774/261/580",
    createdAt: "15-04-2025 04:12:09 PM",
    paid: false,
  },
];

export function DuePaymentInvoices() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [invoices, setInvoices] = useState(initialInvoices);

  function toggleStatus(idx) {
    setInvoices((prev) =>
      prev.map((inv, i) => (i === idx ? { ...inv, paid: !inv.paid } : inv))
    );
  }

  const filtered = invoices.filter((inv) =>
    inv.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: COLORS.page, minHeight: "100vh" }} className="p-7 font-sans">
      <div className="mx-auto mb-6 h-1.5 max-w-6xl rounded-full bg-gradient-to-r from-pink-500 via-orange-400 via-teal-500 to-violet-600" />

      <div
        className="mx-auto max-w-6xl overflow-hidden rounded-2xl border relative"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
      >
        <ScallopBorder id="scallop-due-payment-header" colors={PETALS} />

        {/* header */}
        <div className="border-b px-7 py-6" style={{ borderColor: COLORS.line }}>
          <h1
            className="mb-5 text-2xl font-bold tracking-tight"
            style={{ color: COLORS.accent, fontFamily: FONTS.HEAD }}
          >
            Due Date Received Payment Invoices
          </h1>

          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                className="text-sm font-semibold"
                style={{ color: COLORS.ink, fontFamily: FONTS.HEAD }}
              >
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="rounded-xl border-[1.5px] px-3.5 py-2.5 text-sm outline-none"
                style={{
                  borderColor: COLORS.line,
                  backgroundColor: COLORS.paper,
                  color: COLORS.ink,
                  fontFamily: FONTS.BODY,
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                className="text-sm font-semibold"
                style={{ color: COLORS.ink, fontFamily: FONTS.HEAD }}
              >
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="rounded-xl border-[1.5px] px-3.5 py-2.5 text-sm outline-none"
                style={{
                  borderColor: COLORS.line,
                  backgroundColor: COLORS.paper,
                  color: COLORS.ink,
                  fontFamily: FONTS.BODY,
                }}
              />
            </div>
            <button
              className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: COLORS.forest }}
            >
              Filter
            </button>
          </div>
        </div>

        {/* controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-7 pt-5">
          <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.muted }}>
            <span>Show</span>
            <select
              className="rounded-lg border-[1.5px] px-2.5 py-1.5 text-sm outline-none"
              style={{
                borderColor: COLORS.line,
                backgroundColor: COLORS.paper,
                color: COLORS.ink,
                fontFamily: FONTS.BODY,
              }}
            >
              <option>100</option>
              <option>50</option>
              <option>25</option>
              <option>10</option>
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer..."
                className="w-56 rounded-xl border-[1.5px] py-2 pl-9 pr-3 text-sm outline-none"
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

        {/* table */}
        <div className="mt-5 overflow-x-auto px-7 pb-7">
          <table className="w-full min-w-[800px] border-collapse text-sm">
            <thead>
              <tr style={{ backgroundColor: COLORS.paper }}>
                {["Date", "Customer Info", "Others Info", "Action"].map((h, i) => (
                  <th
                    key={h}
                    className={`whitespace-nowrap border-b-2 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide ${
                      i === 0 ? "rounded-tl-xl" : ""
                    } ${i === 3 ? "rounded-tr-xl" : ""}`}
                    style={{
                      borderColor: COLORS.line,
                      color: COLORS.accent,
                      fontFamily: FONTS.HEAD,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv, i) => (
                <tr
                  key={i}
                  className="border-b transition-colors"
                  style={{ borderColor: COLORS.line }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.paper + "40")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
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
                    <span
                      className="mb-1.5 inline-block rounded-md px-2.5 py-1 text-xs font-bold text-white"
                      style={{
                        backgroundColor: inv.paid ? COLORS.teal : COLORS.muted,
                      }}
                    >
                      {inv.paid ? "Paid" : "Unpaid"}
                    </span>
                    <div style={{ color: COLORS.muted }}>
                      Inv Num: <span className="font-semibold" style={{ color: COLORS.accent }}>
                        {inv.invNum}
                      </span>
                    </div>
                    <div className="mb-1.5" style={{ color: COLORS.muted }}>
                      Created at: <span className="font-semibold" style={{ color: COLORS.ink }}>
                        {inv.createdAt}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleStatus(invoices.indexOf(inv))}
                      className="inline-block rounded-md px-2.5 py-1 text-xs font-bold text-white transition-colors hover:opacity-90"
                      style={{
                        backgroundColor: inv.paid ? COLORS.rust : COLORS.teal,
                      }}
                    >
                      {inv.paid ? "Click To Unpaid" : "Click To Paid"}
                    </button>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <button
                      className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
                      style={{ backgroundColor: COLORS.forest }}
                    >
                      Invoice
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center" style={{ color: COLORS.muted }}>
                    No matching invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}