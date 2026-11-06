import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, Layers } from 'lucide-react';

const FALLBACK_CATEGORIES = [
    { name: 'Living Room', count: 3 },
    { name: 'Bedroom', count: 3 },
    { name: 'Kitchen', count: 3 },
    { name: 'Bathroom', count: 3 },
    { name: 'Office', count: 3 },
    { name: 'Dining', count: 3 },
];

const FALLBACK_GALLERY = [
    {
        category: 'Living Room',
        src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
        title: 'Nordic Minimalist Living Room',
        subtitle: 'Warm oak paneling, boucle textures, and soft diffuse perimeter lighting.',
    },
    {
        category: 'Living Room',
        src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        title: 'Sunlit Contemporary Lounge',
        subtitle: 'Floor-to-ceiling glass integration with low-profile Belgian linen seating.',
    },
    {
        category: 'Living Room',
        src: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
        title: 'Modern Organic Penthouse',
        subtitle: 'Curved architectural plaster wall and custom travertine coffee tables.',
    },
    {
        category: 'Bedroom',
        src: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
        title: 'Japandi Master Suite',
        subtitle: 'Slatted cedar headboard with integrated warm bedside illumination.',
    },
    {
        category: 'Bedroom',
        src: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
        title: 'Earthy Minimal Bedroom',
        subtitle: 'Textured lime wash walls, raw linen drapery, and woven wool rugs.',
    },
    {
        category: 'Bedroom',
        src: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
        title: 'Boutique Loft Retreat',
        subtitle: 'Exposed structural concrete juxtaposed with plush cashmere accents.',
    },
    {
        category: 'Kitchen',
        src: 'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=1200&q=80',
        title: 'Monolithic Marble Kitchen Island',
        subtitle: 'Calacatta Viola marble, handleless smoked walnut cabinetry, and bronze hardware.',
    },
    {
        category: 'Kitchen',
        src: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=1200&q=80',
        title: 'Scandi Open-Plan Culinary Space',
        subtitle: 'Fluted glass upper cabinets, integrated quartz splashback, and pendant array.',
    },
    {
        category: 'Kitchen',
        src: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1200&q=80',
        title: 'Minimalist Matte Anthracite Kitchen',
        subtitle: 'Hidden prep pantry, flush induction cooking, and architectural linear lighting.',
    },
    {
        category: 'Bathroom',
        src: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80',
        title: 'Terrazzo & Brass Sanctuary',
        subtitle: 'Custom dual vessel basin with wall-mounted brushed champagne fixtures.',
    },
    {
        category: 'Bathroom',
        src: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80',
        title: 'Sculptural Freestanding Bath Suite',
        subtitle: 'Seamless micro-cement walls and concealed ambient niche lighting.',
    },
    {
        category: 'Bathroom',
        src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80',
        title: 'Japanese Hinoki Wet Room',
        subtitle: 'Cedar bath slats, rainfall shower fixture, and natural stone drainage.',
    },
    {
        category: 'Office',
        src: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80',
        title: 'Executive Walnut Study',
        subtitle: 'Built-in library shelving with concealed LED strips and leather desk pad.',
    },
    {
        category: 'Office',
        src: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1200&q=80',
        title: 'Minimalist Creative Atelier',
        subtitle: 'Dual ergonomic workstation setup surrounded by natural botanical elements.',
    },
    {
        category: 'Office',
        src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
        title: 'Architectural Design Studio',
        subtitle: 'High ceilings, acoustic wall baffling, and oversized drafting surfaces.',
    },
    {
        category: 'Dining',
        src: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
        title: 'Formal Architectural Dining Hall',
        subtitle: 'Solid smoked oak dining table with sculptural ceramic pendant centerpiece.',
    },
    {
        category: 'Dining',
        src: 'https://images.unsplash.com/photo-1632210826643-9ff7e84be2f9?auto=format&fit=crop&w=1200&q=80',
        title: 'Contemporary Light-Filled Dining Room',
        subtitle: 'Curated modern dining suite with bespoke natural wood table, sculptural lighting, and upholstered seating.',
    },
    {
        category: 'Dining',
        src: 'https://images.unsplash.com/photo-1634547588713-edd93045b9f1?auto=format&fit=crop&w=1200&q=80',
        title: 'Warm Bronze Entertaining Space',
        subtitle: 'Integrated architectural dining room with floor-to-ceiling windows, sculptural centerpiece, and designer dining chairs.',
    },
];

export default function Portfolio({ projects = [], categories = [], settings = {} }) {
    // Process all live database projects or fallback
    const allItems = useMemo(() => {
        if (projects && projects.length > 0) {
            return projects.map((p) => ({
                id: p.id,
                category: p.category || 'General',
                src: p.featured_image || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
                title: p.title,
                subtitle: p.summary || p.description || '',
                gallery: Array.isArray(p.gallery) ? p.gallery : [],
            }));
        }
        return FALLBACK_GALLERY;
    }, [projects]);

    // Compute dynamic categories and item counts
    const categoryList = useMemo(() => {
        const counts = {};
        allItems.forEach((item) => {
            const cat = item.category || 'General';
            counts[cat] = (counts[cat] || 0) + 1;
        });

        const distinctNames = Object.keys(counts);

        // Include any additional categories passed from controller if not already present
        (categories || []).forEach((c) => {
            if (!counts[c]) {
                counts[c] = 0;
                distinctNames.push(c);
            }
        });

        const list = distinctNames.map((name) => ({
            name,
            count: counts[name] || 0,
        }));

        return [
            { name: 'All Spaces', count: allItems.length },
            ...list,
        ];
    }, [allItems, categories]);

    const [selectedCat, setSelectedCat] = useState('All Spaces');
    const [activeImageIndex, setActiveImageIndex] = useState(null);
    const [activeSubIndex, setActiveSubIndex] = useState(0);

    // Sync category from URL param if present on load or change
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const cat = params.get('category');
        if (cat) {
            const found = categoryList.find(
                (c) => c.name.toLowerCase() === cat.toLowerCase()
            );
            if (found) {
                setSelectedCat(found.name);
            } else {
                setSelectedCat(cat);
            }
        }
    }, [categoryList]);

    // Filter items based on selected category
    const currentItems = useMemo(() => {
        if (!selectedCat || selectedCat === 'All Spaces' || selectedCat.toLowerCase() === 'all') {
            return allItems;
        }
        return allItems.filter(
            (item) => item.category.toLowerCase() === selectedCat.toLowerCase()
        );
    }, [allItems, selectedCat]);

    const openLightbox = (index) => {
        setActiveImageIndex(index);
        setActiveSubIndex(0);
    };

    const closeLightbox = () => {
        setActiveImageIndex(null);
        setActiveSubIndex(0);
    };

    const prevImage = (e) => {
        e?.stopPropagation();
        setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : currentItems.length - 1));
        setActiveSubIndex(0);
    };

    const nextImage = (e) => {
        e?.stopPropagation();
        setActiveImageIndex((prev) => (prev < currentItems.length - 1 ? prev + 1 : 0));
        setActiveSubIndex(0);
    };

    return (
        <PublicLayout settings={settings}>
            <Head title={`Portfolio — ${settings.site_title || settings.company_name || 'Archi Texture'}`} />

            {/* Compact Header & Category Bar */}
            <section className="border-b border-sand bg-cream/70 py-4 sm:py-6">
                <div className="mx-auto max-w-[1440px] px-4 md:px-10">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-bronze/10 text-bronze">
                                <Layers size={18} />
                            </span>
                            <div>
                                <h1 className="font-serif-display text-2xl font-medium tracking-tight text-charcoal sm:text-3xl">
                                    Architectural Portfolio
                                </h1>
                                <p className="text-[11px] uppercase tracking-[0.14em] text-charcoal/50 mt-0.5">
                                    Curated Atelier Works & Interior Spaces
                                </p>
                            </div>
                        </div>

                        {/* Interactive Dynamic Category Filter Pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none sm:gap-2 max-w-full">
                            {categoryList.map((cat) => {
                                const isSelected = selectedCat.toLowerCase() === cat.name.toLowerCase();
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

            {/* Gallery Grid Section */}
            <section className="bg-white py-6 md:py-8 min-h-[50vh]">
                <div className="mx-auto max-w-[1440px] px-4 md:px-10">
                    {currentItems.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-6">
                            {currentItems.map((item, idx) => (
                                <div
                                    key={`${item.id || idx}-${item.title}`}
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

                                        {/* Gallery Photo Count Badge */}
                                        {item.gallery && item.gallery.length > 0 && (
                                            <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-charcoal/80 backdrop-blur-xs px-2.5 py-1 text-[10px] font-semibold text-white shadow-xs">
                                                <Layers size={11} className="text-bronze-light" />
                                                <span>{item.gallery.length + 1} Photos</span>
                                            </div>
                                        )}

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
                                            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-bronze">{item.category}</span>
                                            <span className="text-[10px] text-charcoal/40">Concept 0{idx + 1}</span>
                                        </div>
                                        <h2 className="font-serif-display mt-0.5 text-base font-medium text-charcoal transition-colors group-hover:text-bronze">
                                            {item.title}
                                        </h2>
                                        {item.subtitle && (
                                            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-charcoal/65">
                                                {item.subtitle}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <p className="text-sm text-charcoal/50">
                                No projects published in this category yet.
                            </p>
                            <button
                                onClick={() => setSelectedCat('All Spaces')}
                                className="mt-3 text-xs font-semibold text-bronze hover:underline"
                            >
                                View all spaces
                            </button>
                        </div>
                    )}

                    {/* Bottom Call to Action */}
                    <div className="mt-10 rounded-sm border border-sand bg-cream/40 p-6 text-center sm:p-10">
                        <p className="eyebrow mb-1.5">Tailored Spatial Architecture</p>
                        <h2 className="font-serif-display text-xl font-medium text-charcoal sm:text-2xl md:text-3xl">
                            Ready to Transform Your {selectedCat === 'All Spaces' ? 'Space' : selectedCat}?
                        </h2>
                        <p className="mx-auto mt-2 max-w-lg text-xs leading-relaxed text-charcoal/70 sm:text-sm">
                            Our studio curates bespoke architectural layouts, customized material palettes, and artisan furnishings suited to your exact lifestyle.
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

                    {/* Image and Caption with Multi-Photo Gallery Support */}
                    {(() => {
                        const activeItem = currentItems[activeImageIndex];
                        const allProjectPhotos = [activeItem.src, ...(activeItem.gallery || [])].filter(Boolean);
                        const currentPhoto = allProjectPhotos[activeSubIndex] || activeItem.src;

                        return (
                            <div
                                className="max-h-[92vh] max-w-4xl w-full overflow-hidden rounded-lg bg-charcoal border border-white/10 shadow-2xl flex flex-col"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="relative flex-1 flex items-center justify-center bg-black/50 overflow-hidden min-h-[320px]">
                                    <img
                                        src={currentPhoto}
                                        alt={activeItem.title}
                                        className="max-h-[60vh] sm:max-h-[66vh] w-full object-contain"
                                    />
                                    {allProjectPhotos.length > 1 && (
                                        <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/20">
                                            {activeSubIndex + 1} / {allProjectPhotos.length}
                                        </span>
                                    )}
                                </div>

                                {/* Thumbnail Strip if multiple photos */}
                                {allProjectPhotos.length > 1 && (
                                    <div className="flex items-center gap-2 px-4 py-2.5 bg-[#121210] border-t border-white/10 overflow-x-auto scrollbar-none">
                                        {allProjectPhotos.map((photo, pIdx) => (
                                            <button
                                                key={`thumb-${pIdx}`}
                                                type="button"
                                                onClick={() => setActiveSubIndex(pIdx)}
                                                className={`relative h-12 w-16 shrink-0 rounded overflow-hidden border-2 transition ${
                                                    activeSubIndex === pIdx
                                                        ? 'border-bronze scale-105 shadow-sm'
                                                        : 'border-white/10 opacity-60 hover:opacity-100'
                                                }`}
                                            >
                                                <img src={photo} alt="" className="h-full w-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="border-t border-white/10 bg-[#171614] p-5 sm:p-6 text-white">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-bronze-light">
                                                {activeItem.category} · Space 0{activeImageIndex + 1} of 0{currentItems.length}
                                            </span>
                                            <h3 className="font-serif-display mt-1 text-xl font-medium sm:text-2xl">
                                                {activeItem.title}
                                            </h3>
                                        </div>
                                        <a
                                            href="/contact"
                                            className="hidden sm:inline-flex shrink-0 items-center rounded-full bg-bronze px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-bronze-dark transition-colors"
                                        >
                                            Inquire Look
                                        </a>
                                    </div>
                                    {activeItem.subtitle && (
                                        <p className="mt-2 text-xs leading-relaxed text-white/70 sm:text-sm">
                                            {activeItem.subtitle}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}
        </PublicLayout>
    );
}
