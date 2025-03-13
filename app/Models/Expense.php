<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'expense_heads_id',
        'voucher_number',
        'voucher_date',
        'voucher_amount',
    ];

    /**
     * Get the expense details for the expense.
     */
    public function expenseDetails(): HasMany
    {
        return $this->hasMany(ExpenseDetail::class);
    }

    /**
     * Get the employee that owns the expense.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
} 