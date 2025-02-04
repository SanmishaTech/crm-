<?php

namespace App\Http\Controllers\Api;

use File;
use Response;
use Carbon\Carbon;
use App\Models\Invoice;
use Mpdf\Mpdf as Enter;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\InvoiceResource;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use App\Http\Controllers\Api\BaseController;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

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
                      ->orWhere('dispatch_details', 'like', '%' . $searchTerm . '%');
            });
        }

        $invoices = $query->paginate(9);

        return $this->sendResponse([
            "Invoices" => InvoiceResource::collection($invoices),
            'Pagination' => [
                'current_page' => $invoices->currentPage(),
                'last_page'    => $invoices->lastPage(),
                'per_page'     => $invoices->perPage(),
                'total'        => $invoices->total(),
            ]
        ], "Invoices retrieved successfully");
    }

    /**
     * Update Invoice.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $invoice = Invoice::find($id);
    
        if (!$invoice) {
            return $this->sendError("Invoice not found", ['error' => 'Invoice not found']);
        }
    
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
        $path = storage_path('app/public/Lead/generated_invoices/' . $files);
    
        if (!file_exists($path)) {
            return $this->sendError("Invoice not found", ['error'=>['Invoice not found. Generate invoice again.']]);
        }
    
        $fileContent = File::get($path);
        $mimeType = \File::mimeType($path);
    
        $response = Response::make($fileContent, 200);
        $response->header("Content-Type", $mimeType);
        $response->header('Content-Disposition', 'inline; filename="' . $files . '"');
        return $response;
    }

    public function generateReport(Request $request)
    {
        try {
            // Retrieve invoices with their invoiceDetails and related product
            $query = Invoice::with(['invoiceDetails.product']);
            
            $from_date = $request->query('from_date');
            $to_date = $request->query('to_date');
            $type = $request->query('type', 'excel'); 

            if ($from_date) {
                $from_date = Carbon::parse($from_date)->startOfDay();
                $query->whereDate('created_at', '>=', $from_date);
            }

            if ($to_date) {
                $to_date = Carbon::parse($to_date)->endOfDay();
                $query->whereDate('created_at', '<=', $to_date);
            }

            // Use a consistent variable name for the retrieved invoices
            $invoices = $query->get();

            if ($invoices->isEmpty()) {
                return $this->sendError("No invoice found", ['error' => ['No invoices found for the selected filter']]);
            }

            if ($type === 'pdf') {
                $user = auth()->user();
                $employee = $user->employee;

                if (!$employee) {
                    return $this->sendError("Employee not found", ['error'=>['Employee not found']]);
                }
                
                // Pass invoices as "invoices" to the view
                $data = [
                    'user'     => $user,
                    'employee' => $employee,
                    'invoices' => $invoices,
                ];

                $html = view('reports.invoice', $data)->render();
                $mpdf = new Enter([
                    'margin_left'   => 10,
                    'margin_right'  => 10,
                    'margin_top'    => 15,
                    'margin_bottom' => 15,
                ]);
                
                $mpdf->WriteHTML($html);
                $fileName = 'invoice_report_' . now()->format('Y_m_d_His') . '.pdf';
                return $mpdf->Output($fileName, 'D');
            } else {
                // Excel generation branch
                $spreadsheet = new Spreadsheet();
                $sheet = $spreadsheet->getActiveSheet();

                // Set headers for the Excel file
                $sheet->setCellValue('A1', 'Invoice Number');
                $sheet->setCellValue('B1', 'Products');
                $sheet->setCellValue('C1', 'Invoice Date');
                $sheet->setCellValue('D1', 'Amount');
                $sheet->setCellValue('E1', 'Dispatch Details');

                // Style the header row
                $headerStyle = [
                    'font' => ['bold' => true],
                    'fill' => [
                        'fillType'   => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'E0E0E0']
                    ]
                ];
                $sheet->getStyle('A1:E1')->applyFromArray($headerStyle);

                // Add data to the spreadsheet
                $row = 2;
                foreach ($invoices as $invoice) {
                    // Process products: assuming product_names is stored as an array or a string.
                    if (is_array($invoice->product_names)) {
                        $products = implode(', ', $invoice->product_names);
                    } else {
                        $products = $invoice->product_names;
                    }

                    // Format the invoice date if available
                    $invoiceDate = $invoice->invoice_date ? Carbon::parse($invoice->invoice_date)->format('d/m/Y') : 'N/A';

                    $sheet->setCellValue('A' . $row, $invoice->invoice_number ?? 'N/A');
                    $sheet->setCellValue('B' . $row, $products ?: 'N/A');
                    $sheet->setCellValue('C' . $row, $invoiceDate);
                    $sheet->setCellValue('D' . $row, $invoice->amount);
                    $sheet->setCellValue('E' . $row, $invoice->dispatch_details ?? 'N/A');
                    $row++;
                }

                // Auto-size columns
                foreach (range('A', 'E') as $column) {
                    $sheet->getColumnDimension($column)->setAutoSize(true);
                }

                // Create Excel file
                $writer = new Xlsx($spreadsheet);

                // Save to a temporary file
                $fileName = 'invoice_report_' . date('Y_m_d_His') . '.xlsx';
                $tempFile = tempnam(sys_get_temp_dir(), 'invoice_report');
                $writer->save($tempFile);

                // Return the file as a download
                return response()->download($tempFile, $fileName, [
                    'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ])->deleteFileAfterSend(true);
            }
        } catch (\Exception $e) {
            \Log::error('Report Generation Error: ' . $e->getMessage());
            return $this->sendError("Error generating report", ['error' => $e->getMessage()]);
        }
    }
}