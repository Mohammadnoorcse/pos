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

// এই আইটেমের permission key গুলো ব্যাকএন্ডের
// AdminRoleController::WINGS['Account_Wing'] থেকে হুবহু নেওয়া
export const ACC_NAV_ITEMS = [
  {
    id: "bank-cash",
    label: "Bank & Cash",
    icon: Landmark,
    type: "expandable",
    children: [
      { label: "Banks", page: "acc-banks", permission: "account.bank.and.cash" },
      { label: "Cash Flow", page: "acc-cash-flow", permission: "account.bank.and.cash" },
      { label: "Contra / Balance Transfer", page: "acc-contra-transfer", permission: "account.bank.and.cash" },
      { label: "Contra List", page: "acc-contra-list", permission: "account.bank.and.cash" },
    ],
  },
  {
    id: "transaction",
    label: "Transaction",
    icon: ArrowLeftRight,
    type: "expandable",
    children: [
      { label: "Take Customer Due", page: "acc-transaction-due", permission: "account.transaction" },
      { label: "Supplier Payment", page: "acc-supplier-payment", permission: "supplier.payment" },
    ],
  },

  { id: "expenses", label: "Expenses", icon: Wallet, page: "acc-expenses", permission: "account.expense" },
  {
    id: "incomes",
    label: "Direct / Indirect Incomes",
    icon: DollarSign,
    page: "acc-incomes",
    permission: "account.indirect.income",
  },
  { id: "vouchers", label: "Vouchers", icon: ScrollText, page: "acc-vouchers", permission: "account.vouchers" },
  { id: "loan-capital", label: "Loan & Capital", icon: HandCoins, page: "acc-loan-capital", permission: "account.loan" },
  { id: "reports", label: "Reports", icon: FileBarChart, page: "acc-reports", permission: "account.report" },
  {
    id: "account-statement",
    label: "Account Statement",
    icon: LineChart,
    page: "acc-account-statement",
    permission: "account.statement",
  },
];