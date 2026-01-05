<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class StoreUpdateUserRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {

        return [
            'email' => ['sometimes', 'required', 'email:rfc', 'max:255'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:50'],

            'diet' => ['sometimes', 'nullable', 'string', 'max:255'],
            'allergy' => ['sometimes', 'nullable', 'string', 'max:255'],

            'avatar' => ['sometimes', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],

            'password' => ['sometimes', 'nullable', 'string', 'min:8', 'max:255', 'confirmed'],
        ];
    }
}
