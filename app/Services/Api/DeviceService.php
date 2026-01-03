<?php

namespace App\Services\Api;

use App\Exceptions\ApiException;
use App\Models\Device;
use App\Models\DeviceName;
use App\Models\Home;
use App\Models\Room;
use App\Traits\FindOrCreateByName;
use Illuminate\Support\Facades\DB;

class DeviceService
{
    use FindOrCreateByName;


    public function create(int $homeId, int $roomId, array $data): array
    {
        $home = Home::query()->find($homeId);
        if (!$home) {
            throw ApiException::notFound('Home not found.');
        }

        if (auth()->check() && $home->owner_id !== auth()->id()) {
            throw ApiException::unauthorized('You are not allowed to modify this home.');
        }

        $room = Room::query()
            ->where('id', $roomId)
            ->where('home_id', $homeId)
            ->first();

        if (!$room) {
            throw ApiException::notFound('Room not found for this home.');
        }

        $device = DB::transaction(function () use ($homeId, $roomId, $data) {
            $deviceName = $this->findOrCreateByName(DeviceName::class, $data['device_name']);

            $device = new Device();
            $device->home_id = $homeId;
            $device->room_id = $roomId;
            $device->device_name_id = $deviceName->id;
            $device->external_id = $data['external_id'] ?? null;
            $device->is_on = $data['is_on'] ?? false;
            $device->save();

            return $device;
        });

        $device->load('deviceName');

        return ['device' => $device];
    }

    public function delete(int $homeId, int $roomId, int $deviceId): array
    {
        $home = Home::query()->find($homeId);
        if (!$home) {
            throw ApiException::notFound('Home not found.');
        }

        if (auth()->check() && $home->owner_id !== auth()->id()) {
            throw ApiException::unauthorized('You are not allowed to modify this home.');
        }

        $roomExists = Room::query()
            ->where('id', $roomId)
            ->where('home_id', $homeId)
            ->exists();

        if (!$roomExists) {
            throw ApiException::notFound('Room not found for this home.');
        }

        $device = Device::query()
            ->where('id', $deviceId)
            ->where('room_id', $roomId)
            ->where('home_id', $homeId)
            ->first();

        if (!$device) {
            throw ApiException::notFound('Device not found in this room.');
        }

        DB::transaction(function () use ($device) {
            $device->delete(); 
        });

        return ['deleted' => true];
    }
}
