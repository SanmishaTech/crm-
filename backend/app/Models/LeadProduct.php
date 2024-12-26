<?php

namespace App\Models;

use App\Models\Lead;
use Illuminate\Database\Eloquent\Model;

class LeadProduct extends Model
{
    protected $fillable = [
        'lead_id', 'product_id', 'quantity','rate','gst_amount','amount_without_gst','total_amount'
    ];

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    
}