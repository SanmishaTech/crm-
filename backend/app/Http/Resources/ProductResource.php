<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'product_category_id' => $this->product_category_id,
            'supplier_id' => $this->supplier_id,
            'product' => $this->product,
            'product_gstin' => $this->product_gstin,
            'hsn_code' => $this->hsn_code,
            'model' => $this->model,
            'manufacturer' => $this->manufacturer,
            'opening_qty' => $this->opening_qty,
            'closing_qty' => $this->closing_qty,
            'last_traded_price' => $this->last_traded_price,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}