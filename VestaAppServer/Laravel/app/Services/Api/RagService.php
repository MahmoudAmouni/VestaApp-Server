<?php

namespace App\Services\Api;

use Illuminate\Support\Facades\Http;

class RagService
{
    protected $baseUrl;

    public function __construct()
    {
        $this->baseUrl = 'http://127.0.0.1:8002';
    }

    public function search(array $data)
    {
        $response = Http::post("{$this->baseUrl}/api/v1/rag/search", $data);

        if ($response->failed()) {
            throw new \Exception('RAG Service failed: ' . $response->body());
        }

        return $response->json();
    }
}
