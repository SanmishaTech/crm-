<?php

namespace App\Models;

use App\Models\InvoiceDetail;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    //

    public function invoiceDetails()
    {
        return $this->hasMany(InvoiceDetail::class);
    }
}