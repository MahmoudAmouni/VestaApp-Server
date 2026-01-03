<?php

namespace App\Services\Api;

use App\Exceptions\ApiException;
use App\Models\Home;
use App\Models\Room;
use App\Models\RoomName;
use App\Traits\FindOrCreateByName;
use Illuminate\Support\Facades\DB;

class RoomsService
{
    use FindOrCreateByName;
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

    public function create(int $homeId, array $data): array
    {
        $home = Home::query()->find($homeId);
        if (!$home) {
            throw ApiException::notFound('Home not found.');
        }

        if (auth()->check() && $home->owner_id !== auth()->id()) {
            throw ApiException::unauthorized('You are not allowed to modify this home.');
        }

        $room = DB::transaction(function () use ($homeId, $data) {

            $roomName = $this->findOrCreateByName(RoomName::class, $data['room_name']);


            $room = new Room();
            $room->home_id = $homeId;
            $room->room_name_id = $roomName->id;
            $room->save();
            return $room;
        });

        $room->load('roomName');

        return ['room' => $room];
    }
    public function delete(int $homeId, int $roomId): array
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

        DB::transaction(function () use ($room) {
            $room->devices()->delete();

            $room->delete();
        });

        return ['deleted' => true];
    }

    public function update(int $homeId, int $roomId, array $data): array
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

        DB::transaction(function () use ($room, $data) {
            $roomName = $this->findOrCreateByName(RoomName::class, $data['room_name']);

            $room->room_name_id = $roomName->id;
            $room->save();
        });

        $room->load('roomName');

        return ['room' => $room];
    }
}
