<?php

namespace App\Models;

use App\Models\Supplier;
use App\Models\ProductCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Supplier extends Model
{
     use HasFactory;

    public function productCategory()
    {
      return $this->belongsTo(ProductCategory::class, 'product_category_id');    
    }

 }