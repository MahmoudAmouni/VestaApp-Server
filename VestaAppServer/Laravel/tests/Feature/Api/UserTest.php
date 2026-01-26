<?php

namespace Tests\Feature\Api;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::create(['id' => 1, 'role' => 'user']);
    }

    public function test_can_update_user_successfully()
    {
        $user = User::factory()->create(['role_id' => 1]);

        $payload = [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'phone' => '123456789',
            'diet' => 'Vegan',
            'allergy' => 'Peanuts',
        ];

        $response = $this->actingAs($user, 'api')
            ->postJson('/api/v1/users', $payload);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'user' => [
                        'id',
                        'name',
                        'email',
                        'phone',
                    ]
                ]
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'phone' => '123456789',
        ]);
    }

    public function test_fails_to_update_user_with_duplicate_email()
    {
        $user1 = User::factory()->create([
            'role_id' => 1,
            'email' => 'existing@example.com',
        ]);

        $user2 = User::factory()->create([
            'role_id' => 1,
            'email' => 'user2@example.com',
        ]);

        $payload = [
            'email' => 'existing@example.com',
        ];

        $response = $this->actingAs($user2, 'api')
            ->postJson('/api/v1/users', $payload);

        $response->assertStatus(409)
            ->assertJsonFragment(['message' => 'Email already exists.']);
    }
}
