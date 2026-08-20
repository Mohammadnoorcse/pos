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

// permission key গুলো AdminRoleController::WINGS['Supplier_Wing'] থেকে;
// যেগুলোর ক্যাটালগে এখনো আলাদা key নেই সেগুলো ungated রাখা হলো (owner+যেকোনো লগইন ইউজার দেখবে)
export const SUPPLIER_NAV_ITEMS = [
  { id: "supplier-dashboard", label: "Supplier Dashboard", icon: LifeBuoy, page: "supplier-dashboard", permission: "supplier.dashboard" },
  { id: "suppliers", label: "Suppliers", icon: Users, page: "suppliers" },
  { id: "stock-in-purchase", label: "Stock in / Purchase", icon: Truck, page: "stock-in-purchase" },
  { id: "purchase-invoices", label: "Purchase Invoices", icon: FileText, page: "purchase-invoices" },
  { id: "due-purchase-report", label: "Due Purchase Report", icon: FileClock, page: "due-purchase-report", permission: "supplier.due.report" },
  { id: "p-invoices-report", label: "P Invoices Report", icon: FileText, page: "p-invoices-report", badge: "New" },
  { id: "supplier-payment", label: "Supplier Payment", icon: Wallet, page: "supplier-payment", permission: "supplier.payment" },
  { id: "purchase-return", label: "Purchase Return", icon: Undo2, page: "purchase-return" },
  { id: "supplier-table-ledger", label: "Supplier Table Ledger", icon: Table2, page: "supplier-table-ledger", permission: "supplier.ledger" },
  { id: "supplier-reports", label: "Supplier Reports", icon: BarChart3, page: "supplier-reports" },
];