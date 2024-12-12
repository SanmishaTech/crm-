<?php

namespace App\Http\Controllers\Api;

use App\Models\Client;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\ClientResource;
use App\Http\Resources\ContactResource;
use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateContactRequest;
use App\Http\Controllers\Api\BaseController;


     /**
     * @group Contact Management.
     */

class ContactsController extends BaseController
{
   /**
     * All Contact.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Contact::query();

        if ($request->query('search')) {
            $searchTerm = $request->query('search');
    
            $query->where(function ($query) use ($searchTerm) {
                $query->where('contact_person', 'like', '%' . $searchTerm . '%');
            });
        }
        $contact = $query->paginate(5);

        return $this->sendResponse(["Contact"=>ContactResource::collection($contact),
        'pagination' => [
            'current_page' => $contact->currentPage(),
            'last_page' => $contact->lastPage(),
            'per_page' => $contact->perPage(),
            'total' => $contact->total(),
        ]], "Contact retrived successfully");
        
    }

    /**
     * Store Contact.
     * @bodyParam client_id string The client id of the Contact.
     * @bodyParam contact_person string The contact person of the Contact.
     * @bodyParam department string The department of the Contact.
     * @bodyParam designation string The designation of the Contact.
     * @bodyParam mobile_1 string The mobile1 of the Contact.
     * @bodyParam mobile_2 string The mobile2 of the Contact.
     * @bodyParam email string The email of the Contact.
     */
    public function store(StoreContactRequest $request): JsonResponse
    {
        $contact = new Contact();
        if ($request->input("client")){
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
        };
        $contact->client_id = $clients->id;
        $contact->contact_person = $request->input("contact_person");
        $contact->department = $request->input("department");
        $contact->designation = $request->input("designation");
        $contact->mobile_1 = $request->input("mobile_1");
        $contact->mobile_2 = $request->input("mobile_2");
        $contact->email = $request->input("email");
        $contact->save();
        return $this->sendResponse(['Contact'=> new ContactResource($contact), 'Client'=> new ClientResource($clients) ],  "Contact Stored successfully");

    }
         
    /**
     * Show Contact.
     */
    public function show(string $id): JsonResponse
    {
        $contact = Contact::find($id);
        if(!$contact){
            return $this->sendError("Contact not found.", ['Error'=> "Contact not found"]);
        }
        return $this->sendResponse(['Contact'=> new ContactResource($contact)], "Contact retrived successfuly");

    }

    /**
     * Update Contact.
     * @bodyParam client_id string The client id of the Contact.
     * @bodyParam contact_person string The contact person of the Contact.
     * @bodyParam department string The department of the Contact.
     * @bodyParam designation string The designation of the Contact.
     * @bodyParam mobile_1 string The mobile 1 of the Contact.
     * @bodyParam mobile_2 string The mobile 2 of the Contact.
     * @bodyParam email string The email of the Contact.
     */
    public function update(UpdateContactRequest $request, string $id): JsonResponse
    {
        $contact = Contact::find($id);
        if(!$contact){
            return $this->sendError("Contact not found.", ['Error'=> "Contact not found"]);
        }
        if ($request->input("client")){
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
        };
        $contact->client_id = $request->input("client_id");
        $contact->contact_person = $request->input("contact_person");
        $contact->department = $request->input("department");
        $contact->designation = $request->input("designation");
        $contact->mobile_1 = $request->input("mobile_1");
        $contact->mobile_2 = $request->input("mobile_2");
        $contact->email = $request->input("email");
        $contact->save();
        return $this->sendResponse(['Contact'=> new ContactResource($contact), 'Client'=> new ClientResource($clients)], "Contact Updated successfuly");
         
    }

    /**
     * Destroy Contact.
     */
    public function destroy(string $id): JsonResponse
    {
        $contact = Contact::find($id);
        if(!$contact){
            return $this->sendError("Contact not found.", ['Error'=> "Contact not found"]);
        }
         $contact->delete();
         return $this->sendResponse([], "Contact Deleted successfuly");
    }
}