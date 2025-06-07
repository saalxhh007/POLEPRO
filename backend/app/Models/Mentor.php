<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mentor extends Model
{
    public $timestamps = false;
    protected $fillable = [
        "name",
        'email',
        "expertise",
        "company",
        "startups",
        "availability",
        "bio",
        "image",
        "refresh_token",
        "startup_id",
        "refresh_token_expires_at"
    ];
}
// enum('available','busy')