<?php

namespace App\Models;

use App\Models\Lead;
use App\Models\Client;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    public function lead()
    {
        return $this->hasOne(Lead::class);  
    }
    

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');  
    }
}