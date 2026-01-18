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
            $savedRecipe->ingredients = $data['ingredients'] ?? null;      // still "$$" string from frontend
            $savedRecipe->directions = $data['directions'] ?? null;        // still "$$" string from frontend
            $savedRecipe->cuisine_primary = $data['cuisine_primary'] ?? null;
            $savedRecipe->description = $data['description'] ?? null;
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


    public function deleteByName(int $homeId, string $recipeName): array
    {
        $home = Home::query()->find($homeId);
        if (!$home) {
            throw ApiException::notFound('Home not found.');
        }

        if (auth()->check() && $home->owner_id !== auth()->id()) {
            throw ApiException::unauthorized('You are not allowed to modify this home.');
        }

        $recipeName = trim($recipeName);

        $savedRecipe = SavedRecipe::query()
            ->where('home_id', $homeId)
            ->where('recipe_name', $recipeName)
            ->latest()
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
