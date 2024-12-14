<?php

namespace App\Models;

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
}