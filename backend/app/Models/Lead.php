<?php

namespace App\Models;

use App\Models\Contact;
use App\Models\Product;
use App\Models\Employee;
use App\Models\FollowUp;
use App\Models\LeadProduct;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{

    protected $casts = [
        'bid_end_date' => 'date:Y-m-d',
    ];
    
   public function contact()
   {
       return $this->belongsTo(Contact::class, 'contact_id');
   }

   public function employee()
   {
       return $this->belongsTo(Employee::class, 'employee_id');
   }

   public function followUps()
   {
       return $this->hasMany(FollowUp::class, 'lead_id');
   }

    public function leadProducts()
    {
        return $this->hasMany(LeadProduct::class);
    }

    // public function updateLeadProducts()
    // {
    //     return $this->belongsToMany(Product::class, 'lead_products')
    //     ->withPivot('id','lead_id',"product_id",'quantity');
    // }

   
}