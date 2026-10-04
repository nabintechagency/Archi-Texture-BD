<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $products = Product::all();
        if ($products->isEmpty()) {
            return;
        }

        $sampleOrders = [
            [
                'order_number'    => 'ORD-20261001-1042',
                'customer_name'   => 'Dr. Tahmid Rahman',
                'customer_email'  => 'tahmid.rahman@luxurydwell.com',
                'customer_phone'  => '+880 1712-345678',
                'shipping_address'=> 'House 42, Road 11, Block D, Banani',
                'city'            => 'Dhaka',
                'notes'           => 'Please call 30 minutes before arrival. Penthouse delivery.',
                'status'          => 'pending',
                'payment_status'  => 'pending',
                'payment_method'  => 'cash_on_delivery',
                'shipping_fee'    => 0,
                'discount'        => 0,
                'admin_notes'     => 'Customer requested weekend delivery between 10am and 1pm.',
                'placed_at'       => now()->subHours(2),
                'items'           => [
                    ['index' => 0, 'quantity' => 1],
                    ['index' => 1, 'quantity' => 2],
                ],
            ],
            [
                'order_number'    => 'ORD-20261002-2891',
                'customer_name'   => 'Farhana Chowdhury',
                'customer_email'  => 'farhana.chowdhury@designarc.net',
                'customer_phone'  => '+880 1819-876543',
                'shipping_address'=> 'Apt 6B, The Glasshouse, Gulshan-2',
                'city'            => 'Dhaka',
                'notes'           => 'Fragile glass items, please handle with extra care.',
                'status'          => 'confirmed',
                'payment_status'  => 'paid',
                'payment_method'  => 'bkash',
                'shipping_fee'    => 0,
                'discount'        => 5000,
                'admin_notes'     => 'Payment verified via bKash TrxID #8AK29N7.',
                'placed_at'       => now()->subDays(1)->subHours(3),
                'items'           => [
                    ['index' => 2, 'quantity' => 1],
                ],
            ],
            [
                'order_number'    => 'ORD-20261003-4912',
                'customer_name'   => 'Architect Mahfuzul Alam',
                'customer_email'  => 'alam.studio@archi-texture.com',
                'customer_phone'  => '+880 1911-223344',
                'shipping_address'=> 'Plot 15, Sector 7, Uttara Residential Area',
                'city'            => 'Dhaka',
                'notes'           => 'Commercial showroom project order.',
                'status'          => 'processing',
                'payment_status'  => 'paid',
                'payment_method'  => 'bank_transfer',
                'shipping_fee'    => 0,
                'discount'        => 10000,
                'admin_notes'     => 'In production / assembly at factory workshop.',
                'placed_at'       => now()->subDays(2),
                'items'           => [
                    ['index' => 0, 'quantity' => 2],
                    ['index' => 3, 'quantity' => 1],
                ],
            ],
            [
                'order_number'    => 'ORD-20260928-8721',
                'customer_name'   => 'Nusrat Jahan',
                'customer_email'  => 'nusrat.j@nordicliving.bd',
                'customer_phone'  => '+880 1898-998877',
                'shipping_address'=> 'Suite 12A, Nasirabad Hills, Chittagong',
                'city'            => 'Chittagong',
                'notes'           => 'Delivered via RedX courier logistics.',
                'status'          => 'delivered',
                'payment_status'  => 'paid',
                'payment_method'  => 'card',
                'shipping_fee'    => 1500,
                'discount'        => 0,
                'admin_notes'     => 'Delivered and client confirmed satisfaction.',
                'placed_at'       => now()->subDays(6),
                'items'           => [
                    ['index' => 1, 'quantity' => 1],
                ],
            ],
        ];

        foreach ($sampleOrders as $data) {
            $itemsData = $data['items'];
            unset($data['items']);

            $subtotal = 0;
            $orderItems = [];

            foreach ($itemsData as $itemInfo) {
                $product = $products[$itemInfo['index'] % $products->count()];
                $price = (float) $product->price;
                $qty = $itemInfo['quantity'];
                $lineTotal = $price * $qty;
                $subtotal += $lineTotal;

                $orderItems[] = [
                    'product_id'     => $product->id,
                    'product_name'   => $product->name,
                    'sku'            => $product->sku,
                    'price'          => $price,
                    'quantity'       => $qty,
                    'total'          => $lineTotal,
                    'featured_image' => $product->featured_image,
                ];
            }

            $data['subtotal'] = $subtotal;
            $data['total_amount'] = max(0, $subtotal + ($data['shipping_fee'] ?? 0) - ($data['discount'] ?? 0));

            $order = Order::create($data);
            foreach ($orderItems as $item) {
                $order->items()->create($item);
            }
        }
    }
}
