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
  TrendingUp,
  Bell,
  PlayCircle,
  ShieldCheck,
  RefreshCcw,
  History,
  Truck,
  Warehouse,
  Plus,
  Tag,
  Ruler,
  UploadCloud,
  Printer,
  Users,
  ArrowRightLeft,
  Trash2, // Add this for damage icon
} from "lucide-react";

/**
 * প্রতিটা আইটেমে দুটোর একটা (বা কোনোটাই না) থাকতে পারে:
 * - permission: "<catalog-key>"  -> ইউজারের permissionKeys()-এ এই key থাকলেই দেখা যাবে
 * - ownerOnly: true              -> শুধু user_type === "owner" দেখবে
 * কিছুই না থাকলে (ungated) লগইন করা যেকোনো ইউজার দেখতে পারবে —
 * কারণ ব্যাকএন্ডের permission catalog-এ এখনো এই পেজগুলোর জন্য আলাদা key নেই।
 */
export const NAV_ITEMS = [
  {
    id: "dashboard",
    type: "single",
    icon: LayoutDashboard,
    label: "Main Wing Dashboard",
    page: "dashboard",
  },
  {
    id: "shop-setting",
    type: "expandable",
    icon: Settings,
    label: "Shop Setting & Others",
    children: [
      { icon: Settings, label: "Settings", page: "settings", permission: "branch.setting" },
      { icon: PlayCircle, label: "Tutorial", page: "tutorial" },
      {
        icon: ShieldCheck,
        label: "Admin Helper Roll & Permissions",
        page: "permissions",
        ownerOnly: true, // রোল/পারমিশন ম্যানেজমেন্ট — শুধু owner
      },
      { icon: RefreshCcw, label: "Renew Service", tint: true, page: "renew-service", ownerOnly: true },
      {
        icon: History,
        label: "Service Renew Histoy",
        tint: true,
        page: "renew-history",
        ownerOnly: true,
      },
      { icon: Truck, label: "Delivery man", page: "delivery-man", permission: "branch.deliveryman" },
    ],
  },
  {
    id: "shop-branch",
    type: "expandable",
    icon: GitBranch,
    label: "Shop Branch",
    children: [
      { icon: Users, label: "CRM", page: "crm", permission: "admin.crm" },
      { icon: Users, label: "Staff & Salary", page: "staff", permission: "admin.staff.view" },
    ],
  },
  {
    id: "products",
    type: "expandable",
    icon: Package,
    label: "Products",
    children: [
      { icon: Plus, label: "Add New Product", page: "add-new-product", permission: "create.product" },
      { icon: Package, label: "All Products", page: "all-products" },
      { icon: Tag, label: "Brands", page: "brands" },
      { icon: ListTree, label: "Categories", page: "categories" },
      { icon: Ruler, label: "Unit Types", page: "unit-types" },
      { icon: UploadCloud, label: "Upload Product By CSV", page: "upload-product-csv" },
      { icon: Printer, label: "Print Barcode / Labels", page: "print-barcode-labels" },
      { icon: Scissors, label: "Variations", badge: "New", page: "variations" },
      { icon: Scissors, label: "ReturnableInvoices", page: "returnable-invoices", permission: "branch.return.product" },
    ],
  },
  {
    id: "opening-stock",
    type: "expandable",
    icon: Warehouse,
    label: "Opening & Own Stock",
    children: [],
    permission: "branch.opening.own",
  },
  {
    id: "product-stocks",
    type: "single",
    icon: Boxes,
    label: "Product Stocks",
    page: "product-stocks",
    permission: "branch.product.stock",
  },
  {
    id: "product-summery",
    type: "single",
    icon: TrendingUp,
    label: "Product Summery",
    page: "product-summery",
  },
  {
    id: "stock-alert-qty",
    type: "single",
    icon: Bell,
    label: "Stock Alert Quantity",
    badge: "New",
    page: "stock-alert-qty",
  },
  {
    id: "product-transfer",
    type: "expandable",
    icon: ArrowLeftRight,
    label: "Product Transfer",
    children: [
      { icon: ArrowRightLeft, label: "Create Transfer[B2B, B2G]", page: "create-transfer-b2b", permission: "stock.transfer.b2b.b2g" },
      { icon: Truck, label: "Stock Transfer[G2B]", page: "stock-transfer-g2b", permission: "stock.transfer.g2b" },
      { icon: History, label: "Transfered Histories", page: "transfer-histories" },
    ],
  },
  {
    id: "product-ledger",
    type: "single",
    icon: ListTree,
    label: "Product Ledger Table",
    page: "product-ledger",
  },
  {
    id: "product-damage",
    type: "expandable",
    icon: AlertTriangle, // Better icon for damage
    label: "Product Damage",
    children: [
      { icon: Plus, label: "Add Damage Product", page: "add-new-damage", permission: "branch.damage.product" },
      { icon: AlertTriangle, label: "All Damaged Products", page: "all-damage-products", permission: "branch.damage.product" },
    ],
  },

  {
    id: "customers",
    type: "single",
    icon: ListTree,
    label: "Customers",
    page: "customers",
    permission: "branch.customers",
  },
  {
    id: "product-sold-invoice",
    type: "single",
    icon: ListTree,
    label: "Product Sold Invoice",
    page: "product-sold-invoice",
    permission: "branch.reports",
  },
  {
    id: "product-payment-due",
    type: "single",
    icon: ListTree,
    label: "Product Due Payment",
    page: "product-payment-due",
    permission: "branch.received.customer.due",
  },
];