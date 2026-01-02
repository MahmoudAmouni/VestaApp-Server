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
        Schema::create('devices', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->unsignedBigInteger('home_id')->index();
            $table->unsignedBigInteger('room_id')->nullable()->index();
            $table->unsignedBigInteger('device_name_id')->index();

            $table->integer('is_on')->default(0);

            $table->string('external_id', 255)->nullable();

            $table->timestamps();
            $table->softDeletes();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};
