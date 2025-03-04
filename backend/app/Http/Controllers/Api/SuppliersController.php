<?php

namespace App\Http\Controllers\Api;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\SupplierResource;
use App\Http\Requests\StoreSupplierRequest;
use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\UpdateSupplierRequest;

 /**
     * @group Supplier Management.
    */
 
class SuppliersController extends BaseController
{
    /**
     * All Suppliers.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Supplier::query();

        if ($request->query('search')) {
            $searchTerm = $request->query('search');
    
            $query->where(function ($query) use ($searchTerm) {
                $query->where('supplier', 'like', '%' . $searchTerm . '%');
            });
        }

        if ($request->query('categoryId')) {
            $categoryId = $request->query('categoryId');
            $query->where('product_category_id', $categoryId);
        }

        $suppliers = $query->paginate(9);

        return $this->sendResponse(["Suppliers"=>SupplierResource::collection($suppliers),
        'pagination' => [
            'current_page' => $suppliers->currentPage(),
            'last_page' => $suppliers->lastPage(),
            'per_page' => $suppliers->perPage(),
            'total' => $suppliers->total(),
        ]], "Suppliers retrived successfully");
        
    }

    /**
     * Store Supplier.
     * @bodyParam supplier string The name of the Supplier.
     * @bodyParam supplier_type string The type of the Supplier.
     * @bodyParam street_address string The street address of the Supplier.
     * @bodyParam area string The area of the Supplier.
     * @bodyParam city string The city of the Supplier.
     * @bodyParam state string The state of the Supplier.
     * @bodyParam pincode string The pincode of the Supplier.
     * @bodyParam country string The country of the Supplier.
     * @bodyParam gstin string The gstin of the Supplier.
     * @bodyParam contact_name string The contact number of the Supplier.
     * @bodyParam department string The department of the Supplier.
     * @bodyParam location string The location of the Supplier.
     * @bodyParam mobile_1 string The mobile 1 of the Supplier.
     * @bodyParam mobile_2 string The mobile 2 of the Supplier.
     * @bodyParam email string The email of the Supplier.
     * @bodyParam alternate_email string The Alternate Email of the Supplier.

     */
    public function store(StoreSupplierRequest $request): JsonResponse
    {
        $suppliers = new Supplier();
        $suppliers->supplier = $request->input("supplier");
        $suppliers->supplier_type = $request->input("supplier_type");
        $suppliers->product_category_id = $request->input("product_category_id");
        $suppliers->street_address = $request->input("street_address");
        $suppliers->area = $request->input("area");
        $suppliers->city = $request->input("city");
        $suppliers->state = $request->input("state");
        $suppliers->pincode = $request->input("pincode");
        $suppliers->country = $request->input("country");
        $suppliers->gstin = $request->input("gstin");
        $suppliers->contact_name = $request->input("contact_name");
        $suppliers->department = $request->input("department");
        $suppliers->location = $request->input("location");
        $suppliers->mobile_1 = $request->input("mobile_1");
        $suppliers->mobile_2 = $request->input("mobile_2");
        $suppliers->email = $request->input("email"); 
        $suppliers->alternate_email = $request->input("alternate_email");
        $suppliers->save();

        return $this->sendResponse(["Suppliers"=> new SupplierResource($suppliers)], 'Supplier Stored Successfully');

    }

    /**
     * Show Suppliers.
     */
    public function show(string $id): JsonResponse
    {
        $suppliers = Supplier::find($id);
        if(!$suppliers){
            return $this->sendError("Suppliers not found", ['error'=>'Suppliers not found']);
        }
        
        return $this->sendResponse(["Supplier"=> new SupplierResource($suppliers)], 'Supplier retrived Successfully');
    }

    /**
     * Update Suppliers.   
     * @bodyParam supplier string The name of the Supplier.
     * @bodyParam supplier_type string The type of the Supplier.
     * @bodyParam street_address string The street address of the Supplier.
     * @bodyParam area string The area of the Supplier.
     * @bodyParam city string The city of the Supplier.
     * @bodyParam state string The state of the Supplier.
     * @bodyParam pincode string The pincode of the Supplier.
     * @bodyParam country string The country of the Supplier.
     * @bodyParam gstin string The gstin of the Supplier.
     * @bodyParam contact_name string The contact number of the Supplier.
     * @bodyParam department string The department of the Supplier.
     * @bodyParam location string The location of the Supplier.
     * @bodyParam mobile_1 string The mobile 1 of the Supplier.
     * @bodyParam mobile_2 string The mobile 2 of the Supplier.
     * @bodyParam email string The email of the Supplier.
     * @bodyParam alternate_email string The Alternate Email of the Supplier.
     */
    public function update(UpdateSupplierRequest $request, string $id): JsonResponse
    {
        // Find the existing supplier
        $suppliers = Supplier::find($id);
    
        if (!$suppliers) {
            return $this->sendError("Supplier not found", ['error' => 'Supplier not found']);
        }
    
        // Update the supplier properties
        $suppliers->supplier = $request->input("supplier");
        $suppliers->supplier_type = $request->input("supplier_type");
        $suppliers->product_category_id = $request->input("product_category_id");
        $suppliers->street_address = $request->input("street_address");
        $suppliers->area = $request->input("area");
        $suppliers->city = $request->input("city");
        $suppliers->state = $request->input("state");
        $suppliers->pincode = $request->input("pincode");
        $suppliers->country = $request->input("country");
        $suppliers->gstin = $request->input("gstin");
        $suppliers->contact_name = $request->input("contact_name");
        $suppliers->department = $request->input("department");
        $suppliers->location = $request->input("location");
        $suppliers->mobile_1 = $request->input("mobile_1");
        $suppliers->mobile_2 = $request->input("mobile_2");
        $suppliers->email = $request->input("email");
        $suppliers->alternate_email = $request->input("alternate_email");
    
        // Save the updated supplier
        $suppliers->save();
    
        return $this->sendResponse(["Supplier" => new SupplierResource($suppliers)], 'Supplier Updated Successfully');
    }
    
    /**
     * Destroy Suppliers.
     */
    public function destroy(string $id): JsonResponse
    {
        $suppliers = Supplier::find($id);
        if(!$suppliers){
            return $this->sendError("Supplier not found", ['error'=>'Supplier not found']);
        }
        $suppliers->delete();
        return $this->sendResponse([], 'Supplier Deleted Successfully');

    }

     /**
     * Fetch All Suppliers.
     */
    public function allSuppliers(): JsonResponse
    {
        $suppliers = Supplier::all();

        return $this->sendResponse(["Suppliers"=>SupplierResource::collection($suppliers),
        ], "Suppliers retrived successfully");

    }
    
}