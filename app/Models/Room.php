<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Room extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'home_id',
        'room_name_id',
    ];

    public function home(): BelongsTo
    {
        return $this->belongsTo(Home::class, 'home_id');
    }

    public function roomName(): BelongsTo
    {
        return $this->belongsTo(RoomName::class, 'room_name_id');
    }

    public function devices(): HasMany
    {
        return $this->hasMany(Device::class, 'room_id');
    }
}
