<?php

namespace App\Http\Requests\Devices;

use Illuminate\Foundation\Http\FormRequest;

class StoreDeviceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'device_name' => ['required', 'string', 'max:255'],
            'external_id' => ['nullable', 'string', 'max:255'],
            'is_on' => ['nullable', 'boolean'],
        ];
    }
}
