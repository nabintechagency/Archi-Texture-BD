<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title', 'slug', 'summary', 'description', 'icon', 'sort_order', 'is_active'])]
class Service extends Model
{
    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }
}
