<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #000;
        }
        .report-container {
            max-width: 1000px;
            margin: auto;
            padding: 20px;
        }
        .report-container h2 {
            text-align: center;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        .logo img {
            max-width: 200px;
            height: auto;
        }
        .report-header {
            margin-bottom: 20px;
        }
        .report-date {
            text-align: right;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="logo">
        <img src="{{ public_path('images/Renuka.jpg') }}" alt="Renuka Enterprises Logo">
    </div>
    <div class="report-container">
        <div class="report-header">
            <h2>Invoice Report</h2>
            <div class="report-date">
                <p><strong>Date:</strong> {{ now()->format('d/m/Y') }}</p>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Invoice Number</th>
                    <th>Products</th>
                    <th>Invoice Date</th>
                    <th>Amount</th>
                    <th>Dispatch Details</th>
                    <th>Created At</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoices as $invoice)
                {{-- @dd($invoice) <!-- This will dump the invoice and stop the script execution --> --}}

                
                    <tr>
                        <td>{{ $invoice->invoice_number ?? 'N/A' }}</td>
                        <td>
                            @if(is_array($invoice->product_names) && count($invoice->product_names) > 0)
                            {{ implode(', ', $invoice->product_names) }}
                        @else
                            NA
                        @endif
                        
                         
                        </td>
                        <td>
                            @if($invoice->invoice_date)
                                {{ \Carbon\Carbon::parse($invoice->invoice_date)->format('d/m/Y') }}
                            @else
                                N/A
                            @endif
                        </td>
                        <td>{{ $invoice->amount ?? 'N/A' }}</td>
                        <td>{{ $invoice->dispatch_details ?? 'N/A' }}</td>
                        <td>{{ $invoice->created_at ?? 'N/A' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</body>
</html>
