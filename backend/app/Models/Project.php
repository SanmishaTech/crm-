<?php

namespace App\Models;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{
    use HasFactory;

    public function users(){
        return $this->belongsToMany(User::class, "project_user");
    }

    public function tasks(){
        return $this->hasMany(Task::class, 'project_id');
    }

}
