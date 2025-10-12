<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
        //'created_at',
        //'updated_at'
    ];
    public $timestamps = true;

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
