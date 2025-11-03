<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class InvoiceDetail extends Model
{
    use HasFactory;

    protected $table = 'invoice_details';

    protected $primaryKey = 'invoice_detail_id';

    public $timestamps = false;

    protected $fillable = [
        'invoice_id',
        'dish_id',
        'dish_name',
        'quantity',
        'unit_price',
        'line_total',
        'options_json',
    ];

    protected $casts = [
        'invoice_id' => 'int',
        'dish_id' => 'int',
        'quantity' => 'int',
        'unit_price' => 'decimal:2',
        'line_total' => 'decimal:2',
    ];

    protected $dateFormat = 'Y-m-d\\TH:i:s.v';

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class, 'invoice_id', 'invoice_id');
    }

    public function discount(): HasOne
    {
        return $this->hasOne(InvoiceDiscount::class, 'invoice_detail_id', 'invoice_detail_id');
    }
}
