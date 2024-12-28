<?php

namespace App\Http\Controllers\Api;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\InvoiceResource;
use App\Http\Controllers\Api\BaseController;

class InvoicesController extends BaseController
{
    /**
     * All Invoices.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Invoice::with("invoiceDetails.product"); 
        if ($request->query('search')) {
            $searchTerm = $request->query('search');
            $query->where(function ($query) use ($searchTerm) {
                $query->where('invoice_number', 'like', '%' . $searchTerm . '%'
                 ->orWhere('dispatch_details', 'like', '%'.$searchTerm.'%'));
            });
        }

        $invoices = $query->paginate(50);

        return $this->sendResponse(["Invoices"=>InvoiceResource::collection($invoices),
        'pagination' => [
            'current_page' => $invoices->currentPage(),
            'last_page' => $invoices->lastPage(),
            'per_page' => $invoices->perPage(),
            'total' => $invoices->total(),
        ]], "Invoices retrieved successfully");
        
    }

    
}