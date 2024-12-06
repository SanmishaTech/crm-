<?php

namespace App\Http\Controllers\Api;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\ContactResource;
use App\Http\Controllers\Api\BaseController;

class ContactsController extends BaseController
{
   /**
     * Display Contact.
     */
    public function index(): JsonResponse
    {
        $contacts = Contact::all();
        return $this->sendResponse(['Contact'=> ContactResource::collection($contacts)], "Contact retrived successfuly");

    }

    /**
     * Store Contact.
     */
    public function store(Request $request): JsonResponse
    {
        $contact = new Contact();
        $contact->company_id = $request->input("companyId");
        $contact->name = $request->input("name");
        $contact->mobile = $request->input("mobile");
        $contact->email = $request->input("email");
        $contact->save();
        return $this->sendResponse(['Contact'=> new ContactResource($contact)], "Contact Stored successfuly");

    }

    /**
     * Display Contact.
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
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $contact = Contact::find($id);
        if(!$contact){
            return $this->sendError("Contact not found.", ['Error'=> "Contact not found"]);
        }

        $contact->company_id = $request->input("companyId");
        $contact->name = $request->input("name");
        $contact->mobile = $request->input("mobile");
        $contact->email = $request->input("email");
        $contact->save();
        return $this->sendResponse(['Contact'=> new ContactResource($contact)], "Contact Updated successfuly");
         
    }

    /**
     * Remove Contact.
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