<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    public $timestamps = false;

    protected $fillable = ['number_of_members', 'name', "role"];

    public function members()
    {
        return $this->hasMany(TeamMember::class);
    }
    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
