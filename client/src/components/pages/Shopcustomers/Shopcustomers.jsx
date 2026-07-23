import React, { useState, useRef, useEffect } from "react";
import {
  Printer,
  ChevronDown,
  User,
  Phone,
  Mail,
  MapPin,
  Wallet,
  ChevronLeft,
} from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { COLORS, PETALS, FONTS } from "../../../constants";

const customers = [
  {
    name: "Mizan Sanitary Home",
    code: "C230710646S30904",
    phone: "01711212121",
    address: "",
    branch: "",
    type: "",
    balance: 700.0,
  },
];

function ActionMenu({ onLedger }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const items = [
    { label: "Active", style: `bg-teal-500 text-white hover:bg-teal-600` },
    { label: "Edit", style: `text-slate-700 hover:bg-opacity-50`, bg: COLORS.paper },
    { label: "Ledger", style: `text-slate-700 hover:bg-opacity-50`, bg: COLORS.paper, action: onLedger },
    { label: "Sold Product Ledger", tag: "New", style: `text-slate-700 hover:bg-opacity-50`, bg: COLORS.paper },
    { label: "Take Payment", style: `text-slate-700 hover:bg-opacity-50`, bg: COLORS.paper },
  ];

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
        style={{ backgroundColor: COLORS.forest }}
      >
        Action
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div
          className="absolute right-0 z-10 mt-1.5 w-56 overflow-hidden rounded-xl border py-1.5 shadow-[0_8px_24px_rgba(76,50,179,0.14)]"
          style={{
            backgroundColor: COLORS.panel,
            borderColor: COLORS.line,
          }}
        >
          {items.map((it) => (
            <button
              key={it.label}
              onClick={() => {
                setOpen(false);
                it.action && it.action();
              }}
              className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm font-medium transition-colors`}
              style={{
                color: COLORS.ink,
              }}
            >
              <span>{it.label}</span>
              {it.tag && <span className="text-xs font-semibold" style={{ color: COLORS.rust }}>({it.tag})</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CustomerLedger({ customer, onBack }) {
  const [tab, setTab] = useState("Invoice");

  const rows = [
    { label: "Opening Balance", value: "0.00", tone: "plain" },
    { label: "Total Sell", value: "20,510.00", tone: "green" },
    { label: "Instant Paid", value: "18,550.00", tone: "red" },
    { label: "Total Receive", value: "760.00", tone: "red" },
    {
      label: "Total Return",
      value: "3,000.00",
      tone: "red",
      note: "Cash Return To Customer: 2,500.00",
    },
    { label: "Balance Adjustment Amount", value: "0.00", tone: "red" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-sm font-semibold hover:opacity-80"
        style={{ color: COLORS.accent, fontFamily: FONTS.HEAD }}
      >
        <ChevronLeft className="h-4 w-4" />
        Back to customers
      </button>

      <div className="flex flex-col gap-5 lg:flex-row">
        {/* Balance sheet card */}
        <div
          className="flex-1 overflow-hidden rounded-2xl border relative"
          style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        >
          <ScallopBorder id="scallop-ledger-balance" colors={PETALS} />

          <div className="flex items-center justify-between border-b px-6 py-5" style={{ borderColor: COLORS.line }}>
            <h1 className="text-xl font-bold" style={{ color: COLORS.muted, fontFamily: FONTS.HEAD }}>
              Customer Ledger
            </h1>
            <button
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              style={{ backgroundColor: COLORS.forest }}
            >
              Date Range
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="p-6">
            <table className="w-full overflow-hidden rounded-xl border-collapse text-sm">
              <thead>
                <tr style={{ backgroundColor: COLORS.ink }}>
                  <th
                    colSpan={2}
                    className="px-4 py-3 text-center text-sm font-bold tracking-wide text-white"
                  >
                    Balance Sheet
                  </th>
                </tr>
                <tr className="border-b" style={{ borderColor: COLORS.line }}>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{ color: COLORS.muted }}
                  >
                    Info
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{ color: COLORS.muted }}
                  >
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
                    <td className="p-0">
                      <div
                        className={`px-4 py-3 font-semibold`}
                        style={{
                          backgroundColor:
                            r.tone === "green"
                              ? COLORS.teal
                              : r.tone === "red"
                              ? COLORS.rust
                              : "transparent",
                          color:
                            r.tone === "green" || r.tone === "red"
                              ? "white"
                              : COLORS.ink,
                        }}
                      >
                        {r.value}
                        {r.note && (
                          <div
                            className="mt-1.5 inline-block rounded px-2 py-1 text-xs font-bold text-white"
                            style={{ backgroundColor: COLORS.teal }}
                          >
                            {r.note}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td
                    className="px-4 py-3 font-bold"
                    colSpan={2}
                    style={{ color: COLORS.ink }}
                  >
                    Calculated Balance = {customer.balance.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* tabs */}
          <div className="flex gap-6 border-t px-6 py-4" style={{ borderColor: COLORS.line }}>
            {["Invoice", "Payment", "Returned Product"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-sm font-semibold transition-colors`}
                style={{
                  color: tab === t ? COLORS.accent : COLORS.muted,
                  fontFamily: FONTS.HEAD,
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="px-6 pb-6 text-sm" style={{ color: COLORS.muted }}>
            {tab} details would appear here.
          </div>
        </div>

        {/* Customer info card */}
        <div
          className="w-full overflow-hidden rounded-2xl border lg:w-72 relative"
          style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        >
          <ScallopBorder id="scallop-customer-info" colors={PETALS} />

          <div
            className="flex items-center gap-2 px-5 py-4 text-sm font-bold uppercase tracking-wide text-white"
            style={{ backgroundColor: COLORS.ink }}
          >
            <User className="h-4 w-4" />
            Customer Info
          </div>
          <div className="space-y-4 px-5 py-5">
            <div className="flex items-center gap-3 text-sm font-semibold" style={{ color: COLORS.ink }}>
              <User className="h-4 w-4" style={{ color: COLORS.accent }} />
              {customer.name}
            </div>
            <div className="flex items-center gap-3 text-sm" style={{ color: COLORS.muted }}>
              <Phone className="h-4 w-4" style={{ color: COLORS.accent }} />
              {customer.phone}
            </div>
            <div className="flex items-center gap-3 text-sm" style={{ color: COLORS.muted }}>
              <Mail className="h-4 w-4" style={{ color: COLORS.accent }} />
              —
            </div>
            <div className="flex items-center gap-3 text-sm" style={{ color: COLORS.muted }}>
              <MapPin className="h-4 w-4" style={{ color: COLORS.accent }} />
              —
            </div>
            <div className="flex items-center gap-3 text-sm font-bold" style={{ color: COLORS.teal }}>
              <Wallet className="h-4 w-4" style={{ color: COLORS.accent }} />
              {customer.balance.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShopCustomers() {
  const [view, setView] = useState("list");
  const [search, setSearch] = useState("mizan");

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: COLORS.page, minHeight: "100vh" }} className="p-7 font-sans">
      <div className="mx-auto mb-6 h-1.5 max-w-6xl rounded-full bg-gradient-to-r from-pink-500 via-orange-400 via-teal-500 to-violet-600" />

      {view === "ledger" ? (
        <CustomerLedger customer={filtered[0] || customers[0]} onBack={() => setView("list")} />
      ) : (
        <div
          className="mx-auto max-w-6xl overflow-hidden rounded-2xl border relative"
          style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        >
          <ScallopBorder id="scallop-customers-header" colors={PETALS} />

          {/* header */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b px-7 py-6" style={{ borderColor: COLORS.line }}>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: COLORS.accent, fontFamily: FONTS.HEAD }}
            >
              Shop Customers
            </h1>

            <div className="flex items-end gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-semibold"
                  style={{ color: COLORS.accent, fontFamily: FONTS.HEAD }}
                >
                  Customer Type
                </label>
                <select
                  className="min-w-[200px] rounded-xl border-[1.5px] px-3.5 py-2.5 text-sm outline-none"
                  style={{
                    borderColor: COLORS.line,
                    backgroundColor: COLORS.paper,
                    color: COLORS.ink,
                    fontFamily: FONTS.BODY,
                  }}
                >
                  <option>Select Customer Type</option>
                </select>
              </div>
              <button
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: COLORS.teal }}
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
            </div>
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
              </select>
              <span>entries</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium" style={{ color: COLORS.muted }}>
                Search:
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-56 rounded-xl border-[1.5px] px-3.5 py-2 text-sm outline-none"
                style={{
                  borderColor: COLORS.line,
                  backgroundColor: COLORS.paper,
                  color: COLORS.ink,
                  fontFamily: FONTS.BODY,
                }}
              />
            </div>
          </div>

          {/* table */}
          <div className="mt-5 overflow-x-auto px-7 pb-7">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead>
                <tr style={{ backgroundColor: COLORS.paper }}>
                  {["Customer", "Code", "Phone", "Address", "Branch", "Type", "Action"].map((h, i) => (
                    <th
                      key={h}
                      className={`whitespace-nowrap border-b-2 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide ${
                        i === 0 ? "rounded-tl-xl" : ""
                      } ${i === 6 ? "rounded-tr-xl" : ""}`}
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
                {filtered.map((c) => (
                  <tr
                    key={c.code}
                    className="border-b transition-colors"
                    style={{ borderColor: COLORS.line }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.paper + "40")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td className="px-4 py-4 font-semibold" style={{ color: COLORS.ink }}>
                      {c.name}
                    </td>
                    <td className="px-4 py-4" style={{ color: COLORS.muted }}>
                      {c.code}
                    </td>
                    <td className="px-4 py-4" style={{ color: COLORS.muted }}>
                      {c.phone}
                    </td>
                    <td className="px-4 py-4" style={{ color: COLORS.muted }}>
                      {c.address || "—"}
                    </td>
                    <td className="px-4 py-4" style={{ color: COLORS.muted }}>
                      {c.branch || "—"}
                    </td>
                    <td className="px-4 py-4" style={{ color: COLORS.muted }}>
                      {c.type || "—"}
                    </td>
                    <td className="px-4 py-4">
                      <ActionMenu onLedger={() => setView("ledger")} />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center" style={{ color: COLORS.muted }}>
                      No matching customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}