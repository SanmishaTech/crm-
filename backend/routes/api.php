<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TestController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TasksController;
use App\Http\Controllers\Api\ProjectsController;
use App\Http\Controllers\Api\DepartmentController;
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
 
   Route::get('/logout', [UserController::class, 'logout'])->name('user.logout');
});