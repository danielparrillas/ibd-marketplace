<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    use HasFactory;

    protected $table = 'cart_items';

    protected $fillable = [
        'user_id',
        'session_token',
        'restaurant_id',
        'dish_id',
        'quantity',
        'options',
    ];

    protected $casts = [
        'user_id' => 'int',
        'restaurant_id' => 'int',
        'dish_id' => 'int',
        'quantity' => 'int',
        'options' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function dish(): BelongsTo
    {
        return $this->belongsTo(Dish::class);
    }

    public function scopeForOwner($query, ?int $userId, ?string $sessionToken)
    {
        if ($userId) {
            return $query->where('user_id', $userId);
        }

        if ($sessionToken) {
            return $query->where('session_token', $sessionToken);
        }

        return $query->whereRaw('1 = 0');
    }
}
