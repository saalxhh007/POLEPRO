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
        "image"
    ];

    public function startups()
    {
        return $this->belongsToMany(Startup::class, 'mentor_startup');
    }
}
// enum('available','busy')