<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->cascadeOnDelete();
            $table->integer('quantity')->default(0);
            $table->string('lot_no')->nullable();
            $table->timestamps();

            $table->unique(['branch_id', 'product_id', 'product_variant_id'], 'branch_product_variant_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_stocks');
    }
};
