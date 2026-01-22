<?php

namespace App\Http\Controllers\Api;

use App\Services\Api\EspService;
use Illuminate\Http\JsonResponse;

class EspController extends BaseApiController
{
    public function __construct(private readonly EspService $espService)
    {
    }

    public function on(): JsonResponse
    {
        return $this->handle(
            fn() => ['result' => $this->espService->turnOn()],
            'ESP turned on.'
        );
    }

    public function off(): JsonResponse
    {
        return $this->handle(
            fn() => ['result' => $this->espService->turnOff()],
            'ESP turned off.'
        );
    }
}
