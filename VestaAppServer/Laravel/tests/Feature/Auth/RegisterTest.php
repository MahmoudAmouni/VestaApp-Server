<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegisterTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        \App\Models\Role::create(['id' => 1, 'role' => 'user']);
    }

    public function test_user_can_register_successfully()
    {
        $payload = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'home_name' => 'Test Home',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'data' => [
                         'user',
                         'access_token',
                     ],
                 ]);
        
        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    }

    public function test_it_returns_validation_errors()
    {
        $payload = [];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'email', 'password', 'home_name']);
    }
}
