<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Mentor extends Authenticatable
{
    public $timestamps = false;
    protected $fillable = [
        "name",
        'email',
        "expertise",
        "company",
        "startups",
        "availability",
        "image"
    ];
}
// enum('available','busy')