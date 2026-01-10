<?php

namespace App\Services\Api;

use App\Exceptions\ApiException;
use App\Models\ChatMessage;
use App\Models\ChatThread;
use App\Models\Home;

class ChatService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        
    }
    public function listMessages(int $homeId): array
    {
        $home = Home::query()->find($homeId);
        if (!$home) {
            throw ApiException::notFound('Home not found.');
        }

        // if (!auth()->check()) {
        //     throw ApiException::unauthorized('Authentication required.');
        // }

        // if ($home->owner_id !== auth()->id()) {
        //     throw ApiException::unauthorized('You are not allowed to view this home.');
        // }




        $messages = ChatMessage::query()
            ->where('home_id', $homeId)
            ->orderByDesc('id') 
            ->paginate(10);

        return ['chat_messages' => $messages];

    }

}
