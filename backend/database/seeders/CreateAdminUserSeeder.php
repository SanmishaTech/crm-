<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Hash;

class CreateAdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create or retrieve the admin user
        $user = User::updateOrCreate(
            ['email' => 'sanjeev@sanmisha.com'], // Search for user by email
            [
                'name' => 'Sanjeev',
                'password' => Hash::make('abcd123') // Hash the password
            ]
        );

        // Create or retrieve the admin role
        $role = Role::firstOrCreate(['name' => 'admin']);
        
        // Retrieve all permissions and sync them to the admin role
        $permissions = Permission::pluck('id', 'id')->all();
        $role->syncPermissions($permissions);

        // Assign the role to the user
        $user->syncRoles([$role->id]); // Use syncRoles to avoid duplication
    }
}
