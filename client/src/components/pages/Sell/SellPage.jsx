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
  Loader2,
} from "lucide-react";
import ReturnModal from "./ReturnModal"
// ---------------------------------------------------------------------------
// API SERVICES
// Adjust the relative paths below to match where these files live in your
// project (e.g. "../services/productService").
// ---------------------------------------------------------------------------
import { fetchProducts } from "../../../api/productService";
import { fetchCategories } from "../../../api/categoryService";
import { fetchBrands } from "../../../api/brandService";
import {
  fetchCustomers,
  createCustomer,
} from "../../../api/customerService";
import { createSale } from "../../../api/saleService";

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

// ---------------------------------------------------------------------------
// Small debounce hook — used for the product/customer search boxes so we
// don't fire a request on every keystroke.
// ---------------------------------------------------------------------------
function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ---------------------------------------------------------------------------
// Reads the logged-in user object from localStorage and returns their
// branch_id. Adjust the localStorage key ("user") if your auth flow stores
// it under a different key (e.g. "auth_user").
// ---------------------------------------------------------------------------
function getBranchId() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user?.branch_id ?? user?.branch?.id ?? null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Normalizers — the backend's field names may differ from what this UI
// expects. Adjust these mapping functions to match your actual API
// response shape (checked via console.log on first load if unsure).
// ---------------------------------------------------------------------------
function normalizeProduct(p) {
  const stock = p.stock ?? p.quantity ?? p.stock_quantity ?? 0;
  return {
    id: p.id,
    name: p.name ?? p.product_name ?? "Unnamed",
    price: Number(p.price ?? p.selling_price ?? p.sale_price ?? 0),
    stock,
    low: stock > 0 && stock <= (p.low_stock_threshold ?? 10),
    img: p.image_url || p.thumbnail || "📦",
    barcode: p.barcode ?? p.sku ?? null,
    category_id: p.category_id ?? p.category?.id ?? null,
    brand_id: p.brand_id ?? p.brand?.id ?? null,
  };
}

function normalizeCategory(c) {
  return { id: c.id, name: c.name ?? c.category_name ?? "Unnamed" };
}

function normalizeBrand(b) {
  return { id: b.id, name: b.name ?? b.brand_name ?? "Unnamed" };
}

function normalizeCustomer(c) {
  return {
    id: c.id,
    name: c.name ?? c.customer_name ?? "Unnamed",
    phone: c.phone ?? c.phone_number ?? "",
    area: c.address ?? c.area ?? "",
    due: Number(c.due ?? c.due_amount ?? c.balance ?? 0),
  };
}

// Pull a list out of whatever shape the API returns:
// { data: [...] }, { data: { data: [...] } } (Laravel paginator), or a bare array.
function extractList(res) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
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

function useClock() {
  const [time, setTime] = React.useState(new Date());
  React.useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

function Stepper({ value, onIncrement, onDecrement }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={onDecrement}
        className="w-6 h-6 rounded-md flex items-center justify-center border"
        style={{ borderColor: C.line, color: C.muted }}
      >
        <Minus size={12} />
      </button>
      <span className="w-6 text-center text-[13px] font-bold" style={{ fontFamily: FONT_MONO }}>
        {value}
      </span>
      <button
        onClick={onIncrement}
        className="w-6 h-6 rounded-md flex items-center justify-center text-white"
        style={{ backgroundColor: C.magenta }}
      >
        <Plus size={12} />
      </button>
    </div>
  );
}

function ProductCard({ p, i, onAdd }) {
  return (
    <div
      onClick={() => onAdd(p)}
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
        className="h-20 flex items-center justify-center text-3xl mt-1 overflow-hidden"
        style={{ backgroundColor: C.paper }}
      >
        {p.img && p.img.startsWith("http") ? (
          <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
        ) : (
          p.img
        )}
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

/* ---------- New Customer Modal (now creates a real customer via the API) ---------- */
function NewCustomerModal({ onClose, onCreated }) {
  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    email: "",
    opening_due: "",
    address: "",
  });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      setError("নাম ও ফোন নম্বর আবশ্যক");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await createCustomer({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        opening_due: form.opening_due ? Number(form.opening_due) : 0,
        address: form.address || undefined,
        branch_id: getBranchId(),
      });
      const created = res?.data ?? res;
      onCreated && onCreated(normalizeCustomer(created));
      onClose();
    } catch (err) {
      setError(err.message || "কাস্টমার তৈরি করা যায়নি");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="New Customer" subtitle="নতুন কাস্টমারের তথ্য যোগ করুন" onClose={onClose} wide>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Field label="Customer Name *" icon={CircleUserRound} placeholder="যেমন: Rafiq Hasan" value={form.name} onChange={set("name")} />
        <Field label="Phone Number *" icon={Phone} placeholder="01XXX-XXXXXX" value={form.phone} onChange={set("phone")} />
        <Field label="Email" icon={Mail} placeholder="optional" type="email" value={form.email} onChange={set("email")} />
        <Field label="Opening Due (৳)" icon={Coins} placeholder="0" type="number" value={form.opening_due} onChange={set("opening_due")} />
        <Field label="Address" icon={MapPin} placeholder="বাসা, রোড, এলাকা" full value={form.address} onChange={set("address")} />
      </div>

      {error && (
        <div className="text-[12px] font-semibold mt-3" style={{ color: C.vermillion }}>
          {error}
        </div>
      )}

      <div className="flex gap-2.5 mt-5">
        <button
          onClick={onClose}
          disabled={saving}
          className="flex-1 text-[13px] font-semibold py-2.5 rounded-lg border"
          style={{ borderColor: C.line, color: C.muted }}
        >
          বাতিল
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-1.5 text-[13px] font-bold py-2.5 rounded-lg text-white disabled:opacity-60"
          style={{ backgroundColor: C.magenta }}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <>Save Customer <ArrowRight size={14} /></>}
        </button>
      </div>
    </Modal>
  );
}

/* ---------- Customer List Modal (now searches customers via the API) ---------- */
function CustomerListModal({ onClose, onSelect }) {
  const [q, setQ] = React.useState("");
  const debouncedQ = useDebouncedValue(q, 350);
  const [customers, setCustomers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCustomers(debouncedQ ? { search: debouncedQ } : {})
      .then((res) => {
        if (cancelled) return;
        setCustomers(extractList(res).map(normalizeCustomer));
      })
      .catch(() => {
        if (!cancelled) setCustomers([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQ]);

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
        {loading && <Loader2 size={14} className="animate-spin" style={{ color: C.muted }} />}
      </div>

      <div className="space-y-2">
        {!loading && customers.length === 0 && (
          <div className="text-center text-[12.5px] py-8" style={{ color: C.muted }}>
            কোনো কাস্টমার পাওয়া যায়নি
          </div>
        )}
        {customers.map((c) => (
          <button
            key={c.id}
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

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "8px 0", color: "#5B4E4A" }}>
        <span>Memo No: <b style={{ color: "#2B2320" }}>{invoiceNo}</b></span>
        <span>{time.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} &nbsp;{time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
      </div>

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
            <tr key={it.id ?? it.name} style={{ borderBottom: i === items.length - 1 ? "none" : "1px dotted #E8D9BE" }}>
              <td style={{ padding: "5px 2px" }}>{it.name}</td>
              <td style={{ textAlign: "center", padding: "5px 2px" }}>{it.qty}</td>
              <td style={{ textAlign: "right", padding: "5px 2px" }}>{it.unit}</td>
              <td style={{ textAlign: "right", padding: "5px 2px", fontWeight: 600 }}>{(it.unit * it.qty).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

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

      <div style={{ textAlign: "center", marginTop: 16, paddingTop: 10, borderTop: "1px dashed #C9B79A" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: dark }}>ধন্যবাদ, আবার আসবেন!</div>
        <div style={{ fontSize: 10.5, color: "#8C7B6B", marginTop: 2 }}>Thank you for shopping with Spire Technology Ltd</div>
      </div>
    </div>
  );
}

const bankMethods = ["bKash", "Nagad", "Rocket", "Upay", "Bank Transfer", "Debit/Credit Card"];

/* ---------- Multiple Pay Modal ---------- */
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

/* ---------- Sale Confirmation Modal ---------- */
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
            key={it.id ?? it.name}
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
              key={it.id ?? it.name}
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



export default function SellPage() {
  useGoogleFonts();
  useScrollbarStyle();
  usePrintStyle();
  const time = useClock();

  // -- Catalog data (products / categories / brands) --------------------
  const [products, setProducts] = React.useState([]);
  const [productsLoading, setProductsLoading] = React.useState(false);
  const [productsError, setProductsError] = React.useState(null);

  const [categories, setCategories] = React.useState([]); // [{id, name}]
  const [brands, setBrands] = React.useState([]); // [{id, name}]

  const [activeCatId, setActiveCatId] = React.useState(""); // "" = all
  const [activeBrandId, setActiveBrandId] = React.useState(""); // "" = all
  const [productSearch, setProductSearch] = React.useState("");
  const debouncedProductSearch = useDebouncedValue(productSearch, 350);

  const [barcodeInput, setBarcodeInput] = React.useState("");
  const [barcodeLoading, setBarcodeLoading] = React.useState(false);

  // -- Cart / sale state --------------------------------------------------
  const [cart, setCart] = React.useState([]); // [{id, name, unit, qty}]
  const [modal, setModal] = React.useState(null);
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);
  const [discount, setDiscount] = React.useState(null);
  const [others, setOthers] = React.useState(null);
  const [multiPay, setMultiPay] = React.useState(null);
  const [cashPay, setCashPay] = React.useState(null);
  const [cardPay, setCardPay] = React.useState(null);
  const [returnItems, setReturnItems] = React.useState([]);

  const [saleLoading, setSaleLoading] = React.useState(false);
  const [saleError, setSaleError] = React.useState(null);
  const [confirmedSale, setConfirmedSale] = React.useState(null); // { invoiceNo, ...serverResponse }

  // -- Load categories & brands once --------------------------------------
  React.useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(extractList(res).map(normalizeCategory)))
      .catch(() => setCategories([]));
    fetchBrands()
      .then((res) => setBrands(extractList(res).map(normalizeBrand)))
      .catch(() => setBrands([]));
  }, []);

  // -- Load products whenever filters change ------------------------------
  React.useEffect(() => {
    let cancelled = false;
    setProductsLoading(true);
    setProductsError(null);

    const params = { active_only: 1 };
    if (activeCatId) params.category_id = activeCatId;
    if (activeBrandId) params.brand_id = activeBrandId;
    if (debouncedProductSearch) params.search = debouncedProductSearch;

    fetchProducts(params)
      .then((res) => {
        if (cancelled) return;
        setProducts(extractList(res).map(normalizeProduct));
      })
      .catch((err) => {
        if (cancelled) return;
        setProductsError(err.message || "প্রোডাক্ট লোড করা যায়নি");
        setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setProductsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeCatId, activeBrandId, debouncedProductSearch]);

  // -- Cart helpers ---------------------------------------------------------
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { id: product.id, name: product.name, unit: product.price, qty: 1 }];
    });
  };

  const incrementQty = (id) =>
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));

  const decrementQty = (id) =>
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const resetSale = () => {
    setCart([]);
    setSelectedCustomer(null);
    setDiscount(null);
    setOthers(null);
    setMultiPay(null);
    setCashPay(null);
    setCardPay(null);
    setReturnItems([]);
    setConfirmedSale(null);
    setSaleError(null);
  };

  // -- Barcode scan: look up the product and add it straight to the cart --
  const handleBarcodeSubmit = async (e) => {
    if (e.key !== "Enter" || !barcodeInput.trim()) return;
    setBarcodeLoading(true);
    try {
      // NOTE: productService has no dedicated "lookup by barcode" endpoint,
      // so this reuses the list endpoint's `search` param. If your backend
      // exposes a barcode-specific filter, swap `search` for that key.
      const res = await fetchProducts({ search: barcodeInput.trim(), per_page: 1 });
      const found = extractList(res).map(normalizeProduct)[0];
      if (found) {
        addToCart(found);
        setBarcodeInput("");
      }
    } catch (err) {
      setSaleError(err.message || "বারকোড খুঁজে পাওয়া যায়নি");
    } finally {
      setBarcodeLoading(false);
    }
  };

  const subtotal = cart.reduce((s, i) => s + i.unit * i.qty, 0);
  const preDue = selectedCustomer?.due ?? 0;

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

  // -- Confirm & create the sale on the server -----------------------------
 const handleConfirmOrder = async () => {
    setSaleLoading(true);
    setSaleError(null);

    const branch_id = getBranchId();
    if (!branch_id) {
      setSaleError("Branch ID পাওয়া যায়নি। অনুগ্রহ করে আবার লগইন করুন।");
      setSaleLoading(false);
      return;
    }

    try {
      // Total amount actually paid in this transaction
      const paidAmount = cashPay
        ? cashPay.received
        : cardPay
        ? cardPay.amount
        : multiPay
        ? multiPay.cash + multiPay.bank
        : 0;

      // Backend requires sale_date as a date string (YYYY-MM-DD)
      const saleDate = time.toISOString().slice(0, 10);

      const payload = {
        branch_id,
        customer_id: selectedCustomer?.id ?? null,
        sale_date: saleDate,
        paid: paidAmount,
        discount: discountValue,   // backend field is "discount", not "discount_type"/"discount_amount"
        vat: othersValue,          // backend has no generic "others" field — mapped to "vat"
        items: cart.map((i) => ({
          product_id: i.id,
          quantity: i.qty,
          unit_price: i.unit,
        })),
      };

      const res = await createSale(payload);
      const created = res?.data ?? res;
      setConfirmedSale({
        invoiceNo: created?.invoice_no || created?.invoiceNo || created?.id || `INV-${Date.now()}`,
      });
      setModal("confirm");
    } catch (err) {
      setSaleError(err.message || "সেল তৈরি করা যায়নি");
    } finally {
      setSaleLoading(false);
    }
  };

  const invoiceNo = confirmedSale?.invoiceNo || `INV-${Math.floor(100000 + Math.random() * 900000)}`;

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
          <button onClick={resetSale} className="w-9 h-9 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: C.plum }} title="Clear">
            <Trash2 size={15} />
          </button>
          <button
            onClick={() => {
              setActiveCatId((c) => c); // no-op change to retrigger effect deterministically
              setProductSearch((s) => s);
            }}
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: C.paper, color: C.ink, border: `1px solid ${C.line}` }}
            title="Refresh"
          >
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

      {saleError && (
        <div
          className="mx-4 mt-2 px-3 py-2 rounded-lg text-[12.5px] font-semibold"
          style={{ backgroundColor: C.vermillionTint, color: C.vermillion }}
        >
          {saleError}
        </div>
      )}

      <div className="flex-1 flex gap-4 p-4 min-h-0">
        {/* LEFT — PRODUCTS */}
        <div className="w-[420px] shrink-0 flex flex-col gap-3 min-h-0">
          <div className="flex gap-2">
            <select
              value={activeCatId}
              onChange={(e) => setActiveCatId(e.target.value)}
              className="flex-1 text-[12.5px] font-semibold rounded-lg border px-3 py-2"
              style={{ borderColor: C.line, color: C.ink }}
            >
              <option value="">-- Category --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={activeBrandId}
              onChange={(e) => setActiveBrandId(e.target.value)}
              className="flex-1 text-[12.5px] font-semibold rounded-lg border px-3 py-2"
              style={{ borderColor: C.line, color: C.ink }}
            >
              <option value="">-- Brands --</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: C.line, backgroundColor: C.panel }}>
            <Search size={14} style={{ color: C.muted }} />
            <input
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Product Name"
              className="flex-1 text-[12.5px] outline-none bg-transparent"
              style={{ color: C.ink }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5 overflow-y-auto pr-1 pos-scroll">
            {productsLoading && (
              <div className="col-span-2 flex items-center justify-center py-10" style={{ color: C.muted }}>
                <Loader2 size={18} className="animate-spin mr-2" /> Loading products…
              </div>
            )}
            {!productsLoading && productsError && (
              <div className="col-span-2 text-center text-[12.5px] py-8" style={{ color: C.vermillion }}>
                {productsError}
              </div>
            )}
            {!productsLoading && !productsError && products.length === 0 && (
              <div className="col-span-2 text-center text-[12.5px] py-8" style={{ color: C.muted }}>
                কোনো প্রোডাক্ট পাওয়া যায়নি
              </div>
            )}
            {!productsLoading &&
              products.map((p, i) => <ProductCard key={p.id} p={p} i={i} onAdd={addToCart} />)}
          </div>
        </div>

        {/* MIDDLE — CART */}
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          <div className="rounded-xl border px-4 py-2.5 text-[12.5px] font-semibold" style={{ backgroundColor: C.panel, borderColor: C.line }}>
            {selectedCustomer ? selectedCustomer.name : "Walking Customer"}{" "}
            <span style={{ color: C.muted, fontWeight: 500 }}>
              {selectedCustomer
                ? `|| ${selectedCustomer.phone} || ${selectedCustomer.area} || Due ৳${selectedCustomer.due}`
                : "|| Walk-in customer"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 rounded-lg border px-3 py-2.5" style={{ borderColor: C.line, backgroundColor: C.panel }}>
              <Barcode size={16} style={{ color: C.muted }} />
              <input
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={handleBarcodeSubmit}
                placeholder="Scan or type barcode, then Enter"
                className="flex-1 text-[13px] outline-none bg-transparent"
              />
              {barcodeLoading && <Loader2 size={14} className="animate-spin" style={{ color: C.muted }} />}
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-white font-bold text-[13px]"
              style={{ backgroundColor: C.plum, fontFamily: FONT_MONO }}
            >
              <ShoppingBag size={15} /> {cart.length}
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
              {cart.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[12.5px]" style={{ color: C.muted }}>
                  কার্ট খালি — বারকোড স্ক্যান করুন অথবা পণ্যে ক্লিক করুন
                </div>
              ) : (
                cart.map((c, i) => (
                  <div
                    key={c.id}
                    className="grid grid-cols-[1fr_120px_100px_36px] items-center px-3 py-2.5"
                    style={i !== cart.length - 1 ? { borderBottom: `1px solid ${C.line}` } : undefined}
                  >
                    <div>
                      <div className="text-[13px] font-semibold">{c.name}</div>
                      <div className="text-[11px]" style={{ color: C.muted, fontFamily: FONT_MONO }}>
                        ৳{c.unit} / pc
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Stepper
                        value={c.qty}
                        onIncrement={() => incrementQty(c.id)}
                        onDecrement={() => decrementQty(c.id)}
                      />
                    </div>
                    <div className="text-right text-[13px] font-bold" style={{ fontFamily: FONT_MONO }}>
                      ৳{(c.unit * c.qty).toLocaleString()}
                    </div>
                    <button onClick={() => removeFromCart(c.id)} className="flex justify-center" style={{ color: C.vermillion }}>
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
            disabled={cart.length === 0}
            className="flex items-center justify-center gap-2 text-white font-bold text-[13.5px] py-3 rounded-xl shadow disabled:opacity-50"
            style={{ backgroundColor: C.magenta }}
          >
            <Wallet size={16} /> CASH
          </button>
          <button
            onClick={() => setModal("card")}
            disabled={cart.length === 0}
            className="flex items-center justify-center gap-2 text-white font-bold text-[13.5px] py-3 rounded-xl disabled:opacity-50"
            style={{ backgroundColor: C.plum }}
          >
            <CreditCard size={16} /> MFS or CARD
          </button>
          <button
            onClick={() => setModal("multipay")}
            disabled={cart.length === 0}
            className="flex items-center justify-center gap-2 text-white font-bold text-[13.5px] py-3 rounded-xl disabled:opacity-50"
            style={{ backgroundColor: C.marigold }}
          >
            <Layers size={16} /> Multiple Pay
          </button>

          <button
            onClick={handleConfirmOrder}
            disabled={(!cashPay && !cardPay && !multiPay) || saleLoading || cart.length === 0}
            className="flex items-center justify-center gap-2 font-bold text-[13.5px] py-3 rounded-xl mt-1 transition-opacity"
            style={
              (cashPay || cardPay || multiPay) && !saleLoading
                ? { backgroundColor: C.forest, color: "#fff" }
                : { backgroundColor: C.line, color: C.muted, cursor: "not-allowed" }
            }
          >
            {saleLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
            {saleLoading ? "Saving…" : "Confirm Order"}
          </button>
        </div>
      </div>

      {modal === "newCustomer" && (
        <NewCustomerModal
          onClose={() => setModal(null)}
          onCreated={(c) => setSelectedCustomer(c)}
        />
      )}
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
        />
      )}
      {modal === "cash" && (
        <CashPayModal
          onClose={() => setModal(null)}
          onApply={setCashPay}
          payable={payable}
          current={cashPay}
        />
      )}
      {modal === "card" && (
        <CardPayModal
          onClose={() => setModal(null)}
          onApply={setCardPay}
          payable={payable}
          current={cardPay}
        />
      )}
      {modal === "confirm" && (
        <SaleConfirmationModal
          onClose={() => setModal(null)}
          onPrint={() => window.print()}
          customer={selectedCustomer}
          items={cart}
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
    customer={selectedCustomer}
    C={C}
    FONT_MONO={FONT_MONO}
    Modal={Modal}
    onClose={() => setModal(null)}
    onApplied={(items, apiResults) => {
      setReturnItems((prev) => [...prev, ...items]);
      
    }}
  />
)}

      <PrintMemo
        invoiceNo={invoiceNo}
        time={time}
        customer={selectedCustomer}
        items={cart}
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