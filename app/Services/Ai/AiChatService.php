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
        /**
         * Why inject OpenAiClient?
         * - Decouples the service from static calls.
         * - Enables mocking in tests.
         * - Keeps configuration in the provider, not scattered here.
         */
    }

    public function sendMessage(int $homeId, int $threadId, array $data): array
    {
        // if (!auth()->check()) {
        //     throw ApiException::unauthorized('Unauthenticated.');
        // }

        $home = Home::query()->find($homeId);
        if (!$home) {
            throw ApiException::notFound('Home not found.');
        }

        // if ($home->owner_id !== auth()->id()) {
        //     throw ApiException::unauthorized('You are not allowed to access this home.');
        // }

        // Ensure thread exists and belongs to this home
        $thread = ChatThread::query()
            ->where('id', $threadId)
            ->where('home_id', $homeId)
            ->first();

        if (!$thread) {
            throw ApiException::notFound('Chat thread not found for this home.');
        }

        // Ensure user owns the thread (change if shared threads are allowed)
        // if ($thread->user_id !== auth()->id()) {
        //     throw ApiException::unauthorized('You are not allowed to access this thread.');
        // }

        $userText = $data['message'];

        return DB::transaction(function () use ($thread, $userText) {
            /**
             * 1) Persist the user message first.
             * Why?
             * - You keep a complete audit trail even if OpenAI fails.
             * - You can debug issues and replay if needed.
             */
            ChatMessage::query()->create([
                'thread_id' => $thread->id,
                'role' => 'user',
                'content' => $userText,
            ]);

            /**
             * 2) Load recent message history.
             * Why limit (e.g., 20)?
             * - Controls token usage & cost.
             * - Keeps prompt size manageable.
             */
            $history = ChatMessage::query()
                ->where('thread_id', $thread->id)
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

            /**
             * 3) Call OpenAI
             * Why try/catch?
             * - External dependency can fail (timeouts, invalid key, rate limits).
             * - We convert low-level errors into a consistent ApiException response.
             */
            try {
                $response = $this->openAi->chat()->create([
                    'model' => config('services.openai.model', 'gpt-4o-mini'),
                    'messages' => array_merge(
                        [
                            /**
                             * Why a system prompt?
                             * - Stabilizes behavior and tone.
                             * - Reduces “randomness” and keeps your assistant aligned.
                             */
                            [
                                'role' => 'system',
                                'content' => 'You are a helpful home assistant. Keep answers concise and practical.',
                            ],
                        ],
                        $history
                    ),
                ]);

                // Extract assistant response safely
                $assistantText = $response->choices[0]->message->content ?? null;

                if (!$assistantText) {
                    /**
                     * Why treat empty response as conflict?
                     * - It’s an unexpected state for your business flow.
                     * - Helps client apps handle it explicitly.
                     */
                    throw ApiException::conflict('AI returned an empty response.');
                }
            } catch (ApiException $e) {
                // Re-throw our own business exceptions unchanged
                throw $e;
            } catch (\Throwable $e) {
                /**
                 * Why not return raw error details?
                 * - Avoid leaking implementation or secrets (provider, request payload, stack trace).
                 * - Keep a consistent API response format.
                 */
                throw new ApiException('AI provider error.', 502, [
                    'provider' => ['Failed to generate a response.'],
                ]);
            }

            /**
             * 4) Persist the assistant message
             * Why?
             * - Keeps conversation history complete for future prompts.
             * - Allows the client to fetch history later.
             */
            ChatMessage::query()->create([
                'thread_id' => $thread->id,
                'role' => 'assistant',
                'content' => $assistantText,
            ]);

            // Optionally return thread with messages (useful for UI)
            $thread->load(['messages' => fn($q) => $q->orderBy('id')]);

            return [
                'thread' => $thread,
                'reply' => $assistantText,
            ];
        });
    }
}
