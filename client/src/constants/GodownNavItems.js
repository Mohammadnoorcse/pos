import { Warehouse, MapPin, Truck, FileText, ListChecks } from "lucide-react";

export const GODOWN_NAV_ITEMS = [
  {
    id: "godown-dashboard",
    type: "single",
    icon: Warehouse,
    label: "Godown Dashboard",
    page: "godown-dashboard",
  },
  {
    id: "current-stock-info",
    type: "single",
    icon: MapPin,
    label: "Current Stock Info",
    page: "current-stock-info",
  },
  {
    id: "stock-transfer",
    type: "single",
    icon: Truck,
    label: "Stock Transfer",
    page: "stock-transfer",
  },
  {
    id: "stock-transfer-invoices",
    type: "single",
    icon: FileText,
    label: "Stock Transfer Invoices",
    page: "stock-transfer-invoices",
  },
  {
    id: "stock-in-out-report",
    type: "single",
    icon: ListChecks,
    label: "Stock In Out Report",
    page: "stock-in-out-report",
  },
];