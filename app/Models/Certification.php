<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'issuer', 'credential_id', 'credential_url', 'issued_at', 'expires_at', 'image_path', 'sort_order'])]
class Certification extends Model
{
    protected function casts(): array
    {
        return ['issued_at' => 'date', 'expires_at' => 'date'];
    }
}
