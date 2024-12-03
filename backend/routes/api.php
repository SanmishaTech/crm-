<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TestController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\LeadsController;
use App\Http\Controllers\Api\RolesController;
use App\Http\Controllers\Api\TasksController;
use App\Http\Controllers\Api\ProjectsController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\PermissionsController;
use App\Http\Controllers\Api\TaskSubmissionsController;
use App\Http\Controllers\Api\RolesPermissionsController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');



Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

Route::group(['middleware'=>['auth:sanctum', 'permission']], function(){
   Route::get('/permissions', [RolesPermissionsController::class, 'index'])->name('permissions.index');
   Route::resource('projects', ProjectsController::class); 
   Route::resource('departments', DepartmentController::class);  
   Route::resource('roles', RolesController::class);
   Route::resource('permissions', PermissionsController::class);    
   Route::resource('leads', LeadsController::class);    

   Route::get('/logout', [UserController::class, 'logout'])->name('user.logout');
});