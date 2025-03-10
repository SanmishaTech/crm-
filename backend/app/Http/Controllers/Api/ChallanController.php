<?php

namespace App\Http\Controllers\Api;

use App\Models\Challan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\ChallanResource;
use App\Http\Controllers\Api\BaseController;

class ChallanController extends BaseController
{
    public function index(Request $request):JsonResponse 
    {
     $query =  Challan::query();
 
     if($request->query('search')){
         $searchTerm = $request->query('search');
 
         $query->where(function($query) use ($searchTerm){
             $query->where('challan_number', 'like', '%' . $searchTerm . '%');
         });
     }
      
     $challan = $query->paginate(9);
 
     return $this->sendResponse(["Challans" => ChallanResource::collection($challan),
     'pagination' => [
         'current_page' => $challan->currentPage(),
         'last_page' => $challan->lastPage(),
         'per_page' => $challan->perPage(),
         'total' => $challan->total(),
     ]], "Challanment retrived successfully");
    }
 
 
    public function store(Request $request):JsonResponse
    {
     $challan = new Challan();
     $challan->date = $request->input("date");
         $challan->challan_number = $request->input("challan_number");
         $challan->items = $request->input("items");
         $challan->purpose = $request->input("purpose");
 
     $challan->save();
 
     return $this->sendResponse(["Challans" => new ChallanResource($challan)], 'Challan Stored Successfully');
 
    }
 
    public function show(string $id):JsonResponse
    {
     $challan = Challan::find($id);
     if(!$challan){
         return $this->sendError("Challans not found", ['error' =>'Challans not found']);
     }
     return  $this->sendResponse(["Challans" => new ChallanResource($challan)], 'Challans retrived Successfully');
    }
 
    public function update(Request $request, string $id): JsonResponse
    {
        // Find the existing supplier
        $challan = Challan::find($id);
    
        if (!$challan) {
            return $this->sendError("Challans not found", ['error' => 'Challans not found']);
        }
    
          $challan->date = $request->input("date");
         $challan->challan_number = $request->input("challan_number");
         $challan->items = $request->input("items");
         $challan->purpose = $request->input("purpose");
         
 
     
         $challan->save();
    
        return $this->sendResponse(["Challans" => new ChallanResource($challan)], 'Challans Updated Successfully');
    }
 
 
    public function destroy(string $id): JsonResponse
    {
        $challan = Challan::find($id);
        if(!$challan){
            return $this->sendError("Challans not found", ['error'=>'Challans not found']);
        }
        $challan->delete();
        return $this->sendResponse([], 'Challans Deleted Successfully');
 
    }
 
 
    public function allChallans(): JsonResponse
    {
        $challan = Challan::all();
 
        return $this->sendResponse(["Challans"=>ChallanResource::collection($challan),
        ], "Challans retrived successfully");
 
    }
}
