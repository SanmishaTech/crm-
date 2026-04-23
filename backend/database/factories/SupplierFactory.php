<?php

namespace Database\Factories;

use App\Models\Supplier;
use Database\Factories\SupplierFactory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Supplier>
 */
class SupplierFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Supplier::class;
    public function definition(): array
    {
        return [
            'supplier' => $this->faker->company(),  
            'street_address' => $this->faker->streetAddress(),  
            'area' => $this->faker->word(),  
            'city' => $this->faker->city(),  
            'state' => $this->faker->state(),  
            'pincode' => $this->faker->postcode(),
            'country' => $this->faker->country(),  
            'gstin' => $this->faker->regexify('[A-Z]{2}[0-9]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}'),   
            'contact_name' => $this->faker->name(),  
             'department' => $this->faker->word(),  
            'designation' => $this->faker->jobTitle(),  
            'mobile_1' => $this->faker->unique()->numerify('##########'),   
            'mobile_2' => $this->faker->unique()->numerify('##########'),
            'email' => $this->faker->unique()->safeEmail(),
        ];
    }
}

 