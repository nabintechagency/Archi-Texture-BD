<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContentController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function (): void {
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:6,1');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:6,1');
    Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function (): void {
    Route::apiResource('projects', ContentController::class);
    Route::apiResource('skills', ContentController::class);
    Route::apiResource('services', ContentController::class);
    Route::apiResource('experiences', ContentController::class);
    Route::apiResource('education', ContentController::class);
    Route::apiResource('certifications', ContentController::class);
    Route::apiResource('testimonials', ContentController::class);
    Route::apiResource('blog-posts', ContentController::class);
    Route::apiResource('sliders', ContentController::class);
    Route::apiResource('products', ContentController::class);
    Route::apiResource('media', ContentController::class);
    Route::apiResource('messages', ContentController::class);
    Route::apiResource('settings', ContentController::class);
});
