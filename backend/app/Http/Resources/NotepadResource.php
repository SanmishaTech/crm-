<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotepadResource extends JsonResource
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
            "note_title" => $this->note_title,
            "note_content" => $this->note_content,
            "note_color" => $this->note_color,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];    }
}