<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupplierResource extends JsonResource
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
            'supplier' => $this->supplier,
            'product_category' => $this->productCategory ? $this->productCategory->product_category : "" ,
            'product_category_id' => $this->product_category_id,
            'supplier_type' => $this->supplier_type,
            'street_address' => $this->street_address,
            'area' => $this->area,
            'city' => $this->city,
            'state' => $this->state,
            'pincode' => $this->pincode,
            'country' => $this->country,
            'gstin' => $this->gstin,
            'contact_name' => $this->contact_name,
            'department' => $this->department,
            'location' => $this->location,
            'mobile_1' => $this->mobile_1,
            'mobile_2' => $this->mobile_2,
            'email' => $this->email,
            'alternate_email' => $this->alternate_email,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}