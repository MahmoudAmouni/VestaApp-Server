<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\VestaVoiceRequest;
use App\Http\Requests\Api\VestaTTSRequest;
use App\Services\Api\VestaService;
use Illuminate\Http\JsonResponse;

class VestaController extends Controller
{
    protected $vestaService;

    public function __construct(VestaService $vestaService)
    {
        $this->vestaService = $vestaService;
    }

    public function voice(VestaVoiceRequest $request): JsonResponse
    {
        try {
            $audio = $request->file('audio');
            $homeId = $request->input('home_id');
            $token = $request->input('laravel_token');

            $result = $this->vestaService->sendVoiceMessage($homeId, $token, $audio);
            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }


}
