<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Event extends Authenticatable
{

    public $timestamps = false;
    protected $fillable = [
        'title',
        'date',
        'time',
        'location',
        'type',
    ];
}
