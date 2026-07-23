import React from "react";
import { Bell, Package, Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { COLORS, PETALS, FONTS, DEFAULT_STOCK_ALERT_ITEMS } from "../../../constants";
import { stockAlertSeverity } from "../../../utils";

export function StockAlertQtyPage() {
  const [query, setQuery] = React.useState("");
  const [showEntries, setShowEntries] = React.useState("100");
  const [page, setPage] = React.useState(1);

  const filtered = DEFAULT_STOCK_ALERT_ITEMS.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.barcode.toLowerCase().includes(query.toLowerCase())
  );

  const pageSize = Number(showEntries) || filtered.length || 1;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIdx = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIdx = Math.min(safePage * pageSize, filtered.length);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div
      className="relative rounded-2xl border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-stock-alert-qty" colors={PETALS} />

      {/* HEADER */}
      <div
        className="p-5 pt-7 pb-4 flex items-center justify-between flex-wrap gap-3"
        style={{ borderBottom: `1px dashed ${COLORS.line}` }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: COLORS.peacockTint, color: COLORS.peacock }}
          >
            <Bell size={16} strokeWidth={2.2} />
          </div>
          <div>
            <h2
              className="font-bold text-[16px] leading-tight"
              style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
            >
              Stock Alert Quantity
            </h2>
            <p className="text-[11.5px]" style={{ color: COLORS.muted }}>
              যেসব পণ্যের মজুদ Alert Quantity-তে বা তার নিচে পৌঁছেছে
            </p>
          </div>
        </div>
        <span
          className="text-[11px] font-bold px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: COLORS.vermillionTint,
            color: COLORS.vermillion,
          }}
        >
          {filtered.length} {filtered.length === 1 ? "item" : "items"} need attention
        </span>
      </div>

      {/* SHOW ENTRIES + SEARCH */}
      <div className="px-5 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-[12.5px] font-medium" style={{ color: COLORS.muted }}>
          Show
          <div className="relative">
            <select
              value={showEntries}
              onChange={(e) => {
                setShowEntries(e.target.value);
                setPage(1);
              }}
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
          <span className="text-[12.5px] font-semibold" style={{ color: COLORS.ink }}>
            Search:
          </span>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="bg-transparent outline-none text-[13px] w-40"
            style={{ color: COLORS.ink, fontFamily: FONTS.BODY }}
          />
          <Search size={14} />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto px-5">
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
                Product Barcode
              </th>
              <th
                className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-center"
                style={{ borderColor: COLORS.line }}
              >
                Alert Quantity
              </th>
              <th
                className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-center"
                style={{ borderColor: COLORS.line }}
              >
                Current Stock
              </th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((item, i) => {
              const severity = stockAlertSeverity(item);
              return (
                <tr
                  key={item.id}
                  style={
                    i !== pageItems.length - 1
                      ? { borderBottom: `1px dashed ${COLORS.line}` }
                      : undefined
                  }
                >
                  <td className="py-3.5 px-2.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: severity.bg,
                          color: severity.color,
                        }}
                      >
                        <Package size={14} />
                      </div>
                      <span className="font-semibold" style={{ color: COLORS.ink }}>
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2.5" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>
                    {item.barcode}
                  </td>
                  <td
                    className="py-3.5 px-2.5 text-center font-semibold"
                    style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}
                  >
                    {item.alertQty}
                  </td>
                  <td className="py-3.5 px-2.5 text-center">
                    <span
                      className="text-[12.5px] font-bold px-2.5 py-1 rounded-lg"
                      style={{
                        backgroundColor: severity.bg,
                        color: severity.color,
                        fontFamily: FONTS.MONO,
                      }}
                      title={severity.label}
                    >
                      {item.currentStock}
                    </span>
                  </td>
                </tr>
              );
            })}
            {pageItems.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="py-10 text-center text-[13px]"
                  style={{ color: COLORS.muted }}
                >
                  No low-stock products match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER: entry count + pagination */}
      <div
        className="px-5 py-4 mt-2 flex items-center justify-between flex-wrap gap-3"
        style={{ borderTop: `1px dashed ${COLORS.line}` }}
      >
        <span className="text-[12.5px]" style={{ color: COLORS.muted }}>
          {filtered.length === 0
            ? "Showing 0 entries"
            : `Showing ${startIdx} to ${endIdx} of ${filtered.length} entries`}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="flex items-center gap-1 text-[12.5px] font-semibold px-3 py-1.5 rounded-lg border disabled:opacity-40"
            style={{
              borderColor: COLORS.line,
              color: COLORS.muted,
              backgroundColor: COLORS.panel,
            }}
          >
            <ChevronLeft size={13} /> Previous
          </button>
          <span
            className="text-[12.5px] font-bold w-8 h-8 flex items-center justify-center rounded-lg"
            style={{
              backgroundColor: COLORS.peacockTint,
              color: COLORS.peacock,
              fontFamily: FONTS.MONO,
            }}
          >
            {safePage}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className="flex items-center gap-1 text-[12.5px] font-semibold px-3 py-1.5 rounded-lg border disabled:opacity-40"
            style={{
              borderColor: COLORS.line,
              color: COLORS.muted,
              backgroundColor: COLORS.panel,
            }}
          >
            Next <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}