<?php

namespace App\Services\Api;

use App\Exceptions\ApiException;
use App\Models\Home;
use Illuminate\Support\Facades\DB;

class HomeService
{
    public function create(array $data): array
    {
        if (!auth()->check()) {
            throw ApiException::unauthorized('Unauthorized');
        }

        $home = DB::transaction(function () use ($data) {
            $home = new Home();
            $home->owner_id = auth()->id();     
            $home->name = $data['name'];
            $home->save();

            return $home;
        });

        $home->load('owner');

        return ['home' => $home];
    }

    public function update(int $homeId, array $data): array
    {
        $home = Home::query()->find($homeId);
        if (!$home) {
            throw ApiException::notFound('Home not found.');
        }

        if (auth()->check() && $home->owner_id !== auth()->id()) {
            throw ApiException::unauthorized('You are not allowed to modify this home.');
        }

        DB::transaction(function () use ($home, $data) {
            $home->name = $data['name'];
            $home->save();
        });

        $home->load('owner');

        return ['home' => $home];
    }

    public function delete(int $homeId): array
    {
        $home = Home::query()->find($homeId);
        if (!$home) {
            throw ApiException::notFound('Home not found.');
        }

        if (auth()->check() && $home->owner_id !== auth()->id()) {
            throw ApiException::unauthorized('You are not allowed to modify this home.');
        }

        DB::transaction(function () use ($home) {
            $home->delete(); 
        });

        return ['deleted' => true];
    }
}
