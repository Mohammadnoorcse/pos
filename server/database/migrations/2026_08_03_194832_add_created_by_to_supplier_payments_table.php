<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('supplier_payments', function (Blueprint $table) {
            // users টেবিলের সাথে FK সম্পর্ক করতে চাইলে:
            $table->foreignId('created_by')->nullable()->after('note')->constrained('users')->nullOnDelete();
            
            // অথবা সাধারণ integer কলাম হিসেবে রাখতে চাইলে:
            // $table->unsignedBigInteger('created_by')->nullable()->after('note');
        });
    }

    public function down(): void
    {
        Schema::table('supplier_payments', function (Blueprint $table) {
            $table->dropColumn('created_by');
        });
    }
};
