<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('damage_records', function (Blueprint $table) {
            $table->id(); // অথবা $table->uuid('id')->primary();

            // foreignUuid পরিবর্তন করে foreignId করা হয়েছে
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');

            $table->foreignId('branch_id')->nullable()->constrained('branches')->nullOnDelete();
            $table->foreignId('unit_id')->nullable()->constrained('unit_types')->nullOnDelete();
            $table->foreignId('variation_id')->nullable()->constrained('variations')->nullOnDelete();

            $table->string('place')->nullable()->default('My Shop');
            $table->integer('lot_number')->nullable();
            $table->decimal('purchase_price', 10, 2);
            $table->decimal('sales_price', 10, 2);
            $table->string('discount')->default('no(0)');
            $table->string('vat')->default('0%');
            $table->string('barcode')->nullable();
            $table->decimal('quantity', 10, 2);
            $table->string('unit', 20)->default('pcs');
            $table->text('reason');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('damage_records');
    }
};
