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
        <div style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;">
            <!-- Left empty cell to balance the grid -->
            <div></div>
            
            <!-- Centered Title -->
            <h2 style="grid-column: 2; text-align: center; margin: 0;">
              Purchase Report
            </h2>
            
            <!-- Right-aligned Date -->
            <p style="grid-column: 3; text-align: right; margin: 0;">
              <strong>Date:</strong> {{ now()->format('d/m/Y') }}
            </p>
          </div>

        <table>
            <thead>
                <tr>
                    <th>Contact</th>
                    <th>Products</th>
                    <th>Payment Reference No.</th>
                    <th>Payment Status</th>
                    <th>Invoice Number</th>
                    <th>Created At</th>
                </tr>
            </thead>
            <tbody>
                @foreach($purchases as $purchase)
                    <tr>
                        <td>{{ $purchase->supplier->supplier ?? 'N/A' }}</td>
                        <td>
                            @if($purchase->purchaseDetails)
                                @foreach($purchase->purchaseDetails as $detail)
                                    {{ $detail->product->product ?? 'N/A' }}
                                    (Qty: {{ $detail->quantity }})
                                    @if(!$loop->last), @endif
                                @endforeach
                            @else
                                N/A
                            @endif
                        </td>
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
