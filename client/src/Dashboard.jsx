import React from "react";
import { useGoogleFonts, useClock, usePageState } from "./hooks";
import { MainLayout } from "./components/layout";
import {
  DashboardPage,
  ComingSoonPage,
  AddNewProductPage,
  AllProductsPage,
  BrandsPage,
  CategoriesPage,
  UnitTypesPage,
  VariationsPage,
  UploadProductCSVPage,
  PrintBarcodeLabelsPage,
  BranchesPage,
  AdminRolesPage,
  RolePermissionsPage,
  BranchRolesPage,
  BranchRolePermissionsPage,
  CRMPage,
  StaffPage,
  StaffDetailPage,
  ProductStocksPage,
  StockAlertQtyPage,
  CreateTransferPage,
  TransferHistoriesPage,
  ShopSettingsPage,
  
  AddDamageProduct,
  AllDamageProduct,
  SoldInvoices,
  ReturnableInvoices,
  ProductSummaryPage
} from "./components/pages";
import { PAGE_LABELS } from "./constants";
import { ProductsLedger } from "./components/pages/Ledgers/ProductsLedger";
import { ShopCustomers } from "./components/pages/Shopcustomers";
import { DuePaymentInvoices } from "./components/pages/Payment";
import { DueConnectionReportPage, DuePurchaseReportPage, ProductReturnPage, ProductSuppliers, PurchaseInvoiceReportPage, PurchasePage, SupplierDashboardPage, SupplierInvoicesPage, SupplierLedgerPage, SupplierPaymentPage } from "./components/supplier";
import { BankDetailsPage,CashFlowPage,ContraTransferPage,TakeCustomerDuePage,SupplierPaymentAcc, ExpensesAcc,IncomesAcc,VouchersAcc,LoanCapitalPage} from "./components/Acc";


import SellPage  from "./components/pages/Sell/SellPage";
import { AccessDeniedPage } from "./components/layout/AccessDeniedPage";
import { PAGE_ACCESS_MAP } from "./constants/pageAccess";
import { getStoredPermissions, canSeeNavItem } from "./api/permissions";


// user, onLogout -> App.js theke ashche (logged-in user + logout handler)
export default function Dashboard({ user, onLogout }) {
  useGoogleFonts();

  const {
    activePage,
    setActivePage,
    selectedRole,
    setSelectedRole,
    selectedBranchRole,
    setSelectedBranchRole,
    selectedStaff,
    setSelectedStaff,
    transferHistory,
    addTransferRecord,
  } = usePageState();

  const renderPage = () => {
    // ইউজার সাইডবারে না দেখলেও activePage সরাসরি বদলে (deep-link/state hack) কেউ
    // যেন গোপন পাতায় ঢুকতে না পারে — এখানে একবার centrally চেক করা হয়।
    const access = PAGE_ACCESS_MAP[activePage];
    if (access) {
      const permissions = getStoredPermissions();
      const allowed = canSeeNavItem(access, { permissions, user });
      if (!allowed) {
        return <AccessDeniedPage label={PAGE_LABELS[activePage] || activePage} />;
      }
    }

    switch (activePage) {
      case "dashboard":
        return <DashboardPage />;

      // Sell / POS
      case "sell":
        return <SellPage onBack={() => setActivePage("dashboard")} />;

      // Products
      case "add-new-product":
        return <AddNewProductPage />;
      case "all-products":
        return <AllProductsPage onNavigate={setActivePage} />;
      case "brands":
        return <BrandsPage />;
      case "categories":
        return <CategoriesPage />;
      case "unit-types":
        return <UnitTypesPage />;
      case "variations":
        return <VariationsPage />;
      case "upload-product-csv":
        return <UploadProductCSVPage />;
      case "print-barcode-labels":
        return <PrintBarcodeLabelsPage />;
      case "returnable-invoices":
        return <ReturnableInvoices />;

      // Branches
      case "branch":
        return <BranchesPage />;
      case "permissions":
        return (
          <AdminRolesPage
            onOpenPermissions={(role) => {
              setSelectedRole(role);
              setActivePage("role-permissions");
            }}
          />
        );
      case "role-permissions":
        return (
          <RolePermissionsPage
            role={selectedRole}
            onBack={() => setActivePage("permissions")}
          />
        );
      case "branch-role-permission":
        return (
          <BranchRolesPage
            onOpenPermissions={(role) => {
              setSelectedBranchRole(role);
              setActivePage("branch-role-permissions-detail");
            }}
          />
        );
      case "branch-role-permissions-detail":
        return (
          <BranchRolePermissionsPage
            role={selectedBranchRole}
            onBack={() => setActivePage("branch-role-permission")}
          />
        );
      case "crm":
        return <CRMPage />;
      case "staff":
        return (
          <StaffPage
            onOpenStaff={(staff) => {
              setSelectedStaff(staff);
              setActivePage("staff-detail");
            }}
          />
        );
      case "staff-detail":
        return (
          <StaffDetailPage
            staff={selectedStaff}
            onBack={() => setActivePage("staff")}
          />
        );

      // Stock
      case "product-stocks":
        return <ProductStocksPage />;
      case "product-summery":
        return <ProductSummaryPage />;
      case "stock-alert-qty":
        return <StockAlertQtyPage />;

      // Transfer
      case "create-transfer-b2b":
        return (
          <CreateTransferPage mode="B2B_B2G" onConfirm={addTransferRecord} />
        );
      case "stock-transfer-g2b":
        return (
          <CreateTransferPage mode="G2B" onConfirm={addTransferRecord} />
        );
      case "transfer-histories":
        return <TransferHistoriesPage history={transferHistory} />;

      // Settings
      case "settings":
        return <ShopSettingsPage />;
      case "product-ledger":
        return <ProductsLedger />;

      // Product Damage
      case "add-new-damage":
        return <AddDamageProduct />;
      case "all-damage-products":
        return <AllDamageProduct />;
      case "customers":
        return <ShopCustomers />;
      case "product-sold-invoice":
        return < SoldInvoices/>;
      case "product-payment-due":
        return < DuePaymentInvoices/>;

        // supplier
        case "supplier-dashboard":
        return < SupplierDashboardPage/>;
        case "suppliers":
        return < ProductSuppliers/>;
        case "stock-in-purchase":
        return < PurchasePage/>;
        case "purchase-invoices":
        return <SupplierInvoicesPage/>;
        case "due-purchase-report":
        return < DuePurchaseReportPage/>;
        case "purchase-due-collection":
        return < DueConnectionReportPage/>;
        case "p-invoices-report":
        return < PurchaseInvoiceReportPage/>;
        case "supplier-payment":
        return <SupplierPaymentPage/>;
        case "purchase-return":
        return <ProductReturnPage/>;
        case "supplier-table-ledger":
        return <SupplierLedgerPage/>;
      

        // account
        case "acc-banks":
        return <BankDetailsPage/>;
        case "acc-cash-flow":
        return <CashFlowPage/>;
        case "acc-contra-transfer":
        return <ContraTransferPage/>;
        case "acc-transaction-due":
        return <TakeCustomerDuePage/>;
        case "acc-supplier-payment":
        return <SupplierPaymentAcc/>;
        case "acc-expenses":
        return < ExpensesAcc/>;
        case "acc-incomes":
        return < IncomesAcc/>;
        case "acc-vouchers":
        return < VouchersAcc/>;
        case "acc-loan-capital":
        return < LoanCapitalPage/>;


      // Coming Soon
      default:
        return (
          <ComingSoonPage
            label={PAGE_LABELS[activePage] || activePage}
          />
        );
    }
  };

  return (
    <MainLayout
      user={user}
      onLogout={onLogout}
      activePage={activePage}
      onNavigate={setActivePage}
    >
      {renderPage()}
    </MainLayout>
  );
}