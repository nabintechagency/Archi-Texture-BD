<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\Certification;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Media;
use App\Models\Message;
use App\Models\Order;
use App\Models\Product;
use App\Models\Project;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Skill;
use App\Models\Slider;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function dashboard(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'projects'        => Project::count(),
                'skills'          => Skill::count(),
                'services'        => Service::count(),
                'experiences'     => Experience::count(),
                'education'       => Education::count(),
                'certifications'  => Certification::count(),
                'testimonials'    => Testimonial::count(),
                'blog_posts'      => BlogPost::count(),
                'media'           => Media::count(),
                'sliders'         => Slider::count(),
                'products'        => Product::count(),
                'low_stock'       => Product::where('stock_quantity', '<=', 5)->count(),
                'orders'          => Order::count(),
                'pending_orders'  => Order::where('status', 'pending')->count(),
                'revenue'         => (float) Order::where('payment_status', 'paid')->sum('total_amount'),
                'messages'        => Message::count(),
                'unread_messages' => Message::where('is_read', false)->count(),
                'settings'        => Setting::count(),
            ],
            'recent_orders' => Order::with('items')->latest('placed_at')->take(5)->get(),
        ]);
    }

    // Projects
    public function projects(Request $request): Response
    {
        return Inertia::render('Admin/Projects/Index', [
            'projects' => Project::with('skills')->orderBy('sort_order')->paginate(15)->withQueryString(),
            'filters'  => $request->only(['search']),
        ]);
    }

    public function projectCreate(): Response
    {
        return Inertia::render('Admin/Projects/Form', [
            'skills' => Skill::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function projectEdit(Project $project): Response
    {
        return Inertia::render('Admin/Projects/Form', [
            'project' => $project->load('skills'),
            'skills'  => Skill::orderBy('name')->get(['id', 'name']),
        ]);
    }

    // Skills
    public function skills(Request $request): Response
    {
        return Inertia::render('Admin/Skills/Index', [
            'skills'  => Skill::orderBy('sort_order')->paginate(20)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function skillCreate(): Response
    {
        return Inertia::render('Admin/Skills/Form');
    }

    public function skillEdit(Skill $skill): Response
    {
        return Inertia::render('Admin/Skills/Form', ['skill' => $skill]);
    }

    // Services
    public function services(Request $request): Response
    {
        return Inertia::render('Admin/Services/Index', [
            'services' => Service::orderBy('sort_order')->paginate(20)->withQueryString(),
            'filters'  => $request->only(['search']),
        ]);
    }

    public function serviceCreate(): Response
    {
        return Inertia::render('Admin/Services/Form');
    }

    public function serviceEdit(Service $service): Response
    {
        return Inertia::render('Admin/Services/Form', ['service' => $service]);
    }

    // Experience
    public function experiences(Request $request): Response
    {
        return Inertia::render('Admin/Experience/Index', [
            'experiences' => Experience::orderBy('sort_order')->paginate(20)->withQueryString(),
            'filters'     => $request->only(['search']),
        ]);
    }

    public function experienceCreate(): Response
    {
        return Inertia::render('Admin/Experience/Form');
    }

    public function experienceEdit(Experience $experience): Response
    {
        return Inertia::render('Admin/Experience/Form', ['experience' => $experience]);
    }

    // Education
    public function education(Request $request): Response
    {
        return Inertia::render('Admin/Education/Index', [
            'educations' => Education::orderBy('sort_order')->paginate(20)->withQueryString(),
            'filters'    => $request->only(['search']),
        ]);
    }

    public function educationCreate(): Response
    {
        return Inertia::render('Admin/Education/Form');
    }

    public function educationEdit(Education $education): Response
    {
        return Inertia::render('Admin/Education/Form', ['education' => $education]);
    }

    // Certifications
    public function certifications(Request $request): Response
    {
        return Inertia::render('Admin/Certifications/Index', [
            'certifications' => Certification::orderBy('sort_order')->paginate(20)->withQueryString(),
            'filters'        => $request->only(['search']),
        ]);
    }

    public function certificationCreate(): Response
    {
        return Inertia::render('Admin/Certifications/Form');
    }

    public function certificationEdit(Certification $certification): Response
    {
        return Inertia::render('Admin/Certifications/Form', ['certification' => $certification]);
    }

    // Testimonials
    public function testimonials(Request $request): Response
    {
        return Inertia::render('Admin/Testimonials/Index', [
            'testimonials' => Testimonial::orderBy('sort_order')->paginate(20)->withQueryString(),
            'filters'      => $request->only(['search']),
        ]);
    }

    public function testimonialCreate(): Response
    {
        return Inertia::render('Admin/Testimonials/Form');
    }

    public function testimonialEdit(Testimonial $testimonial): Response
    {
        return Inertia::render('Admin/Testimonials/Form', ['testimonial' => $testimonial]);
    }

    // Blog
    public function blog(Request $request): Response
    {
        return Inertia::render('Admin/Blog/Index', [
            'posts'  => BlogPost::with('author')->orderByDesc('published_at')->paginate(15)->withQueryString(),
            'filters'=> $request->only(['search', 'status']),
        ]);
    }

    public function blogCreate(): Response
    {
        return Inertia::render('Admin/Blog/Form');
    }

    public function blogEdit(BlogPost $blogPost): Response
    {
        return Inertia::render('Admin/Blog/Form', ['post' => $blogPost]);
    }

    // Media
    public function media(Request $request): Response
    {
        return Inertia::render('Admin/Media/Index', [
            'media'  => Media::with('uploader')->orderByDesc('id')->paginate(24)->withQueryString(),
            'filters'=> $request->only(['search', 'folder']),
        ]);
    }

    // Sliders
    public function sliders(Request $request): Response
    {
        return Inertia::render('Admin/Sliders/Index', [
            'sliders' => Slider::orderBy('sort_order')->paginate(20)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function sliderCreate(): Response
    {
        return Inertia::render('Admin/Sliders/Form');
    }

    public function sliderEdit(Slider $slider): Response
    {
        return Inertia::render('Admin/Sliders/Form', ['slider' => $slider]);
    }

    // Products & Inventory
    public function products(Request $request): Response
    {
        $query = Product::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            if ($status === 'in_stock') {
                $query->where('stock_quantity', '>', 5);
            } elseif ($status === 'low_stock') {
                $query->where('stock_quantity', '>', 0)->where('stock_quantity', '<=', 5);
            } elseif ($status === 'out_of_stock') {
                $query->where('stock_quantity', '<=', 0);
            } elseif (in_array($status, ['published', 'draft', 'archived'])) {
                $query->where('status', $status);
            }
        }

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        $inventoryStats = [
            'total_products' => Product::count(),
            'in_stock'       => Product::where('stock_quantity', '>', 5)->count(),
            'low_stock'      => Product::where('stock_quantity', '>', 0)->where('stock_quantity', '<=', 5)->count(),
            'out_of_stock'   => Product::where('stock_quantity', '<=', 0)->count(),
            'total_value'    => (float) (Product::selectRaw('SUM(COALESCE(price, 0) * COALESCE(stock_quantity, 0)) as val')->value('val') ?? 0),
        ];

        return Inertia::render('Admin/Products/Index', [
            'products'       => $query->orderBy('sort_order')->orderByDesc('id')->paginate(15)->withQueryString(),
            'inventoryStats' => $inventoryStats,
            'categories'     => Product::whereNotNull('category')->where('category', '!=', '')->distinct()->pluck('category'),
            'filters'        => $request->only(['search', 'status', 'category']),
        ]);
    }

    public function productCreate(): Response
    {
        return Inertia::render('Admin/Products/Form', [
            'categories' => Product::whereNotNull('category')->where('category', '!=', '')->distinct()->pluck('category'),
        ]);
    }

    public function productStore(Request $request)
    {
        $validated = $request->validate([
            'name'           => ['required', 'string', 'max:255'],
            'slug'           => ['required', 'string', 'max:255', 'unique:products,slug'],
            'summary'        => ['nullable', 'string', 'max:255'],
            'description'    => ['nullable', 'string'],
            'featured_image' => ['nullable', 'string', 'max:255'],
            'gallery'        => ['nullable', 'array'],
            'price'          => ['nullable', 'numeric', 'min:0'],
            'category'       => ['nullable', 'string', 'max:255'],
            'sku'            => ['nullable', 'string', 'max:255'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'status'         => ['required', 'string', 'in:draft,published,archived'],
            'is_featured'    => ['boolean'],
            'sort_order'     => ['integer', 'min:0'],
        ]);

        $product = Product::create($validated);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'product' => $product], 201);
        }

        return redirect()->route('admin.products')->with('success', 'Product created successfully!');
    }

    public function productEdit(Product $product): Response
    {
        return Inertia::render('Admin/Products/Form', [
            'product'    => $product,
            'categories' => Product::whereNotNull('category')->where('category', '!=', '')->distinct()->pluck('category'),
        ]);
    }

    public function productUpdate(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name'           => ['required', 'string', 'max:255'],
            'slug'           => ['required', 'string', 'max:255', 'unique:products,slug,' . $product->id],
            'summary'        => ['nullable', 'string', 'max:255'],
            'description'    => ['nullable', 'string'],
            'featured_image' => ['nullable', 'string', 'max:255'],
            'gallery'        => ['nullable', 'array'],
            'price'          => ['nullable', 'numeric', 'min:0'],
            'category'       => ['nullable', 'string', 'max:255'],
            'sku'            => ['nullable', 'string', 'max:255'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'status'         => ['required', 'string', 'in:draft,published,archived'],
            'is_featured'    => ['boolean'],
            'sort_order'     => ['integer', 'min:0'],
        ]);

        $product->update($validated);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'product' => $product]);
        }

        return redirect()->route('admin.products')->with('success', 'Product updated successfully!');
    }

    public function updateProductStock(Request $request, Product $product)
    {
        $validated = $request->validate([
            'stock_quantity' => ['required', 'integer', 'min:0'],
        ]);

        $product->update(['stock_quantity' => $validated['stock_quantity']]);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'product' => $product]);
        }

        return back()->with('success', "Stock updated to {$product->stock_quantity}.");
    }

    public function productDestroy(Product $product)
    {
        $product->delete();
        return redirect()->route('admin.products')->with('success', 'Product deleted successfully.');
    }

    // Orders Management
    public function orders(Request $request): Response
    {
        $query = Order::with('items');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_phone', 'like', "%{$search}%")
                  ->orWhere('customer_email', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        if ($paymentStatus = $request->input('payment_status')) {
            if ($paymentStatus !== 'all') {
                $query->where('payment_status', $paymentStatus);
            }
        }

        $orderStats = [
            'total'       => Order::count(),
            'pending'     => Order::where('status', 'pending')->count(),
            'confirmed'   => Order::where('status', 'confirmed')->count(),
            'processing'  => Order::whereIn('status', ['confirmed', 'processing', 'shipped'])->count(),
            'delivered'   => Order::where('status', 'delivered')->count(),
            'cancelled'   => Order::where('status', 'cancelled')->count(),
            'total_sales' => (float) Order::where('payment_status', 'paid')->sum('total_amount'),
        ];

        return Inertia::render('Admin/Orders/Index', [
            'orders'     => $query->latest('placed_at')->paginate(15)->withQueryString(),
            'orderStats' => $orderStats,
            'filters'    => $request->only(['search', 'status', 'payment_status']),
        ]);
    }

    public function orderCreate(): Response
    {
        return Inertia::render('Admin/Orders/Create', [
            'products' => Product::where('status', 'published')->orderBy('name')->get(['id', 'name', 'sku', 'price', 'stock_quantity', 'featured_image', 'category']),
        ]);
    }

    public function orderStore(Request $request)
    {
        $validated = $request->validate([
            'customer_name'          => ['required', 'string', 'max:255'],
            'customer_email'         => ['nullable', 'email', 'max:255'],
            'customer_phone'         => ['required', 'string', 'max:50'],
            'shipping_address'       => ['required', 'string'],
            'city'                   => ['nullable', 'string', 'max:100'],
            'notes'                  => ['nullable', 'string'],
            'status'                 => ['required', 'string', 'in:pending,confirmed,processing,shipped,delivered,cancelled'],
            'payment_status'         => ['required', 'string', 'in:pending,paid,failed,refunded'],
            'payment_method'         => ['required', 'string'],
            'shipping_fee'           => ['nullable', 'numeric', 'min:0'],
            'discount'               => ['nullable', 'numeric', 'min:0'],
            'admin_notes'            => ['nullable', 'string'],
            'items'                  => ['required', 'array', 'min:1'],
            'items.*.product_id'     => ['nullable', 'integer'],
            'items.*.product_name'   => ['required', 'string'],
            'items.*.sku'            => ['nullable', 'string'],
            'items.*.price'          => ['required', 'numeric', 'min:0'],
            'items.*.quantity'       => ['required', 'integer', 'min:1'],
            'items.*.featured_image' => ['nullable', 'string'],
        ]);

        $subtotal = 0;
        foreach ($validated['items'] as $item) {
            $subtotal += ((float) $item['price']) * ((int) $item['quantity']);
        }

        $shippingFee = (float) ($validated['shipping_fee'] ?? 0);
        $discount = (float) ($validated['discount'] ?? 0);
        $totalAmount = max(0, $subtotal + $shippingFee - $discount);

        $order = Order::create([
            'customer_name'    => $validated['customer_name'],
            'customer_email'   => $validated['customer_email'] ?? null,
            'customer_phone'   => $validated['customer_phone'],
            'shipping_address' => $validated['shipping_address'],
            'city'             => $validated['city'] ?? 'Dhaka',
            'notes'            => $validated['notes'] ?? null,
            'status'           => $validated['status'],
            'payment_status'   => $validated['payment_status'],
            'payment_method'   => $validated['payment_method'],
            'subtotal'         => $subtotal,
            'shipping_fee'     => $shippingFee,
            'discount'         => $discount,
            'total_amount'     => $totalAmount,
            'admin_notes'      => $validated['admin_notes'] ?? null,
            'placed_at'        => now(),
        ]);

        foreach ($validated['items'] as $item) {
            $lineTotal = ((float) $item['price']) * ((int) $item['quantity']);
            $order->items()->create([
                'product_id'     => $item['product_id'] ?? null,
                'product_name'   => $item['product_name'],
                'sku'            => $item['sku'] ?? null,
                'price'          => $item['price'],
                'quantity'       => $item['quantity'],
                'total'          => $lineTotal,
                'featured_image' => $item['featured_image'] ?? null,
            ]);

            if (!empty($item['product_id'])) {
                Product::where('id', $item['product_id'])->decrement('stock_quantity', (int) $item['quantity']);
            }
        }

        return redirect()->route('admin.orders.show', $order)->with('success', 'Order created successfully!');
    }

    public function orderShow(Order $order): Response
    {
        return Inertia::render('Admin/Orders/Show', [
            'order' => $order->load('items.product'),
        ]);
    }

    public function orderUpdateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status'         => ['sometimes', 'string', 'in:pending,confirmed,processing,shipped,delivered,cancelled'],
            'payment_status' => ['sometimes', 'string', 'in:pending,paid,failed,refunded'],
            'admin_notes'    => ['sometimes', 'nullable', 'string'],
        ]);

        $order->update($validated);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'order' => $order]);
        }

        return back()->with('success', 'Order updated successfully!');
    }

    public function orderUpdate(Request $request, Order $order)
    {
        $validated = $request->validate([
            'customer_name'    => ['required', 'string', 'max:255'],
            'customer_email'   => ['nullable', 'email', 'max:255'],
            'customer_phone'   => ['required', 'string', 'max:50'],
            'shipping_address' => ['required', 'string'],
            'city'             => ['nullable', 'string', 'max:100'],
            'notes'            => ['nullable', 'string'],
            'status'           => ['required', 'string', 'in:pending,confirmed,processing,shipped,delivered,cancelled'],
            'payment_status'   => ['required', 'string', 'in:pending,paid,failed,refunded'],
            'payment_method'   => ['required', 'string'],
            'shipping_fee'     => ['nullable', 'numeric', 'min:0'],
            'discount'         => ['nullable', 'numeric', 'min:0'],
            'admin_notes'      => ['nullable', 'string'],
        ]);

        $subtotal = $order->items()->sum('total');
        $shippingFee = (float) ($validated['shipping_fee'] ?? 0);
        $discount = (float) ($validated['discount'] ?? 0);
        $totalAmount = max(0, $subtotal + $shippingFee - $discount);

        $validated['subtotal'] = $subtotal;
        $validated['shipping_fee'] = $shippingFee;
        $validated['discount'] = $discount;
        $validated['total_amount'] = $totalAmount;

        $order->update($validated);

        return back()->with('success', 'Order updated successfully!');
    }

    public function orderDestroy(Order $order)
    {
        $order->delete();
        return redirect()->route('admin.orders')->with('success', 'Order deleted successfully.');
    }

    // Messages
    public function messages(Request $request): Response
    {
        return Inertia::render('Admin/Messages/Index', [
            'messages' => Message::orderByDesc('id')->paginate(20)->withQueryString(),
            'filters'  => $request->only(['search', 'is_read']),
        ]);
    }

    // Settings
    public function settings(): Response
    {
        return Inertia::render('Admin/Settings/Index', [
            'settings' => Setting::orderBy('group')->orderBy('key')->get(),
        ]);
    }

    // SEO
    public function seo(): Response
    {
        $seoSettings = Setting::where('group', 'seo')->get()->keyBy('key');

        return Inertia::render('Admin/Seo/Index', [
            'seoSettings' => $seoSettings,
        ]);
    }
}
