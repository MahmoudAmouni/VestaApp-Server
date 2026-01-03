<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\ApiException;
use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Throwable;

class BaseApiController extends Controller
{
    use ApiResponse;

    protected function handle(callable $callback, string $successMessage = 'OK', int $successStatus = 200): JsonResponse
    {
        try {
            $data = $callback();
            return $this->success($data, $successMessage, $successStatus);
        } catch (ApiException $e) {
            return $this->fail($e->getMessage(), $e->status, $e->errors);
        } catch (Throwable $e) {
            report($e);
            return $this->fail('Something went wrong.', 500);
        }
    }
}
