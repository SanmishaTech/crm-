<?php

namespace App\Models;

use App\Models\Product;
use App\Models\LeadProduct;
use Illuminate\Database\Eloquent\Model;

class InvoiceDetail extends Model
{
    protected $fillable = [
        'invoice_id', 'product_id', 'quantity','rate', 'gst_rate', 'gst_amount','total_taxable_amount',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function leadProducts()
    {
        return $this->hasMany(LeadProduct::class);
    }
    public function updateLeadProducts()
    {
        return $this->belongsToMany(Product::class, 'lead_products')
        ->withPivot('id','lead_id',"product_id",'quantity','rate','gst_rate','gst_amount','total_amount','amount_without_gst');
    }
    
}