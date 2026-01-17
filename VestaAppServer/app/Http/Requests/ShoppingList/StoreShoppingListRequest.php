<?php

namespace App\Http\Requests\ShoppingList;

use Illuminate\Foundation\Http\FormRequest;

class StoreShoppingListRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;//add access here to logged in users to get there own data and forbidden from getting another users data
    }

    public function rules(): array
    {
        return [
            'item_name' => ['required', 'string', 'max:255'],
            'unit' => ['required', 'string', 'max:255'],
            'quantity' => ['required', 'integer', 'min:0'],
            'is_checked' => ['nullable', 'boolean'],
        ];
    }
}
