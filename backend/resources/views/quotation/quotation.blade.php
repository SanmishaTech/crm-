<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quotation</title>
    <style>
        body {
            font-family: Arial, sans-serif; 
            font-size: 14px;
            color: #000;
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        .logo img {
            max-width: 200px;
            height: auto;
        }
        .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 20px;
         }
        .invoice-box h4 {
            margin: 0;
            font-size: 18px;
        }
        .invoice-box h6 {
            margin: 0;
            font-size: 14px;
        }
        .invoice-box table {
            width: 100%;
            border-collapse: collapse;
        }
        .invoice-box table, .invoice-box th, .invoice-box td {
            border: 1px solid black;
        }
        .invoice-box th, .invoice-box td {
            padding: 8px;
            text-align: left;
        }
        .invoice-box .header, .invoice-box .footer {
            text-align: center;
            margin-bottom: 20px;
        }
        .invoice-box .header td {
            border: none;
            padding: 0;
        }
        .invoice-box .information td {
            border: none;
            padding: 0;
        }
        .invoice-box .totals td {
            border: none;
            text-align: right;
            padding: 5px 5px;
        }
        .invoice-box .totals td:last-child {
            width: 100px;
            border-bottom: 1px solid #000;
        }
        .invoice-box .round-off td {
            border: none;
            text-align: right;
            padding: 5px 5px;
        }
        .invoice-box .round-off td:last-child {
            border-bottom: 2px solid #000;
        }
        .text-end {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .text-left {
            text-align: left;
        }
        .page-break {
            page-break-after: always;
        }
        .terms-conditions {
            margin-top: 20px;
        }
        .terms-conditions h5 {
            margin-bottom: 10px;
        }
        .terms-conditions ul {
            list-style-type: decimal;
            padding-left: 20px;
        }
       
     
    </style>
</head>
<body>
    @php
    $i = 1;
    @endphp
    <div class="logo">
        <img src="{{ public_path('images/Renuka.jpg') }}" alt="Renuka Enterprises Logo">
    </div>
    <h4 style="text-align: center">QUOTATION</h4>
    <table style="width: 100%; margin: 10px 0;">
        <tr>
            <td style="text-align: left;"><strong>Quotation Ref No: {{@$leads->quotation_number}}</strong></td>
            <td style="text-align: right;"><strong>Date: {{@$leads->quotation_date}}</strong></td>
        </tr>
    </table>
    <div class="invoice-box">
        <div style="margin-bottom: 20px; line-height: 1.5;">
            <p>Dear Sir,</p>
            <p>Greetings from Renuka Enterprises!</p>
            <p style="text-align: justify;">The Renuka Enterprises is the Quality & Safety Solutions Company catering High Performance Thermal Imaging Cameras of FLIR brand and MSA make Safety products. We are also catering Electrical, Electronic Testing & Measuring Equipments & Systems.</p>
            <p>Thank You for giving us this opportunity.</p>
        </div>
        

        <div>
            <p>We are channel partners with following manufacturing companies/OEM.</p>
            <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px; border: 1px solid black; width: 50%;"><strong>FLIR Systems India - USA</strong></td>
                    <td style="padding: 8px; border: 1px solid black;">Thermal Imaging Cameras</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid black;"><strong>Extech Instruments - USA</strong></td>
                    <td style="padding: 8px; border: 1px solid black;">Electrical Instruments</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid black;"><strong>MSA Safety Company - USA</strong></td>
                    <td style="padding: 8px; border: 1px solid black;">Personal, Plant & Industrial Safety Solutions</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid black;"><strong>Scientech Technologies – Indore, India</strong></td>
                    <td style="padding: 8px; border: 1px solid black;">India Educational & Research Equipments</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid black;"><strong>Motwane Manufacturing Company - Nasik, India</strong></td>
                    <td style="padding: 8px; border: 1px solid black;">Electrical HV & LT Equipments</td>
                </tr>
            </table>
            <p style="margin-top: 15px;">If you have any queries, our engineers are available to assist you on 9870201624/8928056500.</p>
        </div>
    </div>

    <div class="page-break"></div>

    <div class="logo">
        <img src="{{ public_path('images/Renuka.jpg') }}" alt="Renuka Enterprises Logo">
    </div>
    
    <div class="invoice-box">
        <table cellpadding="0" cellspacing="0">
            <tr class="information">
                <td colspan="4" style="padding-left:10px; ">
                  <strong>CRM</strong><br>
                     <P>Maharashtra - 400605</P>
                </td>
                <td colspan="4" class="text-end" style=" text-align: right; padding-right:10px; padding-top:10px;">
                    
                   
                    version: {{@$leads->quotation_version}}<br>
                    <strong>To</strong><br>
                    test user<br>
                    thane,
                    Maharashtra<br> 
                    Mobile: 9999887766 <br>
                    Email: test@gmail.com
                    <br><br><br>
                </td>
            </tr>
            
            <tr class="heading">
                <th>Sl.</th>
                <th>Product Name</th>
                <th>Rate</th>
                <th>Qty</th>
                <th>Gst%</th>
                <th>Gst₹</th>
                <th>Total</th>
            </tr>

            @foreach($leads->leadProducts as $product)
            <tr class="item">
                <td>{{$i++}}</td>
                <td>{{@$product->product->product}}</td>
                <td>{{@$product->rate}}</td>
                <td>{{@$product->quantity}}</td>
                <td>{{@$product->product->gst_rate}}%</td>
                <td>{{@$product->gst_amount}}</td>
                <td>{{@$product->amount_without_gst}}</td>
            </tr>
            @endforeach
        </table>

        <table cellpadding="0" cellspacing="0">
            <tr>
                <td colspan="7" style="border-top: 1px solid #000; border-bottom: none;">
                    Items: {{ --$i}}
                </td>
            </tr>
            <tr>
                <td colspan="7" style="border-bottom: 1px solid #000; border-top: none;">
                    E&amp;OE. Goods once sold cannot be taken back or exchanged
                </td>
            </tr>
            <tr class="totals">
                <td colspan="5"></td>
                <td>Total Taxable:</td>
                <td>₹{{$leads->total_taxable}}</td>    
            </tr>
            <tr class="totals">
                <td colspan="5"></td>
                <td>Total Tax:</td>
                <td>₹{{$leads->total_gst}}</td>    
            </tr>
            <tr class="round-off">
                <td colspan="5"></td>
                <td>Round-off:</td>
                <td>₹0.00</td>
            </tr>
            <tr class="round-off">
                <td colspan="5"></td>
                <td><strong>Total:</strong></td>
                <td><strong>{{$leads->total_amount_with_gst}}</strong></td>
            </tr>
        </table>

        <div class="text-center" style="margin-top: 20px;">
            <p>GST% 18% &nbsp;&nbsp; Taxable ₹{{$leads->total_taxable}} &nbsp;&nbsp; CGST ₹3.60&nbsp;&nbsp; SGST ₹3.60</p>
        </div>

        <div class="terms-conditions" style="margin-top: 40px;">
            <h5>Terms and Conditions:</h5>
            <ul>
                <li>Quotation is valid for 15 days from the date of issue.</li>
                <li>50% advance payment is required with purchase order.</li>
                <li>Balance payment should be made before delivery of goods.</li>
                <li>Delivery period: 7-10 working days after confirmation of order.</li>
                <li>Prices are subject to change without prior notice.</li>
                <li>GST rates are applicable as per government norms.</li>
                <li>Warranty as per manufacturer's terms and conditions.</li>
                <li>Installation and training will be provided if applicable.</li>
            </ul>
        </div>

        <div class="text-center" style="margin-top: 40px;">
            <p>This is a computer-generated document. No signature is required.</p>
        </div>
    </div>
 </body>
</html>
