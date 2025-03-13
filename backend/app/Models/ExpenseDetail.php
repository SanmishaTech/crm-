<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExpenseDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'expense_id',
        'expense_head_id',
        'amount'
    ];

    /**
     * Get the expense that owns the detail.
     */
    public function expense(): BelongsTo
    {
        return $this->belongsTo(Expenses::class);
    }

    /**
     * Get the expense head associated with this detail.
     */
    public function expenseHead()
    {
        return $this->belongsTo(ExpenseHead::class, 'expense_head_id');
    }
}
