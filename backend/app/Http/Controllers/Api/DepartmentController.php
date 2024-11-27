<?php

namespace App\Http\Controllers\Api;

use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\DepartmentResource;
use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\StoreDepartmentRequest;

class DepartmentController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $authUser = auth()->user()->roles->pluck('name')->first();
        if($authUser == 'admin'){
            $department = Department::all();
            return $this->sendResponse(['Department'=> DepartmentResource::collection($department)], "department retrived successfuly");

        } elseif($authUser == 'member'){
            // $projects = auth()->user()->projects()->users()->get();  //auth()->user()->projects()->users()->get();   or auth()->user()->projects()->with("users")->get();
            $department = auth()->user()->profile()->department()->first();  //this is efficient way
            return $this->sendResponse(['Department'=> DepartmentResource::collection($department)], "department retrived successfuly");

        }
    //    2 returns
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDepartmentRequest $request): JsonResponse
    {
        $department = new Department();
        $department->name = $request->input("name");
        $department->description = $request->input("description");
        $department->save();
        
        return $this->sendResponse(['Department'=> new DepartmentResource($department)], 'Department Created Successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}