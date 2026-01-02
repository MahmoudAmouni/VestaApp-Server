<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Device extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'home_id',
        'room_id',
        'device_name_id',
        'external_id',
        'is_on',
    ];

    protected $casts = [
        'is_on' => 'boolean',
    ];
}
