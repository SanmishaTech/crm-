<?php

namespace App\Models;

use App\Models\Lead;
use Illuminate\Database\Eloquent\Model;

class FollowUp extends Model
{
    protected $casts = [
        'follow_up_date' => 'date:Y-m-d',
        'next_follow_up_date' => 'date:Y-m-d',
    ];
    
    public function lead(){
        return $this->belongsTo(Lead::class, 'lead_id');
    }
}