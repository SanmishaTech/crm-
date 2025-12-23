<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\EmployeeResource;
use App\Http\Requests\ResignationRequest;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\UpdateEmployeeRequest;

   /**
     * @group Employee Management
     */
    
class EmployeesController extends BaseController
{
    /**
     * Display All Employees.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Employee::with("department");

        if ($request->query('search')) {
            $searchTerm = $request->query('search');
    
            $query->where(function ($query) use ($searchTerm) {
                $query->where('employee_name', 'like', '%' . $searchTerm . '%');
            });
        }
        $employees = $query->paginate(9);

        return $this->sendResponse(["Employees"=>EmployeeResource::collection($employees),
        'pagination' => [
            'current_page' => $employees->currentPage(),
            'last_page' => $employees->lastPage(),
            'per_page' => $employees->perPage(),
            'total' => $employees->total(),
        ]], "Employees retrieved successfully");
    }

    /**
     * Store Employees.
     * @bodyParam employee_name string The name of the Employee.
     * @bodyParam email string The name of the Employee.
     * @bodyParam active string The name of the Employee.
     * @bodyParam password string The name of the Employee.
     * @bodyParam role string The name of the Employee.
     * @bodyParam department_id string The name of the Employee.
     * @bodyParam mobile string The name of the Employee.
     * @bodyParam joining_date string The name of the Employee.
     */
    public function store(Request $request): JsonResponse
    {
        // Create user
        $user = User::create([
            'name' => $request->input('employee_name'),
            'email' => $request->input('email'),
            'password' => Hash::make('password'),
        ]);

        $roleName = $request->input('role_name');

        // Assign role (admin, sales, or accounts) and sync to column
        if (in_array($roleName, ['admin', 'sales', 'accounts'])) {
            $user->role = $roleName;
            $user->save();
            $user->assignRole($roleName);
        }

        // Create employee
        $employee = Employee::create([
            'user_id' => $user->id,
            'employee_name' => $request->input('employee_name'),
            'department_id' => $request->input('department_id'),
            'designation' => $request->input('designation'),
            'email' => $request->input('email'),
            'mobile' => $request->input('mobile'),
            'joining_date' => $request->input('joining_date'),
        ]);

        return $this->sendResponse(new EmployeeResource($employee), 'Employee created successfully.');
    }

    /**
     * Show Employee.
     */
    public function show(string $id): JsonResponse
    {
        $employee = Employee::find($id);

        if(!$employee){
            return $this->sendError("Employee not found", ['error'=>'Employee not found']);
        }
        $user = User::find($employee->user_id);
        return $this->sendResponse(['User'=> new UserResource($user), 'Employee'=>new EmployeeResource($employee)], "Employee retrived successfully");
    }

    /**
     * Update Employee.
     * @bodyParam employee_name string The name of the Employee.
     * @bodyParam email string The name of the Employee.
     * @bodyParam active string The name of the Employee.
     * @bodyParam password string The name of the Employee.
     * @bodyParam role string The name of the Employee.
     * @bodyParam department_id string The name of the Employee.
     * @bodyParam mobile string The name of the Employee.
     * @bodyParam joining_date string The name of the Employee.
     */
    public function update(UpdateEmployeeRequest $request, string $id): JsonResponse
    {
        $employee = Employee::find($id);

        if(!$employee){
            return $this->sendError("Employee not found", ['error'=>'Employee not found']);
        }
        $user = User::find($employee->user_id);
        $user->name = $request->input('employee_name');
        $user->email = $request->input('email');
        $user->active = $request->input('active');
        $user->password = Hash::make($request->input('password'));
        
        // Remove all roles first
        $user->roles()->detach();
        
        $roleName = $request->input('role_name');

        // Assign new role (admin, sales, or accounts) and sync to column
        if (in_array($roleName, ['admin', 'sales', 'accounts'])) {
            $user->role = $roleName;
            $user->assignRole($roleName);
        } else {
            $user->role = null;
        }
        
        $user->save();

        $employee->employee_name = $request->input('employee_name');
        $employee->designation = $request->input('designation');
        $employee->department_id = $request->input('department_id');
        $employee->email = $request->input('email');
        $employee->mobile = $request->input('mobile');
        $employee->joining_date = $request->input('joining_date');
        $employee->save();

        return $this->sendResponse(['User'=> new UserResource($user), 'Employee'=>new EmployeeResource($employee)], "Employees updated successfully");
    }

    /**
     * Remove Employee.
     */
    public function destroy(string $id): JsonResponse
    {
        $employee = Employee::find($id);
        if(!$employee){
            return $this->sendError("employee not found", ['error'=> 'employee not found']);
        }
        $user = User::find($employee->user_id);
        $employee->delete();
        $user->delete();
        return $this->sendResponse([], "employee deleted successfully");
    }

    /**
     * get all employees.
     */
    public function allEmployees(): JsonResponse
    {
        $users = \App\Models\User::all();
        return $this->sendResponse(\App\Http\Resources\UserResource::collection($users), "employees retrieved successfully");
    }



    /**
     * resignation.
     */
    // public function resignation(Request $request, string $id): JsonResponse
    // {
    //     $employee = Employee::find($id);
    //     if(!$employee){
    //         return $this->sendError("employee not found", ['error'=>'employee not found']);
    //     }
    //     $activeVal = 1;
    //     $inactiveVal = 0;
        
    //     $user = User::find($employee->user_id);
    //     if(!empty($request->input('resignation_date'))){
    //         $employee->resignation_date = $request->input('resignation_date');
    //         $employee->save();
    //         $user->active = $inactiveVal;
    //         $user->save();
    //     }
    //     else{
    //         $user->active = $inactiveVal;
    //         $user->save();
    //     }
      
       
    //     return $this->sendResponse(['User'=> new UserResource($user), 'Employee'=>new EmployeeResource($employee)], "employee data updated successfully");
    // }
    public function resignation(ResignationRequest $request, string $id): JsonResponse
    {
        $employee = Employee::find($id);
        if (!$employee) {
            return $this->sendError("employee not found", ['error' => 'employee not found']);
        }
    
        $activeVal = 1;
        $inactiveVal = 0;
    
        $user = User::find($employee->user_id);
    
        // Check if resignation_date is null or an empty string
        $resignationDate = $request->input('resignation_date');
        if ($resignationDate !== null && $resignationDate !== "") {
            $carbonDate = Carbon::parse($resignationDate);
            $today = Carbon::today();
    
            // If the resignation date is in the future, return a validation error
            if ($carbonDate->gt($today)) {
                return $this->sendError('Validation Error', ['error' => 'Resignation date cannot be in the future']);
            }
            
            $employee->resignation_date = $resignationDate;
            $employee->save();
            $user->active = $inactiveVal;
            $user->save();
            // dd("if working");
        } else {
            // If resignation_date is empty or null, set the user status to inactive
            $employee->resignation_date = $resignationDate;
            $employee->save();
            $user->active = $activeVal;
            $user->save();
            // dd("else working");
        }
    
        return $this->sendResponse(['User' => new UserResource($user), 'Employee' => new EmployeeResource($employee)], "employee data updated successfully");
    }
    
    
     
    
}