<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\User\StoreUpdateUserRequest;
use App\Services\Api\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends BaseApiController
{
    public function __construct(private readonly UserService $userService)
    {
    }
    public function update(StoreUpdateUserRequest $request):JsonResponse
    {
        return $this->handle(
            fn() => $this->userService->update( $request->validated()),
            'User updated.'
        );
    }

}
