<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Pantry\StorePantryRequest;
use App\Services\Api\PantryService;
use Illuminate\Http\JsonResponse;

class PantryController extends BaseApiController
{
    public function __construct(private readonly PantryService $pantryService)
    {
    }

    public function list(int $home): JsonResponse
    {
        return $this->handle(
            fn() => $this->pantryService->list($home),
            'Pantry items fetched.'
        );
    }

    public function create(int $home, StorePantryRequest $request): JsonResponse
    {
        return $this->handle(
            fn() => $this->pantryService->create($home, $request->validated()),
            'Pantry item created.',
            201
        );
    }

    public function update(int $home, int $pantryItem, StorePantryRequest $request): JsonResponse
    {
        return $this->handle(
            fn() => $this->pantryService->update($home, $pantryItem, $request->validated()),
            'Pantry item updated.'
        );
    }

    public function delete(int $home, int $pantryItem): JsonResponse
    {
        return $this->handle(
            fn() => $this->pantryService->delete($home, $pantryItem),
            'Pantry item deleted.'
        );
    }
}
