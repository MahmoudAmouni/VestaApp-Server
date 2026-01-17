<?php

namespace App\Http\Requests\SavedRecipes;

use Illuminate\Foundation\Http\FormRequest;

class StoreSavedRecipeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'recipe_name' => ['required', 'string', 'max:255'],
            'ingredients' => ['nullable', 'string'],
            'directions' => ['nullable', 'string'],
            'ner' => ['nullable', 'string'],
            'link' => ['nullable', 'string', 'max:255'],
        ];
    }
}
