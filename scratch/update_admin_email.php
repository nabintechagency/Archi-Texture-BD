<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = App\Models\User::first();
if ($user) {
    $user->email = 'admin@architexturebd.com';
    $user->save();
    echo "SUCCESS: Admin email updated to: " . $user->email . "\n";
} else {
    $user = App\Models\User::create([
        'name' => 'Archi Texture Admin',
        'email' => 'admin@architexturebd.com',
        'password' => Illuminate\Support\Facades\Hash::make('admin123'),
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);
    echo "SUCCESS: Created admin with: " . $user->email . "\n";
}
