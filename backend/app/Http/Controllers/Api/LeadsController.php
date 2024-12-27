<?php

namespace App\Http\Controllers\Api;

use Log;
use File;
use Response;
use Mpdf\Mpdf;
use App\Models\Lead;
use App\Models\Product;
// 
use Barryvdh\DomPDF\PDF;
use App\Models\LeadProduct;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\LeadResource;
use App\Http\Requests\StoreLeadRequest;
use App\Http\Resources\ContactResource;
use Illuminate\Support\Facades\Storage;
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
    
    /**
     * All Leads .
     */
    public function index(Request $request): JsonResponse
    {
        $query = Lead::query();
        if ($request->query('search')) {
            $searchTerm = $request->query('search');
            $query->where(function ($query) use ($searchTerm) {
                $query->where('lead_owner', 'like', '%' . $searchTerm . '%'
                 ->orWhere('lead_status', 'like', '%'.$searchTerm.'%'));
            });
        }

        $leads = $query->paginate(5);

        return $this->sendResponse(["Lead"=>LeadResource::collection($leads),
        'pagination' => [
            'current_page' => $leads->currentPage(),
            'last_page' => $leads->lastPage(),
            'per_page' => $leads->perPage(),
            'total' => $leads->total(),
        ]], "Leads retrieved successfully");
    }

    /**
     * Store Lead.
     * @bodyParam lead_source string The Source of the lead.
     * @bodyParam lead_status string The Status of the Lead.
     * @bodyParam contact_id string The id of the contact.
     */
    public function store(StoreLeadRequest $request): JsonResponse
    {
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

        $products = $request->input('products');
        if($products){
            // Prepare the product details for insertion
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
        }
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
    public function update(Request $request, String $id): JsonResponse
    {
        $employee = auth()->user()->employee;
        $lead = Lead::find($id);
        //   $lead = Lead::with(['leadProducts', 'employee', 'followUp', 'contact'])->find($id);
        if(!$lead){
            return $this->sendError("Lead not found", ['error'=>['lead not found']]);
        }

        if($request->hasFile('lead_attachment')){
            if(!empty($lead->lead_attachment) && Storage::exists('public/Lead/lead_attachment'.$lead->lead_attachment)) {
                Storage::delete('public/Lead/lead_attachment'.$lead->lead_attachment);
            }
            $quotationFileNameWithExtention = $request->file('lead_attachment')->getClientOriginalName();
            $quotationFilename = pathinfo($quotationFileNameWithExtention, PATHINFO_FILENAME);
            $fileExtention = $request->file('lead_attachment')->getClientOriginalExtension();
            $quotationFileNameToStore = $quotationFilename.'_'.time().'.'.$fileExtention;
            $quotationFilePath = $request->file('lead_attachment')->storeAs('public/Lead/lead_attachment', $quotationFileNameToStore);
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
        if($request->hasFile('lead_attachment')){
            $lead->lead_attachment = $quotationFileNameToStore;
         } 
        $lead->save();

        $totalAmountWithoutGst = 0;
        $totalGstAmount = 0;
        $totalAmountWithGst = 0;    
        
        $previousProducts = LeadProduct::where("lead_id",$lead->id)->delete();
        $products = $request->input('products');
         if($products)
         {
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
    }
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
        return $this->sendResponse(["Lead"=>new LeadResource($lead)], "lead retrieved successfully");
        // return $this->sendResponse(["lead"=> $lead, 'contact'=>new ContactResource($lead->contact)], "lead retrieved successfully");
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


    public function generateQuotation(string $id)
    {
        $leadStatus = config('data.lead_status.Quotation');
        $leads = Lead::with('leadProducts.product')->find($id);
        $leads->lead_status  = $leadStatus;
        if(!empty($leads->lead_quotation) && Storage::exists('public/Lead/generated_quotations/'.$leads->lead_quotation)) {
            Storage::delete('public/Lead/generated_quotations/'.$leads->lead_quotation);
        }
        // 
        $user = auth()->user();
        $employee = $user->employee->first();
    
        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }
        
        if (!$leads) {
            return response()->json(['message' => 'Lead not found'], 404);
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
        $leads->lead_quotation = $fileName;
        $leads->save();
        // Save PDF to storage
        Storage::put($filePath, $mpdf->Output('', 'S')); // Output as string and save to storage

        // Output the PDF for download
        // return $mpdf->Output('quotation.pdf', 'D'); // Download the PDF
        return $this->sendResponse([], "Quotation generated successfully");

    }

    public function generateInvoice(string $id)
    {
        $leads = Lead::with('leadProducts.product')->find($id);
        if(!empty($leads->lead_invoice) && Storage::exists('public/Lead/generated_invoices/'.$leads->lead_invoice)) {
            Storage::delete('public/Lead/generated_invoices/'.$leads->lead_invoice);
        }
        // 
        $user = auth()->user();
        $employee = $user->employee->first();
    
        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }
        
        if (!$leads) {
            return response()->json(['message' => 'Lead not found'], 404);
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
        // Save PDF to storage
        Storage::put($filePath, $mpdf->Output('', 'S')); // Output as string and save to storage

        // Output the PDF for download
        // return $mpdf->Output('invoice.pdf', 'D'); // Download the PDF
        return $this->sendResponse([], "Invoice generated successfully");
    }
    
}