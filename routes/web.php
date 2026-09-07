<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\MediaUploadController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/about', [PublicController::class, 'about'])->name('about');
Route::get('/products', [PublicController::class, 'products'])->name('products');
Route::get('/services', [PublicController::class, 'products'])->name('services');
Route::get('/portfolio', [PublicController::class, 'portfolio'])->name('portfolio');
Route::get('/experience', [PublicController::class, 'experience'])->name('experience');
Route::get('/contact', [PublicController::class, 'contact'])->name('contact');
Route::post('/contact', [PublicController::class, 'sendMessage'])->name('contact.send');

// Admin Routes
Route::prefix('admin')->name('admin.')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');

    // Projects
    Route::get('/projects', [AdminController::class, 'projects'])->name('projects');
    Route::get('/projects/create', [AdminController::class, 'projectCreate'])->name('projects.create');
    Route::get('/projects/{project}/edit', [AdminController::class, 'projectEdit'])->name('projects.edit');

    // Skills
    Route::get('/skills', [AdminController::class, 'skills'])->name('skills');
    Route::get('/skills/create', [AdminController::class, 'skillCreate'])->name('skills.create');
    Route::get('/skills/{skill}/edit', [AdminController::class, 'skillEdit'])->name('skills.edit');

    // Services
    Route::get('/services', [AdminController::class, 'services'])->name('services');
    Route::get('/services/create', [AdminController::class, 'serviceCreate'])->name('services.create');
    Route::get('/services/{service}/edit', [AdminController::class, 'serviceEdit'])->name('services.edit');

    // Experience
    Route::get('/experience', [AdminController::class, 'experiences'])->name('experience');
    Route::get('/experience/create', [AdminController::class, 'experienceCreate'])->name('experience.create');
    Route::get('/experience/{experience}/edit', [AdminController::class, 'experienceEdit'])->name('experience.edit');

    // Education
    Route::get('/education', [AdminController::class, 'education'])->name('education');
    Route::get('/education/create', [AdminController::class, 'educationCreate'])->name('education.create');
    Route::get('/education/{education}/edit', [AdminController::class, 'educationEdit'])->name('education.edit');

    // Certifications
    Route::get('/certifications', [AdminController::class, 'certifications'])->name('certifications');
    Route::get('/certifications/create', [AdminController::class, 'certificationCreate'])->name('certifications.create');
    Route::get('/certifications/{certification}/edit', [AdminController::class, 'certificationEdit'])->name('certifications.edit');

    // Testimonials
    Route::get('/testimonials', [AdminController::class, 'testimonials'])->name('testimonials');
    Route::get('/testimonials/create', [AdminController::class, 'testimonialCreate'])->name('testimonials.create');
    Route::get('/testimonials/{testimonial}/edit', [AdminController::class, 'testimonialEdit'])->name('testimonials.edit');

    // Blog
    Route::get('/blog', [AdminController::class, 'blog'])->name('blog');
    Route::get('/blog/create', [AdminController::class, 'blogCreate'])->name('blog.create');
    Route::get('/blog/{blogPost}/edit', [AdminController::class, 'blogEdit'])->name('blog.edit');

    // Sliders
    Route::get('/sliders', [AdminController::class, 'sliders'])->name('sliders');
    Route::get('/sliders/create', [AdminController::class, 'sliderCreate'])->name('sliders.create');
    Route::get('/sliders/{slider}/edit', [AdminController::class, 'sliderEdit'])->name('sliders.edit');

    // Products
    Route::get('/products', [AdminController::class, 'products'])->name('products');
    Route::get('/products/create', [AdminController::class, 'productCreate'])->name('products.create');
    Route::get('/products/{product}/edit', [AdminController::class, 'productEdit'])->name('products.edit');

    // Media
    Route::get('/media', [AdminController::class, 'media'])->name('media');
    Route::post('/media/upload', [MediaUploadController::class, 'store'])->name('media.upload');
    Route::delete('/media/{media}', [MediaUploadController::class, 'destroy'])->name('media.destroy');

    // Messages
    Route::get('/messages', [AdminController::class, 'messages'])->name('messages');

    // Settings
    Route::get('/settings', [AdminController::class, 'settings'])->name('settings');

    // SEO
    Route::get('/seo', [AdminController::class, 'seo'])->name('seo');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Legacy dashboard redirect
Route::get('/dashboard', fn () => redirect()->route('admin.dashboard'))->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__.'/auth.php';
