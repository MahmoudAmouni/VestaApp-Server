<?php

namespace App\Services\Api;

use App\Exceptions\ApiException;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public function register(array $data): array
    {
        if (User::where('email', $data['email'])->exists()) {
            throw ApiException::conflict('Email already exists.');
        }

        return DB::transaction(function () use ($data) {
            $user = new User();
            $user->email = $data['email'];
            $user->password = Hash::make($data['password']);
            $user->name = $data['name'];
            $user->phone = $data['phone'] ?? null;
            $user->avatar_url = $data['avatar_url'] ?? null;
            $user->diet_id = $data['diet_id'] ?? null;
            $user->allergy_id = $data['allergy_id'] ?? null;
            $user->save();

            $token = JWTAuth::fromUser($user);

            return [
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'bearer',
            ];
        });
    }

    public function login(array $data): array
    {
        $credentials = [
            'email' => $data['email'],
            'password' => $data['password'],
        ];

        $token = JWTAuth::attempt($credentials);

        if (!$token) {
            throw ApiException::unauthorized('Invalid email or password.');
        }

        $user = JWTAuth::user();

        return [
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'bearer',
        ];
    }
}
