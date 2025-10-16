<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
	use HasFactory;

	protected $fillable = [
		'order_id',
		'item_type',
		'dish_id',
		'combo_id',
		'quantity',
		'unit_price',
		'total_price',
		'special_requests',
	];

	protected $casts = [
		'quantity' => 'integer',
		'unit_price' => 'decimal:2',
		'total_price' => 'decimal:2',
		'created_at' => 'datetime',
		'updated_at' => 'datetime',
	];

	public function dish(): BelongsTo
	{
		return $this->belongsTo(Dish::class);
	}

	public function combo(): BelongsTo
	{
		return $this->belongsTo(Combo::class);
	}
}
