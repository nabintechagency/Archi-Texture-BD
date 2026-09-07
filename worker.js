const PRODUCTS = [
    {
        id: 1,
        name: "Aethel Bouclé Lounge Chair",
        slug: "aethel-boucle-lounge-chair",
        summary: "Sculptural armchair upholstered in ivory bouclé fabric with a brushed bronze swivel base.",
        description: "Handcrafted by master artisans, the Aethel Lounge Chair combines organic silhouettes with timeless materials. Designed for relaxed luxury, it features high-resilience cushioning wrapped in premium Italian textured bouclé with an ergonomic curved backrest.",
        featured_image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80"
        ],
        price: 145000,
        category: "Furniture",
        sku: "PRD-FUR-001",
        stock_quantity: 12,
        status: "published",
        is_featured: true,
        sort_order: 1
    },
    {
        id: 2,
        name: "Lumina Alabaster Pendant Light",
        slug: "lumina-alabaster-pendant-light",
        summary: "Hand-carved Spanish alabaster stone dome with aged brass stem and warm dimmable LED.",
        description: "Every Lumina pendant reveals unique mineral veining that casts a soft, ethereal ambient glow. Perfect suspended over kitchen islands, dining tables, or bedside alcoves with solid brass hardware.",
        featured_image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
        gallery: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80"],
        price: 82000,
        category: "Lighting",
        sku: "PRD-LGT-002",
        stock_quantity: 25,
        status: "published",
        is_featured: true,
        sort_order: 2
    },
    {
        id: 3,
        name: "Travertine Monolith Coffee Table",
        slug: "travertine-monolith-coffee-table",
        summary: "Solid Roman travertine low table featuring monolithic curved slab legs and honed matte finish.",
        description: "Milled from unfilled Roman travertine with a matte honed finish. The architectural geometry celebrates classical Roman stonework translated into contemporary residential spaces.",
        featured_image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80",
        gallery: ["https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80"],
        price: 189000,
        category: "Furniture",
        sku: "PRD-FUR-003",
        stock_quantity: 8,
        status: "published",
        is_featured: true,
        sort_order: 3
    },
    {
        id: 4,
        name: "Komorebi Hand-Knotted Wool Rug",
        slug: "komorebi-hand-knotted-wool-rug",
        summary: "New Zealand wool and raw silk blend with subtle textural high-low carving in oatmeal tones.",
        description: "Woven with 60 knots per square inch, Komorebi reflects the gentle play of filtered light. Its ultra-soft plush pile delivers grounding warmth and quiet sophistication to living and bedroom spaces.",
        featured_image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1000&q=80",
        gallery: ["https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1000&q=80"],
        price: 125000,
        category: "Textiles",
        sku: "PRD-TEX-004",
        stock_quantity: 15,
        status: "published",
        is_featured: true,
        sort_order: 4
    },
    {
        id: 5,
        name: "Aura Smoked Oak Dining Table",
        slug: "aura-smoked-oak-dining-table",
        summary: "Solid French white oak with a subtle smoked cerused finish and soft beveled perimeter.",
        description: "Seats up to eight guests with ample leg clearance. Built with sustainable kiln-dried hardwood, solid mortise and tenon joinery, and finished with a low-VOC matte protective seal.",
        featured_image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1000&q=80",
        gallery: ["https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1000&q=80"],
        price: 265000,
        category: "Furniture",
        sku: "PRD-FUR-005",
        stock_quantity: 5,
        status: "published",
        is_featured: false,
        sort_order: 5
    },
    {
        id: 6,
        name: "Solstice Sculptural Ceramic Vase Set",
        slug: "solstice-sculptural-ceramic-vase-set",
        summary: "Set of two hand-thrown stoneware vessels in raw volcanic sand and matte cream glaze.",
        description: "Organic, asymmetrical silhouettes inspired by wind-swept coastal rock formations. Can be displayed individually or as a harmonious pair on mantels, consoles, and dining tables.",
        featured_image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1000&q=80",
        gallery: ["https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1000&q=80"],
        price: 34000,
        category: "Decor",
        sku: "PRD-DEC-006",
        stock_quantity: 30,
        status: "published",
        is_featured: true,
        sort_order: 6
    },
    {
        id: 7,
        name: "Brutalist Cast Bronze Sconce",
        slug: "brutalist-cast-bronze-sconce",
        summary: "Heavy sand-cast solid bronze wall light with textured relief and dual-directional wash.",
        description: "Each sconce is individually cast using lost-wax methods, resulting in a unique tactile surface that develops a rich, natural patina over time.",
        featured_image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80",
        gallery: ["https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80"],
        price: 59000,
        category: "Lighting",
        sku: "PRD-LGT-007",
        stock_quantity: 18,
        status: "published",
        is_featured: false,
        sort_order: 7
    },
    {
        id: 8,
        name: "Minimalist Belgian Washed Linen Drapes",
        slug: "minimalist-belgian-washed-linen-drapes",
        summary: "Heavyweight European washed linen panels with concealed pinch pleats in warm sand.",
        description: "Crafted from 100% Belgian flax with a heavy 380 GSM weight that drapes effortlessly while filtering harsh daylight into a golden glow.",
        featured_image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
        gallery: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80"],
        price: 42000,
        category: "Textiles",
        sku: "PRD-TEX-008",
        stock_quantity: 22,
        status: "published",
        is_featured: false,
        sort_order: 8
    }
];

const SETTINGS = {
    site_title: "ARCHI-TEXTURE",
    company_name: "ARCHI-TEXTURE",
    site_tagline: "Interior Products Wholesale Showroom and Farm",
    contact_email: "contact@architexture.com",
    email: "contact@architexture.com",
    contact_phone: "01626778573",
    phone: "01626778573",
    contact_address: "Mohakhali, Dhaka, Bangladesh"
};

function getInertiaPayload(pathname) {
    const cleanPath = pathname.toLowerCase().replace(/\/$/, '') || '/';
    let component = 'Public/Home';
    let props = {
        products: PRODUCTS,
        settings: SETTINGS,
        projects: [],
        skills: [],
        services: [],
        testimonials: []
    };

    if (cleanPath === '/products' || cleanPath === '/services') {
        component = 'Public/Products';
        props = { products: PRODUCTS, settings: SETTINGS };
    } else if (cleanPath === '/portfolio') {
        component = 'Public/Portfolio';
        props = { projects: [], settings: SETTINGS };
    } else if (cleanPath === '/about') {
        component = 'Public/About';
        props = { experiences: [], education: [], settings: SETTINGS };
    } else if (cleanPath === '/experience') {
        component = 'Public/Experience';
        props = { experiences: [], education: [], certifications: [], settings: SETTINGS };
    } else if (cleanPath === '/contact') {
        component = 'Public/Contact';
        props = { settings: SETTINGS };
    }

    return {
        component,
        props,
        url: pathname,
        version: '1.0.0'
    };
}

export default {
    async fetch(request, env) {
        try {
            const url = new URL(request.url);
            const pathname = url.pathname;

            // 1. Handle Inertia client-side navigation requests
            if (request.headers.get('X-Inertia') === 'true') {
                const payload = getInertiaPayload(pathname);
                return new Response(JSON.stringify(payload), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Inertia': 'true',
                        'Vary': 'Accept',
                    },
                });
            }

            // 2. Try exact match from static assets
            const assetsFetcher = env?.ASSETS || null;
            if (assetsFetcher) {
                const response = await assetsFetcher.fetch(request);
                if (response.status !== 404) {
                    const contentType = response.headers.get('Content-Type') || '';
                    if (pathname === '/' || pathname === '/index.html' || contentType.includes('text/html')) {
                        const headers = new Headers(response.headers);
                        headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
                        headers.set('Pragma', 'no-cache');
                        headers.set('Expires', '0');
                        return new Response(response.body, {
                            status: response.status,
                            headers: headers,
                        });
                    }
                    return response;
                }

                // 3. If asking for a .js chunk from any subpath, search in /build/assets and /assets
                if (pathname.endsWith('.js')) {
                    const filename = pathname.split('/').pop();
                    const tryBuild = await assetsFetcher.fetch(new Request(new URL(`/build/assets/${filename}`, request.url)));
                    if (tryBuild.status !== 404) return tryBuild;

                    const tryAssets = await assetsFetcher.fetch(new Request(new URL(`/assets/${filename}`, request.url)));
                    if (tryAssets.status !== 404) return tryAssets;

                    return new Response(`/* Chunk ${filename} expired */ if (typeof window !== 'undefined') { window.location.reload(); }`, {
                        status: 200,
                        headers: { 'Content-Type': 'application/javascript' },
                    });
                }

                // 4. If asking for a .css file from any subpath, search in /build/assets and /assets
                if (pathname.endsWith('.css')) {
                    const filename = pathname.split('/').pop();
                    const tryBuild = await assetsFetcher.fetch(new Request(new URL(`/build/assets/${filename}`, request.url)));
                    if (tryBuild.status !== 404) return tryBuild;

                    const tryAssets = await assetsFetcher.fetch(new Request(new URL(`/assets/${filename}`, request.url)));
                    if (tryAssets.status !== 404) return tryAssets;

                    return new Response(`/* CSS not found */`, {
                        status: 200,
                        headers: { 'Content-Type': 'text/css' },
                    });
                }

                // 5. SPA Route Fallback: serve index.html with no-cache headers for all other routes
                const htmlRes = await assetsFetcher.fetch(new Request(new URL('/index.html', request.url)));
                const headers = new Headers(htmlRes.headers);
                headers.set('Content-Type', 'text/html; charset=utf-8');
                headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
                headers.set('Pragma', 'no-cache');
                headers.set('Expires', '0');
                return new Response(htmlRes.body, {
                    status: 200,
                    headers: headers,
                });
            }
        } catch (err) {
            return new Response(`Worker Error: ${err.message || err}`, { status: 500 });
        }
    },
};
