import React, { useState } from "react";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { COLORS, PETALS, FONTS } from "../../../constants";

const allProducts = [
  { name: "Sunsilk 500 ML", barcode: "—" },
  { name: "sunsilk 1000 ml", barcode: "—" },
  { name: "Expiry date test", barcode: "—" },
  { name: "VIVO 22", barcode: "—" },
  { name: "Suzuki", barcode: "—" },
  { name: "Ayesha", barcode: "—" },
  { name: "Matador i-teen Gel", barcode: "0011" },
  { name: "Matador Eraser", barcode: "5566" },
  { name: "Cotton Panjabi — L", barcode: "8841" },
  { name: "Denim Jeans — 32", barcode: "9021" },
];

export function AddDamageProduct() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = allProducts.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: COLORS.page, minHeight: "100vh" }} className="p-7 font-sans">
      {/* gradient topbar */}
      <div className="mx-auto mb-6 h-1.5 max-w-5xl rounded-full bg-gradient-to-r from-pink-500 via-orange-400 via-teal-500 to-violet-600" />

      <div
        className="mx-auto max-w-5xl overflow-hidden rounded-2xl border relative"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
      >
        <ScallopBorder id="scallop-damage-header" colors={PETALS} />

        {/* header */}
        <div className="border-b px-7 py-6" style={{ borderColor: COLORS.line }}>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: COLORS.accent, fontFamily: FONTS.HEAD }}
          >
            Add Damage Product
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
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr style={{ backgroundColor: COLORS.paper }}>
                <th
                  className="whitespace-nowrap rounded-tl-xl border-b-2 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide"
                  style={{
                    borderColor: COLORS.line,
                    color: COLORS.accent,
                    fontFamily: FONTS.HEAD,
                  }}
                >
                  Product Name
                </th>
                <th
                  className="whitespace-nowrap border-b-2 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide"
                  style={{
                    borderColor: COLORS.line,
                    color: COLORS.accent,
                    fontFamily: FONTS.HEAD,
                  }}
                >
                  Product Barcode
                </th>
                <th
                  className="whitespace-nowrap rounded-tr-xl border-b-2 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide"
                  style={{
                    borderColor: COLORS.line,
                    color: COLORS.accent,
                    fontFamily: FONTS.HEAD,
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr
                  key={i}
                  className="border-b transition-colors"
                  style={{ borderColor: COLORS.line }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.paper + "40")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td className="px-4 py-4" style={{ color: COLORS.ink }}>
                    {p.name}
                  </td>
                  <td className="px-4 py-4" style={{ color: COLORS.muted }}>
                    {p.barcode}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
                      style={{ backgroundColor: COLORS.rust }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center" style={{ color: COLORS.muted }}>
                    No matching products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* footer / pagination */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-7 py-6">
          <p className="text-sm" style={{ color: COLORS.muted }}>
            Showing 1 to {filtered.length} of 200 entries
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
            {[1, 2].map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className="h-8 w-8 rounded-lg text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: page === n ? COLORS.forest : COLORS.paper,
                  color: page === n ? "white" : COLORS.muted,
                  borderColor: page === n ? COLORS.forest : COLORS.line,
                  border: page === n ? "none" : `1.5px solid ${COLORS.line}`,
                }}
              >
                {n}
              </button>
            ))}
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