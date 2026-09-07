<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['institution', 'degree', 'field_of_study', 'location', 'started_at', 'ended_at', 'description', 'sort_order'])]
class Education extends Model
{
    protected function casts(): array
    {
        return ['started_at' => 'date', 'ended_at' => 'date'];
    }
}
