<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('incomes', function (Blueprint $table) {
            $table->id();
            $table->string('income_no')->unique(); // e.g. INC-5510
            $table->enum('type', ['direct', 'indirect']);
            $table->date('date');
            $table->string('category'); // cash_sale, credit_sale, rent, interest, ...
            $table->string('account');  // "cash" or banks.code
            $table->decimal('amount', 14, 2);
            $table->string('source')->nullable(); // free text description of where it came from
            $table->string('note')->nullable();
            $table->foreignId('branch_id')->nullable()->constrained('branches')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('incomes');
    }
};
