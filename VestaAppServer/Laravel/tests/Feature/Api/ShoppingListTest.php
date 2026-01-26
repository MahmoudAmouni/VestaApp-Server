<?php

namespace Tests\Feature\Api;

use App\Models\Home;
use App\Models\Role;
use App\Models\ShoppingListItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShoppingListTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::create(['id' => 1, 'role' => 'user']);
    }

    public function test_can_list_shopping_items_successfully()
    {
        $user = User::factory()->create(['role_id' => 1]);
        $home = Home::create([
            'name' => 'Test Home',
            'owner_id' => $user->id
        ]);

        ShoppingListItem::create([
            'home_id' => $home->id,
            'item' => 'Milk',
            'is_checked' => false,
        ]);

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/shoppinglist/{$home->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'shopping_list_items' => [
                        '*' => [
                            'id',
                            'is_checked',
                        ]
                    ]
                ]
            ]);

        $this->assertEquals(1, count($response->json('data.shopping_list_items')));
    }

    public function test_fails_to_list_shopping_items_for_non_existent_home()
    {
        $user = User::factory()->create(['role_id' => 1]);

        $response = $this->actingAs($user, 'api')
            ->getJson('/api/v1/shoppinglist/99999');

        $response->assertStatus(404)
            ->assertJsonFragment(['message' => 'Home not found.']);
    }

    public function test_can_create_shopping_list_item_successfully()
    {
        $user = User::factory()->create(['role_id' => 1]);
        $home = Home::create([
            'name' => 'Test Home',
            'owner_id' => $user->id
        ]);

        $payload = [
            'item_name' => 'Eggs',
            'unit' => 'Dozen',
            'quantity' => 2,
            'is_checked' => false,
        ];

        $response = $this->actingAs($user, 'api')
            ->postJson("/api/v1/shoppinglist/{$home->id}", $payload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'shopping_list_item' => [
                        'id',
                        'home_id',
                    ]
                ]
            ]);

        $this->assertDatabaseHas('shopping_list_items', [
            'home_id' => $home->id,
        ]);
    }

    public function test_fails_to_create_shopping_list_item_with_missing_required_fields()
    {
        $user = User::factory()->create(['role_id' => 1]);
        $home = Home::create([
            'name' => 'Test Home',
            'owner_id' => $user->id
        ]);

        $response = $this->actingAs($user, 'api')
            ->postJson("/api/v1/shoppinglist/{$home->id}", []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['item_name', 'unit', 'quantity']);
    }

    public function test_can_update_shopping_list_item_successfully()
    {
        $user = User::factory()->create(['role_id' => 1]);
        $home = Home::create([
            'name' => 'Test Home',
            'owner_id' => $user->id
        ]);

        $item = ShoppingListItem::create([
            'home_id' => $home->id,
            'item' => 'Milk',
            'is_checked' => false,
        ]);

        $payload = [
            'item_name' => 'Whole Milk',
            'unit' => 'Liters',
            'quantity' => 2,
            'is_checked' => true,
        ];

        $response = $this->actingAs($user, 'api')
            ->postJson("/api/v1/shoppinglist/{$home->id}/{$item->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'shopping_list_item' => [
                        'id',
                        'is_checked',
                    ]
                ]
            ]);

        $this->assertDatabaseHas('shopping_list_items', [
            'id' => $item->id,
            'is_checked' => true,
        ]);
    }

    public function test_fails_to_update_non_existent_shopping_list_item()
    {
        $user = User::factory()->create(['role_id' => 1]);
        $home = Home::create([
            'name' => 'Test Home',
            'owner_id' => $user->id
        ]);

        $payload = [
            'item_name' => 'Milk',
            'unit' => 'Liters',
            'quantity' => 1,
        ];

        $response = $this->actingAs($user, 'api')
            ->postJson("/api/v1/shoppinglist/{$home->id}/99999", $payload);

        $response->assertStatus(404)
            ->assertJsonFragment(['message' => 'Shopping list item not found in this home.']);
    }
}
