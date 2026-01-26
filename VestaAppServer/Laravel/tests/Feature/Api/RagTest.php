<?php

namespace Tests\Feature\Api;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class RagTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::create(['id' => 1, 'role' => 'user']);
    }

    public function test_can_search_rag_successfully()
    {
        $user = User::factory()->create(['role_id' => 1]);

        // Mock the external RAG service
        Http::fake([
            'http://127.0.0.1:8002/api/v1/rag/search' => Http::response([
                'results' => [
                    [
                        'recipe_name' => 'Spaghetti Carbonara',
                        'score' => 0.95,
                    ],
                    [
                        'recipe_name' => 'Pasta Alfredo',
                        'score' => 0.85,
                    ],
                ],
            ], 200),
        ]);

        $payload = [
            'query' => 'pasta recipes',
            'n_results' => 10,
            'cuisines' => ['Italian'],
        ];

        $response = $this->actingAs($user, 'api')
            ->postJson('/api/v1/rag/search', $payload);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'results' => [
                    '*' => [
                        'recipe_name',
                        'score',
                    ]
                ]
            ]);
    }

    public function test_fails_to_search_rag_without_required_query()
    {
        $user = User::factory()->create(['role_id' => 1]);

        $payload = [
            'n_results' => 10,
        ];

        $response = $this->actingAs($user, 'api')
            ->postJson('/api/v1/rag/search', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['query']);
    }
}
