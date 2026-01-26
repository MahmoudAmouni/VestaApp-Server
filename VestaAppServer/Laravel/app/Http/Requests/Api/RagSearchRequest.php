<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class RagSearchRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'query' => 'required|string',
            'n_results' => 'integer|min:1|max:20',
            'seed' => 'integer',
            'cuisines' => 'array',
            'cuisines.*' => 'string',
            'must_contain' => 'array',
            'must_contain.*' => 'string',
            'must_not_contain' => 'array',
            'must_not_contain.*' => 'string',
        ];
    }
}
