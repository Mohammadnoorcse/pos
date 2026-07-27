import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { COLORS, PETALS, FONTS } from "../../../constants";
import { fetchDamageRecords } from "../../../api/damageService";

export function AllDamageProduct() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [perPage, setPerPage] = useState(100);
  const [page, setPage] = useState(1);

  // Fetch damage history
  const loadRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDamageRecords({ search: query, page, per_page: perPage });
      setRecords(data.data || data || []);
    } catch (err) {
      console.error("Error loading damage records:", err);
      setError("ড্যামেজ রেকর্ড লিস্ট লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [query, page, perPage]);

  return (
    <div style={{ backgroundColor: COLORS.page, minHeight: "100vh" }} className="p-7 font-sans">
      <div className="mx-auto mb-6 h-1.5 max-w-6xl rounded-full bg-gradient-to-r from-pink-500 via-orange-400 via-teal-500 to-violet-600" />

      <div
        className="mx-auto max-w-6xl overflow-hidden rounded-2xl border relative"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
      >
        <ScallopBorder id="scallop-damaged-header" colors={PETALS} />

        {/* Header */}
        <div className="border-b px-7 py-6" style={{ borderColor: COLORS.line }}>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: COLORS.accent, fontFamily: FONTS.HEAD }}
          >
            All Damaged Products
          </h1>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-7 pt-5">
          <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.muted }}>
            <span>Show</span>
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="rounded-lg border-[1.5px] px-2.5 py-1.5 text-sm outline-none"
              style={{
                borderColor: COLORS.line,
                backgroundColor: COLORS.paper,
                color: COLORS.ink,
                fontFamily: FONTS.BODY,
              }}
            >
              <option value={100}>100</option>
              <option value={50}>50</option>
              <option value={25}>25</option>
              <option value={10}>10</option>
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
                placeholder="Search records..."
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

        {/* Table Area */}
        <div className="mt-5 overflow-x-auto px-7">
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-slate-500">
              <Loader2 className="animate-spin" size={20} />
              <span>ডাটা লোড হচ্ছে...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
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
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center" style={{ color: COLORS.muted }}>
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  records.map((r, i) => (
                    <tr
                      key={r.id || i}
                      className="border-b transition-colors"
                      style={{ borderColor: COLORS.line }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.paper + "40")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <td className="whitespace-nowrap px-4 py-4 align-top" style={{ color: COLORS.muted }}>
                        {r.date || r.created_at}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 align-top" style={{ color: COLORS.muted }}>
                        {r.place || "My Shop"}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.HEAD }}>
                          {r.product_name || r.product || "N/A"}
                        </div>
                        <div className="mt-1 text-xs" style={{ color: COLORS.muted }}>
                          Lot Number: <span className="font-medium" style={{ color: COLORS.ink }}>{r.lot ?? "—"}</span>, Purchase Price:{" "}
                          <span className="font-medium" style={{ color: COLORS.ink }}>{r.pp ?? "—"}</span>, Sales Price:{" "}
                          <span className="font-medium" style={{ color: COLORS.ink }}>{r.sp ?? "—"}</span>, Discount:{" "}
                          <span className="font-medium" style={{ color: COLORS.ink }}>{r.discount ?? "—"}</span>, VAT:{" "}
                          <span className="font-medium" style={{ color: COLORS.ink }}>{r.vat ?? "—"}</span>
                        </div>
                        <div className="mt-0.5 text-xs" style={{ color: COLORS.muted }}>
                          Barcode: <span className="font-medium" style={{ color: COLORS.ink }}>{r.barcode || "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <span
                          className="inline-block rounded-lg px-2.5 py-1 text-xs font-bold"
                          style={{ backgroundColor: COLORS.paper, color: COLORS.teal }}
                        >
                          {r.stock || `${r.quantity ?? 0} pcs`}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-top font-medium" style={{ color: COLORS.rust }}>
                        {r.reason || "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer / Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-7 py-6">
          <p className="text-sm" style={{ color: COLORS.muted }}>
            Showing {records.length} entries
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="flex items-center gap-1 rounded-lg border-[1.5px] px-3 py-1.5 text-sm font-medium transition-colors hover:bg-opacity-50 disabled:opacity-40"
              style={{ borderColor: COLORS.line, color: COLORS.muted, backgroundColor: COLORS.paper }}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <span className="px-3 py-1 text-sm font-semibold" style={{ color: COLORS.ink }}>
              Page {page}
            </span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="flex items-center gap-1 rounded-lg border-[1.5px] px-3 py-1.5 text-sm font-medium transition-colors hover:bg-opacity-50"
              style={{ borderColor: COLORS.line, color: COLORS.muted, backgroundColor: COLORS.paper }}
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