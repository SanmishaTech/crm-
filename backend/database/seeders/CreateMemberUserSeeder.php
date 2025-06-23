<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employee;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class CreateMemberUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         // Create or retrieve the admin role
        $role = Role::firstOrCreate(['name' => 'sales']);
        $permissions = Permission::pluck('id', 'id')->all();
        $role->syncPermissions($permissions);

        $user = User::where('email', 'user2@gmail.com')->first();

        if (!$user) {
            return;
        }

        $user->syncRoles([$role->id]);  //used assign to that multiple role can use asige else use synce

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