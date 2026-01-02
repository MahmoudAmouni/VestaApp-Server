<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PantryEvent extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'home_id',
        'pantry_item_id',
        'event_type',
    ];

    public function home(): BelongsTo
    {
        return $this->belongsTo(Home::class, 'home_id');
    }

    public function pantryItem(): BelongsTo
    {
        return $this->belongsTo(PantryItem::class, 'pantry_item_id');
    }
}
