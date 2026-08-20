<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cash_flow_entries', function (Blueprint $table) {
            $table->id();
            $table->string('entry_no')->unique(); // e.g. CF-2210
            $table->date('date');
            $table->enum('type', ['in', 'out']);
            // "cash" or a banks.code value (e.g. BNK-001) — kept as string, not FK,
            // since "cash in hand" is not a row in banks.
            $table->string('source');
            $table->string('category');
            $table->string('note')->nullable();
            $table->decimal('amount', 14, 2);
            $table->foreignId('branch_id')->nullable()->constrained('branches')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_flow_entries');
    }
};
