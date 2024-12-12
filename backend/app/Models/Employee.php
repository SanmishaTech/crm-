<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    
    protected $casts = [
        'resignation_date' => 'date:Y-m-d',
        "joining_date" => "date:Y-m-d",
    ];
    
}