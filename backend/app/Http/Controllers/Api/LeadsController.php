<?php

namespace App\Http\Controllers\Api;

use Log;
use File;
use Response;
use Mpdf\Mpdf;
use Carbon\Carbon;
use App\Models\Lead;
// 
use App\Models\Invoice;
use App\Models\Product;
use Barryvdh\DomPDF\PDF;
use App\Models\LeadProduct;
use App\Models\StockLedger;
use Illuminate\Http\Request;
use App\Models\InvoiceDetail;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\LeadResource;
use App\Http\Requests\StoreLeadRequest;
use App\Http\Resources\ContactResource;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\UpdateLeadRequest;
use App\Http\Controllers\Api\BaseController;

    /**
     * @group Lead Management
     */
    
class LeadsController extends BaseController
{
    protected $quotation;

    public function __construct(PDF $quotation)
    {
        $this->quotation = $quotation;
    }
    

    public static function generateLeadNumber(): string
    {
        // Find the latest profile number for the current month and year
        $latestNumber = Lead::where('lead_number', 'like', date('my') . '%')
                        ->orderBy('lead_number', 'DESC')
                        ->first();

        // Increment the numeric part of the profile number
        $lastNumber = 1;

        if ($latestNumber) {
            $lastNumber = intval(substr($latestNumber->lead_number, 4)) + 1;
        }
        return date('my') . str_pad($lastNumber, 3, '0', STR_PAD_LEFT);
    }

    public static function generateInvoiceNumber(): string
    {
        // Find the latest profile number for the current month and year
        $latestNumber = Invoice::where('invoice_number', 'like', "I". date('my') . '%')
                        ->orderBy('invoice_number', 'DESC')
                        ->first();

        // Increment the numeric part of the profile number
        $lastNumber = 1;

        if ($latestNumber) {
            $lastNumber = intval(substr($latestNumber->invoice_number, 5)) + 1;
        }
        return "I". date('my') . str_pad($lastNumber, 3, '0', STR_PAD_LEFT);
    }

    public static function generateQuotationNumber(): string
    {
        // Find the latest profile number for the current month and year
        $latestNumber = Lead::where('quotation_number', 'like', "Q". date('my') . '%')
                        ->orderBy('quotation_number', 'DESC')
                        ->first();

        // Increment the numeric part of the profile number
        $lastNumber = 1;

        if ($latestNumber) {
            $lastNumber = intval(substr($latestNumber->quotation_number, 5)) + 1;
        }
        return  "Q".date('my') . str_pad($lastNumber, 3, '0', STR_PAD_LEFT);
    }
    
    /**
     * All Leads .
     */
    // public function index(Request $request): JsonResponse
    // {
    //     $query = Lead::query();
    //     if ($request->query('search')) {
    //         $searchTerm = $request->query('search');
    //         $query->where(function ($query) use ($searchTerm) {
    //             $query->where('lead_owner', 'like', '%' . $searchTerm . '%'
    //              ->orWhere('lead_status', 'like', '%'.$searchTerm.'%'));
    //         });
    //     }

    //     $leads = $query->paginate(9);

    //     return $this->sendResponse(["Lead"=>LeadResource::collection($leads),
    //     'pagination' => [
    //         'current_page' => $leads->currentPage(),
    //         'last_page' => $leads->lastPage(),
    //         'per_page' => $leads->perPage(),
    //         'total' => $leads->total(),
    //     ]], "Leads retrieved successfully");
    // }

    public function index(Request $request): JsonResponse
    {
        $query = Lead::with(['contact', 'employee', 'leadProducts']);
        if ($request->query('searchTerm')) {
            $searchTerm = $request->query('searchTerm');
        
            $query->where(function ($query) use ($searchTerm) {
                $query->where('lead_owner', 'like', '%' . $searchTerm . '%')
                    ->orWhere('lead_number', 'like', '%' . $searchTerm . '%')
                    // Search in the contact_name of the related contact table
                    ->orWhereHas('contact', function ($query) use ($searchTerm) {
                        $query->where('contact_person', 'like', '%' . $searchTerm . '%');
                    });
            });
        }

        if ($request->query('leadStatus')) {
            // dd($request->query('leadStatus'));
            $leadStatus = $request->query("leadStatus");
        
            $query->where(function ($query) use ($leadStatus) {
                $query->where('lead_status', 'like', '%' . $leadStatus . '%');
            });
        }
        
          // If there are product filters (product_ids array), filter by related products
        if ($request->query('productIds')) {
           $productIds = $request->query('productIds'); // Get the array of product IDs
        
           // Filter the leads by related products (assuming the relationship is leadProducts)
            $query->whereHas('leadProducts', function ($query) use ($productIds) {
            $query->whereIn('product_id', $productIds); // assuming 'product_id' is the foreign key in leadProducts
            });
        }

      
    
        $leads = $query->paginate(9);
    
        return $this->sendResponse([
            "Lead" => LeadResource::collection($leads),
            'pagination' => [
                'current_page' => $leads->currentPage(),
                'last_page' => $leads->lastPage(),
                'per_page' => $leads->perPage(),
                'total' => $leads->total(),
            ]
        ], "Leads retrieved successfully");
    }

    /**
     * Store Lead.
     * @bodyParam lead_source string The Source of the lead.
     * @bodyParam lead_status string The Status of the Lead.
     * @bodyParam contact_id string The id of the contact.
     */
    public function store(StoreLeadRequest $request): JsonResponse
    {

        $products = $request->input('products');
        if(!$products){
            return $this->sendError("Products not found", ['error'=>['Products not found']]);

        }
        $employee = auth()->user()->employee;
        $lead = new Lead();
        $lead->employee_id = $employee->id;
        $lead->contact_id = $request->input("contact_id");
        $lead->lead_number = $this->generateLeadNumber();
        $lead->lead_owner = $employee->employee_name;
        $lead->lead_type = $request->input("lead_type");
        $lead->tender_number = $request->input("tender_number");
        $lead->portal = $request->input("portal");
        $lead->tender_category = $request->input("tender_category");
        $lead->emd = $request->input("emd");
        $lead->bid_end_date = $request->input("bid_end_date");
        $lead->tender_status = $request->input("tender_status");
        $lead->lead_source = $request->input("lead_source");
          if(config("data.lead_status.Open") === $request->input("lead_status") || config("data.lead_status.In Progress") === $request->input("lead_status")){
        $lead->lead_status = $request->input("lead_status");
        }
        $lead->save();

        $totalAmountWithoutGst = 0;
        $totalGstAmount = 0;
        $totalAmountWithGst = 0;    

        
            // Prepare the product details for insertion
        $productDetails = [];
        foreach ($products as $product) {
            $PRODUCT = Product::find($product['product_id']);
            // if ($product['quantity'] > $PRODUCT->opening_quantity) {
            //     return $this->sendError("Insufficient stock for product: ", ['error'=>['Insufficient stock for product ']]);
            // }
            if($PRODUCT){
            $gstRate = $PRODUCT->gst_rate; 
            $amountWithoutGst = $product['quantity'] * $product['rate'];
            $gstAmount = ($amountWithoutGst * $gstRate) / 100;
            $totalAmount = $amountWithoutGst + $gstAmount;
            // 
            $totalAmountWithoutGst += $amountWithoutGst;
            $totalGstAmount += $gstAmount;
            $totalAmountWithGst += $totalAmount;
        $productDetails[] = new LeadProduct([
            'product_id' => $product['product_id'],
            'quantity' => $product['quantity'],
             'rate' => $product['rate'],
            'gst_rate' => $gstRate,
            'amount_without_gst' => $amountWithoutGst,
            'gst_amount' => $gstAmount,
            'total_amount' => $totalAmount,
             ]);
            }
            else{
               return $this->sendError("Product not found", ['error'=>['Product not found']]);
            }
          }
            //one to many relatonship for stroing products and for fetching
         $lead->leadProducts()->saveMany($productDetails);
        
        $lead->total_taxable = $totalAmountWithoutGst;
        $lead->total_gst = $totalGstAmount;
        $lead->total_amount_with_gst = $totalAmountWithGst;
        $lead->save();
        return $this->sendResponse(['Lead'=> new LeadResource($lead)], 'Lead Created Successfully');
    }
    

     /**
     * Update Lead.
     * @bodyParam lead_source string The Source of the lead.
     * @bodyParam lead_status string The Status of the Lead.
     * @bodyParam contact_id string The id of the contact.
     */
    public function update(UpdateLeadRequest $request, String $id): JsonResponse
    {

        $productsString = $request->input('products');
        $products = json_decode($productsString, true); 

          if(!$products)
         {
            return $this->sendError("Products not found", ['error'=>['Products not found']]);

        }
        
        $employee = auth()->user()->employee;
        $lead = Lead::find($id);
        //   $lead = Lead::with(['leadProducts', 'employee', 'followUp', 'contact'])->find($id);
        if(!$lead){
            return $this->sendError("Lead not found", ['error'=>['lead not found']]);
        }

        if($request->hasFile('lead_attachment')){
            if(!empty($lead->lead_attachment) && Storage::exists('public/Lead/lead_attachments/'.$lead->lead_attachment)) {
                Storage::delete('public/Lead/lead_attachments/'.$lead->lead_attachment);
            }
            $quotationFileNameWithExtention = $request->file('lead_attachment')->getClientOriginalName();
            $quotationFilename = pathinfo($quotationFileNameWithExtention, PATHINFO_FILENAME);
            $fileExtention = $request->file('lead_attachment')->getClientOriginalExtension();
            $quotationFileNameToStore = $quotationFilename.'_'.time().'.'.$fileExtention;
            $quotationFilePath = $request->file('lead_attachment')->storeAs('public/Lead/lead_attachments', $quotationFileNameToStore);
        }
    
        $lead->contact_id = $request->input("contact_id");
        $lead->lead_type = $request->input("lead_type");
        $lead->tender_number = $request->input("tender_number");
        $lead->portal = $request->input("portal");
        $lead->tender_category = $request->input("tender_category");
        $lead->bid_end_date = $request->input("bid_end_date");
        $lead->tender_status = $request->input("tender_status");
        $lead->emd = $request->input("emd");
        $lead->lead_source = $request->input("lead_source");
        $lead->lead_status = $request->input("lead_status");
        $lead->lead_closing_reason = $request->input("lead_closing_reason");
        $lead->deal_details = $request->input("deal_details");

        if($request->hasFile('lead_attachment')){
            $lead->lead_attachment = $quotationFileNameToStore;
         } 
        $lead->save();

        $totalAmountWithoutGst = 0;
        $totalGstAmount = 0;
        $totalAmountWithGst = 0;    
        
        $previousProducts = LeadProduct::where("lead_id",$lead->id)->delete();
        // $products = $request->input('products');
        // dd($products);
      
            
        $productDetails = [];
        foreach ($products as $product) {
            $PRODUCT = Product::find($product['product_id']);
            if($PRODUCT){
            $gstRate = $PRODUCT->gst_rate; 
            
            $amountWithoutGst = $product['quantity'] * $product['rate'];
            $gstAmount = ($amountWithoutGst * $gstRate) / 100;
            $totalAmount = $amountWithoutGst + $gstAmount;
            // 
            $totalAmountWithoutGst += $amountWithoutGst;
            $totalGstAmount += $gstAmount;
            $totalAmountWithGst += $totalAmount;
         $productDetails[] = new LeadProduct([
            'product_id' => $product['product_id'],
            'quantity' => $product['quantity'],
            'rate' => $product['rate'],
            'gst_rate' => $gstRate,
            'amount_without_gst' => $amountWithoutGst,
            'gst_amount' => $gstAmount,
            'total_amount' => $totalAmount,
             ]);
            }
            else{
               return $this->sendError("Product not found", ['error'=>['Product not found']]);
            }
        }
             $lead->leadProducts()->saveMany($productDetails);
    
        $lead->total_taxable = $totalAmountWithoutGst;
        $lead->total_gst = $totalGstAmount;
        $lead->total_amount_with_gst = $totalAmountWithGst;
        $lead->save();
        return $this->sendResponse(['Lead'=> new LeadResource($lead)], 'Lead Updated Successfully');
    }
    

    /**
     * Show Lead.
     */
     public function show(string $id): JsonResponse
      {
        $lead = Lead::find($id);
    //   $lead = Lead::with(['leadProducts', 'employee', 'followUp', 'contact'])->find($id);
        if(!$lead){
            return $this->sendError("Lead not found", ['error'=>['lead not found']]);
        }
        return $this->sendResponse(["Lead"=>new LeadResource($lead)], "Lead retrieved successfully");
        // return $this->sendResponse(["lead"=> $lead, 'contact'=>new ContactResource($lead->contact)], "Lead retrieved successfully");
      }

    /**
     * Destroy lead.
     */
    public function destroy(string $id): JsonResponse
    {
        $lead = lead::find($id);
        if(!$lead){
            return $this->sendError("lead not found", ['error'=>'lead not found']);
        }
        $lead->delete();
        return $this->sendResponse([], "Lead deleted successfully");
    }


     /**
     * Follow Up Types.
     */
    public function follow_up_types(): JsonResponse
    {
          $follow_up_types = config("data.follow_up_types");
        if(!$follow_up_types){
            return $this->sendError("Follow up Types not found", ['error'=>'Follow up Types not found']);
        }
        return $this->sendResponse(["FollowUpTypes"=>$follow_up_types], "Follow up Types retrived successfully");
    }

     /**
     * Lead Status.
     */
     public function leadStatus(string $id): JsonResponse
    {
          $lead_status = config("data.lead_status");
        if(!$lead_status){
            return $this->sendError("Lead Status not found", ['error'=>'Lead Status not found']);
        }
        return $this->sendResponse(["LeadStatus"=>$follolead_statusw_up_types], "Lead Status retrieved successfully");
    }

     /**
     * Close Lead.
     */
    public function closeLead(Request $request, string $id): JsonResponse
    {
        $lead = Lead::find($id);
         $leadStatus = config('data.lead_status.Closed');
        if(!$lead){
            return $this->sendError("Lead not found", ['error'=>['lead not found']]);
        }
            
        $lead->lead_status = $leadStatus;
        $lead->lead_closing_reason = $request->input("lead_closing_reason");
        $lead->save();

        return $this->sendResponse(["Lead"=>$lead], "Lead Status updated successfully");
    }


    public function generateQuotation(Request $request, string $id)
    {
        $leadStatus = config('data.lead_status.Quotation');
        $DealLeadStatus = config('data.lead_status.Deal');

        // $leads = Lead::with('leadProducts.product')->find($id);
        $leads = Lead::with(['leadProducts.product','contact.client','leadInvoice.invoiceDetails.product'])->find($id);
        
        if(!$leads){
            return $this->sendError("Lead not found", ['error'=>['Lead not found']]);
        }

        if($leadStatus !== $leads->lead_status && $DealLeadStatus !== $leads->lead_status)
        {
            return $this->sendError("Lead Status is not set to Quotation", ['error'=>['Lead Status is not set to Quotation']]);
        }
        if ($leads->leadProducts->isEmpty()) {
            return $this->sendError("Products not found", ['error'=>['Products not found to generate Quotation']]);

        }
        
        if($leads->total_amount_with_gst==0){
            return $this->sendError("Add the rates of Products", ['error'=>['Add the rates of Products to generate quotation']]);
        }
        
        if (!$leads->contact || !$leads->contact->client ) {
            return $this->sendError("Client not found", ['error'=>['Client not found to generate an Quotation']]);

        }
        if(!empty($leads->previous_lead_quotation) && Storage::exists('public/Lead/generated_quotations/'.$leads->previous_lead_quotation)) {
            Storage::delete('public/Lead/generated_quotations/'.$leads->previous_lead_quotation);
        }
        
        if(!empty($leads->lead_quotation) && Storage::exists('public/Lead/generated_quotations/'.$leads->lead_quotation)) {
            Storage::delete('public/Lead/generated_quotations/'.$leads->lead_quotation);
        }
      

        if(!$leads->quotation_date){
            $leads->quotation_date = now()->format("Y-m-d");
        }
        // if(!$leads->quotation_number){
        //     $leads->quotation_number = $this->generateQuotationNumber();
        // }
        $leads->quotation_number = $request->input("quotation_number");
        $leads->terms = $request->input("terms");
        $leads->lead_status  = $leadStatus;
        $leads->quotation_version = $leads->quotation_version + 1;
        $leads->save();
        // 
        $user = auth()->user();
        $employee = $user->employee->first();
    
        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }
        
        $data = [
            'user' => $user,
            'employee' => $employee,
            'leads' => $leads,
        ];

        // Render the Blade view to HTML
        $html = view('quotation.quotation', $data)->render();

        // Create a new mPDF instance
        $mpdf = new Mpdf();

        // Write HTML to the PDF
        $mpdf->WriteHTML($html);

        // Define the file path for saving the PDF
        $filePath = 'public/Lead/generated_quotations/quotation_' . time(). $user->id . '.pdf'; // Store in 'storage/app/invoices'
        $fileName = basename($filePath); // Extracts 'invoice_{timestamp}{user_id}.pdf'
      
        // Save PDF to storage
        Storage::put($filePath, $mpdf->Output('', 'S')); // Output as string and save to storage
        $leads->lead_quotation = $fileName;
        $leads->save();
        
        // Output the PDF for download
        return $mpdf->Output('quotation.pdf', 'D'); // Download the PDF
        // return $this->sendResponse([], "Quotation generated successfully");

    }

    public function generateInvoice(Request $request,string $id)
    {
        $leadStatus = config('data.lead_status.Deal');

        $leads = Lead::with(['leadProducts.product','contact.client','leadInvoice.invoiceDetails.product'])->find($id);
        if(!$leads){
            return $this->sendError("Lead not found", ['error'=>['Lead not found']]);
        }
        
         if($leadStatus !== $leads->lead_status)
        {
            return $this->sendError("Lead Status is not set to Deal", ['error'=>['Lead Status is not set to Deal']]);
        }
        if($leads->total_amount_with_gst==0){
            return $this->sendError("Add the rates of Products", ['error'=>['Add the rates of Products to generate invoice']]);
        }


        if ($leads->leadProducts->isEmpty()) {
            return $this->sendError("Products not found", ['error'=>['Products not found to generate an invoice']]);

        }
        
        if (!$leads->contact || !$leads->contact->client ) {
            return $this->sendError("Client not found", ['error'=>['Client not found to generate an invoice']]);

        }
        
        if(!empty($leads->lead_invoice) && Storage::exists('public/Lead/generated_invoices/'.$leads->lead_invoice)) {
            Storage::delete('public/Lead/generated_invoices/'.$leads->lead_invoice);
        }

        // dd
        $invoice = Invoice::find($leads->invoice_id);
        if(!$invoice){
             $invoice = new Invoice();
             $invoice->invoice_number = $this->generateInvoiceNumber();
            //  $invoice->invoice_date = now()->format("Y-m-d");
             $invoice->client_id = $leads->contact->client->id;
             $invoice->employee_id = $leads->employee_id;
             $invoice->amount = $leads->total_amount_with_gst;
             $invoice->save();

             $leads->invoice_id = $invoice->id;
             $leads->save();
        }
        else{
            $invoice->client_id = $leads->contact->client->id;
            $invoice->employee_id = $leads->employee_id;
             $invoice->amount = $leads->total_amount_with_gst;
             $invoice->save(); 
        }
          $leads->load('leadInvoice');  //solves the issue of invoice number displaying
            
      

        // invoiceDetail
        //     $previousInvoiceDetails = InvoiceDetail::where('invoice_id', $invoice->id)
        // ->whereHas('invoice', function ($query) {
        //     $query->where('employee_id', auth()->id());
        // })
        // ->delete();
        $now = Carbon::now()->toDateTimeString();  // This will give you '2024-12-31 09:50:36'        $previousInvoiceDetails = InvoiceDetail::where("invoice_id",$invoice->id)->delete();
        $previousStockLedgerDetails = StockLedger::where("foreign_key",$invoice->id)->delete();
        $previousInvoiceDetails = InvoiceDetail::where("invoice_id",$invoice->id)->delete();
        $leadProducts = $leads->leadProducts;
        $invoiceDetails =[];
        $StockLedgerDetails = [];
        $module = "Invoice";
        foreach ($leadProducts as $product) {
            
            $invoiceDetails[] = new InvoiceDetail([
                'product_id' => $product['product_id'],
                'quantity' => $product['quantity'],
                'rate' => $product['rate'],
                'gst_rate'=> $product['gst_rate'],
                'gst_amount' => $product['gst_amount'],
                'total_taxable_amount' => $product['amount_without_gst'],
                 ]);

            $StockLedgerDetails[] = new StockLedger([
                'product_id' => $product['product_id'],
                // 't_date' =>  $invoice->invoice_date,
                // 'received' => $product['rate'],
                'issued'=> $product['quantity'],
                'module' => $module,
                'foreign_key' => $invoice->id,
                'created_at' => $now,
                'updated_at' => $now,
                ]);
            // last traded price
            $ltpProduct = Product::find($product['product_id']);
            $ltpProduct->last_traded_price = $product['rate'];
            $ltpProduct->save();
        }
        $leads->invoice_number = $request->input("invoice_number");
        $leads->mode_of_payment = $request->input("mode_of_payment");
        $leads->ref_no = $request->input("ref_no");
        $leads->other_ref = $request->input("other_ref");
        $leads->buyer_order_no = $request->input("buyer_order_no");
        $leads->buyers_date = $request->input("buyers_date");
        $leads->invoice_terms = $request->input("invoice_terms");
        // if(!$leads->invoice_date){
        //     $leads->invoice_date = now()->format("d-m-Y");
        // }

        $invoice->invoiceDetails()->saveMany($invoiceDetails);
        // foreach ($stockLedgerDetails as $stockLedger) {
        //     $stockLedger->save();
        // }
        $stockLedger = StockLedger::insert(collect($StockLedgerDetails)->toArray());
        foreach ($leadProducts as $product) {
            StockLedger::calculateClosingQuantity($product['product_id']);
        }
        $user = auth()->user();
        $employee = $user->employee->first();
    
        if (!$employee) {
            return $this->sendError("Employee not found", ['error'=>['Employee not found']]);

        }
        
        
        $data = [
            'user' => $user,
            'employee' => $employee,
            'leads' => $leads,
        ];

        // Render the Blade view to HTML
        $html = view('invoice.invoice', $data)->render();

        // Create a new mPDF instance
        $mpdf = new Mpdf();

        // Write HTML to the PDF
        $mpdf->WriteHTML($html);

        // Define the file path for saving the PDF
        $filePath = 'public/Lead/generated_invoices/invoice_' . time(). $user->id . '.pdf'; // Store in 'storage/app/invoices'
        $fileName = basename($filePath); // Extracts 'invoice_{timestamp}{user_id}.pdf'
        $leads->lead_invoice = $fileName;
        $leads->save();
        $invoice->invoice_file = $fileName;
        $invoice->save();
        // Save PDF to storage
        Storage::put($filePath, $mpdf->Output('', 'S')); // Output as string and save to storage

        // Output the PDF for download
        return $mpdf->Output('invoice.pdf', 'D'); // Download the PDF
        // return $this->sendResponse([], "Invoice generated successfully");
    }

    
     /**
     * Show Lead Attachment File.
     */
    
    public function showLeadAttachment(string $files)
    {
        // Generate the full path to the invoice in the public storage
        $path = storage_path('app/public/Lead/lead_attachments/'.$files);
    
        // Check if the file exists
        if (!file_exists($path)) {
            return $this->sendError("Lead attachment file not found", ['error'=>['lead attachment file not found.']]);
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



    public function allLeads(): JsonResponse
    {
        $lead = Lead::all();

        return $this->sendResponse(["Lead"=>LeadResource::collection($lead),
        ], "Lead retrieved successfully");

    }




    // public function generateReport(Request $request)
    // {
    //      $leads = Lead::with(['contact', 'leadProducts.product'])->get();
        
    //     if($leads->isEmpty()){
    //         return $this->sendError("No leads found", ['error'=>['No leads found to generate report']]);
    //     }

    //     $user = auth()->user();
    //     $employee = $user->employee;

    //     if (!$employee) {
    //         return $this->sendError("Employee not found", ['error'=>['Employee not found']]);
    //     }
        
    //     $data = [
    //         'user' => $user,
    //         'employee' => $employee,
    //         'leads' => $leads,
    //     ];

    //      $html = view('reports.lead', $data)->render();

    //      $mpdf = new Mpdf([
    //         'margin_left' => 10,
    //         'margin_right' => 10,
    //         'margin_top' => 15,
    //         'margin_bottom' => 15,
    //     ]);

         
    //     $mpdf->WriteHTML($html);

    //      $fileName = 'leads_report_' . now()->format('Y_m_d_His') . '.pdf';

    //      return $mpdf->Output($fileName, 'D');
    // }

    public function generateReport(Request $request)
    {
    try {
        $query = Lead::with(['contact', 'leadProducts.product']);
        
        $from_date = $request->query('from_date');
        $to_date = $request->query('to_date');
        $type = $request->query('type', 'excel'); 
        $lead_status = $request->query('lead_status');

        if ($from_date) {
            $from_date = \Carbon\Carbon::parse($from_date)->startOfDay();
            $query->whereDate('created_at', '>=', $from_date);
        }

        if ($to_date) {
            $to_date = \Carbon\Carbon::parse($to_date)->endOfDay();
            $query->whereDate('created_at', '<=', $to_date);
        }

        if ($lead_status) {
            $query->where('lead_status', $lead_status);
        }

        $leads = $query->get();

        if ($leads->isEmpty()) {
            return $this->sendError("No leads found", ['error' => ['No leads found for the selected date range']]);
        }

        if ($type === 'pdf') {
            // Your existing PDF generation code
            $user = auth()->user();
            $employee = $user->employee;

            if (!$employee) {
                return $this->sendError("Employee not found", ['error'=>['Employee not found']]);
            }
            
            $data = [
                'user' => $user,
                'employee' => $employee,
                'leads' => $leads,
            ];

            $html = view('reports.lead', $data)->render();
            $mpdf = new Mpdf([
                'margin_left' => 10,
                'margin_right' => 10,
                'margin_top' => 15,
                'margin_bottom' => 15,
            ]);
            
            $mpdf->WriteHTML($html);
            $fileName = 'leads_report_' . now()->format('Y_m_d_His') . '.pdf';
            return $mpdf->Output($fileName, 'D');
        } else {
          // Create Spreadsheet
        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Set headers for the Excel file
        $sheet->setCellValue('A1', 'Contact Name');
        $sheet->setCellValue('B1', 'Products');
        $sheet->setCellValue('C1', 'Lead Type');
        $sheet->setCellValue('D1', 'Status');
        $sheet->setCellValue('E1', 'Follow-Up Date');
        $sheet->setCellValue('F1', 'Follow-Up Type');
        $sheet->setCellValue('G1', 'Remark');
        $sheet->setCellValue('H1', 'Created Date');

        // Style the header row
        $headerStyle = [
            'font' => ['bold' => true],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'E0E0E0']
            ]
        ];
        $sheet->getStyle('A1:H1')->applyFromArray($headerStyle);

        // Add data to the spreadsheet
        $row = 2;
        foreach ($leads as $lead) {
            $products = $lead->leadProducts->map(function($leadProduct) {
                return $leadProduct->product ? $leadProduct->product->name : '';
            })->filter()->join(', ');

            $sheet->setCellValue('A' . $row, $lead->contact->contact_person ?? 'N/A');
            $sheet->setCellValue('B' . $row, $lead->leadProducts->pluck('product.product')->filter()->join(', ') ?: 'N/A');
            $sheet->setCellValue('C' . $row, $lead->lead_type);
            $sheet->setCellValue('D' . $row, $lead->lead_status);
            $sheet->setCellValue('E' . $row, $lead->lead_follow_up_date ? $lead->lead_follow_up_date->format('d/m/Y (H:i)') : 'N/A');
            $sheet->setCellValue('F' . $row, $lead->follow_up_type ?? 'N/A');
            $sheet->setCellValue('G' . $row, $lead->follow_up_remark ?? 'N/A');
            $sheet->setCellValue('H' . $row, $lead->created_at->format('d/m/Y'));
            $row++;
        }

        // Auto-size columns
        foreach (range('A', 'H') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        // Create Excel file
        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);

        // Save to a temporary file
        $fileName = 'invoice_report_' . date('Y_m_d_His') . '.xlsx';
        $tempFile = tempnam(sys_get_temp_dir(), 'leads_report');
        $writer->save($tempFile);

        // Return the file as a download
        return response()->download($tempFile, $fileName, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])->deleteFileAfterSend(true);

    } 
      
        //else end

    } catch (\Exception $e) {
        \Log::error('Report Generation Error: ' . $e->getMessage());
        return $this->sendError("Error generating report", ['error' => $e->getMessage()]);
    }
}

   
    
}