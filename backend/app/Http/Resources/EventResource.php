<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'lead_id' => $this->lead_id,
            'event_datetime' => $this->event_datetime?->toIso8601String(),
            'team_user_ids' => $this->team_user_ids,
            'participants' => $this->participants,
            'created_by' => $this->created_by,
            'created_by_user' => $this->whenLoaded('createdBy'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
