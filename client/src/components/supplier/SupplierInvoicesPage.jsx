import React from "react";
import { Search, ChevronLeft, ChevronRight, FileText, Loader2 } from "lucide-react";
import { COLORS, FONTS } from "../../constants";
import { fetchPurchases } from "../../api/supplier/purchaseService";

const magentaSoft = COLORS.magentaSoft || `${COLORS.magenta}1A`;

function formatDisplayDate(isoDate) {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-GB").replace(/\//g, "-"); // dd-mm-yyyy
}

function mapRow(p) {
  return {
    id: p.id,
    date: p.purchase_date,
    name: p.supplier?.name ?? "—",
    phone: p.supplier?.phone ?? "—",
    company: p.supplier?.company ?? "—",
    amount: Number(p.total ?? 0),
    paid: Number(p.paid ?? 0),
    inv: p.invoice_no,
  };
}

function StatusPill({ amount, paid }) {
  const due = amount - paid;
  if (due <= 0)
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
        style={{ backgroundColor: "#E9F7EE", color: "#1E8A4C" }}
      >
        Paid
      </span>
    );
  if (paid === 0)
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
        style={{ backgroundColor: "#FCEAE6", color: COLORS.vermillion }}
      >
        Unpaid
      </span>
    );
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ backgroundColor: "#FFF4E0", color: "#B8790A" }}
    >
      Due {due}
    </span>
  );
}

export function SupplierInvoicesPage() {
  const [query, setQuery] = React.useState("");
  const [perPage, setPerPage] = React.useState(100);
  const [page, setPage] = React.useState(1);

  const [rows, setRows] = React.useState([]);
  const [meta, setMeta] = React.useState({ total: 0, current_page: 1, last_page: 1 });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const load = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchPurchases({
        search: query || undefined,
        per_page: perPage,
        page,
      });
      setRows((res.data || []).map(mapRow));
      setMeta({ total: res.total ?? 0, current_page: res.current_page ?? 1, last_page: res.last_page ?? 1 });
    } catch (err) {
      console.error("Error loading supplier invoices:", err);
      setError(err.message || "Failed to load invoices.");
    } finally {
      setLoading(false);
    }
  }, [query, perPage, page]);

  React.useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      load();
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, perPage]);

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
      >
        {/* Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-5 border-b"
          style={{ borderColor: COLORS.line }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: magentaSoft }}
            >
              <FileText size={16} style={{ color: COLORS.magenta }} />
            </div>
            <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>
              Supplier Invoices
            </h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-[13px]" style={{ color: COLORS.muted }}>
              <span>Show</span>
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="rounded-md px-2 py-1.5 border text-[13px] outline-none"
                style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.paper }}
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span>entries</span>
            </div>

            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2 border w-full sm:w-64"
              style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper }}
            >
              <Search size={14} style={{ color: COLORS.muted }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search invoices"
                className="bg-transparent outline-none text-[13px] w-full"
                style={{ color: COLORS.ink }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr>
                {["Date", "Supplier info", "Purchase amount", "Paid", "Status", "Inv num."].map((h) => (
                  <th
                    key={h}
                    className="text-left font-semibold text-[11px] uppercase tracking-wide px-5 py-3 text-white"
                    style={{ backgroundColor: COLORS.magenta }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center" style={{ color: COLORS.muted }}>
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={18} />
                      Loading invoices...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[13px]" style={{ color: COLORS.vermillion }}>
                    {error}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[13px]" style={{ color: COLORS.muted }}>
                    No matching invoices found.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b hover:bg-black/[0.02] transition-colors"
                    style={{ borderColor: COLORS.line }}
                  >
                    <td className="px-5 py-3.5 align-top whitespace-nowrap" style={{ color: COLORS.ink, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                      {formatDisplayDate(row.date)}
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <div className="font-semibold" style={{ color: COLORS.ink }}>
                        {row.name}
                      </div>
                      <div className="text-[11.5px] mt-0.5" style={{ color: COLORS.muted }}>
                        Phone: {row.phone}
                      </div>
                      <div className="text-[11.5px]" style={{ color: COLORS.muted }}>
                        Company Name: {row.company}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 align-top font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                      {row.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 align-top" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                      {row.paid.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <StatusPill amount={row.amount} paid={row.paid} />
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <button
                        className="font-semibold hover:underline"
                        style={{ color: COLORS.magenta, fontFamily: FONTS.MONO, fontSize: 12.5 }}
                      >
                        {row.inv}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / pagination */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t text-[13px]"
          style={{ borderColor: COLORS.line, color: COLORS.muted }}
        >
          <span>
            Page {meta.current_page} of {meta.last_page} · {meta.total} total entries
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={meta.current_page <= 1 || loading}
              className="w-8 h-8 rounded-md border flex items-center justify-center disabled:opacity-40"
              style={{ borderColor: COLORS.line, color: COLORS.muted }}
            >
              <ChevronLeft size={14} />
            </button>
            <span
              className="w-8 h-8 rounded-md flex items-center justify-center font-semibold text-white"
              style={{ backgroundColor: COLORS.magenta }}
            >
              {meta.current_page}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              disabled={meta.current_page >= meta.last_page || loading}
              className="w-8 h-8 rounded-md border flex items-center justify-center disabled:opacity-40"
              style={{ borderColor: COLORS.line, color: COLORS.ink }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupplierInvoicesPage;