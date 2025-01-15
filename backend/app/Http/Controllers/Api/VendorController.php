<?php

namespace App\Http\Controllers\Api;

use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
 use App\Http\Resources\VendorResource;
use App\Http\Requests\StoreVendorRequest;
use App\Http\Requests\UpdateVendorRequest;


 /**
     * @group Vendor Management.
    */
 

class VendorController extends BaseController
{

     /**
     * All Vendors.
     */
   public function index(Request $request): JsonResponse
   {

    $query = Vendor::query();

    if ($request->query('search')) {
        $searchTerm = $request->query('search');

        $query->where(function ($query) use ($searchTerm) {
            $query->where('vendor', 'like', '%' . $searchTerm . '%');
        });
    }

    $vendors = $query->paginate(9);

    return $this->sendResponse(["Vendors"=>VendorResource::collection($vendors),
    'pagination' => [
        'current_page' => $vendors->currentPage(),
        'last_page' => $vendors->lastPage(),
        'per_page' => $vendors->perPage(),
        'total' => $vendors->total(),
    ]], "Vendors retrived successfully");

   }

      /**
     * Store Vendor.
     * @bodyParam vendor_name sting The name of the Vendor.
     * @bodyParam gstin string The GST number of the Vendor.
     * @bodyParam contact_name string The Contact Name of the Vendor.
     * @bodyParam email string The Email of the Vendor.
     * @bodyParam mobile_1 string The Mobile 1 of the Vendor.
     * @bodyParam mobile_2 string The Mobile 2 of the Vendor.
     * @bodyParam state string The State of the Vendor.
     * @bodyParam street_address string The Street Address of the Vendor.
     * @bodyParam area string The Area of the Vendor.
     * @bodyParam city string The City of the Vendor.
     * @bodyParam pincode string The Pincode of the Vendor.
     * @bodyParam country string The Country of the Vendor.
      */
    public function store(StoreVendorRequest $request): JsonResponse
    {
        $vendor = new Vendor();
        $vendor->vendor_name = $request->input("vendor_name");
        $vendor->gstin = $request->input("gstin");
        $vendor->contact_name = $request->input("contact_name");
        $vendor->email = $request->input("email");  
        $vendor->mobile_1 = $request->input("mobile_1");
        $vendor->mobile_2 = $request->input("mobile_2");
        $vendor->street_address = $request->input("street_address");
        $vendor->area = $request->input("area");
        $vendor->city = $request->input("city");
        $vendor->state = $request->input("state");
        $vendor->pincode = $request->input("pincode");
        $vendor->country = $request->input("country");

        $vendor->save();

        return $this->sendResponse(["Vendors"=> new VendorResource($vendor)], 'Vendor Stored Successfully');
    }

     /**
     * Show Vendors.
     */

     public function show(string $id): JsonResponse
     {
         $vendor = Vendor::find($id);
         if(!$vendor){
             return $this->sendError("Vendors not found", ['error'=>'Vendors not found']);
         }
         
         return $this->sendResponse(["Vendors"=> new VendorResource($vendor)], 'Vendors retrived Successfully');
     }

        /**
     * Store Vendor.
     * @bodyParam vendor_name sting The name of the Vendor.
     * @bodyParam gstin string The GST number of the Vendor.
     * @bodyParam contact_name string The Contact Name of the Vendor.
     * @bodyParam email string The Email of the Vendor.
     * @bodyParam mobile_1 string The Mobile 1 of the Vendor.
     * @bodyParam mobile_2 string The Mobile 2 of the Vendor.
     * @bodyParam state string The State of the Vendor.
     * @bodyParam street_address string The Street Address of the Vendor.
     * @bodyParam area string The Area of the Vendor.
     * @bodyParam city string The City of the Vendor.
     * @bodyParam pincode string The Pincode of the Vendor.
     * @bodyParam country string The Country of the Vendor.
      */

      public function update(UpdateVendorRequest $request, string $id): JsonResponse 
      {
        $vendor = Vendor::find($id);

        if(!$vendor){
            return $this->sendError("Vendor not found", ['error'=>'Vendor not found']);
        }

       
        $vendor->vendor_name = $request->input("vendor_name");
        $vendor->gstin = $request->input("gstin");
        $vendor->contact_name = $request->input("contact_name");
        $vendor->email = $request->input("email");  
        $vendor->mobile_1 = $request->input("mobile_1");
        $vendor->mobile_2 = $request->input("mobile_2");
        $vendor->street_address = $request->input("street_address");
        $vendor->area = $request->input("area");
        $vendor->city = $request->input("city");
        $vendor->state = $request->input("state");
        $vendor->pincode = $request->input("pincode");
        $vendor->country = $request->input("country");

        $vendor->save();

        return $this->sendResponse(["Vendors"=> new VendorResource($vendor)], 'Vendor Updated Successfully');


     


      }

            /**
     * Destroy Vendors.
     */
    public function destroy(string $id): JsonResponse
    {
        $vendor = Vendor::find($id);
        if(!$vendor){
            return $this->sendError("Vendor not found", ['error'=>'Vendor not found']);
        }
        $vendor->delete();
        return $this->sendResponse(["Vendor"=> new VendorResource($vendor)], 'Vendor Deleted Successfully');
    }


        /**
     * Fetch All Suppliers.
     */
    public function allVendors(): JsonResponse
    {
        $vendors = Vendor::all();
        return $this->sendResponse(["Vendors"=>VendorResource::collection($vendors)], "Vendors retrived successfully");
    }
    










}