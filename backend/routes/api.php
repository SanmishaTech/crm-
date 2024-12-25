<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\LeadsController;
use App\Http\Controllers\Api\ClientsController;
use App\Http\Controllers\Api\ContactsController;
use App\Http\Controllers\Api\ProductsController;
use App\Http\Controllers\Api\EmployeesController;
use App\Http\Controllers\Api\FollowUpsController;
use App\Http\Controllers\Api\PurchasesController;
use App\Http\Controllers\Api\SuppliersController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\ProductCategoriesController;



Route::post('/login', [UserController::class, 'login']);

Route::group(['middleware'=>['auth:sanctum', 'permission']], function(){
   Route::resource('clients', ClientsController::class); 
   Route::resource('leads', LeadsController::class); 
   Route::resource('contacts', ContactsController::class);
   Route::resource('suppliers', SuppliersController::class);    
   Route::resource('departments', DepartmentController::class);  
   Route::resource('employees', EmployeesController::class);  
   Route::post('/follow_ups', [FollowUpsController::class, 'store'])->name("follow_ups.store");
   Route::get('/follow_ups/{id}', [FollowUpsController::class, 'show'])->name("follow_ups.show");
   Route::post('/employees/resignation/{id}', [EmployeesController::class, 'resignation'])->name("employee.resignation");
   Route::resource('products', ProductsController::class);  
   Route::resource('product_categories', ProductCategoriesController::class);  
   Route::get('/logout', [UserController::class, 'logout'])->name('user.logout');
   Route::post('/purchase', [PurchasesController::class, 'purchase'])->name("purchase.products");
   Route::get('/purchase/{id}', [PurchasesController::class, 'show'])->name("purchase.show");
   Route::get('/purchase', [PurchasesController::class, 'index'])->name("purchase.index");
   Route::get('/all_product_categories', [ProductCategoriesController::class, 'allProductCategories'])->name("product_categories.all");
   Route::get('/all_suppliers', [SuppliersController::class, 'allSuppliers'])->name("suppliers.all");
   Route::get('/follow_up_types', [LeadsController::class, 'follow_up_types'])->name("follow_up_types.index");

});