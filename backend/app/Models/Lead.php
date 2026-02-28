<?php

namespace App\Models;

use App\Models\Contact;
use App\Models\Invoice;
use App\Models\Product;
use App\Models\Employee;
use App\Models\FollowUp;
use App\Models\Event;
use App\Models\LeadProduct;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Lead extends Model
{
    protected $fillable = [
        'employee_id',
        'contact_id',
        'invoice_id',
        'assigned_to',
        'lead_number',
        'lead_owner',
        'lead_status',
        'lead_follow_up_date',
        'follow_up_remark',
        'follow_up_type',
        'lead_type',
        'tender_number',
        'portal',
        'tender_category',
        'emd',
        'bid_end_date',
        'tender_status',
        'lead_source',
        'lead_invoice',
        'lead_quotation',
        'previous_lead_quotation',
        'lead_attachment',
        'lead_sale_order',
        'lead_audit_report',
        'lead_atr_report',
        'lead_closing_reason',
        'total_taxable',
        'total_gst',
        'total_amount_with_gst',
        'quotation_date',
        'quotation_number',
        'terms',
        'quotation_version',
        'invoice_number',
        'invoice_date',
        'mode_of_payment',
        'ref_no',
        'other_ref',
        'buyer_order_no',
        'buyers_date',
        'invoice_terms',
        'report_version',
    ];

    protected $casts = [
        'bid_end_date' => 'date:Y-m-d',
        'lead_follow_up_date' => 'date:Y-m-d',
    ];

    public function contact()
    {
        return $this->belongsTo(Contact::class , 'contact_id');
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class , 'employee_id');
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class , 'assigned_to');
    }

    public function followUps()
    {
        return $this->hasMany(FollowUp::class , 'lead_id');
    }

    public function events()
    {
        return $this->hasMany(Event::class , 'lead_id');
    }

    public function leadProducts()
    {
        return $this->hasMany(LeadProduct::class);
    }

    public function leadInvoice()
    {
        return $this->belongsTo(Invoice::class , 'invoice_id');
    }

    public function updateLeadProducts()
    {
        return $this->belongsToMany(Product::class , 'lead_products')
            ->withPivot('id', 'lead_id', "product_id", 'quantity', 'rate', 'gst_rate', 'gst_amount', 'total_amount', 'amount_without_gst');
    }


}