<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class VestaVoiceRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'home_id' => 'required|integer',
            'audio' => 'required|file', 
            'laravel_token' => 'required|string',
        ];
    }
}
