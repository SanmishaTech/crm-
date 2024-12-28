<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceDetailResource extends JsonResource
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
            'invoice_id' => $this->invoice_id,
            'product_id' => $this->product_id,
            'quantity' => $this->quantity,
            'rate' => $this->rate,
            'gst_rate' => $this->gst_rate,
            'gst_amount' => $this->gst_amount,
            'total_taxable_amount' => $this->total_taxable_amount,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'product' => new ProductResource($this->load('product')),  // If you want to load product data
        ];
    }
}