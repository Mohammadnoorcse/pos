<?php

namespace Database\Seeders;

use App\Models\AdminRole;
use App\Models\Branch;
use App\Models\BranchRole;
use App\Models\Brand;
use App\Models\Category;
use App\Models\CrmPermission;
use App\Models\UnitType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $owner = User::create([
            'name' => 'Sohag Ahmed Moon',
            'email' => 'owner@myshop.test',
            'password' => Hash::make('password'),
            'user_type' => 'owner',
        ]);

        $branches = [
            ['name' => 'My Shop', 'address' => 'Shop-1205, Mirpur-10, Dhaka-1216', 'type' => 'shop'],
            ['name' => 'My Business', 'address' => 'Dhaka', 'type' => 'shop'],
            ['name' => 'Godown Gulshan', 'address' => 'Pallabi, Mirpur-12, Dhaka', 'type' => 'godown'],
            ['name' => 'Godown Kadamtali', 'address' => 'Chowrasta, Gazipur', 'type' => 'godown'],
        ];
        foreach ($branches as $b) {
            Branch::create($b);
        }

        foreach (['Aarong', 'Yellow', 'Ecstasy', 'Sailor', 'Richman'] as $name) {
            Brand::create(['name' => $name]);
        }

        foreach (['Panjabi', 'Shirt', 'Jeans', 'T-Shirt', 'Kids Wear', 'Saree'] as $name) {
            Category::create(['name' => $name]);
        }

        foreach ([['Pieces', 'Pcs'], ['Kilogram', 'Kg'], ['Dozen', 'Dz'], ['Box', 'Box']] as [$n, $s]) {
            UnitType::create(['name' => $n, 'short' => $s]);
        }

        foreach (['Accounts', 'Admin Manager'] as $name) {
            AdminRole::create(['name' => $name]);
        }

        foreach (['Manager', 'Assistant Manager', 'Branch Manager 1'] as $name) {
            BranchRole::create(['name' => $name]);
        }

        foreach (['crm.lead.view', 'crm.lead.create', 'crm.follow.up.reminder', 'crm.customer.notes', 'crm.deal.pipeline'] as $name) {
            CrmPermission::create(['name' => $name]);
        }
    }
}
