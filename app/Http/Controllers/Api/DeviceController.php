<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Devices\StoreDeviceRequest;
use App\Services\Api\DeviceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeviceController extends BaseApiController
{
    public function __construct(private readonly DeviceService $deviceService)
    {
    }

    public function create(int $home, int $room, StoreDeviceRequest $request): JsonResponse
    {
        return $this->handle(
            fn() => $this->deviceService->create($home, $room, $request->validated()),
            'Device created.',
            201
        );
    }
    public function delete(int $home, int $room, int $device): JsonResponse
    {
        return $this->handle(
            fn() => $this->deviceService->delete($home, $room, $device),
            'Device deleted.'
        );
    }

    public function update(int $home, int $room, int $device, StoreDeviceRequest $request): JsonResponse
    {
        return $this->handle(
            fn() => $this->deviceService->update($home, $room, $device, $request->validated()),
            'Device updated.'
        );
    }
}
