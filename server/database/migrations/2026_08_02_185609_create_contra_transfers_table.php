<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contra_transfers', function (Blueprint $table) {
            $table->id();
            $table->string('transfer_no')->unique(); // e.g. CNT-0512
            $table->date('date');
            $table->string('from_account'); // "cash" or banks.code
            $table->string('to_account');   // "cash" or banks.code
            $table->decimal('amount', 14, 2);
            $table->string('note')->nullable();
            $table->string('ref')->nullable(); // cheque no, etc.
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('completed');
            $table->foreignId('branch_id')->nullable()->constrained('branches')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contra_transfers');
    }
};
