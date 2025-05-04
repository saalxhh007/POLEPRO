<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Intervenant extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'name',
        'bio',
        'contact_info',
    ];
}
