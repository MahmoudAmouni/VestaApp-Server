<?php

namespace App\Http\Requests\Pantry;

use Illuminate\Foundation\Http\FormRequest;

class StorePantryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'item_name' => ['required', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'unit' => ['required', 'string', 'max:255'],
            'quantity' => ['required', 'integer', 'min:0'],
            'expiry_date' => ['nullable', 'date'],
        ];
    }
}
