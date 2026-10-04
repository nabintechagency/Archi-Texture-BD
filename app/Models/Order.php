<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'customer_name',
        'customer_email',
        'customer_phone',
        'shipping_address',
        'city',
        'notes',
        'status',
        'payment_status',
        'payment_method',
        'subtotal',
        'shipping_fee',
        'discount',
        'total_amount',
        'admin_notes',
        'placed_at',
    ];

    protected function casts(): array
    {
        return [
            'subtotal'      => 'decimal:2',
            'shipping_fee'  => 'decimal:2',
            'discount'      => 'decimal:2',
            'total_amount'  => 'decimal:2',
            'placed_at'     => 'datetime',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            if (empty($order->order_number)) {
                $order->order_number = self::generateOrderNumber();
            }
            if (empty($order->placed_at)) {
                $order->placed_at = now();
            }
        });
    }

    public static function generateOrderNumber(): string
    {
        $datePrefix = date('Ymd');
        $random = strtoupper(Str::random(4));
        $count = self::whereDate('created_at', today())->count() + 1;
        return sprintf('ORD-%s-%03d%s', $datePrefix, $count, $random);
    }
}
