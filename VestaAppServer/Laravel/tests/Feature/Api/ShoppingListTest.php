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
}
