<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'product' => [
                'required',
                'unique:products,product,' . $this->route('product'), 
            'product_category_id' => ['required', 'exists:product_categories,id'],
            'supplier_id' => ['required', 'exists:suppliers,id'],  
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'product_category_id.exists' => 'Product Category not Found',
            'supplier_id.exists' => 'Supplier not Found.',
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