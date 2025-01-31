<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\LeadsController;
use App\Http\Controllers\Api\VendorController;
use App\Http\Controllers\Api\ClientsController;
use App\Http\Controllers\Api\ReplaceController;
use App\Http\Controllers\Api\ContactsController;
use App\Http\Controllers\Api\InvoicesController;
use App\Http\Controllers\Api\ProductsController;
use App\Http\Controllers\Api\EmployeesController;
use App\Http\Controllers\Api\FollowUpsController;
use App\Http\Controllers\Api\PurchasesController;
use App\Http\Controllers\Api\SuppliersController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\ProductCategoriesController;



Route::post('/login', [UserController::class, 'login']);

Route::group(['middleware'=>['auth:sanctum', 'permission','request.null']], function(){
   Route::resource('clients', ClientsController::class); 
   Route::resource('leads', LeadsController::class); 
   Route::resource('contacts', ContactsController::class);
   Route::resource('suppliers', SuppliersController::class);    
   Route::resource('vendors', VendorController::class);
   Route::resource('departments', DepartmentController::class);  
   Route::resource('employees', EmployeesController::class);  
   Route::post('/follow_ups', [FollowUpsController::class, 'store'])->name("follow_ups.store");
   Route::get('/follow_ups/{id}', [FollowUpsController::class, 'show'])->name("follow_ups.show");
   Route::get('/follow_ups', [FollowUpsController::class, 'index'])->name("follow_ups.index");

   Route::put('/employee_resignation/{id}', [EmployeesController::class, 'resignation'])->name("employee.resignation");
   Route::resource('products', ProductsController::class);  
   Route::resource('product_categories', ProductCategoriesController::class);  
   Route::get('/logout', [UserController::class, 'logout'])->name('user.logout');

   Route::post('/purchase', [PurchasesController::class, 'purchase'])->name("purchase.products");
   Route::get('/purchase/{id}', [PurchasesController::class, 'show'])->name("purchase.show");
   Route::get('/purchase', [PurchasesController::class, 'index'])->name("purchase.index");
   
   Route::get('/all_product_categories', [ProductCategoriesController::class, 'allProductCategories'])->name("product_categories.all");
   Route::get('/all_suppliers', [SuppliersController::class, 'allSuppliers'])->name("suppliers.all");
   Route::get('/all_clients', [ClientsController::class, 'allClients'])->name("clients.all");
   Route::get('/all_products', [ProductsController::class, 'allProducts'])->name("products.all");
   Route::get('/follow_up_types', [LeadsController::class, 'follow_up_types'])->name("follow_up_types.index");
   Route::get('/lead_status', [LeadsController::class, 'leadStatus'])->name("lead_status.index");
   Route::get('/close_lead/{id}', [LeadsController::class, 'closeLead'])->name("close_lead.update");
   Route::post('/generate_quotation/{id}', [LeadsController::class, 'generateQuotation'])->name("generate_quotation.generate");
   Route::get('/generate_lead_report/{id}', [LeadsController::class, 'generateReport'])->name("generate_report.generate");
   Route::get('/generate_invoice/{id}', [LeadsController::class, 'generateInvoice'])->name("generate_invoice.generate");
   Route::get('/invoices', [InvoicesController::class, 'index'])->name("invoices.index");
   Route::get('/show_invoice/{files}', [InvoicesController::class, 'showInvoice'])->name("invoices.showFiles");
   Route::get('/all_departments', [DepartmentController::class, 'allDepartments'])->name("departments.all");
   Route::get('/all_contacts', [ContactsController::class, 'allContacts'])->name("contacts.all");
   Route::get('/all_leads', [LeadsController::class, 'allLeads'])->name("leads.all");
   Route::get('/lead_attachments/{files}', [LeadsController::class, 'showLeadAttachment'])->name("leads.lead_attachment");
   Route::get('/invoices/{id}', [InvoicesController::class, 'show'])->name("invoices.show");
   Route::put('/invoices/{id}', [InvoicesController::class, 'update'])->name("invoices.update");


   Route::resource('replacements', ReplaceController::class);    
   Route::get('/all_replacements', [ReplaceController::class, 'allReplaces'])->name("replacements.all");


});