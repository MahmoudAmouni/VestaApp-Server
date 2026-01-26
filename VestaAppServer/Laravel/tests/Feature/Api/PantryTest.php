<?php

namespace Tests\Feature\Api;

use App\Models\Home;
use App\Models\PantryItem;
use App\Models\PantryItemName;
use App\Models\PantryLocation;
use App\Models\Role;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PantryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::create(['id' => 1, 'role' => 'user']);
    }

    public function test_can_list_pantry_items_successfully()
    {
        $user = User::factory()->create(['role_id' => 1]);
        $home = Home::create([
            'name' => 'Test Home',
            'owner_id' => $user->id
        ]);

        $itemName = PantryItemName::create(['name' => 'Milk']);
        $location = PantryLocation::create(['name' => 'Fridge']);
        $unit = Unit::create(['name' => 'Liters']);

        PantryItem::create([
            'home_id' => $home->id,
            'owner_user_id' => $user->id,
            'item_name_id' => $itemName->id,
            'location_id' => $location->id,
            'unit_id' => $unit->id,
            'quantity' => 2,
            'expiry_date' => '2026-02-01',
        ]);

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/pantry/{$home->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'pantry_items' => [
                        '*' => [
                            'id',
                            'home_id',
                            'quantity',
                            'expiry_date',
                        ]
                    ]
                ]
            ]);

        $this->assertEquals(1, count($response->json('data.pantry_items')));
    }

    public function test_fails_to_list_pantry_items_for_non_existent_home()
    {
        $user = User::factory()->create(['role_id' => 1]);

        $response = $this->actingAs($user, 'api')
            ->getJson('/api/v1/pantry/99999');

        $response->assertStatus(404)
            ->assertJsonFragment(['message' => 'Home not found.']);
    }

    public function test_can_create_pantry_item_successfully()
    {
        $user = User::factory()->create(['role_id' => 1]);
        $home = Home::create([
            'name' => 'Test Home',
            'owner_id' => $user->id
        ]);

        $payload = [
            'item_name' => 'Eggs',
            'location' => 'Fridge',
            'unit' => 'Dozen',
            'quantity' => 2,
            'expiry_date' => '2026-02-15',
        ];

        $response = $this->actingAs($user, 'api')
            ->postJson("/api/v1/pantry/{$home->id}", $payload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'pantry_item' => [
                        'id',
                        'home_id',
                        'quantity',
                        'expiry_date',
                    ]
                ]
            ]);

        $this->assertDatabaseHas('pantry_items', [
            'home_id' => $home->id,
            'quantity' => 2,
        ]);
    }

    public function test_fails_to_create_pantry_item_with_missing_required_fields()
    {
        $user = User::factory()->create(['role_id' => 1]);
        $home = Home::create([
            'name' => 'Test Home',
            'owner_id' => $user->id
        ]);

        $response = $this->actingAs($user, 'api')
            ->postJson("/api/v1/pantry/{$home->id}", []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['item_name', 'quantity']);
    }
}
