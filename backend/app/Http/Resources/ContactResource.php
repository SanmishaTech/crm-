<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\ClientResource;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
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
            'client_name' => $this->client?->client ?? 'N/A',
            'contact_person' => $this->contact_person,
            'department' => $this->department,
            'designation' => $this->designation,
            'mobile_1' => $this->mobile_1,
            'mobile_2' => $this->mobile_2,
            'email' => $this->email,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'client' => $this->client ? new ClientResource($this->client) : null,
        ];
    }
}