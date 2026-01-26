<?php

namespace App\Services\Api;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\UploadedFile;

class VestaService
{

    protected $vestaUrl;

    
    public function __construct()
    {
        $this->vestaUrl = env('VESTA_PYTHON_URL', 'http://127.0.0.1:8002');
    }

    public function sendVoiceMessage($homeId, $token, UploadedFile $audio)
    {
        $response = Http::timeout(120)->attach(
            'audio', file_get_contents($audio->path()), 'voice_command.m4a'
        )->post("{$this->vestaUrl}/api/agent/chat", [
            'home_id' => $homeId,
            'laravel_token' => $token,
        ]);

        if ($response->failed()) {
             throw new \Exception('Vesta Voice Service failed: ' . $response->body());
        }

        return $response->json();
    }
}
