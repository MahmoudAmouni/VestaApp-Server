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
    public function listMessages(int $homeId, int $threadId): array
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

        $thread = ChatThread::query()
            ->where('id', $threadId)
            ->where('home_id', $homeId)
            ->first();

        if (!$thread) {
            throw ApiException::notFound('Chat thread not found.');
        }

        $messages = ChatMessage::query()
            ->where('thread_id', $threadId)
            ->orderByDesc('id') 
            ->paginate(20);

        return ['chat_messages' => $messages];

    }

}
