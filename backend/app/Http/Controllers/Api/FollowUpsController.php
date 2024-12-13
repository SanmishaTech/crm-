<?php

namespace App\Http\Controllers\Api;

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
    /**
     * Store Follow-Up .
     */
   public function store(FollowUpRequest $request): JsonResponse
   {
    $followUp = new FollowUp();
    $followUp->lead_id = $request->input('lead_id');
    $followUp->follow_up_date = $request->input('follow_up_date');
    $followUp->remarks = $request->input('remarks');
    $followUp->save();
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