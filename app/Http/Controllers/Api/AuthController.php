<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Auth\GoogleAuthRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\Api\AuthService;
use Illuminate\Http\JsonResponse;

class AuthController extends BaseApiController
{

    public function __construct(private readonly AuthService $authService)
    {
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        return $this->handle(
            fn() => $this->authService->register($request->validated()),
            'Registered successfully.',
            201
        );
    }

    public function login(LoginRequest $request): JsonResponse
    {
        return $this->handle(
            fn() => $this->authService->login($request->validated()),
            'Logged in successfully.'
        );
    }

    public function google(GoogleAuthRequest $request): JsonResponse
    {
        return $this->handle(
            fn() => $this->authService->google($request->validated()),
            'Authenticated with Google.'
        );
    }

    
}
