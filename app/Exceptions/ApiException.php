<?php

namespace App\Exceptions;

use Exception;

class ApiException extends Exception
{
    public function __construct(
        string $message,
        public int $status = 400,
        public array $errors = []
    ) {
        parent::__construct($message);
    }

    public static function validation(array $errors, string $message = 'Validation failed'): self
    {
        return new self($message, 422, $errors);
    }

    public static function unauthorized(string $message = 'Unauthorized'): self
    {
        return new self($message, 401);
    }

    public static function conflict(string $message = 'Conflict'): self
    {
        return new self($message, 409);
    }

    public static function notFound(string $message = 'Not found'): self
    {
        return new self($message, 404);
    }
}
