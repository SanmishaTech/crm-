<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Purchase Report</title>
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
            <h2>Purchase Report</h2>
            <div class="report-date">
                <p><strong>Date:</strong> {{ now()->format('d/m/Y') }}</p>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Contact</th>
                     <th>Payment Reference No.</th>
                    <th>Payment Status</th>
                    <th>Invoice Number</th>
                    <th>Created At</th>
                </tr>
            </thead>
            <tbody>
                @foreach($purchases as $purchase)
                {{-- @dd($purchase)   --}}

                
                    <tr>
                        <td>{{ $purchase->supplier->supplier ?? 'N/A' }}</td>
                        {{-- @dd($purchase->payment_status)   --}}
                        <td>{{ $purchase->payment_ref_no ?? 'N/A' }}</td>
                        <td>{{ $purchase->payment_status ?? 'N/A' }}</td>
                        <td>{{ $purchase->invoice_no ?? 'N/A' }}</td>
                        <td>{{ $purchase->created_at ?? 'N/A' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</body>
</html>
