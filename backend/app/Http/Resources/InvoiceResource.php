<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\InvoiceDetailResource;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
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
            'client_id' => $this->client_id,
            'invoice_number' => $this->invoice_number,
            'invoice_date' => $this->invoice_date, 
            'amount' => $this->amount,
            'dispatch_details' => $this->dispatch_details,
            'invoice_file' => $this->invoice_file,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'invoice_details' => InvoiceDetailResource::collection($this->invoiceDetails),
        ];
    }
}