<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Startup extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'startup';
    public $timestamps = false;
    protected $primaryKey = 'project_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'id',
        'name',
        'industry',
        'stage',
        'founders',
        'join_date',
        'status',
        'progress',
        'team_id',
        'idea_stage',
        'idea',
        'description',
        'innovation',
        'target_customers',
        'originality',
        'sector',
        'other_details',
        'business_model',
        'supervisor_name',
        'submission_date',
        'modified_date',
        'is_final',
        'in_pole',
        'approved_by_dean',
        'faculty_code',
        'advisor_id',
        'advisor_grade',
        'advisor_specialization',
        'advisor_faculty',
        'advisor_department',
        'idea_origin',
    ];

    protected $hidden = [];
}
