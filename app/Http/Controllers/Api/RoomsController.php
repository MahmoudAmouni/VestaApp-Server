<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Service\Api\RoomsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoomsController extends BaseApiController
{
    public function __construct(private readonly RoomsService $roomesService)
    {
    }
    public function listRoomsWithDevices(int $home_id): JsonResponse
    {
        return $this->handle(
            fn() => $this->roomesService->listRoomsWithDevices($home_id),
            'Rooms loaded.'
        );
    }
}
