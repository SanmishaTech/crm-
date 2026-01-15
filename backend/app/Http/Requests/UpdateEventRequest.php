<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'lead_id' => ['nullable', 'exists:leads,id'],
            'event_datetime' => ['nullable', 'date'],
            'team_user_ids' => ['nullable', 'array'],
            'team_user_ids.*' => ['integer', 'exists:users,id'],
            'participants' => ['nullable', 'array'],
            'participants.*.company_name' => ['nullable', 'string', 'max:255'],
            'participants.*.participant_name' => ['nullable', 'string', 'max:255'],
            'participants.*.contact_number' => ['nullable', 'string', 'max:30'],
            'participants.*.email_id' => ['nullable', 'email', 'max:255'],
            'participants.*.attended' => ['nullable', 'boolean'],
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422)
        );
    }
}
