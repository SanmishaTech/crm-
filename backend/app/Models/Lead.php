<?php

namespace App\Models;

use App\Models\Profile;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
   public function profile(){
     return $this->belongsTo(Profile::class, "profile_id");
   }
   
}