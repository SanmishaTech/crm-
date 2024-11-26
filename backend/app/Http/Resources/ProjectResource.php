<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {       
        $users = UserResource::collection($this->users);
        return [
            "id" => $this->id,
            "name" => $this->name,
            "description" => $this->description,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            "users" => $users,
        ];
    }
}
