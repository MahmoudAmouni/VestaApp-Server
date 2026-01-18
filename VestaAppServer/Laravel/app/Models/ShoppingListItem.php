<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShoppingListItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'home_id',
        'item_id',
        'unit_id',
        'quantity',
        'is_checked',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'is_checked' => 'boolean',
    ];

    public function home(): BelongsTo
    {
        return $this->belongsTo(Home::class, 'home_id');
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }
    public function itemName(): BelongsTo
    {
        return $this->belongsTo(PantryItemName::class, 'item_id');
    }

    public function ingredient(): BelongsTo
    {
        return $this->belongsTo(PantryItem::class, 'item_id');
    }
}
