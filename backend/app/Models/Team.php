<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teams extends Model
{
    public $timestamps = false;

    protected $fillable = ['number_of_members', 'name'];
}
