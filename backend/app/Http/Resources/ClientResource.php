<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'client' => $this->client,
            'contact_no' => $this->contact_no,
            'email' => $this->email,
            'gstin' => $this->gstin,
            'street_address' => $this->street_address,
            'area' => $this->area,
            'city' => $this->city,
            'state' => $this->state,
            'pincode' => $this->pincode,
            'country' => $this->country,
            'shipping_street' => $this->shipping_street,
            'shipping_area' => $this->shipping_area,
            'shipping_city' => $this->shipping_city,
            'shipping_state' => $this->shipping_state,
            'shipping_pincode' => $this->shipping_pincode,
            'shipping_country' => $this->shipping_country,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}