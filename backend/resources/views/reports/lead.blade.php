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
    </style>
</head>
<body>
    <div class="logo">
        <img src="{{ public_path('images/Renuka.jpg') }}" alt="Renuka Enterprises Logo">
    </div>
    <div class="report-container">
        <h2>Lead Report</h2>
        <p><strong>Version:</strong> {{ $leads->report_version }}</p>
        <table>
            <thead>
                <tr>
                    <th>Contact</th>
                    <th>Contact</th>
                    <th>Products</th>
                    <th>Next Follow-up Date</th>
                    <th>Follow-up Type</th>
                    <th>Lead Status</th>
                    <th>Remarks</th>
                 
                </tr>
            </thead>
            <tbody>
                @foreach($leads as $lead)
                <tr>
                    <td>{{ $lead->contact->contact_person ?? 'N/A' }}</td>
                    <td>{{ $lead->contact->contact_person ?? 'N/A' }}</td>
                    <td>{{ $lead->products ?? 'N/A' }}</td>
                    <td>test</td>
                    <td>{{ $lead->followup_type ?? 'N/A' }}</td>
                    <td>{{ $lead->status ?? 'N/A' }}</td>
                    <td>{{ $lead->remarks ?? 'N/A' }}</td>
                 </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</body>
</html>
