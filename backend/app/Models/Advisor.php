<?php

namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Advisor extends Authenticatable
{
    protected $fillable = [
        "name",
        "grade",
        "specialization",
        "faculty_name",
        "department_name"
    ];
}
