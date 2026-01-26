<?php

namespace Tests\Feature\Api;

use App\Models\Device;
use App\Models\DeviceName;
use App\Models\Home;
use App\Models\Role;
use App\Models\Room;
use App\Models\RoomName;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeviceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::create(['id' => 1, 'role' => 'user']);
    }

    public function test_can_delete_device_successfully()
    {
        $user = User::factory()->create(['role_id' => 1]);
        $home = Home::create([
            'name' => 'Test Home',
            'owner_id' => $user->id
        ]);

        $roomName = RoomName::create(['name' => 'Living Room']);
        $room = Room::create([
            'home_id' => $home->id,
            'room_name_id' => $roomName->id,
        ]);

        $deviceName = DeviceName::create(['name' => 'Light']);
        $device = Device::create([
            'home_id' => $home->id,
            'room_id' => $room->id,
            'device_name_id' => $deviceName->id,
            'is_on' => false,
        ]);

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/device/{$home->id}/{$room->id}/{$device->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['deleted' => true]);

        $this->assertSoftDeleted('devices', [
            'id' => $device->id,
        ]);
    }

    public function test_fails_to_delete_non_existent_device()
    {
        $user = User::factory()->create(['role_id' => 1]);
        $home = Home::create([
            'name' => 'Test Home',
            'owner_id' => $user->id
        ]);

        $roomName = RoomName::create(['name' => 'Living Room']);
        $room = Room::create([
            'home_id' => $home->id,
            'room_name_id' => $roomName->id,
        ]);

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/device/{$home->id}/{$room->id}/99999");

        $response->assertStatus(404)
            ->assertJsonFragment(['message' => 'Device not found in this room.']);
    }

    public function test_can_update_device_successfully()
    {
        $user = User::factory()->create(['role_id' => 1]);
        $home = Home::create([
            'name' => 'Test Home',
            'owner_id' => $user->id
        ]);

        $roomName = RoomName::create(['name' => 'Living Room']);
        $room = Room::create([
            'home_id' => $home->id,
            'room_name_id' => $roomName->id,
        ]);

        $deviceName = DeviceName::create(['name' => 'Light']);
        $device = Device::create([
            'home_id' => $home->id,
            'room_id' => $room->id,
            'device_name_id' => $deviceName->id,
            'is_on' => false,
        ]);

        $payload = [
            'device_name' => 'Smart Light',
            'is_on' => true,
        ];

        $response = $this->actingAs($user, 'api')
            ->postJson("/api/v1/device/{$home->id}/{$room->id}/{$device->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'device' => [
                        'id',
                        'is_on',
                    ]
                ]
            ]);

        $this->assertDatabaseHas('devices', [
            'id' => $device->id,
            'is_on' => true,
        ]);
    }

    public function test_fails_to_update_non_existent_device()
    {
        $user = User::factory()->create(['role_id' => 1]);
        $home = Home::create([
            'name' => 'Test Home',
            'owner_id' => $user->id
        ]);

        $roomName = RoomName::create(['name' => 'Living Room']);
        $room = Room::create([
            'home_id' => $home->id,
            'room_name_id' => $roomName->id,
        ]);

        $payload = [
            'device_name' => 'Light',
            'is_on' => true,
        ];

        $response = $this->actingAs($user, 'api')
            ->postJson("/api/v1/device/{$home->id}/{$room->id}/99999", $payload);

        $response->assertStatus(404)
            ->assertJsonFragment(['message' => 'Device not found in this room.']);
    }

    public function test_can_create_device_successfully()
    {
        $user = User::factory()->create(['role_id' => 1]);
        $home = Home::create([
            'name' => 'Test Home',
            'owner_id' => $user->id
        ]);

        $roomName = RoomName::create(['name' => 'Living Room']);
        $room = Room::create([
            'home_id' => $home->id,
            'room_name_id' => $roomName->id,
        ]);

        $payload = [
            'device_name' => 'Smart Light',
            'is_on' => false,
        ];

        $response = $this->actingAs($user, 'api')
            ->postJson("/api/v1/device/{$home->id}/{$room->id}", $payload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'device' => [
                        'id',
                        'home_id',
                        'room_id',
                    ]
                ]
            ]);

        $this->assertDatabaseHas('devices', [
            'home_id' => $home->id,
            'room_id' => $room->id,
        ]);
    }

    public function test_fails_to_create_device_with_missing_device_name()
    {
        $user = User::factory()->create(['role_id' => 1]);
        $home = Home::create([
            'name' => 'Test Home',
            'owner_id' => $user->id
        ]);

        $roomName = RoomName::create(['name' => 'Living Room']);
        $room = Room::create([
            'home_id' => $home->id,
            'room_name_id' => $roomName->id,
        ]);

        $response = $this->actingAs($user, 'api')
            ->postJson("/api/v1/device/{$home->id}/{$room->id}", []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['device_name']);
    }
}
