<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceDiscount extends Model
{
    use HasFactory;

    protected $table = 'invoice_discounts';

    protected $primaryKey = 'invoice_detail_id';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'invoice_detail_id',
        'discount_type',
        'discount_value',
        'discount_rate',
        'discount_amount',
        'coupon_code',
    ];

    protected $casts = [
        'invoice_detail_id' => 'int',
        'discount_value' => 'decimal:2',
        'discount_rate' => 'decimal:4',
        'discount_amount' => 'decimal:2',
    ];

    public function detail(): BelongsTo
    {
        return $this->belongsTo(InvoiceDetail::class, 'invoice_detail_id', 'invoice_detail_id');
    }
}
