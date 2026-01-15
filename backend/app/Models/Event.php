<?php

namespace App\Models;

use App\Models\Lead;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'lead_id',
        'event_datetime',
        'team_user_ids',
        'participants',
        'created_by',
    ];

    protected $casts = [
        'event_datetime' => 'datetime',
        'team_user_ids' => 'array',
        'participants' => 'array',
    ];

    public function lead()
    {
        return $this->belongsTo(Lead::class, 'lead_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
