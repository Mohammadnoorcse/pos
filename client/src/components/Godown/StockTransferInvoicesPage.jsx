import React from "react";
import {
  Receipt,
  Search,
  ChevronDown,
  Filter,
  Download,
  X,
  Truck,
  CheckCircle2,
  FilePenLine,
  Warehouse,
  ArrowRight,
  Printer,
  Send,
  ArrowLeft,
} from "lucide-react";

/* ---------------------------------------------------------------------
   Design tokens — kept in step with the sibling Stock Transfer / Godown
   / Current Stock pages (warm paper surface, vermillion primary accent,
   magenta secondary). This page inherits that house style rather than
   introducing a new one, since it lives in the same product.
--------------------------------------------------------------------- */
const COLORS = {
  paper: "#FAF8F4",
  panel: "#FFFFFF",
  ink: "#241C1A",
  muted: "#8A7F78",
  line: "#EAE3DC",
  vermillion: "#C1440E",
  magenta: "#9B2954",
};
const FONTS = {
  BODY: "'Inter', system-ui, sans-serif",
  MONO: "'JetBrains Mono', ui-monospace, monospace",
};

const vermillionSoft = `${COLORS.vermillion}1A`;
const magentaSoft = `${COLORS.magenta}1A`;
const greenSoft = "#E7F6EC";
const green = "#1E9E5A";
const grayaSoft = "#EFEBE7";
const graya = "#6B6058";
const blueSoft = "#E8EEFC";
const blue = "#2657C7";

const GODOWNS = [
  { id: "GDN-01", name: "Central Godown" },
  { id: "GDN-02", name: "Chattogram Warehouse" },
  { id: "GDN-03", name: "Bogura Storage Unit" },
  { id: "GDN-04", name: "Feni Sub-Godown" },
];

function godownName(id) {
  return GODOWNS.find((g) => g.id === id)?.name || id;
}

const STATUS_META = {
  draft: { label: "Draft", color: graya, soft: grayaSoft, icon: FilePenLine },
  issued: { label: "Issued", color: blue, soft: blueSoft, icon: Send },
  acknowledged: { label: "Acknowledged", color: green, soft: greenSoft, icon: CheckCircle2 },
};

const TODAY = "22-07-2026";

const INITIAL_INVOICES = [
  {
    id: "INV-3315",
    transferId: "TRF-1042",
    sku: "RCE-0091",
    name: "Miniket Rice 50kg",
    unit: "bag",
    qty: 60,
    rate: 3200,
    from: "GDN-01",
    to: "GDN-03",
    status: "draft",
    issuedOn: null,
    ackOn: null,
    preparedBy: "Rafiq Islam",
  },
  {
    id: "INV-3314",
    transferId: "TRF-1041",
    sku: "OIL-0142",
    name: "Soybean Oil 5L",
    unit: "ctn",
    qty: 20,
    rate: 5400,
    from: "GDN-01",
    to: "GDN-02",
    status: "issued",
    issuedOn: "21-07-2026",
    ackOn: null,
    preparedBy: "Nasrin Akter",
  },
  {
    id: "INV-3313",
    transferId: "TRF-1039",
    sku: "BEV-0018",
    name: "Mineral Water 1L",
    unit: "ctn",
    qty: 150,
    rate: 320,
    from: "GDN-02",
    to: "GDN-04",
    status: "issued",
    issuedOn: "21-07-2026",
    ackOn: null,
    preparedBy: "Shakil Ahmed",
  },
  {
    id: "INV-3312",
    transferId: "TRF-1035",
    sku: "SPC-0040",
    name: "Cumin Seed 100g",
    unit: "ctn",
    qty: 30,
    rate: 2200,
    from: "GDN-02",
    to: "GDN-01",
    status: "acknowledged",
    issuedOn: "19-07-2026",
    ackOn: "20-07-2026",
    preparedBy: "Rafiq Islam",
  },
  {
    id: "INV-3311",
    transferId: "TRF-1031",
    sku: "OIL-0150",
    name: "Mustard Oil 5L",
    unit: "ctn",
    qty: 40,
    rate: 5100,
    from: "GDN-04",
    to: "GDN-01",
    status: "acknowledged",
    issuedOn: "17-07-2026",
    ackOn: "18-07-2026",
    preparedBy: "Nasrin Akter",
  },
  {
    id: "INV-3310",
    transferId: "TRF-1028",
    sku: "PKG-0055",
    name: "Poly Bag Roll 12in",
    unit: "roll",
    qty: 10,
    rate: 450,
    from: "GDN-03",
    to: "GDN-02",
    status: "acknowledged",
    issuedOn: "15-07-2026",
    ackOn: "16-07-2026",
    preparedBy: "Shakil Ahmed",
  },
];

function taka(n) {
  return "৳" + n.toLocaleString("en-BD");
}

function StatCard({ icon: Icon, label, value, sub, color, soft }) {
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
      {sub && (
        <div className="text-[11.5px] mt-0.5" style={{ color: COLORS.muted }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function Select({ value, onChange, options, icon: Icon }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-lg px-3 py-2 border" style={{ borderColor: COLORS.line, backgroundColor: COLORS.panel }}>
        {Icon && <Icon size={13} style={{ color: COLORS.muted }} />}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent outline-none text-[12.5px] font-semibold appearance-none pr-5"
          style={{ color: COLORS.ink }}
        >
          {options.map((o) => (
            <option key={o.id || o} value={o.id || o}>
              {o.name || o}
            </option>
          ))}
        </select>
        <ChevronDown size={12} style={{ color: COLORS.muted, marginLeft: -18, pointerEvents: "none" }} />
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: meta.soft, color: meta.color }}
    >
      <Icon size={11} />
      {meta.label}
    </span>
  );
}

/* ---------------------------------------------------------------------
   Signature element: a slide-over challan preview.
   Bangladeshi wholesale/distribution houses issue a physical "চালান"
   (chalan) with every inter-godown movement — a perforated, two-part
   slip with a sender's and receiver's signature line. This drawer
   mirrors that paper artifact: dashed perforation edge, monospace
   ledger, twin signature lines, rather than a generic modal.
--------------------------------------------------------------------- */
function ChallanDrawer({ invoice, onClose, onIssue, onAcknowledge, onPrint }) {
  if (!invoice) return null;
  const total = invoice.qty * invoice.rate;
  const meta = STATUS_META[invoice.status];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ backgroundColor: "rgba(36,28,26,0.45)" }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-full w-full max-w-md flex flex-col animate-[slideIn_0.2s_ease-out]"
        style={{ backgroundColor: COLORS.panel, fontFamily: FONTS.BODY }}
      >
        {/* Perforated edge */}
        <div
          className="absolute top-0 bottom-0 left-0 w-px"
          style={{
            backgroundImage: `linear-gradient(${COLORS.line} 60%, transparent 0%)`,
            backgroundSize: "1px 10px",
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: COLORS.line }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: vermillionSoft }}>
              <Receipt size={15} style={{ color: COLORS.vermillion }} />
            </div>
            <div>
              <h2 className="text-[14.5px] font-bold" style={{ color: COLORS.ink }}>{invoice.id}</h2>
              <p className="text-[11px]" style={{ color: COLORS.muted }}>Transfer challan · {invoice.transferId}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5">
            <X size={15} style={{ color: COLORS.muted }} />
          </button>
        </div>

        {/* Body — styled like the paper slip */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="rounded-xl border p-4" style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10.5px] font-semibold uppercase tracking-wider" style={{ color: COLORS.muted }}>
                চালান নং
              </span>
              <span className="text-[13px] font-bold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{invoice.id}</span>
            </div>

            <div className="flex items-center gap-2 text-[12.5px] mb-4" style={{ color: COLORS.ink }}>
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: COLORS.muted }}>From</div>
                <div className="font-semibold">{godownName(invoice.from)}</div>
              </div>
              <ArrowRight size={14} style={{ color: COLORS.muted }} />
              <div className="flex-1 text-right">
                <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: COLORS.muted }}>To</div>
                <div className="font-semibold">{godownName(invoice.to)}</div>
              </div>
            </div>

            <div className="border-t border-dashed my-3" style={{ borderColor: COLORS.line }} />

            {/* Ledger */}
            <table className="w-full text-[12.5px]" style={{ fontFamily: FONTS.MONO }}>
              <thead>
                <tr style={{ color: COLORS.muted }}>
                  <th className="text-left font-medium pb-1.5 text-[10.5px] uppercase tracking-wide" style={{ fontFamily: FONTS.BODY }}>Item</th>
                  <th className="text-right font-medium pb-1.5 text-[10.5px] uppercase tracking-wide" style={{ fontFamily: FONTS.BODY }}>Qty</th>
                  <th className="text-right font-medium pb-1.5 text-[10.5px] uppercase tracking-wide" style={{ fontFamily: FONTS.BODY }}>Rate</th>
                  <th className="text-right font-medium pb-1.5 text-[10.5px] uppercase tracking-wide" style={{ fontFamily: FONTS.BODY }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ color: COLORS.ink }}>
                  <td className="py-1" style={{ fontFamily: FONTS.BODY }}>
                    {invoice.name}
                    <div className="text-[10.5px]" style={{ color: COLORS.muted }}>{invoice.sku}</div>
                  </td>
                  <td className="text-right py-1">{invoice.qty} {invoice.unit}</td>
                  <td className="text-right py-1">{taka(invoice.rate)}</td>
                  <td className="text-right py-1 font-semibold">{taka(total)}</td>
                </tr>
              </tbody>
            </table>

            <div className="border-t my-3" style={{ borderColor: COLORS.line }} />

            <div className="flex items-center justify-between">
              <span className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>Total</span>
              <span className="text-[16px] font-bold" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO }}>{taka(total)}</span>
            </div>

            <div className="border-t border-dashed my-4" style={{ borderColor: COLORS.line }} />

            {/* Twin signature lines */}
            <div className="flex items-end gap-4 mt-2">
              <div className="flex-1">
                <div className="border-b" style={{ borderColor: COLORS.ink, height: 28 }} />
                <div className="text-[10.5px] mt-1" style={{ color: COLORS.muted }}>প্রেরকের স্বাক্ষর · Sender</div>
              </div>
              <div className="flex-1">
                <div className="border-b" style={{ borderColor: COLORS.ink, height: 28 }} />
                <div className="text-[10.5px] mt-1" style={{ color: COLORS.muted }}>প্রাপকের স্বাক্ষর · Receiver</div>
              </div>
            </div>
          </div>

          {/* Status timeline */}
          <div className="mt-5 space-y-2.5">
            <div className="flex items-center justify-between text-[12px]">
              <span style={{ color: COLORS.muted }}>Prepared by</span>
              <span className="font-semibold" style={{ color: COLORS.ink }}>{invoice.preparedBy}</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span style={{ color: COLORS.muted }}>Issued</span>
              <span className="font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{invoice.issuedOn || "—"}</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span style={{ color: COLORS.muted }}>Acknowledged</span>
              <span className="font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>{invoice.ackOn || "—"}</span>
            </div>
            <div className="flex items-center justify-between text-[12px] pt-1">
              <span style={{ color: COLORS.muted }}>Status</span>
              <StatusPill status={invoice.status} />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t shrink-0" style={{ borderColor: COLORS.line }}>
          <button
            onClick={() => onPrint(invoice)}
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold border"
            style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.panel }}
          >
            <Printer size={13} />
            Print
          </button>
          {invoice.status === "draft" && (
            <button
              onClick={() => onIssue(invoice.id)}
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold text-white"
              style={{ backgroundColor: COLORS.vermillion }}
            >
              <Send size={13} />
              Issue challan
            </button>
          )}
          {invoice.status === "issued" && (
            <button
              onClick={() => onAcknowledge(invoice.id)}
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold text-white"
              style={{ backgroundColor: green }}
            >
              <CheckCircle2 size={13} />
              Mark acknowledged
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function StockTransferInvoicesPage({ onNavigate }) {
  const [invoices, setInvoices] = React.useState(INITIAL_INVOICES);
  const [query, setQuery] = React.useState("");
  const [godownFilter, setGodownFilter] = React.useState("ALL");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [active, setActive] = React.useState(null);
  const [toast, setToast] = React.useState("");

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const updateStatus = (id, patch, msg) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, ...patch } : inv)));
    setActive((prev) => (prev && prev.id === id ? { ...prev, ...patch } : prev));
    notify(msg);
  };

  const handleIssue = (id) => updateStatus(id, { status: "issued", issuedOn: TODAY }, `${id} issued — moving with the shipment`);
  const handleAcknowledge = (id) => updateStatus(id, { status: "acknowledged", ackOn: TODAY }, `${id} acknowledged by receiving godown`);
  const handlePrint = (invoice) => notify(`${invoice.id} sent to printer`);

  const filtered = invoices.filter((inv) => {
    const matchesQuery = [inv.id, inv.transferId, inv.sku, inv.name].join(" ").toLowerCase().includes(query.toLowerCase());
    const matchesGodown = godownFilter === "ALL" || inv.from === godownFilter || inv.to === godownFilter;
    const matchesStatus = statusFilter === "ALL" || inv.status === statusFilter;
    return matchesQuery && matchesGodown && matchesStatus;
  });

  const draftCount = invoices.filter((i) => i.status === "draft").length;
  const awaitingAck = invoices.filter((i) => i.status === "issued").length;
  const totalValue = invoices.reduce((s, i) => s + i.qty * i.rate, 0);
  const acknowledgedValue = invoices.filter((i) => i.status === "acknowledged").reduce((s, i) => s + i.qty * i.rate, 0);

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      <style>{`@keyframes slideIn { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: magentaSoft }}>
            <Receipt size={16} style={{ color: COLORS.magenta }} />
          </div>
          <div>
            <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>
              Stock Transfer Invoices
            </h1>
            <p className="text-[12px]" style={{ color: COLORS.muted }}>
              Challans issued for every inter-godown movement, from draft to acknowledgement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onNavigate && onNavigate("stock-transfer")}
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold border"
            style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.panel }}
          >
            <ArrowLeft size={13} />
            Transfers
          </button>
          <button
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold border"
            style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.panel }}
          >
            <Download size={13} />
            Export
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <StatCard icon={FilePenLine} label="Drafts" value={draftCount} sub={draftCount > 0 ? "Not yet issued" : "All issued"} color={graya} soft={grayaSoft} />
        <StatCard icon={Send} label="Awaiting ack." value={awaitingAck} sub="Issued, in transit" color={blue} soft={blueSoft} />
        <StatCard icon={CheckCircle2} label="Acknowledged value" value={taka(acknowledgedValue)} color={green} soft={greenSoft} />
        <StatCard icon={Receipt} label="Total value moved" value={taka(totalValue)} color={COLORS.vermillion} soft={vermillionSoft} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 border flex-1 min-w-[220px]" style={{ borderColor: COLORS.line, backgroundColor: COLORS.panel }}>
          <Search size={14} style={{ color: COLORS.muted }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search invoice no / transfer ID / item"
            className="bg-transparent outline-none text-[13px] w-full"
            style={{ color: COLORS.ink }}
          />
        </div>

        <Select value={godownFilter} onChange={setGodownFilter} icon={Warehouse} options={[{ id: "ALL", name: "Any godown" }, ...GODOWNS]} />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          icon={Filter}
          options={[
            { id: "ALL", name: "All statuses" },
            { id: "draft", name: "Draft" },
            { id: "issued", name: "Issued" },
            { id: "acknowledged", name: "Acknowledged" },
          ]}
        />
      </div>

      {/* Invoices table */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr>
                {["Invoice No", "Transfer", "Item", "Route", "Value", "Issued", "Status", ""].map((label) => (
                  <th key={label} className="text-left px-5 py-3 text-white" style={{ backgroundColor: COLORS.vermillion }}>
                    <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-b hover:bg-black/[0.02] transition-colors cursor-pointer"
                  style={{ borderColor: COLORS.line }}
                  onClick={() => setActive(inv)}
                >
                  <td className="px-5 py-3.5 font-semibold whitespace-nowrap" style={{ color: COLORS.vermillion, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                    {inv.id}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: COLORS.muted, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                    {inv.transferId}
                  </td>
                  <td className="px-5 py-3.5" style={{ color: COLORS.ink }}>
                    <div className="font-semibold">{inv.name}</div>
                    <div className="text-[11px]" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>{inv.qty} {inv.unit}</div>
                  </td>
                  <td className="px-5 py-3.5" style={{ color: COLORS.ink }}>
                    <div className="flex items-center gap-1.5 text-[12.5px] whitespace-nowrap">
                      <span>{godownName(inv.from)}</span>
                      <ArrowRight size={12} style={{ color: COLORS.muted }} />
                      <span>{godownName(inv.to)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-semibold whitespace-nowrap" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                    {taka(inv.qty * inv.rate)}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: COLORS.muted, fontFamily: FONTS.MONO, fontSize: 12.5 }}>
                    {inv.issuedOn || "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusPill status={inv.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); setActive(inv); }}
                      className="text-[11.5px] font-semibold whitespace-nowrap"
                      style={{ color: COLORS.magenta }}
                    >
                      View challan
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-[13px]" style={{ color: COLORS.muted }}>
                    No invoices match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-5 right-5 flex items-center gap-2 rounded-xl px-4 py-3 text-[12.5px] font-semibold text-white shadow-lg z-50"
          style={{ backgroundColor: COLORS.magenta }}
        >
          <Truck size={14} />
          {toast}
        </div>
      )}

      {/* Challan drawer */}
      <ChallanDrawer
        invoice={active}
        onClose={() => setActive(null)}
        onIssue={handleIssue}
        onAcknowledge={handleAcknowledge}
        onPrint={handlePrint}
      />
    </div>
  );
}

export default StockTransferInvoicesPage;