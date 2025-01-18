<?php

namespace App\Models;

use App\Models\Product;
use App\Models\Supplier;
use App\Models\PurchaseDetail;
use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $casts = [
        'invoice_date' => 'date:Y-m-d',
    ];

    public function purchaseDetails()
    {
        return $this->hasMany(PurchaseDetail::class);
    }
    public function updatePurchaseProducts()
    {
        return $this->belongsToMany(Product::class, 'purchase_details')
        ->withPivot('id','purchase_id',"product_id",'quantity','rate','cgst','sgst','igst','pre_tax_amount','post_tax_amount' );
    }
    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');  
    }
}