import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { useRef, useState } from 'react';
import {
    ArrowRight, Users, MessagesSquare, Box, Palette,
    Star, Check, ChevronRight, MoveHorizontal, Sparkles, Layers,
} from 'lucide-react';

const IMG = {
    hero: '/images/luxury-hero-drawing-room.jpg',
    process: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=80',
    processSmall: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
};

const GALLERY = {
    'Living Room': [
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80',
    ],
    Bedroom: [
        'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80',
    ],
    Kitchen: [
        'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=900&q=80',
    ],
    Bathroom: [
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=900&q=80',
    ],
    Office: [
        'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
    ],
    Dining: [
        'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1615968679312-9b7ed9f04e79?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1595514535215-9a5e0e8e04be?auto=format&fit=crop&w=900&q=80',
    ],
};

const FALLBACK_ROOMS = [
    { before: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80', after: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=1200&q=80' },
    { before: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=80', after: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80' },
];

const DEFAULT_TESTIMONIALS = [
    {
        author_name: 'Sarah Rahman',
        author_role: 'Homeowner',
        company: 'Gulshan, Dhaka',
        rating: 5,
        quote: 'Working with Archi Texture was an effortless journey from concept to reality. Every custom piece exceeded our expectations.',
    },
    {
        author_name: 'Tanvir Ahmed',
        author_role: 'Managing Director',
        company: 'Banani',
        rating: 5,
        quote: 'The bespoke furniture and lighting completely transformed our penthouse. The craftsmanship is world-class.',
    },
    {
        author_name: 'Nusrat Jahan',
        author_role: 'Architectural Enthusiast',
        company: 'Dhanmondi',
        rating: 5,
        quote: 'Their attention to tactile materials, lighting warmth, and room proportions is extraordinary.',
    },
];

/* ---------- Hero ---------- */
function HeroSection({ settings }) {
    return (
        <section className="relative flex w-full items-center justify-center overflow-hidden">
            {/* Background with Still Royal Drawing Room Picture and Ambient Overlay */}
            <div className="absolute inset-0 overflow-hidden">
                <img
                    src={IMG.hero}
                    alt="Majestic Royal Drawing Room Interior"
                    className="h-full w-full object-cover object-center"
                />
                
                {/* Mood Gradient Overlays for High Legibility & Warm Royal Ambience */}
                <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/35 to-charcoal/70" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-6 md:px-8 lg:px-10 pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24 text-center">
                <p className="eyebrow animate-fade-in-up !text-bronze-light text-[10px] sm:text-[11px] md:text-xs tracking-[0.2em] sm:tracking-[0.24em] mb-2.5 sm:mb-3">
                    #1 Interior Design Service
                </p>
                <h1 className="font-serif-display animate-fade-in-up text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[76px] leading-[1.12] sm:leading-[1.08] text-white">
                    Interior Design
                    <br />
                    by Top Experts
                </h1>
                <div className="animate-fade-in-up mt-7 sm:mt-9 md:mt-11 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 w-full max-w-xs sm:max-w-none mx-auto">
                    <a
                        href="/contact"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-[8px] border border-white/60 px-7 sm:px-9 py-3.5 sm:py-4 text-xs sm:text-[13px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-charcoal"
                    >
                        Start My Transformation <ArrowRight size={15} />
                    </a>
                    <a
                        href="/products"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full sm:w-auto items-center justify-center rounded-[8px] bg-white text-black border border-white px-7 sm:px-9 py-3.5 sm:py-4 text-xs sm:text-[13px] font-semibold uppercase tracking-[0.16em] shadow-xl transition-all duration-300 hover:bg-bronze hover:border-bronze hover:text-white"
                    >
                        Our Products
                    </a>
                </div>
            </div>
        </section>
    );
}


/* ---------- Featured Products ---------- */
const DEFAULT_FEATURED_PRODUCTS = [
    {
        id: 1,
        name: 'Aethel Bouclé Lounge Chair',
        category: 'Furniture',
        price: 145000,
        featured_image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
        summary: 'Sculptural armchair upholstered in ivory bouclé fabric with a brushed bronze swivel base.',
    },
    {
        id: 2,
        name: 'Lumina Alabaster Pendant Light',
        category: 'Lighting',
        price: 82000,
        featured_image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
        summary: 'Hand-carved Spanish alabaster stone dome with aged brass stem and warm dimmable LED.',
    },
    {
        id: 3,
        name: 'Travertine Monolith Coffee Table',
        category: 'Furniture',
        price: 189000,
        featured_image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80',
        summary: 'Solid Roman travertine low table featuring monolithic curved slab legs and honed matte finish.',
    },
    {
        id: 4,
        name: 'Komorebi Hand-Knotted Wool Rug',
        category: 'Textiles',
        price: 125000,
        featured_image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1000&q=80',
        summary: 'New Zealand wool and raw silk blend with subtle textural high-low carving in oatmeal tones.',
    },
    {
        id: 6,
        name: 'Solstice Sculptural Ceramic Vase Set',
        category: 'Decor',
        price: 34000,
        featured_image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1000&q=80',
        summary: 'Set of two hand-thrown stoneware vessels in raw volcanic sand and matte cream glaze.',
    },
];

function FeaturedProductsSection({ products = [] }) {
    const displayProducts = Array.isArray(products) && products.length > 0 ? products.slice(0, 5) : DEFAULT_FEATURED_PRODUCTS;

    return (
        <section className="bg-white py-20 md:py-28 border-t border-sand/60 relative overflow-hidden">
            <div className="mx-auto max-w-[1440px] px-6 md:px-10">
                {/* Header - Centered in middle */}
                <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
                    <p className="eyebrow mb-2.5">Signature Collection</p>
                    <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl text-charcoal leading-tight">
                        Featured Products
                    </h2>
                    <p className="mt-3.5 max-w-xl mx-auto text-sm md:text-base leading-relaxed text-charcoal/65">
                        Explore our collection of stylish interior products made to elevate your space
                    </p>
                </div>

                {/* 5 Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6">
                    {displayProducts.map((product) => (
                        <div
                            key={product.id}
                            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-sand/80 shadow-sm hover:shadow-2xl hover:border-bronze/40 transition-all duration-300"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand/30">
                                {product.featured_image ? (
                                    <img
                                        src={product.featured_image}
                                        alt={product.name}
                                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-charcoal/30">
                                        No image
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {product.category && (
                                    <span className="absolute left-3 top-3 rounded-full bg-white/95 backdrop-blur-md px-2.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-charcoal shadow-sm">
                                        {product.category}
                                    </span>
                                )}

                                <a
                                    href="/products"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-charcoal shadow-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-bronze hover:text-white"
                                >
                                    <span>Explore</span>
                                    <ArrowRight size={11} />
                                </a>
                            </div>

                            {/* Info Container */}
                            <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                                <div>
                                    <h3 className="font-serif-display text-base font-semibold text-charcoal group-hover:text-bronze transition-colors line-clamp-1">
                                        {product.name}
                                    </h3>

                                    {product.summary && (
                                        <p className="mt-1.5 text-xs leading-relaxed text-charcoal/60 line-clamp-2">
                                            {product.summary}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-4 pt-3.5 border-t border-sand/70 flex items-center justify-between">
                                    {product.price ? (
                                        <span className="font-serif-display text-sm sm:text-[15px] font-bold text-bronze">
                                            BDT {Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-charcoal/50 italic">Price on request</span>
                                    )}

                                    <a
                                        href="/products"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal/70 hover:text-bronze transition-colors inline-flex items-center gap-1"
                                    >
                                        Details <ArrowRight size={11} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Prominent View All Products Button */}
                <div className="mt-12 text-center">
                    <a
                        href="/products"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 rounded-[8px] bg-charcoal px-9 py-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-white shadow-xl transition-all duration-300 hover:bg-bronze hover:shadow-bronze/20"
                    >
                        <span>View All Products</span>
                        <ArrowRight size={15} />
                    </a>
                </div>
            </div>
        </section>
    );
}

/* ---------- Features ---------- */
function FeaturesSection() {
    const features = [
        { icon: Users, title: 'Multiple Concepts', text: 'Initial ideas submitted from several top accomplished designers.' },
        { icon: MessagesSquare, title: 'One-on-One Help', text: 'Personal consultation with your dedicated interior architect.' },
        { icon: Box, title: 'Photorealistic 3D', text: 'Lifelike renderings and lighting simulations of your exact space.' },
        { icon: Palette, title: 'Full Design Package', text: 'Curated color palette, floor plan, and bespoke shopping list included.' },
    ];

    return (
        <section className="relative overflow-hidden bg-white py-20 md:py-28 border-t border-sand/60">
            {/* Subtle architectural backdrop dot grid */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#A98952_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

            <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-10">
                <div className="mb-14 text-center">
                    <p className="eyebrow mb-3">The Archi Texture Difference</p>
                    <h2 className="font-serif-display text-3xl text-charcoal md:text-4xl lg:text-5xl">
                        Personalized Design Services
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map(({ icon: Icon, title, text }) => (
                        <div
                            key={title}
                            className="group flex flex-col items-center rounded-2xl border border-sand/80 bg-[#FAF7F2]/90 p-8 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-bronze/50 hover:bg-white hover:shadow-xl"
                        >
                            <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-bronze transition-all duration-300 group-hover:scale-110 group-hover:bg-bronze group-hover:text-white shadow-sm border border-sand/60">
                                <Icon size={26} strokeWidth={1.5} />
                            </div>
                            <h3 className="font-serif-display text-xl font-semibold text-charcoal">{title}</h3>
                            <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-charcoal/65">{text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}


/* ---------- Before / After compare slider ---------- */
function CompareSlider({ before, after, alt }) {
    const [pos, setPos] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const ref = useRef(null);

    const update = (clientX) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const newPos = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
        setPos(newPos);
    };

    return (
        <div className="flex flex-col">
            {/* Interactive Photo Comparison Container */}
            <div
                ref={ref}
                className="group relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] w-full cursor-ew-resize select-none overflow-hidden rounded-2xl shadow-2xl border border-sand bg-sand/20 touch-none"
                onPointerDown={(e) => {
                    setIsDragging(true);
                    e.currentTarget.setPointerCapture?.(e.pointerId);
                    update(e.clientX);
                }}
                onPointerMove={(e) => isDragging && update(e.clientX)}
                onPointerUp={() => setIsDragging(false)}
                onPointerCancel={() => setIsDragging(false)}
            >
                {/* After Image (Base) */}
                <img
                    src={after}
                    alt={`${alt} - after`}
                    loading="lazy"
                    className="h-full w-full object-cover select-none pointer-events-none"
                    draggable={false}
                />

                {/* Before Image (Overlay with clipPath) */}
                <div
                    className={`absolute inset-0 select-none ${isDragging ? '' : 'transition-[clip-path] duration-300 ease-out'}`}
                    style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
                >
                    <img
                        src={before}
                        alt={`${alt} - before`}
                        loading="lazy"
                        className="h-full w-full object-cover grayscale-[0.15] select-none pointer-events-none"
                        draggable={false}
                    />
                </div>

                {/* Before and After labels on photo */}
                <span className="pointer-events-none absolute left-3.5 top-3.5 z-10 rounded-md bg-charcoal/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md shadow-md border border-white/15">
                    Before
                </span>
                <span className="pointer-events-none absolute right-3.5 top-3.5 z-10 rounded-md bg-bronze/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md shadow-md border border-white/15">
                    After
                </span>
                <div
                    className={`pointer-events-none absolute inset-y-0 z-20 ${isDragging ? '' : 'transition-[left] duration-300 ease-out'}`}
                    style={{ left: `${pos}%` }}
                >
                    <div className="h-full w-[2px] bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)]" />
                    <div className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-charcoal shadow-2xl border border-sand/40 transition-transform duration-200 group-hover:scale-110">
                        <MoveHorizontal size={18} className="text-charcoal" />
                    </div>
                </div>
            </div>

            {/* Responsive Quick Click Control Bar */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
                <p className="text-xs text-charcoal/60 flex items-center gap-1.5 text-center sm:text-left">
                    <MoveHorizontal size={14} className="text-bronze shrink-0" />
                    <span>Drag slider or click buttons to switch views</span>
                </p>

                {/* Clickable View Switcher Buttons */}
                <div className="inline-flex items-center rounded-xl bg-cream/90 p-1 border border-sand/80 shadow-inner">
                    <button
                        type="button"
                        onClick={() => setPos(100)}
                        className={`rounded-lg px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] transition-all duration-200 ${
                            pos >= 90
                                ? 'bg-charcoal text-white shadow-md'
                                : 'text-charcoal/70 hover:text-charcoal hover:bg-white/60'
                        }`}
                    >
                        Before
                    </button>
                    <button
                        type="button"
                        onClick={() => setPos(50)}
                        className={`rounded-lg px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] transition-all duration-200 ${
                            pos > 15 && pos < 85
                                ? 'bg-charcoal text-white shadow-md'
                                : 'text-charcoal/70 hover:text-charcoal hover:bg-white/60'
                        }`}
                    >
                        Split View
                    </button>
                    <button
                        type="button"
                        onClick={() => setPos(0)}
                        className={`rounded-lg px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] transition-all duration-200 ${
                            pos <= 10
                                ? 'bg-bronze text-white shadow-md'
                                : 'text-charcoal/70 hover:text-charcoal hover:bg-white/60'
                        }`}
                    >
                        After
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ---------- Transformations showcase ---------- */
function TransformationsSection({ projects }) {
    const [active, setActive] = useState(0);

    const items = (projects?.length ? projects.slice(0, 6).map((p, i) => ({
        id: p.id,
        title: p.title,
        summary: p.summary,
        challenge: p.summary || 'A tired, dated space in need of a cohesive modern refresh.',
        result: p.title,
        before: FALLBACK_ROOMS[i % FALLBACK_ROOMS.length].before,
        after: p.featured_image || FALLBACK_ROOMS[i % FALLBACK_ROOMS.length].after,
        author: 'Client',
    })) : FALLBACK_ROOMS.map((r, i) => ({ id: i, title: i === 0 ? 'Modern Coastal Makeover' : 'Glam Apartment Refresh', summary: '', challenge: '', result: '', before: r.before, after: r.after, author: 'Client' })));

    const current = items[active] || items[0];

    return (
        <section className="bg-[#FAF7F2] py-16 sm:py-20 md:py-24 border-t border-sand/70">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-10">
                <div className="mb-8 sm:mb-12 text-center">
                    <p className="eyebrow mb-2.5">Real Transformations</p>
                    <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl leading-tight text-charcoal">
                        Before &amp; After
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-charcoal/65 max-w-md mx-auto">
                        Explore our spatial redesigns with responsive instant comparison.
                    </p>
                </div>

                {/* Responsive Project / Room Tabs */}
                <div className="mb-6 sm:mb-8 flex items-center justify-start sm:justify-center overflow-x-auto pb-2 sm:pb-0 scrollbar-none gap-2 px-1">
                    {items.map((item, i) => (
                        <button
                            key={item.id}
                            onClick={() => setActive(i)}
                            className={`shrink-0 rounded-[8px] px-4 sm:px-5 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-all duration-200 ${
                                active === i
                                    ? 'bg-charcoal text-white shadow-md'
                                    : 'bg-white text-charcoal/70 border border-sand/70 hover:text-charcoal hover:bg-sand/40'
                            }`}
                        >
                            {item.title.length > 30 ? `${item.title.slice(0, 30)}…` : item.title}
                        </button>
                    ))}
                </div>

                {/* Main Interactive Photo Comparison Container */}
                <div className="mx-auto max-w-4xl">
                    <CompareSlider key={current.id} before={current.before} after={current.after} alt={current.title} />

                    <div className="mt-8 flex justify-center">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-[8px] bg-charcoal px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-xl transition-all duration-300 hover:bg-bronze hover:shadow-bronze/20"
                        >
                            Start Your Transformation <ChevronRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ---------- Brand marquee ---------- */
function BrandsSection() {
    const brands = ['North South University', 'BRAC University', 'BGMEA University of Fashion & Technology (BUFT)', 'American International University - Bangladesh (AIUB)', 'Prothom Alo', 'The Daily Star', 'Somoy TV'];
    return (
        <section className="overflow-hidden border-y border-sand/60 bg-[#FAF7F2] py-10">
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#FAF7F2] to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#FAF7F2] to-transparent" />
                <div className="flex w-max gap-14" style={{ animation: 'marquee-left 60s linear infinite' }}>
                    {[...brands, ...brands].map((brand, i) => (
                        <span key={i} className="font-serif-display whitespace-nowrap text-xl italic text-charcoal/35 md:text-2xl">
                            {brand}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ---------- Gallery with tabs ---------- */
function GallerySection() {
    const categories = Object.keys(GALLERY);
    const [tab, setTab] = useState(categories[0]);

    return (
        <section className="bg-white py-20 md:py-28 border-b border-sand/60">
            <div className="mx-auto max-w-[1440px] px-6 md:px-10">
                <div className="mb-10 text-center">
                    <p className="eyebrow mb-3">Portfolio</p>
                    <h2 className="font-serif-display text-4xl leading-tight text-charcoal md:text-5xl">Explore Spaces We've Transformed</h2>
                </div>

                <div className="mb-10 flex flex-wrap justify-center gap-x-8 gap-y-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setTab(cat)}
                            className={`pb-1 text-[13px] font-medium uppercase tracking-[0.14em] transition-colors ${
                                tab === cat ? 'border-b border-bronze text-bronze font-semibold' : 'text-charcoal/50 hover:text-charcoal'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
                    {GALLERY[tab].map((src, i) => (
                        <div key={`${tab}-${i}`} className={`group relative overflow-hidden rounded-sm ${i === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-auto md:h-full' : 'aspect-[4/3]'}`}>
                            <img
                                src={src}
                                alt={`${tab} interior design ${i + 1}`}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-charcoal/0 transition-colors duration-300 group-hover:bg-charcoal/20" />
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <a
                        href="/portfolio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-[8px] border border-charcoal/30 bg-[#FAF7F2] px-9 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-charcoal transition-all duration-300 hover:border-bronze hover:bg-bronze hover:text-white shadow-sm"
                    >
                        View Full Portfolio <ArrowRight size={14} />
                    </a>
                </div>
            </div>
        </section>
    );
}

/* ---------- Testimonials ---------- */
function TestimonialsSection({ testimonials = [] }) {
    const list = testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;

    return (
        <section className="bg-[#FAF7F2] py-20 md:py-28 border-b border-sand/60">
            <div className="mx-auto max-w-[1440px] px-6 md:px-10">
                <div className="mb-14 text-center">
                    <p className="eyebrow mb-3">Client Stories</p>
                    <h2 className="font-serif-display text-4xl leading-tight text-charcoal md:text-5xl">Spaces Loved by Real Clients</h2>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {list.map((t, i) => (
                        <figure key={i} className="flex flex-col justify-between rounded-2xl border border-sand/80 bg-white p-8 shadow-sm hover:shadow-xl hover:border-bronze/40 transition-all duration-300">
                            <div>
                                <div className="mb-4 flex gap-1 text-bronze">
                                    {Array.from({ length: t.rating || 5 }).map((_, s) => (
                                        <Star key={s} size={16} fill="currentColor" />
                                    ))}
                                </div>
                                <blockquote className="text-sm leading-relaxed text-charcoal/80">
                                    &ldquo;{t.quote || t.content}&rdquo;
                                </blockquote>
                            </div>
                            <figcaption className="mt-6 flex items-center gap-3 border-t border-sand/70 pt-4">
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bronze/15 font-serif-display text-sm font-bold text-bronze">
                                    {t.author_name ? t.author_name[0] : 'C'}
                                </span>
                                <div>
                                    <p className="text-sm font-medium text-charcoal">{t.author_name}</p>
                                    <p className="text-xs text-charcoal/50">{[t.author_role, t.company].filter(Boolean).join(' · ')}</p>
                                </div>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ---------- CTA ---------- */
function CTASection() {
    return (
        <section className="relative overflow-hidden bg-charcoal py-24 text-center md:py-32">
            <div className="absolute inset-0 opacity-25">
                <img src={IMG.hero} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="relative z-10 mx-auto max-w-2xl px-6">
                <p className="eyebrow mb-4 !text-bronze-light">Begin Today</p>
                <h2 className="font-serif-display text-4xl leading-tight text-white md:text-5xl">
                    Ready to Fall Back in Love<br className="hidden md:block" /> With Your Space?
                </h2>
                <p className="mx-auto mt-5 max-w-lg leading-relaxed text-white/70">
                    Bespoke design, top-rated designers, and a guarantee you'll love the result.
                </p>
                <Link
                    href="/contact"
                    className="mt-9 inline-flex items-center gap-2 rounded-[8px] bg-bronze px-11 py-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-white shadow-xl transition-all duration-300 hover:bg-bronze-dark"
                >
                    BOOK OUR DESIGN <ArrowRight size={16} />
                </Link>
            </div>
        </section>
    );
}

export default function Home({ projects, skills, products = [], services, testimonials, settings }) {
    return (
        <PublicLayout settings={settings}>
            <Head title={settings.site_title || 'Interior Design'} />
            <HeroSection settings={settings} />
            <FeaturedProductsSection products={products} />
            <TransformationsSection projects={projects} />
            <FeaturesSection />
            <BrandsSection />
            <GallerySection />
            <TestimonialsSection testimonials={testimonials} />
            <CTASection />
        </PublicLayout>
    );
}
