<?php

namespace App\Http\Controllers\Api;

use App\Models\ProductCategories;
use Illuminate\Http\Request;
use App\Models\ProductCategory;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Controllers\Api\BaseController;
use App\Http\Resources\ProductCategoryResource;
use App\Http\Requests\StoreProductCategoryRequest;
use App\Http\Requests\UpdateProductCategoryRequest;

   /**
     * @group Product Category Management
     */
    
class ProductCategoriesController extends BaseController
{
    /**
     * All Product Category.
     */
    public function index(Request $request): JsonResponse
    {
        $query = ProductCategory::query();

        if ($request->query('search')) {
            $searchTerm = $request->query('search');
    
            $query->where(function ($query) use ($searchTerm) {
                $query->where('product_category', 'like', '%' . $searchTerm . '%');
            });
        }
        $product_categories = $query->paginate(5);

        return $this->sendResponse(["ProductCategories"=>ProductCategoryResource::collection($product_categories),
        'pagination' => [
            'current_page' => $product_categories->currentPage(),
            'last_page' => $product_categories->lastPage(),
            'per_page' => $product_categories->perPage(),
            'total' => $product_categories->total(),
        ]], "Product Categories retrived successfully");

    }

    /**
     * Store Product Category.
     * @bodyParam product_category string The name of the product category.
     */
    public function store(StoreProductCategoryRequest $request): JsonResponse
    {
        $productCategory = new ProductCategory();
        $productCategory->product_category = $request->input("product_category");
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
     * @bodyParam product_category string The name of the product category.
     */
    public function update(UpdateProductCategoryRequest $request, string $id): JsonResponse
    {
        $productCategory = ProductCategory::find($id);
        if(!$productCategory){
            return $this->sendError("Product Category not found.", ['Error'=> "Product Category not found"]);
        }
        $productCategory->product_category = $request->input("product_category");
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