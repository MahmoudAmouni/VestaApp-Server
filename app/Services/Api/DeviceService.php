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

            return Device::create([
                'home_id' => $homeId,
                'room_id' => $roomId,
                'device_name_id' => $deviceName->id,
                'external_id' => $data['external_id'] ?? null,
                'is_on' => $data['is_on'] ?? false,
            ]);
        });

        $device->load('deviceName');

        return ['device' => $device];
    }
}
