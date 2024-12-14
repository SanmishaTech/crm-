<?php

namespace App\Models;

use App\Models\Lead;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    public function lead()
    {
        return $this->hasOne(Lead::class);  
    }
    
}