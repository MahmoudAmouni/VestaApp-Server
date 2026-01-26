<?php

namespace Tests\Feature\Api;

use App\Models\Home;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChatTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::create(['id' => 1, 'role' => 'user']);
    }

    public function test_can_list_chat_messages_successfully()
    {
        $user = User::factory()->create(['role_id' => 1]);
        $home = Home::create([
            'name' => 'Test Home',
            'owner_id' => $user->id
        ]);

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/chat/{$home->id}");

        $response->assertStatus(200);
    }

    public function test_fails_to_list_chat_for_non_existent_home()
    {
        $user = User::factory()->create(['role_id' => 1]);

        $response = $this->actingAs($user, 'api')
            ->getJson('/api/v1/chat/99999');

        $response->assertStatus(404);
    }
}
