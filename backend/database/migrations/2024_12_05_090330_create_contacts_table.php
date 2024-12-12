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
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("client_id")->nullable();
            $table->string("contact_person")->nullable();
            $table->string("department", 100)->nullable();
            $table->string("designation", 100)->nullable();
            $table->string("mobile_1", 20)->nullable();
            $table->string("mobile_2", 20)->nullable();
            $table->string("email" , 100)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};