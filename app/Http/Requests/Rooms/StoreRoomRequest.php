<?php

namespace App\Http\Requests\Rooms;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Used in:
     * - RoomController::store()
     *
     * You send "room_name" (string) instead of room_name_id.
     */
    public function rules(): array
    {
        return [
            'room_name' => ['required', 'string', 'max:255'],
        ];
    }
}
