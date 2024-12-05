<?php

namespace App\Http\Controllers\Api;

use App\Models\Company;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CompaniesController extends Controller
{
    /**
     * Display Company.
     */
    public function index(): JsonResponse
    {
        $products = Company::all();
        return $this->sendResponse(['Products'=> ProductResource::collection($products)], "Products retrived successfuly");

    }

    /**
     * Store Company.
     */
    public function store(Request $request): JsonResponse
    {
        $product = new Company();
        $product->product_category_id = $request->input("category_id");
        $product->name = $request->input("name");
        $product->brand = $request->input("brand");
        $product->save();
        return $this->sendResponse(['Company'=> new ProductResource($product)], "Company Stored successfuly");

    }

    /**
     * Display Company.
     */
    public function show(string $id): JsonResponse
    {
        $product = Company::find($id);
        if(!$product){
            return $this->sendError("Company not found.", ['Error'=> "Company not found"]);
        }
        return $this->sendResponse(['Company'=> new ProductResource($product)], "Company retrived successfuly");

    }

    /**
     * Update Company.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $product = Company::find($id);
        if(!$product){
            return $this->sendError("Company not found.", ['Error'=> "Company not found"]);
        }

        $product->product_category_id = $request->input("category_id");
        $product->name = $request->input("name");
        $product->brand = $request->input("brand");
        $product->save();
        return $this->sendResponse(['Company'=> new ProductResource($product)], "Company Updated successfuly");
         
    }

    /**
     * Remove Company.
     */
    public function destroy(string $id): JsonResponse
    {
        $product = Company::find($id);
        if(!$product){
            return $this->sendError("Company not found.", ['Error'=> "Company not found"]);
        }
         $product->delete();
         return $this->sendResponse([], "Company Deleted successfuly");
    }
}