<?php

namespace App\Http\Controllers\Api;

use Validator;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Permission;
use App\Http\Controllers\Api\BaseController;

class RolesController extends BaseController
{
    /**
     * All Roles.
     */
    public function index(): JsonResponse
    {
        $roles = Role::all();
        return $this->sendResponse(['Role'=>$roles], "Roles retrived successfully");
    }

    /**
     * Store Role.
     */
    public function store(Request $request)
    {
                
        $validator = Validator::make($request->all(), [
            'name'=>'required|string|max:255',
       ]);

     
       if($validator->fails()){
           return $this->sendError('Validation Error.', $validator->errors());
       }

        $role = new Role();
        $role->name = $request->input('name');
        $role->save();
        return $this->sendResponse(['Role'=>$role], "Role Stored successfully");

    }

    /**
     * Display Role.
     */
    public function show(string $id)
    {
        $role = Role::find($id);
        if(!$role){
            return $this->sendError('Role not found.', ['Error'=> 'Role not found'] );
        }

        // $permissions = Permission::all();
        // $rolesPermissions = $role->permissions;
        return $this->sendResponse(['Role'=>$role], "Role and Permisions retrived successfully");
    }

    /**
     * Update Role.
     */
    public function update(Request $request, string $id)
    {
        $role = Role::find($id);
        if(!$role){
            return $this->sendError('Role not found.', ['Error'=> 'Role not found'] );
        }

        $validator = Validator::make($request->all(), [
            'name'=>'required|string|max:255',
       ]);
    

       if($validator->fails()){
           return $this->sendError('Validation Error.', $validator->errors());
       }
         $role->name = $request->input('name');
         if ($request->has('permissions')) {
            $role->syncPermissions($request->input('permissions')); 
        }
         $role->save();
         return $this->sendResponse(['Role'=>$role], "Role updated successfully");

    }

    /**
     * Remove Role.
     */
    public function destroy(string $id)
    {
        $role = Role::find($id);
        if(!$role){
            return $this->sendError('Role not found.', ['Error'=> 'Role not found'] );
        }

        $role->delete();
        return $this->sendResponse([], "Role Deleted successfully");

    }
}