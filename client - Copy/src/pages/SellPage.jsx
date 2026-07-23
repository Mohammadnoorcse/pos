import React from "react";
import {
  Footprints,
  UserSearch,
  UserPlus,
  RefreshCw,
  PanelLeftClose,
  Save,
  Search,
  Barcode,
  ShoppingBag,
  Plus,
  Minus,
  X,
  PauseCircle,
  Trash2,
  Wallet,
  CreditCard,
  Layers,
  Phone,
  MapPin,
  Mail,
  Coins,
  CircleUserRound,
  ArrowRight,
  Percent,
  Tag,
  FileText,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

/* Same "Rickshaw-art ledger" palette used across the app */
const C = {
  paper: "#FFF8ED",
  panel: "#FFFFFF",
  line: "#F0E3C9",
  ink: "#2B2320",
  muted: "#8C7B6B",

  plum: "#3A1930",
  plumLight: "#63294B",

  magenta: "#C23B6D",
  magentaTint: "#FBE7EE",

  marigold: "#E0A030",
  marigoldTint: "#FCF0D8",

  peacock: "#1E7F86",
  peacockTint: "#E1F0EF",

  forest: "#1F7A4D",
  forestTint: "#E3F3E9",
  forestDark: "#166138",

  vermillion: "#C1442E",
  vermillionTint: "#FBE6E1",

  rust: "#A6602E",
  rustTint: "#F6EADC",

  purple: "#6B3FA0",
  purpleTint: "#EFE6F7",
};

const FONT_HEAD = "'Baloo Da 2', 'Hind Siliguri', sans-serif";
const FONT_BODY = "'Hind Siliguri', 'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";
const FONT_IMPORT_ID = "pos-sell-fonts";

function useGoogleFonts() {
  React.useEffect(() => {
    if (document.getElementById(FONT_IMPORT_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_IMPORT_ID;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@600;700;800&family=Hind+Siliguri:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

const SCROLLBAR_STYLE_ID = "pos-sell-scrollbar-style";

function useScrollbarStyle() {
  React.useEffect(() => {
    if (document.getElementById(SCROLLBAR_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = SCROLLBAR_STYLE_ID;
    style.textContent = `
      .pos-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
      .pos-scroll::-webkit-scrollbar-track { background: ${C.paper}; border-radius: 8px; }
      .pos-scroll::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, ${C.magenta}, ${C.marigold});
        border-radius: 8px;
        border: 2px solid ${C.paper};
      }
      .pos-scroll::-webkit-scrollbar-thumb:hover { background: ${C.plum}; }
      .pos-scroll { scrollbar-width: thin; scrollbar-color: ${C.magenta} ${C.paper}; }
    `;
    document.head.appendChild(style);
  }, []);
}

const PRINT_STYLE_ID = "pos-sell-print-style";

function usePrintStyle() {
  React.useEffect(() => {
    if (document.getElementById(PRINT_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = PRINT_STYLE_ID;
    style.textContent = `
      #print-memo { display: none; }
      @media print {
        @page { margin: 8mm; }
        body * { visibility: hidden; }
        #print-memo, #print-memo * { visibility: visible; }
        #print-memo {
          display: block !important;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
        }
      }
    `;
    document.head.appendChild(style);
  }, []);
}

const petals = [C.magenta, C.marigold, C.peacock];

function ScallopBorder({ id }) {
  return (
    <svg className="absolute top-0 left-0 right-0" width="100%" height="7" preserveAspectRatio="none" viewBox="0 0 30 7">
      <defs>
        <pattern id={id} width="30" height="7" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="0" r="4.2" fill={petals[0]} />
          <circle cx="15" cy="0" r="4.2" fill={petals[1]} />
          <circle cx="25" cy="0" r="4.2" fill={petals[2]} />
        </pattern>
      </defs>
      <rect width="30" height="7" fill={`url(#${id})`} />
    </svg>
  );
}

const categories = ["সব", "Grocery", "Cosmetics", "Footwear", "Oil & Ghee", "Stationery"];

const products = [
  { name: "Fresh Facial Tissue", price: 301, img: "🧻", stock: 18 },
  { name: "Ghee 800gm", price: 350, img: "🫙", stock: 9 },
  { name: "Mens Shoes 102 (30)", price: 1500, img: "👞", stock: 3, low: true },
  { name: "Akher Chini (Sugar) 50gm", price: 2450, img: "🧂", stock: 22 },
  { name: "Starship Fortified Soyabean Oil", price: 500, img: "🛢️", stock: 14 },
  { name: "Matador Sharpener", price: 10, img: "✏️", stock: 40 },
  { name: "Baby Shampoo 200ml", price: 220, img: "🧴", stock: 6, low: true },
  { name: "Notebook 200pg", price: 60, img: "📓", stock: 30 },
];

const cartItems = [
  { name: "Ghee 800gm", unit: 350, qty: 2 },
  { name: "Mens Shoes 102 (30)", unit: 1500, qty: 1 },
];

const customers = [
  { name: "Rafiq Hasan", phone: "01711-223344", area: "Mirpur-2", due: 1850 },
  { name: "Nadia Akter", phone: "01812-445566", area: "Uttara", due: 0 },
  { name: "Shakil Islam", phone: "01919-778899", area: "Mirpur-2", due: 5400 },
  { name: "Mahin Jaman", phone: "01611-990011", area: "Dhanmondi", due: 900 },
  { name: "Tania Rahman", phone: "01511-334455", area: "Banani", due: 0 },
];

function useClock() {
  const [time, setTime] = React.useState(new Date());
  React.useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

function Stepper({ value }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        className="w-6 h-6 rounded-md flex items-center justify-center border"
        style={{ borderColor: C.line, color: C.muted }}
      >
        <Minus size={12} />
      </button>
      <span className="w-6 text-center text-[13px] font-bold" style={{ fontFamily: FONT_MONO }}>
        {value}
      </span>
      <button
        className="w-6 h-6 rounded-md flex items-center justify-center text-white"
        style={{ backgroundColor: C.magenta }}
      >
        <Plus size={12} />
      </button>
    </div>
  );
}

function ProductCard({ p, i }) {
  return (
    <div
      className="relative rounded-xl border overflow-hidden cursor-pointer group"
      style={{ backgroundColor: C.panel, borderColor: C.line }}
    >
      <ScallopBorder id={`p-scallop-${i}`} />
      {p.low && (
        <span
          className="absolute top-2.5 right-2.5 text-[9.5px] font-bold px-2 py-0.5 rounded-full z-10"
          style={{ backgroundColor: C.vermillionTint, color: C.vermillion }}
        >
          {p.stock} left
        </span>
      )}
      <div
        className="h-20 flex items-center justify-center text-3xl mt-1"
        style={{ backgroundColor: C.paper }}
      >
        {p.img}
      </div>
      <div className="p-2.5">
        <div className="text-[12.5px] font-semibold leading-snug line-clamp-2 min-h-[32px]">{p.name}</div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[13px] font-bold" style={{ color: C.magenta, fontFamily: FONT_MONO }}>
            ৳{p.price}
          </span>
          {!p.low && (
            <span className="text-[10px]" style={{ color: C.muted }}>
              {p.stock} pcs
            </span>
          )}
        </div>
      </div>
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2.5"
        style={{ background: "linear-gradient(180deg, rgba(58,25,48,0) 50%, rgba(58,25,48,0.06) 100%)" }}
      >
        <span
          className="text-[11px] font-bold text-white px-3 py-1.5 rounded-full flex items-center gap-1"
          style={{ backgroundColor: C.plum }}
        >
          <Plus size={11} /> Add
        </span>
      </div>
    </div>
  );
}

/* Responsive modal shell — full-width sheet on mobile,
   centered card on larger screens. Scallop signature on top. */
function Modal({ title, subtitle, onClose, children, wide }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: "rgba(43,35,32,0.45)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        className={`relative w-full ${wide ? "sm:max-w-lg" : "sm:max-w-md"} max-h-[92vh] sm:max-h-[85vh] overflow-hidden rounded-t-2xl sm:rounded-2xl border flex flex-col`}
        style={{ backgroundColor: C.panel, borderColor: C.line }}
        onClick={(e) => e.stopPropagation()}
      >
        <ScallopBorder id={`modal-scallop-${title}`} />
        <div className="flex items-start justify-between px-5 pt-6 pb-3 shrink-0">
          <div>
            <h2 className="text-[16.5px] font-bold" style={{ fontFamily: FONT_HEAD, color: C.plum }}>
              {title}
            </h2>
            {subtitle && (
              <p className="text-[12px] mt-0.5" style={{ color: C.muted }}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: C.paper, color: C.muted }}
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-5 pb-5 overflow-y-auto pos-scroll">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, placeholder, type = "text", full, value, onChange }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="text-[11.5px] font-semibold mb-1 block" style={{ color: C.muted }}>
        {label}
      </label>
      <div
        className="flex items-center gap-2 rounded-lg border px-3 py-2.5"
        style={{ borderColor: C.line, backgroundColor: C.paper }}
      >
        {Icon && <Icon size={14} style={{ color: C.muted }} />}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 text-[13px] outline-none bg-transparent"
          style={{ color: C.ink }}
        />
      </div>
    </div>
  );
}

function NewCustomerModal({ onClose }) {
  return (
    <Modal title="New Customer" subtitle="নতুন কাস্টমারের তথ্য যোগ করুন" onClose={onClose} wide>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Field label="Customer Name *" icon={CircleUserRound} placeholder="যেমন: Rafiq Hasan" />
        <Field label="Phone Number *" icon={Phone} placeholder="01XXX-XXXXXX" />
        <Field label="Email" icon={Mail} placeholder="optional" type="email" />
        <Field label="Opening Due (৳)" icon={Coins} placeholder="0" type="number" />
        <Field label="Address" icon={MapPin} placeholder="বাসা, রোড, এলাকা" full />
      </div>

      <div className="flex gap-2.5 mt-5">
        <button
          onClick={onClose}
          className="flex-1 text-[13px] font-semibold py-2.5 rounded-lg border"
          style={{ borderColor: C.line, color: C.muted }}
        >
          বাতিল
        </button>
        <button
          onClick={onClose}
          className="flex-1 flex items-center justify-center gap-1.5 text-[13px] font-bold py-2.5 rounded-lg text-white"
          style={{ backgroundColor: C.magenta }}
        >
          Save Customer <ArrowRight size={14} />
        </button>
      </div>
    </Modal>
  );
}

function CustomerListModal({ onClose, onSelect }) {
  const [q, setQ] = React.useState("");
  const filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.phone.includes(q)
  );

  return (
    <Modal title="Select Customer" subtitle="নাম বা ফোন নম্বর দিয়ে খুঁজুন" onClose={onClose}>
      <div
        className="flex items-center gap-2 rounded-lg border px-3 py-2.5 mb-3 sticky top-0"
        style={{ borderColor: C.line, backgroundColor: C.paper }}
      >
        <Search size={14} style={{ color: C.muted }} />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="নাম বা ফোন নম্বর"
          className="flex-1 text-[13px] outline-none bg-transparent"
          style={{ color: C.ink }}
        />
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center text-[12.5px] py-8" style={{ color: C.muted }}>
            কোনো কাস্টমার পাওয়া যায়নি
          </div>
        )}
        {filtered.map((c) => (
          <button
            key={c.phone}
            onClick={() => onSelect && onSelect(c)}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-colors hover:bg-opacity-60"
            style={{ borderColor: C.line, backgroundColor: C.paper }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-[13px] font-bold shrink-0"
              style={{ backgroundColor: C.purpleTint, color: C.purple }}
            >
              {c.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold truncate">{c.name}</div>
              <div className="text-[11.5px] flex items-center gap-1" style={{ color: C.muted }}>
                <Phone size={10} /> {c.phone} · {c.area}
              </div>
            </div>
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0"
              style={
                c.due > 0
                  ? { backgroundColor: C.vermillionTint, color: C.vermillion }
                  : { backgroundColor: C.forestTint, color: C.forestDark }
              }
            >
              {c.due > 0 ? `Due ৳${c.due}` : "Clear"}
            </span>
          </button>
        ))}
      </div>
    </Modal>
  );
}

/* ---------- Discount Modal ---------- */
function DiscountModal({ onClose, onApply, subtotal, current }) {
  const [type, setType] = React.useState(current?.type || "flat"); // "flat" | "percent"
  const [amount, setAmount] = React.useState(current?.amount ? String(current.amount) : "");

  const num = parseFloat(amount) || 0;
  const computed = type === "percent" ? Math.round((subtotal * num) / 100) : Math.round(num);
  const capped = Math.min(computed, subtotal);

  return (
    <Modal title="Add Discount" subtitle="ডিসকাউন্ট টাইপ ও পরিমাণ দিন" onClose={onClose}>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setType("flat")}
          className="flex-1 flex items-center justify-center gap-1.5 text-[12.5px] font-bold py-2.5 rounded-lg border"
          style={
            type === "flat"
              ? { backgroundColor: C.magenta, borderColor: C.magenta, color: "#fff" }
              : { borderColor: C.line, color: C.muted }
          }
        >
          <Tag size={14} /> Flat (৳)
        </button>
        <button
          onClick={() => setType("percent")}
          className="flex-1 flex items-center justify-center gap-1.5 text-[12.5px] font-bold py-2.5 rounded-lg border"
          style={
            type === "percent"
              ? { backgroundColor: C.magenta, borderColor: C.magenta, color: "#fff" }
              : { borderColor: C.line, color: C.muted }
          }
        >
          <Percent size={14} /> Percent (%)
        </button>
      </div>

      <Field
        label={type === "percent" ? "Discount (%)" : "Discount Amount (৳)"}
        icon={type === "percent" ? Percent : Tag}
        placeholder={type === "percent" ? "যেমন: 10" : "যেমন: 100"}
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <div
        className="flex items-center justify-between rounded-lg px-3 py-2.5 mt-3.5"
        style={{ backgroundColor: C.marigoldTint }}
      >
        <span className="text-[12.5px] font-semibold" style={{ color: C.rust }}>
          Discount Value
        </span>
        <span className="text-[14px] font-bold" style={{ color: C.rust, fontFamily: FONT_MONO }}>
          ৳{capped.toLocaleString()}
        </span>
      </div>

      <div className="flex gap-2.5 mt-5">
        <button
          onClick={onClose}
          className="flex-1 text-[13px] font-semibold py-2.5 rounded-lg border"
          style={{ borderColor: C.line, color: C.muted }}
        >
          বাতিল
        </button>
        <button
          onClick={() => {
            onApply({ type, amount: num });
            onClose();
          }}
          className="flex-1 flex items-center justify-center gap-1.5 text-[13px] font-bold py-2.5 rounded-lg text-white"
          style={{ backgroundColor: C.magenta }}
        >
          Apply Discount <ArrowRight size={14} />
        </button>
      </div>
    </Modal>
  );
}

/* ---------- Others Modal (extra charges) ---------- */
function OthersModal({ onClose, onApply, current }) {
  const [label, setLabel] = React.useState(current?.label || "");
  const [amount, setAmount] = React.useState(current?.amount ? String(current.amount) : "");

  const num = parseFloat(amount) || 0;

  return (
    <Modal title="Add Others" subtitle="অতিরিক্ত চার্জ (ডেলিভারি, প্যাকিং ইত্যাদি)" onClose={onClose}>
      <div className="flex flex-col gap-3.5">
        <Field
          label="Charge Label"
          icon={FileText}
          placeholder="যেমন: Delivery Charge"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <Field
          label="Amount (৳)"
          icon={Coins}
          placeholder="যেমন: 50"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="flex gap-2.5 mt-5">
        <button
          onClick={onClose}
          className="flex-1 text-[13px] font-semibold py-2.5 rounded-lg border"
          style={{ borderColor: C.line, color: C.muted }}
        >
          বাতিল
        </button>
        <button
          onClick={() => {
            onApply({ label: label || "Others", amount: num });
            onClose();
          }}
          className="flex-1 flex items-center justify-center gap-1.5 text-[13px] font-bold py-2.5 rounded-lg text-white"
          style={{ backgroundColor: C.magenta }}
        >
          Apply <ArrowRight size={14} />
        </button>
      </div>
    </Modal>
  );
}

/* ---------- Printable Memo (receipt) ---------- */
function PrintMemo({ invoiceNo, time, customer, items, subtotal, discount, discountValue, others, othersValue, returnValue, preDue, payable }) {
  const accent = "#C23B6D";
  const dark = "#3A1930";

  return (
    <div
      id="print-memo"
      style={{
        fontFamily: "'Hind Siliguri', 'Inter', sans-serif",
        color: "#2B2320",
        padding: "10px",
        fontSize: "12.5px",
        maxWidth: "420px",
        margin: "0 auto",
      }}
    >
      {/* HEADER — company info */}
      <div style={{ textAlign: "center", paddingBottom: 10 }}>
        <div style={{ fontSize: 21, fontWeight: 800, color: dark, letterSpacing: "0.3px" }}>
          Spire Technology Ltd
        </div>
        <div style={{ fontSize: 11.5, color: "#5B4E4A", marginTop: 3 }}>
          mohammadnoorcse@gmail.com &nbsp;·&nbsp; 01622226788
        </div>
      </div>

      <div style={{ height: 3, background: `linear-gradient(90deg, ${accent}, #E0A030, #1E7F86)`, borderRadius: 3 }} />

      <div style={{ textAlign: "center", padding: "8px 0", borderBottom: "1px dashed #C9B79A" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: dark, letterSpacing: "1.5px", textTransform: "uppercase" }}>
          Sales Memo
        </div>
      </div>

      {/* MEMO META */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "8px 0", color: "#5B4E4A" }}>
        <span>Memo No: <b style={{ color: "#2B2320" }}>{invoiceNo}</b></span>
        <span>{time.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} &nbsp;{time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
      </div>

      {/* CLIENT INFO — middle, boxed */}
      <div
        style={{
          border: "1px solid #E8D9BE",
          borderRadius: 8,
          padding: "10px 12px",
          margin: "6px 0 12px",
          backgroundColor: "#FCF6EA",
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 700, color: accent, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>
          Bill To
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: dark }}>
          {customer ? customer.name : "Walking Customer"}
        </div>
        <div style={{ fontSize: 11, color: "#5B4E4A", marginTop: 2 }}>
          Address: {customer ? customer.area : "N/A"}
        </div>
        <div style={{ fontSize: 11, color: "#5B4E4A" }}>
          Phone: {customer ? customer.phone : "N/A"}
        </div>
      </div>

      {/* ITEMS TABLE */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
        <thead>
          <tr style={{ borderTop: `1.5px solid ${dark}`, borderBottom: `1.5px solid ${dark}` }}>
            <th style={{ textAlign: "left", padding: "5px 2px", color: dark }}>Item</th>
            <th style={{ textAlign: "center", padding: "5px 2px", color: dark }}>Qty</th>
            <th style={{ textAlign: "right", padding: "5px 2px", color: dark }}>Rate</th>
            <th style={{ textAlign: "right", padding: "5px 2px", color: dark }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={it.name} style={{ borderBottom: i === items.length - 1 ? "none" : "1px dotted #E8D9BE" }}>
              <td style={{ padding: "5px 2px" }}>{it.name}</td>
              <td style={{ textAlign: "center", padding: "5px 2px" }}>{it.qty}</td>
              <td style={{ textAlign: "right", padding: "5px 2px" }}>{it.unit}</td>
              <td style={{ textAlign: "right", padding: "5px 2px", fontWeight: 600 }}>{(it.unit * it.qty).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTALS */}
      <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1.5px solid ${dark}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
          <span>Total Gross</span>
          <span>৳{subtotal.toLocaleString()}</span>
        </div>
        {discount && discountValue > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
            <span>Discount {discount.type === "percent" ? `(${discount.amount}%)` : ""}</span>
            <span>- ৳{discountValue.toLocaleString()}</span>
          </div>
        )}
        {others && othersValue > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
            <span>{others.label}</span>
            <span>৳{othersValue.toLocaleString()}</span>
          </div>
        )}
        {returnValue > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
            <span>Product Return</span>
            <span>- ৳{returnValue.toLocaleString()}</span>
          </div>
        )}
        {preDue > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
            <span>Pre Due</span>
            <span>৳{preDue.toLocaleString()}</span>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 6,
            padding: "8px 10px",
            backgroundColor: dark,
            color: "#fff",
            borderRadius: 6,
            fontWeight: 800,
            fontSize: 15,
          }}
        >
          <span>Total Payable</span>
          <span>৳{payable.toLocaleString()}</span>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: "center", marginTop: 16, paddingTop: 10, borderTop: "1px dashed #C9B79A" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: dark }}>ধন্যবাদ, আবার আসবেন!</div>
        <div style={{ fontSize: 10.5, color: "#8C7B6B", marginTop: 2 }}>Thank you for shopping with Spire Technology Ltd</div>
      </div>
    </div>
  );
}

const bankMethods = ["bKash", "Nagad", "Rocket", "Upay", "Bank Transfer", "Debit/Credit Card"];

/* ---------- Multiple Pay Modal (split Cash + Bank/MFS) ---------- */
function MultiplePayModal({ onClose, onApply, payable, current, onConfirmed }) {
  const [cash, setCash] = React.useState(current?.cash ? String(current.cash) : "");
  const [bank, setBank] = React.useState(current?.bank ? String(current.bank) : "");
  const [bankMethod, setBankMethod] = React.useState(current?.bankMethod || bankMethods[0]);

  const cashNum = parseFloat(cash) || 0;
  const bankNum = parseFloat(bank) || 0;
  const totalPaid = cashNum + bankNum;
  const remaining = payable - totalPaid;

  return (
    <Modal title="Multiple Pay" subtitle="ক্যাশ ও ব্যাংক/MFS মিলিয়ে পেমেন্ট করুন" onClose={onClose}>
      <div
        className="flex items-center justify-between rounded-lg px-3 py-2.5 mb-3.5"
        style={{ backgroundColor: C.peacockTint }}
      >
        <span className="text-[12.5px] font-semibold" style={{ color: C.peacock }}>
          Total Payable
        </span>
        <span className="text-[15px] font-bold" style={{ color: C.peacock, fontFamily: FONT_MONO }}>
          ৳{payable.toLocaleString()}
        </span>
      </div>

      <div className="flex flex-col gap-3.5">
        <div>
          <label className="text-[11.5px] font-semibold mb-1 flex items-center gap-1.5" style={{ color: C.muted }}>
            <Wallet size={13} style={{ color: C.magenta }} /> Cash Amount (৳)
          </label>
          <div
            className="flex items-center gap-2 rounded-lg border px-3 py-2.5"
            style={{ borderColor: C.line, backgroundColor: C.paper }}
          >
            <input
              type="number"
              placeholder="0"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              className="flex-1 text-[13px] outline-none bg-transparent"
              style={{ color: C.ink }}
            />
          </div>
        </div>

        <div>
          <label className="text-[11.5px] font-semibold mb-1 flex items-center gap-1.5" style={{ color: C.muted }}>
            <CreditCard size={13} style={{ color: C.plum }} /> Bank / MFS Amount (৳)
          </label>
          <div className="flex gap-2">
            <div
              className="flex items-center gap-2 rounded-lg border px-3 py-2.5 flex-1"
              style={{ borderColor: C.line, backgroundColor: C.paper }}
            >
              <input
                type="number"
                placeholder="0"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="flex-1 text-[13px] outline-none bg-transparent"
                style={{ color: C.ink }}
              />
            </div>
            <select
              value={bankMethod}
              onChange={(e) => setBankMethod(e.target.value)}
              className="text-[12.5px] font-semibold rounded-lg border px-2.5 py-2"
              style={{ borderColor: C.line, backgroundColor: C.paper, color: C.ink, maxWidth: 132 }}
            >
              {bankMethods.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="h-px my-3.5" style={{ backgroundColor: C.line }} />

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[12.5px] font-semibold">
          <span style={{ color: C.muted }}>Total Paid</span>
          <span style={{ fontFamily: FONT_MONO }}>৳{totalPaid.toLocaleString()}</span>
        </div>
        <div
          className="flex items-center justify-between text-[13px] font-bold px-3 py-2 rounded-lg"
          style={
            remaining > 0
              ? { backgroundColor: C.vermillionTint, color: C.vermillion }
              : remaining < 0
              ? { backgroundColor: C.marigoldTint, color: C.rust }
              : { backgroundColor: C.forestTint, color: C.forestDark }
          }
        >
          <span>{remaining > 0 ? "Due Remaining" : remaining < 0 ? "Change / Extra" : "Fully Paid"}</span>
          <span style={{ fontFamily: FONT_MONO }}>৳{Math.abs(remaining).toLocaleString()}</span>
        </div>
      </div>

      <div className="flex gap-2.5 mt-5">
        <button
          onClick={onClose}
          className="flex-1 text-[13px] font-semibold py-2.5 rounded-lg border"
          style={{ borderColor: C.line, color: C.muted }}
        >
          বাতিল
        </button>
        <button
          onClick={() => {
            onApply({ cash: cashNum, bank: bankNum, bankMethod });
            onClose();
            onConfirmed && onConfirmed();
          }}
          className="flex-1 flex items-center justify-center gap-1.5 text-[13px] font-bold py-2.5 rounded-lg text-white"
          style={{ backgroundColor: C.magenta }}
        >
          Confirm Payment <ArrowRight size={14} />
        </button>
      </div>
    </Modal>
  );
}

/* ---------- Cash Pay Modal ---------- */
function CashPayModal({ onClose, onApply, payable, current, onConfirmed }) {
  const [received, setReceived] = React.useState(current?.received ? String(current.received) : "");

  const num = parseFloat(received) || 0;
  const change = num - payable;

  const quickAmounts = [payable, 500, 1000, 2000];

  return (
    <Modal title="Cash Payment" subtitle="গ্রাহকের কাছ থেকে ক্যাশ গ্রহণ করুন" onClose={onClose}>
      <div
        className="flex items-center justify-between rounded-lg px-3 py-2.5 mb-3.5"
        style={{ backgroundColor: C.magentaTint }}
      >
        <span className="text-[12.5px] font-semibold" style={{ color: C.magenta }}>
          Total Payable
        </span>
        <span className="text-[15px] font-bold" style={{ color: C.magenta, fontFamily: FONT_MONO }}>
          ৳{payable.toLocaleString()}
        </span>
      </div>

      <label className="text-[11.5px] font-semibold mb-1 flex items-center gap-1.5" style={{ color: C.muted }}>
        <Wallet size={13} style={{ color: C.magenta }} /> Received Amount (৳)
      </label>
      <div
        className="flex items-center gap-2 rounded-lg border px-3 py-2.5"
        style={{ borderColor: C.line, backgroundColor: C.paper }}
      >
        <input
          autoFocus
          type="number"
          placeholder="0"
          value={received}
          onChange={(e) => setReceived(e.target.value)}
          className="flex-1 text-[15px] font-bold outline-none bg-transparent"
          style={{ color: C.ink, fontFamily: FONT_MONO }}
        />
      </div>

      <div className="flex gap-1.5 mt-2.5 flex-wrap">
        {quickAmounts.map((a, i) => (
          <button
            key={i}
            onClick={() => setReceived(String(a))}
            className="text-[11.5px] font-bold px-3 py-1.5 rounded-full border"
            style={{ borderColor: C.magenta, color: C.magenta }}
          >
            ৳{a.toLocaleString()}
          </button>
        ))}
      </div>

      <div
        className="flex items-center justify-between mt-4 rounded-lg px-3 py-2.5 text-[13px] font-bold"
        style={
          change > 0
            ? { backgroundColor: C.forestTint, color: C.forestDark }
            : change < 0
            ? { backgroundColor: C.vermillionTint, color: C.vermillion }
            : { backgroundColor: C.line, color: C.ink }
        }
      >
        <span>{change > 0 ? "Change to Return" : change < 0 ? "Amount Short" : "Exact Amount"}</span>
        <span style={{ fontFamily: FONT_MONO }}>৳{Math.abs(change).toLocaleString()}</span>
      </div>

      <div className="flex gap-2.5 mt-5">
        <button
          onClick={onClose}
          className="flex-1 text-[13px] font-semibold py-2.5 rounded-lg border"
          style={{ borderColor: C.line, color: C.muted }}
        >
          বাতিল
        </button>
        <button
          onClick={() => {
            onApply({ received: num, change: Math.max(change, 0) });
            onClose();
            onConfirmed && onConfirmed();
          }}
          className="flex-1 flex items-center justify-center gap-1.5 text-[13px] font-bold py-2.5 rounded-lg text-white"
          style={{ backgroundColor: C.magenta }}
        >
          Confirm Cash <ArrowRight size={14} />
        </button>
      </div>
    </Modal>
  );
}

/* ---------- Card / MFS Pay Modal ---------- */
function CardPayModal({ onClose, onApply, payable, current, onConfirmed }) {
  const [method, setMethod] = React.useState(current?.method || bankMethods[0]);
  const [refNo, setRefNo] = React.useState(current?.refNo || "");

  return (
    <Modal title="MFS / Card Payment" subtitle="পেমেন্ট মাধ্যম বেছে নিন" onClose={onClose}>
      <div
        className="flex items-center justify-between rounded-lg px-3 py-2.5 mb-3.5"
        style={{ backgroundColor: C.plumLight, color: "#fff" }}
      >
        <span className="text-[12.5px] font-semibold">Total Payable</span>
        <span className="text-[15px] font-bold" style={{ fontFamily: FONT_MONO }}>
          ৳{payable.toLocaleString()}
        </span>
      </div>

      <label className="text-[11.5px] font-semibold mb-1 block" style={{ color: C.muted }}>
        Payment Method
      </label>
      <div className="grid grid-cols-3 gap-2 mb-3.5">
        {bankMethods.map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className="text-[11.5px] font-bold py-2.5 rounded-lg border text-center"
            style={
              method === m
                ? { backgroundColor: C.plum, borderColor: C.plum, color: "#fff" }
                : { borderColor: C.line, color: C.muted }
            }
          >
            {m}
          </button>
        ))}
      </div>

      <Field
        label="Transaction / Reference No (optional)"
        icon={CreditCard}
        placeholder="যেমন: TXN123456"
        value={refNo}
        onChange={(e) => setRefNo(e.target.value)}
      />

      <div className="flex gap-2.5 mt-5">
        <button
          onClick={onClose}
          className="flex-1 text-[13px] font-semibold py-2.5 rounded-lg border"
          style={{ borderColor: C.line, color: C.muted }}
        >
          বাতিল
        </button>
        <button
          onClick={() => {
            onApply({ method, refNo, amount: payable });
            onClose();
            onConfirmed && onConfirmed();
          }}
          className="flex-1 flex items-center justify-center gap-1.5 text-[13px] font-bold py-2.5 rounded-lg text-white"
          style={{ backgroundColor: C.plum }}
        >
          Confirm Payment <ArrowRight size={14} />
        </button>
      </div>
    </Modal>
  );
}

/* ---------- Sale Confirmation Modal (full details + print) ---------- */
function SaleConfirmationModal({ onClose, onPrint, customer, items, subtotal, discount, discountValue, others, othersValue, returnItems, returnValue, preDue, payable, cashPay, cardPay, multiPay }) {
  return (
    <Modal title="Sale Confirmed" subtitle="বিক্রয়ের সম্পূর্ণ বিবরণ" onClose={onClose} wide>
      <div
        className="flex items-center gap-2 rounded-lg px-3 py-2.5 mb-4"
        style={{ backgroundColor: C.forestTint, color: C.forestDark }}
      >
        <span
          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0"
          style={{ backgroundColor: C.forest }}
        >
          ✓
        </span>
        <span className="text-[13px] font-bold">Sale completed successfully</span>
      </div>

      {/* Customer */}
      <div className="rounded-lg border px-3 py-2.5 mb-3" style={{ borderColor: C.line, backgroundColor: C.paper }}>
        <div className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: C.muted }}>
          Customer
        </div>
        <div className="text-[13px] font-bold">{customer ? customer.name : "Walking Customer"}</div>
        {customer && (
          <div className="text-[11.5px]" style={{ color: C.muted }}>
            {customer.phone} · {customer.area}
          </div>
        )}
      </div>

      {/* Items */}
      <div className="rounded-lg border overflow-hidden mb-3" style={{ borderColor: C.line }}>
        <div
          className="grid grid-cols-[1fr_50px_70px] text-[10.5px] font-bold text-white px-3 py-2"
          style={{ backgroundColor: C.plum }}
        >
          <div>Item</div>
          <div className="text-center">Qty</div>
          <div className="text-right">Amount</div>
        </div>
        {items.map((it, i) => (
          <div
            key={it.name}
            className="grid grid-cols-[1fr_50px_70px] px-3 py-2 text-[12px]"
            style={i !== items.length - 1 ? { borderBottom: `1px solid ${C.line}` } : undefined}
          >
            <div className="font-semibold">{it.name}</div>
            <div className="text-center">{it.qty}</div>
            <div className="text-right font-bold" style={{ fontFamily: FONT_MONO }}>
              ৳{(it.unit * it.qty).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Returned Items */}
      {returnItems && returnItems.length > 0 && (
        <div className="rounded-lg border overflow-hidden mb-3" style={{ borderColor: C.vermillion }}>
          <div
            className="flex items-center gap-1.5 text-[10.5px] font-bold text-white px-3 py-2"
            style={{ backgroundColor: C.vermillion }}
          >
            <RotateCcw size={12} /> Returned Items
          </div>
          {returnItems.map((it, i) => (
            <div
              key={it.name}
              className="grid grid-cols-[1fr_50px_70px] px-3 py-2 text-[12px]"
              style={{ backgroundColor: C.vermillionTint, borderBottom: i !== returnItems.length - 1 ? "1px solid #fff" : undefined }}
            >
              <div className="font-semibold" style={{ color: C.vermillion }}>{it.name}</div>
              <div className="text-center" style={{ color: C.vermillion }}>{it.qty}</div>
              <div className="text-right font-bold" style={{ color: C.vermillion, fontFamily: FONT_MONO }}>
                - ৳{(it.unit * it.qty).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Totals */}
      <div className="rounded-lg border px-3 py-2.5 mb-3" style={{ borderColor: C.line, backgroundColor: C.paper }}>
        <Row label="Total Gross" value={`৳${subtotal.toLocaleString()}`} />
        {discount && discountValue > 0 && (
          <Row label={`Discount ${discount.type === "percent" ? `(${discount.amount}%)` : ""}`} value={`- ৳${discountValue.toLocaleString()}`} />
        )}
        {others && othersValue > 0 && <Row label={others.label} value={`৳${othersValue.toLocaleString()}`} />}
        {returnValue > 0 && <Row label="Product Return" value={`- ৳${returnValue.toLocaleString()}`} />}
        {preDue > 0 && <Row label="Pre Due" value={`৳${preDue.toLocaleString()}`} />}
        <div className="h-px my-1.5" style={{ backgroundColor: C.line }} />
        <Row label="Total Payable" value={`৳${payable.toLocaleString()}`} bold />
      </div>

      {/* Payment method */}
      <div className="rounded-lg px-3 py-2.5 mb-1" style={{ backgroundColor: C.magentaTint }}>
        <div className="text-[10px] font-bold uppercase tracking-wide mb-1.5" style={{ color: C.magenta }}>
          Payment Details
        </div>
        {cashPay && (
          <div className="flex items-center justify-between text-[12.5px] font-semibold" style={{ color: C.ink }}>
            <span className="flex items-center gap-1.5">
              <Wallet size={13} /> Cash Received
            </span>
            <span style={{ fontFamily: FONT_MONO }}>৳{cashPay.received.toLocaleString()}</span>
          </div>
        )}
        {cashPay && cashPay.change > 0 && (
          <div className="flex items-center justify-between text-[11.5px] mt-1" style={{ color: C.muted }}>
            <span>Change Returned</span>
            <span style={{ fontFamily: FONT_MONO }}>৳{cashPay.change.toLocaleString()}</span>
          </div>
        )}
        {cardPay && (
          <div className="flex items-center justify-between text-[12.5px] font-semibold" style={{ color: C.ink }}>
            <span className="flex items-center gap-1.5">
              <CreditCard size={13} /> {cardPay.method}
            </span>
            <span style={{ fontFamily: FONT_MONO }}>৳{cardPay.amount.toLocaleString()}</span>
          </div>
        )}
        {cardPay && cardPay.refNo && (
          <div className="flex items-center justify-between text-[11.5px] mt-1" style={{ color: C.muted }}>
            <span>Reference No</span>
            <span style={{ fontFamily: FONT_MONO }}>{cardPay.refNo}</span>
          </div>
        )}
        {multiPay && (multiPay.cash > 0 || multiPay.bank > 0) && (
          <>
            <div className="flex items-center justify-between text-[12.5px] font-semibold" style={{ color: C.ink }}>
              <span className="flex items-center gap-1.5">
                <Wallet size={13} /> Cash
              </span>
              <span style={{ fontFamily: FONT_MONO }}>৳{multiPay.cash.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-[12.5px] font-semibold mt-1" style={{ color: C.ink }}>
              <span className="flex items-center gap-1.5">
                <CreditCard size={13} /> {multiPay.bankMethod}
              </span>
              <span style={{ fontFamily: FONT_MONO }}>৳{multiPay.bank.toLocaleString()}</span>
            </div>
          </>
        )}
        {!cashPay && !cardPay && !multiPay && (
          <div className="text-[12px]" style={{ color: C.muted }}>
            No payment method recorded yet
          </div>
        )}
      </div>

      <div className="flex gap-2.5 mt-5">
        <button
          onClick={onClose}
          className="flex-1 text-[13px] font-semibold py-2.5 rounded-lg border"
          style={{ borderColor: C.line, color: C.muted }}
        >
          Close
        </button>
        <button
          onClick={onPrint}
          className="flex-1 flex items-center justify-center gap-1.5 text-[13px] font-bold py-2.5 rounded-lg text-white"
          style={{ backgroundColor: C.magenta }}
        >
          <Save size={14} /> Print Memo
        </button>
      </div>
    </Modal>
  );
}

/* ---------- Return Modal (select products & qty to return) ---------- */
function ReturnModal({ onClose, onApply, cartItems, current }) {
  const [qtys, setQtys] = React.useState(() => {
    const init = {};
    cartItems.forEach((it) => {
      const existing = current?.find((r) => r.name === it.name);
      init[it.name] = existing ? existing.qty : 0;
    });
    return init;
  });

  const setQty = (name, max, delta) => {
    setQtys((prev) => {
      const next = Math.max(0, Math.min(max, (prev[name] || 0) + delta));
      return { ...prev, [name]: next };
    });
  };

  const selected = cartItems
    .map((it) => ({ ...it, returnQty: qtys[it.name] || 0 }))
    .filter((it) => it.returnQty > 0);

  const returnTotal = selected.reduce((s, it) => s + it.unit * it.returnQty, 0);

  return (
    <Modal title="Return Products" subtitle="কোন পণ্য কত পরিমাণ ফেরত নিচ্ছেন বেছে নিন" onClose={onClose} wide>
      <div className="rounded-lg border overflow-hidden mb-3.5" style={{ borderColor: C.line }}>
        <div
          className="grid grid-cols-[1fr_120px_90px] text-[10.5px] font-bold text-white px-3 py-2"
          style={{ backgroundColor: C.vermillion }}
        >
          <div>Product</div>
          <div className="text-center">Return Qty</div>
          <div className="text-right">Amount</div>
        </div>
        {cartItems.length === 0 && (
          <div className="text-center text-[12.5px] py-8" style={{ color: C.muted }}>
            কার্টে কোনো পণ্য নেই
          </div>
        )}
        {cartItems.map((it, i) => {
          const q = qtys[it.name] || 0;
          return (
            <div
              key={it.name}
              className="grid grid-cols-[1fr_120px_90px] items-center px-3 py-2.5"
              style={i !== cartItems.length - 1 ? { borderBottom: `1px solid ${C.line}` } : undefined}
            >
              <div>
                <div className="text-[12.5px] font-semibold">{it.name}</div>
                <div className="text-[10.5px]" style={{ color: C.muted, fontFamily: FONT_MONO }}>
                  ৳{it.unit} × sold {it.qty}
                </div>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <button
                  onClick={() => setQty(it.name, it.qty, -1)}
                  className="w-6 h-6 rounded-md flex items-center justify-center border"
                  style={{ borderColor: C.line, color: C.muted }}
                >
                  <Minus size={12} />
                </button>
                <span className="w-6 text-center text-[13px] font-bold" style={{ fontFamily: FONT_MONO }}>
                  {q}
                </span>
                <button
                  onClick={() => setQty(it.name, it.qty, 1)}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-white"
                  style={{ backgroundColor: C.vermillion }}
                >
                  <Plus size={12} />
                </button>
              </div>
              <div className="text-right text-[12.5px] font-bold" style={{ fontFamily: FONT_MONO }}>
                ৳{(it.unit * q).toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="flex items-center justify-between rounded-lg px-3 py-2.5"
        style={{ backgroundColor: C.vermillionTint, color: C.vermillion }}
      >
        <span className="text-[12.5px] font-bold flex items-center gap-1.5">
          <RotateCcw size={14} /> Total Return Amount
        </span>
        <span className="text-[15px] font-bold" style={{ fontFamily: FONT_MONO }}>
          ৳{returnTotal.toLocaleString()}
        </span>
      </div>

      <div className="flex gap-2.5 mt-5">
        <button
          onClick={onClose}
          className="flex-1 text-[13px] font-semibold py-2.5 rounded-lg border"
          style={{ borderColor: C.line, color: C.muted }}
        >
          বাতিল
        </button>
        <button
          onClick={() => {
            onApply(selected.map((it) => ({ name: it.name, unit: it.unit, qty: it.returnQty })));
            onClose();
          }}
          className="flex-1 flex items-center justify-center gap-1.5 text-[13px] font-bold py-2.5 rounded-lg text-white"
          style={{ backgroundColor: C.vermillion }}
        >
          Confirm Return <ArrowRight size={14} />
        </button>
      </div>
    </Modal>
  );
}

export default function SellPage() {
  useGoogleFonts();
  useScrollbarStyle();
  usePrintStyle();
  const time = useClock();
  const [activeCat, setActiveCat] = React.useState("সব");
  const [modal, setModal] = React.useState(null); // null | "customer" | "newCustomer" | "discount" | "others"
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);
  const [discount, setDiscount] = React.useState(null); // { type: 'flat'|'percent', amount }
  const [others, setOthers] = React.useState(null); // { label, amount }
  const [invoiceNo] = React.useState(() => `INV-${Math.floor(100000 + Math.random() * 900000)}`);
  const [multiPay, setMultiPay] = React.useState(null); // { cash, bank }
  const [cashPay, setCashPay] = React.useState(null); // { received, change }
  const [cardPay, setCardPay] = React.useState(null); // { method, refNo, amount }
  const [returnItems, setReturnItems] = React.useState([]); // [{ name, unit, qty }]

  const subtotal = cartItems.reduce((s, i) => s + i.unit * i.qty, 0);
  const preDue = 0;

  const discountValue = discount
    ? Math.min(
        discount.type === "percent" ? Math.round((subtotal * discount.amount) / 100) : Math.round(discount.amount),
        subtotal
      )
    : 0;
  const othersValue = others ? Math.round(others.amount) : 0;
  const returnValue = returnItems.reduce((s, it) => s + it.unit * it.qty, 0);

  const netTotal = subtotal - discountValue + othersValue;
  const payable = netTotal + preDue - returnValue;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.paper, color: C.ink, fontFamily: FONT_BODY }}>
      {/* TOP BAR */}
      <div className="border-b px-4 py-2.5 flex items-center gap-3 flex-wrap" style={{ backgroundColor: C.panel, borderColor: C.line }}>
        <span className="font-bold text-[15px]" style={{ fontFamily: FONT_HEAD, color: C.plum }}>
          My Shop
        </span>
        <span className="text-[12px]" style={{ color: C.muted }}>{time.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
        <span
          className="text-[12px] font-bold px-2.5 py-1 rounded-md"
          style={{ backgroundColor: C.forestTint, color: C.forestDark, fontFamily: FONT_MONO }}
        >
          {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </span>

        <div className="flex items-center gap-2 ml-2">
          <button
            className="flex items-center gap-1.5 text-[12.5px] font-semibold px-3 py-1.5 rounded-full border"
            style={{ borderColor: C.forest, color: C.forestDark }}
          >
            <Footprints size={13} /> Walking
          </button>
          <button
            onClick={() => setModal("customer")}
            className="flex items-center gap-1.5 text-[12.5px] font-semibold px-3 py-1.5 rounded-full border"
            style={{ borderColor: C.marigold, color: C.rust }}
          >
            <UserSearch size={13} /> Customer
          </button>
          <button
            onClick={() => setModal("newCustomer")}
            className="flex items-center gap-1.5 text-[12.5px] font-semibold px-3 py-1.5 rounded-full border"
            style={{ borderColor: C.line, color: C.muted }}
          >
            <UserPlus size={13} /> New Customer
          </button>
          <button
            onClick={() => setModal("return")}
            className="flex items-center gap-1.5 text-[12.5px] font-semibold px-3 py-1.5 rounded-full border relative"
            style={{ borderColor: C.vermillion, color: C.vermillion }}
          >
            <RotateCcw size={13} /> Return
            {returnItems.length > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                style={{ backgroundColor: C.vermillion }}
              >
                {returnItems.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button className="w-9 h-9 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: C.plum }} title="Clear">
            <Trash2 size={15} />
          </button>
          <button className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: C.paper, color: C.ink, border: `1px solid ${C.line}` }} title="Refresh">
            <RefreshCw size={15} />
          </button>
          <button className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: C.paper, color: C.ink, border: `1px solid ${C.line}` }} title="Collapse">
            <PanelLeftClose size={15} />
          </button>
          <button
            onClick={() => window.print()}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: C.magenta }}
            title="Save & Print"
          >
            <Save size={15} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 p-4 min-h-0">
        {/* LEFT — PRODUCTS */}
        <div className="w-[420px] shrink-0 flex flex-col gap-3 min-h-0">
          <div className="flex gap-2">
            <select className="flex-1 text-[12.5px] font-semibold rounded-lg border px-3 py-2" style={{ borderColor: C.line, color: C.ink }}>
              <option>-- Category --</option>
            </select>
            <select className="flex-1 text-[12.5px] font-semibold rounded-lg border px-3 py-2" style={{ borderColor: C.line, color: C.ink }}>
              <option>-- Brands --</option>
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: C.line, backgroundColor: C.panel }}>
            <Search size={14} style={{ color: C.muted }} />
            <input placeholder="Product Name" className="flex-1 text-[12.5px] outline-none bg-transparent" style={{ color: C.ink }} />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 pos-scroll">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className="shrink-0 text-[11.5px] font-semibold px-3 py-1.5 rounded-full border transition-colors"
                style={
                  activeCat === c
                    ? { backgroundColor: C.magenta, color: "#fff", borderColor: C.magenta }
                    : { backgroundColor: C.panel, color: C.muted, borderColor: C.line }
                }
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2.5 overflow-y-auto pr-1 pos-scroll">
            {products.map((p, i) => (
              <ProductCard key={p.name} p={p} i={i} />
            ))}
          </div>
        </div>

        {/* MIDDLE — CART */}
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          <div className="rounded-xl border px-4 py-2.5 text-[12.5px] font-semibold" style={{ backgroundColor: C.panel, borderColor: C.line }}>
            {selectedCustomer ? selectedCustomer.name : "Walking Customer"}{" "}
            <span style={{ color: C.muted, fontWeight: 500 }}>
              {selectedCustomer
                ? `|| ${selectedCustomer.phone} || ${selectedCustomer.area} || Due ৳${selectedCustomer.due}`
                : "|| 230710646WALKING || p230710646 || none"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 rounded-lg border px-3 py-2.5" style={{ borderColor: C.line, backgroundColor: C.panel }}>
              <Barcode size={16} style={{ color: C.muted }} />
              <input placeholder="Scan or type barcode  ·  F2" className="flex-1 text-[13px] outline-none bg-transparent" />
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-white font-bold text-[13px]"
              style={{ backgroundColor: C.plum, fontFamily: FONT_MONO }}
            >
              <ShoppingBag size={15} /> {cartItems.length}
            </div>
          </div>

          <div className="flex-1 rounded-xl border overflow-hidden flex flex-col min-h-0" style={{ backgroundColor: C.panel, borderColor: C.line }}>
            <div
              className="grid grid-cols-[1fr_120px_100px_36px] text-[11.5px] font-bold text-white px-3 py-2.5"
              style={{ backgroundColor: C.plum }}
            >
              <div>Product Info</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Subtotal</div>
              <div />
            </div>
            <div className="overflow-y-auto flex-1 pos-scroll">
              {cartItems.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[12.5px]" style={{ color: C.muted }}>
                  কার্ট খালি — বারকোড স্ক্যান করুন অথবা পণ্যে ক্লিক করুন
                </div>
              ) : (
                cartItems.map((c, i) => (
                  <div
                    key={c.name}
                    className="grid grid-cols-[1fr_120px_100px_36px] items-center px-3 py-2.5"
                    style={i !== cartItems.length - 1 ? { borderBottom: `1px solid ${C.line}` } : undefined}
                  >
                    <div>
                      <div className="text-[13px] font-semibold">{c.name}</div>
                      <div className="text-[11px]" style={{ color: C.muted, fontFamily: FONT_MONO }}>
                        ৳{c.unit} / pc
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Stepper value={c.qty} />
                    </div>
                    <div className="text-right text-[13px] font-bold" style={{ fontFamily: FONT_MONO }}>
                      ৳{(c.unit * c.qty).toLocaleString()}
                    </div>
                    <button className="flex justify-center" style={{ color: C.vermillion }}>
                      <X size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            className="flex items-center justify-center gap-2 text-[12.5px] font-bold py-2.5 rounded-lg border"
            style={{ borderColor: C.marigold, color: C.rust }}
          >
            <PauseCircle size={15} /> Hold This Sale
          </button>
        </div>

        {/* RIGHT — SUMMARY */}
        <div className="w-[280px] shrink-0 flex flex-col gap-3">
          <div className="relative rounded-xl border p-4 pt-5 overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
            <ScallopBorder id="summary-scallop" />
            <Row label="Total Gross" value={`৳${subtotal.toLocaleString()}`} />
            <Row
              label={
                <span className="flex items-center gap-1.5">
                  DISCOUNT{discount ? "" : "(No)"}
                  {discount && (
                    <span className="text-[10px] font-semibold" style={{ color: C.muted }}>
                      ({discount.type === "percent" ? `${discount.amount}%` : "flat"})
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setModal("discount")}
                    className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ backgroundColor: C.marigold }}
                  >
                    +
                  </button>
                </span>
              }
              value={`- ৳${discountValue.toLocaleString()}`}
            />
            <Row
              label={
                <span className="flex items-center gap-1.5">
                  {others ? others.label : "Others"}
                  <button
                    type="button"
                    onClick={() => setModal("others")}
                    className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ backgroundColor: C.marigold }}
                  >
                    +
                  </button>
                </span>
              }
              value={`৳${othersValue.toLocaleString()}`}
            />
            <div className="h-px my-2" style={{ backgroundColor: C.line }} />
            <Row label="Sub Total" value={`৳${netTotal.toLocaleString()}`} bold />

            {returnValue > 0 && (
              <Row
                label={
                  <span className="flex items-center gap-1.5" style={{ color: C.vermillion }}>
                    <RotateCcw size={12} /> Return ({returnItems.length})
                    <button
                      type="button"
                      onClick={() => setModal("return")}
                      className="text-[10px] font-bold underline"
                      style={{ color: C.vermillion }}
                    >
                      edit
                    </button>
                  </span>
                }
                value={`- ৳${returnValue.toLocaleString()}`}
              />
            )}

            <div
              className="flex items-center justify-between rounded-lg px-3 py-2.5 mt-2.5 text-white"
              style={{ backgroundColor: C.vermillion }}
            >
              <span className="text-[12.5px] font-bold">Pre Due</span>
              <span className="text-[13px] font-bold" style={{ fontFamily: FONT_MONO }}>
                ৳{preDue}
              </span>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-[13.5px] font-bold" style={{ color: C.plum, fontFamily: FONT_HEAD }}>
                Total Payable
              </span>
              <span className="text-[22px] font-bold" style={{ color: C.magenta, fontFamily: FONT_MONO }}>
                ৳{payable.toLocaleString()}
              </span>
            </div>

            {multiPay && (multiPay.cash > 0 || multiPay.bank > 0) && (
              <div
                className="flex items-center justify-between gap-2 mt-2.5 rounded-lg px-3 py-2 text-[11.5px] font-semibold"
                style={{ backgroundColor: C.peacockTint, color: C.peacock }}
              >
                <span className="flex items-center gap-1">
                  <Wallet size={12} /> ৳{multiPay.cash.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <CreditCard size={12} /> ৳{multiPay.bank.toLocaleString()}
                  {multiPay.bank > 0 && ` (${multiPay.bankMethod})`}
                </span>
              </div>
            )}

            {cashPay && (
              <div
                className="flex items-center justify-between gap-2 mt-2.5 rounded-lg px-3 py-2 text-[11.5px] font-semibold"
                style={{ backgroundColor: C.magentaTint, color: C.magenta }}
              >
                <span className="flex items-center gap-1">
                  <Wallet size={12} /> Received ৳{cashPay.received.toLocaleString()}
                </span>
                {cashPay.change > 0 && <span>Change ৳{cashPay.change.toLocaleString()}</span>}
              </div>
            )}

            {cardPay && (
              <div
                className="flex items-center justify-between gap-2 mt-2.5 rounded-lg px-3 py-2 text-[11.5px] font-semibold"
                style={{ backgroundColor: C.purpleTint, color: C.purple }}
              >
                <span className="flex items-center gap-1">
                  <CreditCard size={12} /> {cardPay.method}
                </span>
                <span>৳{cardPay.amount.toLocaleString()}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setModal("cash")}
            className="flex items-center justify-center gap-2 text-white font-bold text-[13.5px] py-3 rounded-xl shadow"
            style={{ backgroundColor: C.magenta }}
          >
            <Wallet size={16} /> CASH
          </button>
          <button
            onClick={() => setModal("card")}
            className="flex items-center justify-center gap-2 text-white font-bold text-[13.5px] py-3 rounded-xl"
            style={{ backgroundColor: C.plum }}
          >
            <CreditCard size={16} /> MFS or CARD
          </button>
          <button
            onClick={() => setModal("multipay")}
            className="flex items-center justify-center gap-2 text-white font-bold text-[13.5px] py-3 rounded-xl"
            style={{ backgroundColor: C.marigold }}
          >
            <Layers size={16} /> Multiple Pay
          </button>

          <button
            onClick={() => setModal("confirm")}
            disabled={!cashPay && !cardPay && !multiPay}
            className="flex items-center justify-center gap-2 font-bold text-[13.5px] py-3 rounded-xl mt-1 transition-opacity"
            style={
              cashPay || cardPay || multiPay
                ? { backgroundColor: C.forest, color: "#fff" }
                : { backgroundColor: C.line, color: C.muted, cursor: "not-allowed" }
            }
          >
            <CheckCircle2 size={16} /> Confirm Order
          </button>
        </div>
      </div>

      {modal === "newCustomer" && <NewCustomerModal onClose={() => setModal(null)} />}
      {modal === "customer" && (
        <CustomerListModal
          onClose={() => setModal(null)}
          onSelect={(c) => {
            setSelectedCustomer(c);
            setModal(null);
          }}
        />
      )}
      {modal === "discount" && (
        <DiscountModal
          onClose={() => setModal(null)}
          onApply={setDiscount}
          subtotal={subtotal}
          current={discount}
        />
      )}
      {modal === "others" && (
        <OthersModal onClose={() => setModal(null)} onApply={setOthers} current={others} />
      )}
      {modal === "multipay" && (
        <MultiplePayModal
          onClose={() => setModal(null)}
          onApply={setMultiPay}
          payable={payable}
          current={multiPay}
          onConfirmed={() => setModal("confirm")}
        />
      )}
      {modal === "cash" && (
        <CashPayModal
          onClose={() => setModal(null)}
          onApply={setCashPay}
          payable={payable}
          current={cashPay}
          onConfirmed={() => setModal("confirm")}
        />
      )}
      {modal === "card" && (
        <CardPayModal
          onClose={() => setModal(null)}
          onApply={setCardPay}
          payable={payable}
          current={cardPay}
          onConfirmed={() => setModal("confirm")}
        />
      )}
      {modal === "confirm" && (
        <SaleConfirmationModal
          onClose={() => setModal(null)}
          onPrint={() => window.print()}
          customer={selectedCustomer}
          items={cartItems}
          subtotal={subtotal}
          discount={discount}
          discountValue={discountValue}
          others={others}
          othersValue={othersValue}
          returnItems={returnItems}
          returnValue={returnValue}
          preDue={preDue}
          payable={payable}
          cashPay={cashPay}
          cardPay={cardPay}
          multiPay={multiPay}
        />
      )}
      {modal === "return" && (
        <ReturnModal
          onClose={() => setModal(null)}
          onApply={setReturnItems}
          cartItems={cartItems}
          current={returnItems}
        />
      )}

      <PrintMemo
        invoiceNo={invoiceNo}
        time={time}
        customer={selectedCustomer}
        items={cartItems}
        subtotal={subtotal}
        discount={discount}
        discountValue={discountValue}
        others={others}
        othersValue={othersValue}
        returnValue={returnValue}
        preDue={preDue}
        payable={payable}
      />
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className={`text-[12.5px] ${bold ? "font-bold" : "font-semibold"}`} style={{ color: bold ? undefined : "#5B4E4A" }}>
        {label}
      </span>
      <span className={`text-[13px] ${bold ? "font-bold" : "font-semibold"}`} style={{ fontFamily: FONT_MONO }}>
        {value}
      </span>
    </div>
  );
}