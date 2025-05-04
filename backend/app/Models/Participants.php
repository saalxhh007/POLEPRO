<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Participants extends Model
{

    public $timestamps = false;
    protected $fillable = [
        'name',
        'role',
        'email',
        'phone',
        'organisation',
        'expectations',
        'event_id',
    ];
}
