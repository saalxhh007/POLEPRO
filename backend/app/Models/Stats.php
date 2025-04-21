<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Stats extends Authenticatable
{
    public $incrementing = false;
    protected $primaryKey = 'counted_obj';
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = ['counted_obj', 'counter'];
}
