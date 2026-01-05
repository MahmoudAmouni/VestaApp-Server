<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Rooms\StoreRoomRequest;
use App\Services\Api\RoomsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoomsController extends BaseApiController
{
    public function __construct(private readonly RoomsService $roomsService)
    {
    }
    public function listRoomsWithDevices(int $home_id): JsonResponse
    {
        return $this->handle(
            fn() => $this->roomsService->listRoomsWithDevices($home_id),
            'Rooms loaded.'
        );
    }
    public function create(int $home, StoreRoomRequest $request): JsonResponse
    {
        return $this->handle(
            fn() => $this->roomsService->create($home, $request->validated()),
            'Room created.',
            201
        );
    }
    public function delete(int $home, int $room): JsonResponse
    {
        return $this->handle(
            fn() => $this->roomsService->delete($home, $room),
            'Room deleted.'
        );
    }


    public function update(int $home, int $room, StoreRoomRequest $request): JsonResponse
    {
        return $this->handle(
            fn() => $this->roomsService->update($home, $room, $request->validated()),
            'Room updated.'
        );
    }
}
