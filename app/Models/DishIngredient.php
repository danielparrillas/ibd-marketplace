<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DishIngredient extends Model
{
	use HasFactory;

	protected $table = 'dish_ingredients';

	protected $fillable = [
		'dish_id',
		'ingredient_id',
		'quantity_needed',
	];

	protected $casts = [
		'quantity_needed' => 'decimal:3',
		'created_at' => 'datetime',
		'updated_at' => 'datetime',
	];

	public function dish(): BelongsTo
	{
		return $this->belongsTo(Dish::class);
	}

	public function ingredient(): BelongsTo
	{
		return $this->belongsTo(Ingredient::class);
	}
}
