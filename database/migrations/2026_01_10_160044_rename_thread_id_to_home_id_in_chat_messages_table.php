<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('chat_messages', function (Blueprint $table) {
            $table->dropIndex(['thread_id']);

            $table->renameColumn('thread_id', 'home_id');

            $table->index('home_id');
        });
    }

    public function down(): void
    {
        Schema::table('chat_messages', function (Blueprint $table) {
            $table->dropIndex(['home_id']);
            $table->renameColumn('home_id', 'thread_id');
            $table->index('thread_id');
        });
    }
};
