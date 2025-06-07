<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notes extends Model
{
    protected $table = 'notes';

    protected $primaryKey = 'id';

    protected $fillable = [
        'startup_id',
        'content',
        'created_by',
        "updated_at",
    ];

    public function startup()
    {
        return $this->belongsTo(Startup::class, 'startup_id');
    }
}
