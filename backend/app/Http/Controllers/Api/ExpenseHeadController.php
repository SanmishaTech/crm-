<?php

namespace App\Http\Controllers\Api;

use App\Models\ExpenseHead;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\ExpenseHeadRequest;
use App\Http\Resources\ExpenseHeadResource;
use App\Http\Controllers\Api\BaseController;

class ExpenseHeadController extends BaseController
{

    /**
     * All ExpenseHead.
     */
    public function index(Request $request): JsonResponse
    {
        $query = ExpenseHead::query();

        if ($request->query('search')) {
            $searchTerm = $request->query('search');
    
            $query->where(function ($query) use ($searchTerm) {
                $query->where('expense_head', 'like', '%' . $searchTerm . '%');
            });
        }
        $expense = $query->orderBy("id", "DESC")->paginate(9);

        return $this->sendResponse(["ExpenseHead"=>ExpenseHeadResource::collection($expense),
        'Pagination' => [
            'current_page' => $expense->currentPage(),
            'last_page' => $expense->lastPage(),
            'per_page' => $expense->perPage(),
            'total' => $expense->total(),
        ]], "ExpenseHead retrieved successfully");
        
    }

    /**
     * Store ExpenseHead.
     * @bodyParam expense_head string The name of the ExpenseHead.
     */
    public function store(ExpenseHeadRequest $request): JsonResponse
    {
        $expense = new ExpenseHead();
        $expense->expense_head = $request->input("expense_head");
        if(!$expense->save()) {
            dd($expense); exit;
        }
        return $this->sendResponse(['ExpenseHead'=> new ExpenseHeadResource($expense)], 'ExpenseHead Created Successfully');
    }

    /**
     * Show ExpenseHead.
     */
    public function show(string $id): JsonResponse
    {
        $expense = ExpenseHead::find($id);

        if(!$expense){
            return $this->sendError("ExpenseHead not found", ['error'=>['ExpenseHead not found']]);
        }
        //  $project->load('users');
        return $this->sendResponse(["ExpenseHead"=> new ExpenseHeadResource($expense)], "ExpenseHead retrived successfully");
    }

    /**
     * Update ExpenseHead.
     * @bodyParam expense_head string The name of the ExpenseHead.
     */
    public function update(ExpenseHeadRequest $request, string $id): JsonResponse
    {
        $expense = ExpenseHead::find($id);
        if(!$expense){
            return $this->sendError("ExpenseHeadResource not found", ['error'=>['ExpenseHead not found']]);
        }
        $expense->expense_head = $request->input('expense_head');
        $expense->save();
        return $this->sendResponse(["ExpenseHead"=> new ExpenseHeadResource($expense)], "ExpenseHead Updated successfully");

    }

    /**
     * Delete ExpenseHead
     */
    public function destroy(string $id): JsonResponse
    {
        $expense = ExpenseHead::find($id);
        if(!$expense){
            return $this->sendError("ExpenseHead not found", ['error'=>'ExpenseHead not found']);
        }

        $expense->delete();

        return $this->sendResponse([], "ExpenseHead deleted successfully");
    }

    /**
     * Fetch All ExpenseHead.
     */
    public function allExpenseHead(): JsonResponse
    {
        $expense = ExpenseHead::all();

        return $this->sendResponse(["ExpenseHead"=>ExpenseHeadResource::collection($expense),
        ], "ExpenseHead retrieved successfully");

    }
}
