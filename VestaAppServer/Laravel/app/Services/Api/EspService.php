<?php

namespace App\Services\Api;

use Illuminate\Support\Facades\Http;
use Exception;

class EspService
{
    private string $baseUrl;

    public function __construct()
    {
        $ip = config('services.esp.ip');
        if (!$ip) {
            throw new Exception('ESP IP address is not configured.');
        }
        $this->baseUrl = "http://{$ip}";
    }

    public function turnOn(): bool
    {
        $response = Http::get("{$this->baseUrl}/on");
        return $response->successful();
    }

    public function turnOff(): bool
    {
        $response = Http::get("{$this->baseUrl}/off");
        return $response->successful();
    }
}
