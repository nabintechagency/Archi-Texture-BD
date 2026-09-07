import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = [
    { name: 'Living Room', count: 3, tag: 'Sanctuary & Comfort' },
    { name: 'Bedroom', count: 3, tag: 'Serenity & Rest' },
    { name: 'Kitchen', count: 3, tag: 'Culinary Craft' },
    { name: 'Bathroom', count: 3, tag: 'Spa & Wellness' },
    { name: 'Office', count: 3, tag: 'Focus & Ambience' },
    { name: 'Dining', count: 3, tag: 'Gathering & Warmth' },
];

const GALLERY = {
    'Living Room': [
        {
            src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
            title: 'Nordic Minimalist Living Room',
            subtitle: 'Warm oak paneling, boucle textures, and soft diffuse perimeter lighting.',
        },
        {
            src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
            title: 'Sunlit Contemporary Lounge',
            subtitle: 'Floor-to-ceiling glass integration with low-profile Belgian linen seating.',
        },
        {
            src: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
            title: 'Modern Organic Penthouse',
            subtitle: 'Curved architectural plaster wall and custom travertine coffee tables.',
        },
    ],
    Bedroom: [
        {
            src: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
            title: 'Japandi Master Suite',
            subtitle: 'Slatted cedar headboard with integrated warm bedside illumination.',
        },
        {
            src: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
            title: 'Earthy Minimal Bedroom',
            subtitle: 'Textured lime wash walls, raw linen drapery, and woven wool rugs.',
        },
        {
            src: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
            title: 'Boutique Loft Retreat',
            subtitle: 'Exposed structural concrete juxtaposed with plush cashmere accents.',
        },
    ],
    Kitchen: [
        {
            src: 'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=1200&q=80',
            title: 'Monolithic Marble Kitchen Island',
            subtitle: 'Calacatta Viola marble, handleless smoked walnut cabinetry, and bronze hardware.',
        },
        {
            src: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=1200&q=80',
            title: 'Scandi Open-Plan Culinary Space',
            subtitle: 'Fluted glass upper cabinets, integrated quartz splashback, and pendant array.',
        },
        {
            src: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1200&q=80',
            title: 'Minimalist Matte Anthracite Kitchen',
            subtitle: 'Hidden prep pantry, flush induction cooking, and architectural linear lighting.',
        },
    ],
    Bathroom: [
        {
            src: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80',
            title: 'Terrazzo & Brass Sanctuary',
            subtitle: 'Custom dual vessel basin with wall-mounted brushed champagne fixtures.',
        },
        {
            src: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80',
            title: 'Sculptural Freestanding Bath Suite',
            subtitle: 'Seamless micro-cement walls and concealed ambient niche lighting.',
        },
        {
            src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80',
            title: 'Japanese Hinoki Wet Room',
            subtitle: 'Cedar bath slats, rainfall shower fixture, and natural stone drainage.',
        },
    ],
    Office: [
        {
            src: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80',
            title: 'Executive Walnut Study',
            subtitle: 'Built-in library shelving with concealed LED strips and leather desk pad.',
        },
        {
            src: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1200&q=80',
            title: 'Minimalist Creative Atelier',
            subtitle: 'Dual ergonomic workstation setup surrounded by natural botanical elements.',
        },
        {
            src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
            title: 'Architectural Design Studio',
            subtitle: 'High ceilings, acoustic wall baffling, and oversized drafting surfaces.',
        },
    ],
    Dining: [
        {
            src: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
            title: 'Formal Architectural Dining Hall',
            subtitle: 'Solid smoked oak dining table with sculptural ceramic pendant centerpiece.',
        },
        {
            src: 'https://images.unsplash.com/photo-1615968679312-9b7ed9f04e79?auto=format&fit=crop&w=1200&q=80',
            title: 'Casual Light-Filled Breakfast Nook',
            subtitle: 'Custom curved banquette upholstered in stain-resistant performance linen.',
        },
        {
            src: 'https://images.unsplash.com/photo-1595514535215-9a5e0e8e04be?auto=format&fit=crop&w=1200&q=80',
            title: 'Warm Bronze Entertaining Space',
            subtitle: 'Integrated wine storage wall, fluted bronze credenza, and velvet dining chairs.',
        },
    ],
};

export default function Portfolio({ projects = [], settings = {} }) {
    const [selectedCat, setSelectedCat] = useState('Living Room');
    const [activeImageIndex, setActiveImageIndex] = useState(null);

    // Sync category from URL param if present
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const cat = params.get('category');
        if (cat && CATEGORIES.some((c) => c.name.toLowerCase() === cat.toLowerCase())) {
            const found = CATEGORIES.find((c) => c.name.toLowerCase() === cat.toLowerCase());
            if (found) setSelectedCat(found.name);
        }
    }, []);

    const currentItems = GALLERY[selectedCat] || GALLERY['Living Room'];
    const activeCategoryObj = CATEGORIES.find((c) => c.name === selectedCat) || CATEGORIES[0];

    const openLightbox = (index) => setActiveImageIndex(index);
    const closeLightbox = () => setActiveImageIndex(null);

    const prevImage = (e) => {
        e?.stopPropagation();
        setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : currentItems.length - 1));
    };

    const nextImage = (e) => {
        e?.stopPropagation();
        setActiveImageIndex((prev) => (prev < currentItems.length - 1 ? prev + 1 : 0));
    };

    return (
        <PublicLayout settings={settings}>
            <Head title={`Portfolio — ${settings.site_title || settings.company_name || 'Archi Texture'}`} />

            {/* Compact Header & Category Bar */}
            <section className="border-b border-sand bg-cream/70 py-4 sm:py-6">
                <div className="mx-auto max-w-[1440px] px-4 md:px-10">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <h1 className="font-serif-display text-2xl font-medium tracking-tight text-charcoal sm:text-3xl">
                            Architectural Portfolio
                        </h1>

                        {/* Interactive Category Filter Pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none sm:gap-2">
                            {CATEGORIES.map((cat) => {
                                const isSelected = selectedCat === cat.name;
                                return (
                                    <button
                                        key={cat.name}
                                        onClick={() => setSelectedCat(cat.name)}
                                        className={`group flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] transition-all duration-300 ${
                                            isSelected
                                                ? 'bg-charcoal text-white shadow-sm'
                                                : 'border border-sand bg-white/90 text-charcoal/70 hover:border-bronze hover:bg-white hover:text-charcoal'
                                        }`}
                                    >
                                        <span>{cat.name}</span>
                                        <span
                                            className={`rounded-full px-1.5 py-0.2 text-[9px] font-semibold transition-colors ${
                                                isSelected ? 'bg-bronze text-white' : 'bg-cream text-charcoal/60 group-hover:bg-bronze/20'
                                            }`}
                                        >
                                            {cat.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Grid Section - Above the Fold */}
            <section className="bg-white py-6 md:py-8">
                <div className="mx-auto max-w-[1440px] px-4 md:px-10">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-6">
                        {currentItems.map((item, idx) => (
                            <div
                                key={`${selectedCat}-${idx}`}
                                onClick={() => openLightbox(idx)}
                                className="group relative cursor-pointer overflow-hidden rounded-sm border border-sand bg-cream shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-[16/11] w-full overflow-hidden bg-charcoal/5">
                                    <img
                                        src={item.src}
                                        alt={item.title}
                                        loading="eager"
                                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                    {/* Zoom Icon Button */}
                                    <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-charcoal opacity-0 shadow-md backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:bg-bronze hover:text-white">
                                        <Maximize2 size={14} />
                                    </div>

                                    {/* Hover Details Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-bronze-light">Click to expand</p>
                                        <h3 className="font-serif-display text-base font-medium leading-snug">{item.title}</h3>
                                    </div>
                                </div>

                                {/* Content Below Image */}
                                <div className="p-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-bronze">{selectedCat}</span>
                                        <span className="text-[10px] text-charcoal/40">Concept 0{idx + 1}</span>
                                    </div>
                                    <h2 className="font-serif-display mt-0.5 text-base font-medium text-charcoal transition-colors group-hover:text-bronze">
                                        {item.title}
                                    </h2>
                                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-charcoal/65">
                                        {item.subtitle}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-10 rounded-sm border border-sand bg-cream/40 p-6 text-center sm:p-10">
                        <p className="eyebrow mb-1.5">Tailored Spaces</p>
                        <h2 className="font-serif-display text-xl font-medium text-charcoal sm:text-2xl md:text-3xl">
                            Ready to Transform Your {selectedCat}?
                        </h2>
                        <p className="mx-auto mt-2 max-w-lg text-xs leading-relaxed text-charcoal/70 sm:text-sm">
                            Our designers curate bespoke layouts, customized material palettes, and artisan furnishings suited to your exact lifestyle.
                        </p>
                        <div className="mt-5 flex flex-wrap justify-center gap-3">
                            <a
                                href="/contact"
                                className="inline-flex items-center rounded-[8px] bg-bronze px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-md transition-all duration-300 hover:bg-bronze-dark hover:shadow-lg"
                            >
                                Start Your Project
                            </a>
                            <a
                                href="/products"
                                className="inline-flex items-center rounded-[8px] border border-charcoal/30 bg-white px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal transition-all duration-300 hover:border-charcoal hover:bg-charcoal hover:text-white"
                            >
                                Browse Products
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Fullscreen Lightbox Modal */}
            {activeImageIndex !== null && currentItems[activeImageIndex] && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/95 p-4 backdrop-blur-md transition-all duration-300"
                    onClick={closeLightbox}
                >
                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
                        aria-label="Close modal"
                    >
                        <X size={22} />
                    </button>

                    {/* Navigation buttons */}
                    <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-bronze"
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-bronze"
                        aria-label="Next image"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Image and Caption */}
                    <div
                        className="max-h-[90vh] max-w-4xl overflow-hidden rounded-lg bg-charcoal border border-white/10 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={currentItems[activeImageIndex].src}
                            alt={currentItems[activeImageIndex].title}
                            className="max-h-[70vh] w-full object-contain bg-black/40"
                        />
                        <div className="border-t border-white/10 bg-[#171614] p-6 text-white">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-bronze-light">
                                        {selectedCat} · Concept 0{activeImageIndex + 1} of 0{currentItems.length}
                                    </span>
                                    <h3 className="font-serif-display mt-1 text-xl font-medium sm:text-2xl">
                                        {currentItems[activeImageIndex].title}
                                    </h3>
                                </div>
                                <a
                                    href="/contact"
                                    className="hidden sm:inline-flex shrink-0 items-center rounded-full bg-bronze px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-bronze-dark transition-colors"
                                >
                                    Inquire Look
                                </a>
                            </div>
                            <p className="mt-2 text-xs leading-relaxed text-white/70 sm:text-sm">
                                {currentItems[activeImageIndex].subtitle}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}

