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
}
