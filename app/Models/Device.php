<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    public function home(): BelongsTo
    {
        return $this->belongsTo(Home::class, 'home_id');
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class, 'room_id');
    }

    public function deviceName(): BelongsTo
    {
        return $this->belongsTo(DeviceName::class, 'device_name_id');
    }

    public function events(): HasMany
    {
        return $this->hasMany(DeviceEvent::class, 'device_id');
    }
}
