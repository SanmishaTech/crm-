<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use Mpdf\Mpdf as Enter;
use App\Models\Purchase;
use Illuminate\Http\Request;
use App\Models\PurchaseDetail;
use App\Models\PurchaseProduct;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\PurchaseResource;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use App\Http\Controllers\Api\BaseController;
use PhpOffice\PhpSpreadsheet\Writer\Pdf\Mpdf;
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

    public function generateReport(Request $request)
    {
        try {
            // Modify the query to include purchaseDetails and products
            $query = Purchase::with(['purchaseDetails.product', 'supplier']);
            
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

            // Use a consistent variable name for the retrieved purchases
            $purchases = $query->get();

            if ($purchases->isEmpty()) {
                return $this->sendError("No purchase found", ['error' => ['No purchases found for the selected filter']]);
            }

            if ($type === 'pdf') {
                $user = auth()->user();
                $employee = $user->employee;

                if (!$employee) {
                    return $this->sendError("Employee not found", ['error'=>['Employee not found']]);
                }
                
                // Pass purchases as "purchases" to the view
                $data = [
                    'user'     => $user,
                    'employee' => $employee,
                    'purchases' => $purchases,
                ];

                $html = view('reports.purchase', $data)->render();
                $mpdf = new Enter([
                    'margin_left'   => 10,
                    'margin_right'  => 10,
                    'margin_top'    => 15,
                    'margin_bottom' => 15,
                ]);
                
                $mpdf->WriteHTML($html);
                $fileName = 'purchase_report_' . now()->format('Y_m_d_His') . '.pdf';
                return $mpdf->Output($fileName, 'D');
            } else {
                // Excel generation branch
                $spreadsheet = new Spreadsheet();
                $sheet = $spreadsheet->getActiveSheet();

                // Set headers for the Excel file
                $sheet->setCellValue('A1', 'Contact');
                $sheet->setCellValue('B1', 'pRODUCTS');
                $sheet->setCellValue('C1', 'Payment Reference No');
                $sheet->setCellValue('D1', 'Payment Status');
                $sheet->setCellValue('E1', 'Invoice Number');
                $sheet->setCellValue('F1', 'Created At');

                // Style the header row
                $headerStyle = [
                    'font' => ['bold' => true],
                    'fill' => [
                        'fillType'   => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'E0E0E0']
                    ]
                ];
                $sheet->getStyle('A1:F1')->applyFromArray($headerStyle);

                // Add data to the spreadsheet
                $row = 2;
                foreach ($purchases as $purchase) {
                    // Build products string
                    $productsString = '';
                    if ($purchase->purchaseDetails) {
                        $productDetails = [];
                        foreach ($purchase->purchaseDetails as $detail) {
                            $productDetails[] = ($detail->product->product ?? 'N/A') . ' (Qty: ' . $detail->quantity . ')';
                        }
                        $productsString = implode(', ', $productDetails);
                    } else {
                        $productsString = 'N/A';
                    }

                    $sheet->setCellValue('A' . $row, $purchase->supplier->supplier ?? 'N/A');
                    $sheet->setCellValue('B' . $row, $productsString);
                    $sheet->setCellValue('C' . $row, $purchase->payment_ref_no ?: 'N/A');
                    $sheet->setCellValue('D' . $row, $purchase->payment_status);
                    $sheet->setCellValue('E' . $row, $purchase->invoice_no);
                    $sheet->setCellValue('F' . $row, $purchase->created_at ?? 'N/A');
                    $row++;
                }

                // Auto-size columns
                foreach (range('A', 'F') as $column) {
                    $sheet->getColumnDimension($column)->setAutoSize(true);
                }

                // Create Excel file
                $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);

                // Save to a temporary file
                $fileName = 'purchase_report_' . date('Y_m_d_His') . '.xlsx';
                $tempFile = tempnam(sys_get_temp_dir(), 'purchase_report');
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