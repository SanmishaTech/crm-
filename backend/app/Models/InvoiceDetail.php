<?php

namespace App\Models;

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
    
}