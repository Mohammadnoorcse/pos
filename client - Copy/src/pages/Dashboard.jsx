import React from "react";
import {
  LayoutDashboard,
  Settings,
  GitBranch,
  Package,
  Boxes,
  AlertTriangle,
  ArrowLeftRight,
  ListTree,
  Scissors,
  MessageSquare,
  Users,
  Clock,
  Search,
  Bell,
  MessageCircle,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Receipt,
  CheckCircle2,
  Minus,
  Hourglass,
  Undo2,
  CreditCard,
  TrendingUp,
  FileText,
  PlayCircle,
  ShieldCheck,
  RefreshCcw,
  History,
  Truck,
  Warehouse,
  Image as ImageIcon,
  UploadCloud,
  X,
  Globe,
  Construction,
  Plus,
  Pencil,
  KeyRound,
  Square,
  CheckSquare,
  ArrowLeft,
  Trash2,
  Tag,
  Ruler,
  Printer,
  HelpCircle,
  Download,
  Barcode,
  ArrowRightLeft,
  Eye,
  PackageCheck,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ---------------------------------------------------------
   COLOR TOKENS — "Rickshaw-art ledger" palette.
   Inspired by Dhaka rickshaw painting & nakshi-kantha thread
   colors: deep plum/magenta base, marigold + peacock + forest
   jewel accents on warm hand-painted cream paper.
---------------------------------------------------------- */
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

  mint: "#3FBF8F",
};

const FONT_HEAD = "'Baloo Da 2', 'Hind Siliguri', sans-serif";
const FONT_BODY = "'Hind Siliguri', 'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

const FONT_IMPORT_ID = "pos-dashboard-fonts";

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

/* Signature element: a scalloped, hand-painted-style border —
   a row of overlapping colored "petals", the way rickshaw
   panels and kantha borders are edged. Each card gets its own
   pattern id so multiple can render on the page at once. */
function ScallopBorder({ id, colors }) {
  return (
    <svg
      className="absolute top-0 left-0 right-0"
      width="100%"
      height="9"
      preserveAspectRatio="none"
      viewBox="0 0 30 9"
    >
      <defs>
        <pattern id={id} width="30" height="9" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="0" r="5.5" fill={colors[0]} />
          <circle cx="15" cy="0" r="5.5" fill={colors[1]} />
          <circle cx="25" cy="0" r="5.5" fill={colors[2]} />
        </pattern>
      </defs>
      <rect width="30" height="9" fill={`url(#${id})`} />
    </svg>
  );
}

const petals = [C.magenta, C.marigold, C.peacock];

const salesTrend = [
  { day: "শনি", sales: 9200 },
  { day: "রবি", sales: 10800 },
  { day: "সোম", sales: 8600 },
  { day: "মঙ্গল", sales: 12400 },
  { day: "বুধ", sales: 11300 },
  { day: "বৃহঃ", sales: 13950 },
  { day: "শুক্র", sales: 14240 },
];

const kpis = [
  { label: "Total Sales", value: "14,240.00", trend: "+12.4%", up: true, icon: Receipt, fg: C.magenta, bg: C.magentaTint },
  { label: "Instant Paid", value: "14,240.00", trend: "+8.1%", up: true, icon: CheckCircle2, fg: C.forest, bg: C.forestTint },
  { label: "Total Expense", value: "2,200.00", trend: "-3.2%", up: false, icon: Minus, fg: C.vermillion, bg: C.vermillionTint },
  { label: "Due Paid", value: "600.00", trend: "-1.5%", up: false, icon: Hourglass, fg: C.purple, bg: C.purpleTint },
  { label: "Total Return", value: "1,500.00", trend: "+5.0%", up: true, icon: Undo2, fg: C.rust, bg: C.rustTint },
  { label: "Total Payment", value: "7,000.00", trend: "+9.7%", up: true, icon: CreditCard, fg: C.marigold, bg: C.marigoldTint },
  { label: "Stock Alert Qty", value: "03", trend: "3 items", up: false, icon: AlertTriangle, fg: C.peacock, bg: C.peacockTint, noCurrency: true },
  { label: "Total Income", value: "1,200.00", trend: "+4.4%", up: true, icon: TrendingUp, fg: C.forestDark, bg: C.forestTint },
];

/* ---------------------------------------------------------
   SIDEBAR NAV — matches the reference screenshot structure.
   Each top-level item is either:
   - "single": a plain clickable row
   - "expandable": has children shown inline, toggled open/closed
---------------------------------------------------------- */
const navItems = [
  { id: "dashboard", type: "single", icon: LayoutDashboard, label: "Main Wing Dashboard", page: "dashboard" },
  {
    id: "shop-setting",
    type: "expandable",
    icon: Settings,
    label: "Shop Setting & Others",
    children: [
      { icon: Settings, label: "Settings", page: "settings" },
      { icon: PlayCircle, label: "Tutorial", page: "tutorial" },
      { icon: ShieldCheck, label: "Admin Helper Roll & Permissions", page: "permissions" },
      { icon: RefreshCcw, label: "Renew Service", tint: true, page: "renew-service" },
      { icon: History, label: "Service Renew Histoy", tint: true, page: "renew-history" },
      { icon: Truck, label: "Delivery man", page: "delivery-man" },
    ],
  },
  {
    id: "shop-branch",
    type: "expandable",
    icon: GitBranch,
    label: "Shop Branch",
    children: [
      { icon: GitBranch, label: "Branch", page: "branch" },
      { icon: ShieldCheck, label: "Branch role & permission", page: "branch-role-permission" },
      { icon: Users, label: "CRM", page: "crm" },
    ],
  },
  {
    id: "products",
    type: "expandable",
    icon: Package,
    label: "Products",
    children: [
      { icon: Plus, label: "Add New Product", page: "add-new-product" },
      { icon: Package, label: "All Products", page: "all-products" },
      { icon: Tag, label: "Brands", page: "brands" },
      { icon: ListTree, label: "Categories", page: "categories" },
      { icon: Ruler, label: "Unit Types", page: "unit-types" },
      { icon: UploadCloud, label: "Upload Product By CSV", page: "upload-product-csv" },
      { icon: Printer, label: "Print Barcode / Labels", page: "print-barcode-labels" },
      { icon: Scissors, label: "Variations", badge: "New", page: "variations" },
    ],
  },
  { id: "opening-stock", type: "expandable", icon: Warehouse, label: "Opening & Own Stock", children: [] },
  { id: "product-stocks", type: "single", icon: Boxes, label: "Product Stocks", page: "product-stocks" },
  { id: "product-summery", type: "single", icon: TrendingUp, label: "Product Summery", page: "product-summery" },
  { id: "stock-alert-qty", type: "single", icon: Bell, label: "Stock Alert Quantity", badge: "New", page: "stock-alert-qty" },
  {
    id: "product-transfer",
    type: "expandable",
    icon: ArrowLeftRight,
    label: "Product Transfer",
    children: [
      { icon: ArrowRightLeft, label: "Create Transfer[B2B, B2G]", page: "create-transfer-b2b" },
      { icon: Truck, label: "Stock Transfer[G2B]", page: "stock-transfer-g2b" },
      { icon: History, label: "Transfered Histories", page: "transfer-histories" },
    ],
  },
  { id: "product-ledger", type: "single", icon: ListTree, label: "Product Ledger Table", page: "product-ledger" },
];

const defaultAdminRoles = [
  { id: 1, name: "Accounts" },
  { id: 2, name: "Admin Manager" },
];

const defaultShopBranches = [
  { id: 1, name: "My Shop", address: "Shop-1205, Lift-0 Saha Ali Plaza, Mirpur-10, Dhaka-1216", type: "shop" },
  { id: 2, name: "My Business", address: "Dhaka", type: "shop" },
  { id: 3, name: "Godown Gulshan", address: "Arong Building, 10th Floor, Pallabi, Mirpur-12, Dhaka", type: "godown" },
  { id: 4, name: "Godown Kadamtali", address: "Komlanesa Steel Market, Chowrasta, Gazipur.", type: "godown" },
  { id: 5, name: "Godwon Badda", address: "lusto est magnam et", type: "godown" },
  { id: 6, name: "rana", address: "mirpur", type: "shop" },
  { id: 7, name: "rana2", address: "mirpur", type: "shop" },
];

const defaultBranchRoles = [
  { id: 1, name: "Manager" },
  { id: 2, name: "Assistant. Manager" },
  { id: 3, name: "MD.NAZRUL Islam" },
  { id: 4, name: "Branch Mangar 1" },
];

const branchAvailablePermissions = [
  "branch.customer.take.payment",
  "branch.deliveryman",
  "branch.expense",
  "branch.income",
  "branch.opening.own",
  "branch.supplier",
  "create.product",
];

const branchGrantedPermissionsDefault = [
  "branch.customers",
  "branch.damage.product",
  "branch.dashboard",
  "branch.hide.stock.price",
  "branch.product.purchase.price",
  "branch.product.stock",
  "branch.received.customer.due",
  "branch.reports",
  "branch.return.product",
  "branch.sell",
  "branch.sell.discount",
  "branch.setting",
  "stock.transfer.b2b.b2g",
  "stock.transfer.g2b",
];

const defaultCrmPermissions = [
  { id: 1, name: "crm.lead.view" },
  { id: 2, name: "crm.lead.create" },
  { id: 3, name: "crm.follow.up.reminder" },
  { id: 4, name: "crm.customer.notes" },
  { id: 5, name: "crm.deal.pipeline" },
];

const permissionWings = {
  Account_Wing: [
    "account.bank.and.cash",
    "account.capital",
    "account.customer.report",
    "account.dashboard",
    "account.expense",
    "account.income.statement",
    "account.indirect.income",
    "account.ledger.head",
    "account.list.of.group",
    "account.loan",
    "account.report",
    "account.statement",
    "account.transaction",
    "account.vouchers",
    "admin.transaction.vouchers",
  ],
  Godown_Wing: [
    "godown.dashboard",
    "godown.stock.in.out.report",
    "godown.stock.info",
    "godown.stock.out",
  ],
  Main_Wing: [
    "admin.branch.product.stock",
    "admin.crm",
    "admin.damage.product",
    "admin.dashboard",
  ],
  Supplier_Wing: [
    "supplier.dashboard",
    "supplier.due.report",
    "supplier.ledger",
    "supplier.payment",
  ],
};

// Default granted state per role — demo data so the two panels have
// something meaningful to show and toggle.
function defaultPermissionState() {
  const state = {};
  Object.entries(permissionWings).forEach(([wing, perms]) => {
    state[wing] = {};
    perms.forEach((p) => {
      const startsUnchecked = ["account.bank.and.cash", "account.capital", "account.customer.report", "account.dashboard"];
      state[wing][p] = !startsUnchecked.includes(p);
    });
  });
  return state;
}

const stockAlerts = [
  { name: "Cotton Panjabi — L", branch: "Mirpur-2", qty: "2 pcs" },
  { name: "Denim Jeans — 32", branch: "Uttara", qty: "4 pcs" },
  { name: "Kids T-Shirt — M", branch: "Mirpur-2", qty: "1 pc" },
];

const transactions = [
  { inv: "#INV-1042", name: "Rafiq Hasan", initials: "RH", branch: "Mirpur-2", status: "Paid", amount: "3,200.00" },
  { inv: "#INV-1041", name: "Nadia Akter", initials: "NA", branch: "Uttara", status: "Due", amount: "1,850.00" },
  { inv: "#INV-1040", name: "Shakil Islam", initials: "SI", branch: "Mirpur-2", status: "Paid", amount: "5,400.00" },
  { inv: "#INV-1039", name: "Mahin Jaman", initials: "MJ", branch: "Dhanmondi", status: "Due", amount: "900.00" },
];

function useClock() {
  const [time, setTime] = React.useState(new Date());
  React.useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function KpiCard({ item, patternId }) {
  const Icon = item.icon;
  return (
    <div
      className="relative rounded-2xl border p-4 pt-5 overflow-hidden"
      style={{ backgroundColor: C.panel, borderColor: C.line }}
    >
      <ScallopBorder id={patternId} colors={petals} />
      <div className="flex items-center justify-between mb-3 mt-1">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: item.bg, color: item.fg }}
        >
          <Icon size={16} strokeWidth={2.2} />
        </div>
        <span className="text-[11px] font-bold" style={{ color: item.up ? C.forest : C.vermillion, fontFamily: FONT_MONO }}>
          {item.up ? "▲" : "▼"} {item.trend}
        </span>
      </div>
      <div className="text-[12px] font-semibold mb-1" style={{ color: C.muted, fontFamily: FONT_BODY }}>
        {item.label}
      </div>
      <div className="text-[21px] font-bold tracking-tight" style={{ color: C.ink, fontFamily: FONT_MONO }}>
        {!item.noCurrency && (
          <span className="text-[13px] font-semibold mr-0.5" style={{ color: C.muted }}>
            ৳
          </span>
        )}
        {item.value}
      </div>
    </div>
  );
}

function SidebarNav({ activePage, onNavigate }) {
  // "Shop Setting & Others" starts open, matching the reference screenshot
  const [openId, setOpenId] = React.useState("shop-setting");

  return (
    <nav className="space-y-0.5 overflow-y-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isExpandable = item.type === "expandable";
        const isOpen = openId === item.id;
        const isActive = item.page && item.page === activePage;

        return (
          <div key={item.id}>
            <div
              onClick={() => {
                if (isExpandable) setOpenId(isOpen ? null : item.id);
                else if (item.page) onNavigate(item.page);
              }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium cursor-pointer transition-colors hover:bg-white/5 hover:text-white"
              style={
                isActive
                  ? { backgroundColor: `${C.marigold}2E`, color: "#fff", boxShadow: `inset 3px 0 0 0 ${C.marigold}` }
                  : { color: "#E7D9E0" }
              }
            >
              <Icon size={15} className="opacity-90 shrink-0" />
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <span
                  className="ml-auto shrink-0 text-white text-[9.5px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: C.mint }}
                >
                  {item.badge}
                </span>
              )}
              {isExpandable && !item.badge && (
                <ChevronDown
                  size={13}
                  className="ml-auto shrink-0 transition-transform"
                  style={{ transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)", opacity: 0.7 }}
                />
              )}
            </div>

            {isExpandable && isOpen && item.children.length > 0 && (
              <div className="ml-3.5 pl-3.5 py-1 space-y-0.5" style={{ borderLeft: "1px solid rgba(231,217,224,0.15)" }}>
                {item.children.map((child) => {
                  const childActive = child.page === activePage;
                  return (
                    <div
                      key={child.label}
                      onClick={() => child.page && onNavigate(child.page)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12.5px] font-medium cursor-pointer hover:bg-white/5 hover:text-white"
                      style={{
                        color: childActive ? "#fff" : child.tint ? C.mint : "#D8C7D2",
                        backgroundColor: childActive ? "rgba(255,255,255,0.06)" : "transparent",
                      }}
                    >
                      <ChevronRight size={12} className="opacity-70 shrink-0" />
                      <span className="truncate">{child.label}</span>
                      {child.badge && (
                        <span
                          className="ml-auto shrink-0 text-[10px] font-bold"
                          style={{ color: C.marigold }}
                        >
                          ({child.badge})
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/* ---------------------------------------------------------
   REUSABLE FORM PIECES for settings-style pages
---------------------------------------------------------- */
function FieldLabel({ children, required }) {
  return (
    <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: C.ink, fontFamily: FONT_BODY }}>
      {required && <span style={{ color: C.vermillion }}>*</span>}
      {children}
    </label>
  );
}

function TextField({ label, required, placeholder, defaultValue, type = "text" }) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none transition-colors focus:ring-2"
        style={{
          backgroundColor: C.paper,
          borderColor: C.line,
          color: C.ink,
          fontFamily: FONT_BODY,
        }}
        onFocus={(e) => (e.target.style.borderColor = C.magenta)}
        onBlur={(e) => (e.target.style.borderColor = C.line)}
      />
    </div>
  );
}

function barcodePattern(text) {
  const bars = [];
  const push = (w) => bars.push({ w, black: bars.length % 2 === 0 });
  // start guard
  push(3);
  push(1);
  push(3);
  for (const ch of text || "") {
    const code = ch.charCodeAt(0);
    for (let b = 5; b >= 0; b--) {
      const bit = (code >> b) & 1;
      push(bit ? 3 : 1);
    }
  }
  // end guard
  push(3);
  push(1);
  push(3);
  return bars;
}

function BarcodeSVG({ value }) {
  const bars = React.useMemo(() => barcodePattern(value), [value]);
  const unit = 2.6;
  let x = 0;
  const rects = [];
  bars.forEach((bar, i) => {
    const width = bar.w * unit;
    if (bar.black) {
      rects.push(<rect key={i} x={x} y={0} width={width} height={72} fill="#141414" />);
    }
    x += width;
  });
  const totalWidth = x || 1;
  return (
    <svg viewBox={`0 0 ${totalWidth} 72`} width="100%" height="72" preserveAspectRatio="xMidYMid meet">
      {rects}
    </svg>
  );
}

function RadioOption({ name, label, value, checked, onChange, dotColor }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <span
        className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
        style={{ borderColor: checked ? dotColor : C.line }}
        onClick={() => onChange(value)}
      >
        {checked && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />}
      </span>
      <span
        className="text-[13px] font-medium"
        style={{ color: checked ? C.ink : C.muted }}
        onClick={() => onChange(value)}
      >
        {label}
      </span>
      <input type="radio" name={name} className="sr-only" checked={checked} onChange={() => onChange(value)} />
    </label>
  );
}

function SelectField({ label, required, placeholder, options = [] }) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className="relative">
        <select
          defaultValue=""
          className="w-full appearance-none rounded-lg px-3.5 py-2.5 text-[13px] border outline-none cursor-pointer"
          style={{ backgroundColor: C.paper, borderColor: C.line, color: C.ink, fontFamily: FONT_BODY }}
        >
          <option value="" disabled style={{ color: C.muted }}>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: C.muted }}
        />
      </div>
    </div>
  );
}

function AddNewProductPage() {
  const [discountStatus, setDiscountStatus] = React.useState("No");
  const [vatStatus, setVatStatus] = React.useState("No");
  const [fileName, setFileName] = React.useState("");
  const [barcode, setBarcode] = React.useState("");
  const [generatedCode, setGeneratedCode] = React.useState("");
  const [showBarcode, setShowBarcode] = React.useState(false);

  const handleGenerateBarcode = () => {
    const trimmed = barcode.trim();
    const code = trimmed || Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join("");
    setBarcode(code);
    setGeneratedCode(code);
    setShowBarcode(true);
  };

  return (
    <div className="relative rounded-2xl p-6 pt-7 border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
      <ScallopBorder id="scallop-add-product" colors={petals} />
      <h2 className="font-bold text-[16px] mb-5" style={{ fontFamily: FONT_HEAD, color: C.ink }}>
        Add New Product
      </h2>

      <div className="space-y-5">
        <div>
          <FieldLabel required>Product Title</FieldLabel>
          <textarea
            rows={1}
            placeholder="e.g. Cotton Panjabi — Full Sleeve"
            className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none resize-y"
            style={{ backgroundColor: C.paper, borderColor: C.line, color: C.ink, fontFamily: FONT_BODY }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <SelectField
            label="Product Brand"
            placeholder="-- Select Brand --"
            options={["Aarong", "Yellow", "Ecstasy", "Sailor"]}
          />
          <SelectField
            label="Product Category"
            required
            placeholder="-- Select Category --"
            options={["Panjabi", "Shirt", "Jeans", "T-Shirt", "Kids Wear"]}
          />
          <SelectField
            label="Unit Type"
            required
            placeholder="-- Select Unit Type --"
            options={["Pcs", "Kg", "Dozen", "Box"]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-end">
          <TextField label="Purchase Price" required placeholder="0.00" />
          <TextField label="Selling Price" required placeholder="0.00" />
          <div>
            <FieldLabel>Image (80 X 80)</FieldLabel>
            <div className="flex items-center gap-3">
              <label
                className="flex items-center gap-2 rounded-lg border cursor-pointer overflow-hidden text-[12.5px] font-medium shrink-0"
                style={{ borderColor: C.line, backgroundColor: C.paper, color: C.muted }}
              >
                <span
                  className="px-3 py-2.5 font-semibold"
                  style={{ backgroundColor: C.line, color: C.ink }}
                >
                  Choose File
                </span>
                <span className="pr-3 truncate max-w-[100px]">{fileName || "No file chosen"}</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                />
              </label>
              <div
                className="w-11 h-11 rounded-lg border flex items-center justify-center shrink-0"
                style={{ borderColor: C.line, backgroundColor: C.paper, color: C.muted }}
              >
                <ImageIcon size={16} />
              </div>
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl p-5 border" style={{ backgroundColor: C.paper, borderColor: C.line }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <FieldLabel>Discount Status</FieldLabel>
              <div className="flex items-center gap-5 mt-1">
                <RadioOption name="discount" label="Flat" value="Flat" checked={discountStatus === "Flat"} onChange={setDiscountStatus} dotColor={C.forest} />
                <RadioOption name="discount" label="Percent" value="Percent" checked={discountStatus === "Percent"} onChange={setDiscountStatus} dotColor={C.peacock} />
                <RadioOption name="discount" label="No" value="No" checked={discountStatus === "No"} onChange={setDiscountStatus} dotColor={C.vermillion} />
              </div>
            </div>

            <div>
              <FieldLabel>Vat Status</FieldLabel>
              <div className="flex items-center gap-5 mt-1">
                <RadioOption name="vat" label="Yes" value="Yes" checked={vatStatus === "Yes"} onChange={setVatStatus} dotColor={C.forest} />
                <RadioOption name="vat" label="No" value="No" checked={vatStatus === "No"} onChange={setVatStatus} dotColor={C.vermillion} />
              </div>
            </div>

            <div>
              <FieldLabel>Alert Quantity</FieldLabel>
              <p className="text-[11.5px] mb-2 -mt-1" style={{ color: C.muted }}>
                When the alert quantity reached it will show in{" "}
                <span className="font-semibold cursor-pointer" style={{ color: C.peacock }}>
                  here
                </span>
              </p>
              <input
                placeholder="0"
                className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none"
                style={{ backgroundColor: C.panel, borderColor: C.line, color: C.ink, fontFamily: FONT_BODY }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <FieldLabel>Description</FieldLabel>
            <textarea
              rows={4}
              placeholder="Short product description…"
              className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none resize-y"
              style={{ backgroundColor: C.paper, borderColor: C.line, color: C.ink, fontFamily: FONT_BODY }}
            />
          </div>

          <div>
            <FieldLabel>Barcode</FieldLabel>
            <input
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Barcode will appear here"
              className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none mb-3"
              style={{ backgroundColor: C.paper, borderColor: C.line, color: C.ink, fontFamily: FONT_MONO }}
            />
            <button
              onClick={handleGenerateBarcode}
              className="w-full text-white font-bold text-[13.5px] py-3 rounded-lg shadow-md"
              style={{ backgroundColor: C.forest, boxShadow: `0 4px 10px ${C.forest}40` }}
            >
              Generate Barcode
            </button>
          </div>
        </div>

        {showBarcode && (
          <div
            className="rounded-2xl border p-6 flex flex-col items-center justify-center gap-3"
            style={{ backgroundColor: C.panel, borderColor: C.line }}
          >
            <div className="w-full max-w-md">
              <BarcodeSVG value={generatedCode} />
            </div>
            <div
              className="font-bold text-[13.5px] tracking-[0.35em]"
              style={{ color: C.ink, fontFamily: FONT_MONO }}
            >
              {generatedCode}
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end gap-3">
          <button
            className="font-semibold text-[13px] px-5 py-2.5 rounded-lg border"
            style={{ borderColor: C.line, color: C.muted, backgroundColor: C.panel }}
          >
            Cancel
          </button>
          <button
            className="text-white font-semibold text-[13px] px-5 py-2.5 rounded-lg shadow-md"
            style={{ backgroundColor: C.magenta, boxShadow: `0 4px 10px ${C.magenta}40` }}
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}

function UploadProductCSVPage() {
  const [fileName, setFileName] = React.useState("");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5 items-stretch">
      {/* LEFT: file select + upload */}
      <div className="relative rounded-2xl p-6 pt-7 border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
        <ScallopBorder id="scallop-csv-left" colors={petals} />
        <FieldLabel>Select File</FieldLabel>
        <label
          className="flex items-center gap-2 rounded-lg border cursor-pointer overflow-hidden text-[12.5px] font-medium mb-4 max-w-md"
          style={{ borderColor: C.line, backgroundColor: C.paper, color: C.muted }}
        >
          <span className="px-3 py-2.5 font-semibold" style={{ backgroundColor: C.line, color: C.ink }}>
            Choose File
          </span>
          <span className="pr-3 truncate">{fileName || "No file chosen"}</span>
          <input type="file" accept=".csv" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
        </label>

        <button
          className="text-white font-semibold text-[13px] px-5 py-2.5 rounded-lg shadow-md"
          style={{ backgroundColor: C.purple, boxShadow: `0 4px 10px ${C.purple}40` }}
        >
          Upload
        </button>
      </div>

      {/* RIGHT: procedure + downloads */}
      <div className="relative rounded-2xl p-6 pt-7 border overflow-hidden flex flex-col gap-3" style={{ backgroundColor: C.paper, borderColor: C.line }}>
        <ScallopBorder id="scallop-csv-right" colors={petals} />
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <HelpCircle size={15} style={{ color: C.peacock }} />
          <span className="font-bold text-[13.5px]" style={{ color: C.peacock, fontFamily: FONT_HEAD }}>
            Procedure
          </span>
        </div>

        <button
          className="w-full text-white font-bold text-[13px] py-3 rounded-lg flex items-center justify-center gap-2 shadow-md"
          style={{ backgroundColor: C.peacock, boxShadow: `0 4px 10px ${C.peacock}40` }}
        >
          <Download size={14} /> Product Demo CSV Download
        </button>

        <button
          className="w-full text-white font-bold text-[13px] py-3 rounded-lg flex items-center justify-center gap-2 shadow-md"
          style={{ backgroundColor: C.forest, boxShadow: `0 4px 10px ${C.forest}40` }}
        >
          <Download size={14} /> Existing all Product CSV Download
        </button>
      </div>
    </div>
  );
}

function LabelCard({ title, price, code }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-1 border border-dashed rounded-md py-2.5 px-2 bg-white break-inside-avoid"
      style={{ borderColor: "#D8D0C0" }}
    >
      <div className="text-[10px] font-bold truncate w-full text-center" style={{ color: "#141414" }}>
        {title || "Product Name"}
      </div>
      <div className="w-full px-1">
        <BarcodeSVG value={code} />
      </div>
      <div className="text-[9px] font-mono tracking-[0.2em]" style={{ color: "#141414" }}>
        {code}
      </div>
      {price && (
        <div className="text-[11px] font-extrabold" style={{ color: "#141414" }}>
          ৳{price}
        </div>
      )}
    </div>
  );
}

function PrintBarcodeLabelsPage() {
  const [title, setTitle] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [code, setCode] = React.useState("");
  const [qty, setQty] = React.useState(6);
  const [items, setItems] = React.useState([]);

  const randomCode = () => Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join("");

  const handleNewBarcode = () => setCode(randomCode());

  const handleAddToSheet = () => {
    const finalCode = code.trim() || randomCode();
    const nextId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    setItems((prev) => [
      ...prev,
      {
        id: nextId,
        title: title.trim() || "Product Name",
        price: price.trim(),
        code: finalCode,
        qty: Math.max(1, Number(qty) || 1),
      },
    ]);
    setTitle("");
    setPrice("");
    setCode("");
    setQty(6);
  };

  const handleRemove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const handleRegenerateItem = (id) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, code: randomCode() } : i)));

  const totalLabels = items.reduce((sum, i) => sum + i.qty, 0);

  const handlePrint = () => window.print();

  const inputStyle = {
    backgroundColor: C.paper,
    borderColor: C.line,
    color: C.ink,
    fontFamily: FONT_BODY,
  };
  const inputClass = "w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-5 items-start">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #label-print-area, #label-print-area * { visibility: visible; }
          #label-print-area {
            position: absolute; left: 0; top: 0; width: 100%;
            background: #fff !important; padding: 12px;
          }
        }
      `}</style>

      {/* LEFT: builder form (hidden on print) */}
      <div
        className="relative rounded-2xl p-6 pt-7 border overflow-hidden print:hidden"
        style={{ backgroundColor: C.panel, borderColor: C.line }}
      >
        <ScallopBorder id="scallop-label-form" colors={petals} />
        <h2 className="font-bold text-[16px] mb-5" style={{ fontFamily: FONT_HEAD, color: C.ink }}>
          Add Label
        </h2>

        <div className="space-y-4">
          <div>
            <FieldLabel>Product Title</FieldLabel>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cotton Panjabi — L"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Price</FieldLabel>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <FieldLabel>Copies</FieldLabel>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Barcode</FieldLabel>
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Type or generate"
                className={inputClass}
                style={{ ...inputStyle, fontFamily: FONT_MONO }}
              />
              <button
                onClick={handleNewBarcode}
                title="Generate new barcode"
                className="shrink-0 w-11 rounded-lg border flex items-center justify-center"
                style={{ borderColor: C.line, backgroundColor: C.peacockTint, color: C.peacock }}
              >
                <RefreshCcw size={15} />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToSheet}
            className="w-full text-white font-semibold text-[13px] py-2.5 rounded-lg shadow-md flex items-center justify-center gap-1.5"
            style={{ backgroundColor: C.magenta, boxShadow: `0 4px 10px ${C.magenta}40` }}
          >
            <Plus size={14} /> Add to Sheet
          </button>
        </div>
      </div>

      {/* RIGHT: label sheet preview + print */}
      <div className="relative rounded-2xl p-6 pt-7 border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
        <ScallopBorder id="scallop-label-sheet" colors={petals} />

        <div className="flex items-center justify-between mb-4 flex-wrap gap-3 print:hidden">
          <h2 className="font-bold text-[16px] flex items-center gap-2" style={{ fontFamily: FONT_HEAD, color: C.ink }}>
            Label Sheet
            <span
              className="text-[10.5px] font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: C.forestTint, color: C.forestDark }}
            >
              {totalLabels} labels
            </span>
          </h2>
          <button
            onClick={handlePrint}
            disabled={items.length === 0}
            className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md disabled:opacity-40"
            style={{ backgroundColor: C.forest, boxShadow: `0 4px 10px ${C.forest}40` }}
          >
            <Printer size={14} /> Print Labels
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center print:hidden">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: C.marigoldTint, color: C.rust }}
            >
              <Printer size={20} />
            </div>
            <p className="text-[13px]" style={{ color: C.muted }}>
              Add a product on the left to build your label sheet.
            </p>
          </div>
        ) : (
          <>
            <div id="label-print-area" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {items.flatMap((item) =>
                Array.from({ length: item.qty }, (_, k) => (
                  <LabelCard key={`${item.id}-${k}`} title={item.title} price={item.price} code={item.code} />
                ))
              )}
            </div>

            <div className="mt-5 pt-4 print:hidden" style={{ borderTop: `1px dashed ${C.line}` }}>
              <div className="text-[12.5px] font-bold mb-2.5" style={{ color: C.ink, fontFamily: FONT_HEAD }}>
                Items in this sheet
              </div>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 border"
                    style={{ borderColor: C.line, backgroundColor: C.paper }}
                  >
                    <div className="min-w-0">
                      <div className="text-[12.5px] font-semibold truncate" style={{ color: C.ink }}>
                        {item.title} {item.price && <span style={{ color: C.muted }}>· ৳{item.price}</span>}
                      </div>
                      <div className="text-[11px]" style={{ color: C.muted, fontFamily: FONT_MONO }}>
                        {item.code} · {item.qty} copies
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleRegenerateItem(item.id)}
                        title="Regenerate barcode"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: C.peacock }}
                      >
                        <RefreshCcw size={13} />
                      </button>
                      <button
                        onClick={() => handleRemove(item.id)}
                        title="Remove"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: C.vermillion }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const defaultBrands = [
  { id: 1, name: "Aarong" },
  { id: 2, name: "Yellow" },
  { id: 3, name: "Ecstasy" },
  { id: 4, name: "Sailor" },
  { id: 5, name: "Richman" },
];

function BrandsPage() {
  const [brands, setBrands] = React.useState(defaultBrands);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingBrand, setEditingBrand] = React.useState(null);

  const handleCreate = (name) => {
    const nextId = brands.length ? Math.max(...brands.map((b) => b.id)) + 1 : 1;
    setBrands((prev) => [...prev, { id: nextId, name }]);
    setShowAddModal(false);
  };

  const handleUpdate = (name) => {
    setBrands((prev) => prev.map((b) => (b.id === editingBrand.id ? { ...b, name } : b)));
    setEditingBrand(null);
  };

  const handleDelete = (id) => setBrands((prev) => prev.filter((b) => b.id !== id));

  return (
    <div className="relative rounded-2xl p-6 pt-7 border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
      <ScallopBorder id="scallop-brands" colors={petals} />
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="font-bold text-[16px]" style={{ fontFamily: FONT_HEAD, color: C.ink }}>
          Brands
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md"
          style={{ backgroundColor: C.marigold, boxShadow: `0 4px 10px ${C.marigold}40` }}
        >
          <Plus size={14} /> Add New Brand
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left" style={{ color: C.muted }}>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>SI</th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>Brand Name</th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b, i) => (
              <tr key={b.id} style={i !== brands.length - 1 ? { borderBottom: `1px solid ${C.line}` } : undefined}>
                <td className="py-3 px-2.5" style={{ color: C.muted, fontFamily: FONT_MONO }}>{b.id}</td>
                <td className="py-3 px-2.5 font-semibold" style={{ color: C.ink }}>{b.name}</td>
                <td className="py-3 px-2.5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingBrand(b)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: C.peacock }}>
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(b.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: C.vermillion }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {brands.length === 0 && (
              <tr><td colSpan={3} className="py-8 text-center text-[13px]" style={{ color: C.muted }}>No brands added yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <AddRoleModal
          onClose={() => setShowAddModal(false)}
          onCreate={handleCreate}
          accentColor={C.marigold}
          title="Add New Brand"
          fieldLabel="Brand Name"
          placeholder="e.g. Aarong"
          buttonLabel="Add Brand"
        />
      )}

      {editingBrand && (
        <AddRoleModal
          onClose={() => setEditingBrand(null)}
          onCreate={handleUpdate}
          accentColor={C.peacock}
          title="Edit Brand"
          fieldLabel="Brand Name"
          placeholder="e.g. Aarong"
          buttonLabel="Save Changes"
          initialValue={editingBrand.name}
        />
      )}
    </div>
  );
}

const defaultCategories = [
  { id: 1, name: "Panjabi" },
  { id: 2, name: "Shirt" },
  { id: 3, name: "Jeans" },
  { id: 4, name: "T-Shirt" },
  { id: 5, name: "Kids Wear" },
  { id: 6, name: "Saree" },
];

function CategoriesPage() {
  const [categories, setCategories] = React.useState(defaultCategories);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState(null);

  const handleCreate = (name) => {
    const nextId = categories.length ? Math.max(...categories.map((c) => c.id)) + 1 : 1;
    setCategories((prev) => [...prev, { id: nextId, name }]);
    setShowAddModal(false);
  };

  const handleUpdate = (name) => {
    setCategories((prev) => prev.map((c) => (c.id === editingCategory.id ? { ...c, name } : c)));
    setEditingCategory(null);
  };

  const handleDelete = (id) => setCategories((prev) => prev.filter((c) => c.id !== id));

  return (
    <div className="relative rounded-2xl p-6 pt-7 border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
      <ScallopBorder id="scallop-categories" colors={petals} />
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="font-bold text-[16px]" style={{ fontFamily: FONT_HEAD, color: C.ink }}>
          Categories
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md"
          style={{ backgroundColor: C.forest, boxShadow: `0 4px 10px ${C.forest}40` }}
        >
          <Plus size={14} /> Add New Category
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left" style={{ color: C.muted }}>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>SI</th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>Category Name</th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => (
              <tr key={cat.id} style={i !== categories.length - 1 ? { borderBottom: `1px solid ${C.line}` } : undefined}>
                <td className="py-3 px-2.5" style={{ color: C.muted, fontFamily: FONT_MONO }}>{cat.id}</td>
                <td className="py-3 px-2.5 font-semibold" style={{ color: C.ink }}>{cat.name}</td>
                <td className="py-3 px-2.5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingCategory(cat)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: C.peacock }}>
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: C.vermillion }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={3} className="py-8 text-center text-[13px]" style={{ color: C.muted }}>No categories added yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <AddRoleModal
          onClose={() => setShowAddModal(false)}
          onCreate={handleCreate}
          accentColor={C.forest}
          title="Add New Category"
          fieldLabel="Category Name"
          placeholder="e.g. Panjabi"
          buttonLabel="Add Category"
        />
      )}

      {editingCategory && (
        <AddRoleModal
          onClose={() => setEditingCategory(null)}
          onCreate={handleUpdate}
          accentColor={C.peacock}
          title="Edit Category"
          fieldLabel="Category Name"
          placeholder="e.g. Panjabi"
          buttonLabel="Save Changes"
          initialValue={editingCategory.name}
        />
      )}
    </div>
  );
}

const defaultUnitTypes = [
  { id: 1, name: "Pieces", short: "Pcs" },
  { id: 2, name: "Kilogram", short: "Kg" },
  { id: 3, name: "Dozen", short: "Dz" },
  { id: 4, name: "Box", short: "Box" },
];

function AddUnitTypeModal({ onClose, onCreate, title = "Add New Unit Type", buttonLabel = "Add Unit Type", initialName = "", initialShort = "" }) {
  const [name, setName] = React.useState(initialName);
  const [short, setShort] = React.useState(initialShort);
  const inputRef = React.useRef(null);

  React.useEffect(() => { inputRef.current?.focus(); }, []);

  const handleCreate = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    onCreate(trimmedName, short.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(43,35,32,0.45)" }} onClick={onClose}>
      <div className="relative w-full max-w-sm rounded-2xl border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }} onClick={(e) => e.stopPropagation()}>
        <ScallopBorder id="scallop-add-unit" colors={petals} />
        <div className="p-6 pt-7">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[15.5px]" style={{ fontFamily: FONT_HEAD, color: C.ink }}>{title}</h3>
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: C.paper, color: C.muted }}>
              <X size={14} />
            </button>
          </div>

          <div className="space-y-4 mb-5">
            <div>
              <FieldLabel required>Unit Name</FieldLabel>
              <input ref={inputRef} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Kilogram"
                className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none"
                style={{ backgroundColor: C.paper, borderColor: C.line, color: C.ink, fontFamily: FONT_BODY }} />
            </div>
            <div>
              <FieldLabel>Short Code</FieldLabel>
              <input value={short} onChange={(e) => setShort(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleCreate()} placeholder="e.g. Kg"
                className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none"
                style={{ backgroundColor: C.paper, borderColor: C.line, color: C.ink, fontFamily: FONT_MONO }} />
            </div>
          </div>

          <div className="flex justify-end gap-2.5">
            <button onClick={onClose} className="font-semibold text-[12.5px] px-4 py-2.5 rounded-lg border" style={{ borderColor: C.line, color: C.muted, backgroundColor: C.panel }}>
              Cancel
            </button>
            <button onClick={handleCreate} disabled={!name.trim()} className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg shadow-md disabled:opacity-40"
              style={{ backgroundColor: C.peacock, boxShadow: `0 4px 10px ${C.peacock}40` }}>
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UnitTypesPage() {
  const [units, setUnits] = React.useState(defaultUnitTypes);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingUnit, setEditingUnit] = React.useState(null);

  const handleCreate = (name, short) => {
    const nextId = units.length ? Math.max(...units.map((u) => u.id)) + 1 : 1;
    setUnits((prev) => [...prev, { id: nextId, name, short: short || name.slice(0, 3) }]);
    setShowAddModal(false);
  };

  const handleUpdate = (name, short) => {
    setUnits((prev) =>
      prev.map((u) => (u.id === editingUnit.id ? { ...u, name, short: short || name.slice(0, 3) } : u))
    );
    setEditingUnit(null);
  };

  const handleDelete = (id) => setUnits((prev) => prev.filter((u) => u.id !== id));

  return (
    <div className="relative rounded-2xl p-6 pt-7 border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
      <ScallopBorder id="scallop-units" colors={petals} />
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="font-bold text-[16px]" style={{ fontFamily: FONT_HEAD, color: C.ink }}>
          Unit Types
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md"
          style={{ backgroundColor: C.peacock, boxShadow: `0 4px 10px ${C.peacock}40` }}
        >
          <Plus size={14} /> Add New Unit Type
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left" style={{ color: C.muted }}>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>SI</th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>Unit Name</th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>Short Code</th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u, i) => (
              <tr key={u.id} style={i !== units.length - 1 ? { borderBottom: `1px solid ${C.line}` } : undefined}>
                <td className="py-3 px-2.5" style={{ color: C.muted, fontFamily: FONT_MONO }}>{u.id}</td>
                <td className="py-3 px-2.5 font-semibold" style={{ color: C.ink }}>{u.name}</td>
                <td className="py-3 px-2.5">
                  <span className="text-[11.5px] font-bold px-2.5 py-1 rounded-lg" style={{ backgroundColor: C.peacockTint, color: C.peacock, fontFamily: FONT_MONO }}>
                    {u.short}
                  </span>
                </td>
                <td className="py-3 px-2.5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingUnit(u)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: C.peacock }}>
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(u.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: C.vermillion }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {units.length === 0 && (
              <tr><td colSpan={4} className="py-8 text-center text-[13px]" style={{ color: C.muted }}>No unit types added yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && <AddUnitTypeModal onClose={() => setShowAddModal(false)} onCreate={handleCreate} />}

      {editingUnit && (
        <AddUnitTypeModal
          onClose={() => setEditingUnit(null)}
          onCreate={handleUpdate}
          title="Edit Unit Type"
          buttonLabel="Save Changes"
          initialName={editingUnit.name}
          initialShort={editingUnit.short}
        />
      )}
    </div>
  );
}

const defaultVariations = [
  { id: 1, name: "Size", values: ["S", "M", "L", "XL", "XXL"] },
  { id: 2, name: "Color", values: ["Red", "Blue", "Black", "White"] },
];

const variationChipColors = [C.magenta, C.peacock, C.forest, C.marigold, C.purple, C.rust];

function AddVariationModal({ onClose, onCreate, title = "Add New Variation", buttonLabel = "Add Variation", initialName = "", initialValues = "" }) {
  const [name, setName] = React.useState(initialName);
  const [values, setValues] = React.useState(initialValues);
  const inputRef = React.useRef(null);

  React.useEffect(() => { inputRef.current?.focus(); }, []);

  const handleCreate = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const valueList = values.split(",").map((v) => v.trim()).filter(Boolean);
    onCreate(trimmedName, valueList);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(43,35,32,0.45)" }} onClick={onClose}>
      <div className="relative w-full max-w-sm rounded-2xl border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }} onClick={(e) => e.stopPropagation()}>
        <ScallopBorder id="scallop-add-variation" colors={petals} />
        <div className="p-6 pt-7">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[15.5px]" style={{ fontFamily: FONT_HEAD, color: C.ink }}>{title}</h3>
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: C.paper, color: C.muted }}>
              <X size={14} />
            </button>
          </div>

          <div className="space-y-4 mb-5">
            <div>
              <FieldLabel required>Variation Name</FieldLabel>
              <input ref={inputRef} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Size"
                className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none"
                style={{ backgroundColor: C.paper, borderColor: C.line, color: C.ink, fontFamily: FONT_BODY }} />
            </div>
            <div>
              <FieldLabel>Values (comma separated)</FieldLabel>
              <input value={values} onChange={(e) => setValues(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleCreate()} placeholder="e.g. S, M, L, XL"
                className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none"
                style={{ backgroundColor: C.paper, borderColor: C.line, color: C.ink, fontFamily: FONT_BODY }} />
            </div>
          </div>

          <div className="flex justify-end gap-2.5">
            <button onClick={onClose} className="font-semibold text-[12.5px] px-4 py-2.5 rounded-lg border" style={{ borderColor: C.line, color: C.muted, backgroundColor: C.panel }}>
              Cancel
            </button>
            <button onClick={handleCreate} disabled={!name.trim()} className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg shadow-md disabled:opacity-40"
              style={{ backgroundColor: C.purple, boxShadow: `0 4px 10px ${C.purple}40` }}>
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VariationsPage() {
  const [variations, setVariations] = React.useState(defaultVariations);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingVariation, setEditingVariation] = React.useState(null);

  const handleCreate = (name, values) => {
    const nextId = variations.length ? Math.max(...variations.map((v) => v.id)) + 1 : 1;
    setVariations((prev) => [...prev, { id: nextId, name, values }]);
    setShowAddModal(false);
  };

  const handleUpdate = (name, values) => {
    setVariations((prev) => prev.map((v) => (v.id === editingVariation.id ? { ...v, name, values } : v)));
    setEditingVariation(null);
  };

  const handleDelete = (id) => setVariations((prev) => prev.filter((v) => v.id !== id));

  return (
    <div className="relative rounded-2xl p-6 pt-7 border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
      <ScallopBorder id="scallop-variations" colors={petals} />
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="font-bold text-[16px] flex items-center gap-2" style={{ fontFamily: FONT_HEAD, color: C.ink }}>
          Variations
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: C.mint }}>New</span>
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md"
          style={{ backgroundColor: C.purple, boxShadow: `0 4px 10px ${C.purple}40` }}
        >
          <Plus size={14} /> Add New Variation
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left" style={{ color: C.muted }}>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>SI</th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>Variation Name</th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>Values</th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {variations.map((v, i) => (
              <tr key={v.id} style={i !== variations.length - 1 ? { borderBottom: `1px solid ${C.line}` } : undefined}>
                <td className="py-3 px-2.5 align-top" style={{ color: C.muted, fontFamily: FONT_MONO }}>{v.id}</td>
                <td className="py-3 px-2.5 align-top font-semibold" style={{ color: C.ink }}>{v.name}</td>
                <td className="py-3 px-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    {v.values.map((val, k) => {
                      const color = variationChipColors[k % variationChipColors.length];
                      return (
                        <span key={val} className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: `${color}1F`, color }}>
                          {val}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="py-3 px-2.5 align-top">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingVariation(v)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: C.peacock }}>
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(v.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: C.vermillion }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {variations.length === 0 && (
              <tr><td colSpan={4} className="py-8 text-center text-[13px]" style={{ color: C.muted }}>No variations added yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && <AddVariationModal onClose={() => setShowAddModal(false)} onCreate={handleCreate} />}

      {editingVariation && (
        <AddVariationModal
          onClose={() => setEditingVariation(null)}
          onCreate={handleUpdate}
          title="Edit Variation"
          buttonLabel="Save Changes"
          initialName={editingVariation.name}
          initialValues={editingVariation.values.join(", ")}
        />
      )}
    </div>
  );
}

const defaultAllProducts = [
  { id: 1, name: "Cotton Panjabi — L", category: "Panjabi", brand: "Aarong", purchase: "850.00", selling: "1,450.00", stock: 24 },
  { id: 2, name: "Denim Jeans — 32", category: "Jeans", brand: "Yellow", purchase: "1,100.00", selling: "1,890.00", stock: 4 },
  { id: 3, name: "Kids T-Shirt — M", category: "Kids Wear", brand: "Ecstasy", purchase: "220.00", selling: "390.00", stock: 1 },
  { id: 4, name: "Formal Shirt — XL", category: "Shirt", brand: "Sailor", purchase: "650.00", selling: "1,150.00", stock: 32 },
  { id: 5, name: "Printed Saree", category: "Saree", brand: "Richman", purchase: "1,800.00", selling: "2,950.00", stock: 9 },
  { id: 6, name: "Cotton Panjabi — XL", category: "Panjabi", brand: "Aarong", purchase: "870.00", selling: "1,490.00", stock: 15 },
];

function EditProductModal({ product, onClose, onSave }) {
  const [name, setName] = React.useState(product.name);
  const [category, setCategory] = React.useState(product.category);
  const [brand, setBrand] = React.useState(product.brand);
  const [purchase, setPurchase] = React.useState(product.purchase);
  const [selling, setSelling] = React.useState(product.selling);
  const [stock, setStock] = React.useState(String(product.stock));
  const inputRef = React.useRef(null);

  React.useEffect(() => { inputRef.current?.focus(); }, []);

  const fieldStyle = { backgroundColor: C.paper, borderColor: C.line, color: C.ink, fontFamily: FONT_BODY };
  const fieldClass = "w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none";

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave({
      ...product,
      name: trimmed,
      category: category.trim() || product.category,
      brand: brand.trim() || product.brand,
      purchase: purchase.trim() || product.purchase,
      selling: selling.trim() || product.selling,
      stock: Math.max(0, Number(stock) || 0),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ backgroundColor: "rgba(43,35,32,0.45)" }} onClick={onClose}>
      <div
        className="relative w-full sm:max-w-lg max-h-[92vh] sm:max-h-[85vh] overflow-hidden rounded-t-2xl sm:rounded-2xl border flex flex-col"
        style={{ backgroundColor: C.panel, borderColor: C.line }}
        onClick={(e) => e.stopPropagation()}
      >
        <ScallopBorder id="scallop-edit-product" colors={petals} />
        <div className="flex items-center justify-between px-6 pt-7 pb-3 shrink-0">
          <h3 className="font-bold text-[16px]" style={{ fontFamily: FONT_HEAD, color: C.ink }}>
            Edit Product
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: C.paper, color: C.muted }}>
            <X size={16} />
          </button>
        </div>

        <div className="px-6 pb-6 overflow-y-auto space-y-4">
          <div>
            <FieldLabel required>Product Name</FieldLabel>
            <input ref={inputRef} value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} style={fieldStyle} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Category</FieldLabel>
              <input value={category} onChange={(e) => setCategory(e.target.value)} className={fieldClass} style={fieldStyle} />
            </div>
            <div>
              <FieldLabel>Brand</FieldLabel>
              <input value={brand} onChange={(e) => setBrand(e.target.value)} className={fieldClass} style={fieldStyle} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <FieldLabel>Purchase Price</FieldLabel>
              <input value={purchase} onChange={(e) => setPurchase(e.target.value)} className={fieldClass} style={{ ...fieldStyle, fontFamily: FONT_MONO }} />
            </div>
            <div>
              <FieldLabel>Selling Price</FieldLabel>
              <input value={selling} onChange={(e) => setSelling(e.target.value)} className={fieldClass} style={{ ...fieldStyle, fontFamily: FONT_MONO }} />
            </div>
            <div>
              <FieldLabel>Stock</FieldLabel>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className={fieldClass} style={{ ...fieldStyle, fontFamily: FONT_MONO }} />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button onClick={onClose} className="font-semibold text-[13px] px-5 py-2.5 rounded-lg border" style={{ borderColor: C.line, color: C.muted, backgroundColor: C.panel }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={!name.trim()} className="text-white font-semibold text-[13px] px-5 py-2.5 rounded-lg shadow-md disabled:opacity-40"
              style={{ backgroundColor: C.magenta, boxShadow: `0 4px 10px ${C.magenta}40` }}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AllProductsPage({ onNavigate }) {
  const [products, setProducts] = React.useState(defaultAllProducts);
  const [query, setQuery] = React.useState("");
  const [editingProduct, setEditingProduct] = React.useState(null);

  const handleDelete = (id) => setProducts((prev) => prev.filter((p) => p.id !== id));

  const handleSaveProduct = (updated) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditingProduct(null);
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      p.brand.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative rounded-2xl p-6 pt-7 border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
      <ScallopBorder id="scallop-all-products" colors={petals} />
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="font-bold text-[16px]" style={{ fontFamily: FONT_HEAD, color: C.ink }}>
          All Products
        </h2>
        <div className="flex items-center gap-2.5 flex-wrap">
          <div
            className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] border"
            style={{ backgroundColor: C.paper, borderColor: C.line, color: C.muted }}
          >
            <Search size={14} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search product, brand, category…"
              className="bg-transparent outline-none text-[13px] w-44"
              style={{ color: C.ink, fontFamily: FONT_BODY }}
            />
          </div>
          <button
            onClick={() => onNavigate && onNavigate("add-new-product")}
            className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md"
            style={{ backgroundColor: C.magenta, boxShadow: `0 4px 10px ${C.magenta}40` }}
          >
            <Plus size={14} /> Add New Product
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left" style={{ color: C.muted }}>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>SI</th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>Product</th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>Category</th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>Brand</th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-right" style={{ borderColor: C.line }}>Purchase</th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-right" style={{ borderColor: C.line }}>Selling</th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-center" style={{ borderColor: C.line }}>Stock</th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} style={i !== filtered.length - 1 ? { borderBottom: `1px solid ${C.line}` } : undefined}>
                <td className="py-3 px-2.5" style={{ color: C.muted, fontFamily: FONT_MONO }}>{p.id}</td>
                <td className="py-3 px-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: C.magentaTint, color: C.magenta }}>
                      <Package size={14} />
                    </div>
                    <span className="font-semibold" style={{ color: C.ink }}>{p.name}</span>
                  </div>
                </td>
                <td className="py-3 px-2.5" style={{ color: C.muted }}>{p.category}</td>
                <td className="py-3 px-2.5" style={{ color: C.muted }}>{p.brand}</td>
                <td className="py-3 px-2.5 text-right font-semibold" style={{ fontFamily: FONT_MONO, color: C.ink }}>৳{p.purchase}</td>
                <td className="py-3 px-2.5 text-right font-semibold" style={{ fontFamily: FONT_MONO, color: C.ink }}>৳{p.selling}</td>
                <td className="py-3 px-2.5 text-center">
                  <span
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                    style={
                      p.stock <= 3
                        ? { backgroundColor: C.vermillionTint, color: C.vermillion }
                        : { backgroundColor: C.forestTint, color: C.forestDark }
                    }
                  >
                    {p.stock} pcs
                  </span>
                </td>
                <td className="py-3 px-2.5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingProduct(p)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: C.peacock }}>
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: C.vermillion }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="py-8 text-center text-[13px]" style={{ color: C.muted }}>No products match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editingProduct && (
        <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} onSave={handleSaveProduct} />
      )}
    </div>
  );
}

function ShopSettingsPage() {
  return (
    <div className="relative rounded-2xl border overflow-hidden" style={{ backgroundColor: "transparent" }}>
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5 items-start">
        {/* LEFT: main form card */}
        <div className="relative rounded-2xl p-6 pt-7 border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
          <ScallopBorder id="scallop-settings-form" colors={petals} />
          <h2 className="font-bold text-[16px] mb-5" style={{ fontFamily: FONT_HEAD }}>
            Shop Setting &amp; Others
          </h2>

          <div className="space-y-5">
            <TextField label="Business / Shop Name" required defaultValue="My Business" />
            <TextField label="Proprietor" defaultValue="Sohag Ahmed Moon" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <TextField label="Business / Shop Email" required type="email" defaultValue="Mybusines@gmail.com" />
              <TextField label="Business / Shop Phone" required defaultValue="+8801676526444, +8801954444608" />
            </div>

            <TextField label="Business / Address" required defaultValue="Shop-1205, Saha Ali Plaza, Mirpur-10, Dhaka-1216" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <TextField label="BIN" defaultValue="551148758254129" />
              <TextField label="TIN" defaultValue="496252834961" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <TextField label="NID" defaultValue="77768547125" />
              <TextField label="Trade License" defaultValue="15322390799" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel>Business / Shop Website</FieldLabel>
                <div
                  className="flex items-center gap-2 rounded-lg px-3.5 py-2.5 border"
                  style={{ backgroundColor: C.paper, borderColor: C.line }}
                >
                  <Globe size={14} style={{ color: C.muted }} />
                  <input
                    placeholder="https://yourshop.com"
                    className="bg-transparent outline-none flex-1 text-[13px]"
                    style={{ color: C.ink, fontFamily: FONT_BODY }}
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Business / Shop Logo</FieldLabel>
                <div
                  className="flex items-center gap-2 rounded-lg px-3.5 py-2.5 border border-dashed cursor-pointer"
                  style={{ backgroundColor: C.marigoldTint, borderColor: C.marigold, color: C.rust }}
                >
                  <UploadCloud size={14} />
                  <span className="text-[12.5px] font-semibold">Upload new logo</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                className="text-white font-semibold text-[13px] px-5 py-2.5 rounded-lg shadow-md"
                style={{ backgroundColor: C.forest, boxShadow: `0 4px 10px ${C.forest}40` }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: logo card + points + save */}
        <div className="space-y-4">
          <div className="relative rounded-2xl border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
            <ScallopBorder id="scallop-settings-logo" colors={petals} />
            <div className="flex flex-col items-center justify-center gap-3 pt-8 pb-5 px-5">
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center border"
                style={{ backgroundColor: C.paper, borderColor: C.line, color: C.muted }}
              >
                <ImageIcon size={30} />
              </div>
              <div className="text-[13px] font-bold" style={{ color: C.ink, fontFamily: FONT_HEAD }}>
                My Business Logo
              </div>
            </div>
            <button
              className="w-full flex items-center justify-center gap-1.5 text-white font-semibold text-[12.5px] py-2.5"
              style={{ backgroundColor: C.vermillion }}
            >
              <X size={13} /> Remove Shop Logo
            </button>

            <div className="p-5 space-y-2" style={{ borderTop: `1px dashed ${C.line}` }}>
              <div className="text-[12.5px]">
                <span className="font-semibold" style={{ color: C.ink }}>Start Date: </span>
                <span style={{ color: C.muted, fontFamily: FONT_MONO }}>10 Jul, 2023</span>
              </div>
              <div className="text-[12.5px]">
                <span className="font-semibold" style={{ color: C.ink }}>Business Code: </span>
                <span style={{ color: C.muted, fontFamily: FONT_MONO }}>230710646</span>
              </div>
              <div className="text-[12.5px] font-semibold" style={{ color: C.vermillion }}>
                Monthly Renew Charge: <span style={{ fontFamily: FONT_MONO }}>৳3.00</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl p-5 pt-6 border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
            <ScallopBorder id="scallop-settings-points" colors={petals} />
            <FieldLabel>Do You Use Customer Points?</FieldLabel>
            <select
              className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none mb-4"
              style={{ backgroundColor: C.paper, borderColor: C.line, color: C.ink, fontFamily: FONT_BODY }}
              defaultValue="No"
            >
              <option>No</option>
              <option>Yes</option>
            </select>
            <div className="flex justify-end">
              <button
                className="text-white font-semibold text-[13px] px-5 py-2.5 rounded-lg shadow-md"
                style={{ backgroundColor: C.forest, boxShadow: `0 4px 10px ${C.forest}40` }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddRoleModal({
  onClose,
  onCreate,
  accentColor = C.peacock,
  title = "Add New Role",
  fieldLabel = "Role Name",
  placeholder = "e.g. Inventory Manager",
  buttonLabel = "Create Role",
  initialValue = "",
}) {
  const [name, setName] = React.useState(initialValue);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(43,35,32,0.45)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border overflow-hidden"
        style={{ backgroundColor: C.panel, borderColor: C.line }}
        onClick={(e) => e.stopPropagation()}
      >
        <ScallopBorder id="scallop-add-role" colors={petals} />
        <div className="p-6 pt-7">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[15.5px]" style={{ fontFamily: FONT_HEAD, color: C.ink }}>
              {title}
            </h3>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: C.paper, color: C.muted }}
            >
              <X size={14} />
            </button>
          </div>

          <FieldLabel required>{fieldLabel}</FieldLabel>
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder={placeholder}
            className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none mb-5"
            style={{ backgroundColor: C.paper, borderColor: C.line, color: C.ink, fontFamily: FONT_BODY }}
          />

          <div className="flex justify-end gap-2.5">
            <button
              onClick={onClose}
              className="font-semibold text-[12.5px] px-4 py-2.5 rounded-lg border"
              style={{ borderColor: C.line, color: C.muted, backgroundColor: C.panel }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg shadow-md disabled:opacity-40"
              style={{ backgroundColor: accentColor, boxShadow: `0 4px 10px ${accentColor}40` }}
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminRolesPage({ onOpenPermissions }) {
  const [roles, setRoles] = React.useState(defaultAdminRoles);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingRole, setEditingRole] = React.useState(null);

  const handleCreateRole = (name) => {
    const nextId = roles.length ? Math.max(...roles.map((r) => r.id)) + 1 : 1;
    setRoles((prev) => [...prev, { id: nextId, name }]);
    setShowAddModal(false);
  };

  const handleUpdateRole = (name) => {
    setRoles((prev) => prev.map((r) => (r.id === editingRole.id ? { ...r, name } : r)));
    setEditingRole(null);
  };

  return (
    <div className="relative rounded-2xl p-6 pt-7 border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
      <ScallopBorder id="scallop-roles" colors={petals} />
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="font-bold text-[16px]" style={{ fontFamily: FONT_HEAD, color: C.ink }}>
          Admin Helper Roles
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md"
          style={{ backgroundColor: C.peacock, boxShadow: `0 4px 10px ${C.peacock}40` }}
        >
          <Plus size={14} /> Add New Role
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left" style={{ color: C.muted }}>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>
                SI
              </th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>
                Role Name
              </th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, i) => (
              <tr key={role.id} style={i !== roles.length - 1 ? { borderBottom: `1px solid ${C.line}` } : undefined}>
                <td className="py-3 px-2.5" style={{ color: C.muted, fontFamily: FONT_MONO }}>
                  {role.id}
                </td>
                <td className="py-3 px-2.5 font-semibold" style={{ color: C.ink }}>
                  {role.name}
                </td>
                <td className="py-3 px-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingRole(role)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: C.peacock }}
                      title="Edit role name"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => onOpenPermissions(role)}
                      className="flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-lg"
                      style={{ backgroundColor: C.purpleTint, color: C.purple }}
                    >
                      <KeyRound size={13} /> Permissions
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <AddRoleModal onClose={() => setShowAddModal(false)} onCreate={handleCreateRole} />
      )}

      {editingRole && (
        <AddRoleModal
          onClose={() => setEditingRole(null)}
          onCreate={handleUpdateRole}
          title="Edit Role"
          buttonLabel="Save Changes"
          initialValue={editingRole.name}
        />
      )}
    </div>
  );
}

function AddBranchModal({ onClose, onCreate, title = "Add New Branch", buttonLabel = "Create Branch", initialName = "", initialAddress = "" }) {
  const [name, setName] = React.useState(initialName);
  const [address, setAddress] = React.useState(initialAddress);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCreate = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    onCreate(trimmedName, address.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(43,35,32,0.45)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border overflow-hidden"
        style={{ backgroundColor: C.panel, borderColor: C.line }}
        onClick={(e) => e.stopPropagation()}
      >
        <ScallopBorder id="scallop-add-branch" colors={petals} />
        <div className="p-6 pt-7">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[15.5px]" style={{ fontFamily: FONT_HEAD, color: C.ink }}>
              {title}
            </h3>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: C.paper, color: C.muted }}
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-4 mb-5">
            <div>
              <FieldLabel required>Branch Name</FieldLabel>
              <input
                ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Godown Uttara"
                className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none"
                style={{ backgroundColor: C.paper, borderColor: C.line, color: C.ink, fontFamily: FONT_BODY }}
              />
            </div>
            <div>
              <FieldLabel>Address</FieldLabel>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="Shop / Godown address"
                className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none"
                style={{ backgroundColor: C.paper, borderColor: C.line, color: C.ink, fontFamily: FONT_BODY }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5">
            <button
              onClick={onClose}
              className="font-semibold text-[12.5px] px-4 py-2.5 rounded-lg border"
              style={{ borderColor: C.line, color: C.muted, backgroundColor: C.panel }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg shadow-md disabled:opacity-40"
              style={{ backgroundColor: C.vermillion, boxShadow: `0 4px 10px ${C.vermillion}40` }}
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BranchesPage() {
  const [branches, setBranches] = React.useState(defaultShopBranches);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingBranch, setEditingBranch] = React.useState(null);

  const handleCreateBranch = (name, address) => {
    const nextId = branches.length ? Math.max(...branches.map((b) => b.id)) + 1 : 1;
    setBranches((prev) => [...prev, { id: nextId, name, address }]);
    setShowAddModal(false);
  };

  const handleUpdateBranch = (name, address) => {
    setBranches((prev) => prev.map((b) => (b.id === editingBranch.id ? { ...b, name, address } : b)));
    setEditingBranch(null);
  };

  return (
    <div className="relative rounded-2xl p-6 pt-7 border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
      <ScallopBorder id="scallop-branches" colors={petals} />
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="font-bold text-[16px]" style={{ fontFamily: FONT_HEAD, color: C.ink }}>
          Shop branches
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md"
          style={{ backgroundColor: C.vermillion, boxShadow: `0 4px 10px ${C.vermillion}40` }}
        >
          <Plus size={14} /> Add New Branch
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left" style={{ color: C.muted }}>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>
                SI
              </th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>
                Branch Name
              </th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>
                Address
              </th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch, i) => (
              <tr key={branch.id} style={i !== branches.length - 1 ? { borderBottom: `1px solid ${C.line}` } : undefined}>
                <td className="py-3 px-2.5" style={{ color: C.muted, fontFamily: FONT_MONO }}>
                  {branch.id}
                </td>
                <td className="py-3 px-2.5 font-semibold" style={{ color: C.ink }}>
                  {branch.name}
                </td>
                <td className="py-3 px-2.5" style={{ color: C.muted }}>
                  {branch.address || "—"}
                </td>
                <td className="py-3 px-2.5">
                  <button
                    onClick={() => setEditingBranch(branch)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: C.peacock }}
                    title="Edit branch"
                  >
                    <Pencil size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <AddBranchModal onClose={() => setShowAddModal(false)} onCreate={handleCreateBranch} />
      )}

      {editingBranch && (
        <AddBranchModal
          onClose={() => setEditingBranch(null)}
          onCreate={handleUpdateBranch}
          title="Edit Branch"
          buttonLabel="Save Changes"
          initialName={editingBranch.name}
          initialAddress={editingBranch.address}
        />
      )}
    </div>
  );
}

function RolePermissionsPage({ role, onBack }) {
  const [openWing, setOpenWing] = React.useState("Account_Wing");
  const [state, setState] = React.useState(defaultPermissionState);

  const toggle = (wing, perm) => {
    setState((prev) => ({
      ...prev,
      [wing]: { ...prev[wing], [perm]: !prev[wing][perm] },
    }));
  };

  const wingHeaderColors = {
    Account_Wing: C.peacock,
    Godown_Wing: C.purple,
    Main_Wing: C.magenta,
    Supplier_Wing: C.rust,
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[12.5px] font-semibold mb-4"
        style={{ color: C.muted }}
      >
        <ArrowLeft size={14} /> Back to Admin Helper Roles
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* LEFT: editable permission tree */}
        <div className="relative rounded-2xl p-6 pt-7 border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
          <ScallopBorder id="scallop-perm-left" colors={petals} />
          <h2 className="font-bold text-[16px] mb-4" style={{ fontFamily: FONT_HEAD, color: C.ink }}>
            Permission of {role.name}
          </h2>

          <div className="space-y-1">
            {Object.entries(permissionWings).map(([wing, perms], idx) => {
              const isOpen = openWing === wing;
              return (
                <div key={wing} style={idx !== 0 ? { borderTop: `1px dashed ${C.line}` } : undefined}>
                  <button
                    onClick={() => setOpenWing(isOpen ? null : wing)}
                    className="w-full flex items-center justify-between py-3 text-left"
                  >
                    <span
                      className="text-[13.5px] font-bold"
                      style={{ color: isOpen ? C.ink : wingHeaderColors[wing], fontFamily: FONT_HEAD }}
                    >
                      {wing.replace("_", " ")}
                    </span>
                    <ChevronDown
                      size={15}
                      style={{ color: C.muted, transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform .15s" }}
                    />
                  </button>

                  {isOpen && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pb-4">
                      {perms.map((perm) => {
                        const checked = state[wing][perm];
                        return (
                          <label
                            key={perm}
                            className="flex items-center gap-2 cursor-pointer select-none"
                            onClick={() => toggle(wing, perm)}
                          >
                            {checked ? (
                              <CheckSquare size={16} style={{ color: C.forest }} />
                            ) : (
                              <Square size={16} style={{ color: C.line }} />
                            )}
                            <span className="text-[12.5px]" style={{ color: C.ink, fontFamily: FONT_MONO }}>
                              {perm}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              className="text-white font-semibold text-[13px] px-5 py-2.5 rounded-lg shadow-md"
              style={{ backgroundColor: C.forest, boxShadow: `0 4px 10px ${C.forest}40` }}
            >
              Save Permissions
            </button>
          </div>
        </div>

        {/* RIGHT: live summary of granted permissions */}
        <div className="relative rounded-2xl p-6 pt-7 border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
          <ScallopBorder id="scallop-perm-right" colors={petals} />
          <h2 className="font-bold text-[16px] mb-4" style={{ fontFamily: FONT_HEAD, color: C.ink }}>
            Provided Permissions
          </h2>

          <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
            {Object.entries(permissionWings).map(([wing, perms]) => {
              const granted = perms.filter((p) => state[wing][p]);
              if (granted.length === 0) return null;
              return (
                <div key={wing}>
                  <div className="text-[12.5px] font-bold mb-1.5" style={{ color: C.forestDark, fontFamily: FONT_HEAD }}>
                    {wing.replace("_", " ")}
                  </div>
                  <div className="space-y-1.5">
                    {granted.map((perm) => (
                      <div key={perm} className="flex items-center gap-2">
                        <CheckSquare size={14} style={{ color: C.forest }} className="shrink-0" />
                        <span className="text-[12px]" style={{ color: C.ink, fontFamily: FONT_MONO }}>
                          {perm}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function BranchRolesPage({ onOpenPermissions }) {
  const [roles, setRoles] = React.useState(defaultBranchRoles);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingRole, setEditingRole] = React.useState(null);

  const handleCreateRole = (name) => {
    const nextId = roles.length ? Math.max(...roles.map((r) => r.id)) + 1 : 1;
    setRoles((prev) => [...prev, { id: nextId, name }]);
    setShowAddModal(false);
  };

  const handleUpdateRole = (name) => {
    setRoles((prev) => prev.map((r) => (r.id === editingRole.id ? { ...r, name } : r)));
    setEditingRole(null);
  };

  return (
    <div className="relative rounded-2xl p-6 pt-7 border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
      <ScallopBorder id="scallop-branch-roles" colors={petals} />
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="font-bold text-[16px]" style={{ fontFamily: FONT_HEAD, color: C.ink }}>
          Branch User Role &amp; Permissions
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md"
          style={{ backgroundColor: C.purple, boxShadow: `0 4px 10px ${C.purple}40` }}
        >
          <Plus size={14} /> Add New Role
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left" style={{ color: C.muted }}>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>
                SI
              </th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>
                Role Name
              </th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, i) => (
              <tr key={role.id} style={i !== roles.length - 1 ? { borderBottom: `1px solid ${C.line}` } : undefined}>
                <td className="py-3 px-2.5" style={{ color: C.muted, fontFamily: FONT_MONO }}>
                  {role.id}
                </td>
                <td className="py-3 px-2.5 font-semibold" style={{ color: C.ink }}>
                  {role.name}
                </td>
                <td className="py-3 px-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingRole(role)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: C.peacock }}
                      title="Edit role name"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => onOpenPermissions(role)}
                      className="flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-lg"
                      style={{ backgroundColor: C.purpleTint, color: C.purple }}
                    >
                      <KeyRound size={13} /> Permissions
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <AddRoleModal
          onClose={() => setShowAddModal(false)}
          onCreate={handleCreateRole}
          accentColor={C.purple}
          title="Add New Branch Role"
        />
      )}

      {editingRole && (
        <AddRoleModal
          onClose={() => setEditingRole(null)}
          onCreate={handleUpdateRole}
          accentColor={C.purple}
          title="Edit Branch Role"
          buttonLabel="Save Changes"
          initialValue={editingRole.name}
        />
      )}
    </div>
  );
}

function BranchRolePermissionsPage({ role, onBack }) {
  // Left side: assignable permissions not yet granted, toggled by the user.
  const [checkedAvailable, setCheckedAvailable] = React.useState(
    Object.fromEntries(branchAvailablePermissions.map((p) => [p, false]))
  );
  // Right side: permissions already granted to this role.
  const [granted, setGranted] = React.useState(branchGrantedPermissionsDefault);

  const toggleAvailable = (perm) => {
    setCheckedAvailable((prev) => ({ ...prev, [perm]: !prev[perm] }));
  };

  const handleSave = () => {
    const newlyChecked = branchAvailablePermissions.filter((p) => checkedAvailable[p] && !granted.includes(p));
    if (newlyChecked.length > 0) {
      setGranted((prev) => [...prev, ...newlyChecked]);
    }
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[12.5px] font-semibold mb-4"
        style={{ color: C.muted }}
      >
        <ArrowLeft size={14} /> Back to Branch User Role &amp; Permissions
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* LEFT: assignable permission checkboxes */}
        <div className="relative rounded-2xl p-6 pt-7 border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
          <ScallopBorder id="scallop-branch-perm-left" colors={petals} />
          <h2 className="font-bold text-[16px] mb-4" style={{ fontFamily: FONT_HEAD, color: C.ink }}>
            Permission of {role.name}
          </h2>

          <div className="text-[13.5px] font-bold mb-2.5" style={{ color: C.peacock, fontFamily: FONT_HEAD }}>
            Branch
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pb-2">
            {branchAvailablePermissions.map((perm) => {
              const checked = checkedAvailable[perm];
              return (
                <label
                  key={perm}
                  className="flex items-center gap-2 cursor-pointer select-none"
                  onClick={() => toggleAvailable(perm)}
                >
                  {checked ? (
                    <CheckSquare size={16} style={{ color: C.forest }} />
                  ) : (
                    <Square size={16} style={{ color: C.line }} />
                  )}
                  <span className="text-[12.5px]" style={{ color: C.ink, fontFamily: FONT_MONO }}>
                    {perm}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSave}
              className="text-white font-semibold text-[13px] px-5 py-2.5 rounded-lg shadow-md"
              style={{ backgroundColor: C.purple, boxShadow: `0 4px 10px ${C.purple}40` }}
            >
              Save Permissions
            </button>
          </div>
        </div>

        {/* RIGHT: currently granted permissions */}
        <div className="relative rounded-2xl p-6 pt-7 border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
          <ScallopBorder id="scallop-branch-perm-right" colors={petals} />
          <h2 className="font-bold text-[16px] mb-4" style={{ fontFamily: FONT_HEAD, color: C.ink }}>
            Provided Permissions
          </h2>

          <div className="text-[12.5px] font-bold mb-1.5" style={{ color: C.forestDark, fontFamily: FONT_HEAD }}>
            Branch
          </div>
          <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
            {granted.map((perm) => (
              <div key={perm} className="flex items-center gap-2">
                <CheckSquare size={14} style={{ color: C.forest }} className="shrink-0" />
                <span className="text-[12px]" style={{ color: C.ink, fontFamily: FONT_MONO }}>
                  {perm}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CRMPage() {
  const [permissions, setPermissions] = React.useState(defaultCrmPermissions);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingPermission, setEditingPermission] = React.useState(null);

  const handleCreate = (name) => {
    const nextId = permissions.length ? Math.max(...permissions.map((p) => p.id)) + 1 : 1;
    setPermissions((prev) => [...prev, { id: nextId, name }]);
    setShowAddModal(false);
  };

  const handleUpdate = (name) => {
    setPermissions((prev) => prev.map((p) => (p.id === editingPermission.id ? { ...p, name } : p)));
    setEditingPermission(null);
  };

  const handleDelete = (id) => {
    setPermissions((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="relative rounded-2xl p-6 pt-7 border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
      <ScallopBorder id="scallop-crm" colors={petals} />
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="font-bold text-[16px]" style={{ fontFamily: FONT_HEAD, color: C.ink }}>
          CRM List
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md"
          style={{ backgroundColor: C.magenta, boxShadow: `0 4px 10px ${C.magenta}40` }}
        >
          <Plus size={14} /> Add CRM Permission
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left" style={{ color: C.muted }}>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>
                SI
              </th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>
                Permission Name
              </th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((perm, i) => (
              <tr key={perm.id} style={i !== permissions.length - 1 ? { borderBottom: `1px solid ${C.line}` } : undefined}>
                <td className="py-3 px-2.5" style={{ color: C.muted, fontFamily: FONT_MONO }}>
                  {perm.id}
                </td>
                <td className="py-3 px-2.5 font-semibold" style={{ color: C.ink, fontFamily: FONT_MONO }}>
                  {perm.name}
                </td>
                <td className="py-3 px-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingPermission(perm)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: C.peacock }}
                      title="Edit permission"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(perm.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: C.vermillion }}
                      title="Remove permission"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {permissions.length === 0 && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-[13px]" style={{ color: C.muted }}>
                  No CRM permissions added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <AddRoleModal
          onClose={() => setShowAddModal(false)}
          onCreate={handleCreate}
          accentColor={C.magenta}
          title="Add CRM Permission"
          fieldLabel="Permission Name"
          placeholder="e.g. crm.lead.assign"
          buttonLabel="Add Permission"
        />
      )}

      {editingPermission && (
        <AddRoleModal
          onClose={() => setEditingPermission(null)}
          onCreate={handleUpdate}
          accentColor={C.magenta}
          title="Edit CRM Permission"
          fieldLabel="Permission Name"
          placeholder="e.g. crm.lead.assign"
          buttonLabel="Save Changes"
          initialValue={editingPermission.name}
        />
      )}
    </div>
  );
}

const defaultStockItems = [
  { id: 1, name: "SPT", lot: 1, discount: "no(0)", date: "05 Nov 2023", barcode: "", purchase: 0, sale: 250, stock: 996, alert: 0 },
  { id: 2, name: "SPT Camp Test", lot: 1, discount: "no(0)", date: "05 Nov 2023", barcode: "", purchase: 0, sale: 250, stock: 989, alert: 0 },
  { id: 3, name: "Matador i-teen Gel", lot: 1, discount: "no(0)", date: "01 Jan 1970", barcode: "0011", purchase: 8, sale: 10, stock: 199, alert: 2 },
  { id: 4, name: "Mens Snekers Shoes 103", variant: "(32)", lot: 2, discount: "no(0)", date: "24 Aug 2024", barcode: "", purchase: 200, sale: 250, stock: 5, alert: 0 },
  { id: 5, name: "Ayesha", lot: 4, discount: "no(0)", date: "04 Nov 2024", barcode: "", purchase: 160000, sale: 180000, stock: 100, alert: 0 },
  { id: 6, name: "Matador Eraser", lot: 1, discount: "no(0)", date: "01 Jan 1970", barcode: "5566", purchase: 5, sale: 10, stock: 114, alert: 2 },
  { id: 7, name: "Cotton Panjabi — L", lot: 1, discount: "10%", date: "12 Feb 2025", barcode: "8841", purchase: 850, sale: 1450, stock: 24, alert: 5 },
  { id: 8, name: "Denim Jeans — 32", lot: 2, discount: "no(0)", date: "03 Mar 2025", barcode: "9021", purchase: 1100, sale: 1890, stock: 4, alert: 3 },
];

function StockFilterSelect({ value, options, accentColor = C.peacock }) {
  return (
    <div className="relative">
      <select
        defaultValue={value}
        className="appearance-none rounded-lg pl-3 pr-8 py-2 text-[12.5px] font-semibold border outline-none cursor-pointer"
        style={{ backgroundColor: C.panel, borderColor: C.line, color: C.ink, fontFamily: FONT_BODY }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: accentColor }}
      />
    </div>
  );
}

function ProductStocksPage() {
  const [branch, setBranch] = React.useState(defaultShopBranches[1]?.name || "My Business");
  const [query, setQuery] = React.useState("");
  const [showEntries, setShowEntries] = React.useState("100");

  const filtered = defaultStockItems.filter((item) =>
    (item.name + " " + (item.barcode || "")).toLowerCase().includes(query.toLowerCase())
  );

  const totalPP = defaultStockItems.reduce((sum, i) => sum + i.purchase * i.stock, 0);
  const totalSale = defaultStockItems.reduce((sum, i) => sum + i.sale * i.stock, 0);

  const fmt = (n) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="relative rounded-2xl border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
      <ScallopBorder id="scallop-product-stocks" colors={petals} />

      {/* HEADER: title + filters + actions */}
      <div className="p-5 pt-7 pb-4 flex items-center justify-between flex-wrap gap-3" style={{ borderBottom: `1px dashed ${C.line}` }}>
        <h2 className="font-bold text-[16px]" style={{ fontFamily: FONT_HEAD, color: C.forestDark }}>
          My Business [{branch}] Current Active Stock
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          <StockFilterSelect value="Active Stock" options={["Active Stock", "All Stock", "Zero Stock"]} accentColor={C.peacock} />
          <StockFilterSelect value="All Brands" options={["All Brands", "Aarong", "Yellow", "Ecstasy", "Sailor"]} accentColor={C.marigold} />
          <StockFilterSelect value="All Categories" options={["All Categories", "Panjabi", "Shirt", "Jeans", "T-Shirt"]} accentColor={C.rust} />
          <div className="relative">
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="appearance-none rounded-lg pl-3 pr-8 py-2 text-[12.5px] font-semibold border outline-none cursor-pointer"
              style={{ backgroundColor: C.panel, borderColor: C.purple, color: C.purple, fontFamily: FONT_BODY }}
            >
              {defaultShopBranches.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.purple }} />
          </div>
          <button
            className="text-white font-semibold text-[12.5px] px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-md"
            style={{ backgroundColor: C.purple, boxShadow: `0 4px 10px ${C.purple}40` }}
          >
            <Printer size={13} /> Print
          </button>
          <button
            className="text-white font-semibold text-[12.5px] px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-md"
            style={{ backgroundColor: C.forest, boxShadow: `0 4px 10px ${C.forest}40` }}
          >
            <Download size={13} /> Download
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="px-5 py-3 flex flex-wrap gap-x-8 gap-y-1" style={{ borderBottom: `1px dashed ${C.line}` }}>
        <div className="text-[13px]">
          <span className="font-semibold" style={{ color: C.ink }}>Total PP: </span>
          <span className="font-bold" style={{ color: C.forestDark, fontFamily: FONT_MONO }}>৳{fmt(totalPP)}</span>
        </div>
        <div className="text-[13px]">
          <span className="font-semibold" style={{ color: C.ink }}>Estimate Sale Price: </span>
          <span className="font-bold" style={{ color: C.magenta, fontFamily: FONT_MONO }}>৳{fmt(totalSale)}</span>
        </div>
      </div>

      {/* SHOW ENTRIES + SEARCH */}
      <div className="px-5 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-[12.5px] font-medium" style={{ color: C.muted }}>
          Show
          <div className="relative">
            <select
              value={showEntries}
              onChange={(e) => setShowEntries(e.target.value)}
              className="appearance-none rounded-lg pl-2.5 pr-6 py-1.5 text-[12.5px] font-semibold border outline-none cursor-pointer"
              style={{ backgroundColor: C.paper, borderColor: C.line, color: C.ink, fontFamily: FONT_BODY }}
            >
              {["10", "25", "50", "100"].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.muted }} />
          </div>
          entries
        </div>
        <div
          className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] border"
          style={{ backgroundColor: C.paper, borderColor: C.line, color: C.muted }}
        >
          <Search size={14} />
          <span className="text-[12.5px] font-semibold" style={{ color: C.ink }}>Search:</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none text-[13px] w-40"
            style={{ color: C.ink, fontFamily: FONT_BODY }}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto px-5 pb-6">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left" style={{ color: C.muted }}>
              <th className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>Product Name</th>
              <th className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>Barcode</th>
              <th className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-right" style={{ borderColor: C.line }}>Purchase Price</th>
              <th className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-right" style={{ borderColor: C.line }}>Sale Price</th>
              <th className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-center" style={{ borderColor: C.line }}>Current Stock</th>
              <th className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-center" style={{ borderColor: C.line }}>Alert Qty</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <tr key={item.id} style={i !== filtered.length - 1 ? { borderBottom: `1px dashed ${C.line}` } : undefined}>
                <td className="py-3 px-2.5">
                  <div className="font-semibold" style={{ color: C.purple }}>
                    {item.name}
                    {item.variant && <span style={{ color: C.magenta }}>{item.variant}</span>}
                  </div>
                  <div className="text-[11px]" style={{ color: C.muted }}>
                    Lot: {item.lot}, Discount: {item.discount}, Date: {item.date}
                  </div>
                </td>
                <td className="py-3 px-2.5" style={{ color: C.ink, fontFamily: FONT_MONO }}>
                  {item.barcode || "—"}
                </td>
                <td className="py-3 px-2.5 text-right font-semibold" style={{ color: C.ink, fontFamily: FONT_MONO }}>
                  {item.purchase}
                </td>
                <td className="py-3 px-2.5 text-right font-semibold" style={{ color: C.ink, fontFamily: FONT_MONO }}>
                  {item.sale}
                </td>
                <td className="py-3 px-2.5 text-center">
                  <span
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                    style={
                      item.stock <= 5
                        ? { backgroundColor: C.vermillionTint, color: C.vermillion }
                        : { backgroundColor: C.forestTint, color: C.forestDark }
                    }
                  >
                    {item.stock}
                  </span>
                </td>
                <td className="py-3 px-2.5 text-center font-semibold" style={{ color: item.alert > 0 ? C.rust : C.muted, fontFamily: FONT_MONO }}>
                  {item.alert}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[13px]" style={{ color: C.muted }}>
                  No products match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   STOCK ALERT QUANTITY — products at or below their alert
   threshold. Color language follows the rest of the ledger:
   forest green when there's still healthy room above the
   alert line, marigold/rust when it's brushing the line, and
   vermillion once stock has hit or dropped below the alert
   quantity — a shop-owner's "act now" red.
---------------------------------------------------------- */
const defaultStockAlertItems = [
  { id: 1, name: "A4 Tech Keyboard", barcode: "8941193078563", alertQty: 1, currentStock: 0 },
  { id: 2, name: "sun flower doll", barcode: "3636593589", alertQty: 10, currentStock: 9 },
  { id: 3, name: "penguin medium", barcode: "3957520364", alertQty: 2, currentStock: 2 },
];

function stockAlertSeverity(item) {
  if (item.currentStock <= 0) {
    return { color: C.vermillion, bg: C.vermillionTint, label: "Out of stock" };
  }
  if (item.currentStock <= item.alertQty) {
    return { color: C.rust, bg: C.rustTint, label: "At alert line" };
  }
  return { color: C.forestDark, bg: C.forestTint, label: "OK" };
}

function StockAlertQtyPage() {
  const [query, setQuery] = React.useState("");
  const [showEntries, setShowEntries] = React.useState("100");
  const [page, setPage] = React.useState(1);

  const filtered = defaultStockAlertItems.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.barcode.toLowerCase().includes(query.toLowerCase())
  );

  const pageSize = Number(showEntries) || filtered.length || 1;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIdx = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIdx = Math.min(safePage * pageSize, filtered.length);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className="relative rounded-2xl border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
      <ScallopBorder id="scallop-stock-alert-qty" colors={petals} />

      {/* HEADER */}
      <div className="p-5 pt-7 pb-4 flex items-center justify-between flex-wrap gap-3" style={{ borderBottom: `1px dashed ${C.line}` }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: C.peacockTint, color: C.peacock }}
          >
            <Bell size={16} strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="font-bold text-[16px] leading-tight" style={{ fontFamily: FONT_HEAD, color: C.ink }}>
              Stock Alert Quantity
            </h2>
            <p className="text-[11.5px]" style={{ color: C.muted }}>
              যেসব পণ্যের মজুদ Alert Quantity-তে বা তার নিচে পৌঁছেছে
            </p>
          </div>
        </div>
        <span
          className="text-[11px] font-bold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: C.vermillionTint, color: C.vermillion }}
        >
          {filtered.length} {filtered.length === 1 ? "item" : "items"} need attention
        </span>
      </div>

      {/* SHOW ENTRIES + SEARCH */}
      <div className="px-5 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-[12.5px] font-medium" style={{ color: C.muted }}>
          Show
          <div className="relative">
            <select
              value={showEntries}
              onChange={(e) => {
                setShowEntries(e.target.value);
                setPage(1);
              }}
              className="appearance-none rounded-lg pl-2.5 pr-6 py-1.5 text-[12.5px] font-semibold border outline-none cursor-pointer"
              style={{ backgroundColor: C.paper, borderColor: C.line, color: C.ink, fontFamily: FONT_BODY }}
            >
              {["10", "25", "50", "100"].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.muted }} />
          </div>
          entries
        </div>
        <div
          className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] border"
          style={{ backgroundColor: C.paper, borderColor: C.line, color: C.muted }}
        >
          <span className="text-[12.5px] font-semibold" style={{ color: C.ink }}>Search:</span>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="bg-transparent outline-none text-[13px] w-40"
            style={{ color: C.ink, fontFamily: FONT_BODY }}
          />
          <Search size={14} />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto px-5">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left" style={{ color: C.muted }}>
              <th className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>
                Product Name
              </th>
              <th className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>
                Product Barcode
              </th>
              <th className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-center" style={{ borderColor: C.line }}>
                Alert Quantity
              </th>
              <th className="font-bold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-center" style={{ borderColor: C.line }}>
                Current Stock
              </th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((item, i) => {
              const severity = stockAlertSeverity(item);
              return (
                <tr key={item.id} style={i !== pageItems.length - 1 ? { borderBottom: `1px dashed ${C.line}` } : undefined}>
                  <td className="py-3.5 px-2.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: severity.bg, color: severity.color }}
                      >
                        <Package size={14} />
                      </div>
                      <span className="font-semibold" style={{ color: C.ink }}>{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2.5" style={{ color: C.muted, fontFamily: FONT_MONO }}>
                    {item.barcode}
                  </td>
                  <td className="py-3.5 px-2.5 text-center font-semibold" style={{ color: C.ink, fontFamily: FONT_MONO }}>
                    {item.alertQty}
                  </td>
                  <td className="py-3.5 px-2.5 text-center">
                    <span
                      className="text-[12.5px] font-bold px-2.5 py-1 rounded-lg"
                      style={{ backgroundColor: severity.bg, color: severity.color, fontFamily: FONT_MONO }}
                      title={severity.label}
                    >
                      {item.currentStock}
                    </span>
                  </td>
                </tr>
              );
            })}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={4} className="py-10 text-center text-[13px]" style={{ color: C.muted }}>
                  No low-stock products match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER: entry count + pagination, matching the reference layout */}
      <div className="px-5 py-4 mt-2 flex items-center justify-between flex-wrap gap-3" style={{ borderTop: `1px dashed ${C.line}` }}>
        <span className="text-[12.5px]" style={{ color: C.muted }}>
          {filtered.length === 0
            ? "Showing 0 entries"
            : `Showing ${startIdx} to ${endIdx} of ${filtered.length} entries`}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="flex items-center gap-1 text-[12.5px] font-semibold px-3 py-1.5 rounded-lg border disabled:opacity-40"
            style={{ borderColor: C.line, color: C.muted, backgroundColor: C.panel }}
          >
            <ChevronLeft size={13} /> Previous
          </button>
          <span
            className="text-[12.5px] font-bold w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ backgroundColor: C.peacockTint, color: C.peacock, fontFamily: FONT_MONO }}
          >
            {safePage}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className="flex items-center gap-1 text-[12.5px] font-semibold px-3 py-1.5 rounded-lg border disabled:opacity-40"
            style={{ borderColor: C.line, color: C.muted, backgroundColor: C.panel }}
          >
            Next <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   PRODUCT TRANSFER — Create Transfer [B2B, B2G] & Stock
   Transfer [G2B]. Two-step flow matching the reference:
     Step 1: pick Sender + Receiver, hit "Next"
     Step 2: pick products from the sender's stock (barcode
             search on the left), build a transfer table on
             the right (qty / price / total, editable), add a
             note + date, then "Confirm Stock Transfer".
   Color language: B2B/B2G transfers use the purple accent
   (matches the reference screenshot's purple "Next" pill and
   "Confirm Stock Transfer" button). G2B (Godown → Branch)
   reuses the same flow with the peacock/teal accent so the
   two transfer types stay visually distinct at a glance.
---------------------------------------------------------- */
const demoTransferStock = [
  { id: 1, name: "Sandwich Hot Spicy", brand: "Center Cafe", lot: 1, price: 120, discount: "no(0)", vat: "0%", stockUnit: 96, unitLabel: "pcs" },
  { id: 2, name: "Hot chickens Noodles", brand: "Samyang", lot: 2, price: 5200, discount: "no(0)", vat: "0%", stockUnit: 1, unitLabel: "Carton" },
  { id: 3, name: "Expiry date test", brand: "FARA IT", lot: 3, price: 115, discount: "no(0)", vat: "0%", stockUnit: 45, unitLabel: "pcs" },
  { id: 4, name: "Cotton Panjabi — L", brand: "Aarong", lot: 1, price: 1450, discount: "10%", vat: "0%", stockUnit: 24, unitLabel: "pcs" },
  { id: 5, name: "Denim Jeans — 32", brand: "Yellow", lot: 2, price: 1890, discount: "no(0)", vat: "0%", stockUnit: 4, unitLabel: "pcs" },
];

function todayISO() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function TransferBranchSelect({ label, value, onChange, options, accentColor, placeholder }) {
  return (
    <div className="relative flex-1 min-w-[200px]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-full pl-4 pr-9 py-3 text-[13px] font-semibold border outline-none cursor-pointer shadow-sm"
        style={{
          backgroundColor: C.panel,
          borderColor: value ? accentColor : C.line,
          color: value ? C.ink : C.muted,
          fontFamily: FONT_BODY,
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.id} value={o.name}>
            {o.name}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: accentColor }}
      />
    </div>
  );
}

/**
 * mode: "B2B_B2G" (Branch/Godown -> Branch/Godown, any-to-any) or
 *       "G2B" (Godown -> Branch only)
 */
function CreateTransferPage({ mode = "B2B_B2G", onConfirm }) {
  const isG2B = mode === "G2B";
  const accent = isG2B ? C.peacock : C.purple;
  const accentTint = isG2B ? C.peacockTint : C.purpleTint;

  const senderOptions = isG2B
    ? defaultShopBranches.filter((b) => b.type === "godown")
    : defaultShopBranches;
  const receiverOptionsFor = (senderName) =>
    isG2B
      ? defaultShopBranches.filter((b) => b.type === "shop" && b.name !== senderName)
      : defaultShopBranches.filter((b) => b.name !== senderName);

  const [step, setStep] = React.useState(1);
  const [sender, setSender] = React.useState("");
  const [receiver, setReceiver] = React.useState("");
  const [barcodeQuery, setBarcodeQuery] = React.useState("");
  const [cart, setCart] = React.useState([]); // {productId, name, price, qty, maxQty, unitLabel}
  const [note, setNote] = React.useState("");
  const [date, setDate] = React.useState(todayISO());
  const [confirmed, setConfirmed] = React.useState(false);

  const receiverOptions = receiverOptionsFor(sender);

  const filteredStock = demoTransferStock.filter((p) =>
    (p.name + " " + p.brand).toLowerCase().includes(barcodeQuery.toLowerCase())
  );

  const handleNext = () => {
    if (!sender || !receiver) return;
    setStep(2);
  };

  const handleBackToSelect = () => {
    setStep(1);
    setCart([]);
    setConfirmed(false);
  };

  const addToCart = (product) => {
    setCart((prev) => {
      if (prev.some((c) => c.productId === product.id)) return prev;
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          brand: product.brand,
          lot: product.lot,
          discount: product.discount,
          vat: product.vat,
          price: product.price,
          qty: "",
          maxQty: product.stockUnit,
          unitLabel: product.unitLabel,
        },
      ];
    });
  };

  const removeFromCart = (productId) => setCart((prev) => prev.filter((c) => c.productId !== productId));

  const updateCartField = (productId, field, value) =>
    setCart((prev) => prev.map((c) => (c.productId === productId ? { ...c, [field]: value } : c)));

  const total = cart.reduce((sum, c) => sum + (Number(c.qty) || 0) * (Number(c.price) || 0), 0);

  const handleConfirm = () => {
    if (cart.length === 0 || !note.trim()) return;
    const record = {
      id: Date.now(),
      type: isG2B ? "G2B" : "B2B/B2G",
      from: sender,
      to: receiver,
      date,
      note: note.trim(),
      items: cart.map((c) => ({ name: c.name, qty: Number(c.qty) || 0, price: Number(c.price) || 0, unitLabel: c.unitLabel })),
      total,
    };
    onConfirm && onConfirm(record);
    setConfirmed(true);
    setCart([]);
    setNote("");
    setBarcodeQuery("");
    setTimeout(() => setConfirmed(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* STEP 1: sender / receiver selector — pill-shaped bar like the reference */}
      <div
        className="relative rounded-3xl border p-4 overflow-hidden flex flex-wrap items-center gap-3"
        style={{ backgroundColor: C.panel, borderColor: C.line, boxShadow: "0 6px 18px rgba(43,35,32,0.06)" }}
      >
        <ScallopBorder id={`scallop-transfer-select-${mode}`} colors={petals} />
        <TransferBranchSelect
          label="Sender"
          value={sender}
          onChange={(v) => {
            setSender(v);
            if (receiver === v) setReceiver("");
          }}
          options={senderOptions}
          accentColor={accent}
          placeholder={isG2B ? "-- Select Sender Godown --" : "-- Select Sender Branch --"}
        />
        <TransferBranchSelect
          label="Receiver"
          value={receiver}
          onChange={setReceiver}
          options={receiverOptions}
          accentColor={accent}
          placeholder={isG2B ? "-- Select Receiving Shop --" : "-- Select Receivable Place --"}
        />
        <button
          onClick={handleNext}
          disabled={!sender || !receiver}
          className="text-white font-bold text-[13px] px-6 py-3 rounded-full shadow-md disabled:opacity-40 shrink-0"
          style={{ backgroundColor: accent, boxShadow: `0 4px 12px ${accent}55` }}
        >
          Next
        </button>
        {step === 2 && (
          <button
            onClick={handleBackToSelect}
            className="flex items-center gap-1.5 text-[12.5px] font-semibold px-3 py-2 rounded-full border ml-auto"
            style={{ borderColor: C.line, color: C.muted }}
          >
            <ArrowLeft size={13} /> Change Branches
          </button>
        )}
      </div>

      {confirmed && (
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-2.5 border"
          style={{ backgroundColor: C.forestTint, borderColor: C.forest, color: C.forestDark }}
        >
          <PackageCheck size={17} />
          <span className="text-[13px] font-semibold">
            Stock transfer confirmed — {sender} → {receiver}. See it under Transfered Histories.
          </span>
        </div>
      )}

      {step === 2 && sender && receiver && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-5 items-start">
          {/* LEFT: products from sender branch */}
          <div className="relative rounded-2xl p-5 pt-6 border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
            <ScallopBorder id={`scallop-transfer-products-${mode}`} colors={petals} />
            <h3 className="font-bold text-[15px] mb-3" style={{ fontFamily: FONT_HEAD, color: C.ink }}>
              Products From {sender}
            </h3>
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 border mb-3"
              style={{ backgroundColor: C.paper, borderColor: C.line, color: C.muted }}
            >
              <Barcode size={15} />
              <input
                value={barcodeQuery}
                onChange={(e) => setBarcodeQuery(e.target.value)}
                placeholder="Search product or scan barcode…"
                className="bg-transparent outline-none flex-1 text-[13px]"
                style={{ color: C.ink, fontFamily: FONT_BODY }}
              />
            </div>

            <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
              {filteredStock.map((p) => {
                const inCart = cart.some((c) => c.productId === p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => !inCart && addToCart(p)}
                    className="rounded-xl border p-3 cursor-pointer transition-colors"
                    style={{
                      borderColor: inCart ? accent : C.line,
                      backgroundColor: inCart ? accentTint : C.paper,
                      opacity: inCart ? 0.6 : 1,
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[13px]" style={{ color: C.forestDark, fontFamily: FONT_HEAD }}>
                        {p.name}
                      </span>
                      {inCart && <CheckCircle2 size={15} style={{ color: accent }} />}
                    </div>
                    <div className="text-[11.5px] mt-1" style={{ color: C.muted }}>
                      Brand: {p.brand}, Lot Number: {p.lot}, Sales Price: {p.price}, Discount: {p.discount}, VAT: {p.vat}
                    </div>
                    <div className="text-[11px] font-semibold mt-1" style={{ color: C.rust }}>
                      Stock Unit: {p.stockUnit} {p.unitLabel}
                    </div>
                  </div>
                );
              })}
              {filteredStock.length === 0 && (
                <div className="text-[12.5px] text-center py-8" style={{ color: C.muted }}>
                  No products match your search.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: transfer builder */}
          <div className="relative rounded-2xl p-5 pt-6 border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
            <ScallopBorder id={`scallop-transfer-builder-${mode}`} colors={petals} />
            <h3 className="font-bold text-[15px] mb-4" style={{ fontFamily: FONT_HEAD, color: C.ink }}>
              {sender} To <span style={{ color: accent }}>{receiver}</span> Transfer Product
            </h3>

            <div className="overflow-x-auto rounded-xl border mb-4" style={{ borderColor: C.line }}>
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr style={{ backgroundColor: accent }}>
                    <th className="text-left font-bold text-white text-[11px] uppercase tracking-wide py-2.5 px-3">Product Info</th>
                    <th className="text-left font-bold text-white text-[11px] uppercase tracking-wide py-2.5 px-3">Quantity</th>
                    <th className="text-left font-bold text-white text-[11px] uppercase tracking-wide py-2.5 px-3">P Price</th>
                    <th className="text-right font-bold text-white text-[11px] uppercase tracking-wide py-2.5 px-3">Total Price</th>
                    <th className="text-center font-bold text-white text-[11px] uppercase tracking-wide py-2.5 px-3">X</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((c, i) => {
                    const qtyNum = Number(c.qty) || 0;
                    const overMax = qtyNum > c.maxQty;
                    return (
                      <tr key={c.productId} style={i !== cart.length - 1 ? { borderBottom: `1px solid ${C.line}` } : undefined}>
                        <td className="py-3 px-3">
                          <div className="font-semibold" style={{ color: C.forestDark }}>{c.name}</div>
                          <div className="text-[10.5px]" style={{ color: C.muted }}>
                            Lot: {c.lot} · Discount: {c.discount} · VAT: {c.vat}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            min={0}
                            value={c.qty}
                            onChange={(e) => updateCartField(c.productId, "qty", e.target.value)}
                            placeholder="0"
                            className="w-20 rounded-lg px-2.5 py-1.5 text-[12.5px] border outline-none"
                            style={{
                              backgroundColor: C.paper,
                              borderColor: overMax ? C.vermillion : C.line,
                              color: C.ink,
                              fontFamily: FONT_MONO,
                            }}
                          />
                          <div className="text-[10px] font-semibold mt-1" style={{ color: overMax ? C.vermillion : C.rust }}>
                            Max: {c.maxQty} {c.unitLabel}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            min={0}
                            value={c.price}
                            onChange={(e) => updateCartField(c.productId, "price", e.target.value)}
                            className="w-20 rounded-lg px-2.5 py-1.5 text-[12.5px] border outline-none"
                            style={{ backgroundColor: C.paper, borderColor: C.line, color: C.ink, fontFamily: FONT_MONO }}
                          />
                        </td>
                        <td className="py-3 px-3 text-right font-bold" style={{ color: C.ink, fontFamily: FONT_MONO }}>
                          {(qtyNum * (Number(c.price) || 0)).toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => removeFromCart(c.productId)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white mx-auto"
                            style={{ backgroundColor: C.vermillion }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {cart.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[12.5px]" style={{ color: C.muted }}>
                        Click a product on the left to add it here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <FieldLabel required>Note</FieldLabel>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Note"
                  className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none resize-none"
                  style={{ backgroundColor: C.paper, borderColor: C.line, color: C.ink, fontFamily: FONT_BODY }}
                />
              </div>
              <div className="space-y-4">
                <div>
                  <FieldLabel required>Total</FieldLabel>
                  <div
                    className="w-full rounded-lg px-3.5 py-2.5 text-[14px] font-bold border"
                    style={{ backgroundColor: C.paper, borderColor: C.line, color: accent, fontFamily: FONT_MONO }}
                  >
                    ৳{total.toFixed(2)}
                  </div>
                </div>
                <div>
                  <FieldLabel required>Date</FieldLabel>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none"
                    style={{ backgroundColor: C.paper, borderColor: C.line, color: C.ink, fontFamily: FONT_BODY }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleConfirm}
                disabled={cart.length === 0 || !note.trim() || cart.some((c) => !c.qty || Number(c.qty) <= 0 || Number(c.qty) > c.maxQty)}
                className="text-white font-bold text-[13.5px] px-6 py-3 rounded-lg shadow-md disabled:opacity-40 flex items-center gap-2"
                style={{ backgroundColor: accent, boxShadow: `0 4px 12px ${accent}55` }}
              >
                <ArrowRightLeft size={15} /> Confirm Stock Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TransferHistoriesPage({ history }) {
  const [query, setQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("All");

  const filtered = history.filter((r) => {
    const matchesType = typeFilter === "All" || r.type === typeFilter;
    const matchesQuery =
      (r.from + " " + r.to + " " + r.note).toLowerCase().includes(query.toLowerCase());
    return matchesType && matchesQuery;
  });

  return (
    <div className="relative rounded-2xl p-6 pt-7 border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
      <ScallopBorder id="scallop-transfer-history" colors={petals} />
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="font-bold text-[16px] flex items-center gap-2" style={{ fontFamily: FONT_HEAD, color: C.ink }}>
          Transfered Histories
          <span
            className="text-[10.5px] font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: C.forestTint, color: C.forestDark }}
          >
            {history.length} total
          </span>
        </h2>
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none rounded-lg pl-3 pr-8 py-2 text-[12.5px] font-semibold border outline-none cursor-pointer"
              style={{ backgroundColor: C.paper, borderColor: C.line, color: C.ink, fontFamily: FONT_BODY }}
            >
              {["All", "B2B/B2G", "G2B"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.muted }} />
          </div>
          <div
            className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] border"
            style={{ backgroundColor: C.paper, borderColor: C.line, color: C.muted }}
          >
            <Search size={14} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search branch or note…"
              className="bg-transparent outline-none text-[13px] w-44"
              style={{ color: C.ink, fontFamily: FONT_BODY }}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left" style={{ color: C.muted }}>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>Date</th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>Type</th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>Transfer</th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>Items</th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-right" style={{ borderColor: C.line }}>Total</th>
              <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>Note</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => {
              const isG2B = r.type === "G2B";
              const accent = isG2B ? C.peacock : C.purple;
              const accentTint = isG2B ? C.peacockTint : C.purpleTint;
              return (
                <tr key={r.id} style={i !== filtered.length - 1 ? { borderBottom: `1px solid ${C.line}` } : undefined}>
                  <td className="py-3 px-2.5" style={{ color: C.muted, fontFamily: FONT_MONO }}>{r.date}</td>
                  <td className="py-3 px-2.5">
                    <span
                      className="text-[10.5px] font-bold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: accentTint, color: accent }}
                    >
                      {r.type}
                    </span>
                  </td>
                  <td className="py-3 px-2.5">
                    <div className="flex items-center gap-1.5 font-semibold" style={{ color: C.ink }}>
                      {r.from} <ArrowRightLeft size={12} style={{ color: C.muted }} /> {r.to}
                    </div>
                  </td>
                  <td className="py-3 px-2.5" style={{ color: C.muted }}>
                    {r.items.map((it, k) => (
                      <div key={k} className="text-[11.5px]">
                        {it.name} × {it.qty} {it.unitLabel}
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-2.5 text-right font-bold" style={{ fontFamily: FONT_MONO, color: accent }}>
                    ৳{r.total.toFixed(2)}
                  </td>
                  <td className="py-3 px-2.5 max-w-[220px] truncate" style={{ color: C.muted }} title={r.note}>
                    {r.note}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-[13px]" style={{ color: C.muted }}>
                  {history.length === 0
                    ? "No stock transfers yet. Create one from Product Transfer."
                    : "No transfers match your search."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ComingSoonPage({ label }) {
  return (
    <div
      className="relative rounded-2xl border p-14 flex flex-col items-center justify-center text-center gap-3 overflow-hidden"
      style={{ backgroundColor: C.panel, borderColor: C.line }}
    >
      <ScallopBorder id="scallop-comingsoon" colors={petals} />
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: C.marigoldTint, color: C.rust }}
      >
        <Construction size={24} />
      </div>
      <h2 className="font-bold text-[16px]" style={{ fontFamily: FONT_HEAD, color: C.ink }}>
        {label}
      </h2>
      <p className="text-[13px] max-w-sm" style={{ color: C.muted }}>
        এই সেকশনটি এখনও তৈরি হচ্ছে। শীঘ্রই এখানে {label} সম্পর্কিত তথ্য দেখা যাবে।
      </p>
    </div>
  );
}

const PAGE_LABELS = {
  dashboard: "Main Wing Dashboard",
  settings: "Settings",
  tutorial: "Tutorial",
  permissions: "Admin Helper Roll & Permissions",
  "renew-service": "Renew Service",
  "renew-history": "Service Renew Histoy",
  "delivery-man": "Delivery man",
  branch: "Branch",
  "branch-role-permission": "Branch role & permission",
  crm: "CRM",
  "product-stocks": "Product Stocks",
  "product-summery": "Product Summery",
  "stock-alert-qty": "Stock Alert Quantity",
  "product-ledger": "Product Ledger Table",
  "add-new-product": "Add New Product",
  "all-products": "All Products",
  brands: "Brands",
  categories: "Categories",
  "unit-types": "Unit Types",
  "upload-product-csv": "Upload Product By CSV",
  "print-barcode-labels": "Print Barcode / Labels",
  variations: "Variations",
  "create-transfer-b2b": "Create Transfer[B2B, B2G]",
  "stock-transfer-g2b": "Stock Transfer[G2B]",
  "transfer-histories": "Transfered Histories",
};

export default function Dashboard() {
  useGoogleFonts();
  const clock = useClock();
  const [activePage, setActivePage] = React.useState("dashboard");
  const [selectedRole, setSelectedRole] = React.useState(null);
  const [selectedBranchRole, setSelectedBranchRole] = React.useState(null);
  const [transferHistory, setTransferHistory] = React.useState([]);

  const addTransferRecord = (record) => setTransferHistory((prev) => [record, ...prev]);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: C.paper, color: C.ink, fontFamily: FONT_BODY }}>
      {/* SIDEBAR */}
      <aside
        className="w-64 shrink-0 p-4 hidden md:flex md:flex-col"
        style={{ background: `linear-gradient(180deg, ${C.plum} 0%, ${C.plumLight} 100%)`, color: "#E7D9E0" }}
      >
        <div className="flex items-center gap-2.5 px-1.5 pb-4 mb-3 border-b border-white/10">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C9 6 6 8.5 6 12.5C6 16 8.7 19 12 19C15.3 19 18 16 18 12.5C18 8.5 15 6 12 2Z"
              fill={C.marigold}
            />
            <path d="M12 19C12 19 9 21 9 22.2C9 22.6 9.4 23 12 23C14.6 23 15 22.6 15 22.2C15 21 12 19 12 19Z" fill={C.peacock} />
          </svg>
          <span className="font-bold text-white text-[17px] tracking-tight" style={{ fontFamily: FONT_HEAD }}>
            My Business
          </span>
        </div>

        <SidebarNav activePage={activePage} onNavigate={setActivePage} />
      </aside>

      {/* MAIN */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* TOPBAR */}
        <div className="border-b px-4 md:px-7 py-3 flex items-center gap-4" style={{ backgroundColor: C.panel, borderColor: C.line }}>
          <div
            className="flex-1 max-w-md hidden sm:flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] border"
            style={{ backgroundColor: C.paper, borderColor: C.line, color: C.muted }}
          >
            <Search size={15} />
            <input
              className="bg-transparent outline-none flex-1 text-[13px]"
              style={{ color: C.ink, fontFamily: FONT_BODY }}
              placeholder="খুঁজুন — product, invoice, customer…"
            />
          </div>

          <div className="flex items-center gap-2.5 md:gap-3.5 ml-auto">
            <div
              className="text-[12.5px] font-semibold px-3 py-2 rounded-lg hidden sm:block"
              style={{ backgroundColor: C.forestTint, color: C.forestDark, fontFamily: FONT_MONO }}
            >
              {clock}
            </div>
            <button
              className="relative w-9 h-9 rounded-lg border flex items-center justify-center"
              style={{ backgroundColor: C.paper, borderColor: C.line, color: C.ink }}
            >
              <Bell size={15} />
              <span
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ring-2"
                style={{ backgroundColor: C.vermillion, boxShadow: `0 0 0 2px ${C.panel}` }}
              />
            </button>
            <button
              className="w-9 h-9 rounded-lg border items-center justify-center hidden sm:flex"
              style={{ backgroundColor: C.paper, borderColor: C.line, color: C.ink }}
            >
              <MessageCircle size={15} />
            </button>
            <button
              className="text-white font-semibold text-[13px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md"
              style={{ backgroundColor: C.magenta, boxShadow: `0 4px 10px ${C.magenta}40` }}
            >
              <ShoppingCart size={14} /> SELL
            </button>
            <div
              className="hidden lg:flex items-center gap-2 pl-1.5 pr-3 py-1.5 border rounded-lg text-[13px] font-semibold cursor-pointer"
              style={{ borderColor: C.line }}
            >
              <div
                className="w-7 h-7 rounded-lg text-white flex items-center justify-center text-[11px] font-bold"
                style={{ background: `linear-gradient(135deg, ${C.purple}, ${C.magenta})` }}
              >
                SM
              </div>
              SOHAG AHMED MOON <ChevronDown size={13} />
            </div>
          </div>
        </div>

        <div className="p-4 md:p-7 space-y-5">
        {activePage === "settings" ? (
          <ShopSettingsPage />
        ) : activePage === "add-new-product" ? (
          <AddNewProductPage />
        ) : activePage === "upload-product-csv" ? (
          <UploadProductCSVPage />
        ) : activePage === "print-barcode-labels" ? (
          <PrintBarcodeLabelsPage />
        ) : activePage === "all-products" ? (
          <AllProductsPage onNavigate={setActivePage} />
        ) : activePage === "brands" ? (
          <BrandsPage />
        ) : activePage === "categories" ? (
          <CategoriesPage />
        ) : activePage === "unit-types" ? (
          <UnitTypesPage />
        ) : activePage === "variations" ? (
          <VariationsPage />
        ) : activePage === "branch" ? (
          <BranchesPage />
        ) : activePage === "crm" ? (
          <CRMPage />
        ) : activePage === "product-stocks" ? (
          <ProductStocksPage />
        ) : activePage === "stock-alert-qty" ? (
          <StockAlertQtyPage />
        ) : activePage === "create-transfer-b2b" ? (
          <CreateTransferPage mode="B2B_B2G" onConfirm={addTransferRecord} />
        ) : activePage === "stock-transfer-g2b" ? (
          <CreateTransferPage mode="G2B" onConfirm={addTransferRecord} />
        ) : activePage === "transfer-histories" ? (
          <TransferHistoriesPage history={transferHistory} />
        ) : activePage === "branch-role-permission" ? (
          <BranchRolesPage
            onOpenPermissions={(role) => {
              setSelectedBranchRole(role);
              setActivePage("branch-role-permissions-detail");
            }}
          />
        ) : activePage === "branch-role-permissions-detail" ? (
          <BranchRolePermissionsPage
            role={selectedBranchRole || defaultBranchRoles[0]}
            onBack={() => setActivePage("branch-role-permission")}
          />
        ) : activePage === "permissions" ? (
          <AdminRolesPage
            onOpenPermissions={(role) => {
              setSelectedRole(role);
              setActivePage("role-permissions");
            }}
          />
        ) : activePage === "role-permissions" ? (
          <RolePermissionsPage
            role={selectedRole || defaultAdminRoles[0]}
            onBack={() => setActivePage("permissions")}
          />
        ) : activePage !== "dashboard" ? (
          <ComingSoonPage label={PAGE_LABELS[activePage] || activePage} />
        ) : (
          <>
          {/* PANEL HEAD */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="font-bold text-lg flex items-center gap-2" style={{ fontFamily: FONT_HEAD }}>
                <span>📊</span> Daily Sales &amp; Return Summary
              </h1>
              <p className="text-[12.5px]" style={{ color: C.muted }}>
                সব শাখার আজকের হালনাগাদ তথ্য
              </p>
            </div>
            <div className="flex gap-2.5">
              <div className="rounded-lg px-3.5 py-2 text-[12.5px] font-semibold flex items-center gap-2 border" style={{ backgroundColor: C.panel, borderColor: C.line }}>
                All Branch <ChevronDown size={13} />
              </div>
              <div className="rounded-lg px-3.5 py-2 text-[12.5px] font-semibold border" style={{ backgroundColor: C.panel, borderColor: C.line, fontFamily: FONT_MONO }}>
                📅 04/19/2025
              </div>
            </div>
          </div>

          {/* KPI GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpis.map((item, i) => (
              <KpiCard key={item.label} item={item} patternId={`scallop-${i}`} />
            ))}
          </div>

          {/* SPLIT: chart + stock alert */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4">
            <div className="relative rounded-2xl p-5 pt-6 border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
              <ScallopBorder id="scallop-chart" colors={petals} />
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[14.5px]" style={{ fontFamily: FONT_HEAD }}>বিক্রয় প্রবণতা — গত ৭ দিন</h3>
                <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: C.forestTint, color: C.forestDark }}>
                  ▲ ১৮% বৃদ্ধি
                </span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.magenta} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={C.marigold} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={C.line} vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 10.5, fontFamily: "monospace", fill: C.muted }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `৳${v / 1000}k`}
                    />
                    <Tooltip
                      formatter={(v) => [`৳${v.toLocaleString()}`, "বিক্রয়"]}
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${C.line}` }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke={C.magenta}
                      strokeWidth={2.5}
                      fill="url(#salesFill)"
                      dot={{ r: 4, fill: C.magenta }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="relative rounded-2xl p-5 pt-6 border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
              <ScallopBorder id="scallop-stock" colors={petals} />
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-[14.5px]" style={{ fontFamily: FONT_HEAD }}>Stock Alert — কম মজুদ পণ্য</h3>
                <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: C.marigoldTint, color: C.rust }}>
                  3 Items
                </span>
              </div>
              <div>
                {stockAlerts.map((s, i) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between py-2.5"
                    style={i !== stockAlerts.length - 1 ? { borderBottom: `1px dashed ${C.line}` } : undefined}
                  >
                    <div>
                      <div className="text-[13px] font-semibold">{s.name}</div>
                      <div className="text-[11.5px]" style={{ color: C.muted }}>
                        Branch: {s.branch}
                      </div>
                    </div>
                    <span
                      className="text-[12.5px] font-bold px-2.5 py-1 rounded-lg"
                      style={{ backgroundColor: C.rustTint, color: C.rust, fontFamily: FONT_MONO }}
                    >
                      {s.qty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RECENT TRANSACTIONS */}
          <div className="relative rounded-2xl p-5 pt-6 border overflow-hidden" style={{ backgroundColor: C.panel, borderColor: C.line }}>
            <ScallopBorder id="scallop-trans" colors={petals} />
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h3 className="font-bold text-[14.5px]" style={{ fontFamily: FONT_HEAD }}>Sell &amp; Customers — সাম্প্রতিক লেনদেন</h3>
              <button
                className="text-white font-semibold text-[12.5px] px-3.5 py-2 rounded-lg flex items-center gap-1.5"
                style={{ backgroundColor: C.plum }}
              >
                <FileText size={13} /> Generate Report
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[12.8px]">
                <thead>
                  <tr className="text-left" style={{ color: C.muted }}>
                    {["Invoice", "Customer", "Branch", "Status"].map((h) => (
                      <th key={h} className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: C.line }}>
                        {h}
                      </th>
                    ))}
                    <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b text-right" style={{ borderColor: C.line }}>
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, i) => (
                    <tr key={t.inv} style={i !== transactions.length - 1 ? { borderBottom: `1px solid ${C.line}` } : undefined}>
                      <td className="py-2.5 px-2.5">{t.inv}</td>
                      <td className="py-2.5 px-2.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold"
                            style={{ backgroundColor: C.purpleTint, color: C.purple }}
                          >
                            {t.initials}
                          </div>
                          {t.name}
                        </div>
                      </td>
                      <td className="py-2.5 px-2.5">{t.branch}</td>
                      <td className="py-2.5 px-2.5">
                        <span
                          className="text-[10.5px] font-bold px-2.5 py-1 rounded-full"
                          style={
                            t.status === "Paid"
                              ? { backgroundColor: C.forestTint, color: C.forestDark }
                              : { backgroundColor: C.vermillionTint, color: C.vermillion }
                          }
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-2.5 text-right font-bold" style={{ fontFamily: FONT_MONO }}>৳{t.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
}