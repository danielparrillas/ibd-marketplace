<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Promotion extends Model
{
	use HasFactory;

	protected $fillable = [
		'restaurant_id',
		'name',
		'description',
		'promotion_type',
		'discount_value',
		'min_order_amount',
		'max_discount',
		'applies_to',
		'target_categories',
		'target_dish_ids',
		'valid_from',
		'valid_until',
		'is_active',
		'usage_limit',
		'usage_count',
	];

	protected $casts = [
		'discount_value' => 'decimal:2',
		'min_order_amount' => 'decimal:2',
		'max_discount' => 'decimal:2',
		'is_active' => 'boolean',
		'usage_limit' => 'integer',
		'usage_count' => 'integer',
		'valid_from' => 'datetime',
		'valid_until' => 'datetime',
		'created_at' => 'datetime',
		'updated_at' => 'datetime',
	];

	public function restaurant(): BelongsTo
	{
		return $this->belongsTo(Restaurant::class);
	}

	public function scopeActive($query)
	{
		return $query->where('is_active', true);
	}

	public function scopeCurrentlyValid($query)
	{
		return $query
			->where('valid_from', '<=', now())
			->where('valid_until', '>=', now());
	}

	public function scopeByType($query, string $type)
	{
		return $query->where('promotion_type', $type);
	}

	public function scopeAppliesTo($query, string $appliesTo)
	{
		return $query->where('applies_to', $appliesTo);
	}

	public function getTargetCategoriesArrayAttribute(): array
	{
		if (empty($this->target_categories)) {
			return [];
		}
		return array_values(array_filter(array_map('trim', preg_split('/[,;]+/', (string) $this->target_categories))));
	}

	public function setTargetCategoriesArrayAttribute(array $value): void
	{
		$items = array_values(array_filter(array_map('trim', $value), fn($v) => $v !== ''));
		$this->attributes['target_categories'] = implode(',', $items);
	}

	public function getTargetDishIdsArrayAttribute(): array
	{
		if (empty($this->target_dish_ids)) {
			return [];
		}
		$ids = array_values(array_filter(array_map('trim', preg_split('/[,;]+/', (string) $this->target_dish_ids))));
		return array_map('intval', $ids);
	}

	public function setTargetDishIdsArrayAttribute(array $value): void
	{
		$ids = array_values(array_filter(array_map(fn($v) => is_numeric($v) ? (int) $v : null, $value), fn($v) => $v !== null));
		$this->attributes['target_dish_ids'] = implode(',', $ids);
	}
}
