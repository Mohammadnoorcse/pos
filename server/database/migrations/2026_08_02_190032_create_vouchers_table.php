<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('voucher_no')->unique(); // PV-1042, RV-2231, CV-0118, JV-0056
            $table->enum('type', ['payment', 'receipt', 'journal', 'contra']);
            $table->date('date');
            $table->string('party'); // who it's with / description
            $table->string('account'); // "cash" or banks.code
            $table->decimal('amount', 14, 2);
            $table->string('narration')->nullable();
            $table->foreignId('prepared_by')->nullable()->constrained('users')->nullOnDelete();

            // Optional polymorphic-ish link back to the source record that generated
            // this voucher automatically (supplier payment, income, contra transfer, etc.)
            $table->string('source_type')->nullable(); // e.g. SupplierPayment, Income, ContraTransfer
            $table->unsignedBigInteger('source_id')->nullable();

            $table->foreignId('branch_id')->nullable()->constrained('branches')->nullOnDelete();
            $table->timestamps();

            $table->index(['source_type', 'source_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
