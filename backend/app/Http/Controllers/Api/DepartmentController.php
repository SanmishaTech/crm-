<?php

namespace App\Http\Controllers\Api;

use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\DepartmentResource;
use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\StoreDepartmentRequest;
use App\Http\Requests\UpdateDepartmentRequest;

class DepartmentController extends BaseController
{
    /**
     * Display All Departments.
     */
    public function index(): JsonResponse
    {
        try {
            $departments = Department::all();
            return response()->json($departments);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Store Department.
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
     * Display Department.
     */
    public function show(string $id): JsonResponse
    {
        $department = Department::find($id);

        if(!$department){
            return $this->sendError("Department not found", ['error'=>'Department not found']);
        }
        //  $project->load('users');
        return $this->sendResponse(["Department"=> new DepartmentResource($department)], "Department retrived successfully");
    }

    /**
     * Update Department.
     */
    public function update(UpdateDepartmentRequest $request, string $id): JsonResponse
    {
        $department = Department::find($id);
        if(!$department){
            return $this->sendError("Department not found", ['error'=>'Department not found']);
        }
        $department->name = $request->input('name');
        $department->description = $request->input('description');
        $department->save();
        return $this->sendResponse(["Department"=> new DepartmentResource($department)], "Department Updated successfully");

    }

    /**
     * Delete Department
     */
    public function destroy(string $id): JsonResponse
    {
        $department = Department::find($id);
        if(!$department){
            return $this->sendError("department not found", ['error'=>'department not found']);
        }

        $department->delete();

        return $this->sendResponse([], "department deleted successfully");
    }
}