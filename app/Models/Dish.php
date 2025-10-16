<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Dish extends Model
{
	use HasFactory;

	protected $fillable = [
		'restaurant_id',
		'name',
		'description',
		'price',
		'category',
		'image_url',
		'preparation_time',
		'is_available',
		'is_featured',
		'calories',
		'allergens',
	];

	protected $casts = [
		'price' => 'decimal:2',
		'preparation_time' => 'integer',
		'is_available' => 'boolean',
		'is_featured' => 'boolean',
		'calories' => 'integer',
		'created_at' => 'datetime',
		'updated_at' => 'datetime',
	];

	public function restaurant(): BelongsTo
	{
		return $this->belongsTo(Restaurant::class);
	}

	public function ingredients(): BelongsToMany
	{
		return $this->belongsToMany(Ingredient::class, 'dish_ingredients')
			->withPivot('quantity_needed')
			->withTimestamps();
	}

	public function combos(): BelongsToMany
	{
		return $this->belongsToMany(Combo::class, 'combo_dishes')
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

	public function scopeFeatured($query)
	{
		return $query->where('is_featured', true);
	}

	public function scopeByCategory($query, string $category)
	{
		return $query->where('category', $category);
	}

	public function getAllergensArrayAttribute(): array
	{
		return $this->allergens ? explode(',', $this->allergens) : [];
	}

	public function setAllergensArrayAttribute(array $value): void
	{
		$this->attributes['allergens'] = implode(',', $value);
	}
}
