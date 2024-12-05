<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\ProductCategory;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\BaseController;
use App\Http\Resources\ProductCategoryResource;

class ProductCategoriesController extends BaseController
{
    /**
     * Display Product Category.
     */
    public function index(): JsonResponse
    {
        $products = ProductCategory::all();
        return $this->sendResponse(['ProductCategories'=> ProductCategoryResource::collection($products)], "Product Category retrived successfuly");

    }

    /**
     * Store Product Category.
     */
    public function store(Request $request): JsonResponse
    {
        $product = new ProductCategory();
        $product->product_category_id = $request->input("category_id");
        $product->name = $request->input("name");
        $product->brand = $request->input("brand");
        $product->save();
        return $this->sendResponse(['ProductCategory'=> new ProductCategoryResource($product)], "Product Category Stored successfuly");

    }

    /**
     * Display Product Category.
     */
    public function show(string $id): JsonResponse
    {
        $product = ProductCategory::find($id);
        if(!$product){
            return $this->sendError("Product Category not found.", ['Error'=> "Product Category not found"]);
        }
        return $this->sendResponse(['ProductCategory'=> new ProductCategoryResource($product)], "Product Category retrived successfuly");

    }

    /**
     * Update Product Category.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $product = ProductCategory::find($id);
        if(!$product){
            return $this->sendError("Product Category not found.", ['Error'=> "Product Category not found"]);
        }

        $product->product_category_id = $request->input("category_id");
        $product->name = $request->input("name");
        $product->brand = $request->input("brand");
        $product->save();
        return $this->sendResponse(['ProductCategory'=> new ProductCategoryResource($product)], "Product Category Updated successfuly");
         
    }

    /**
     * Remove Product Category.
     */
    public function destroy(string $id): JsonResponse
    {
        $product = ProductCategory::find($id);
        if(!$product){
            return $this->sendError("Product Category not found.", ['Error'=> "Product Category not found"]);
        }
         $product->delete();
         return $this->sendResponse([], "Product Category Deleted successfuly");
    }
}