import React from "react";
import { Search, ChevronDown, ArrowRightLeft, Loader2 } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { COLORS, PETALS, FONTS, SUB_BRANCH_ID } from "../../../constants";
import { fetchStockTransfers } from "../../../api/stockTransferService";

function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// The type filter shown in the UI uses "B2B/B2G" for display, but the API
// (and DB enum) stores it as "B2B_B2G". Keep the mapping in one place.
const TYPE_UI_TO_API = { "B2B/B2G": "B2B_B2G", G2B: "G2B" };
const TYPE_API_TO_UI = { B2B_B2G: "B2B/B2G", G2B: "G2B" };

function normalizeTransfer(r) {
  return {
    id: r.id,
    type: TYPE_API_TO_UI[r.type] ?? r.type,
    fromId: r.from_branch?.id ?? r.fromBranch?.id ?? r.from_branch_id ?? null,
    toId: r.to_branch?.id ?? r.toBranch?.id ?? r.to_branch_id ?? null,
    from: r.from_branch?.name ?? r.fromBranch?.name ?? "N/A",
    to: r.to_branch?.name ?? r.toBranch?.name ?? "N/A",
    date: r.transfer_date ?? r.date ?? "",
    note: r.note ?? "",
    items: (r.items ?? []).map((it) => ({
      name: it.product?.title ?? it.product?.name ?? "Unnamed",
      qty: Number(it.quantity ?? 0),
      unitLabel: it.product?.unit ?? "pcs",
    })),
    total: Number(r.total ?? 0),
  };
}

function extractList(res) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
}

export function TransferHistoriesPage({ refreshKey }) {
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebouncedValue(query, 350);
  const [typeFilter, setTypeFilter] = React.useState("All");

  const [history, setHistory] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = {};
    if (typeFilter !== "All") params.type = TYPE_UI_TO_API[typeFilter];
    if (debouncedQuery) params.search = debouncedQuery;

    fetchStockTransfers(params)
      .then((res) => {
        if (cancelled) return;
        let rows = extractList(res).map(normalizeTransfer);
        // Sub-branch ইউজার শুধু নিজের ব্রাঞ্চ সংশ্লিষ্ট (sender অথবা receiver)
        // ট্রান্সফারগুলোই দেখবে — অন্য/main ব্রাঞ্চের ডেটা আসবে না।
        if (SUB_BRANCH_ID) {
          rows = rows.filter(
            (r) =>
              String(r.fromId) === String(SUB_BRANCH_ID) ||
              String(r.toId) === String(SUB_BRANCH_ID)
          );
        }
        setHistory(rows);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "ইতিহাস লোড করা যায়নি");
        setHistory([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // refreshKey lets a parent force a re-fetch right after a new transfer is confirmed
  }, [typeFilter, debouncedQuery, refreshKey]);

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
          {loading && <Loader2 size={14} className="animate-spin" style={{ color: COLORS.muted }} />}
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

      {error && (
        <div
          className="rounded-lg px-3.5 py-2.5 text-[12.5px] font-semibold mb-4"
          style={{ backgroundColor: COLORS.vermillionTint, color: COLORS.vermillion }}
        >
          {error}
        </div>
      )}

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
            {history.map((r, i) => {
              const isG2B = r.type === "G2B";
              const accent = isG2B ? COLORS.peacock : COLORS.purple;
              const accentTint = isG2B ? COLORS.peacockTint : COLORS.purpleTint;
              return (
                <tr
                  key={r.id}
                  style={
                    i !== history.length - 1
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
            {!loading && history.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-[13px]"
                  style={{ color: COLORS.muted }}
                >
                  No stock transfers yet. Create one from Product Transfer.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}