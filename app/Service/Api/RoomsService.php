<?php

namespace App\Service\Api;

use App\Models\Room;

class RoomsService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        
    }

    public function listRoomsWithDevices(int $homeId): array
    {
        $rooms = Room::query()
            ->where('home_id', $homeId)
            ->select(['id', 'home_id', 'room_name_id'])
            ->with([
                'roomName:id,name',
                'devices' => fn($q) =>
                    $q->select(['id', 'room_id', 'device_name_id', 'external_id', 'is_on'])
                        ->with('deviceName:id,name'),
            ])
            ->get();

        return ['rooms' => $rooms];
    }
}
