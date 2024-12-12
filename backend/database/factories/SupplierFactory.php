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
            'email' => $this->faker->unique()->safeEmail(),
            // 'country' => $this->faker->country(),
            'street_address' => $this->faker->streetAddress(),
            'area' => $this->faker->word(),
            'city' => $this->faker->city(),
        ];
    }
}