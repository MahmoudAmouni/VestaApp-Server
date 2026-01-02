<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PantryItem extends Model
{
    protected $fillable = [
        'home_id',
        'owner_user_id',
        'item_name_id',
        'location_id',
        'unit_id',
        'quantity',
        'expiry_date',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];
}
