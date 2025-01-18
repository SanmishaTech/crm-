<?php

namespace App\Http\Controllers\Api;

use App\Models\Purchase;
use Illuminate\Http\Request;
use App\Models\PurchaseDetail;
use App\Models\PurchaseProduct;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\PurchaseResource;
use App\Http\Controllers\Api\BaseController;
use App\Http\Resources\PurchaseDetailResource;

   /**
     * @group Purchase Management
     */
    
class PurchasesController extends BaseController
{

     /**
     * All Purchase.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Purchase::query();
        if ($request->query('search')) {
            $searchTerm = $request->query('search');
    
            $query->where(function ($query) use ($searchTerm) {
                $query->where('supplier_id', 'like', '%' . $searchTerm . '%')
               ->orWhere('payment_status', 'like', '%'. $searchTerm.'%');
               
            });
        }
        $purchases = $query->with(['purchaseDetails'])->paginate(9);
        
        return $this->sendResponse(["Purchases"=>PurchaseResource::collection($purchases),
        'pagination' => [
            'current_page' => $purchases->currentPage(),
            'last_page' => $purchases->lastPage(),
            'per_page' => $purchases->perPage(),
            'total' => $purchases->total(),
        ]], "Purchase details retrieved successfully");
    }
    

    /**
     * Purchase Products
     */
    
    public function purchase(Request $request): JsonResponse
    {
        $purchase = new Purchase();
        $purchase->employee_id = auth()->user()->employee->id;
        $purchase->supplier_id = $request->input("supplier_id");
        $purchase->payment_ref_no = $request->input("payment_ref_no");
        $purchase->payment_remarks = $request->input("payment_remarks");
        $purchase->is_paid = $request->input("is_paid");
        $purchase->payment_status = $request->input("payment_status");
        $purchase->invoice_no = $request->input("invoice_no");
        $purchase->invoice_date = $request->input("invoice_date");
        $purchase->total_cgst = $request->input("total_cgst");
        $purchase->total_sgst = $request->input("total_sgst");
        $purchase->total_igst = $request->input("total_igst");
        $purchase->total_tax_amount = $request->input("total_tax_amount");
        $purchase->total_amount = $request->input("total_amount");
        $purchase->save();

        $products = $request->input('products');

        // Prepare the product details for insertion
        $purchaseDetails = [];
        foreach ($products as $product) {
        $purchaseDetails[] = new PurchaseDetail([
            'product_id' => $product['product_id'],
            'quantity' => $product['quantity'],
            'rate' => $product['rate'],
            'cgst' => $product['cgst'],
            'sgst' => $product['sgst'],
            'igst' => $product['igst'],
            'pre_tax_amount' => $product['pre_tax_amount'],
            'post_tax_amount' => $product['post_tax_amount']
             ]);
          }

          // Attach the products to the purchase record (using one-to-many relation)
         $purchase->purchaseDetails()->saveMany($purchaseDetails);

         return $this->sendResponse(['Purchase'=> new PurchaseResource($purchase)], "Products Purchased Successfully");

    }

    /**
     * Show Purchase.
     */
    public function show(string $id): JsonResponse
    {
        // $employee_id = auth()->user()->employee->id; //for member role
        // $purchase = Purchase::with(['purchaseDetails'])
        //                     ->where('employee_id', $employee_id)
        //                     ->find($id);
        $purchase = Purchase::with(['purchaseDetails'])
            ->find($id);
        if(!$purchase){
            return $this->sendError("Purchase details not found", ['error'=>['Purchase details not found']]);
        }
        
        return $this->sendResponse(["Purchase"=>new PurchaseResource($purchase), 'PurchaseDetails'=> PurchaseDetailResource::collection($purchase->purchaseDetails)], "Purchase Details retrived successfully");
    }

    
}