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
        // Category breakdown for inventory distribution
        $categoriesDistribution = Product::selectRaw('category, count(*) as count, sum(COALESCE(price, 0) * COALESCE(stock_quantity, 0)) as total_val')
            ->groupBy('category')
            ->get()
            ->map(function ($item) {
                return [
                    'category'  => $item->category ?: 'Uncategorized',
                    'count'     => (int) $item->count,
                    'total_val' => (float) $item->total_val,
                ];
            });

        $ordersCount = Order::count();
        $totalRevenue = (float) Order::where('payment_status', 'paid')->sum('total_amount');
        $aov = $ordersCount > 0 ? round($totalRevenue / $ordersCount, 2) : 0;

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
                'out_of_stock'    => Product::where('stock_quantity', '<=', 0)->count(),
                'in_stock'        => Product::where('stock_quantity', '>', 5)->count(),
                'orders'          => $ordersCount,
                'pending_orders'  => Order::where('status', 'pending')->count(),
                'delivered_orders'=> Order::where('status', 'delivered')->count(),
                'revenue'         => $totalRevenue,
                'total_sales'     => (float) Order::sum('total_amount'),
                'aov'             => $aov,
                'inventory_value' => (float) (Product::selectRaw('SUM(COALESCE(price, 0) * COALESCE(stock_quantity, 0)) as val')->value('val') ?? 0),
                'messages'        => Message::count(),
                'unread_messages' => Message::where('is_read', false)->count(),
                'settings'        => Setting::count(),
            ],
            'categoriesDistribution' => $categoriesDistribution,
            'recent_orders' => Order::with('items')->orderByDesc('id')->take(6)->get(),
            'inventory_products' => Product::orderBy('stock_quantity', 'asc')->get(['id', 'name', 'sku', 'category', 'price', 'stock_quantity', 'status', 'featured_image']),
        ]);
    }

    public function exportStatement(Request $request)
    {
        $timeframe = $request->input('timeframe', 'This week');
        $query = Order::with('items')->orderByDesc('id');

        if ($timeframe === 'Today') {
            $query->whereDate('created_at', today());
        } elseif ($timeframe === 'This week') {
            $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
        } elseif ($timeframe === 'This month') {
            $query->whereMonth('created_at', now()->month)->whereYear('created_at', now()->year);
        } elseif ($timeframe === 'This year') {
            $query->whereYear('created_at', now()->year);
        } elseif ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('created_at', [$request->start_date . ' 00:00:00', $request->end_date . ' 23:59:59']);
        }

        $orders = $query->get();
        $filename = 'ArchiTexture_Statement_' . date('Ymd_His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($orders, $timeframe) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ARCHI-TEXTURE BD - FINANCIAL STATEMENT']);
            fputcsv($handle, ['Period', $timeframe, 'Exported At', now()->toDateTimeString()]);
            fputcsv($handle, []);
            fputcsv($handle, ['Order Number', 'Date', 'Customer Name', 'Phone', 'City', 'Pieces Count', 'Subtotal (BDT)', 'Shipping (BDT)', 'Discount (BDT)', 'Total Amount (BDT)', 'Payment Method', 'Payment Status', 'Order Status']);

            $totalSales = 0;
            $totalPieces = 0;

            foreach ($orders as $order) {
                $pieces = $order->items->sum('quantity') ?: 1;
                $totalPieces += $pieces;
                $totalSales += (float) $order->total_amount;

                fputcsv($handle, [
                    $order->order_number,
                    $order->created_at ? $order->created_at->format('Y-m-d H:i') : '',
                    $order->customer_name,
                    $order->customer_phone,
                    $order->city ?? 'Dhaka',
                    $pieces,
                    number_format((float) $order->subtotal, 2, '.', ''),
                    number_format((float) $order->shipping_fee, 2, '.', ''),
                    number_format((float) $order->discount, 2, '.', ''),
                    number_format((float) $order->total_amount, 2, '.', ''),
                    strtoupper(str_replace('_', ' ', $order->payment_method ?? 'Cash on Delivery')),
                    strtoupper($order->payment_status),
                    strtoupper($order->status),
                ]);
            }

            fputcsv($handle, []);
            fputcsv($handle, ['TOTALS', '', '', '', '', $totalPieces, '', '', '', number_format($totalSales, 2, '.', ''), '', '', '']);

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    // Projects
    public function projects(Request $request): Response
    {
        $query = Project::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('summary', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        $categories = Project::whereNotNull('category')
            ->where('category', '!=', '')
            ->distinct()
            ->orderBy('category')
            ->pluck('category')
            ->toArray();

        if (empty($categories)) {
            $categories = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office', 'Dining'];
        }

        return Inertia::render('Admin/Projects/Index', [
            'projects'   => $query->orderBy('sort_order')->orderByDesc('id')->paginate(15)->withQueryString(),
            'categories' => $categories,
            'filters'    => $request->only(['search', 'category']),
        ]);
    }

    public function projectCreate(): Response
    {
        $existingCategories = Project::whereNotNull('category')
            ->where('category', '!=', '')
            ->distinct()
            ->orderBy('category')
            ->pluck('category')
            ->toArray();

        $defaultRooms = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office', 'Dining', 'Commercial', 'Outdoor'];
        $categories = array_values(array_unique(array_merge($defaultRooms, $existingCategories)));

        return Inertia::render('Admin/Projects/Form', [
            'categories' => $categories,
            'skills'     => Skill::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function projectStore(Request $request)
    {
        $validated = $request->validate([
            'title'          => ['required', 'string', 'max:255'],
            'slug'           => ['required', 'string', 'max:255', 'unique:projects,slug'],
            'category'       => ['nullable', 'string', 'max:255'],
            'summary'        => ['nullable', 'string', 'max:500'],
            'description'    => ['nullable', 'string'],
            'featured_image' => ['nullable', 'string'],
            'image_file'     => ['nullable', 'file', 'image', 'max:10240'],
            'project_url'    => ['nullable', 'url', 'max:255'],
            'status'         => ['required', 'string', 'in:draft,published,archived'],
            'is_featured'    => ['boolean'],
            'completed_at'   => ['nullable', 'date'],
            'sort_order'     => ['integer', 'min:0'],
        ]);

        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('projects', $filename, 'public');
            $validated['featured_image'] = '/storage/' . $path;

            Media::create([
                'filename'          => $filename,
                'original_filename' => $file->getClientOriginalName(),
                'path'              => $path,
                'disk'              => 'public',
                'mime_type'         => $file->getMimeType(),
                'size'              => $file->getSize(),
                'folder'            => 'projects',
                'uploaded_by'       => $request->user()?->id,
            ]);
        }

        unset($validated['image_file']);

        $project = Project::create($validated);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'project' => $project], 201);
        }

        return redirect()->route('admin.projects')->with('success', 'Portfolio project created successfully!');
    }

    public function projectEdit(Project $project): Response
    {
        $existingCategories = Project::whereNotNull('category')
            ->where('category', '!=', '')
            ->distinct()
            ->orderBy('category')
            ->pluck('category')
            ->toArray();

        $defaultRooms = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office', 'Dining', 'Commercial', 'Outdoor'];
        $categories = array_values(array_unique(array_merge($defaultRooms, $existingCategories)));

        return Inertia::render('Admin/Projects/Form', [
            'project'    => $project->load('skills'),
            'categories' => $categories,
            'skills'     => Skill::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function projectUpdate(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title'          => ['required', 'string', 'max:255'],
            'slug'           => ['required', 'string', 'max:255', 'unique:projects,slug,' . $project->id],
            'category'       => ['nullable', 'string', 'max:255'],
            'summary'        => ['nullable', 'string', 'max:500'],
            'description'    => ['nullable', 'string'],
            'featured_image' => ['nullable', 'string'],
            'image_file'     => ['nullable', 'file', 'image', 'max:10240'],
            'project_url'    => ['nullable', 'url', 'max:255'],
            'status'         => ['required', 'string', 'in:draft,published,archived'],
            'is_featured'    => ['boolean'],
            'completed_at'   => ['nullable', 'date'],
            'sort_order'     => ['integer', 'min:0'],
        ]);

        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('projects', $filename, 'public');
            $validated['featured_image'] = '/storage/' . $path;

            Media::create([
                'filename'          => $filename,
                'original_filename' => $file->getClientOriginalName(),
                'path'              => $path,
                'disk'              => 'public',
                'mime_type'         => $file->getMimeType(),
                'size'              => $file->getSize(),
                'folder'            => 'projects',
                'uploaded_by'       => $request->user()?->id,
            ]);
        }

        unset($validated['image_file']);

        $project->update($validated);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'project' => $project]);
        }

        return redirect()->route('admin.projects')->with('success', 'Portfolio project updated successfully!');
    }

    public function projectDestroy(Project $project)
    {
        $project->delete();

        return redirect()->route('admin.projects')->with('success', 'Portfolio project deleted successfully!');
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

    // Testimonials / Client Stories
    public function testimonials(Request $request): Response
    {
        $query = Testimonial::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('author_name', 'like', "%{$search}%")
                  ->orWhere('author_role', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $allTestimonials = Testimonial::all();
        $stats = [
            'total'      => $allTestimonials->count(),
            'featured'   => $allTestimonials->where('is_featured', true)->count(),
            'avg_rating' => round($allTestimonials->avg('rating') ?: 5.0, 1),
            'with_photo' => $allTestimonials->whereNotNull('avatar_path')->where('avatar_path', '!=', '')->count(),
        ];

        return Inertia::render('Admin/Testimonials/Index', [
            'testimonials' => $query->orderBy('sort_order')->orderByDesc('id')->paginate(15)->withQueryString(),
            'stats'        => $stats,
            'filters'      => $request->only(['search']),
        ]);
    }

    public function testimonialCreate(): Response
    {
        return Inertia::render('Admin/Testimonials/Form');
    }

    public function testimonialStore(Request $request)
    {
        $validated = $request->validate([
            'author_name' => ['required', 'string', 'max:255'],
            'author_role' => ['nullable', 'string', 'max:255'],
            'company'     => ['nullable', 'string', 'max:255'],
            'content'     => ['required', 'string'],
            'rating'      => ['nullable', 'integer', 'between:1,5'],
            'avatar_path' => ['nullable', 'string', 'max:255'],
            'avatar_file' => ['nullable', 'file', 'image', 'max:10240'],
            'is_featured' => ['nullable', 'boolean'],
            'sort_order'  => ['nullable', 'integer', 'min:0'],
        ]);

        if ($request->hasFile('avatar_file')) {
            $file = $request->file('avatar_file');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('testimonials', $filename, 'public');
            $validated['avatar_path'] = '/storage/' . $path;

            Media::create([
                'filename'          => $filename,
                'original_filename' => $file->getClientOriginalName(),
                'path'              => $path,
                'disk'              => 'public',
                'mime_type'         => $file->getMimeType(),
                'size'              => $file->getSize(),
                'folder'            => 'testimonials',
                'uploaded_by'       => $request->user()?->id,
            ]);
        }

        unset($validated['avatar_file']);
        $validated['is_featured'] = $request->has('is_featured') ? (bool) $request->input('is_featured') : true;
        $validated['sort_order'] = $validated['sort_order'] ?? 0;
        $validated['rating'] = $validated['rating'] ?? 5;

        Testimonial::create($validated);

        if ($request->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return redirect()->route('admin.testimonials')->with('success', 'Client Story created successfully!');
    }

    public function testimonialEdit(Testimonial $testimonial): Response
    {
        return Inertia::render('Admin/Testimonials/Form', ['testimonial' => $testimonial]);
    }

    public function testimonialUpdate(Request $request, Testimonial $testimonial)
    {
        $validated = $request->validate([
            'author_name' => ['required', 'string', 'max:255'],
            'author_role' => ['nullable', 'string', 'max:255'],
            'company'     => ['nullable', 'string', 'max:255'],
            'content'     => ['required', 'string'],
            'rating'      => ['nullable', 'integer', 'between:1,5'],
            'avatar_path' => ['nullable', 'string', 'max:255'],
            'avatar_file' => ['nullable', 'file', 'image', 'max:10240'],
            'is_featured' => ['nullable', 'boolean'],
            'sort_order'  => ['nullable', 'integer', 'min:0'],
        ]);

        if ($request->hasFile('avatar_file')) {
            $file = $request->file('avatar_file');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('testimonials', $filename, 'public');
            $validated['avatar_path'] = '/storage/' . $path;

            Media::create([
                'filename'          => $filename,
                'original_filename' => $file->getClientOriginalName(),
                'path'              => $path,
                'disk'              => 'public',
                'mime_type'         => $file->getMimeType(),
                'size'              => $file->getSize(),
                'folder'            => 'testimonials',
                'uploaded_by'       => $request->user()?->id,
            ]);
        }

        unset($validated['avatar_file']);
        if ($request->has('is_featured')) {
            $validated['is_featured'] = (bool) $request->input('is_featured');
        }
        $validated['sort_order'] = $validated['sort_order'] ?? 0;
        $validated['rating'] = $validated['rating'] ?? 5;

        $testimonial->update($validated);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'testimonial' => $testimonial]);
        }

        return redirect()->route('admin.testimonials')->with('success', 'Client Story updated successfully!');
    }

    public function testimonialDestroy(Testimonial $testimonial)
    {
        $testimonial->delete();
        return redirect()->route('admin.testimonials')->with('success', 'Client Story deleted successfully.');
    }

    public function testimonialToggleFeatured(Testimonial $testimonial)
    {
        $testimonial->update([
            'is_featured' => !$testimonial->is_featured,
        ]);

        return back()->with('success', $testimonial->is_featured ? 'Story is now live on homepage Client Stories!' : 'Story removed from homepage.');
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

        if ($request->has('featured') && $request->input('featured') !== null && $request->input('featured') !== '') {
            $query->where('is_featured', filter_var($request->input('featured'), FILTER_VALIDATE_BOOLEAN));
        }

        $inventoryStats = [
            'total_products' => Product::count(),
            'in_stock'       => Product::where('stock_quantity', '>', 5)->count(),
            'low_stock'      => Product::where('stock_quantity', '>', 0)->where('stock_quantity', '<=', 5)->count(),
            'out_of_stock'   => Product::where('stock_quantity', '<=', 0)->count(),
            'featured'       => Product::where('is_featured', true)->count(),
            'total_value'    => (float) (Product::selectRaw('SUM(COALESCE(price, 0) * COALESCE(stock_quantity, 0)) as val')->value('val') ?? 0),
        ];

        $categoryCounts = Product::selectRaw('COALESCE(NULLIF(category, ""), "Uncategorized") as category_name, count(*) as count')
            ->groupBy('category_name')
            ->pluck('count', 'category_name')
            ->toArray();

        return Inertia::render('Admin/Products/Index', [
            'products'       => $query->orderBy('sort_order')->orderByDesc('id')->paginate(15)->withQueryString(),
            'inventoryStats' => $inventoryStats,
            'categories'     => Product::whereNotNull('category')->where('category', '!=', '')->distinct()->pluck('category'),
            'categoryCounts' => $categoryCounts,
            'filters'        => $request->only(['search', 'status', 'category', 'featured']),
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
            'name'             => ['required', 'string', 'max:255'],
            'slug'             => ['required', 'string', 'max:255', 'unique:products,slug'],
            'summary'          => ['nullable', 'string', 'max:255'],
            'description'      => ['nullable', 'string'],
            'featured_image'   => ['nullable', 'string'],
            'image_file'       => ['nullable', 'file', 'image', 'max:10240'],
            'gallery'          => ['nullable', 'array'],
            'gallery_files'    => ['nullable', 'array'],
            'gallery_files.*'  => ['nullable', 'file', 'image', 'max:10240'],
            'price'            => ['nullable', 'numeric', 'min:0'],
            'original_price'   => ['nullable', 'numeric', 'min:0'],
            'discount_percent' => ['nullable', 'integer', 'min:0', 'max:100'],
            'category'         => ['nullable', 'string', 'max:255'],
            'sku'              => ['nullable', 'string', 'max:255'],
            'stock_quantity'   => ['required', 'integer', 'min:0'],
            'status'           => ['required', 'string', 'in:draft,published,archived'],
            'is_featured'      => ['boolean'],
            'sort_order'       => ['integer', 'min:0'],
        ]);

        // Direct upload of featured image file if provided
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('products', $filename, 'public');
            $validated['featured_image'] = '/storage/' . $path;

            Media::create([
                'filename'          => $filename,
                'original_filename' => $file->getClientOriginalName(),
                'path'              => $path,
                'disk'              => 'public',
                'mime_type'         => $file->getMimeType(),
                'size'              => $file->getSize(),
                'folder'            => 'products',
                'uploaded_by'       => $request->user()?->id,
            ]);
        }

        // Direct upload of gallery files if provided
        $gallery = $validated['gallery'] ?? [];
        if ($request->hasFile('gallery_files')) {
            foreach ($request->file('gallery_files') as $gFile) {
                $gFilename = Str::uuid() . '.' . $gFile->getClientOriginalExtension();
                $gPath = $gFile->storeAs('products', $gFilename, 'public');
                $gallery[] = '/storage/' . $gPath;

                Media::create([
                    'filename'          => $gFilename,
                    'original_filename' => $gFile->getClientOriginalName(),
                    'path'              => $gPath,
                    'disk'              => 'public',
                    'mime_type'         => $gFile->getMimeType(),
                    'size'              => $gFile->getSize(),
                    'folder'            => 'products',
                    'uploaded_by'       => $request->user()?->id,
                ]);
            }
        }
        $validated['gallery'] = $gallery;

        unset($validated['image_file'], $validated['gallery_files']);

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
            'name'             => ['required', 'string', 'max:255'],
            'slug'             => ['required', 'string', 'max:255', 'unique:products,slug,' . $product->id],
            'summary'          => ['nullable', 'string', 'max:255'],
            'description'      => ['nullable', 'string'],
            'featured_image'   => ['nullable', 'string'],
            'image_file'       => ['nullable', 'file', 'image', 'max:10240'],
            'gallery'          => ['nullable', 'array'],
            'gallery_files'    => ['nullable', 'array'],
            'gallery_files.*'  => ['nullable', 'file', 'image', 'max:10240'],
            'price'            => ['nullable', 'numeric', 'min:0'],
            'original_price'   => ['nullable', 'numeric', 'min:0'],
            'discount_percent' => ['nullable', 'integer', 'min:0', 'max:100'],
            'category'         => ['nullable', 'string', 'max:255'],
            'sku'              => ['nullable', 'string', 'max:255'],
            'stock_quantity'   => ['required', 'integer', 'min:0'],
            'status'           => ['required', 'string', 'in:draft,published,archived'],
            'is_featured'      => ['boolean'],
            'sort_order'       => ['integer', 'min:0'],
        ]);

        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('products', $filename, 'public');
            $validated['featured_image'] = '/storage/' . $path;

            Media::create([
                'filename'          => $filename,
                'original_filename' => $file->getClientOriginalName(),
                'path'              => $path,
                'disk'              => 'public',
                'mime_type'         => $file->getMimeType(),
                'size'              => $file->getSize(),
                'folder'            => 'products',
                'uploaded_by'       => $request->user()?->id,
            ]);
        }

        $gallery = $validated['gallery'] ?? ($product->gallery ?: []);
        if ($request->hasFile('gallery_files')) {
            foreach ($request->file('gallery_files') as $gFile) {
                $gFilename = Str::uuid() . '.' . $gFile->getClientOriginalExtension();
                $gPath = $gFile->storeAs('products', $gFilename, 'public');
                $gallery[] = '/storage/' . $gPath;

                Media::create([
                    'filename'          => $gFilename,
                    'original_filename' => $gFile->getClientOriginalName(),
                    'path'              => $gPath,
                    'disk'              => 'public',
                    'mime_type'         => $gFile->getMimeType(),
                    'size'              => $gFile->getSize(),
                    'folder'            => 'products',
                    'uploaded_by'       => $request->user()?->id,
                ]);
            }
        }
        $validated['gallery'] = $gallery;

        unset($validated['image_file'], $validated['gallery_files']);

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

    public function toggleProductFeatured(Request $request, Product $product)
    {
        $product->update([
            'is_featured' => !$product->is_featured,
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'is_featured' => $product->is_featured,
                'product' => $product,
            ]);
        }

        return back()->with('success', $product->is_featured ? 'Added to Signature Collection.' : 'Removed from Signature Collection.');
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
            'processing'  => Order::where('status', 'processing')->count(),
            'shipped'     => Order::where('status', 'shipped')->count(),
            'delivered'   => Order::where('status', 'delivered')->count(),
            'cancelled'   => Order::where('status', 'cancelled')->count(),
            'total_sales' => (float) Order::where('payment_status', 'paid')->sum('total_amount'),
        ];

        return Inertia::render('Admin/Orders/Index', [
            'orders'     => $query->orderByDesc('id')->paginate(15)->withQueryString(),
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

        if ($request->wantsJson() && !$request->header('X-Inertia')) {
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

    public function updateSettings(Request $request)
    {
        $data = $request->input('settings', []);

        if (empty($data)) {
            $data = $request->except(['_token', 'about_image_file']);
        }

        // Direct upload of about image file if provided
        if ($request->hasFile('about_image_file')) {
            $file = $request->file('about_image_file');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('settings', $filename, 'public');
            $data['about_image'] = '/storage/' . $path;

            Media::create([
                'filename'          => $filename,
                'original_filename' => $file->getClientOriginalName(),
                'path'              => $path,
                'disk'              => 'public',
                'mime_type'         => $file->getMimeType(),
                'size'              => $file->getSize(),
                'folder'            => 'settings',
                'uploaded_by'       => $request->user()?->id,
            ]);
        }
        
        // Sync contact_phone and phone so both are always identical
        if (isset($data['contact_phone'])) {
            $data['phone'] = $data['contact_phone'];
        } elseif (isset($data['phone'])) {
            $data['contact_phone'] = $data['phone'];
        }

        // Sync contact_email and email
        if (isset($data['contact_email'])) {
            $data['email'] = $data['contact_email'];
        } elseif (isset($data['email'])) {
            $data['contact_email'] = $data['email'];
        }

        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $value = json_encode($value);
            }
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => is_bool($value) ? ($value ? '1' : '0') : $value]
            );
        }

        return back()->with('success', 'Settings updated successfully!');
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
