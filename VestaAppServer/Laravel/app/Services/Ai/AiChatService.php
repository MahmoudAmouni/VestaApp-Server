<?php

namespace App\Services\Ai;

use App\Exceptions\ApiException;
use App\Models\ChatMessage;
use App\Models\ChatThread;
use App\Models\Home;
use Illuminate\Support\Facades\DB;
use OpenAI\Client as OpenAiClient;

class AiChatService
{
    public function __construct(private readonly OpenAiClient $openAi)
    {

    }

    public function sendMessage(int $homeId, array $data): array
    {


        $home = Home::query()->find($homeId);
        if (!$home) {
            throw ApiException::notFound('Home not found.');
        }
        $userText = $data['message'];

        return DB::transaction(function () use ($homeId, $userText) {

            ChatMessage::query()->create([
                'home_id' => $homeId,
                'role' => 'user',
                'content' => $userText,
            ]);

            $history = ChatMessage::query()
                ->where('home_id', $homeId)
                ->orderBy('id', 'desc')
                ->limit(20)
                ->get()
                ->reverse()
                ->values()
                ->map(fn(ChatMessage $m) => [
                    'role' => $m->role,
                    'content' => $m->content,
                ])
                ->all();

   
            try {
                $response = $this->openAi->chat()->create([
                    'model' => config('services.openai.model', 'gpt-4o-mini'),
                    'messages' => array_merge(
                        [

                            [
                                'role' => 'system',
                                'content' => 'You are a helpful home assistant. Keep answers concise and practical.',
                            ],
                        ],
                        $history
                    ),
                ]);

                $assistantText = $response->choices[0]->message->content ?? null;

                if (!$assistantText) {

                    throw ApiException::conflict('AI returned an empty response.');
                }
            } catch (ApiException $e) {
                throw $e;
            } catch (\Throwable $e) {
                throw new ApiException('AI provider error.', 502, [
                    'provider' => ['Failed to generate a response.'],
                ]);
            }
            ChatMessage::query()->create([
                'home_id' => $homeId,
                'role' => 'assistant',
                'content' => $assistantText,
            ]);
            return [
                'reply' => $assistantText,
            ];
        });
    }
}
