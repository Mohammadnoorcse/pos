import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { COLORS, PETALS, FONTS } from "../../../constants";

const records = [
  {
    date: "08-03-2025",
    place: "My Shop",
    product: "Laxus 10 GM",
    lot: 16,
    pp: 100,
    sp: 200,
    discount: "no(0)",
    vat: "0%",
    barcode: "123456789",
    stock: "2 pcs",
    reason: "trst",
  },
  {
    date: "03-12-2024",
    place: "My Shop",
    product: "A4 Tech Keyboard",
    lot: 5,
    pp: 123,
    sp: 300,
    discount: "percent(10)",
    vat: "0%",
    barcode: "8941193078563",
    stock: "17 pcs",
    reason: "stock update or dameeg fjalsjdfibzkzdvbd",
  },
  {
    date: "20-11-2024",
    place: "My Shop",
    product: "Alu Deshi",
    lot: 2,
    pp: 60,
    sp: 70,
    discount: "no(0)",
    vat: "0%",
    barcode: "—",
    stock: "1.2 KG",
    reason: "nosto alu tai damage korlam",
  },
  {
    date: "29-10-2024",
    place: "My Shop",
    product: "Ghee 800gm",
    lot: 3,
    pp: 121,
    sp: 350,
    discount: "flat(0)",
    vat: "0%",
    barcode: "8997212800325",
    stock: "4 pcs",
    reason: "expiry",
  },
  {
    date: "15-10-2024",
    place: "My Shop",
    product: "Laxus 10 GM",
    lot: 16,
    pp: 100,
    sp: 200,
    discount: "no(0)",
    vat: "0%",
    barcode: "123456789",
    stock: "1 pcs",
    reason: "broken pack",
  },
];

export function AllDamageProduct() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = records.filter((r) =>
    r.product.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: COLORS.page, minHeight: "100vh" }} className="p-7 font-sans">
      {/* gradient topbar */}
      <div className="mx-auto mb-6 h-1.5 max-w-6xl rounded-full bg-gradient-to-r from-pink-500 via-orange-400 via-teal-500 to-violet-600" />

      <div
        className="mx-auto max-w-6xl overflow-hidden rounded-2xl border relative"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
      >
        <ScallopBorder id="scallop-damaged-header" colors={PETALS} />

        {/* header */}
        <div className="border-b px-7 py-6" style={{ borderColor: COLORS.line }}>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: COLORS.accent, fontFamily: FONTS.HEAD }}
          >
            All Damaged Products
          </h1>
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

        {/* table */}
        <div className="mt-5 overflow-x-auto px-7">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr style={{ backgroundColor: COLORS.paper }}>
                {["Date", "Place", "Product Name", "Damaged Stock", "Reason"].map((h, i) => (
                  <th
                    key={h}
                    className={`whitespace-nowrap border-b-2 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide ${
                      i === 0 ? "rounded-tl-xl" : ""
                    } ${i === 4 ? "rounded-tr-xl" : ""}`}
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
              {filtered.map((r, i) => (
                <tr
                  key={i}
                  className="border-b transition-colors"
                  style={{ borderColor: COLORS.line }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.paper + "40")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td className="whitespace-nowrap px-4 py-4 align-top" style={{ color: COLORS.muted }}>
                    {r.date}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 align-top" style={{ color: COLORS.muted }}>
                    {r.place}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.HEAD }}>
                      {r.product}
                    </div>
                    <div className="mt-1 text-xs" style={{ color: COLORS.muted }}>
                      Lot Number: <span className="font-medium" style={{ color: COLORS.ink }}>{r.lot}</span>, Purchase
                      Price: <span className="font-medium" style={{ color: COLORS.ink }}>{r.pp}</span>, Sales Price:{" "}
                      <span className="font-medium" style={{ color: COLORS.ink }}>{r.sp}</span>, Discount:{" "}
                      <span className="font-medium" style={{ color: COLORS.ink }}>{r.discount}</span>, VAT:{" "}
                      <span className="font-medium" style={{ color: COLORS.ink }}>{r.vat}</span>
                    </div>
                    <div className="mt-0.5 text-xs" style={{ color: COLORS.muted }}>
                      Barcode: <span className="font-medium" style={{ color: COLORS.ink }}>{r.barcode}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span
                      className="inline-block rounded-lg px-2.5 py-1 text-xs font-bold"
                      style={{
                        backgroundColor: COLORS.paper,
                        color: COLORS.teal,
                      }}
                    >
                      {r.stock}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top font-medium" style={{ color: COLORS.rust }}>
                    {r.reason}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center" style={{ color: COLORS.muted }}>
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* footer / pagination */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-7 py-6">
          <p className="text-sm" style={{ color: COLORS.muted }}>
            Showing 1 to {filtered.length} of 22 entries
          </p>

          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1 rounded-lg border-[1.5px] px-3 py-1.5 text-sm font-medium transition-colors hover:bg-opacity-50 disabled:opacity-40"
              style={{
                borderColor: COLORS.line,
                color: COLORS.muted,
                backgroundColor: COLORS.paper,
              }}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              onClick={() => setPage(1)}
              className="h-8 w-8 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: COLORS.forest }}
            >
              1
            </button>
            <button
              className="flex items-center gap-1 rounded-lg border-[1.5px] px-3 py-1.5 text-sm font-medium transition-colors hover:bg-opacity-50"
              style={{
                borderColor: COLORS.line,
                color: COLORS.muted,
                backgroundColor: COLORS.paper,
              }}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}