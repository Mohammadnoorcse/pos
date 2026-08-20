<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->string('address')->nullable()->after('phone');
            $table->date('joining_date')->nullable()->after('address');
            // Reference monthly salary figure for this staff member (not a payment
            // record itself — actual paid amounts are tracked in
            // staff_salary_payments so partial/late/bonus payments can differ month to month).
            $table->decimal('monthly_salary', 12, 2)->nullable()->after('joining_date');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'address', 'joining_date', 'monthly_salary']);
        });
    }
};
