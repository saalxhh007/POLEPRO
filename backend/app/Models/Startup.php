<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Startup extends Model
{
    use HasFactory;

    protected $table = 'startup';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'industry',
        'stage',
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
        'faculty_id',
        'advisor_id',
        'idea_origin',
    ];

    protected $casts = [
        'join_date' => 'date',
        'submission_date' => 'datetime',
        'modified_date' => 'datetime',
        'is_final' => 'boolean',
        'in_pole' => 'boolean',
        'approved_by_dean' => 'boolean',
    ];

    public function mentors()
    {
        return $this->belongsToMany(Mentor::class, 'mentor_startup');
    }
}
