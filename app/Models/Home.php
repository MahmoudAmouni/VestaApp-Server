<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Home extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'owner_id',
        'name',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class, 'home_id');
    }

    public function devices(): HasMany
    {
        return $this->hasMany(Device::class, 'home_id');
    }

    public function deviceEvents(): HasManyThrough
    {
        return $this->hasManyThrough(DeviceEvent::class, Device::class, 'home_id', 'device_id');
    }

    public function pantryItems(): HasMany
    {
        return $this->hasMany(PantryItem::class, 'home_id');
    }

    public function pantryEvents(): HasMany
    {
        return $this->hasMany(PantryEvent::class, 'home_id');
    }

    public function chatThreads(): HasMany
    {
        return $this->hasMany(ChatThread::class, 'home_id');
    }

    public function shoppingListItems(): HasMany
    {
        return $this->hasMany(ShoppingListItem::class, 'home_id');
    }
}
