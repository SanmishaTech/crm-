<?php

namespace App\Models;

use App\Models\Lead;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    public function leads()
    {
        return $this->belongsToMany(Lead::class, 'lead_product')
                    ->withPivot('quantity'); 
    }
}