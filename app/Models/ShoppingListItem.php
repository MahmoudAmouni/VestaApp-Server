<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShoppingListItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'home_id',
        'ingredient_id',
        'unit_id',
        'quantity',
        'is_checked',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'is_checked' => 'boolean',
    ];
}
