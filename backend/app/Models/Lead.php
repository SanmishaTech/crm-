<?php

namespace App\Models;

use App\Models\Contact;
use App\Models\Product;
use App\Models\Employee;
use App\Models\FollowUp;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
   public function contact()
   {
       return $this->belongsTo(Contact::class, 'contact_id');
   }

   public function employee()
   {
       return $this->belongsTo(Employee::class, 'employee_id');
   }

   public function followUp()
   {
       return $this->hasOne(FollowUp::class, 'lead_id');
   }

   public function leadProducts()
   {
       return $this->belongsToMany(Product::class, 'lead_products')
                   ->withPivot('quantity'); 
   }

   
}