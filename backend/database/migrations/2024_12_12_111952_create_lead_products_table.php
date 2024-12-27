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
        Schema::create('lead_products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('lead_id'); 
            $table->unsignedBigInteger('product_id');
            $table->integer("quantity")->nullable();
            $table->decimal("rate",10,2)->nullable();
            $table->integer("gst_rate")->nullable();
            $table->decimal("gst_amount",10,2)->nullable();
            $table->decimal("amount_without_gst",10,2)->nullable();
            $table->decimal("total_amount",10,2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lead_products');
    }
};