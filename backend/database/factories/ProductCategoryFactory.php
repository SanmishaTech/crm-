<?php

namespace Database\Factories;

use App\Models\ProductCategory;
use Database\Factories\ProductCategoryFactory;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductCategoryFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
  

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = ProductCategory::class;
    public function definition(): array
    {
        return [
            'product_category' => $this->faker->word(),  
            
        ];
    }
}