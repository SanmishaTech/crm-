<?php

namespace App\Http\Controllers\Api;

use App\Models\Lead;
use App\Models\FollowUp;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\FollowUpRequest;
use App\Http\Resources\FollowUpResource;
use App\Http\Controllers\Api\BaseController;

   /**
     * @group Follow-Up Management
     */
    
class FollowUpsController extends BaseController
{

  public function index(Request $request): JsonResponse
    {
        $query = FollowUp::query();

        if ($request->query('search')) {
            $searchTerm = $request->query('search');
    
            $query->where(function ($query) use ($searchTerm) {
                $query->where('follow_up_type', 'like', '%' . $searchTerm . '%');
            });
        }
        $followUp = $query->orderBy("id", "DESC")->paginate(5);

        return $this->sendResponse(["FollowUp"=>FollowUpResource::collection($followUp),
        'Pagination' => [
            'current_page' => $followUp->currentPage(),
            'last_page' => $followUp->lastPage(),
            'per_page' => $followUp->perPage(),
            'total' => $followUp->total(),
        ]], "Department retrived successfully");
        
    }

    /**
     * Store Follow-Up .
     */
   public function store(FollowUpRequest $request): JsonResponse
   {
    $followUp = new FollowUp();
    $followUp->lead_id = $request->input('lead_id');
    $followUp->follow_up_date = $request->input('follow_up_date');  
    $followUp->next_follow_up_date = $request->input('next_follow_up_date');
    $followUp->follow_up_type = $request->input('follow_up_type');
    $followUp->remarks = $request->input('remarks');
    $followUp->save();
    
    $lead = Lead::find($followUp->lead_id);
    if(!$lead){
        return $this->sendError("Lead not found", ['error'=>['lead not found']]);
    }
    $lead->lead_follow_up_date = $request->input('next_follow_up_date');
    $lead->follow_up_remark = $request->input('remarks');
    $lead->save();

    return $this->sendResponse(['FollowUp'=> new FollowUpResource($followUp)], 'Follow-Up Created Successfully');

   }

     /**
     * Show Follow-Up.
     */
    public function show(string $id): JsonResponse
    {
        $followUp = FollowUp::find($id);

        if(!$followUp){
            return $this->sendError("Follow-Up not found", ['error'=>['Follow-Up not found']]);
        }
        //  $project->load('users');
        return $this->sendResponse(["FollowUp"=> new FollowUpResource($followUp)], "FollowUp retrieved successfully");
    }
    
   
}