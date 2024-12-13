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
        Schema::create('purchase_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('purchase_id');    
            $table->unsignedBigInteger('product_id'); 
            $table->integer("quantity")->nullable();                 //10
            $table->decimal("rate",10,2)->nullable();                      //500
            $table->integer('cgst')->nullable();                 //%
            $table->integer('sgst')->nullable(); 
            $table->integer('igst')->nullable();
            $table->decimal("pre_tax_amount",10,2)->nullable();     //5000
            $table->decimal("post_tax_amount",10,2)->nullable();     //5900
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_details');
    }
};