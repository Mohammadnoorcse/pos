import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Printer,
  X,
  Building2,
  Phone,
  MapPin,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Undo2,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { COLORS, FONTS } from "../../constants";

// Import your API methods (adjust path to match your folder structure)
import { fetchSuppliers } from "../../api/supplier/supplierService";
import { fetchPurchases } from "../../api/supplier/purchaseService";
import { fetchSupplierPayments } from "../../api/supplier/supplierPaymentService";
import { fetchPurchaseReturns } from "../../api/supplier/purchaseReturnService";

const vermillionSoft = `${COLORS.vermillionSoft || COLORS.vermillion + "1A"}`;
const magentaSoft = COLORS.magentaSoft || `${COLORS.magenta}1A`;
const greenSoft = "#E7F6EC";
const green = "#1E9E5A";

const TYPE_META = {
  purchase: { label: "Purchase", color: COLORS.vermillion || "#C4442E", soft: vermillionSoft, Icon: ArrowDownCircle },
  payment: { label: "Payment", color: green, soft: greenSoft, Icon: ArrowUpCircle },
  return: { label: "Return", color: "#B8790A", soft: "#FFF4E0", Icon: Undo2 },
};

function calculateRunningBalance(entries) {
  // Sort chronologically ascending
  const sorted = [...entries].sort((a, b) => {
    const dateA = new Date(a.date || 0).getTime();
    const dateB = new Date(b.date || 0).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return a.id.localeCompare(b.id);
  });

  let balance = 0;
  return sorted.map((e) => {
    balance += (e.debit - e.credit);
    return { ...e, balance };
  });
}

function StatCard({ icon: Icon, label, value, color, soft }) {
  return (
    <div className="rounded-2xl border p-4" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
      <div className="flex items-center gap-2.5 mb-1.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: soft }}>
          <Icon size={14} style={{ color }} />
        </div>
        <div className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
          {label}
        </div>
      </div>
      <div className="text-[22px] font-bold" style={{ color, fontFamily: FONTS.MONO }}>
        {value}
      </div>
    </div>
  );
}

function SupplierPickerCard({ supplier, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-xl border px-3.5 py-3 transition-colors shrink-0 min-w-[190px]"
      style={{
        borderColor: active ? COLORS.vermillion : COLORS.line,
        backgroundColor: active ? vermillionSoft : COLORS.panel,
      }}
    >
      <div className="text-[13px] font-semibold" style={{ color: COLORS.ink }}>
        {supplier.name}
      </div>
      <div className="text-[11px] mt-0.5" style={{ color: COLORS.muted }}>
        {supplier.company_name || supplier.company || "—"}
      </div>
    </button>
  );
}

function LedgerDetailModal({ entry, supplier, onClose }) {
  if (!entry) return null;
  const meta = TYPE_META[entry.type];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(36,34,32,0.45)" }}
      onClick={onClose}
    >
      <div
        id="ledger-detail-print"
        className="w-full max-w-lg rounded-2xl border overflow-hidden shadow-xl"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b print:hidden" style={{ borderColor: COLORS.line }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: meta.soft }}>
              <meta.Icon size={16} style={{ color: meta.color }} />
            </div>
            <h2 className="text-[16px] font-bold" style={{ color: COLORS.ink }}>
              Ledger entry
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-black/5" style={{ color: COLORS.muted }}>
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="flex items-start justify-between pb-4 mb-4 border-b" style={{ borderColor: COLORS.line }}>
            <div>
              <div className="text-[20px] font-bold" style={{ color: COLORS.ink }}>{supplier?.name}</div>
              <div className="text-[12.5px] mt-0.5" style={{ color: COLORS.muted }}>{supplier?.company_name || supplier?.company}</div>
              <div className="text-[12px] mt-1.5" style={{ color: meta.color, fontFamily: FONTS.MONO }}>{entry.id}</div>
            </div>
            <div className="text-right">
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{ backgroundColor: meta.soft, color: meta.color }}
              >
                {meta.label}
              </span>
              <div className="text-[11px] mt-1.5" style={{ color: COLORS.muted }}>{entry.date}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Reference</div>
              <div className="text-[13px] font-semibold mt-0.5" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{entry.ref}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Note</div>
              <div className="text-[13px] font-semibold mt-0.5" style={{ color: COLORS.ink }}>{entry.note || "—"}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="rounded-xl p-4" style={{ backgroundColor: COLORS.paper }}>
              <div className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Debit</div>
              <div className="text-[18px] font-bold mt-0.5" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                {entry.debit ? entry.debit.toLocaleString() : "—"}
              </div>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: COLORS.paper }}>
              <div className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Credit</div>
              <div className="text-[18px] font-bold mt-0.5" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                {entry.credit ? entry.credit.toLocaleString() : "—"}
              </div>
            </div>
          </div>

          <div className="rounded-xl p-4 mt-3" style={{ backgroundColor: vermillionSoft }}>
            <div className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.ink }}>
              Running balance after this entry
            </div>
            <div className="text-[24px] font-bold mt-0.5" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>
              {entry.balance.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t print:hidden" style={{ borderColor: COLORS.line }}>
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-[13px] font-semibold border" style={{ borderColor: COLORS.line, color: COLORS.ink }}>
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold text-white"
            style={{ backgroundColor: COLORS.vermillion }}
          >
            <Printer size={14} />
            Print
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #ledger-detail-print, #ledger-detail-print * { visibility: visible; }
          #ledger-detail-print { position: fixed; inset: 0; margin: auto; box-shadow: none; }
        }
      `}</style>
    </div>
  );
}

export function SupplierLedgerPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [supplierId, setSupplierId] = useState(null);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [loadingLedger, setLoadingLedger] = useState(false);
  const [error, setError] = useState(null);

  const [rawEntries, setRawEntries] = useState([]);
  const [query, setQuery] = useState("");
  const [perPage, setPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // 1. Fetch Suppliers List
  const loadSuppliers = async () => {
    setLoadingSuppliers(true);
    setError(null);
    try {
      const response = await fetchSuppliers({ per_page: 100 });
      const supplierList = Array.isArray(response) ? response : response?.data || [];
      setSuppliers(supplierList);

      if (supplierList.length > 0) {
        setSupplierId(supplierList[0].id);
      }
    } catch (err) {
      setError(err.message || "Failed to load suppliers.");
    } finally {
      setLoadingSuppliers(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  // 2. Fetch Ledger Records whenever Selected Supplier Changes
  const loadLedgerData = async () => {
    if (!supplierId) return;
    setLoadingLedger(true);
    setError(null);

    try {
      const [purchasesRes, paymentsRes, returnsRes] = await Promise.all([
        fetchPurchases({ supplier_id: supplierId, per_page: 500 }),
        fetchSupplierPayments({ supplier_id: supplierId, per_page: 500 }),
        fetchPurchaseReturns({ supplier_id: supplierId, per_page: 500 }),
      ]);

      const purchases = purchasesRes?.data || (Array.isArray(purchasesRes) ? purchasesRes : []);
      const payments = paymentsRes?.data || (Array.isArray(paymentsRes) ? paymentsRes : []);
      const returns = returnsRes?.data || (Array.isArray(returnsRes) ? returnsRes : []);

      // Normalize into unified transactions
      const normalizedPurchases = purchases.map((p) => ({
        id: `PUR-${p.id}`,
        rawId: p.id,
        date: p.purchase_date || p.date || p.created_at?.split("T")[0] || "",
        type: "purchase",
        ref: p.reference_no || p.invoice_no || p.ref || `PUR-${p.id}`,
        note: p.note || p.remarks || "Purchase record",
        debit: Number(p.grand_total || p.total_amount || p.total || 0),
        credit: 0,
      }));

      const normalizedPayments = payments.map((p) => ({
        id: `PAY-${p.id}`,
        rawId: p.id,
        date: p.paid_date || p.payment_date || p.date || p.created_at?.split("T")[0] || "",
        type: "payment",
        ref: p.method || p.payment_method || p.reference_no || `PAY-${p.id}`,
        note: p.note || p.remarks || "Supplier payment",
        debit: 0,
        credit: Number(p.amount || 0),
      }));

      const normalizedReturns = returns.map((r) => ({
        id: `RTN-${r.id}`,
        rawId: r.id,
        date: r.return_date || r.date || r.created_at?.split("T")[0] || "",
        type: "return",
        ref: r.reference_no || r.ref || `RTN-${r.id}`,
        note: r.reason || r.note || "Product return",
        debit: 0,
        credit: Number(r.total_amount || r.amount || 0),
      }));

      setRawEntries([...normalizedPurchases, ...normalizedPayments, ...normalizedReturns]);
    } catch (err) {
      setError(err.message || "Failed to load ledger transactions.");
    } finally {
      setLoadingLedger(false);
    }
  };

  useEffect(() => {
    loadLedgerData();
    setCurrentPage(1);
  }, [supplierId]);

  const activeSupplier = suppliers.find((s) => s.id === supplierId);
  const processedEntries = useMemo(() => calculateRunningBalance(rawEntries), [rawEntries]);

  // Client-side Search Filtering
  const filtered = useMemo(() => {
    return processedEntries.filter((e) =>
      [e.id, e.ref, e.note, TYPE_META[e.type]?.label || ""]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [processedEntries, query]);

  // Summaries
  const totalPurchase = processedEntries.reduce((s, e) => s + (e.type === "purchase" ? e.debit : 0), 0);
  const totalPayment = processedEntries.reduce((s, e) => s + (e.type === "payment" ? e.credit : 0), 0);
  const totalReturn = processedEntries.reduce((s, e) => s + (e.type === "return" ? e.credit : 0), 0);
  const closingBalance = processedEntries.length ? processedEntries[processedEntries.length - 1].balance : 0;

  // Pagination Math
  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, currentPage, perPage]);

  if (loadingSuppliers) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[400px]" style={{ color: COLORS.muted }}>
        <Loader2 className="animate-spin mb-3" size={32} />
        <span className="text-[14px]">Loading suppliers...</span>
      </div>
    );
  }

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      {/* Error Banner */}
      {error && (
        <div className="mb-4 p-4 rounded-xl flex items-center justify-between border" style={{ backgroundColor: vermillionSoft, borderColor: COLORS.vermillion, color: COLORS.vermillion }}>
          <div className="flex items-center gap-2">
            <AlertCircle size={18} />
            <span className="text-[13px] font-semibold">{error}</span>
          </div>
          <button onClick={loadLedgerData} className="flex items-center gap-1.5 text-[12px] font-semibold underline">
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      )}

      {/* Supplier Picker */}
      <div className="flex items-center gap-2.5 mb-4 overflow-x-auto pb-1">
        {suppliers.map((s) => (
          <SupplierPickerCard key={s.id} supplier={s} active={s.id === supplierId} onClick={() => setSupplierId(s.id)} />
        ))}
        {suppliers.length === 0 && (
          <div className="text-[13px]" style={{ color: COLORS.muted }}>No suppliers found.</div>
        )}
      </div>

      {/* Supplier info strip */}
      {activeSupplier && (
        <div className="rounded-2xl border p-4 mb-4 flex flex-wrap items-center gap-x-6 gap-y-2" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
          <div className="flex items-center gap-2">
            <Building2 size={14} style={{ color: COLORS.muted }} />
            <span className="text-[13px] font-semibold" style={{ color: COLORS.ink }}>
              {activeSupplier.company_name || activeSupplier.company || activeSupplier.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} style={{ color: COLORS.muted }} />
            <span className="text-[13px]" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
              {activeSupplier.phone || activeSupplier.mobile || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} style={{ color: COLORS.muted }} />
            <span className="text-[13px]" style={{ color: COLORS.ink }}>
              {activeSupplier.address || "N/A"}
            </span>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <StatCard icon={ArrowDownCircle} label="Total purchase" value={totalPurchase.toLocaleString()} color={COLORS.vermillion} soft={vermillionSoft} />
        <StatCard icon={ArrowUpCircle} label="Total payment" value={totalPayment.toLocaleString()} color={green} soft={greenSoft} />
        <StatCard icon={Undo2} label="Total returns" value={totalReturn.toLocaleString()} color="#B8790A" soft="#FFF4E0" />
        <StatCard icon={Wallet} label="Closing balance" value={closingBalance.toLocaleString()} color={COLORS.ink} soft={magentaSoft} />
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
        {/* Header */}
        <div className="flex flex-col gap-4 px-6 py-5 border-b" style={{ borderColor: COLORS.line }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: vermillionSoft }}>
                <BookOpen size={16} style={{ color: COLORS.vermillion }} />
              </div>
              <div>
                <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>
                  Supplier Ledger
                </h1>
                <p className="text-[12px]" style={{ color: COLORS.muted }}>
                  Purchases, payments &amp; returns with running balance
                </p>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold text-white self-start sm:self-auto"
              style={{ backgroundColor: COLORS.vermillion }}
            >
              <Printer size={14} />
              Print ledger
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-[13px]" style={{ color: COLORS.muted }}>
              <span>Show</span>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-md px-2 py-1.5 border text-[13px] outline-none"
                style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.paper }}
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span>entries</span>
            </div>

            <div className="flex items-center gap-2 rounded-lg px-3 py-2 border flex-1 min-w-[200px]" style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper }}>
              <Search size={14} style={{ color: COLORS.muted }} />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search entry id / reference / note / type"
                className="bg-transparent outline-none text-[13px] w-full"
                style={{ color: COLORS.ink }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[250px] relative">
          {loadingLedger && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
              <Loader2 className="animate-spin" size={28} style={{ color: COLORS.vermillion }} />
            </div>
          )}

          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr>
                {["Date", "Entry id", "Type", "Reference", "Note", "Debit", "Credit", "Balance"].map((h) => (
                  <th key={h} className="text-left font-semibold text-[11px] uppercase tracking-wide px-5 py-3 text-white" style={{ backgroundColor: COLORS.vermillion }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedEntries.map((row) => {
                const meta = TYPE_META[row.type] || TYPE_META.purchase;
                return (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedEntry(row)}
                    className="border-b hover:bg-black/[0.02] transition-colors cursor-pointer"
                    style={{ borderColor: COLORS.line }}
                  >
                    <td className="px-5 py-3.5 align-top whitespace-nowrap" style={{ color: COLORS.ink, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                      {row.date}
                    </td>
                    <td className="px-5 py-3.5 align-top font-semibold" style={{ color: meta.color, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                      {row.id}
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                        style={{ backgroundColor: meta.soft, color: meta.color }}
                      >
                        <meta.Icon size={11} />
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 align-top" style={{ color: COLORS.ink, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                      {row.ref}
                    </td>
                    <td className="px-5 py-3.5 align-top max-w-[220px] truncate" style={{ color: COLORS.muted }}>
                      {row.note}
                    </td>
                    <td className="px-5 py-3.5 align-top font-semibold" style={{ color: row.debit ? COLORS.vermillion : COLORS.muted, fontFamily: FONTS.MONO }}>
                      {row.debit ? row.debit.toLocaleString() : "—"}
                    </td>
                    <td className="px-5 py-3.5 align-top font-semibold" style={{ color: row.credit ? green : COLORS.muted, fontFamily: FONTS.MONO }}>
                      {row.credit ? row.credit.toLocaleString() : "—"}
                    </td>
                    <td className="px-5 py-3.5 align-top font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                      {row.balance.toLocaleString()}
                    </td>
                  </tr>
                );
              })}

              {!loadingLedger && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-[13px]" style={{ color: COLORS.muted }}>
                    No ledger entries found for this supplier.
                  </td>
                </tr>
              )}
            </tbody>

            {filtered.length > 0 && (
              <tfoot>
                <tr style={{ backgroundColor: vermillionSoft }}>
                  <td colSpan={5} className="px-5 py-3 font-bold text-[12px] uppercase tracking-wide" style={{ color: COLORS.ink }}>Total</td>
                  <td className="px-5 py-3 font-bold" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>{totalPurchase.toLocaleString()}</td>
                  <td className="px-5 py-3 font-bold" style={{ color: green, fontFamily: FONTS.MONO }}>{(totalPayment + totalReturn).toLocaleString()}</td>
                  <td className="px-5 py-3 font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{closingBalance.toLocaleString()}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Footer / pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t text-[13px]" style={{ borderColor: COLORS.line, color: COLORS.muted }}>
          <span>
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, filtered.length)} of {filtered.length} entries
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-md border flex items-center justify-center disabled:opacity-40"
              style={{ borderColor: COLORS.line, color: COLORS.muted }}
            >
              <ChevronLeft size={14} />
            </button>
            <span className="w-8 h-8 rounded-md flex items-center justify-center font-semibold text-white" style={{ backgroundColor: COLORS.vermillion }}>
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="w-8 h-8 rounded-md border flex items-center justify-center disabled:opacity-40"
              style={{ borderColor: COLORS.line, color: COLORS.ink }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <LedgerDetailModal entry={selectedEntry} supplier={activeSupplier} onClose={() => setSelectedEntry(null)} />
    </div>
  );
}

export default SupplierLedgerPage;