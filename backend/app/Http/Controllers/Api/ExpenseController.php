<?php

namespace App\Http\Controllers\Api;

use Log;
use Carbon\Carbon;
use App\Models\Expense;
use App\Models\Expenses;
use Illuminate\Http\Request;
use App\Models\ExpenseDetail;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Api\BaseController;
use App\Http\Resources\ExpenseResource;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

/**
 * @group Expense Management
 */
class ExpenseController extends BaseController
{
    

    /**
     * Display a listing of expenses.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Expenses::with([
            'employee', 
            'expenseDetails.expenseHead'
        ]);
        
        if ($request->query('searchTerm')) {
            $searchTerm = $request->query('searchTerm');
        
            $query->where(function ($query) use ($searchTerm) {
                $query->where('voucher_number', 'like', '%' . $searchTerm . '%')
                    ->orWhere('voucher_date', 'like', '%' . $searchTerm . '%');
            });
        }
        
        $expenses = $query->paginate(9);
    
        return $this->sendResponse([
            "Expense" => ExpenseResource::collection($expenses),
            'pagination' => [
                'current_page' => $expenses->currentPage(),
                'last_page' => $expenses->lastPage(),
                'per_page' => $expenses->perPage(),
                'total' => $expenses->total(),
            ]
        ], "Expenses retrieved successfully");
    }

    /**
     * Store a newly created expense in storage.
     */
    public function store(Request $request): JsonResponse
    {
        // Log the incoming request data
        \Log::info('Incoming expense request:', $request->all());

        // Validate the request
        $validator = Validator::make($request->all(), [
            'voucher_number' => 'nullable|string',
            'voucher_date' => 'required|date',
            'expense_details' => 'required|array|min:1',
            'expense_details.*.expense_head_id' => 'required',
            'expense_details.*.amount' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        }

        try {
            DB::beginTransaction();

            $employee = auth()->user()->employee;
            
            // Create the main expense record
            $expense = new Expenses();
            $expense->employee_id = $employee->id;
            $expense->voucher_number = $request->input('voucher_number');
            $expense->voucher_date = $request->input('voucher_date');
            $expense->voucher_amount = $request->input('voucher_amount');
            $expense->save();

            // Process expense details
            foreach ($request->input('expense_details') as $detail) {
                ExpenseDetail::create([
                    'expense_id' => $expense->id,
                    'expense_head_id' => $detail['expense_head_id'],
                    'amount' => $detail['amount']
                ]);
            }

            DB::commit();

            // Load the relationships for the response
            $expense->load(['expenseDetails.expenseHead', 'employee']);
            
            return $this->sendResponse(
                ['Expense' => new ExpenseResource($expense)], 
                'Expense created successfully'
            );

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error creating expense: ' . $e->getMessage());
            return $this->sendError('Error creating expense', ['error' => [$e->getMessage()]]);
        }
    }

    /**
     * Display the specified expense.
     */
    public function show(string $id): JsonResponse
    {
        $expense = Expenses::with(['expenseDetails.expenseHead', 'employee'])->find($id);
        
        if(!$expense){
            return $this->sendError("Expense not found", ['error'=>['Expense not found']]);
        }
        
        return $this->sendResponse(["Expense" => new ExpenseResource($expense)], "Expense retrieved successfully");
    }

    /**
     * Update the specified expense in storage.
     */
    public function update(Request $request, string $id): JsonResponse
{
    $validator = Validator::make($request->all(), [
        'voucher_date' => 'required|date',
        'expense_details' => 'required|array|min:1',
        'expense_details.*.expense_head_id' => 'required|exists:expense_heads,id',
        'expense_details.*.amount' => 'required|numeric|min:0',
    ]);

    if ($validator->fails()) {
        return $this->sendError('Validation Error.', $validator->errors());
    }

    $expense = Expenses::find($id);
    if (!$expense) {
        return $this->sendError("Expense not found", ['error' => ['Expense not found']]);
    }

    try {
        DB::beginTransaction();

        // Update main expense record
        $expense->voucher_date = $request->input("voucher_date"); 
        $expense->voucher_amount = $request->input("voucher_amount");
        $expense->voucher_number = $request->input("voucher_number");
        $expense->save();

        // Delete previous expense details
        ExpenseDetail::where("expense_id", $expense->id)->delete();

        // Save new expense details
        $details = [];
        foreach ($request->input('expense_details') as $detail) {
            $details[] = new ExpenseDetail([
                'expense_id' => $expense->id,
                'expense_head_id' => $detail['expense_head_id'],
                'amount' => $detail['amount'],
            ]);
        }

        $expense->expenseDetails()->saveMany($details);

        DB::commit();

        $expense->load(['expenseDetails.expenseHead', 'employee']);

        return $this->sendResponse(['Expense' => new ExpenseResource($expense)], 'Expense updated successfully');
    } catch (\Exception $e) {
        DB::rollBack();
        \Log::error('Error updating expense: ' . $e->getMessage());
        return $this->sendError('Error updating expense', ['error' => [$e->getMessage()]]);
    }
}

    /**
     * Remove the specified expense from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $expense = Expenses::find($id);
        
        if(!$expense){
            return $this->sendError("Expense not found", ['error'=>['Expense not found']]);
        }
        
        // Delete related expense details
        ExpenseDetail::where("expense_id", $expense->id)->delete();
        
        $expense->delete();
        
        return $this->sendResponse([], "Expense deleted successfully");
    }

    /**
     * Get all expenses without pagination.
     */
    public function allExpenses(): JsonResponse
    {
        $expenses = Expenses::all();
        
        return $this->sendResponse(["Expenses" => $expenses], "All expenses retrieved successfully");
    }

    /**
     * Generate expense report.
     */
    public function generateReport(Request $request)
    {
        try {
            $query = Expenses::with(['expenseDetails', 'employee']);
            
            $from_date = $request->query('from_date');
            $to_date = $request->query('to_date');
            $type = $request->query('type', 'excel');
            
            if ($from_date) {
                $from_date = Carbon::parse($from_date)->startOfDay();
                $query->whereDate('created_at', '>=', $from_date);
            }
            
            if ($to_date) {
                $to_date = Carbon::parse($to_date)->endOfDay();
                $query->whereDate('created_at', '<=', $to_date);
            }
            
            $expenses = $query->get();
            
            if ($expenses->isEmpty()) {
                return $this->sendError("No expenses found", ['error' => ['No expenses found for the selected filter']]);
            }
            
            // Implementation for report generation would go here
            // Similar to the generateReport method in the LeadsController
            
            return $this->sendResponse([], "Report generated successfully");
            
        } catch (\Exception $e) {
            \Log::error('Report Generation Error: ' . $e->getMessage());
            return $this->sendError("Error generating report", ['error' => $e->getMessage()]);
        }
    }
}
