<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'diet_id',
        'allergy_id',
        'email',
        'name',
        'password',
        'avatar_url',
        'phone',
    ];

    public function diet(): BelongsTo
    {
        return $this->belongsTo(Diet::class, 'diet_id');
    }

    public function allergy(): BelongsTo
    {
        return $this->belongsTo(Allergy::class, 'allergy_id');
    }

    public function ownedHomes(): HasMany
    {
        return $this->hasMany(Home::class, 'owner_id');
    }

    public function chatThreads(): HasMany
    {
        return $this->hasMany(ChatThread::class, 'user_id');
    }

    public function pantryItems(): HasMany
    {
        return $this->hasMany(PantryItem::class, 'owner_user_id');
    }

    
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
}
