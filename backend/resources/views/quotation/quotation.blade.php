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
        .td-color{
            color: rgb(1, 73, 161);
            font: bold;
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
     </h4>
    <table style="width: 100%; margin: 10px 0;">
        <tr>
            <td style="text-align: left;"><strong>Quotation Ref No: {{@$leads->quotation_number}}</strong></td>
            <td style="text-align: right;">
                <strong>
                    Date: {{ @$leads->quotation_date ? \Carbon\Carbon::parse($leads->quotation_date)->format('d-m-Y') : '' }}
                </strong>
            </td>
                    </tr>
    </table>
    <div class="invoice-box">
        <div style="line-height: 1.5; margin: 0; padding: 0;">
            <p style="margin: 0;">To,</p>

            @if (!empty($leads->contact->contact_person))
                <p style="margin: 0;"><strong>{{ $leads->contact->contact_person }},</strong></p>
            @endif
            
            @if (!empty($leads->contact->designation))
                <p style="margin: 0;"><strong>{{ $leads->contact->designation }},</strong></p>
            @endif
            
            @if (!empty($leads->contact->client->street_address))
                <p style="margin: 0;"><strong>{{ $leads->contact->client->street_address }},</strong></p>
            @endif
            
            @if (!empty($leads->contact->client->city) || !empty($leads->contact->client->state) || !empty($leads->contact->client->pincode))
                <p style="margin: 0;">
                    <strong>
                        {{ $leads->contact->client->city ?? '' }}{{ !empty($leads->contact->client->state) ? ', ' . $leads->contact->client->state : '' }}
                        {{ !empty($leads->contact->client->pincode) ? ' - ' . $leads->contact->client->pincode : '' }},
                    </strong>
                </p>
            @endif
            
            @if (!empty($leads->contact->client->country))
                <p style="margin: 0;"><strong>{{ $leads->contact->client->country }}</strong></p>
            @endif
            
            
            <br>
            <p style="margin: 0; margin-bottom: 10px">Dear Sir,</p>
            <p style="margin: 0; margin-bottom: 10px">Greetings from <strong>Renuka Enterprises!</strong></p>
            <p style="margin: 0; text-align: justify;">
                The Renuka Enterprises is the Quality & Safety Solutions Company catering High Performance Thermal Imaging Cameras of FLIR brand and MSA make Safety products. We are also catering Electrical, Electronic Testing & Measuring Equipments & Systems.
            </p>
            <p style="margin: 0;">Thank You for giving us this opportunity.</p>
        </div>
        
        

        <div>
            <p style="text-align: center;">We are channel partners with following manufacturing companies/OEM.</p>
            <table style="width: 100%; margin-top: 15px; border-collapse: collapse; margin-left: auto; margin-right: auto;">
                <tr>
                    <td style="padding: 8px; border: 1px solid black; width: 50%;"><strong>FLIR Systems India - USA</strong></td>
                    <td style="padding: 8px; border: 1px solid black;"><strong>Thermal Imaging Cameras</strong></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid black;"><strong>Extech Instruments - USA</strong></td>
                    <td style="padding: 8px; border: 1px solid black;"><strong>Electrical Instruments</strong></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid black;"><strong>MSA Safety Company - USA</strong></td>
                    <td style="padding: 8px; border: 1px solid black;"><strong>Personal, Plant & Industrial Safety Solutions</strong></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid black;"><strong>Scientech Technologies – Indore, India</strong></td>
                    <td style="padding: 8px; border: 1px solid black;"><strong>India Educational & Research Equipments</strong></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid black;"><strong>Motwane Manufacturing Company - Nasik, India</strong></td>
                    <td style="padding: 8px; border: 1px solid black;"><strong>Electrical HV & LT Equipments<strong></td>
                </tr>
            </table>
            <p style="text-align: center; margin-top: 15px;">If you have any queries, our engineers are available to assist you on 9870201624/8928056500.</p>
        </div>
    </div>

    <div class="page-break"></div>

    <div class="logo">
        <img src="{{ public_path('images/Renuka.jpg') }}" alt="Renuka Enterprises Logo">
    </div>
    
    <div class="invoice-box">
        <p >With reference to your requirement of Product enclosed herewith our <u>budgetary offer</u> for the same.</p>
        
        <table cellpadding="0" cellspacing="0">
 .            
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
                <td colspan="7" style="border-top: 1px solid #000; border-bottom: 1.5px solid #000;">
                    Items: {{ --$i }}
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
                <td><strong>₹{{$leads->total_amount_with_gst}}</strong></td>
            </tr>
        </table>

        <!-- <div class="text-center" style="margin-top: 20px;">
            <p>GST% 18% &nbsp;&nbsp; Taxable ₹{{$leads->total_taxable}} &nbsp;&nbsp; CGST ₹3.60&nbsp;&nbsp; SGST ₹3.60</p>
        </div> -->

        <div class="terms-conditions" style="margin-top: 20px;">
           <h4><u>Terms and Conditions</u></h4>
           <p style="font-weight: bold;">
            {!! nl2br(e($leads->terms)) !!}
        </p>
                     
            
            <div style="text-align: left; margin-top: 30px;">
                <p style="margin: 0;"><strong>For Renuka Enterprises</strong></p>
                <img src="{{ public_path('images/renuka sign.jpg') }}" alt="Signature" style="max-width: 150px; height: auto;">
                <p style="margin: 0;"><strong>Manish</strong></p>
            </div>

            <p style="text-align: center; margin-top: 20px; margin-bottom: 10px; font-weight: bold; color: red;">Our Product Range</p>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 9px; padding: 2px;">
                <tr>
                    <td class="td-color" style="padding: 2px; border: none;">Air Quality Meters</td>
                    <td class="td-color" style="padding: 2px; border: none;">Air Flow Meters</td>
                    <td class="td-color" style="padding: 2px; border: none;">Automotive Meters</td>
                    <td class="td-color" style="padding: 2px; border: none;">Battery Testers</td>
                </tr>
                <tr>
                    <td class="td-color" style="padding: 2px; border: none;">Borescope Cameras | Videoscopes</td>
                    <td class="td-color" style="padding: 2px; border: none;">Cable Tracers</td>
                    <td class="td-color" style="padding: 2px; border: none;">Calibrators</td>
                    <td class="td-color" style="padding: 2px; border: none;">Circuit Identifiers</td>
                </tr>
                <tr>
                    <td class="td-color" style="padding: 2px; border: none;">Clamp Meters</td>
                    <td class="td-color" style="padding: 2px; border: none;">Continuity Testers</td>
                    <td class="td-color" style="padding: 2px; border: none;">Decade Boxes</td>
                    <td class="td-color" style="padding: 2px; border: none;">FLIR Thermal Imaging Cameras</td>
                </tr>
                <tr>
                    <td class="td-color" style="padding: 2px; border: none;">FLIR Videoscopes</td>
                    <td class="td-color" style="padding: 2px; border: none;">FLIR Flex Clamp Meters</td>
                    <td class="td-color" style="padding: 2px; border: none;">Distance Meters</td>
                    <td class="td-color" style="padding: 2px; border: none;">Electromagnetic Field Meters</td>
                </tr>
                <tr>
                    <td class="td-color" style="padding: 2px; border: none;">Force Gauges</td>
                    <td class="td-color" style="padding: 2px; border: none;">Gas Detectors and Analyzers</td>
                    <td class="td-color" style="padding: 2px; border: none;">Ground Resistance Testers</td>
                    <td class="td-color" style="padding: 2px; border: none;">Heat Index Meters</td>
                </tr>
                <tr>
                    <td class="td-color" style="padding: 2px; border: none;">Humidity Meters| Hygrometers</td>
                    <td class="td-color" style="padding: 2px; border: none;">LCR Meters</td>
                    <td class="td-color" style="padding: 2px; border: none;">Light Meters</td>
                    <td class="td-color" style="padding: 2px; border: none;">Magnetic Field Meters</td>
                </tr>
                <tr>
                    <td class="td-color" style="padding: 2px; border: none;">Megohm meters | Insulation Testers</td>
                    <td class="td-color" style="padding: 2px; border: none;">Milliohm | Micro-Ohm Meters</td>
                    <td class="td-color" style="padding: 2px; border: none;">Moisture Meters</td>
                    <td class="td-color" style="padding: 2px; border: none;">Multimeters</td>
                </tr>
                <tr>
                    <td class="td-color" style="padding: 2px; border: none;">Non-contact Voltage Testers and Current Testers</td>
                    <td class="td-color" style="padding: 2px; border: none;">Oscilloscopes</td>
                    <td class="td-color" style="padding: 2px; border: none;">Pedometers</td>
                    <td class="td-color" style="padding: 2px; border: none;">Phase Rotation | Motor Rotation Indicators</td>
                </tr>
                <tr>
                    <td class="td-color" style="padding: 2px; border: none;">PID Controllers</td>
                    <td class="td-color" style="padding: 2px; border: none;">Power Analyzers</td>
                    <td class="td-color" style="padding: 2px; border: none;">Power Supplies</td>
                    <td class="td-color" style="padding: 2px; border: none;">Pressure Meters | Manometers</td>
                </tr>
                <tr>
                    <td class="td-color" style="padding: 2px; border: none;">Receptacle Testers and Analyzers</td>
                    <td class="td-color" style="padding: 2px; border: none;">Refractometers</td>
                    <td class="td-color" style="padding: 2px; border: none;">Scales</td>
                    <td class="td-color" style="padding: 2px; border: none;">Sound Meters | Decibel Meters</td>
                </tr>
                <tr>
                    <td class="td-color" style="padding: 2px; border: none;">Stopwatches and Timers</td>
                    <td class="td-color" style="padding: 2px; border: none;">Tachometers</td>
                    <td class="td-color" style="padding: 2px; border: none;">Thermometers</td>
                    <td class="td-color" style="padding: 2px; border: none;">Thickness Gauges</td>
                </tr>
                <tr>
                    <td class="td-color" style="padding: 2px; border: none;"><stong>Vibration Meters</stong></td>
                    <td class="td-color" style="padding: 2px; border: none;">Water Quality Meters</td>
                    <td class="td-color" style="padding: 2px; border: none;">And Many more........</td>
                    <td class="td-color" style="padding: 2px; border: none;"></td>
                </tr>
                <tr>
                    <td colspan="4" style="text-align: center; padding: 2px; border: none;">
                        <a href="http://www.extech.com/">www.extech.com</a> &nbsp;&nbsp; 
                        <a href="https://www.flir.com/">www.flir.com</a>
                    </td>
                </tr>
            </table>
        </div>

       
    </div>
 </body>
</html>
