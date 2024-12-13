<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\PurchaseDetailResource;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseResource extends JsonResource
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
            'employee_id' => $this->employee_id,
            'supplier_id' => $this->supplier_id,
            'payment_remarks' => $this->payment_remarks,
            'payment_ref_no' => $this->payment_ref_no,
            'is_paid' => $this->is_paid,
            'payment_status' => $this->payment_status,
            'invoice_no' => $this->invoice_no,
            'invoice_date' => $this->invoice_date,
            'total_cgst' => $this->total_cgst,
            'total_sgst' => $this->total_sgst,
            'total_igst' => $this->total_igst,
            'total_tax_amount' => $this->total_tax_amount,
            'total_amount' => $this->total_amount,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'Products' => PurchaseDetailResource::collection($this->whenLoaded('purchaseDetails')),
        ];
    }
}