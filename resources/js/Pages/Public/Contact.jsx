import PublicLayout from '@/Layouts/PublicLayout';
import { Head, useForm } from '@inertiajs/react';
import { 
    Mail, CheckCircle2, MapPin, Phone, Clock, 
    ShieldCheck, ArrowRight, Loader2, ChevronDown, 
    Check, Copy
} from 'lucide-react';
import { useState } from 'react';

const FAQS = [
    {
        q: 'How does the initial design consultation work?',
        a: 'We begin with an in-depth discovery call to understand your floor dimensions, architectural preferences, and budget goals. Following that, our senior architects generate personalized 3D spatial concepts and material boards.',
    },
    {
        q: 'Do you take projects outside Dhaka?',
        a: 'Yes. While our primary design studio is located in Mohakhali, Dhaka, we design and execute luxury residential and commercial spaces across all major divisions of Bangladesh with white-glove logistics.',
    },
    {
        q: 'Can you work with my existing furniture and floor plan?',
        a: 'Absolutely. We seamlessly integrate cherished heirloom pieces into cohesive contemporary layouts, optimizing lighting, wall millwork, and complementary bespoke items.',
    },
    {
        q: 'What is the estimated timeline for a full space makeover?',
        a: 'Residential concepts and 3D renderings typically take 1 to 2 weeks. Full turnkey execution ranges between 4 to 8 weeks depending on custom millwork and material sourcing.',
    },
];


export default function Contact({ settings = {} }) {
    const phone = settings.phone || settings.contact_phone || '01626778573';
    const email = settings.email || settings.contact_email || 'contact@architexture.com';
    const location = settings.location || settings.address || 'Mohakhali, Dhaka, Bangladesh';

    const [copiedField, setCopiedField] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [openFaq, setOpenFaq] = useState(0);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const handleCopy = (text, fieldName) => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(text);
            setCopiedField(fieldName);
            setTimeout(() => setCopiedField(null), 2000);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        
        post('/contact', {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitted(true);
                reset();
            },
            onError: () => {
                setIsSubmitted(true);
            }
        });
    };

    return (
        <PublicLayout settings={settings}>
            <Head title={`Contact Us — ${settings.site_title || settings.company_name || 'Archi Texture'}`} />

            <div className="text-[#1C1A17] selection:bg-bronze selection:text-white">
                
                {/* -------------------------------------------------- */}
                {/* 1. Main Integrated Hero & Contact Hub (Warm Cream) */}
                {/* -------------------------------------------------- */}
                <section className="relative pt-10 sm:pt-14 md:pt-16 pb-16 sm:pb-20 lg:pb-24 bg-[#FAF7F2] border-b border-sand/70 overflow-hidden">
                    {/* Architectural dot ambient pattern */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#A98952_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
                    
                    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        
                        {/* Upper Middle Page Heading */}
                        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
                            <p className="eyebrow mb-2">Get In Touch</p>
                            <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl text-charcoal font-medium tracking-tight">
                                Contact Our Studio
                            </h1>
                        </div>

                        {/* Mobile Quick Action Bar (Visible on small screens for instant 1-touch contact) */}
                        <div className="block lg:hidden mb-6">
                            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                                <a
                                    href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                                    className="flex items-center justify-center gap-2 rounded-[8px] border border-sand bg-white p-3 font-medium text-charcoal shadow-sm active:scale-95 transition-all"
                                >
                                    <Phone size={14} className="text-bronze shrink-0" />
                                    <span className="truncate">Call Studio</span>
                                </a>
                                <a
                                    href={`mailto:${email}`}
                                    className="flex items-center justify-center gap-2 rounded-[8px] border border-sand bg-white p-3 font-medium text-charcoal shadow-sm active:scale-95 transition-all"
                                >
                                    <Mail size={14} className="text-bronze shrink-0" />
                                    <span className="truncate">Send Email</span>
                                </a>
                            </div>
                        </div>

                        {/* Main 2-Column Responsive Hub */}
                        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-10 items-stretch">
                            
                            {/* Left Column: Direct Contact Info */}
                            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                                <div className="space-y-3">
                                    
                                    {/* Direct Contact Cards */}
                                    <div className="space-y-3">
                                        
                                        {/* Phone */}
                                        <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-white border border-sand/80 shadow-sm transition-all hover:border-bronze/50">
                                            <div className="flex items-center gap-3.5 min-w-0">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-bronze/10 text-bronze">
                                                    <Phone size={18} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/50">Phone</p>
                                                    <a 
                                                        href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                                                        className="text-sm font-semibold text-charcoal hover:text-bronze transition-colors truncate block mt-0.5"
                                                    >
                                                        {phone}
                                                    </a>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(phone, 'phone')}
                                                className="shrink-0 p-2 text-charcoal/40 hover:text-bronze transition-colors rounded-[6px] hover:bg-cream"
                                                title="Copy Phone"
                                            >
                                                {copiedField === 'phone' ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                                            </button>
                                        </div>

                                        {/* Email */}
                                        <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-white border border-sand/80 shadow-sm transition-all hover:border-bronze/50">
                                            <div className="flex items-center gap-3.5 min-w-0">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-bronze/10 text-bronze">
                                                    <Mail size={18} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/50">Email</p>
                                                    <a 
                                                        href={`mailto:${email}`} 
                                                        className="text-sm font-semibold text-charcoal hover:text-bronze transition-colors truncate block mt-0.5"
                                                    >
                                                        {email}
                                                    </a>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(email, 'email')}
                                                className="shrink-0 p-2 text-charcoal/40 hover:text-bronze transition-colors rounded-[6px] hover:bg-cream"
                                                title="Copy Email"
                                            >
                                                {copiedField === 'email' ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                                            </button>
                                        </div>

                                        {/* Headquarter */}
                                        <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white border border-sand/80 shadow-sm">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-bronze/10 text-bronze">
                                                <MapPin size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/50">Showroom</p>
                                                <p className="text-sm font-semibold text-charcoal truncate mt-0.5">{location}</p>
                                            </div>
                                        </div>

                                        {/* Office Hours */}
                                        <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white border border-sand/80 shadow-sm">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-bronze/10 text-bronze">
                                                <Clock size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/50">Consultation Hours</p>
                                                <p className="text-sm font-semibold text-charcoal truncate mt-0.5">Sat-Fri, 9:00 AM to 9:00 PM</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {/* Response guarantee badge */}
                                <div className="rounded-xl bg-white border border-sand/80 p-4 flex items-center gap-3 text-xs text-charcoal/70 shadow-sm">
                                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                    </span>
                                    <span>Senior architects on duty. Responses guaranteed under 24 hours.</span>
                                </div>
                            </div>

                            {/* Right Column: Fast Interactive Form */}
                            <div className="lg:col-span-7 bg-white rounded-2xl border border-sand/90 p-6 sm:p-8 md:p-9 shadow-sm flex flex-col justify-center">
                                
                                {isSubmitted ? (
                                    <div className="py-8 sm:py-10 text-center">
                                        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                            <CheckCircle2 size={32} />
                                        </div>
                                        <h3 className="font-serif-display text-2xl sm:text-3xl text-charcoal font-medium">
                                            Thank You for Reaching Out!
                                        </h3>
                                        <p className="mx-auto mt-2.5 max-w-md text-xs sm:text-sm text-charcoal/70 leading-relaxed">
                                            Your inquiry has been received by our design concierge team. A senior interior architect will review your project details and get back to you within 24 hours.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setIsSubmitted(false)}
                                            className="mt-6 inline-flex items-center gap-2 rounded-[8px] bg-charcoal px-7 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-bronze transition-colors"
                                        >
                                            Send Another Message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={submit} className="space-y-4 sm:space-y-5">
                                        
                                        {/* Contact Inputs */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-charcoal/80 mb-1.5">
                                                    Full Name <span className="text-rose-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    placeholder="Lutfor Rahaman"
                                                    className="w-full rounded-[8px] border border-sand bg-[#FAF7F2]/60 px-3.5 py-2.5 sm:py-3 text-sm text-charcoal placeholder:text-charcoal/35 focus:border-bronze focus:bg-white focus:outline-none focus:ring-2 focus:ring-bronze/20 transition"
                                                />
                                                {errors?.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-charcoal/80 mb-1.5">
                                                    Email Address <span className="text-rose-500">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="contact@architexture.com"
                                                    className="w-full rounded-[8px] border border-sand bg-[#FAF7F2]/60 px-3.5 py-2.5 sm:py-3 text-sm text-charcoal placeholder:text-charcoal/35 focus:border-bronze focus:bg-white focus:outline-none focus:ring-2 focus:ring-bronze/20 transition"
                                                />
                                                {errors?.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-charcoal/80 mb-1.5">
                                                Phone Number (Optional)
                                            </label>
                                            <input
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                placeholder="01626778573"
                                                className="w-full rounded-[8px] border border-sand bg-[#FAF7F2]/60 px-3.5 py-2.5 sm:py-3 text-sm text-charcoal placeholder:text-charcoal/35 focus:border-bronze focus:bg-white focus:outline-none focus:ring-2 focus:ring-bronze/20 transition"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-charcoal/80 mb-1.5">
                                                Project Details &amp; Vision <span className="text-rose-500">*</span>
                                            </label>
                                            <textarea
                                                required
                                                rows={4}
                                                value={data.message}
                                                onChange={(e) => setData('message', e.target.value)}
                                                placeholder="Describe your space dimensions, current challenges, style preferences, or any questions for our design team..."
                                                className="w-full rounded-[8px] border border-sand bg-[#FAF7F2]/60 px-3.5 py-2.5 sm:py-3 text-sm text-charcoal placeholder:text-charcoal/35 focus:border-bronze focus:bg-white focus:outline-none focus:ring-2 focus:ring-bronze/20 transition resize-none leading-relaxed"
                                            />
                                            {errors?.message && <p className="mt-1 text-xs text-rose-500">{errors.message}</p>}
                                        </div>

                                        {/* Action Button */}
                                        <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[8px] bg-charcoal px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-xl transition-all duration-300 hover:bg-bronze disabled:opacity-50"
                                            >
                                                {processing ? (
                                                    <>
                                                        <Loader2 size={16} className="animate-spin text-white" />
                                                        <span>Sending Inquiry...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Send My Message</span>
                                                        <ArrowRight size={15} />
                                                    </>
                                                )}
                                            </button>

                                            <div className="flex items-center justify-center gap-1.5 text-xs text-charcoal/50">
                                                <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
                                                <span>100% Confidential. No spam ever.</span>
                                            </div>
                                        </div>
                                    </form>
                                )}
                            </div>

                        </div>
                    </div>
                </section>

                {/* -------------------------------------------------- */}
                {/* 2. Frequently Asked Questions (Warm Cream)         */}
                {/* -------------------------------------------------- */}
                <section className="py-16 sm:py-20 md:py-24 bg-white border-b border-sand/70">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
                            <p className="eyebrow mb-2">Got Questions?</p>
                            <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl text-charcoal font-medium">
                                Frequently Asked Questions
                            </h2>
                            <p className="mt-3 text-sm md:text-base text-charcoal/70 font-light leading-relaxed">
                                Everything you need to know about starting your project with {settings.site_title || settings.company_name || 'Archi Texture'}.
                            </p>
                        </div>

                        <div className="space-y-3.5">
                            {FAQS.map((faq, i) => {
                                const isOpen = openFaq === i;
                                return (
                                    <div
                                        key={i}
                                        className="rounded-xl border border-sand/80 bg-white overflow-hidden shadow-sm transition-all"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenFaq(isOpen ? null : i)}
                                            className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer hover:bg-[#FAF7F2]/40 transition-colors"
                                        >
                                            <span className="font-serif-display text-base sm:text-lg text-charcoal font-medium pr-4">
                                                {faq.q}
                                            </span>
                                            <ChevronDown
                                                size={18}
                                                className={`shrink-0 text-bronze transition-transform duration-300 ${
                                                    isOpen ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>
                                        {isOpen && (
                                            <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-charcoal/70 leading-relaxed font-light border-t border-sand/50 pt-3">
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* -------------------------------------------------- */}
                {/* 4. Bottom Call To Action Banner (Dark)             */}
                {/* -------------------------------------------------- */}
                <section className="relative overflow-hidden bg-charcoal py-16 sm:py-20 md:py-24 text-center text-white">
                    <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6">
                        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-bronze-light mb-2.5 sm:mb-3">
                            Ready For Your Dream Space?
                        </p>
                        <h2 className="font-serif-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-tight">
                            Start Your Interior Design Transformation Today
                        </h2>
                        <p className="mx-auto mt-3 sm:mt-4 max-w-xl text-xs sm:text-sm md:text-base text-white/70 leading-relaxed font-light">
                            Collaborate with vetted award-winning designers and enjoy a curated, stress-free decorating experience.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
                            <a
                                href="/products"
                                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-[8px] bg-bronze px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-xl hover:bg-bronze-dark transition-colors"
                            >
                                Explore Products <ArrowRight size={14} />
                            </a>
                            <a
                                href="/portfolio"
                                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-[8px] border border-white/40 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-white hover:text-charcoal transition-colors"
                            >
                                View Portfolio
                            </a>
                        </div>
                    </div>
                </section>

            </div>
        </PublicLayout>
    );
}
