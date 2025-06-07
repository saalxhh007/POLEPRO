<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Milestones extends Model
{
    use HasFactory;

    protected $table = 'milestones';

    protected $fillable = [
        'startup_id',
        'title',
        'status',
        'due_date',
    ];

    protected $casts = [
        'due_date' => 'date',
    ];

    public function startup()
    {
        return $this->belongsTo(Startup::class);
    }
}
