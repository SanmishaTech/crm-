<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReplaceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"=>$this->id,
            "date"=>$this->date,
            "customer_name"=>$this->customer_name,
            "customer_mobile"=>$this->customer_mobile,
            "customer_email"=>$this->customer_email,
            "customer_address"=>$this->customer_address,
            "instrument"=>$this->instrument,
            "instrument_number"=>$this->instrument_number,
            "invoice_number"=>$this->invoice_number,
            "invoice_date"=>$this->invoice_date,
            "received_date"=>$this->received_date,
            "replace"=>$this->replace,
            "dispatch"=>$this->dispatch,
            "current_status"=>$this->current_status,
            "registered"=>$this->registered,
        ];
    }
}