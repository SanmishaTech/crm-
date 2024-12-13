<?php

namespace App\Models;

use App\Models\Lead;
use App\Models\Purchase;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    public function leadProducts()
    {
        return $this->belongsToMany(Lead::class, 'lead_product')
                    ->withPivot('quantity'); 
    }

    public function purchaseDetails()
    {
      return $this->belongsToMany(Purchase::class, 'purchase_details');    
    }
}