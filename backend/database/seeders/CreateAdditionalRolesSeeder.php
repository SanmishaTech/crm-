<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Str;

class CreateAdditionalRolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates new roles used in the system without assigning users.
     */
    public function run(): void
    {
        $newRoles = [
            'Enquiry',
            'Follow up',
            'Audit',
            'ATR',
            'Payment'
        ];

        // Get all permissions that do not start with the restricted prefixes
        $restrictedPrefixes = ['roles.', 'permissions.', 'departments.', 'employees.', 'employee.'];

        $permissionsToAssign = Permission::all()->filter(function ($permission) use ($restrictedPrefixes) {
            foreach ($restrictedPrefixes as $prefix) {
                if (Str::startsWith($permission->name, $prefix)) {
                    return false;
                }
            }
            return true;
        })->pluck('id')->toArray();

        foreach ($newRoles as $roleName) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            // Give these roles the filtered full-access permissions
            $role->syncPermissions($permissionsToAssign);
        }
    }
}
