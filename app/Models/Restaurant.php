<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Restaurant extends Model
{
    protected $table = 'restaurants';
    protected $fillable = [
        'user_id',
        'business_name',
        'legal_name',
        'phone',
        'legal_document',
        'business_license',
        'description',
        'logo_url',
        'responsible_name',
    ];
    public $timestamps = true;
    protected $dateFormat = 'Y-m-d\TH:i:s.v';

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function dishes(): HasMany
    {
        return $this->hasMany(Dish::class);
    }
}
