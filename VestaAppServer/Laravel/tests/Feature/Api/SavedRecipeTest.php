<?php

namespace Tests\Feature\Api;

use App\Models\Home;
use App\Models\Role;
use App\Models\SavedRecipe;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SavedRecipeTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::create(['id' => 1, 'role' => 'user']);
    }

    public function test_can_get_saved_recipes_successfully()
    {
        $user = User::factory()->create(['role_id' => 1]);
        $home = Home::create([
            'name' => 'Test Home',
            'owner_id' => $user->id
        ]);

        SavedRecipe::create([
            'home_id' => $home->id,
            'recipe_name' => 'Pasta Recipe',
        ]);

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/savedrecipe/{$home->id}");

        $response->assertStatus(200);
    }

    public function test_fails_to_get_saved_recipes_for_non_existent_home()
    {
        $user = User::factory()->create(['role_id' => 1]);

        $response = $this->actingAs($user, 'api')
            ->getJson('/api/v1/savedrecipe/99999');

        $response->assertStatus(404);
    }
}
