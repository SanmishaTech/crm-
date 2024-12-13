<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateProductCategoryRequest extends FormRequest
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
            'product_category' => [
                'required',
                'unique:product_categories,product_category,' . $this->route('product_category'), 
            ],
            'product_category_id' => ['nullable', 'exists:product_categories,id'], // Ensure product_category exists
            'supplier_id' => ['nullable', 'exists:suppliers,id'], // Ensure supplier exist   
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