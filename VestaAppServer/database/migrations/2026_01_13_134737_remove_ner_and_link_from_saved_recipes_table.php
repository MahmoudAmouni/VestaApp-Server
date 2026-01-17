<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('saved_recipes', function (Blueprint $table) {
            $table->dropColumn(['ner', 'link']);
        });
    }

    public function down(): void
    {
        Schema::table('saved_recipes', function (Blueprint $table) {
            $table->text('ner')->nullable()->after('directions');
            $table->string('link', 255)->nullable()->after('ner');
        });
    }
};
