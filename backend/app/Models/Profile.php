<?php

namespace App\Models;

use App\Models\Lead;
use App\Models\User;
use App\Models\Department;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Profile extends Model
{
    use HasFactory;

    
    public function user(){
        return $this->belongTo(User::class, 'user_id');
    }

    public function department(){
        return $this->belongTo(Department::class, 'department_id');
    }

    public function leads(){
        return $this->hasMany(Lead::class, "profile_id");
    }
    
}