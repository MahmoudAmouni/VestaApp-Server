<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('saved_recipes', function (Blueprint $table) {
            $table->string('cuisine_primary', 255)->nullable()->after('directions');
            $table->text('description')->nullable()->after('cuisine_primary');
        });
    }

    public function down(): void
    {
        Schema::table('saved_recipes', function (Blueprint $table) {
            $table->dropColumn(['cuisine_primary', 'description']);
        });
    }
};
