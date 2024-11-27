<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Permission;
use App\Http\Controllers\Api\BaseController;

class RolesPermissionsController extends BaseController
{
     /**
     * Get All Permissions/Roles
     */
    public function index(){
        $roles = Role::all();
        $permissions = Permission::all();
        $users = User::all();

        return $this->sendResponse(['roles'=>$roles, 'permissions'=>$permissions, 'users'=>$users], "data retrived successfully");
    }

}