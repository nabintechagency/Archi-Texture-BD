import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Phone, ShieldCheck, Award, CheckCircle2 } from 'lucide-react';

/* -------------------------------------------------- */
/* Studio Team                                        */
/* -------------------------------------------------- */
const TEAM = [
    {
        name: 'Lutfor Rahaman',
        role: 'Principal Architect & Creative Director',
        experience: '12+ Years Experience',
        bio: 'Specializing in contemporary organic architecture and luxury residential transformations across South Asia and Europe.',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        tags: ['Spatial Design', 'Master Planning', 'Bespoke Joinery'],
    },
    {
        name: 'Elena Rostova',
        role: 'Senior Interior Architect',
        experience: '9+ Years Experience',
        bio: 'Focuses on tactile materiality, historical restoration, and harmonious color psychology for private residential estates.',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
        tags: ['Color Theory', 'Materiality', 'Lighting Schemes'],
    },
    {
        name: 'Marcus Sterling',
        role: 'Head of Furniture & Procurement',
        experience: '8+ Years Experience',
        bio: 'Coordinates artisan trade ateliers and custom furniture fabrications, ensuring flawless white-glove delivery.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        tags: ['Artisan Trade', 'Custom Millwork', 'Procurement'],
    },
];


const STANDARDS = [
    'Rigorous structural & spatial feasibility analysis',
    'Curated palettes of natural marble, brass, and hardwood',
    'Photorealistic 3D virtual walkthroughs before fabrication',
    'Direct coordination with specialized generational artisans',
    'Comprehensive budget fidelity and transparent procurement',
    '100% Delight Guarantee on every completed commission',
];

export default function About({ experiences = [], education = [], settings = {} }) {
    const phone = settings.phone || settings.contact_phone || '01626778573';

    return (
        <PublicLayout settings={settings}>
            <Head title={`About Us — ${settings.site_title || settings.company_name || 'Archi Texture'}`} />

            <div className="text-charcoal selection:bg-bronze selection:text-white">
                
                {/* -------------------------------------------------- */}
                {/* 1. Above-The-Fold Responsive Hero & Stats Section  */}
                {/* -------------------------------------------------- */}
                <section
                    onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                        e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
                        e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
                    }}
                    className="relative flex min-h-[calc(100vh-80px)] flex-col justify-center overflow-hidden bg-gradient-to-b from-[#181715] via-[#211F1C] to-[#161514] py-10 sm:py-14 md:py-18 text-white border-b border-sand/10"
                >
                    {/* Interactive Radial Glow Follower */}
                    <div
                        className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-500"
                        style={{
                            background:
                                'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(169, 137, 82, 0.28), transparent 70%)',
                        }}
                    />

                    {/* Subtle dot overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#A98952_1px,transparent_1px)] [background-size:24px_24px] sm:[background-size:28px_28px] opacity-10" />

                    <div className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-8 lg:px-10 text-center">
                        <p className="eyebrow !text-bronze-light mb-3 text-xs tracking-[0.2em]">
                            About {settings.site_title || settings.company_name || 'Archi Texture'}
                        </p>
                        <h1 className="font-serif-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.15] sm:leading-[1.12]">
                            Where Spatial Harmony Meets Timeless Interior Artistry
                        </h1>

                        <p className="mx-auto mt-3 sm:mt-5 max-w-2xl text-xs sm:text-sm md:text-base text-cream/80 font-light leading-relaxed px-1 sm:px-0">
                            {settings.about_bio ||
                                `At ${settings.site_title || settings.company_name || 'Archi Texture'}, we curate bespoke residential sanctuaries, wholesale interior products, and luxury architectural spaces. By uniting architectural rigor with tactile natural materials, we transform everyday living into an inspiring experience.`}
                        </p>

                        {/* 4 Core Studio Stats — Immediately Visible Above-The-Fold */}
                        <div className="mt-8 sm:mt-10 md:mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-4 max-w-4xl mx-auto">
                            <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 sm:p-4 md:p-5 backdrop-blur-sm transition-all duration-300 hover:border-bronze/50 hover:bg-white/[0.08] shadow-lg">
                                <span className="font-serif-display text-2xl sm:text-3xl md:text-4xl text-bronze-light font-bold block">12+</span>
                                <p className="mt-1 text-[11px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.14em] text-cream/80 font-medium">Years of Craft</p>
                            </div>
                            <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 sm:p-4 md:p-5 backdrop-blur-sm transition-all duration-300 hover:border-bronze/50 hover:bg-white/[0.08] shadow-lg">
                                <span className="font-serif-display text-2xl sm:text-3xl md:text-4xl text-bronze-light font-bold block">350+</span>
                                <p className="mt-1 text-[11px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.14em] text-cream/80 font-medium">Bespoke Spaces</p>
                            </div>
                            <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 sm:p-4 md:p-5 backdrop-blur-sm transition-all duration-300 hover:border-bronze/50 hover:bg-white/[0.08] shadow-lg">
                                <span className="font-serif-display text-2xl sm:text-3xl md:text-4xl text-bronze-light font-bold block">15+</span>
                                <p className="mt-1 text-[11px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.14em] text-cream/80 font-medium">Design Accolades</p>
                            </div>
                            <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 sm:p-4 md:p-5 backdrop-blur-sm transition-all duration-300 hover:border-bronze/50 hover:bg-white/[0.08] shadow-lg">
                                <span className="font-serif-display text-2xl sm:text-3xl md:text-4xl text-bronze-light font-bold block">100%</span>
                                <p className="mt-1 text-[11px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.14em] text-cream/80 font-medium">Delight Guarantee</p>
                            </div>
                        </div>
                    </div>
                </section>



                {/* -------------------------------------------------- */}
                {/* 3. Leadership & Principal Architects (Pure White)  */}
                {/* -------------------------------------------------- */}
                <section className="py-16 sm:py-20 md:py-24 bg-white border-b border-sand/70">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                            <p className="eyebrow mb-2">Creative Direction</p>
                            <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl text-charcoal font-medium">
                                Meet Our Principal Design Team
                            </h2>
                            <p className="mt-3 text-sm md:text-base text-charcoal/70 font-light leading-relaxed">
                                Generational architects, interior sculptors, and procurement specialists dedicated to your vision.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8">
                            {TEAM.map((member) => (
                                <div
                                    key={member.name}
                                    className="group rounded-2xl border border-sand/80 bg-[#FAF7F2]/70 p-4 sm:p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:bg-white hover:border-bronze/40 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="aspect-[4/5] rounded-xl overflow-hidden bg-sand/30 mb-4 sm:mb-5 relative">
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <span className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 rounded-full bg-charcoal/90 px-2.5 py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-bronze-light backdrop-blur-sm">
                                                {member.experience}
                                            </span>
                                        </div>

                                        <h3 className="font-serif-display text-lg sm:text-xl text-charcoal font-medium">
                                            {member.name}
                                        </h3>
                                        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-bronze mt-1">
                                            {member.role}
                                        </p>
                                        <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-charcoal/70 leading-relaxed font-light">
                                            {member.bio}
                                        </p>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-sand/70 flex flex-wrap gap-1.5">
                                        {member.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-md bg-white border border-sand px-2 py-0.5 text-[9px] sm:text-[10px] uppercase tracking-wider text-charcoal/70 font-medium"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* -------------------------------------------------- */}
                {/* 4. Studio Standards & Quality Promise (Warm Cream) */}
                {/* -------------------------------------------------- */}
                <section className="py-16 sm:py-20 md:py-24 bg-[#FAF7F2] border-b border-sand/70">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                            <div>
                                <p className="eyebrow mb-2">Our Standards</p>
                                <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl text-charcoal font-medium leading-tight">
                                    Meticulous Precision at Every Stage
                                </h2>
                                <p className="mt-4 text-sm md:text-base text-charcoal/70 font-light leading-relaxed">
                                    From structural layout to the final textile drape, our studio upholds an uncompromising standard of execution to guarantee timeless living spaces.
                                </p>

                                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    {STANDARDS.map((std, i) => (
                                        <div key={i} className="flex items-start gap-2.5 bg-white p-3.5 rounded-xl border border-sand/80 shadow-sm">
                                            <CheckCircle2 size={18} className="text-bronze shrink-0 mt-0.5" />
                                            <span className="text-xs sm:text-[13px] text-charcoal/80 font-medium leading-snug">{std}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-sand">
                                <img
                                    src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80"
                                    alt="Luxury Interior Studio Craft"
                                    className="w-full aspect-[4/3] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent flex items-end p-6 sm:p-8">
                                    <div className="text-white">
                                        <p className="font-serif-display text-xl sm:text-2xl font-medium">Generational Craft, Modern Living</p>
                                        <p className="text-xs text-white/80 mt-1">Every project is custom engineered for longevity and effortless beauty.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* -------------------------------------------------- */}
                {/* 5. Responsive Call To Action Banner (Dark)         */}
                {/* -------------------------------------------------- */}
                <section className="relative overflow-hidden bg-charcoal py-16 sm:py-20 md:py-24 text-center text-white">
                    <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6">
                        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-bronze-light mb-2 sm:mb-3">
                            Ready To Elevate Your Space?
                        </p>
                        <h2 className="font-serif-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-tight text-white">
                            Begin Your Architectural &amp; Interior Journey
                        </h2>
                        <p className="mx-auto mt-2.5 sm:mt-4 max-w-xl text-xs sm:text-sm md:text-base text-white/70 leading-relaxed font-light px-2 sm:px-0">
                            Collaborate with our senior interior architects and experience the ease of bespoke turnkey transformation.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md sm:max-w-none mx-auto">
                            <Link
                                href="/contact"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[8px] bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-charcoal shadow-xl transition-all duration-300 hover:bg-bronze hover:text-white"
                            >
                                <span>Start Your Project</span>
                                <ArrowRight size={15} />
                            </Link>

                            <a
                                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[8px] border border-white/20 bg-transparent px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-white/10 transition-colors"
                            >
                                <Phone size={14} className="text-bronze-light" />
                                <span>{phone}</span>
                            </a>
                        </div>
                    </div>
                </section>

            </div>
        </PublicLayout>
    );
}
