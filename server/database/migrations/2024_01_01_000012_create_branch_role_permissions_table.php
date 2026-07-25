<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('branch_role_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_role_id')->constrained('branch_roles')->cascadeOnDelete();
            $table->string('permission_key'); // e.g. branch.sell, branch.reports
            $table->timestamps();

            $table->unique(['branch_role_id', 'permission_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('branch_role_permissions');
    }
};
