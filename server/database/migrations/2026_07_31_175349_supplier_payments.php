<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supplier_payments', function (Blueprint $table) {
            $table->id();
            $table->string('payment_no')->unique(); // e.g. PMT-2041
            $table->foreignId('supplier_id')->constrained()->cascadeOnDelete();
            $table->foreignId('purchase_id')->nullable()->constrained('purchases')->nullOnDelete();
            $table->decimal('amount', 14, 2);
            $table->enum('method', ['Cash', 'Bank Transfer', 'bKash', 'Nagad', 'Cheque'])->default('Cash');
            $table->text('note')->nullable();
            $table->string('received_by')->nullable();
            $table->string('paid_by')->nullable();
            $table->date('paid_date');
            $table->timestamps();
        });
    }
 
    public function down(): void
    {
        Schema::dropIfExists('supplier_payments');
    }
};
