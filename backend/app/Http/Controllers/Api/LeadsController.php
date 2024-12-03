<?php

namespace App\Http\Controllers\Api;

use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\LeadResource;
use App\Http\Controllers\Api\BaseController;

class LeadsController extends BaseController
{
    /**
     * Display All Leads.
     */
    public function index(): JsonResponse
    {
        $leads = Lead::all();
        
        return $this->sendResponse(["Leads"=> LeadResource::collection($leads)], 'Leads Retrived Successfully');
    }

    /**
     * Store Leads.
     */
    public function store(Request $request): JsonResponse
    {
        $lead = new Lead();
        $lead->profile_id = auth()->user()->profile->id;
        $lead->owner_name = $request->input("ownerName");
        $lead->company = $request->input("company");
        $lead->first_name = $request->input("firstName");
        $lead->last_name = $request->input("lastName");
        $lead->title = $request->input("title");
        $lead->email = $request->input("email");
        $lead->mobile = $request->input("mobile");
        $lead->fax = $request->input("fax");
        $lead->telephone = $request->input("telephone");
        $lead->website = $request->input("website");
        $lead->lead_source = $request->input("leadSource");
        $lead->lead_status = $request->input("leadStatus");
        $lead->industry = $request->input("industry");
        $lead->no_of_employees = $request->input("employees");
        $lead->annual_revenue = $request->input("annual");
        $lead->ratings = $request->input("rating");
        $lead->skype_id = $request->input("skypeID");
        $lead->secondary_email = $request->input("secondaryEmail");
        $lead->twitter_id = $request->input("twitter");
        $lead->street = $request->input("street");
        $lead->city = $request->input("city");
        $lead->state = $request->input("state");
        $lead->zip_code = $request->input("zipCode");
        $lead->country = $request->input("country");
        $lead->description = $request->input("description");
        $lead->save();

        return $this->sendResponse(["Lead"=> new LeadResource($lead)], 'Lead Stored Successfully');

    }

    /**
     * Display Lead.
     */
    public function show(string $id): JsonResponse
    {
        $lead = Lead::find($id);
        if(!$lead){
            return $this->sendError("Lead not found", ['error'=>'Lead not found']);
        }
        
        return $this->sendResponse(["Lead"=> new LeadResource($lead)], 'Lead retrived Successfully');
    }

    /**
     * Update Lead.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $lead = Lead::find($id);
        if(!$lead){
            return $this->sendError("Lead not found", ['error'=>'Lead not found']);
        }

        $lead->owner_name = $request->input("ownerName");
        $lead->company = $request->input("company");
        $lead->first_name = $request->input("firstName");
        $lead->last_name = $request->input("lastName");
        $lead->title = $request->input("title");
        $lead->email = $request->input("email");
        $lead->mobile = $request->input("mobile");
        $lead->fax = $request->input("fax");
        $lead->telephone = $request->input("telephone");
        $lead->website = $request->input("website");
        $lead->lead_source = $request->input("leadSource");
        $lead->lead_status = $request->input("leadStatus");
        $lead->industry = $request->input("industry");
        $lead->no_of_employees = $request->input("employees");
        $lead->annual_revenue = $request->input("annual");
        $lead->ratings = $request->input("rating");
        $lead->skype_id = $request->input("skypeID");
        $lead->secondary_email = $request->input("secondaryEmail");
        $lead->twitter_id = $request->input("twitter");
        $lead->street = $request->input("street");
        $lead->city = $request->input("city");
        $lead->state = $request->input("state");
        $lead->zip_code = $request->input("zipCode");
        $lead->country = $request->input("country");
        $lead->description = $request->input("description");
        $lead->save();

        return $this->sendResponse(["Lead"=> new LeadResource($lead)], 'Lead Updated Successfully');
        
    }

    /**
     * Remove Lead.
     */
    public function destroy(string $id): JsonResponse
    {
        $lead = Lead::find($id);
        if(!$lead){
            return $this->sendError("Lead not found", ['error'=>'Lead not found']);
        }
        $lead->delete();
        return $this->sendResponse([], 'Lead Deleted Successfully');

    }
}