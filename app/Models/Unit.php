<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Unit extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name'];

    public function pantryItems(): HasMany
    {
        return $this->hasMany(PantryItem::class, 'unit_id');
    }

    public function shoppingListItems(): HasMany
    {
        return $this->hasMany(ShoppingListItem::class, 'unit_id');
    }
}
