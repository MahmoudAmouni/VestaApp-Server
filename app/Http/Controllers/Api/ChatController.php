<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Api\ChatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends BaseApiController
{
    public function __construct(private readonly ChatService $chatService)
    {
    }
    public function list(int $home, int $thread): JsonResponse
    {
        return $this->handle(
            fn() => $this->chatService->listMessages($home, $thread),
            'Chat messages fetched.'
        );
    }

}
