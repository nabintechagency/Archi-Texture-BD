<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['title', 'slug', 'summary', 'description', 'featured_image', 'project_url', 'repository_url', 'technologies', 'status', 'is_featured', 'completed_at', 'sort_order'])]
class Project extends Model
{
    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class);
    }

    protected function casts(): array
    {
        return ['technologies' => 'array', 'is_featured' => 'boolean', 'completed_at' => 'date'];
    }
}
