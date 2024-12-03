<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
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
            "id" => $this->id,
            "profile_id" => $this->profile_id,
            "ownerName" => $this->owner_name,
            "company" => $this->company,
            "firstName" => $this->first_name,
            "lastName" => $this->last_name,
            "title" => $this->title,
            "email" => $this->email,
            "mobile" => $this->mobile,
            "fax" => $this->fax,
            "telephone" => $this->telephone,
            "website" => $this->website,
            "leadSource" => $this->lead_source,
            "leadStatus" => $this->lead_status,
            "industry" => $this->industry,
            "employees" => $this->no_of_employees,
            "annual" => $this->annual_revenue,
            "rating" => $this->ratings,
            "skypeID" => $this->skype_id,
            "secondaryEmail" => $this->secondary_email,
            "twitter" => $this->twitter_id,
            "street" => $this->street,
            "city" => $this->city,
            "state" => $this->state,
            "zipCode" => $this->zip_code,
            "country" => $this->country,
            "description" => $this->description,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}