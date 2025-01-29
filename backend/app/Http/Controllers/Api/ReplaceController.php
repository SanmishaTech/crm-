<?php

namespace App\Http\Controllers\Api;

use App\Models\Replace;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\ReplaceRequest;
use App\Http\Resources\ReplaceResource;
use App\Http\Requests\StoreReplaceRequest;
use App\Http\Requests\UpdateReplaceRequest;
use App\Http\Controllers\Api\BaseController;
use App\Http\Controllers\Api\ReplaceController;

class ReplaceController extends BaseController
{
   public function index(Request $request):JsonResponse 
   {
    $query =  Replace::query();

    if($request->query('search')){
        $searchTerm = $request->query('search');

        $query->where(function($query) use ($searchTerm){
            $query->where('customer_name', 'like', '%' . $searchTerm . '%');
        });
    }
     
    $replaces = $query->paginate(9);

    return $this->sendResponse(["Replaces" => ReplaceResource::collection($replaces),
    'pagination' => [
        'current_page' => $replaces->currentPage(),
        'last_page' => $replaces->lastPage(),
        'per_page' => $replaces->perPage(),
        'total' => $replaces->total(),
    ]], "Replacement retrived successfully");
   }


   public function store(ReplaceRequest $request):JsonResponse
   {
    $replaces = new Replace();
    $replaces->date = $request->input("date");
    $replaces->customer_name = $request->input("customer_name");
    $replaces->customer_mobile = $request->input("customer_mobile");
    $replaces->customer_email = $request->input("customer_email");
    $replaces->customer_address = $request->input("customer_address");
    $replaces->instrument = $request->input("instrument");
    $replaces->instrument_number = $request->input("instrument_number");
    $replaces->invoice_number = $request->input('invoice_number');
    $replaces->invoice_date = $request->input('invoice_date');
    $replaces->received_date = $request->input('received_date');
    $replaces->replace = $request->input('replace');
    $replaces->current_status = $request->input('current_status');

    $replaces->dispatch = $request->input('dispatch');
    $replaces->registered = $request->input('registered');

    $replaces->save();

    return $this->sendResponse(["Replaces" => new ReplaceResource($replaces)], 'Replace Stored Successfully');

   }

   public function show(string $id):JsonResponse
   {
    $replaces = Replace::find($id);
    if(!$replaces){
        return $this->sendError("Replaces not found", ['error' =>'Replaces not found']);
    }
    return  $this->sendResponse(["Replaces" => new ReplaceResource($replaces)], 'Replaces retrived Successfully');
   }

   public function update(ReplaceRequest $request, string $id): JsonResponse
   {
       // Find the existing supplier
       $replaces = Replace::find($id);
   
       if (!$replaces) {
           return $this->sendError("Replaces not found", ['error' => 'Replaces not found']);
       }
   
         $replaces->date = $request->input("date");
        $replaces->customer_name = $request->input("customer_name");
        $replaces->customer_mobile = $request->input("customer_mobile");
        $replaces->customer_email = $request->input("customer_email");
        $replaces->customer_address = $request->input("customer_address");
        $replaces->instrument = $request->input("instrument");
        $replaces->instrument_number = $request->input("instrument_number");
        $replaces->invoice_number = $request->input('invoice_number');
        $replaces->invoice_date = $request->input('invoice_date');
        $replaces->received_date = $request->input('received_date');
        $replaces->replace = $request->input('replace');
        $replaces->current_status = $request->input('current_status');
        $replaces->dispatch = $request->input('dispatch');

        $replaces->registered = $request->input('registered');
   
        $replaces->save();
   
       return $this->sendResponse(["Replaces" => new ReplaceResource($replaces)], 'Replaces Updated Successfully');
   }


   public function destroy(string $id): JsonResponse
   {
       $replaces = Replace::find($id);
       if(!$replaces){
           return $this->sendError("Replaces not found", ['error'=>'Replaces not found']);
       }
       $replaces->delete();
       return $this->sendResponse([], 'Replaces Deleted Successfully');

   }


   public function allReplaces(): JsonResponse
   {
       $replaces = Replace::all();

       return $this->sendResponse(["Replaces"=>ReplaceResource::collection($replaces),
       ], "Replaces retrived successfully");

   }










}