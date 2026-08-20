import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  ChevronDown,
  X,
  Eye,
  Pencil,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Wallet,
  Loader2,
} from "lucide-react";
import { ScallopBorder } from "../shared";
import { COLORS, PETALS, FONTS } from "../../constants";
import { fetchSuppliers, createSupplier } from "../../api/supplier/supplierService";

function mapSupplierRow(s) {
  return {
    id: s.id,
    company: s.company || "—",
    supplier: s.name || "—",
    code: s.code || `SUP-${String(s.id).padStart(4, "0")}`,
    phone: s.phone || "—",
    address: s.address || "—",
    balance: Number(s.due ?? s.due_sum ?? 0),
  };
}

function AddSupplierModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState({ company: "", supplier: "", phone: "", address: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null;

  function update(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
  }

  async function submit() {
    if (!form.company.trim()) return;
    try {
      setSubmitting(true);
      setError(null);

      // Backend API call
      await onAdd({
        name: form.supplier || form.company,
        company: form.company,
        phone: form.phone || null,
        address: form.address || null,
      });

      setForm({ company: "", supplier: "", phone: "", address: "" });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add supplier");
    } finally {
      setSubmitting(false);
    }
  }

  const fields = [
    { key: "company", label: "Company Name", required: true, placeholder: "e.g. 7up" },
    { key: "supplier", label: "Supplier Name", placeholder: "e.g. kudus" },
    { key: "phone", label: "Phone", placeholder: "01XXXXXXXXX" },
    { key: "address", label: "Address", placeholder: "e.g. Mirpur, Dhaka" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(20,16,26,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl shadow-2xl"
        style={{ backgroundColor: COLORS.panel }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: COLORS.line }}
        >
          <h2 className="text-lg font-bold" style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}>
            Add New Supplier
          </h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full transition-colors"
            style={{ color: COLORS.muted }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="px-6 pt-4 text-xs font-semibold" style={{ color: COLORS.vermillion }}>
            {error}
          </div>
        )}

        <div className="space-y-4 px-6 py-5">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="mb-1 block text-sm font-semibold" style={{ color: COLORS.ink }}>
                {f.label}
                {f.required && <span style={{ color: COLORS.vermillion }}> *</span>}
              </label>
              <input
                value={form[f.key]}
                onChange={(e) => update(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none border-[1.5px]"
                style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper, color: COLORS.ink }}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: COLORS.line }}>
          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold border-[1.5px]"
            style={{ borderColor: COLORS.line, color: COLORS.muted }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={submitting}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md flex items-center gap-2"
            style={{ backgroundColor: COLORS.purple, boxShadow: `0 4px 10px ${COLORS.purple}40` }}
          >
            {submitting && <Loader2 className="animate-spin h-4 w-4" />}
            Add Supplier
          </button>
        </div>
      </div>
    </div>
  );
}

function SupplierLedger({ supplier, onBack }) {
  const [tab, setTab] = useState("Supplier Invoice");

  const rows = [
    { label: "Opening Balance", value: "0.00" },
    { label: "Total Purchase", value: "18,130.00" },
    { label: "Instant Paid", value: "2,130.00" },
    { label: "Due Payments", value: "5,000.00" },
    { label: "Total Return", value: "0.00" },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-sm font-semibold"
        style={{ color: COLORS.purple }}
      >
        <ChevronLeft className="h-4 w-4" />
        Back to suppliers
      </button>

      <div className="flex flex-col gap-5 lg:flex-row">
        {/* Balance sheet card */}
        <div
          className="relative flex-1 overflow-hidden rounded-2xl border"
          style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        >
          <ScallopBorder id="scallop-supplier-ledger" colors={PETALS} />
          <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: COLORS.line }}>
            <h1 className="text-xl font-bold" style={{ fontFamily: FONTS.HEAD, color: COLORS.muted }}>
              Supplier Ledger
            </h1>
            <button
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-md"
              style={{ backgroundColor: COLORS.purple, boxShadow: `0 4px 10px ${COLORS.purple}40` }}
            >
              Date Range
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="p-6">
            <table className="w-full overflow-hidden rounded-xl border-collapse text-sm">
              <thead>
                <tr>
                  <th
                    colSpan={2}
                    className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wide text-white"
                    style={{ backgroundColor: COLORS.plum }}
                  >
                    Balance Sheet
                  </th>
                </tr>
                <tr className="border-b" style={{ borderColor: COLORS.line }}>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
                    Info
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-b" style={{ borderColor: COLORS.line }}>
                    <td className="px-4 py-3 font-medium" style={{ color: COLORS.ink }}>
                      {r.label}
                    </td>
                    <td className="px-4 py-3 font-semibold" style={{ color: COLORS.ink }}>
                      {r.value}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-right font-bold" style={{ color: COLORS.ink }}>
                    Balance = {supplier.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* tabs */}
          <div className="flex gap-6 px-6 py-4 border-t" style={{ borderColor: COLORS.line }}>
            {["Supplier Invoice", "Supplier Payment", "Returned Product"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="text-sm font-semibold transition-colors"
                style={{ color: tab === t ? COLORS.purple : COLORS.muted }}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="px-6 pb-6 text-sm" style={{ color: COLORS.muted }}>
            {tab} details would appear here.
          </div>
        </div>

        {/* Supplier info card */}
        <div
          className="w-full overflow-hidden rounded-2xl border lg:w-72"
          style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        >
          <div
            className="flex items-center gap-2 px-5 py-4 text-sm font-bold uppercase tracking-wide text-white"
            style={{ backgroundColor: COLORS.plum }}
          >
            <User className="h-4 w-4" />
            Supplier Info
          </div>
          <div className="space-y-4 px-5 py-5">
            {[
              { icon: User, value: supplier.supplier, bold: true },
              { icon: Building2, value: supplier.company },
              { icon: Phone, value: supplier.phone },
              { icon: Mail, value: "—" },
              { icon: MapPin, value: supplier.address },
            ].map((row, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 text-sm ${row.bold ? "font-semibold" : ""}`}
                style={{ color: COLORS.ink }}
              >
                <row.icon className="h-4 w-4" style={{ color: COLORS.purple }} />
                {row.value}
              </div>
            ))}
            <div className="flex items-center gap-3 text-sm font-bold" style={{ color: COLORS.forestDark }}>
              <Wallet className="h-4 w-4" style={{ color: COLORS.purple }} />
              {supplier.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductSuppliers() {
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const [suppliers, setSuppliers] = useState([]);
  const [meta, setMeta] = useState({ total: 0, current_page: 1, last_page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState("list");
  const [activeSupplier, setActiveSupplier] = useState(null);

  // Fetch Suppliers from API
  const loadSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchSuppliers({
        search: search || undefined,
        per_page: perPage,
        page,
      });

      const items = res.data || (Array.isArray(res) ? res : []);
      setSuppliers(items.map(mapSupplierRow));

      setMeta({
        total: res.total ?? items.length,
        current_page: res.current_page ?? 1,
        last_page: res.last_page ?? 1,
      });
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setError(err.message || "Failed to load suppliers.");
    } finally {
      setLoading(false);
    }
  }, [search, perPage, page]);

  // Handle Search Debounce & Page resetting
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      loadSuppliers();
    }, 350);
    return () => clearTimeout(t);
  }, [search, perPage]);

  // Handle Page change
  useEffect(() => {
    loadSuppliers();
  }, [page]);

  const handleAddSupplier = async (newSupplierPayload) => {
    await createSupplier(newSupplierPayload);
    await loadSuppliers();
  };

  if (view === "ledger" && activeSupplier) {
    return (
      <div className="min-h-screen p-7" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY }}>
        <SupplierLedger supplier={activeSupplier} onBack={() => setView("list")} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-7" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY }}>
      <div
        className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
      >
        <ScallopBorder id="scallop-product-suppliers" colors={PETALS} />

        {/* header */}
        <div className="flex flex-wrap items-start justify-between gap-4 px-7 py-6 border-b" style={{ borderColor: COLORS.line }}>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}>
            Product Suppliers
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md"
              style={{ backgroundColor: COLORS.purple, boxShadow: `0 4px 10px ${COLORS.purple}40` }}
            >
              Add New Supplier
            </button>
            <button
              className="flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-semibold border-[1.5px]"
              style={{ borderColor: COLORS.line, color: COLORS.ink }}
            >
              Bulk Upload
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <div className="flex flex-col gap-2">
              <button className="rounded-xl px-4 py-1.5 text-xs font-semibold text-white" style={{ backgroundColor: COLORS.peacock }}>
                Download Demo CSV
              </button>
              <button className="rounded-xl px-4 py-1.5 text-xs font-semibold text-white" style={{ backgroundColor: COLORS.forestDark }}>
                Download Exist supplier
              </button>
            </div>
          </div>
        </div>

        {/* controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-7 pt-5">
          <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.muted }}>
            <span>Show</span>
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="rounded-lg px-2.5 py-1.5 text-sm border-[1.5px] outline-none"
              style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper, color: COLORS.ink }}
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: COLORS.muted }}>
              Search:
            </span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: COLORS.muted }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search suppliers..."
                className="w-64 rounded-xl py-2 pl-9 pr-3 text-sm border-[1.5px] outline-none"
                style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper, color: COLORS.ink }}
              />
            </div>
          </div>
        </div>

        {/* table */}
        <div className="mt-5 overflow-x-auto px-7 pb-4">
          <table className="w-full min-w-[1000px] border-collapse text-sm">
            <thead>
              <tr style={{ backgroundColor: COLORS.purpleTint }}>
                {["Company Name", "Supplier Name", "Code", "Phone", "Address", "Balance", "Action"].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide border-b-2"
                    style={{ color: COLORS.purple, borderColor: COLORS.line }}
                  >
                    <span className="flex items-center gap-1">
                      {h}
                      {h !== "Action" && <ArrowUpDown className="h-3 w-3 opacity-50" />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center" style={{ color: COLORS.muted }}>
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={18} />
                      Loading suppliers...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm" style={{ color: COLORS.vermillion }}>
                    {error}
                  </td>
                </tr>
              ) : suppliers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center" style={{ color: COLORS.muted }}>
                    No matching suppliers found.
                  </td>
                </tr>
              ) : (
                suppliers.map((s) => (
                  <tr key={s.id} className="border-b" style={{ borderColor: COLORS.line }}>
                    <td className="px-4 py-4 font-semibold" style={{ color: COLORS.ink }}>
                      {s.company}
                    </td>
                    <td className="px-4 py-4" style={{ color: COLORS.muted }}>
                      {s.supplier}
                    </td>
                    <td className="px-4 py-4" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>
                      {s.code}
                    </td>
                    <td className="px-4 py-4" style={{ color: COLORS.muted }}>
                      {s.phone}
                    </td>
                    <td className="px-4 py-4" style={{ color: COLORS.muted }}>
                      {s.address}
                    </td>
                    <td className="px-4 py-4 font-semibold" style={{ color: COLORS.ink }}>
                      {s.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          className="flex h-7 w-7 items-center justify-center rounded-full text-white"
                          style={{ backgroundColor: COLORS.forestDark }}
                          title="View"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          className="flex h-7 w-7 items-center justify-center rounded-full text-white"
                          style={{ backgroundColor: COLORS.peacock }}
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setActiveSupplier(s);
                            setView("ledger");
                          }}
                          className="rounded-full px-3 py-1 text-xs font-bold text-white"
                          style={{ backgroundColor: COLORS.marigold }}
                        >
                          Ledger
                        </button>
                        <button
                          className="mt-1 w-full rounded-lg px-3 py-1 text-xs font-bold"
                          style={{ backgroundColor: COLORS.purpleTint, color: COLORS.purple }}
                        >
                          Product Ledger
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 px-7 py-4 border-t text-sm"
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
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span
              className="w-8 h-8 rounded-md flex items-center justify-center font-semibold text-white"
              style={{ backgroundColor: COLORS.purple }}
            >
              {meta.current_page}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              disabled={meta.current_page >= meta.last_page || loading}
              className="w-8 h-8 rounded-md border flex items-center justify-center disabled:opacity-40"
              style={{ borderColor: COLORS.line, color: COLORS.ink }}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <AddSupplierModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddSupplier}
      />
    </div>
  );
}

export default ProductSuppliers;