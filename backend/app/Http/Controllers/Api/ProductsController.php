<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Http\Controllers\Api\BaseController;

class ProductsController extends BaseController
{
    /**
     * Display Product.
     */
    public function index(): JsonResponse
    {
        $products = Product::all();
        return $this->sendResponse(['Products'=> ProductResource::collection($products)], "Products retrived successfuly");

    }

    /**
     * Store Product.
     */
    public function store(Request $request): JsonResponse
    {
        $product = new Product();
        $product->product_category_id = $request->input("product_category_id");
        $product->name = $request->input("name");
        $product->brand = $request->input("brand");
        $product->save();
        return $this->sendResponse(['Product'=> new ProductResource($product)], "Product Stored successfuly");

    }

    /**
     * Display Product.
     */
    public function show(string $id): JsonResponse
    {
        $product = Product::find($id);
        if(!$product){
            return $this->sendError("Product not found.", ['Error'=> "Product not found"]);
        }
        return $this->sendResponse(['Product'=> new ProductResource($product)], "Product retrived successfuly");

    }

    /**
     * Update Product.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $product = Product::find($id);
        if(!$product){
            return $this->sendError("Product not found.", ['Error'=> "Product not found"]);
        }

        $product->product_category_id = $request->input("product_category_id");
        $product->name = $request->input("name");
        $product->brand = $request->input("brand");
        $product->save();
        return $this->sendResponse(['Product'=> new ProductResource($product)], "Product Updated successfuly");
         
    }

    /**
     * Remove Product.
     */
    public function destroy(string $id): JsonResponse
    {
        $product = Product::find($id);
        if(!$product){
            return $this->sendError("Product not found.", ['Error'=> "Product not found"]);
        }
         $product->delete();
         return $this->sendResponse([], "Product Deleted successfuly");
    }
}