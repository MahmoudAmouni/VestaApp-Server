<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\ShoppingList\StoreShoppingListRequest;
use App\Services\Api\ShoppingListService;
use Illuminate\Http\JsonResponse;

class ShoppingListController extends BaseApiController
{
    public function __construct(private readonly ShoppingListService $shoppingListService)
    {
    }

    public function list(int $home): JsonResponse
    {
        return $this->handle(
            fn() => $this->shoppingListService->list($home),
            'Shopping list fetched.'
        );
    }

    public function create(int $home, StoreShoppingListRequest $request): JsonResponse
    {
        return $this->handle(
            fn() => $this->shoppingListService->create($home, $request->validated()),
            'Shopping item created.',
            201
        );
    }

    public function update(int $home, int $item, StoreShoppingListRequest $request): JsonResponse
    {
        return $this->handle(
            fn() => $this->shoppingListService->update($home, $item, $request->validated()),
            'Shopping item updated.'
        );
    }


    public function clearChecked(int $home): JsonResponse
    {
        return $this->handle(
            fn() => $this->shoppingListService->clearChecked($home),
            'Checked items cleared.'
        );
    }
}
