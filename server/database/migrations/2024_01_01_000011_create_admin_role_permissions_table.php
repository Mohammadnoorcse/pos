<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_role_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_role_id')->constrained('admin_roles')->cascadeOnDelete();
            $table->string('wing'); // Account_Wing, Godown_Wing, Main_Wing, Supplier_Wing
            $table->string('permission_key'); // e.g. account.dashboard
            $table->timestamps();

            $table->unique(['admin_role_id', 'permission_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_role_permissions');
    }
};
