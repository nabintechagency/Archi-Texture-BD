<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'slug', 'summary', 'description', 'featured_image', 'gallery', 'price', 'category', 'sku', 'stock_quantity', 'status', 'is_featured', 'sort_order'])]
class Product extends Model
{
    protected function casts(): array
    {
        return ['gallery' => 'array', 'is_featured' => 'boolean', 'price' => 'decimal:2', 'stock_quantity' => 'integer'];
    }
    public function orderItems(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function isInStock(): bool
    {
        return $this->stock_quantity > 0;
    }

    public function isLowStock(int $threshold = 5): bool
    {
        return $this->stock_quantity > 0 && $this->stock_quantity <= $threshold;
    }

    public function isOutOfStock(): bool
    {
        return $this->stock_quantity <= 0;
    }
}
