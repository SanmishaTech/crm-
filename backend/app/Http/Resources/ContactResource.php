<?php

namespace App\Http\Resources;

use App\Models\Client;
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
        $client = new ClientResource(Client::find($this->client_id));

        return [
            'id' => $this->id,
            'client_id' => $this->client_id,
            'contact_person' => $this->contact_person,
            'department' => $this->department,
            'designation' => $this->designation,
            'mobile_1' => $this->mobile_1,
            'mobile_2' => $this->mobile_2,
            'email' => $this->email,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'client'=> $client,
        ];
    }
}