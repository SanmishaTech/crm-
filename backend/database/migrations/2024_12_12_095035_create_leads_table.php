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
            $table->string("lead_type",100)->nullable();
            $table->string("tender_number")->nullable();
            $table->string("portal")->nullable();
            $table->string("tender_category")->nullable();
            $table->decimal("emd",10,2)->nullable();
            $table->date("bid_end_date")->nullable();
            $table->string("tender_status")->nullable();
            $table->string("lead_status")->nullable();
            $table->string("lead_source")->nullable();
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