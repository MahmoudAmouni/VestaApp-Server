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
        Schema::create('pantry_events', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('home_id')->index();
            $table->unsignedBigInteger('pantry_item_id')->nullable()->index();

            $table->string('event_type', 255);//make it removed quantity-unit 

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pantry_events');
    }
};
