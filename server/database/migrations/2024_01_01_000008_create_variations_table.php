<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('variations', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g. Size, Color
            $table->timestamps();
        });

        Schema::create('variation_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('variation_id')->constrained()->cascadeOnDelete();
            $table->string('value'); // e.g. S, M, L / Red, Blue
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('variation_values');
        Schema::dropIfExists('variations');
    }
};
