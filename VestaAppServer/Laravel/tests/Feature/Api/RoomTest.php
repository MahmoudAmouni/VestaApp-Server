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

class RoomTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::create(['id' => 1, 'role' => 'user']);
    }

    public function test_can_list_rooms_with_devices_successfully()
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
        Device::create([
            'home_id' => $home->id,
            'room_id' => $room->id,
            'device_name_id' => $deviceName->id,
            'status' => true,
        ]);

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/room/{$home->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'rooms' => [
                        '*' => [
                            'id',
                            'devices',
                        ]
                    ]
                ]
            ]);

        $this->assertEquals(1, count($response->json('data.rooms')));
    }

    public function test_returns_empty_rooms_for_non_existent_home()
    {
        $user = User::factory()->create(['role_id' => 1]);

        $response = $this->actingAs($user, 'api')
            ->getJson('/api/v1/room/99999');

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['rooms']])
            ->assertJson(['data' => ['rooms' => []]]);
    }

    public function test_can_create_room_successfully()
    {
        $user = User::factory()->create(['role_id' => 1]);
        $home = Home::create([
            'name' => 'Test Home',
            'owner_id' => $user->id
        ]);

        $payload = [
            'room_name' => 'Bedroom',
        ];

        $response = $this->actingAs($user, 'api')
            ->postJson("/api/v1/room/{$home->id}", $payload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'room' => [
                        'id',
                        'home_id',
                    ]
                ]
            ]);

        $this->assertDatabaseHas('rooms', [
            'home_id' => $home->id,
        ]);
    }

    public function test_fails_to_create_room_with_missing_room_name()
    {
        $user = User::factory()->create(['role_id' => 1]);
        $home = Home::create([
            'name' => 'Test Home',
            'owner_id' => $user->id
        ]);

        $response = $this->actingAs($user, 'api')
            ->postJson("/api/v1/room/{$home->id}", []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['room_name']);
    }

    public function test_can_update_room_successfully()
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
            'room_name' => 'Master Bedroom',
        ];

        $response = $this->actingAs($user, 'api')
            ->postJson("/api/v1/room/{$home->id}/{$room->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'room' => [
                        'id',
                        'home_id',
                    ]
                ]
            ]);

        $this->assertDatabaseHas('room_names', [
            'name' => 'Master Bedroom',
        ]);
    }

    public function test_fails_to_update_non_existent_room()
    {
        $user = User::factory()->create(['role_id' => 1]);
        $home = Home::create([
            'name' => 'Test Home',
            'owner_id' => $user->id
        ]);

        $payload = [
            'room_name' => 'Bedroom',
        ];

        $response = $this->actingAs($user, 'api')
            ->postJson("/api/v1/room/{$home->id}/99999", $payload);

        $response->assertStatus(404)
            ->assertJsonFragment(['message' => 'Room not found for this home.']);
    }

    public function test_can_delete_room_successfully()
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
            ->getJson("/api/v1/room/{$home->id}/{$room->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['deleted' => true]);

        $this->assertSoftDeleted('rooms', [
            'id' => $room->id,
        ]);
    }

    public function test_fails_to_delete_non_existent_room()
    {
        $user = User::factory()->create(['role_id' => 1]);
        $home = Home::create([
            'name' => 'Test Home',
            'owner_id' => $user->id
        ]);

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/room/{$home->id}/99999");

        $response->assertStatus(404)
            ->assertJsonFragment(['message' => 'Room not found for this home.']);
    }

    public function test_can_turn_all_devices_on_successfully()
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
            ->postJson("/api/v1/room/{$home->id}/{$room->id}/on");

        $response->assertStatus(200)
            ->assertJsonFragment(['success' => true]);

        $this->assertDatabaseHas('devices', [
            'id' => $device->id,
            'is_on' => true,
        ]);
    }

    public function test_fails_to_turn_all_devices_on_for_non_existent_room()
    {
        $user = User::factory()->create(['role_id' => 1]);
        $home = Home::create([
            'name' => 'Test Home',
            'owner_id' => $user->id
        ]);

        $response = $this->actingAs($user, 'api')
            ->postJson("/api/v1/room/{$home->id}/99999/on");

        $response->assertStatus(404)
            ->assertJsonFragment(['message' => 'Room not found for this home.']);
    }
}
