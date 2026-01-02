<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PantryItemName extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name'];

    public function pantryItems(): HasMany
    {
        return $this->hasMany(PantryItem::class, 'item_name_id');
    }
}
