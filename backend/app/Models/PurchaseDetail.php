<?php

namespace App\Models;

use App\Models\Purchase;
use Illuminate\Database\Eloquent\Model;

class PurchaseDetail extends Model
{
    protected $fillable = [
        'purchase_id','product_id', 'quantity', 'rate', 'cgst', 'sgst', 'igst', 'pre_tax_amount', 'post_tax_amount'
    ];

    public function purchase()
    {
        return $this->belongsTo(Purchase::class);
    }
}