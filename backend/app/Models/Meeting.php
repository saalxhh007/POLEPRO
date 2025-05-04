<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Meeting extends Model

{
    protected $table = 'meeting';
    public $timestamps = false;
    protected $fillable = [
        "mentor_id",
        "team_id",
        "title",
        "description",
        "date",
        "time",
        "duration",
        "type",
    ];
}
