<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    protected $fillable = [
        "username",
        "password",
        "type",
        "faculty_code",
        "email",
        "refresh_token"
    ];

    protected $hidden = [
        "password"
    ];
}
