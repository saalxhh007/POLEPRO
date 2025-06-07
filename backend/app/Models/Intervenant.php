<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Intervenant extends Model
{
    protected $table = 'intervenants';
    public $timestamps = false;

    protected $fillable = [
        'nom',
        'expertise',
        'bio',
        'photo',
        'email',
        'telephone',
        'organisation',
        'event_id',
        'role',
    ];

    protected $casts = [
        'id' => 'integer',
        'event_id' => 'integer',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id');
    }
}
