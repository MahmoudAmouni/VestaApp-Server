<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pantry_items', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->unsignedBigInteger('home_id')->index();
            $table->unsignedBigInteger('owner_user_id')->nullable()->index();
            $table->unsignedBigInteger('item_name_id')->index();

            $table->unsignedBigInteger('location_id')->index();

            $table->integer('quantity')->default(0);
            $table->unsignedBigInteger('unit_id')->nullable()->index();

            $table->unsignedBigInteger('expiry_date')->nullable();  // unix seconds

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pantry_items');
    }
};
