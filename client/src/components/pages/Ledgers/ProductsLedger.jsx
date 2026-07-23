import React from "react";
import { Search, Download } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { COLORS, PETALS, FONTS } from "../../../constants";

const products = [
  {
    sn: 1,
    name: "2X Spicy Noodls",
    brand: "Samyang",
    purchase: {
      opening: "0 Carton [0.00 TK]",
      own: "30 Carton [156,000.00 TK]",
      purchase: "531 Carton [2,661,000.00 TK]",
      purReturn: "0 Carton [0.00 TK]",
    },
    sell: {
      sell: "275 Carton [1,438,400.00 TK] [PP: 1,381,000.00]",
      sellReturn: "0 Carton [0.00 TK] [PP: 0.00]",
      actualSell: "275 Carton [1,438,400.00 TK] [PP: 1,381,000.00]",
    },
    damage: { qty: "0 Carton", amt: "0.00 TK" },
    cs: { badge: "CS: 256 Carton [PP: 1,280,000.00]", low: false, g: "0 Carton [PP: 0.00]", branch: "256 Carton [PP: 1,280,000.00]" },
    avgPP: "5,021.39",
    avgSP: "5,230.55",
    profit: "57,400.00 TK",
    neg: false,
  },
  {
    sn: 2,
    name: "3X Spicy Noodls",
    brand: "Samyang",
    purchase: {
      opening: "0 Carton [0.00 TK]",
      own: "0 Carton [0.00 TK]",
      purchase: "401 Carton [2,005,000.00 TK]",
      purReturn: "0 Carton [0.00 TK]",
    },
    sell: {
      sell: "41 Carton [213,200.00 TK] [PP: 205,000.00]",
      sellReturn: "0 Carton [0.00 TK] [PP: 0.00]",
      actualSell: "41 Carton [213,200.00 TK] [PP: 205,000.00]",
    },
    damage: { qty: "0 Carton", amt: "0.00 TK" },
    cs: { badge: "CS: 360 Carton [PP: 1,800,000.00]", low: false, g: "0 Carton [PP: 0.00]", branch: "360 Carton [PP: 1,800,000.00]" },
    avgPP: "5,000.00",
    avgSP: "5,200.00",
    profit: "8,200.00 TK",
    neg: false,
  },
  {
    sn: 4,
    name: "95156",
    brand: "FARA IT",
    purchase: {
      opening: "0 pcs [0.00 TK]",
      own: "0 pcs [0.00 TK]",
      purchase: "8 pcs [800.00 TK]",
      purReturn: "0 pcs [0.00 TK]",
    },
    sell: {
      sell: "2 pcs [500.00 TK] [PP: 200.00]",
      sellReturn: "0 pcs [0.00 TK] [PP: 0.00]",
      actualSell: "2 pcs [500.00 TK] [PP: 200.00]",
    },
    damage: { qty: "0 pcs", amt: "0.00 TK" },
    cs: { badge: "CS: 6 pcs [PP: 600.00]", low: false, g: "0 pcs [PP: 0.00]", branch: "6 pcs [PP: 600.00]" },
    avgPP: "100.00",
    avgSP: "250.00",
    profit: "300.00 TK",
    neg: false,
  },
  {
    sn: 5,
    name: "A4 Tech Keyboard",
    brand: "FARA IT",
    purchase: {
      opening: "100 pcs [12,300.00 TK]",
      own: "232 pcs [29,100.00 TK]",
      purchase: "283 pcs [35,373.00 TK]",
      purReturn: "0 pcs [0.00 TK]",
    },
    sell: {
      sell: "383 pcs [189,817.42 TK] [PP: 47,720.00]",
      sellReturn: "18 pcs [5,469.42 TK] [PP: 2,261.00]",
      actualSell: "365 pcs [184,348.00 TK] [PP: 45,459.00]",
    },
    damage: { qty: "18 pcs", amt: "2,214.00 TK" },
    cs: { badge: "CS: 0 pcs [PP: 0.00]", low: true, g: "0 pcs [PP: 0.00]", branch: "0 pcs [PP: 0.00]" },
    avgPP: "124.83",
    avgSP: "495.61",
    profit: "134,414.00 TK",
    neg: false,
  },
  {
    sn: 6,
    name: "ABC Test Barcode",
    brand: "Microlab",
    purchase: {
      opening: "0 pcs [0.00 TK]",
      own: "6 pcs [7,200.00 TK]",
      purchase: "19 pcs [22,800.00 TK]",
      purReturn: "0 pcs [0.00 TK]",
    },
    sell: {
      sell: "0 pcs [0.00 TK] [PP: 0.00]",
      sellReturn: "0 pcs [0.00 TK] [PP: 0.00]",
      actualSell: "0 pcs [0.00 TK] [PP: 0.00]",
    },
    damage: { qty: "0 pcs", amt: "0.00 TK" },
    cs: { badge: "CS: 19 pcs [PP: 22,800.00]", low: false, g: "0 pcs [PP: 0.00]", branch: "19 pcs [PP: 22,800.00]" },
    avgPP: "1,200.00",
    avgSP: "0.00",
    profit: "0.00 TK",
    neg: true,
  },
];

function InfoLine({ label, value }) {
  return (
    <div className="mb-1 leading-relaxed">
      <span style={{ color: COLORS.muted }}>{label}: </span>
      <span className="font-semibold" style={{ color: COLORS.ink }}>
        {value}
      </span>
    </div>
  );
}

export function ProductsLedger() {
  return (
    <div style={{ backgroundColor: COLORS.page, minHeight: "100vh" }} className="p-7 font-sans">
      {/* gradient topbar */}
      <div className="mx-auto mb-6 h-1.5 max-w-7xl rounded-full bg-gradient-to-r from-pink-500 via-orange-400 via-teal-500 to-violet-600" />

      <div className="mx-auto max-w-7xl">
        {/* controls */}
        <div className="mb-6 flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold" style={{ color: COLORS.accent }}>
              Select Type
            </label>
            <select
              className="min-w-[220px] rounded-xl border-[1.5px] px-3.5 py-2.5 text-sm outline-none focus:border-opacity-100"
              style={{
                borderColor: COLORS.line,
                backgroundColor: COLORS.paper,
                color: COLORS.ink,
                fontFamily: FONTS.BODY,
              }}
            >
              <option>All</option>
            </select>
          </div>

          <button
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: COLORS.forest }}
          >
            <Search className="h-4 w-4" />
            Search
          </button>

          <button
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: COLORS.teal }}
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>

        {/* card */}
        <div
          className="overflow-hidden rounded-2xl border relative"
          style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        >
          <ScallopBorder id="scallop-ledger-header" colors={PETALS} />
          
          <div className="border-b px-7 pb-4 pt-6 text-center" style={{ borderColor: COLORS.line }}>
            <h1
              className="mb-1 text-2xl font-bold tracking-tight"
              style={{ color: COLORS.accent, fontFamily: FONTS.HEAD }}
            >
              All Products Ledger
            </h1>
            <p style={{ color: COLORS.muted }}>Showing 1 to 100 of 205 Products</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13.5px]">
              <thead>
                <tr style={{ backgroundColor: COLORS.paper }}>
                  {["SN.", "Product Info", "Purchase", "Sell", "Total Damage", "Closing Stock (CS)", "Avg P/S Price", "Profit"].map(
                    (h) => (
                      <th
                        key={h}
                        className="whitespace-nowrap border-b-2 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide"
                        style={{
                          borderColor: COLORS.line,
                          color: COLORS.accent,
                          fontFamily: FONTS.HEAD,
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.sn}
                    className="border-b transition-colors hover:bg-opacity-50"
                    style={{
                      borderColor: COLORS.line,
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.paper + "40")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td className="px-4 py-4 align-top font-semibold" style={{ color: COLORS.muted }}>
                      {p.sn}
                    </td>

                    <td className="px-4 py-4 align-top">
                      <div className="text-[14.5px] font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.HEAD }}>
                        {p.name}
                      </div>
                      <span
                        className="mt-1 inline-block rounded-md px-2 py-0.5 text-[11.5px] font-semibold"
                        style={{
                          backgroundColor: COLORS.paper,
                          color: COLORS.accent,
                        }}
                      >
                        {p.brand}
                      </span>
                    </td>

                    <td className="px-4 py-4 align-top">
                      <InfoLine label="Opening Stock" value={p.purchase.opening} />
                      <InfoLine label="Own Stock" value={p.purchase.own} />
                      <InfoLine label="Purchase" value={p.purchase.purchase} />
                      <InfoLine label="Pur Return" value={p.purchase.purReturn} />
                    </td>

                    <td className="px-4 py-4 align-top">
                      <InfoLine label="Sell" value={p.sell.sell} />
                      <InfoLine label="Sell Return" value={p.sell.sellReturn} />
                      <InfoLine label="Actual Sell" value={p.sell.actualSell} />
                    </td>

                    <td className="px-4 py-4 align-top">
                      <div style={{ color: COLORS.muted }} className="mb-1">
                        {p.damage.qty}
                      </div>
                      <div className="font-bold" style={{ color: COLORS.rust }}>
                        {p.damage.amt}
                      </div>
                    </td>

                    <td className="px-4 py-4 align-top">
                      <div
                        className={`mb-1.5 inline-block rounded-lg px-2.5 py-1 text-[12.5px] font-bold`}
                        style={{
                          backgroundColor: p.cs.low ? COLORS.vermilionTint : COLORS.paper,
                          color: p.cs.low ? COLORS.vermillion : COLORS.teal,
                        }}
                      >
                        {p.cs.badge}
                      </div>
                      <InfoLine label="G stock" value={p.cs.g} />
                      <InfoLine label="Branch stock" value={p.cs.branch} />
                    </td>

                    <td className="px-4 py-4 align-top">
                      <div className="mb-1 font-semibold" style={{ color: COLORS.accent }}>
                        Avg PP: {p.avgPP}
                      </div>
                      <div className="font-semibold" style={{ color: COLORS.teal }}>
                        Avg SP: {p.avgSP}
                      </div>
                    </td>

                    <td
                      className={`px-4 py-4 align-top font-bold`}
                      style={{ color: p.neg ? COLORS.rust : COLORS.forest }}
                    >
                      {p.profit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}