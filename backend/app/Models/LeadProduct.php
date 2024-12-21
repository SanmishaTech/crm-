<?php

namespace App\Models;

use App\Models\Lead;
use Illuminate\Database\Eloquent\Model;

class LeadProduct extends Model
{
    protected $fillable = [
        'lead_id', 'product_id', 'quantity',
    ];

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }
}