<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use OpenAI\Client as OpenAiClient;

class OpenAiServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(OpenAiClient::class, function () {
            $apiKey = config('services.openai.key');

            if (!$apiKey) {
                throw new \RuntimeException('OPENAI_API_KEY is not configured.');
            }

            return \OpenAI::client($apiKey);
        });
    }
}
