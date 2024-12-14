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
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id'); 
            $table->unsignedBigInteger('supplier_id'); 
            $table->string("payment_remarks")->nullable();
            $table->string("payment_ref_no",50)->nullable();
            $table->boolean("is_paid")->nullable();
            $table->string("payment_status",20)->nullable();
            $table->string("invoice_no",100)->nullable();
            $table->date("invoice_date")->nullable();
            $table->decimal('total_cgst', 10, 2)->nullable();            //amount not %
            $table->decimal('total_sgst', 10, 2)->nullable();
            $table->decimal('total_igst', 10, 2)->nullable(); 
            $table->decimal('total_tax_amount', 10, 2)->nullable();      //1500
            $table->decimal("total_amount",10,2)->nullable();            //35000
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchases');
    }
};