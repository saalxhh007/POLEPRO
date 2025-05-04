<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{

    public $timestamps = false;
    protected $fillable = [
        'title',
        'type',
        'description',
        'date',
        'time',
        'location',
        'capacity',
        'tags',
        'fiche',
        'titre_fiche',
        'intervenant_id',
        'alternatif_fiche',
        'supp',
    ];

    protected $casts = [
        'date' => 'date',
        'time' => 'string',
        'capacity' => 'integer',
    ];
}
