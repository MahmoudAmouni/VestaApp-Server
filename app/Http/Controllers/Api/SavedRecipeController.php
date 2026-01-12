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

    public function delete(int $home, int $savedRecipe): JsonResponse
    {
        return $this->handle(
            fn() => $this->savedRecipeService->delete($home, $savedRecipe),
            'Saved recipe deleted.'
        );
    }
}
