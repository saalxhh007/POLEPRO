<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Student extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;

    protected $table = 'student';
    public $timestamps = false;

    protected $fillable = [
        "matricule",
        "email",
        "phone_number",
        "birth_date",
        "gender",
        "last_name_ar",
        "first_name_ar",
        "Domain_ar",
        "option_ar",
        "diploma_ar",
        "faculty_code",
        "department_code",
        "password",
        "refresh_token",
        "refresh_token_expires_at"
    ];
    protected $hidden = [
        "password",
        "refresh_token"
    ];

    public function teamMemberships()
    {
        return $this->hasMany(TeamMember::class);
    }
    public function startup()
    {
        return $this->belongsTo(Startup::class);
    }
}
