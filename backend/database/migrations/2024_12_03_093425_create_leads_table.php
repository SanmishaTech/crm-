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
            $table->unsignedBigInteger("profile_id");
            $table->string("owner_name")->nullable();
            $table->string("company")->nullable();
            $table->string("first_name")->nullable();
            $table->string("last_name")->nullable();
            $table->string("title")->nullable();
            $table->string("email")->nullable();
            $table->string("mobile")->nullable();
            $table->string("fax")->nullable();
            $table->string("telephone")->nullable();
            $table->string("website")->nullable();
            $table->string("lead_source")->nullable();
            $table->string("lead_status")->nullable();
            $table->string("industry")->nullable();
            $table->integer("no_of_employees")->nullable();
            $table->decimal("annual_revenue",10,2)->nullable();
            $table->string("ratings")->nullable();
            $table->string("skype_id")->nullable();
            $table->string("secondary_email")->nullable();
            $table->string("twitter_id")->nullable();
            $table->string("street")->nullable();
            $table->string("city")->nullable();
            $table->string("state")->nullable();
            $table->string("zip_code")->nullable();
            $table->string("country")->nullable();
            $table->string("description")->nullable();
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