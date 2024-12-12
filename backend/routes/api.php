<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ClientsController;
use App\Http\Controllers\Api\ContactsController;
use App\Http\Controllers\Api\ProductsController;
use App\Http\Controllers\Api\SuppliersController;
use App\Http\Controllers\Api\EmployeesController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\ProductCategoriesController;



Route::post('/login', [UserController::class, 'login']);

Route::group(['middleware'=>['auth:sanctum', 'permission']], function(){
   Route::resource('clients', ClientsController::class); 
   Route::resource('contacts', ContactsController::class);
   Route::resource('suppliers', SuppliersController::class);    
   Route::resource('departments', DepartmentController::class);  
   Route::resource('employees', EmployeesController::class);  
   Route::post('/employees/resignation/{id}', [EmployeesController::class, 'resignation'])->name("employee.resignation");
   Route::resource('products', ProductsController::class);  
   Route::resource('product_categories', ProductCategoriesController::class);  
   Route::get('/logout', [UserController::class, 'logout'])->name('user.logout');
});