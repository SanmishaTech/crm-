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
    {   //else use wiil table format
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("product_category_id")->nullable();
            $table->unsignedBigInteger("supplier_id")->nullable();
            $table->string("product")->nullable();
            $table->string("model")->nullable();
            $table->string("manufacturer")->nullable();
            $table->integer("opening_qty")->nullable();
            $table->integer("closing_qty")->nullable();
            $table->decimal("last_traded_price", 10,2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};