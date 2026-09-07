<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\Certification;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Media;
use App\Models\Message;
use App\Models\Product;
use App\Models\Project;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Skill;
use App\Models\Slider;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function dashboard(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'projects'       => Project::count(),
                'skills'         => Skill::count(),
                'services'       => Service::count(),
                'experiences'    => Experience::count(),
                'education'      => Education::count(),
                'certifications' => Certification::count(),
                'testimonials'   => Testimonial::count(),
                'blog_posts'     => BlogPost::count(),
            'media'          => Media::count(),
            'sliders'        => Slider::count(),
            'products'       => Product::count(),
            'messages'       => Message::count(),
                'unread_messages'=> Message::where('is_read', false)->count(),
                'settings'       => Setting::count(),
            ],
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

    // Products
    public function products(Request $request): Response
    {
        return Inertia::render('Admin/Products/Index', [
            'products' => Product::orderBy('sort_order')->paginate(15)->withQueryString(),
            'filters'  => $request->only(['search', 'status']),
        ]);
    }

    public function productCreate(): Response
    {
        return Inertia::render('Admin/Products/Form');
    }

    public function productEdit(Product $product): Response
    {
        return Inertia::render('Admin/Products/Form', ['product' => $product]);
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
