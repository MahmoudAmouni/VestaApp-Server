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
}
