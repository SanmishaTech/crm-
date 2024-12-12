<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Controllers\Api\BaseController;

   /**
     * @group Product Management
     */
    
class ProductsController extends BaseController
{
    /**
     * All Products.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::query();

        if ($request->query('search')) {
            $searchTerm = $request->query('search');
    
            $query->where(function ($query) use ($searchTerm) {
                $query->where('department_name', 'like', '%' . $searchTerm . '%');
            });
        }
        $products = $query->paginate(5);

        return $this->sendResponse(["Product"=>ProductResource::collection($products),
        'pagination' => [
            'current_page' => $products->currentPage(),
            'last_page' => $products->lastPage(),
            'per_page' => $products->perPage(),
            'total' => $products->total(),
        ]], "Products retrived successfully");

    }

    /**
     * Store Product.
     * @bodyParam product_category_id string The id of the product category.
     * @bodyParam supplier_id string The id of the supplier.
     * @bodyParam product string The name of the product.
     * @bodyParam model string The name of the model.
     * @bodyParam manufacturer string The name of the manufacturer.
     * @bodyParam opening_qty string The value of the opening quantity.
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = new Product();
        $product->product_category_id = $request->input("product_category_id");
        $product->supplier_id = $request->input("supplier_id");
        $product->product = $request->input("product");
        $product->model = $request->input("model");
        $product->manufacturer = $request->input("manufacturer");
        $product->opening_qty = $request->input("opening_qty");
        //$product->closing_qty = $request->input("closing_qty");
        //$product->last_traded_price = $request->input("last_traded_price");
        $product->save();
        return $this->sendResponse(['Product'=> new ProductResource($product)], "Product Stored successfuly");

    }

    /**
     * Show Product.
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
     * @bodyParam product_category_id string The id of the product category.
     * @bodyParam supplier_id string The id of the supplier.
     * @bodyParam product string The name of the product.
     * @bodyParam model string The name of the model.
     * @bodyParam manufacturer string The name of the manufacturer.
     * @bodyParam opening_qty string The value of the opening quantity.
     */
    public function update(UpdateProductRequest $request, string $id): JsonResponse
    {
        $product = Product::find($id);
        if(!$product){
            return $this->sendError("Product not found.", ['Error'=> "Product not found"]);
        }

        $product->product_category_id = $request->input("product_category_id");
        $product->supplier_id = $request->input("supplier_id");
        $product->product = $request->input("product");
        $product->model = $request->input("model");
        $product->manufacturer = $request->input("manufacturer");
        $product->opening_qty = $request->input("opening_qty");
        // $product->closing_qty = $request->input("closing_qty");
        // $product->last_traded_price = $request->input("last_traded_price");
        $product->save();
        return $this->sendResponse(['Product'=> new ProductResource($product)], "Product Updated successfuly");
         
    }

    /**
     * Destroy Product.
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