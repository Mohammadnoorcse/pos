<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
    {
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->string('loan_no')->unique(); // e.g. LN-0012
            $table->enum('kind', ['loan', 'capital']); // loan = borrowed, capital = owner's capital injection
            $table->string('party'); // bank / person / investor name
            $table->string('party_type')->nullable(); // Bank, Person, Investor...
            $table->decimal('principal', 14, 2);
            $table->decimal('rate', 5, 2)->nullable(); // interest rate %, null for capital
            $table->unsignedInteger('tenure_months')->nullable();
            $table->decimal('emi', 14, 2)->nullable();
            $table->decimal('outstanding', 14, 2)->default(0);
            $table->date('next_due')->nullable();
            $table->enum('status', ['active', 'closed', 'defaulted'])->default('active');
            $table->date('taken_on');
            $table->string('purpose')->nullable();
            $table->foreignId('branch_id')->nullable()->constrained('branches')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // repayment/installment history against a loan
        Schema::create('loan_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->decimal('amount', 14, 2);
            $table->string('account')->default('cash'); // "cash" or banks.code
            $table->string('note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loan_payments');
        Schema::dropIfExists('loans');
    }
};
