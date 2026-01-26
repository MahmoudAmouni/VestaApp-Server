<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\RagSearchRequest;
use App\Services\Api\RagService;
use Illuminate\Http\JsonResponse;

class RagController extends Controller
{
    protected $ragService;

    public function __construct(RagService $ragService)
    {
        $this->ragService = $ragService;
    }

    public function search(RagSearchRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $result = $this->ragService->search($validated);
            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
