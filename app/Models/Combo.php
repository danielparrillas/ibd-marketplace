<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Combo extends Model
{
	use HasFactory;

	protected $fillable = [
		'restaurant_id',
		'name',
		'description',
		'combo_price',
		'image_url',
		'is_available',
		'valid_from',
		'valid_until',
	];

	protected $casts = [
		'combo_price' => 'float',
		'is_available' => 'boolean',
		'valid_from' => 'datetime',
		'valid_until' => 'datetime',
		'created_at' => 'datetime',
		'updated_at' => 'datetime',
	];

	public function restaurant(): BelongsTo
	{
		return $this->belongsTo(Restaurant::class);
	}

	public function dishes(): BelongsToMany
	{
		return $this->belongsToMany(Dish::class, 'combo_dishes')
			->withPivot('quantity')
			->withTimestamps();
	}

	public function orderItems(): HasMany
	{
		return $this->hasMany(OrderItem::class);
	}

	public function scopeAvailable($query)
	{
		return $query->where('is_available', true);
	}

	public function scopeCurrentlyValid($query)
	{
		return $query
			->where(function ($q) {
				$q->whereNull('valid_from')->orWhere('valid_from', '<=', now());
			})
			->where(function ($q) {
				$q->whereNull('valid_until')->orWhere('valid_until', '>=', now());
			});
	}
}
