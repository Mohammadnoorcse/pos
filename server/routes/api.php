<?php

use App\Http\Controllers\Api\AdminRoleController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\Api\BranchRoleController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CrmPermissionController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductStockController;
use App\Http\Controllers\Api\StockAlertController;
use App\Http\Controllers\Api\StockTransferController;
use App\Http\Controllers\Api\UnitTypeController;
use App\Http\Controllers\Api\VariationController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\DamageController;
use App\Http\Controllers\Api\SaleController;
use App\Http\Controllers\Api\SaleReturnController;
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

    // CRM
    Route::apiResource('crm-permissions', CrmPermissionController::class)->except(['show']);

    // Sales
    Route::post('/sales/{sale}/payments', [SaleController::class, 'recordPayment']);
    Route::apiResource('sales', SaleController::class);
    Route::apiResource('customers', CustomerController::class);
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

});
