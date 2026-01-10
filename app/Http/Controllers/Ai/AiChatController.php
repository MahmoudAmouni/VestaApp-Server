<?php

namespace App\Http\Controllers\Ai;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Chat\CreateThreadRequest;
use App\Http\Requests\Chat\SendMessageRequest;
use App\Services\Ai\AiChatService;
use Illuminate\Http\JsonResponse;

class AiChatController extends BaseApiController
{
    public function __construct(private readonly AiChatService $chatService)
    {
    }

    public function sendMessage(int $home, SendMessageRequest $request): JsonResponse
    {
        return $this->handle(
            fn() => $this->chatService->sendMessage($home, $request->validated()),
            'Message sent.'
        );
    }
}
