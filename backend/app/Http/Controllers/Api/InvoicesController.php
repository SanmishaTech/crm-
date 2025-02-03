<?php

namespace App\Http\Controllers\Api;

use File;
use Response;
use App\Models\Invoice;
use App\Models\Purchase;
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


    public function generateReport(Request $request)
    {
    try {
        $query = Invoice::with(['product']);
        
        $from_date = $request->query('from_date');
        $to_date = $request->query('to_date');
        $type = $request->query('type', 'excel'); 

        if ($from_date) {
            $from_date = \Carbon\Carbon::parse($from_date)->startOfDay();
            $query->whereDate('created_at', '>=', $from_date);
        }

        if ($to_date) {
            $to_date = \Carbon\Carbon::parse($to_date)->endOfDay();
            $query->whereDate('created_at', '<=', $to_date);
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
                'invoice' => $invoice,
            ];

            $html = view('reports.lead', $data)->render();
            $mpdf = new Mpdf([
                'margin_left' => 10,
                'margin_right' => 10,
                'margin_top' => 15,
                'margin_bottom' => 15,
            ]);
            
            $mpdf->WriteHTML($html);
            $fileName = 'invoice_report_' . now()->format('Y_m_d_His') . '.pdf';
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