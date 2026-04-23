<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'client', 'contact_no', 'email', 'gstin', 'street_address', 
        'area', 'city', 'state', 'pincode', 'country',
        'shipping_street', 'shipping_area', 'shipping_city', 'shipping_state', 'shipping_pincode', 'shipping_country'
    ];
}
