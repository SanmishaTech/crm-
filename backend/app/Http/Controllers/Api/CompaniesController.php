<?php

namespace App\Http\Controllers\Api;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\CompanyResource;
use App\Http\Controllers\Api\BaseController;

class CompaniesController extends BaseController
{
    /**
     * Display Company.
     */
    public function index(): JsonResponse
    {
        $companies = Company::all();
        return $this->sendResponse(['Companies'=> CompanyResource::collection($companies)], "Company retrived successfuly");

    }

    /**
     * Store Company.
     */
    public function store(Request $request): JsonResponse
    {
        $company = new Company();
        $company->name = $request->input("name");
        $company->gst_number = $request->input("gst_number");
        $company->pan_number = $request->input("pan_number");
        $company->address = $request->input("address");
        $company->save();
        return $this->sendResponse(['Company'=> new CompanyResource($company)], "Company Stored successfuly");

    }

    /**
     * Display Company.
     */
    public function show(string $id): JsonResponse
    {
        $company = Company::find($id);
        if(!$company){
            return $this->sendError("Company not found.", ['Error'=> "Company not found"]);
        }
        return $this->sendResponse(['Company'=> new CompanyResource($company)], "Company retrived successfuly");

    }

    /**
     * Update Company.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $company = Company::find($id);
        if(!$company){
            return $this->sendError("Company not found.", ['Error'=> "Company not found"]);
        }

        $company->name = $request->input("name");
        $company->gst_number = $request->input("gst_number");
        $company->pan_number = $request->input("pan_number");
        $company->address = $request->input("address");
        $company->save();
        return $this->sendResponse(['Company'=> new CompanyResource($company)], "Company Updated successfuly");
         
    }

    /**
     * Remove Company.
     */
    public function destroy(string $id): JsonResponse
    {
        $company = Company::find($id);
        if(!$company){
            return $this->sendError("Company not found.", ['Error'=> "Company not found"]);
        }
         $company->delete();
         return $this->sendResponse([], "Company Deleted successfuly");
    }
}