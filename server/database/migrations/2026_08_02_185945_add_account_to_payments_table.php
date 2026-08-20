<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
     public function up(): void
    {
        // supplier_payments already has an implicit account concept via 'method',
        // but the frontend needs a concrete "cash"/banks.code reference.
        Schema::table('supplier_payments', function (Blueprint $table) {
            $table->string('account')->default('cash')->after('method');
        });

        // payments table (customer collections / income / payment_out) needs the same.
        Schema::table('payments', function (Blueprint $table) {
            $table->string('account')->default('cash')->after('type');
            $table->foreignId('customer_id')->nullable()->after('sale_id')
                ->constrained('customers')->nullOnDelete();
            $table->string('note')->nullable()->after('account');
        });
    }

    public function down(): void
    {
        Schema::table('supplier_payments', function (Blueprint $table) {
            $table->dropColumn('account');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropConstrainedForeignId('customer_id');
            $table->dropColumn(['account', 'note']);
        });
    }
};
