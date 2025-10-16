<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Ingredient extends Model
{
	use HasFactory;

	protected $fillable = [
		'restaurant_id',
		'name',
		'unit_measure',
		'current_stock',
		'min_stock_alert',
		'unit_cost',
		'supplier',
		'expiration_date',
	];

	protected $casts = [
		'current_stock' => 'decimal:3',
		'min_stock_alert' => 'decimal:3',
		'unit_cost' => 'decimal:2',
		'expiration_date' => 'date',
		'created_at' => 'datetime',
		'updated_at' => 'datetime',
	];

	public function restaurant(): BelongsTo
	{
		return $this->belongsTo(Restaurant::class);
	}

	public function dishes(): BelongsToMany
	{
		return $this->belongsToMany(Dish::class, 'dish_ingredients')
			->withPivot('quantity_needed')
			->withTimestamps();
	}

	public function scopeLowStock($query)
	{
		return $query->whereRaw('current_stock <= min_stock_alert');
	}

	public function scopeInStock($query)
	{
		return $query->where('current_stock', '>', 0);
	}

	public function scopeOutOfStock($query)
	{
		return $query->where('current_stock', '<=', 0);
	}

	public function scopeExpiringSoon($query, int $days = 7)
	{
		return $query->whereNotNull('expiration_date')
			->whereBetween('expiration_date', [now(), now()->addDays($days)]);
	}

	public function scopeExpired($query)
	{
		return $query->whereNotNull('expiration_date')
			->where('expiration_date', '<', now());
	}

	public function scopeBySupplier($query, string $supplier)
	{
		return $query->where('supplier', $supplier);
	}

	public function hasLowStock(): bool
	{
		return $this->current_stock <= $this->min_stock_alert;
	}

	public function isOutOfStock(): bool
	{
		return $this->current_stock <= 0;
	}

	public function isExpired(): bool
	{
		return $this->expiration_date && $this->expiration_date->isPast();
	}

	public function isExpiringSoon(int $days = 7): bool
	{
		return $this->expiration_date
			&& $this->expiration_date->isFuture()
			&& $this->expiration_date->diffInDays(now()) <= $days;
	}

	public function getStockValueAttribute(): float
	{
		return $this->current_stock * ($this->unit_cost ?? 0);
	}

	public function addStock(float $quantity): void
	{
		$this->increment('current_stock', $quantity);
	}

	public function reduceStock(float $quantity): bool
	{
		if ($this->current_stock >= $quantity) {
			$this->decrement('current_stock', $quantity);
			return true;
		}

		return false;
	}
}
