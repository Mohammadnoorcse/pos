import {
  LifeBuoy,
  Users,
  Truck,
  FileText,
  FileClock,
  FileCheck2,
  Wallet,
  Undo2,
  Table2,
  BarChart3,
} from "lucide-react";

// Add this alongside your existing NAV_ITEMS export in constants.js
export const SUPPLIER_NAV_ITEMS = [
  { id: "supplier-dashboard", label: "Supplier Dashboard", icon: LifeBuoy, page: "supplier-dashboard" },
  { id: "suppliers", label: "Suppliers", icon: Users, page: "suppliers" },
  { id: "stock-in-purchase", label: "Stock in / Purchase", icon: Truck, page: "stock-in-purchase" },
  { id: "purchase-invoices", label: "Purchase Invoices", icon: FileText, page: "purchase-invoices" },
  { id: "due-purchase-report", label: "Due Purchase Report", icon: FileClock, page: "due-purchase-report" },
  { id: "purchase-due-collection", label: "Purchase Due Collection", icon: FileCheck2, page: "purchase-due-collection" },
  { id: "p-invoices-report", label: "P Invoices Report", icon: FileText, page: "p-invoices-report", badge: "New" },
  { id: "supplier-payment", label: "Supplier Payment", icon: Wallet, page: "supplier-payment" },
  { id: "purchase-return", label: "Purchase Return", icon: Undo2, page: "purchase-return" },
  { id: "supplier-table-ledger", label: "Supplier Table Ledger", icon: Table2, page: "supplier-table-ledger" },
  { id: "supplier-reports", label: "Supplier Reports", icon: BarChart3, page: "supplier-reports" },
];