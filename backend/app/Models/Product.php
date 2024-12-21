<?php

namespace App\Models;

use App\Models\Lead;
use App\Models\Purchase;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    public function purchaseDetails()
    {
      return $this->belongsToMany(Purchase::class, 'purchase_details');    
    }

    // public function updateLeadProducts()
    // {  //for sync operation
    //     return $this->belongsToMany(Lead::class, 'lead_products')
    //     ->withPivot('id','lead_id',"product_id",'quantity');
    // }
}