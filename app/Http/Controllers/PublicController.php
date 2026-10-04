<?php

namespace App\Http\Controllers;

use App\Models\Experience;
use App\Models\Education;
use App\Models\Message;
use App\Models\Product;
use App\Models\Project;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Skill;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicController extends Controller
{
    private function settings(): array
    {
        return Setting::all()->keyBy('key')->map(fn ($s) => $s->value)->toArray();
    }

    public function home(): Response
    {
        return Inertia::render('Public/Home', [
            'projects'     => Project::where('status', 'published')->where('is_featured', true)->with('skills')->orderBy('sort_order')->take(6)->get(),
            'skills'       => Skill::where('is_active', true)->orderBy('sort_order')->get(),
            'products'     => Product::where('status', 'published')->where('is_featured', true)->orderBy('sort_order')->take(5)->get(),
            'services'     => Service::where('is_active', true)->orderBy('sort_order')->get(),
            'testimonials' => Testimonial::where('is_featured', true)->orderBy('sort_order')->get(),
            'settings'     => $this->settings(),
        ]);
    }

    public function about(): Response
    {
        return Inertia::render('Public/About', [
            'experiences' => Experience::orderBy('sort_order')->get(),
            'education'   => Education::orderBy('sort_order')->get(),
            'settings'    => $this->settings(),
        ]);
    }

    public function products(): Response
    {
        return Inertia::render('Public/Products', [
            'products' => Product::where('status', 'published')->orderBy('sort_order')->get(),
            'settings' => $this->settings(),
        ]);
    }

    public function services(): Response
    {
        return $this->products();
    }

    public function portfolio(): Response
    {
        return Inertia::render('Public/Portfolio', [
            'projects' => Project::where('status', 'published')->orderBy('sort_order')->get(),
            'settings' => $this->settings(),
        ]);
    }

    public function experience(): Response
    {
        return Inertia::render('Public/Experience', [
            'experiences' => Experience::orderBy('sort_order')->get(),
            'education'   => Education::orderBy('sort_order')->get(),
            'certifications' => \App\Models\Certification::orderBy('sort_order')->get(),
            'settings'    => $this->settings(),
        ]);
    }

    public function contact(): Response
    {
        return Inertia::render('Public/Contact', [
            'settings' => $this->settings(),
        ]);
    }

    public function sendMessage(Request $request)
    {
        $validated = $request->validate([
            'name'    => ['required', 'string', 'max:255'],
            'email'   => ['required', 'email', 'max:255'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        Message::create($validated);

        return back()->with('success', 'Your message has been sent successfully!');
    }

    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'customer_name'    => ['required', 'string', 'max:255'],
            'customer_email'   => ['nullable', 'email', 'max:255'],
            'customer_phone'   => ['required', 'string', 'max:50'],
            'shipping_address' => ['required', 'string'],
            'city'             => ['nullable', 'string', 'max:100'],
            'notes'            => ['nullable', 'string'],
            'payment_method'   => ['nullable', 'string'],
            'items'            => ['required', 'array', 'min:1'],
            'items.*.id'       => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        $subtotal = 0;
        $orderItemsData = [];

        foreach ($validated['items'] as $cartItem) {
            $product = Product::findOrFail($cartItem['id']);
            $qty = (int) $cartItem['quantity'];
            $price = (float) $product->price;
            $lineTotal = $price * $qty;
            $subtotal += $lineTotal;

            $orderItemsData[] = [
                'product_id'     => $product->id,
                'product_name'   => $product->name,
                'sku'            => $product->sku,
                'price'          => $price,
                'quantity'       => $qty,
                'total'          => $lineTotal,
                'featured_image' => $product->featured_image,
            ];

            // Decrement inventory stock if available
            if ($product->stock_quantity >= $qty) {
                $product->decrement('stock_quantity', $qty);
            }
        }

        $order = \App\Models\Order::create([
            'customer_name'    => $validated['customer_name'],
            'customer_email'   => $validated['customer_email'] ?? null,
            'customer_phone'   => $validated['customer_phone'],
            'shipping_address' => $validated['shipping_address'],
            'city'             => $validated['city'] ?? 'Dhaka',
            'notes'            => $validated['notes'] ?? null,
            'status'           => 'pending',
            'payment_status'   => 'pending',
            'payment_method'   => $validated['payment_method'] ?? 'cash_on_delivery',
            'subtotal'         => $subtotal,
            'shipping_fee'     => 0,
            'discount'         => 0,
            'total_amount'     => $subtotal,
            'placed_at'        => now(),
        ]);

        foreach ($orderItemsData as $itemData) {
            $order->items()->create($itemData);
        }

        return response()->json([
            'success'      => true,
            'order_number' => $order->order_number,
            'total_amount' => $order->total_amount,
            'message'      => 'Your order has been received successfully! Our concierge team will reach out for confirmation.',
        ]);
    }
}

