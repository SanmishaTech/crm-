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

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\IOFactory;


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
        $product_categories = $query->orderBy('id', 'DESC')->paginate(9);

        return $this->sendResponse(["ProductCategories"=>ProductCategoryResource::collection($product_categories),
        'Pagination' => [
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

     /**
     * Fetch All Products.
     */
    public function allProductCategories(): JsonResponse
    {
        $product_categories = ProductCategory::all();

        return $this->sendResponse(["ProductCategories"=>ProductCategoryResource::collection($product_categories),
        ], "Product Categories retrived successfully");

    }

    /**
     * Download Excel Template for Product Categories.
     */
    public function downloadTemplate()
    {
        if (ob_get_level()) ob_end_clean();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        
        // Set Headers
        $headers = ['Category Name'];
        $sheet->fromArray($headers, null, 'A1');

        $writer = new Xlsx($spreadsheet);
        $fileName = 'Product_Category_Template.xlsx';
        
        return response()->streamDownload(function () use ($writer) {
            $writer->save('php://output');
        }, $fileName, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }

    /**
     * Import Product Categories from Excel.
     */
    public function importData(Request $request): JsonResponse
    {
        $request->validate(['file' => 'required|mimes:xlsx,xls,csv|max:4096']);

        try {
            $file = $request->file('file');
            $spreadsheet = IOFactory::load($file->getRealPath());
            $rows = $spreadsheet->getActiveSheet()->toArray();
            
            unset($rows[0]); // Skip Header
            $count = 0;

            foreach ($rows as $row) {
                if (empty(array_filter($row))) continue;

                $categoryName = trim($row[0]);
                if (empty($categoryName)) continue;

                // Find or create the category (case-insensitive check)
                $exists = ProductCategory::whereRaw('LOWER(product_category) = ?', [strtolower($categoryName)])->exists();
                
                if (!$exists) {
                    ProductCategory::create(['product_category' => $categoryName]);
                    $count++;
                }
            }

            return $this->sendResponse([], "$count records imported successfully.");
        } catch (\Exception $e) {
            return $this->sendError("Import failed.", ['Error' => $e->getMessage()]);
        }
    }
}