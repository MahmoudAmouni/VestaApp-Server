<?php

namespace App\Services\Api;

use App\Exceptions\ApiException;
use App\Models\Home;
use App\Models\SavedRecipe;
use Illuminate\Support\Facades\DB;

class SavedRecipeService
{
    public function create(int $homeId, array $data): array
    {
        $home = Home::query()->find($homeId);
        if (!$home) {
            throw ApiException::notFound('Home not found.');
        }

        if (auth()->check() && $home->owner_id !== auth()->id()) {
            throw ApiException::unauthorized('You are not allowed to modify this home.');
        }

        $savedRecipe = DB::transaction(function () use ($homeId, $data) {
            $savedRecipe = new SavedRecipe();
            $savedRecipe->home_id = $homeId;
            $savedRecipe->recipe_name = $data['recipe_name'];
            $savedRecipe->ingredients = $data['ingredients'] ?? null;
            $savedRecipe->directions = $data['directions'] ?? null;
            $savedRecipe->ner = $data['ner'] ?? null;
            $savedRecipe->link = $data['link'] ?? null;
            $savedRecipe->save();

            return $savedRecipe;
        });

        return ['saved_recipe' => $savedRecipe];
    }

    public function get(int $homeId): array
    {
        $home = Home::query()->find($homeId);
        if (!$home) {
            throw ApiException::notFound('Home not found.');
        }

        if (auth()->check() && $home->owner_id !== auth()->id()) {
            throw ApiException::unauthorized('You are not allowed to view this home.');
        }

        $savedRecipes = SavedRecipe::query()
            ->where('home_id', $homeId)
            ->latest()
            ->get();

        return ['saved_recipes' => $savedRecipes];
    }

    public function delete(int $homeId, int $savedRecipeId): array
    {
        $home = Home::query()->find($homeId);
        if (!$home) {
            throw ApiException::notFound('Home not found.');
        }

        if (auth()->check() && $home->owner_id !== auth()->id()) {
            throw ApiException::unauthorized('You are not allowed to modify this home.');
        }

        $savedRecipe = SavedRecipe::query()
            ->where('id', $savedRecipeId)
            ->where('home_id', $homeId)
            ->first();

        if (!$savedRecipe) {
            throw ApiException::notFound('Saved recipe not found for this home.');
        }

        DB::transaction(function () use ($savedRecipe) {
            $savedRecipe->delete();
        });

        return ['deleted' => true];
    }
}
