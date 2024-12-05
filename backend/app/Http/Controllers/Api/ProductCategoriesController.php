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
        $productCategories = ProductCategory::all();
        return $this->sendResponse(['ProductCategories'=> ProductCategoryResource::collection($productCategories)], "Product Category retrived successfuly");

    }

    /**
     * Store Product Category.
     */
    public function store(Request $request): JsonResponse
    {
        $productCategory = new ProductCategory();
        $productCategory->name = $request->input("name");
        $productCategory->save();
        return $this->sendResponse(['ProductCategory'=> new ProductCategoryResource($productCategory)], "Product Category Stored successfuly");

    }

    /**
     * Display Product Category.
     */
    public function show(string $id): JsonResponse
    {
        $productCategory = ProductCategory::find($id);
        if(!$productCategory){
            return $this->sendError("Product Category not found.", ['Error'=> "Product Category not found"]);
        }
        return $this->sendResponse(['ProductCategory'=> new ProductCategoryResource($productCategory)], "Product Category retrived successfuly");

    }

    /**
     * Update Product Category.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $productCategory = ProductCategory::find($id);
        if(!$productCategory){
            return $this->sendError("Product Category not found.", ['Error'=> "Product Category not found"]);
        }
        $productCategory->name = $request->input("name");
        $productCategory->save();
        return $this->sendResponse(['ProductCategory'=> new ProductCategoryResource($productCategory)], "Product Category Updated successfuly");
         
    }

    /**
     * Remove Product Category.
     */
    public function destroy(string $id): JsonResponse
    {
        $productCategory = ProductCategory::find($id);
        if(!$productCategory){
            return $this->sendError("Product Category not found.", ['Error'=> "Product Category not found"]);
        }
         $productCategory->delete();
         return $this->sendResponse([], "Product Category Deleted successfuly");
    }
}