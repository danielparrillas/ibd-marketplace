<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'category',
        'is_active',
        'supports_refunds',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'supports_refunds' => 'boolean',
    ];

    protected $dateFormat = 'Y-m-d\TH:i:s.v';

    /**
     * Scope to filter the active payment methods.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
