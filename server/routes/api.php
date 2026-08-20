<?php

use App\Http\Controllers\Api\Acc\BankController;
use App\Http\Controllers\Api\Acc\CashFlowController;
use App\Http\Controllers\Api\Acc\ContraTransferController;
use App\Http\Controllers\Api\Acc\CustomerDueController;
use App\Http\Controllers\Api\Acc\ExpenseController;
use App\Http\Controllers\Api\Acc\IncomeController;
use App\Http\Controllers\Api\Acc\LoanController;
use App\Http\Controllers\Api\Acc\VoucherController;
use App\Http\Controllers\Api\AdminRoleController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\Api\BranchRoleController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CrmPermissionController;
use App\Http\Controllers\Api\CrmSalesController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductStockController;
use App\Http\Controllers\Api\StaffController;
use App\Http\Controllers\Api\StaffSalaryController;
use App\Http\Controllers\Api\StockAlertController;
use App\Http\Controllers\Api\StockTransferController;
use App\Http\Controllers\Api\UnitTypeController;
use App\Http\Controllers\Api\VariationController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\DamageController;
use App\Http\Controllers\Api\SaleController;
use App\Http\Controllers\Api\SaleReturnController;
use App\Http\Controllers\Api\Supplier\PurchaseController;
use App\Http\Controllers\Api\Supplier\PurchaseReturnController;
use App\Http\Controllers\Api\Supplier\SupplierController;
use App\Http\Controllers\Api\Supplier\SupplierPaymentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Authenticated (Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Dashboard (Main Wing Dashboard page)
   Route::get('/dashboard/kpis', [DashboardController::class, 'kpis']);
    Route::get('/dashboard/sales-trend', [DashboardController::class, 'salesTrend']);
    Route::get('/dashboard/recent-transactions', [DashboardController::class, 'recentTransactions']);
    Route::get('/dashboard/top-products', [DashboardController::class, 'topProducts']);
    Route::get('/dashboard/payment-breakdown', [DashboardController::class, 'paymentBreakdown']);
    Route::get('/dashboard/staff-performance', [DashboardController::class, 'staffPerformance']);
    Route::get('/dashboard/category-sales', [DashboardController::class, 'categorySales']);
    Route::get('/dashboard/expenses-today', [DashboardController::class, 'expensesToday']);
    Route::get('/dashboard/branch-comparison', [DashboardController::class, 'branchComparison']);
    Route::get('/dashboard/cash-summary', [DashboardController::class, 'cashSummary']);
    Route::get('/dashboard/activity-feed', [DashboardController::class, 'activityFeed']);

    // Shop Branch
    Route::apiResource('branches', BranchController::class);

    // Products module
    Route::apiResource('brands', BrandController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('unit-types', UnitTypeController::class);
    Route::apiResource('variations', VariationController::class);
    Route::post('/products/generate-barcode', [ProductController::class, 'generateBarcodeEndpoint']);
    Route::post('/products/upload-csv', [ProductController::class, 'uploadCsv']);
    Route::apiResource('products', ProductController::class);

    // Stock
    Route::get('/product-stocks', [ProductStockController::class, 'index']);
    Route::post('/product-stocks/adjust', [ProductStockController::class, 'adjust']);
    Route::post('/products/{product}/update-stock', [ProductStockController::class, 'updateStock']);
    Route::get('/stock-alerts', [StockAlertController::class, 'index']);

    // Product Transfer (B2B/B2G + G2B) & Transfered Histories
    Route::get('/stock-transfers/sender-stock', [StockTransferController::class, 'senderStock']);
    Route::apiResource('stock-transfers', StockTransferController::class)->only(['index', 'store', 'show']);

    // Admin Helper Roll & Permissions
    Route::get('/admin-roles/permission-catalog', [AdminRoleController::class, 'permissionCatalog']);
    Route::put('/admin-roles/{adminRole}/permissions', [AdminRoleController::class, 'updatePermissions']);
    Route::apiResource('admin-roles', AdminRoleController::class);

    // Branch role & permission
    Route::get('/branch-roles/permission-catalog', [BranchRoleController::class, 'permissionCatalog']);
    Route::put('/branch-roles/{branchRole}/permissions', [BranchRoleController::class, 'updatePermissions']);
    Route::apiResource('branch-roles', BranchRoleController::class);

    // CRM (see admin-roles permission catalog for admin.crm.* key meanings)
    Route::middleware('permission:admin.crm')->group(function () {

        Route::middleware('permission:admin.crm.sales.view')->group(function () {
            Route::get('/crm/summary', [CrmSalesController::class, 'summary']);
            Route::get('/crm/sold-products', [CrmSalesController::class, 'soldProducts']);
            Route::get('/crm/sales-list', [CrmSalesController::class, 'salesList']);
        });

        Route::middleware('permission:admin.crm.permissions.view')->group(function () {
            Route::get('/crm-permissions', [CrmPermissionController::class, 'index']);
        });

        Route::middleware('permission:admin.crm.permissions.manage')->group(function () {
            Route::post('/crm-permissions', [CrmPermissionController::class, 'store']);
            Route::put('/crm-permissions/{crmPermission}', [CrmPermissionController::class, 'update']);
            Route::delete('/crm-permissions/{crmPermission}', [CrmPermissionController::class, 'destroy']);
        });
    });

    // Staff & Salary (branch অনুযায়ী কতজন staff আছে, তাদের details ও salary history)
    Route::middleware('permission:admin.staff.view')->group(function () {
        Route::get('/staff', [StaffController::class, 'index']);
        Route::get('/staff/{staff}', [StaffController::class, 'show']);
        Route::get('/staff-salary-payments', [StaffSalaryController::class, 'index']);
    });
    Route::middleware('permission:admin.staff.manage')->group(function () {
        Route::put('/staff/{staff}', [StaffController::class, 'update']);
    });
    Route::middleware('permission:admin.staff.salary.manage')->group(function () {
        Route::post('/staff-salary-payments', [StaffSalaryController::class, 'store']);
        Route::delete('/staff-salary-payments/{staffSalaryPayment}', [StaffSalaryController::class, 'destroy']);
    });

    // Sales
    Route::get('/due-payment-invoices', [SaleController::class, 'dueInvoices']);
    Route::patch('/invoices/{sale}/toggle-status', [SaleController::class, 'togglePaymentStatus']);
    Route::post('/sales/{sale}/payments', [SaleController::class, 'recordPayment']);
    Route::apiResource('sales', SaleController::class);
    Route::get('/sales/{sale}/returnable-items', [SaleController::class, 'returnableItems']);

    Route::prefix('sale-returns')->group(function () {
        Route::get('/', [SaleReturnController::class, 'index']);
        Route::post('/', [SaleReturnController::class, 'store']);
        Route::get('/{id}', [SaleReturnController::class, 'show']);
    });

    // demage product
    Route::get('/damage-products', [DamageController::class, 'getProducts']);
    Route::get('/damage-records', [DamageController::class, 'index']);
    Route::post('/damage-records', [DamageController::class, 'store']);

    // ================= Customer API Routes =================
    Route::get('/customers', [CustomerController::class, 'index']);
    Route::post('/customers', [CustomerController::class, 'store']);
    Route::get('/customers/{customer}', [CustomerController::class, 'show']);
    Route::put('/customers/{customer}', [CustomerController::class, 'update']);
    Route::delete('/customers/{customer}', [CustomerController::class, 'destroy']);
    Route::get('/customers/{customer}/history', [CustomerController::class, 'history']);


    // supplier deshboard
    Route::get('suppliers/dashboard', [SupplierController::class, 'dashboard']);
    Route::apiResource('suppliers', SupplierController::class);
    Route::apiResource('purchases', PurchaseController::class)->only(['index', 'show', 'store']);
    Route::apiResource('supplier-payments', SupplierPaymentController::class)->only(['index', 'store', 'destroy']);
    Route::apiResource('purchase-returns', PurchaseReturnController::class)->only(['index', 'show', 'store', 'destroy']);

    // Bank Details page
    Route::get('banks', [BankController::class, 'index']);
    Route::get('banks/{bank}', [BankController::class, 'show']);
    Route::post('banks', [BankController::class, 'store']);
    Route::put('banks/{bank}', [BankController::class, 'update']);
    Route::delete('banks/{bank}', [BankController::class, 'destroy']);

    // Cash Flow page
    Route::get('cash-flow', [CashFlowController::class, 'index']);
    Route::post('cash-flow', [CashFlowController::class, 'store']);
    Route::delete('cash-flow/{cashFlowEntry}', [CashFlowController::class, 'destroy']);

    // Contra Transfer page
    Route::get('contra-transfers', [ContraTransferController::class, 'index']);
    Route::post('contra-transfers', [ContraTransferController::class, 'store']);
    Route::patch('contra-transfers/{contraTransfer}/cancel', [ContraTransferController::class, 'cancel']);

    // Expenses page
    Route::get('expenses', [ExpenseController::class, 'index']);
    Route::post('expenses', [ExpenseController::class, 'store']);
    Route::delete('expenses/{expense}', [ExpenseController::class, 'destroy']);

    // Incomes page
    Route::get('incomes', [IncomeController::class, 'index']);
    Route::post('incomes', [IncomeController::class, 'store']);
    Route::delete('incomes/{income}', [IncomeController::class, 'destroy']);

    // Loan / Capital page
    Route::get('loans', [LoanController::class, 'index']);
    Route::post('loans', [LoanController::class, 'store']);
    Route::post('loans/{loan}/payments', [LoanController::class, 'pay']);

    // Supplier Payment page
    // Route::get('supplier-payments/suppliers', [SupplierPaymentController::class, 'suppliers']);
    // Route::get('supplier-payments', [SupplierPaymentController::class, 'index']);
    // Route::post('supplier-payments', [SupplierPaymentController::class, 'store']);

    // Take Customer Due page
    Route::get('customer-dues/customers', [CustomerDueController::class, 'customers']);
    Route::get('customer-dues/collections', [CustomerDueController::class, 'index']);
    Route::post('customer-dues/collections', [CustomerDueController::class, 'store']);

    // Vouchers page
    Route::get('vouchers', [VoucherController::class, 'index']);
    Route::post('vouchers', [VoucherController::class, 'store']);
});
