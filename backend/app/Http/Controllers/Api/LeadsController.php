<?php

namespace App\Http\Controllers\Api;

use App\Models\Lead;
use App\Models\LeadProduct;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\LeadResource;
use App\Http\Requests\StoreLeadRequest;
use App\Http\Resources\ContactResource;
use App\Http\Controllers\Api\BaseController;

    /**
     * @group Lead Management
     */
    
class LeadsController extends BaseController
{
    /**
     * All Leads .
     */
    public function index(Request $request): JsonResponse
    {
        $query = Lead::query();
        if ($request->query('search')) {
            $searchTerm = $request->query('search');
    
            $query->where(function ($query) use ($searchTerm) {
                $query->where('lead_owner', 'like', '%' . $searchTerm . '%');
            });
        }
        $leads = $query->paginate(5);

        return $this->sendResponse(["Lead"=>LeadResource::collection($leads),
        'pagination' => [
            'current_page' => $leads->currentPage(),
            'last_page' => $leads->lastPage(),
            'per_page' => $leads->perPage(),
            'total' => $leads->total(),
        ]], "Leads retrieved successfully");
    }

    /**
     * Store Lead.
     * @bodyParam lead_source string The Source of the lead.
     * @bodyParam lead_status string The Status of the Lead.
     * @bodyParam contact_id string The id of the contact.
     */
    public function store(StoreLeadRequest $request): JsonResponse
    {
        $employee = auth()->user()->employee;
        $lead = new Lead();
        $lead->employee_id = $employee->id;
        $lead->contact_id = $request->input("contact_id");
        // $lead->lead_owner = $employee->employee_name;
        $lead->lead_type = $request->input("lead_type");
        $lead->tender_number = $request->input("tender_number");
        $lead->portal = $request->input("portal");
        $lead->tender_category = $request->input("tender_category");
        $lead->emd = $request->input("emd");
        $lead->bid_end_date = $request->input("bid_end_date");
        $lead->tender_status = $request->input("tender_status");
        $lead->lead_source = $request->input("lead_source");
        $lead->lead_status = $request->input("lead_status");
        $lead->save();

        $products = $request->input('products');
          
        if($products){
            // Prepare the product details for insertion
        $productDetails = [];
        foreach ($products as $product) {
        $productDetails[] = new LeadProduct([
            'product_id' => $product['product_id'],
            'quantity' => $product['quantity'],
             ]);
          }
            //one to many relatonship for stroing products and for fetching
         $lead->leadProducts()->saveMany($productDetails);
        }
        
        return $this->sendResponse(['Lead'=> new LeadResource($lead)], 'Lead Created Successfully');
    }

     /**
     * Update Lead.
     * @bodyParam lead_source string The Source of the lead.
     * @bodyParam lead_status string The Status of the Lead.
     * @bodyParam contact_id string The id of the contact.
     */
    public function update(Request $request, String $id): JsonResponse
    {
        $employee = auth()->user()->employee;
        $lead = Lead::find($id);
        //   $lead = Lead::with(['leadProducts', 'employee', 'followUp', 'contact'])->find($id);
            if(!$lead){
                return $this->sendError("Lead not found", ['error'=>['lead not found']]);
            }
            
        $lead->contact_id = $request->input("contact_id");
        $lead->lead_type = $request->input("lead_type");
        $lead->tender_number = $request->input("tender_number");
        $lead->portal = $request->input("portal");
        $lead->tender_category = $request->input("tender_category");
        $lead->bid_end_date = $request->input("bid_end_date");
        $lead->tender_status = $request->input("tender_status");
        $lead->lead_source = $request->input("lead_source");
        $lead->lead_status = $request->input("lead_status");
        $lead->save();

        $products = $request->input('products');

        // // Prepare the product data for syncing (associating product_id with quantity)
        // $productData = [];
        // foreach ($products as $product) {
        //     $productData[
        //     $product['product_id']] = ['quantity' => $product['quantity']];
        // }
    
        // // Sync the products to the lead (this will add, update or remove products)
        //  //many to many relatonship for updating products
        // $lead->updateLeadProducts()->sync($productData);
        //end
        $previousProducts = LeadProduct::where("lead_id",$lead->id)->delete();
        $productDetails = [];
        foreach ($products as $product) {
        $productDetails[] = new LeadProduct([
            'product_id' => $product['product_id'],
            'quantity' => $product['quantity'],
             ]);
          }
            //one to many relatonship for stroing products and for fetching
         $lead->leadProducts()->saveMany($productDetails);
        return $this->sendResponse(['Lead'=> new LeadResource($lead)], 'Lead Updated Successfully');
    }
    

    /**
     * Show Lead.
     */
    public function show(string $id): JsonResponse
    {
        $lead = Lead::find($id);
    //   $lead = Lead::with(['leadProducts', 'employee', 'followUp', 'contact'])->find($id);
        if(!$lead){
            return $this->sendError("Lead not found", ['error'=>['lead not found']]);
        }
        return $this->sendResponse(["Lead"=>new LeadResource($lead)], "lead retrieved successfully");
        // return $this->sendResponse(["lead"=> $lead, 'contact'=>new ContactResource($lead->contact)], "lead retrieved successfully");
    }

    /**
     * Destroy lead.
     */
    public function destroy(string $id): JsonResponse
    {
        $lead = lead::find($id);
        if(!$lead){
            return $this->sendError("lead not found", ['error'=>'lead not found']);
        }
        $lead->delete();
        return $this->sendResponse([], "Lead deleted successfully");
    }
}