<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavedRecipe extends Model
{
    protected $fillable = [
        'home_id',
        'recipe_name',
        'ingredients',
        'directions',
        'ner',
        'link',
    ];

    public function home(): BelongsTo
    {
        return $this->belongsTo(Home::class);
    }
}
