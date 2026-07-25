<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->foreignId('brand_id')->nullable()->constrained('brands')->nullOnDelete();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->foreignId('unit_type_id')->constrained('unit_types')->cascadeOnDelete();
            $table->decimal('purchase_price', 12, 2)->default(0);
            $table->decimal('selling_price', 12, 2)->default(0);
            $table->string('image_path')->nullable();
            $table->text('description')->nullable();
            $table->string('barcode')->unique()->nullable();
            $table->enum('discount_status', ['Flat', 'Percent', 'No'])->default('No');
            $table->decimal('discount_value', 12, 2)->default(0);
            $table->enum('vat_status', ['Yes', 'No'])->default('No');
            $table->decimal('vat_percent', 5, 2)->default(0);
            $table->unsignedInteger('alert_quantity')->default(0);
            $table->boolean('has_variations')->default(false);
            $table->timestamps();
        });

        // per-product enabled variation types (e.g. this product uses Size + Color)
        Schema::create('product_variation', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('variation_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });

        // concrete purchasable variants, e.g. Product X / Size L / Color Red
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('sku')->unique()->nullable();
            $table->string('barcode')->unique()->nullable();
            $table->decimal('purchase_price', 12, 2)->nullable();
            $table->decimal('selling_price', 12, 2)->nullable();
            $table->timestamps();
        });

        // which variation_value(s) make up a given variant, e.g. variant #1 = {Size:L, Color:Red}
        Schema::create('product_variant_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_variant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('variation_value_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variant_values');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('product_variation');
        Schema::dropIfExists('products');
    }
};
