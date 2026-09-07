<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Aethel Bouclé Lounge Chair',
                'slug' => 'aethel-boucle-lounge-chair',
                'summary' => 'Sculptural armchair upholstered in ivory bouclé fabric with a brushed bronze swivel base.',
                'description' => 'Handcrafted by master artisans, the Aethel Lounge Chair combines organic silhouettes with timeless materials. Designed for relaxed luxury, it features high-resilience cushioning wrapped in premium Italian textured bouclé with an ergonomic curved backrest.',
                'featured_image' => 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
                    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80',
                ],
                'price' => 145000.00,
                'category' => 'Furniture',
                'sku' => 'PRD-FUR-001',
                'stock_quantity' => 12,
                'status' => 'published',
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Lumina Alabaster Pendant Light',
                'slug' => 'lumina-alabaster-pendant-light',
                'summary' => 'Hand-carved Spanish alabaster stone dome with aged brass stem and warm dimmable LED.',
                'description' => 'Every Lumina pendant reveals unique mineral veining that casts a soft, ethereal ambient glow. Perfect suspended over kitchen islands, dining tables, or bedside alcoves with solid brass hardware.',
                'featured_image' => 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
                ],
                'price' => 82000.00,
                'category' => 'Lighting',
                'sku' => 'PRD-LGT-002',
                'stock_quantity' => 25,
                'status' => 'published',
                'is_featured' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Travertine Monolith Coffee Table',
                'slug' => 'travertine-monolith-coffee-table',
                'summary' => 'Solid Roman travertine low table featuring monolithic curved slab legs and honed matte finish.',
                'description' => 'Milled from unfilled Roman travertine with a matte honed finish. The architectural geometry celebrates classical Roman stonework translated into contemporary residential spaces.',
                'featured_image' => 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80',
                ],
                'price' => 189000.00,
                'category' => 'Furniture',
                'sku' => 'PRD-FUR-003',
                'stock_quantity' => 8,
                'status' => 'published',
                'is_featured' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Komorebi Hand-Knotted Wool Rug',
                'slug' => 'komorebi-hand-knotted-wool-rug',
                'summary' => 'New Zealand wool and raw silk blend with subtle textural high-low carving in oatmeal tones.',
                'description' => 'Woven with 60 knots per square inch, Komorebi reflects the gentle play of filtered light. Its ultra-soft plush pile delivers grounding warmth and quiet sophistication to living and bedroom spaces.',
                'featured_image' => 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1000&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1000&q=80',
                ],
                'price' => 125000.00,
                'category' => 'Textiles',
                'sku' => 'PRD-TEX-004',
                'stock_quantity' => 15,
                'status' => 'published',
                'is_featured' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Aura Smoked Oak Dining Table',
                'slug' => 'aura-smoked-oak-dining-table',
                'summary' => 'Solid French white oak with a subtle smoked cerused finish and soft beveled perimeter.',
                'description' => 'Seats up to eight guests with ample leg clearance. Built with sustainable kiln-dried hardwood, solid mortise and tenon joinery, and finished with a low-VOC matte protective seal.',
                'featured_image' => 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1000&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1000&q=80',
                ],
                'price' => 265000.00,
                'category' => 'Furniture',
                'sku' => 'PRD-FUR-005',
                'stock_quantity' => 5,
                'status' => 'published',
                'is_featured' => false,
                'sort_order' => 5,
            ],
            [
                'name' => 'Solstice Sculptural Ceramic Vase Set',
                'slug' => 'solstice-sculptural-ceramic-vase-set',
                'summary' => 'Set of two hand-thrown stoneware vessels in raw volcanic sand and matte cream glaze.',
                'description' => 'Organic, asymmetrical silhouettes inspired by wind-swept coastal rock formations. Can be displayed individually or as a harmonious pair on mantels, consoles, and dining tables.',
                'featured_image' => 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1000&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1000&q=80',
                ],
                'price' => 34000.00,
                'category' => 'Decor',
                'sku' => 'PRD-DEC-006',
                'stock_quantity' => 30,
                'status' => 'published',
                'is_featured' => true,
                'sort_order' => 6,
            ],
            [
                'name' => 'Brutalist Cast Bronze Sconce',
                'slug' => 'brutalist-cast-bronze-sconce',
                'summary' => 'Heavy sand-cast solid bronze wall light with textured relief and dual-directional wash.',
                'description' => 'Each sconce is individually cast using lost-wax methods, resulting in a unique tactile surface that develops a rich, natural patina over time.',
                'featured_image' => 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80',
                ],
                'price' => 59000.00,
                'category' => 'Lighting',
                'sku' => 'PRD-LGT-007',
                'stock_quantity' => 18,
                'status' => 'published',
                'is_featured' => false,
                'sort_order' => 7,
            ],
            [
                'name' => 'Minimalist Belgian Washed Linen Drapes',
                'slug' => 'minimalist-belgian-washed-linen-drapes',
                'summary' => 'Heavyweight European washed linen panels with concealed pinch pleats in warm sand.',
                'description' => 'Crafted from 100% Belgian flax with a heavy 380 GSM weight that drapes effortlessly while filtering harsh daylight into a golden glow.',
                'featured_image' => 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
                ],
                'price' => 42000.00,
                'category' => 'Textiles',
                'sku' => 'PRD-TEX-008',
                'stock_quantity' => 22,
                'status' => 'published',
                'is_featured' => false,
                'sort_order' => 8,
            ],
        ];

        foreach ($products as $data) {
            Product::updateOrCreate(
                ['slug' => $data['slug']],
                $data
            );
        }
    }
}
