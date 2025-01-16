<?php

namespace App\Http\Controllers\Api;

use File;
use Response;
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
                $query->where('invoice_number', 'like', '%' . $searchTerm . '%')
                 ->orWhere('dispatch_details', 'like', '%'.$searchTerm.'%');
            });
        }

        $invoices = $query->paginate(9);

        return $this->sendResponse(["Invoices"=>InvoiceResource::collection($invoices),
        'Pagination' => [
            'current_page' => $invoices->currentPage(),
            'last_page' => $invoices->lastPage(),
            'per_page' => $invoices->perPage(),
            'total' => $invoices->total(),
        ]], "Invoices retrieved successfully");
        
    }

    /**
     * Update Invoice.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        // Find the existing supplier
        $invoice = Invoice::find($id);
    
        if (!$invoice) {
            return $this->sendError("Invoice not found", ['error' => 'Invoice not found']);
        }
    
        // Update the supplier properties
        $invoice->dispatch_details = $request->input("dispatch_details");
        $invoice->payment_information = $request->input("payment_information");
        
        $invoice->save();
    
        return $this->sendResponse(["Invoice" => new InvoiceResource($invoice)], 'Invoice Updated Successfully');
    }
    

     /**
     * Show Invoice.
     */
    public function show(string $id): JsonResponse
    {
        $invoice = Invoice::find($id);
        if(!$invoice){
            return $this->sendError("Invoice not found", ['error'=>['Invoice not found']]);
        }
        
        return $this->sendResponse(["Invoice"=> new InvoiceResource($invoice)], 'Invoice retrieved Successfully');
    }

    public function showInvoice(string $files)
    {
        // Generate the full path to the invoice in the public storage
        $path = storage_path('app/public/Lead/generated_invoices/'.$files);
    
        // Check if the file exists
        if (!file_exists($path)) {
            return $this->sendError("Invoice not found", ['error'=>['Invoice not found. Generate invoice again.']]);
        }
    
        // Get the file content and MIME type
        $fileContent = File::get($path);
        $mimeType = \File::mimeType($path);
    
        // Create the response for the file download
        $response = Response::make($fileContent, 200);
        $response->header("Content-Type", $mimeType);
        $response->header('Content-Disposition', 'inline; filename="' . $files . '"'); // Set attachment to force download
     //to download the invoice change 'Content-Deposition to attachment from inline
        return $response;
    }

    
}