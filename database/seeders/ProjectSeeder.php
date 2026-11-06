<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        if (Project::count() > 0) {
            return;
        }

        $items = [
            [
                'category' => 'Living Room',
                'title' => 'Nordic Minimalist Living Room',
                'summary' => 'Warm oak paneling, boucle textures, and soft diffuse perimeter lighting.',
                'featured_image' => 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
                'status' => 'published',
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'category' => 'Living Room',
                'title' => 'Sunlit Contemporary Lounge',
                'summary' => 'Floor-to-ceiling glass integration with low-profile Belgian linen seating.',
                'featured_image' => 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
                'status' => 'published',
                'is_featured' => false,
                'sort_order' => 2,
            ],
            [
                'category' => 'Living Room',
                'title' => 'Modern Organic Penthouse',
                'summary' => 'Curved architectural plaster wall and custom travertine coffee tables.',
                'featured_image' => 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
                'status' => 'published',
                'is_featured' => false,
                'sort_order' => 3,
            ],
            [
                'category' => 'Bedroom',
                'title' => 'Japandi Master Suite',
                'summary' => 'Slatted cedar headboard with integrated warm bedside illumination.',
                'featured_image' => 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
                'status' => 'published',
                'is_featured' => true,
                'sort_order' => 4,
            ],
            [
                'category' => 'Bedroom',
                'title' => 'Earthy Minimal Bedroom',
                'summary' => 'Textured lime wash walls, raw linen drapery, and woven wool rugs.',
                'featured_image' => 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
                'status' => 'published',
                'is_featured' => false,
                'sort_order' => 5,
            ],
            [
                'category' => 'Bedroom',
                'title' => 'Boutique Loft Retreat',
                'summary' => 'Exposed structural concrete juxtaposed with plush cashmere accents.',
                'featured_image' => 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
                'status' => 'published',
                'is_featured' => false,
                'sort_order' => 6,
            ],
            [
                'category' => 'Kitchen',
                'title' => 'Monolithic Marble Kitchen Island',
                'summary' => 'Calacatta Viola marble, handleless smoked walnut cabinetry, and bronze hardware.',
                'featured_image' => 'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=1200&q=80',
                'status' => 'published',
                'is_featured' => true,
                'sort_order' => 7,
            ],
            [
                'category' => 'Kitchen',
                'title' => 'Scandi Open-Plan Culinary Space',
                'summary' => 'Fluted glass upper cabinets, integrated quartz splashback, and pendant array.',
                'featured_image' => 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=1200&q=80',
                'status' => 'published',
                'is_featured' => false,
                'sort_order' => 8,
            ],
            [
                'category' => 'Kitchen',
                'title' => 'Minimalist Matte Anthracite Kitchen',
                'summary' => 'Hidden prep pantry, flush induction cooking, and architectural linear lighting.',
                'featured_image' => 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1200&q=80',
                'status' => 'published',
                'is_featured' => false,
                'sort_order' => 9,
            ],
            [
                'category' => 'Bathroom',
                'title' => 'Terrazzo & Brass Sanctuary',
                'summary' => 'Custom dual vessel basin with wall-mounted brushed champagne fixtures.',
                'featured_image' => 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80',
                'status' => 'published',
                'is_featured' => true,
                'sort_order' => 10,
            ],
            [
                'category' => 'Bathroom',
                'title' => 'Sculptural Freestanding Bath Suite',
                'summary' => 'Seamless micro-cement walls and concealed ambient niche lighting.',
                'featured_image' => 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80',
                'status' => 'published',
                'is_featured' => false,
                'sort_order' => 11,
            ],
            [
                'category' => 'Bathroom',
                'title' => 'Japanese Hinoki Wet Room',
                'summary' => 'Cedar bath slats, rainfall shower fixture, and natural stone drainage.',
                'featured_image' => 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80',
                'status' => 'published',
                'is_featured' => false,
                'sort_order' => 12,
            ],
            [
                'category' => 'Office',
                'title' => 'Executive Walnut Study',
                'summary' => 'Built-in library shelving with concealed LED strips and leather desk pad.',
                'featured_image' => 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80',
                'status' => 'published',
                'is_featured' => true,
                'sort_order' => 13,
            ],
            [
                'category' => 'Office',
                'title' => 'Minimalist Creative Atelier',
                'summary' => 'Dual ergonomic workstation setup surrounded by natural botanical elements.',
                'featured_image' => 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1200&q=80',
                'status' => 'published',
                'is_featured' => false,
                'sort_order' => 14,
            ],
            [
                'category' => 'Office',
                'title' => 'Architectural Design Studio',
                'summary' => 'High ceilings, acoustic wall baffling, and oversized drafting surfaces.',
                'featured_image' => 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
                'status' => 'published',
                'is_featured' => false,
                'sort_order' => 15,
            ],
            [
                'category' => 'Dining',
                'title' => 'Formal Architectural Dining Hall',
                'summary' => 'Solid smoked oak dining table with sculptural ceramic pendant centerpiece.',
                'featured_image' => 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
                'status' => 'published',
                'is_featured' => true,
                'sort_order' => 16,
            ],
            [
                'category' => 'Dining',
                'title' => 'Contemporary Light-Filled Dining Room',
                'summary' => 'Curated modern dining suite with bespoke natural wood table, sculptural lighting, and upholstered seating.',
                'featured_image' => 'https://images.unsplash.com/photo-1632210826643-9ff7e84be2f9?auto=format&fit=crop&w=1200&q=80',
                'status' => 'published',
                'is_featured' => false,
                'sort_order' => 17,
            ],
            [
                'category' => 'Dining',
                'title' => 'Warm Bronze Entertaining Space',
                'summary' => 'Integrated architectural dining room with floor-to-ceiling windows, sculptural centerpiece, and designer dining chairs.',
                'featured_image' => 'https://images.unsplash.com/photo-1634547588713-edd93045b9f1?auto=format&fit=crop&w=1200&q=80',
                'status' => 'published',
                'is_featured' => false,
                'sort_order' => 18,
            ],
        ];

        foreach ($items as $item) {
            Project::create([
                'title' => $item['title'],
                'slug' => Str::slug($item['title']),
                'category' => $item['category'],
                'summary' => $item['summary'],
                'description' => $item['summary'],
                'featured_image' => $item['featured_image'],
                'status' => $item['status'],
                'is_featured' => $item['is_featured'],
                'sort_order' => $item['sort_order'],
            ]);
        }
    }
}

