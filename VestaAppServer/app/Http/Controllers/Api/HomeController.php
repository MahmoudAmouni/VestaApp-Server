<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Home\StoreHomeRequest;
use App\Services\Api\HomeService;
use Illuminate\Http\JsonResponse;

class HomeController extends BaseApiController
{
    public function __construct(private readonly HomeService $homeService)
    {
    }

    public function create(StoreHomeRequest $request): JsonResponse
    {
        return $this->handle(
            fn() => $this->homeService->create($request->validated()),
            'Home created.',
            201
        );
    }

    public function update(int $home, StoreHomeRequest $request): JsonResponse
    {
        return $this->handle(
            fn() => $this->homeService->update($home, $request->validated()),
            'Home updated.'
        );
    }

    public function delete(int $home): JsonResponse
    {
        return $this->handle(
            fn() => $this->homeService->delete($home),
            'Home deleted.'
        );
    }
}
