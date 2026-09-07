<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title', 'subtitle', 'description', 'image', 'link_url', 'link_text', 'text_position', 'text_color', 'overlay_opacity', 'status', 'sort_order'])]
class Slider extends Model
{
    protected function casts(): array
    {
        return ['status' => 'boolean', 'overlay_opacity' => 'integer'];
    }
}
