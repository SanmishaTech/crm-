<?php

namespace App\Http\Controllers\Api;

use Validator;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Artisan;
use Spatie\Permission\Models\Permission;
use App\Http\Controllers\Api\BaseController;

class PermissionsController extends BaseController
{
    /**
     * All Permissions.
     */
    public function index(): JsonResponse
    {
        $permissions = Permission::all();
        return $this->sendResponse(['Permission'=>$permissions], "Permissions retrived successfully");
    }

    /**
     * Store permission.
     */
    public function store(Request $request)
    {
        Artisan::call('permissions:generate');
     
        return $this->sendResponse([], "Permissions Generated successfully");

    }

   
}