<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Track how much of a purchase has been returned + any resulting
        // receivable (we overpaid the supplier relative to what we now owe).
        Schema::table('purchases', function (Blueprint $table) {
            $table->decimal('return_total', 15, 2)->default(0)->after('due');
            $table->decimal('receivable', 15, 2)->default(0)->after('return_total');
        });
 
        Schema::create('purchase_returns', function (Blueprint $table) {
            $table->id();
            $table->string('return_no')->unique();
            $table->foreignId('purchase_id')->constrained()->cascadeOnDelete();
            $table->foreignId('supplier_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->decimal('total', 15, 2)->default(0);
            $table->string('reason')->nullable();
            $table->date('return_date');
            $table->timestamps();
        });
 
        Schema::create('purchase_return_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_return_id')->constrained()->cascadeOnDelete();
            $table->foreignId('purchase_item_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->integer('qty');
            $table->decimal('price', 15, 2);
            $table->decimal('total', 15, 2);
            $table->timestamps();
        });
    }
 
    public function down(): void
    {
        Schema::dropIfExists('purchase_return_items');
        Schema::dropIfExists('purchase_returns');
 
        Schema::table('purchases', function (Blueprint $table) {
            $table->dropColumn(['return_total', 'receivable']);
        });
    }
};
