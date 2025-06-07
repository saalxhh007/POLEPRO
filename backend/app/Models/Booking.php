<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'purpose',
        'notes',
        "resource_id"
    ];

    protected $table = 'Booking';
}
