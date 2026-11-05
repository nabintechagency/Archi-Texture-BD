<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class TeamSettingSeeder extends Seeder
{
    public function run(): void
    {
        $defaultTeam = [
            [
                'id' => 1,
                'name' => 'Lutfor Rahaman',
                'role' => 'Principal Architect & Creative Director',
                'experience' => '12+ Years Experience',
                'bio' => 'Specializing in contemporary organic architecture and luxury residential transformations across South Asia and Europe.',
                'image' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
                'tags' => ['Spatial Design', 'Master Planning', 'Bespoke Joinery'],
                'is_active' => true,
            ],
            [
                'id' => 2,
                'name' => 'Elena Rostova',
                'role' => 'Senior Interior Architect',
                'experience' => '9+ Years Experience',
                'bio' => 'Focuses on tactile materiality, historical restoration, and harmonious color psychology for private residential estates.',
                'image' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
                'tags' => ['Color Theory', 'Materiality', 'Lighting Schemes'],
                'is_active' => true,
            ],
            [
                'id' => 3,
                'name' => 'Marcus Sterling',
                'role' => 'Head of Furniture & Procurement',
                'experience' => '8+ Years Experience',
                'bio' => 'Coordinates artisan trade ateliers and custom furniture fabrications, ensuring flawless white-glove delivery.',
                'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
                'tags' => ['Artisan Trade', 'Custom Millwork', 'Procurement'],
                'is_active' => true,
            ],
        ];

        Setting::updateOrCreate(
            ['key' => 'about_team_members'],
            ['value' => json_encode($defaultTeam), 'group' => 'about']
        );
        Setting::updateOrCreate(
            ['key' => 'about_team_title'],
            ['value' => 'Meet Our Principal Design Team', 'group' => 'about']
        );
        Setting::updateOrCreate(
            ['key' => 'about_team_subtitle'],
            ['value' => 'Generational architects, interior sculptors, and procurement specialists dedicated to your vision.', 'group' => 'about']
        );
        Setting::updateOrCreate(
            ['key' => 'about_team_eyebrow'],
            ['value' => 'Creative Direction', 'group' => 'about']
        );
    }
}

