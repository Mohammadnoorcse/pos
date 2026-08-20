<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->string('expense_no')->unique()->nullable()->after('id'); // e.g. EXP-3301
            $table->string('category')->nullable()->after('title');
            $table->string('account')->default('cash')->after('category'); // "cash" or banks.code
            $table->string('payee')->nullable()->after('account');
            $table->string('note')->nullable()->after('payee');
            $table->foreignId('created_by')->nullable()->after('note')->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->dropConstrainedForeignId('created_by');
            $table->dropColumn(['expense_no', 'category', 'account', 'payee', 'note']);
        });
    }
};
