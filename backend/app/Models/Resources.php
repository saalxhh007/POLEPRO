<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resources extends Model
{
    public $timestamps = false;
    protected $fillable = [
        "name",
        'type',
        "capacity",
        "availability",
        "emplacement"
    ];
}
