<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['author_name', 'author_role', 'company', 'content', 'avatar_path', 'rating', 'is_featured', 'sort_order'])]
class Testimonial extends Model
{
    protected function casts(): array
    {
        return ['is_featured' => 'boolean'];
    }
}
