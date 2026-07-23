import {
  Landmark,
  ArrowLeftRight,
  Wallet,
  DollarSign,
  ScrollText,
  HandCoins,
  FileBarChart,
  LineChart,
} from "lucide-react";

export const ACC_NAV_ITEMS = [
  {
    id: "bank-cash",
    label: "Bank & Cash",
    icon: Landmark,
    type: "expandable",
    children: [
      { label: "Banks", page: "acc-banks" },
      { label: "Cash Flow", page: "acc-cash-flow" },
      { label: "Contra / Balance Transfer", page: "acc-contra-transfer" },
      { label: "Contra List", page: "acc-contra-list" },
    ],
  },
  {
    id: "transaction",
    label: "Transaction",
    icon: ArrowLeftRight,
    type: "expandable",
    children: [
      { label: "Take Customer Due", page: "acc-transaction-due" },
      { label: "Supplier Payment", page: "acc-supplier-payment" },
     
    ],
  },

  { id: "expenses", label: "Expenses", icon: Wallet, page: "acc-expenses" },
  {
    id: "incomes",
    label: "Direct / Indirect Incomes",
    icon: DollarSign,
    page: "acc-incomes",
  },
  { id: "vouchers", label: "Vouchers", icon: ScrollText, page: "acc-vouchers" },
  { id: "loan-capital", label: "Loan & Capital", icon: HandCoins, page: "acc-loan-capital" },
  { id: "reports", label: "Reports", icon: FileBarChart, page: "acc-reports" },
  {
    id: "account-statement",
    label: "Account Statement",
    icon: LineChart,
    page: "acc-account-statement",
  },
];