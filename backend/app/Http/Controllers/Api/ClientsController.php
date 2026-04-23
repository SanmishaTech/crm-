<?php

namespace App\Http\Controllers\Api;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\ClientResource;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Http\Controllers\Api\BaseController;
use App\Http\Controllers\Api\ClientsController as ApiClientsController;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\IOFactory;

class ClientsController extends BaseController
{
    /**
     * Download Excel Template for Clients.
     */
    public function downloadTemplate()
    {
        if (ob_get_level()) ob_end_clean();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        
        // Set Headers
        $headers = [
            'Client', 'Contact No', 'Email', 'GSTIN', 'Street Address', 
            'Area', 'City', 'State', 'Pincode', 'Country',
            'Shipping Street', 'Shipping Area', 'Shipping City', 'Shipping State', 'Shipping Pincode', 'Shipping Country'
        ];
        $sheet->fromArray($headers, null, 'A1');

        $writer = new Xlsx($spreadsheet);
        $fileName = 'Client_Import_Template.xlsx';
        
        return response()->streamDownload(function () use ($writer) {
            $writer->save('php://output');
        }, $fileName, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }

    /**
     * Import Clients from Excel.
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
            $errors = [];

            foreach ($rows as $index => $row) {
                if (empty(array_filter($row))) continue;

                $clientName = trim($row[0] ?? '');
                $contactNo = trim($row[1] ?? '');
                
                // Mandatory validation
                if (empty($clientName) || empty($contactNo)) {
                    $errors[] = "Row " . ($index + 1) . ": Client Name and Contact No are mandatory.";
                    continue;
                }

                $data = [
                    'client' => $clientName,
                    'contact_no' => $contactNo,
                    'email' => trim($row[2] ?? ''),
                    'gstin' => trim($row[3] ?? ''),
                    'street_address' => trim($row[4] ?? ''),
                    'area' => trim($row[5] ?? ''),
                    'city' => trim($row[6] ?? ''),
                    'state' => trim($row[7] ?? ''),
                    'pincode' => trim($row[8] ?? ''),
                    'country' => trim($row[9] ?? '') ?: 'India',
                    'shipping_street' => trim($row[10] ?? ''),
                    'shipping_area' => trim($row[11] ?? ''),
                    'shipping_city' => trim($row[12] ?? ''),
                    'shipping_state' => trim($row[13] ?? ''),
                    'shipping_pincode' => trim($row[14] ?? ''),
                    'shipping_country' => trim($row[15] ?? '') ?: 'India',
                ];

                Client::create($data);
                $count++;
            }

            $message = "$count records imported successfully.";
            if (!empty($errors)) {
                $message .= " Some rows were skipped due to missing mandatory fields.";
            }

            return $this->sendResponse(['errors' => $errors], $message);
        } catch (\Exception $e) {
            return $this->sendError("Import failed.", ['Error' => $e->getMessage()]);
        }
    }
   
    
    /**
     * All Clients.
     */
    public function index( Request $request): JsonResponse

    {
        $query = Client::query();
        
        if ($request->query('search')) {
            $searchTerm = $request->query('search');
    
            $query->where(function ($query) use ($searchTerm) {
                $query->where('client', 'like', '%' . $searchTerm . '%');
            });
        }
        $clients = $query->paginate(9);

        return $this->sendResponse(["Client"=>ClientResource::collection($clients),
        'pagination' => [
            'current_page' => $clients->currentPage(),
            'last_page' => $clients->lastPage(),
            'per_page' => $clients->perPage(),
            'total' => $clients->total(),
        ]], "Clients retrived successfully");
    }

    /**
     * Store Clients.
     * @bodyParam client string The name of the Client.
     * @bodyParam street_address string The street address of the Client.
     * @bodyParam area string The area of the Client.
     * @bodyParam city string The city of the Client.
     * @bodyParam state string The state of the Client.
     * @bodyParam pincode string The pincode of the Client.
     * @bodyParam country string The country of the Client.
     * @bodyParam gstin string The gstin of the Client.
     * @bodyParam contact_no string The contact number of the Client.
     * @bodyParam email string The email of the Client.
     */
    public function store(StoreClientRequest $request): JsonResponse
    {
        $clients = new Client();
        $clients->client = $request->input("client");
        $clients->contact_no = $request->input("contact_no");
        $clients->email = $request->input("email"); 
        $clients->gstin = $request->input("gstin");
        $clients->street_address = $request->input("street_address");
        $clients->area = $request->input("area");
        $clients->city = $request->input("city");
        $clients->state = $request->input("state");
        $clients->pincode = $request->input("pincode");
        $clients->country = $request->input("country");
        $clients->shipping_street = $request->input("shipping_street");
        $clients->shipping_area = $request->input("shipping_area");
        $clients->shipping_city = $request->input("shipping_city");
        $clients->shipping_state = $request->input("shipping_state");
        $clients->shipping_pincode = $request->input("shipping_pincode");
        $clients->shipping_country = $request->input("shipping_country");
        $clients->save();

        return $this->sendResponse(["Client"=> new ClientResource($clients)], 'Client Stored Successfully');

    }

    /**
     * Show Clients.
     */
    public function show(string $id): JsonResponse
    {
        $clients = Client::find($id);
        if(!$clients){
            return $this->sendError("Clients not found", ['error'=>'Clients not found']);
        }
        
        return $this->sendResponse(["Client"=> new ClientResource($clients)], 'Client retrived Successfully');
    }

    /**
     * Update Clients.
     * @bodyParam client string The name of the Client.
     * @bodyParam street_address string The street address of the Client.
     * @bodyParam area string The area of the Client.
     * @bodyParam city string The city of the Client.
     * @bodyParam state string The state of the Client.
     * @bodyParam pincode string The pincode of the Client.
     * @bodyParam country string The country of the Client.
     * @bodyParam gstin string The gstin of the Client.
     * @bodyParam contact_no string The contact number of the Client.
     * @bodyParam email string The email of the Client.
     
     */
    public function update(UpdateClientRequest $request, string $id): JsonResponse
    {
        $clients = Client::find($id);
        if(!$clients){
            return $this->sendError("Clients not found", ['error'=>'Clients not found']);
        }

        $clients->client = $request->input("client");
        $clients->contact_no = $request->input("contact_no");
        $clients->email = $request->input("email"); 
        $clients->gstin = $request->input("gstin");
        $clients->street_address = $request->input("street_address");
        $clients->area = $request->input("area");
        $clients->city = $request->input("city");
        $clients->state = $request->input("state");
        $clients->pincode = $request->input("pincode");
        $clients->country = $request->input("country");
        $clients->shipping_street = $request->input("shipping_street");
        $clients->shipping_area = $request->input("shipping_area");
        $clients->shipping_city = $request->input("shipping_city");
        $clients->shipping_state = $request->input("shipping_state");
        $clients->shipping_pincode = $request->input("shipping_pincode");
        $clients->shipping_country = $request->input("shipping_country");
        $clients->save();

        return $this->sendResponse(["Client"=> new ClientResource($clients)], 'Client Updated Successfully');
        
    }

    /**
     * Destroy Clients.
     */
    public function destroy(string $id): JsonResponse
    {
        $clients = Client::find($id);
        if(!$clients){
            return $this->sendError("Client not found", ['error'=>'Client not found']);
        }
        $clients->delete();
        return $this->sendResponse([], 'Client Deleted Successfully');

    }

      /**
     * Fetch All Clients.
     */
    public function allClients(): JsonResponse
    {
        $clients = Client::all();

        return $this->sendResponse(["Client"=>ClientResource::collection($clients),
        ], "Client retrived successfully");

    }

    
}