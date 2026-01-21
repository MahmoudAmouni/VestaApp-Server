<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\SavedRecipes\StoreSavedRecipeRequest;
use App\Services\Api\SavedRecipeService;
use Illuminate\Http\JsonResponse;

class SavedRecipeController extends BaseApiController
{
    public function __construct(private readonly SavedRecipeService $savedRecipeService)
    {
    }

    public function create(int $home, StoreSavedRecipeRequest $request): JsonResponse
    {
        return $this->handle(
            fn() => $this->savedRecipeService->create($home, $request->validated()),
            'Saved recipe created.',
            201
        );
    }

    public function get(int $home): JsonResponse
    {
        return $this->handle(
            fn() => $this->savedRecipeService->get($home),
            'Saved recipes retrieved.'
        );
    }

    public function deleteByName(int $home_id, string $recipe_name): JsonResponse
    {
        return $this->handle(
            fn() => $this->savedRecipeService->deleteByName($home_id, $recipe_name),
            'Saved recipe deleted.'
        );
    }
}
