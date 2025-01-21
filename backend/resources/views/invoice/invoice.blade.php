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
                Contact : 0251-2480403,9870201624<br>
                E-Mail : sales.renukaenter@rediffmail.com
            </td>
            <td style="width: 40%;" class="border-cell">
                <table style="width: 100%">
                    <tr>
                        <td>Invoice No.</td>
                        <td>RE/138/24-25</td>
                    </tr>
                    <tr>
                        <td>Dated</td>
                        <td>18-Jan-25</td>
                    </tr>
                    <tr>
                        <td>Mode/Terms of Payment</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Reference No. & Date</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Other References</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Buyer's Order No.</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Dated</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Terms of Delivery</td>
                        <td></td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td class="border-cell">
                <div style="margin-bottom: 15px;">
                    <strong>Consignee (Ship to)</strong><br>
                    Electro Trade Link (Dr)<br>
                    1-2/ 501, Jaydeep Park, Main Road, Majiwada<br>
                    Gaon, Thane West<br>
                    GSTIN/UIN : 27ADGPM7595P1ZI<br>
                    State Name : Maharashtra, Code : 27<br>
                    Contact person : Mr. Avinash Kamble<br>
                    Contact : 9870201624
                </div>
                <hr style="border-top: 1px solid #000; margin: 10px 0;">
                <div>
                    <strong>Buyer (Bill to)</strong><br>
                    Electro Trade Link (Dr)<br>
                    1-2/ 501, Jaydeep Park, Main Road, Majiwada<br>
                    Gaon, Thane West<br>
                    GSTIN/UIN : 27ADGPM7595P1ZI<br>
                    State Name : Maharashtra, Code : 27<br>
                    Place of Supply : Maharashtra<br>
                    Contact person : Mr. Avinash Kamble<br>
                    Contact : 9870201624
                </div>
            </td>
            <td class="border-cell">
                <strong>Terms and Conditions:</strong><br>
                1. Goods once sold will not be taken back.<br>
                2. Interest @18% p.a. will be charged if the payment is not made within the stipulated time.<br>
                3. Subject to Mumbai Jurisdiction.<br>
                4. Our responsibility ceases once the goods leave our premises.<br>
                5. Payment should be made by crossed cheque/DD only.
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
                        <td colspan="6" style="text-align: right"><strong>Total</strong></td>
                        <td style="text-align: right">{{@$leads->leadInvoice->amount}}</td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td colspan="2" class="border-cell">
                <div style="text-align: right; margin-bottom: 10px;">E. & O.E</div>
                <div style="margin-top: 10px;">
                    <table style="width: 100%">
                        <tr>
                            <td style="width: 50%; vertical-align: top;">
                                Company's PAN : APCPM1801Q<br>
                                Declaration:<br>
                                We declare that this invoice shows the actual price of<br>
                                the goods described and that all particulars are true and<br>
                                correct.
                            </td>
                            <td style="width: 50%; text-align: right;">
                                <div class="bank-details" style="text-align: left; margin-bottom: 20px;">
                                    <strong>Company's Bank Details</strong><br>
                                    A/c Holder's Name : Renuka Enterprises<br>
                                    Bank Name : BANK OF INDIA<br>
                                    A/c No. : 010330110000095<br>
                                    Branch & IFS Code : BKID0000103
                                </div>
                                for Renuka Enterprises, (from 1.4.2023)<br><br><br>
                                Authorised Signatory
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
