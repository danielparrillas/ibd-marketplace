<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'address_line_1',
        'address_line_2',
        'latitude',
        'longitude',
        'delivery_instructions',
    ];

    // Relación con el usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
