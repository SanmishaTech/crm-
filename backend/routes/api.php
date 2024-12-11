<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TestController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\LeadsController;
use App\Http\Controllers\Api\RolesController;
use App\Http\Controllers\Api\TasksController;
use App\Http\Controllers\Api\ContactsController;
use App\Http\Controllers\Api\ProductsController;
use App\Http\Controllers\Api\ProjectsController;
use App\Http\Controllers\Api\CompaniesController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\PermissionsController;
use App\Http\Controllers\Api\TaskSubmissionsController;
use App\Http\Controllers\Api\RolesPermissionsController;
use App\Http\Controllers\Api\ProductCategoriesController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');



Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

Route::group(['middleware'=>['auth:sanctum', 'permission']], function(){
   Route::get('/permissions', [RolesPermissionsController::class, 'index'])->name('permissions.index');
   Route::resource('projects', ProjectsController::class); 
   Route::resource('departments', DepartmentController::class);  
   Route::resource('products', ProductsController::class);  
   Route::resource('companies', CompaniesController::class);  
   Route::resource('contacts', ContactsController::class);  
   Route::resource('product_categories', ProductCategoriesController::class);  
   Route::resource('roles', RolesController::class);
   Route::resource('permissions', PermissionsController::class);    
   Route::resource('leads', LeadsController::class);    
   Route::post('/users', [UserController::class, 'store'])->name("users.store");
   Route::put('/users/{id}', [UserController::class, 'update'])->name("users.update");
   Route::get('/users', [UserController::class, 'index'])->name("users.index");
   Route::get('/users/{id}', [UserController::class, 'show'])->name("users.show");
   Route::get('/department_search',[DepartmentController::class, 'search'])->name("department.search");  

   Route::delete('/users/{id}', [UserController::class, 'destroy'])->name("users.destroy");

   Route::get('/logout', [UserController::class, 'logout'])->name('user.logout');
});