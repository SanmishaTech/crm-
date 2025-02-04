<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lead Report</title>
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
              Lead Report
            </h2>
            
            <!-- Right-aligned Date -->
            <p style="grid-column: 3; text-align: right; margin: 0;">
              <strong>Date:</strong> {{ now()->format('d/m/Y') }}
            </p>
          </div>
          
          
          

        <table>
            <thead>
                <tr>
                    <th>Contact Person</th>
                    <th>Products</th>
                    <th>Lead Type</th>
                    <th>Lead Status</th>
                    <th>Follow-up Date</th>
                    <th>Follow-up Type</th>
                    <th>Remark</th>
                    <th>Created At</th>
                </tr>
            </thead>
            <tbody>
                @foreach($leads as $lead)
                    <tr>
                        <td>{{ $lead->contact->contact_person ?? 'N/A' }}</td>
                        <td>
                            {{ $lead->leadProducts->pluck('product.product')->filter()->join(', ') ?: 'N/A' }}
                        </td>
                        <td>{{ $lead->lead_type }}</td>
                        <td>{{ $lead->lead_status }}</td>
                        <td>{{ $lead->lead_follow_up_date ? $lead->lead_follow_up_date->format('d/m/Y (H:i)') : 'N/A' }}</td>
                        <td>{{ $lead->follow_up_type ?? 'N/A' }}</td>
                        <td>{{ $lead->follow_up_remark ?? 'N/A' }}</td>
                        <td>{{ $lead->created_at ?? 'N/A' }}</td>

                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</body>
</html>
