import React, { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { COLORS, PETALS, FONTS } from "../../../constants";

const invoices = [
  {
    date: "20-04-2025",
    customer: "Rahim",
    phone: "09112311111",
    invNum: "#S/230710646/949/261/597",
    createdBy: "SOHAG AHMED MOON",
    createdByPhone: "01676526444",
    createdAt: "20-04-2025 03:24:08 PM",
  },
  {
    date: "19-04-2025",
    customer: "Mizan Sanitary Home",
    phone: "01711212121",
    invNum: "#S/230710646/377/261/596",
    createdBy: "SOHAG AHMED MOON",
    createdByPhone: "01676526444",
    createdAt: "19-04-2025 12:03:06 PM",
  },
  {
    date: "19-04-2025",
    customer: "Walking Customer",
    phone: "p230710646",
    invNum: "#S/230710646/570/261/595",
    createdBy: "SOHAG AHMED MOON",
    createdByPhone: "01676526444",
    createdAt: "19-04-2025 11:41:28 AM",
  },
];

function ActionMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const items = ["POS", "Invoice", "Half Page", "Half Page V2"];

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
          className="absolute left-0 z-10 mt-1.5 w-40 overflow-hidden rounded-xl border py-1.5 shadow-[0_8px_24px_rgba(76,50,179,0.14)]"
          style={{
            backgroundColor: COLORS.panel,
            borderColor: COLORS.line,
          }}
        >
          {items.map((it) => (
            <button
              key={it}
              onClick={() => setOpen(false)}
              className="block w-full px-4 py-2 text-left text-sm font-medium transition-colors hover:bg-opacity-50"
              style={{
                color: COLORS.ink,
                backgroundColor: "transparent",
              }}
            >
              {it}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function SoldInvoices() {
  const [invNumber, setInvNumber] = useState("");
  const [nameOrPhone, setNameOrPhone] = useState("");
  const [dateType, setDateType] = useState("");
  const [page, setPage] = useState(1);

  const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div style={{ backgroundColor: COLORS.page, minHeight: "100vh" }} className="p-7 font-sans">
      <div className="mx-auto mb-6 h-1.5 max-w-6xl rounded-full bg-gradient-to-r from-pink-500 via-orange-400 via-teal-500 to-violet-600" />

      <div
        className="mx-auto max-w-6xl overflow-hidden rounded-2xl border relative"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
      >
        <ScallopBorder id="scallop-invoices-header" colors={PETALS} />

        {/* header */}
        <div className="border-b px-7 py-6" style={{ borderColor: COLORS.line }}>
          <h1
            className="mb-5 text-2xl font-bold tracking-tight"
            style={{ color: COLORS.accent, fontFamily: FONTS.HEAD }}
          >
            Sold Invoices
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <input
              value={invNumber}
              onChange={(e) => setInvNumber(e.target.value)}
              placeholder="Invoice Number [without #]"
              className="min-w-[220px] flex-1 rounded-xl border-[1.5px] px-3.5 py-2.5 text-sm outline-none"
              style={{
                borderColor: COLORS.line,
                backgroundColor: COLORS.paper,
                color: COLORS.ink,
                fontFamily: FONTS.BODY,
              }}
            />
            <input
              value={nameOrPhone}
              onChange={(e) => setNameOrPhone(e.target.value)}
              placeholder="Name or Phone Number"
              className="min-w-[220px] flex-1 rounded-xl border-[1.5px] px-3.5 py-2.5 text-sm outline-none"
              style={{
                borderColor: COLORS.line,
                backgroundColor: COLORS.paper,
                color: COLORS.ink,
                fontFamily: FONTS.BODY,
              }}
            />
            <select
              value={dateType}
              onChange={(e) => setDateType(e.target.value)}
              className="min-w-[200px] rounded-xl border-[1.5px] px-3.5 py-2.5 text-sm outline-none"
              style={{
                borderColor: COLORS.line,
                backgroundColor: COLORS.paper,
                color: COLORS.ink,
                fontFamily: FONTS.BODY,
              }}
            >
              <option value="">Select Date Type</option>
              <option>Created Date</option>
              <option>Invoice Date</option>
            </select>
            <button
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: COLORS.teal }}
            >
              <Search className="h-4 w-4" />
              Search
            </button>
            <button
              onClick={() => {
                setInvNumber("");
                setNameOrPhone("");
                setDateType("");
              }}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: COLORS.rust }}
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>

        {/* table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr style={{ backgroundColor: COLORS.ink }}>
                {["Date", "Customer Info", "Others Info", "Action"].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-white"
                    style={{ fontFamily: FONTS.HEAD }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => (
                <tr
                  key={i}
                  className="border-b transition-colors"
                  style={{
                    borderColor: COLORS.line,
                    backgroundColor: i % 2 === 1 ? COLORS.paper + "20" : "transparent",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.paper + "40")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = i % 2 === 1 ? COLORS.paper + "20" : "transparent")}
                >
                  <td className="px-4 py-4 align-top font-medium" style={{ color: COLORS.muted }}>
                    {inv.date}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.HEAD }}>
                      {inv.customer}
                    </div>
                    <div className="text-xs" style={{ color: COLORS.muted }}>
                      [{inv.phone}]
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top text-xs leading-relaxed">
                    <div style={{ color: COLORS.muted }}>
                      Inv Num: <span className="font-semibold" style={{ color: COLORS.accent }}>
                        {inv.invNum}
                      </span>
                    </div>
                    <div style={{ color: COLORS.muted }}>
                      Created By:{" "}
                      <span className="font-semibold" style={{ color: COLORS.ink }}>
                        {inv.createdBy} ({inv.createdByPhone})
                      </span>
                    </div>
                    <div style={{ color: COLORS.muted }}>
                      Created at: <span className="font-semibold" style={{ color: COLORS.teal }}>
                        {inv.createdAt}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <ActionMenu />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* footer / pagination */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-7 py-6">
          <p className="text-sm" style={{ color: COLORS.muted }}>
            Showing 1 to 30 of 625 entries
          </p>

          <div className="flex items-center gap-1.5">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg border-[1.5px] transition-colors hover:bg-opacity-50 disabled:opacity-40"
              style={{
                borderColor: COLORS.line,
                color: COLORS.muted,
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {pages.map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`h-8 w-8 rounded-lg text-sm font-semibold transition-colors`}
                style={{
                  borderBottom: page === n ? `2px solid ${COLORS.forest}` : "none",
                  color: page === n ? COLORS.forest : COLORS.muted,
                }}
              >
                {n}
              </button>
            ))}
            <span style={{ color: COLORS.line }}>...</span>
            <button
              onClick={() => setPage(20)}
              className={`h-8 min-w-8 rounded-lg px-1.5 text-sm font-semibold transition-colors`}
              style={{
                borderBottom: page === 20 ? `2px solid ${COLORS.forest}` : "none",
                color: page === 20 ? COLORS.forest : COLORS.muted,
              }}
            >
              20
            </button>
            <button
              onClick={() => setPage(21)}
              className={`h-8 min-w-8 rounded-lg px-1.5 text-sm font-semibold transition-colors`}
              style={{
                borderBottom: page === 21 ? `2px solid ${COLORS.forest}` : "none",
                color: page === 21 ? COLORS.forest : COLORS.muted,
              }}
            >
              21
            </button>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg border-[1.5px] transition-colors hover:bg-opacity-50"
              style={{
                borderColor: COLORS.line,
                color: COLORS.muted,
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}