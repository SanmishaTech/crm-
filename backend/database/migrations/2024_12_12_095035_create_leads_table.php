<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id'); 
            $table->unsignedBigInteger('contact_id');
            $table->unsignedBigInteger('invoice_id')->nullable();
            $table->string("lead_number",20)->nullable(); 
            $table->string("lead_owner",100)->nullable(); 
            $table->string("lead_status",100)->default("Open"); 
            $table->date("lead_follow_up_date")->nullable();
            $table->string("follow_up_remark")->nullable(); 
            $table->string("follow_up_type")->nullable(); 
            $table->string("lead_type",100)->nullable();
            $table->string("tender_number")->nullable();
            $table->string("portal")->nullable();
            $table->string("tender_category")->nullable();
            $table->boolean("emd")->nullable();
            $table->date("bid_end_date")->nullable();
            $table->string("tender_status")->nullable();
            $table->string("lead_source")->nullable();
            $table->string("lead_invoice")->nullable(); 
            $table->string("lead_quotation")->nullable(); 
            $table->string("lead_attachment")->nullable(); 
            $table->string("lead_closing_reason")->nullable(); 
            $table->string("deal_details")->nullable(); 
            // 
            $table->decimal("total_taxable",10,2)->nullable(); 
            $table->decimal("total_gst",10,2)->nullable(); 
            $table->decimal("total_amount_with_gst",10,2)->nullable(); 
            //
            $table->date("quotation_date")->nullable();
            $table->string("quotation_number")->nullable(); 
            $table->string("terms")->nullable(); 
            $table->unsignedBigInteger("quotation_version")->default(0); 


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};

// create api for follow_up_type config
// lead_invoice_path
// lead_quotation_path
// quotation_attchment_path lead columns
// lead close reason column