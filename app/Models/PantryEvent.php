<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PantryEvent extends Model
{
    protected $fillable = [
        'home_id',
        'pantry_item_id',
        'event_type',
    ];
}
