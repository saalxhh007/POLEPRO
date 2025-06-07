<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tasks extends Model
{
    protected $table = 'tasks';
    protected $fillable = [
        'title',
        'startup_id',
        'assigned_to',
        'status',
        "date_limite",
        "updated_at",
        "created_at"
    ];

    public function startup(): BelongsTo
    {
        return $this->belongsTo(Startup::class);
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'assigned_to');
    }
}
