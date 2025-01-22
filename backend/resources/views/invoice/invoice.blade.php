<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #000;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table.main-table {
            border: 1px solid #000;
        }
        td {
            padding: 3px;
            vertical-align: top;
        }
        .border-cell {
            border: 1px solid #000;
        }
        .company-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .header-section {
            margin-bottom: 10px;
        }
        .items-table th {
            border: 1px solid #000;
            padding: 5px;
            text-align: center;
        }
        .items-table td {
            border: 1px solid #000;
            padding: 5px;
        }
        .bank-details {
            margin-top: 10px;
            border-top: 1px solid #000;
        }
        .footer-text {
            font-size: 10px;
            text-align: center;
            margin-top: 5px;
        }
        .line{
            border-bottom: 1px solid #000;

        }
    </style>
</head>
<body>
    <div style="text-align: center; margin-bottom: 10px;"><strong>INVOICE</strong></div>
    <table class="main-table">
        <tr>
            <td style="width: 60%;" class="border-cell">
                <div class="company-title">Renuka Enterprises, (from 1.4.2023)</div>
                Off - A-103, Amberyog 3, Ayre<br>
                Road, Dombivli East, 421201<br>
                Mumbai Maharashtra<br>
                UDYAM : UDYAM-MH-33-0026297 (Micro)<br>
                GSTIN/UIN: 27APCPM1801Q1ZQ<br>
                State Name : Maharashtra, Code : 27<br>
                Contact : 0251-2480403/9870201624<br>
                E-Mail : sales.renukaenter@rediffmail.com
            </td>
            <td style="width: 40%;" class="border-cell">
                <table style="width: 100%">
                    <tr>
                        <td class="line">Invoice No.</td>
                        <td class="line">{{@$leads->invoice_number}}</td>
                    </tr>
                    

                    <tr>
                        <td class="line">Dated</td>
                        <td class="line">{{ \Carbon\Carbon::now()->format('d-m-Y') }}</td>
                    </tr>
                    
                    
                    
                    <tr>
                        <td class="line">Mode/Terms of Payment</td>
                        <td class="line">{{@$leads->mode_of_payment}}</td>
                    </tr>
                    <tr>
                        <td class="line">Reference No. & Date</td>
                        <td class="line">{{@$leads->ref_no}}</td>
                    </tr>
                    <tr>
                        <td class="line">Other References</td>
                        <td class="line">{{@$leads->other_ref}}</td>
                    </tr>
                    <tr>
                        <td class="line">Buyer's Order No.</td>
                        <td class="line">{{@$leads->buyer_order_no}}</td>
                    </tr>
                    <tr>
                        <td>Dated</td>
                        <td>{{@$leads->buyers_date}}</td>
                    </tr>
                     
                </table>
            </td>
        </tr>
        <tr>
            <td class="border-cell">
                <div style="margin-bottom: 15px;">
                    <strong>Consignee (Ship to) </strong><br>
                    @if($leads->contact->client->client)
                        {{$leads->contact->client->client}}<br>
                    @endif
                    @php
                        $address_parts = array_filter([
                            $leads->contact->client->shipping_street,
                            $leads->contact->client->shipping_area,
                            $leads->contact->client->shipping_city,
                            $leads->contact->client->shipping_pincode
                        ]);
                        if (!empty($address_parts)) {
                            echo implode(', ', $address_parts) . '<br>';
                        }
                    @endphp
                    @if($leads->contact->client->gstin)GSTIN : {{$leads->contact->client->gstin}}<br>@endif
                    @if($leads->contact->client->state)State Name : {{$leads->contact->client->state}}<br>@endif
                    @if($leads->contact->contact_person)Contact person : {{$leads->contact->contact_person}}<br>@endif
                    @if($leads->contact->mobile_1)Contact : {{$leads->contact->mobile_1}}@endif
                </div>
                <hr style="border-top: 1px solid #000; margin: 20px 0;">
                <div>
                    <strong>Buyer (Bill to)</strong><br>
                    @if($leads->contact->client->client)
                        {{$leads->contact->client->client}}<br>
                    @endif
                    @php
                        $billing_address_parts = array_filter([
                            $leads->contact->client->shipping_street,
                            $leads->contact->client->shipping_area,
                            $leads->contact->client->shipping_city,
                            $leads->contact->client->shipping_pincode
                        ]);
                        if (!empty($billing_address_parts)) {
                            echo implode(', ', $billing_address_parts) . '<br>';
                        }
                    @endphp
                    @if($leads->contact->client->gstin)GSTIN: {{$leads->contact->client->gstin}}<br>@endif
                    @if($leads->contact->client->shipping_state)State Name : {{$leads->contact->client->shipping_state}}<br>@endif
                    @if($leads->contact->client->shipping_state)Place of Supply : {{$leads->contact->client->shipping_state}}<br>@endif
                    @if($leads->contact->client->client)Contact person : {{$leads->contact->client->client}}<br>@endif
                    @if($leads->contact->client->contact_no)Contact : {{$leads->contact->client->contact_no}}@endif
                </div>
            </td>
            <td class="border-cell">
                <strong>Terms and Conditions:</strong><br>
                {!! nl2br(e($leads->invoice_terms)) !!}
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <table class="items-table" style="width: 100%">
                    <tr>
                        <th>SI</th>
                        <th>Description of Goods</th>
                        <th>HSN/SAC</th>
                        <th>Quantity</th>
                        <th>Rate</th>
                        <th>per</th>
                        <th>Amount</th>
                    </tr>
                    @if(@$leads->leadInvoice->invoiceDetails)
                        @foreach(@$leads->leadInvoice->invoiceDetails as $product)
                        <tr>
                            <td style="text-align: center">{{$loop->iteration}}</td>
                            <td>{{@$product->product->product}}</td>
                            <td style="text-align: center">{{@$product->hsn_code}}</td>
                            <td style="text-align: right">{{@$product->quantity}}</td>
                            <td style="text-align: right">{{@$product->rate}}</td>
                            <td style="text-align: center">{{@$product->unit}}</td>
                            <td style="text-align: right">{{@$product->total_taxable_amount}}</td>
                        </tr>
                        
                        @endforeach
                    @endif
                    <tr>
                        <td colspan="6" style="text-align: right"><strong>Total </strong></td>
                       
                        <td style="text-align: right">{{@$leads->leadInvoice->amount}}</td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td colspan="2" class="border-cell">
                <div style="text-align: right; margin-bottom: 10px;"> E. & O.E</div>
                <div style="margin-top: 10px;">
                    <table style="width: 100%">
                        <tr>
                            
                            <td style="width: 50%; vertical-align: bottom;">
                                <u>Company's PAN</u> : <strong>APCPM1801Q</strong><br><br><br>
                                <u>Declaration</u>:<br>
                                We declare that this invoice shows the actual price of<br>
                                the goods described and that all particulars are true and<br>
                                correct.
                            </td>
                            <td style="width: 50%; text-align: right;">
                                <div   style="text-align: left; ">
                                    <strong><u>Company's Bank Details</u></strong><br>
                                    A/c Holder's Name : Renuka Enterprises<br>
                                    Bank Name : BANK OF INDIA<br>
                                    A/c No. : 010330110000095<br>
                                    Branch & IFS Code : BKID0000103
                                </div>

                                    <div style="vertical-align: bottom; ">
                                        for Renuka Enterprises, (from 1.4.2023) <br><br><br>
                                        Authorised Signatory
                                    </div>
 
                            </td>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>
    </table>
    <div class="footer-text">This is a Computer Generated Invoice</div>
</body>
</html>
