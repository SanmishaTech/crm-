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
        
        return [
            'id' => $this->id,
            'employee_id' => $this->employee_id,
            'contact_id' => $this->contact_id,
            'lead_owner' => $this->lead_owner,
            'lead_type' => $this->lead_type,
            'tender_number' => $this->tender_number,
            'portal' => $this->portal,
            'tender_category' => $this->tender_category,
            'lead_closing_reason' => $this->lead_closing_reason,
            'lead_attachment' => $this->lead_attachment,
            'lead_quotation' => $this->lead_quotation,
            'lead_invoice' => $this->lead_invoice,
            'emd' => $this->emd,
            'bid_end_date' => $this->bid_end_date,
            'tender_status' => $this->tender_status,
            'lead_status' => $this->lead_status,
            'lead_remark' => $this->lead_remark,
            'lead_follow_up_date' => $this->lead_follow_up_date,
            'lead_source' => $this->lead_source,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'employee' => new EmployeeResource($this->employee),
            'contact' => new ContactResource($this->contact),  
            'products' => $this->updateLeadProducts,  
            'follow_ups' => $this->followUps,
        ];
    }
}