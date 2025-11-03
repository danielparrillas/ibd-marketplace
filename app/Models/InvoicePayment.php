<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoicePayment extends Model
{
    use HasFactory;

    protected $table = 'invoice_payments';

    protected $primaryKey = 'payment_id';

    public $timestamps = false;

    protected $fillable = [
        'invoice_id',
        'payment_method_id',
        'payment_gateway',
        'gateway_transaction_id',
        'amount_paid',
        'payment_status',
        'paid_at',
    ];

    protected $casts = [
        'invoice_id' => 'int',
        'payment_method_id' => 'int',
        'amount_paid' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    protected $dateFormat = 'Y-m-d\\TH:i:s.v';

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class, 'invoice_id', 'invoice_id');
    }

    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class, 'payment_method_id');
    }
}
