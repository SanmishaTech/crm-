<?php

namespace App\Http\Controllers\Api;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\ClientResource;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Http\Controllers\Api\BaseController;
use App\Http\Controllers\Api\ClientsController;

 
    /**
     * @group Clients Management.
     */
 
  
class ClientsController extends BaseController
{
   
    
    /**
     * All Clients.
     */
    public function index( Request $request): JsonResponse

    {
        $query = Client::query();
        
        if ($request->query('search')) {
            $searchTerm = $request->query('search');
    
            $query->where(function ($query) use ($searchTerm) {
                $query->where('client', 'like', '%' . $searchTerm . '%');
            });
        }
        $clients = $query->paginate(5);

        return $this->sendResponse(["Client"=>ClientResource::collection($clients),
        'pagination' => [
            'current_page' => $clients->currentPage(),
            'last_page' => $clients->lastPage(),
            'per_page' => $clients->perPage(),
            'total' => $clients->total(),
        ]], "Clients retrived successfully");
    }

    /**
     * Store Clients.
     * @bodyParam client string The name of the Client.
     * @bodyParam street_address string The street address of the Client.
     * @bodyParam area string The area of the Client.
     * @bodyParam city string The city of the Client.
     * @bodyParam state string The state of the Client.
     * @bodyParam pincode string The pincode of the Client.
     * @bodyParam country string The country of the Client.
     * @bodyParam gstin string The gstin of the Client.
     * @bodyParam contact_no string The contact number of the Client.
     * @bodyParam email string The email of the Client.
     */
    public function store(StoreClientRequest $request): JsonResponse
    {
        $clients = new Client();
        $clients->client = $request->input("client");
        $clients->street_address = $request->input("street_address");
        $clients->area = $request->input("area");
        $clients->city = $request->input("city");
        $clients->state = $request->input("state");
        $clients->pincode = $request->input("pincode");
        $clients->country = $request->input("country");
        $clients->gstin = $request->input("gstin");
        $clients->contact_no = $request->input("contact_no");
        $clients->email = $request->input("email"); 
        $clients->save();

        return $this->sendResponse(["Client"=> new ClientResource($clients)], 'Client Stored Successfully');

    }

    /**
     * Show Clients.
     */
    public function show(string $id): JsonResponse
    {
        $clients = Client::find($id);
        if(!$clients){
            return $this->sendError("Clients not found", ['error'=>'Clients not found']);
        }
        
        return $this->sendResponse(["Client"=> new ClientResource($clients)], 'Client retrived Successfully');
    }

    /**
     * Update Clients.
     * @bodyParam client string The name of the Client.
     * @bodyParam street_address string The street address of the Client.
     * @bodyParam area string The area of the Client.
     * @bodyParam city string The city of the Client.
     * @bodyParam state string The state of the Client.
     * @bodyParam pincode string The pincode of the Client.
     * @bodyParam country string The country of the Client.
     * @bodyParam gstin string The gstin of the Client.
     * @bodyParam contact_no string The contact number of the Client.
     * @bodyParam email string The email of the Client.
     
     */
    public function update(UpdateClientRequest $request, string $id): JsonResponse
    {
        $clients = Client::find($id);
        if(!$clients){
            return $this->sendError("Clients not found", ['error'=>'Clients not found']);
        }

        $clients->client = $request->input("client");
        $clients->street_address = $request->input("street_address");
        $clients->area = $request->input("area");
        $clients->city = $request->input("city");
        $clients->state = $request->input("state");
        $clients->pincode = $request->input("pincode");
        $clients->country = $request->input("country");
        $clients->gstin = $request->input("gstin");
        $clients->contact_no = $request->input("contact_no");
        $clients->email = $request->input("email"); 
        $clients->save();

        return $this->sendResponse(["Client"=> new ClientResource($clients)], 'Client Updated Successfully');
        
    }

    /**
     * Destroy Clients.
     */
    public function destroy(string $id): JsonResponse
    {
        $clients = Client::find($id);
        if(!$clients){
            return $this->sendError("Client not found", ['error'=>'Client not found']);
        }
        $clients->delete();
        return $this->sendResponse([], 'Client Deleted Successfully');

    }

    
}