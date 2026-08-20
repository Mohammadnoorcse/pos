<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
 public function up(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            // Marks the single "Main / HQ" branch. Owner, Admin and this
            // branch's staff can log in from the main (no branch_id) frontend.
            // Every other branch gets its own frontend build (VITE_BRANCH_ID set)
            // and only that branch's own staff can log in there.
            $table->boolean('is_main')->default(false)->after('is_active');
        });
    }
 
    public function down(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            $table->dropColumn('is_main');
        });
    }
};
