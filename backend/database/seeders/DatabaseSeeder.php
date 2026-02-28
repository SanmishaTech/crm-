<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\SupplierSeeder;
use Database\Seeders\CreateAdminUserSeeder;
use Database\Seeders\ProductCategorySeeder;
use Database\Seeders\CreateMemberUserSeeder;
use Database\Seeders\CreateAccountsUserSeeder;
use Database\Seeders\CreateAdditionalRolesSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $this->call(CreateAdminUserSeeder::class);
        $this->call(SupplierSeeder::class);
        $this->call(ProductCategorySeeder::class);
        $this->call(CreateAdditionalRolesSeeder::class);


    }
}