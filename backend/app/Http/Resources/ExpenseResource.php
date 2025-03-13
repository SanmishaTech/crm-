<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\EmployeeResource;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\ExpenseHead;

class ExpenseResource extends JsonResource
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
             
            'voucher_number' => $this->voucher_number,
            'voucher_date' => $this->voucher_date,
            'voucher_amount' => $this->voucher_amount,
           
            // Employee relationship
             
            // Expense details as array of objects
            'expense_details' => $this->expenseDetails->map(function ($detail) {
                return [
                    'id' => $detail->id,
                    'expense_id' => $detail->expense_id,
                    'expense_head_id' => $detail->expense_head_id,
                    'expense_head_name' => $detail->expenseHead ? $detail->expenseHead->expense_head : 'N/A',
                    'amount' => $detail->amount,
                ];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
        ];
    }
}
