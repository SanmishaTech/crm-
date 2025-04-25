<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employee;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;

class CreateAccountsUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create or retrieve the accounts user
        $user = User::updateOrCreate(
            ['email' => 'user3@gmail.com'],
            [
                'name' => 'user 3',
                'password' => Hash::make('abcd123')
            ]
        );

        // Create or retrieve the accounts role
        $role = Role::firstOrCreate(['name' => 'accounts']);

        // Retrieve all permissions and sync them to the accounts role
        $permissions = Permission::pluck('id', 'id')->all();
        $role->syncPermissions($permissions);

        // Assign the role to the user
        $user->syncRoles([$role->id]);

        // Update or create employee profile
        $profile = Employee::where('user_id', $user->id)->first();
        if ($profile) {
            $profile->employee_name = $user->name;
            $profile->email = $user->email;
            $profile->save();
            return;
        }

        $profile = new Employee();
        $profile->user_id = $user->id;
        $profile->employee_name = $user->name;
        $profile->email = $user->email;
        $profile->save();
    }
}
