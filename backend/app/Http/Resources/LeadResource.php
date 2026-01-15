<?php

namespace App\Http\Resources;

use App\Models\Contact;
use App\Models\Employee;
use Illuminate\Http\Request;
use App\Http\Resources\ContactResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\EmployeeResource;
use Illuminate\Http\Resources\Json\JsonResource;

class LeadResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $productNames = $this->updateLeadProducts->map(function($updateLeadProduct) {
            return $updateLeadProduct->product;
        });
      

        
        return [
            'id' => $this->id,
            'employee_id' => $this->employee_id,
            'contact_id' => $this->contact_id,
            'assigned_to' => $this->assigned_to,
            'product_names'=>$productNames,
            'lead_owner' => $this->lead_owner,
            'lead_number'=> $this->lead_number,
            'lead_type' => $this->lead_type,
            'tender_number' => $this->tender_number,
            'portal' => $this->portal,
            'tender_category' => $this->tender_category,
            'lead_closing_reason' => $this->lead_closing_reason,
            'deal_details' => $this->deal_details,
            'lead_attachment' => $this->lead_attachment,
            'lead_quotation' => $this->lead_quotation,
            'lead_invoice' => $this->lead_invoice,
            'emd' => $this->emd,
            'bid_end_date' => $this->bid_end_date,
            'tender_status' => $this->tender_status,
            'lead_status' => $this->lead_status,
            'follow_up_remark' => $this->follow_up_remark,
            'lead_follow_up_date' => $this->lead_follow_up_date,
            'follow_up_type' => $this->follow_up_type,
            'lead_source' => $this->lead_source,
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
            'employee' => new EmployeeResource($this->employee),
            'contact' => new ContactResource($this->contact),
            'assigned_user' => $this->whenLoaded('assignedTo'),
            'products' => $this->leadProducts->map(function ($leadProduct) {
                return [
                    'id' => $leadProduct->id,
                    'lead_id' => $leadProduct->lead_id,
                    'product_id' => $leadProduct->product_id,
                    'quantity' => $leadProduct->quantity,
                    'rate' => $leadProduct->rate,
                    'gst_rate' => $leadProduct->gst_rate,
                    'gst_amount' => $leadProduct->gst_amount,
                    'amount_without_gst' => $leadProduct->amount_without_gst,
                    'total_amount' => $leadProduct->total_amount,
                    'created_at' => $leadProduct->created_at->toIso8601String(),
                    'updated_at' => $leadProduct->updated_at->toIso8601String(),
                    'product' => new ProductResource($leadProduct->product), 
                ];
            }),
            
            // 'products' => $this->leadProducts,  
            'follow_ups' => $this->followUps,
            'events' => $this->events,

        ];
    }
}