<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComboDish extends Model
{
	use HasFactory;

	protected $table = 'combo_dishes';

	protected $fillable = [
		'combo_id',
		'dish_id',
		'quantity',
	];

	protected $casts = [
		'quantity' => 'integer',
		'created_at' => 'datetime',
		'updated_at' => 'datetime',
	];

	public function combo(): BelongsTo
	{
		return $this->belongsTo(Combo::class);
	}

	public function dish(): BelongsTo
	{
		return $this->belongsTo(Dish::class);
	}
}
