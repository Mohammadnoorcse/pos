import React from "react";
import { Search, ChevronDown, ArrowRightLeft } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { COLORS, PETALS, FONTS } from "../../../constants";

export function TransferHistoriesPage({ history }) {
  const [query, setQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("All");

  const filtered = history.filter((r) => {
    const matchesType = typeFilter === "All" || r.type === typeFilter;
    const matchesQuery = (r.from + " " + r.to + " " + r.note)
      .toLowerCase()
      .includes(query.toLowerCase());
    return matchesType && matchesQuery;
  });

  return (
    <div
      className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-transfer-history" colors={PETALS} />
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2
          className="font-bold text-[16px] flex items-center gap-2"
          style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
        >
          Transfered Histories
          <span
            className="text-[10.5px] font-bold px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: COLORS.forestTint,
              color: COLORS.forestDark,
            }}
          >
            {history.length} total
          </span>
        </h2>
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none rounded-lg pl-3 pr-8 py-2 text-[12.5px] font-semibold border outline-none cursor-pointer"
              style={{
                backgroundColor: COLORS.paper,
                borderColor: COLORS.line,
                color: COLORS.ink,
                fontFamily: FONTS.BODY,
              }}
            >
              {["All", "B2B/B2G", "G2B"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: COLORS.muted }}
            />
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
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search branch or note…"
              className="bg-transparent outline-none text-[13px] w-44"
              style={{ color: COLORS.ink, fontFamily: FONTS.BODY }}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left" style={{ color: COLORS.muted }}>
              <th
                className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                style={{ borderColor: COLORS.line }}
              >
                Date
              </th>
              <th
                className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                style={{ borderColor: COLORS.line }}
              >
                Type
              </th>
              <th
                className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                style={{ borderColor: COLORS.line }}
              >
                Transfer
              </th>
              <th
                className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                style={{ borderColor: COLORS.line }}
              >
                Items
              </th>
              <th
                className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-right"
                style={{ borderColor: COLORS.line }}
              >
                Total
              </th>
              <th
                className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                style={{ borderColor: COLORS.line }}
              >
                Note
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => {
              const isG2B = r.type === "G2B";
              const accent = isG2B ? COLORS.peacock : COLORS.purple;
              const accentTint = isG2B ? COLORS.peacockTint : COLORS.purpleTint;
              return (
                <tr
                  key={r.id}
                  style={
                    i !== filtered.length - 1
                      ? { borderBottom: `1px solid ${COLORS.line}` }
                      : undefined
                  }
                >
                  <td
                    className="py-3 px-2.5"
                    style={{
                      color: COLORS.muted,
                      fontFamily: FONTS.MONO,
                    }}
                  >
                    {r.date}
                  </td>
                  <td className="py-3 px-2.5">
                    <span
                      className="text-[10.5px] font-bold px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: accentTint,
                        color: accent,
                      }}
                    >
                      {r.type}
                    </span>
                  </td>
                  <td className="py-3 px-2.5">
                    <div className="flex items-center gap-1.5 font-semibold" style={{ color: COLORS.ink }}>
                      {r.from} <ArrowRightLeft size={12} style={{ color: COLORS.muted }} />{" "}
                      {r.to}
                    </div>
                  </td>
                  <td className="py-3 px-2.5" style={{ color: COLORS.muted }}>
                    {r.items.map((it, k) => (
                      <div key={k} className="text-[11.5px]">
                        {it.name} × {it.qty} {it.unitLabel}
                      </div>
                    ))}
                  </td>
                  <td
                    className="py-3 px-2.5 text-right font-bold"
                    style={{
                      fontFamily: FONTS.MONO,
                      color: accent,
                    }}
                  >
                    ৳{r.total.toFixed(2)}
                  </td>
                  <td
                    className="py-3 px-2.5 max-w-[220px] truncate"
                    style={{ color: COLORS.muted }}
                    title={r.note}
                  >
                    {r.note}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-[13px]"
                  style={{ color: COLORS.muted }}
                >
                  {history.length === 0
                    ? "No stock transfers yet. Create one from Product Transfer."
                    : "No transfers match your search."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}