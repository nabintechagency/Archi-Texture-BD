<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['company', 'job_title', 'employment_type', 'location', 'started_at', 'ended_at', 'is_current', 'description', 'sort_order'])]
class Experience extends Model
{
    protected function casts(): array
    {
        return ['started_at' => 'date', 'ended_at' => 'date', 'is_current' => 'boolean'];
    }
}
