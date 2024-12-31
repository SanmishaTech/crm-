<?php

namespace App\Models;

use App\Models\Product;
use App\Models\InvoiceDetail;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    //

    public function invoiceDetails()
    {
        return $this->hasMany(InvoiceDetail::class);
    }

    public function displayInvoiceDetails()
    {
        return $this->belongsToMany(Product::class, 'invoice_details')
        ->withPivot('id','invoice_id',"product_id",'quantity','rate','gst_rate','gst_amount','total_taxable_amount');
    }
}