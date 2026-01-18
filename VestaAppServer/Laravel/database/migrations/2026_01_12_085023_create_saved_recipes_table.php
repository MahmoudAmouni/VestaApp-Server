<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('saved_recipes', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('home_id')->index();

            $table->string('recipe_name', 255);

            $table->text('ingredients')->nullable();
            $table->text('directions')->nullable();
            $table->text('ner')->nullable();

            $table->string('link', 255)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('saved_recipes');
    }
};
