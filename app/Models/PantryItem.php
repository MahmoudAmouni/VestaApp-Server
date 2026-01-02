<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PantryItem extends Model
{
    use HasFactory, SoftDeletes;

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

    public function home(): BelongsTo
    {
        return $this->belongsTo(Home::class, 'home_id');
    }

    public function ownerUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_user_id');
    }

    public function itemName(): BelongsTo
    {
        return $this->belongsTo(PantryItemName::class, 'item_name_id');
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(PantryLocation::class, 'location_id');
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }

    public function events(): HasMany
    {
        return $this->hasMany(PantryEvent::class, 'pantry_item_id');
    }
}
