import React from "react";
import { Search, Download, Printer, ChevronDown } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { COLORS, PETALS, FONTS, DEFAULT_STOCK_ITEMS, DEFAULT_SHOP_BRANCHES } from "../../../constants";
import { formatCurrency } from "../../../utils";

function StockFilterSelect({ value, options, accentColor = COLORS.peacock }) {
  return (
    <div className="relative">
      <select
        defaultValue={value}
        className="appearance-none rounded-lg pl-3 pr-8 py-2 text-[12.5px] font-semibold border outline-none cursor-pointer"
        style={{
          backgroundColor: COLORS.panel,
          borderColor: COLORS.line,
          color: COLORS.ink,
          fontFamily: FONTS.BODY,
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: accentColor }}
      />
    </div>
  );
}

export function ProductStocksPage() {
  const [branch, setBranch] = React.useState(DEFAULT_SHOP_BRANCHES[1]?.name || "My Business");
  const [query, setQuery] = React.useState("");
  const [showEntries, setShowEntries] = React.useState("100");

  const filtered = DEFAULT_STOCK_ITEMS.filter((item) =>
    (item.name + " " + (item.barcode || "")).toLowerCase().includes(query.toLowerCase())
  );

  const totalPP = DEFAULT_STOCK_ITEMS.reduce(
    (sum, i) => sum + i.purchase * i.stock,
    0
  );
  const totalSale = DEFAULT_STOCK_ITEMS.reduce(
    (sum, i) => sum + i.sale * i.stock,
    0
  );

  return (
    <div
      className="relative rounded-2xl border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-product-stocks" colors={PETALS} />

      {/* HEADER: title + filters + actions */}
      <div
        className="p-5 pt-7 pb-4 flex items-center justify-between flex-wrap gap-3"
        style={{ borderBottom: `1px dashed ${COLORS.line}` }}
      >
        <h2
          className="font-bold text-[16px]"
          style={{
            fontFamily: FONTS.HEAD,
            color: COLORS.forestDark,
          }}
        >
          My Business [{branch}] Current Active Stock
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          <StockFilterSelect
            value="Active Stock"
            options={["Active Stock", "All Stock", "Zero Stock"]}
            accentColor={COLORS.peacock}
          />
          <StockFilterSelect
            value="All Brands"
            options={["All Brands", "Aarong", "Yellow", "Ecstasy", "Sailor"]}
            accentColor={COLORS.marigold}
          />
          <StockFilterSelect
            value="All Categories"
            options={["All Categories", "Panjabi", "Shirt", "Jeans", "T-Shirt"]}
            accentColor={COLORS.rust}
          />
          <div className="relative">
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="appearance-none rounded-lg pl-3 pr-8 py-2 text-[12.5px] font-semibold border outline-none cursor-pointer"
              style={{
                backgroundColor: COLORS.panel,
                borderColor: COLORS.purple,
                color: COLORS.purple,
                fontFamily: FONTS.BODY,
              }}
            >
              {DEFAULT_SHOP_BRANCHES.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: COLORS.purple }}
            />
          </div>
          <button
            className="text-white font-semibold text-[12.5px] px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-md"
            style={{
              backgroundColor: COLORS.purple,
              boxShadow: `0 4px 10px ${COLORS.purple}40`,
            }}
          >
            <Printer size={13} /> Print
          </button>
          <button
            className="text-white font-semibold text-[12.5px] px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-md"
            style={{
              backgroundColor: COLORS.forest,
              boxShadow: `0 4px 10px ${COLORS.forest}40`,
            }}
          >
            <Download size={13} /> Download
          </button>
        </div>
      </div>

      {/* STATS */}
      <div
        className="px-5 py-3 flex flex-wrap gap-x-8 gap-y-1"
        style={{ borderBottom: `1px dashed ${COLORS.line}` }}
      >
        <div className="text-[13px]">
          <span className="font-semibold" style={{ color: COLORS.ink }}>
            Total PP:{" "}
          </span>
          <span
            className="font-bold"
            style={{
              color: COLORS.forestDark,
              fontFamily: FONTS.MONO,
            }}
          >
            ৳{formatCurrency(totalPP)}
          </span>
        </div>
        <div className="text-[13px]">
          <span className="font-semibold" style={{ color: COLORS.ink }}>
            Estimate Sale Price:{" "}
          </span>
          <span
            className="font-bold"
            style={{
              color: COLORS.magenta,
              fontFamily: FONTS.MONO,
            }}
          >
            ৳{formatCurrency(totalSale)}
          </span>
        </div>
      </div>

      {/* SHOW ENTRIES + SEARCH */}
      <div className="px-5 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-[12.5px] font-medium" style={{ color: COLORS.muted }}>
          Show
          <div className="relative">
            <select
              value={showEntries}
              onChange={(e) => setShowEntries(e.target.value)}
              className="appearance-none rounded-lg pl-2.5 pr-6 py-1.5 text-[12.5px] font-semibold border outline-none cursor-pointer"
              style={{
                backgroundColor: COLORS.paper,
                borderColor: COLORS.line,
                color: COLORS.ink,
                fontFamily: FONTS.BODY,
              }}
            >
              {["10", "25", "50", "100"].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: COLORS.muted }}
            />
          </div>
          entries
        </div>
        <div
          className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] border"
          style={{
            backgroundColor: COLORS.paper,
            borderColor: COLORS.line,
            color: COLORS.muted,
          }}
        >
          <Search size={14} />
          <span className="text-[12.5px] font-semibold" style={{ color: COLORS.ink }}>
            Search:
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none text-[13px] w-40"
            style={{ color: COLORS.ink, fontFamily: FONTS.BODY }}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto px-5 pb-6">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left" style={{ color: COLORS.muted }}>
              <th
                className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                style={{ borderColor: COLORS.line }}
              >
                Product Name
              </th>
              <th
                className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                style={{ borderColor: COLORS.line }}
              >
                Barcode
              </th>
              <th
                className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-right"
                style={{ borderColor: COLORS.line }}
              >
                Purchase Price
              </th>
              <th
                className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-right"
                style={{ borderColor: COLORS.line }}
              >
                Sale Price
              </th>
              <th
                className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-center"
                style={{ borderColor: COLORS.line }}
              >
                Current Stock
              </th>
              <th
                className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-center"
                style={{ borderColor: COLORS.line }}
              >
                Alert Qty
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <tr
                key={item.id}
                style={
                  i !== filtered.length - 1
                    ? { borderBottom: `1px dashed ${COLORS.line}` }
                    : undefined
                }
              >
                <td className="py-3 px-2.5">
                  <div className="font-semibold" style={{ color: COLORS.purple }}>
                    {item.name}
                    {item.variant && (
                      <span style={{ color: COLORS.magenta }}>{item.variant}</span>
                    )}
                  </div>
                  <div className="text-[11px]" style={{ color: COLORS.muted }}>
                    Lot: {item.lot}, Discount: {item.discount}, Date: {item.date}
                  </div>
                </td>
                <td className="py-3 px-2.5" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                  {item.barcode || "—"}
                </td>
                <td
                  className="py-3 px-2.5 text-right font-semibold"
                  style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}
                >
                  {item.purchase}
                </td>
                <td
                  className="py-3 px-2.5 text-right font-semibold"
                  style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}
                >
                  {item.sale}
                </td>
                <td className="py-3 px-2.5 text-center">
                  <span
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                    style={
                      item.stock <= 5
                        ? {
                            backgroundColor: COLORS.vermillionTint,
                            color: COLORS.vermillion,
                          }
                        : {
                            backgroundColor: COLORS.forestTint,
                            color: COLORS.forestDark,
                          }
                    }
                  >
                    {item.stock}
                  </span>
                </td>
                <td
                  className="py-3 px-2.5 text-center font-semibold"
                  style={{
                    color:
                      item.alert > 0 ? COLORS.rust : COLORS.muted,
                    fontFamily: FONTS.MONO,
                  }}
                >
                  {item.alert}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
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
    </div>
  );
}