import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import { Menu, X, Mail, ArrowUp, ChevronDown, Phone, MapPin } from 'lucide-react';

const FacebookIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="12" fill="#1877F2" />
        <path
            d="M15.117 12.637l.45-2.932h-2.814V7.802c0-.806.395-1.592 1.66-1.592h1.284V3.714s-1.165-.199-2.28-.199c-2.327 0-3.849 1.41-3.849 3.963v2.227H6.974v2.932h2.594v7.086c.52.082 1.054.125 1.598.125.545 0 1.079-.043 1.598-.125v-7.086h2.353z"
            fill="#FFFFFF"
        />
    </svg>
);

const InstagramIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <defs>
            <radialGradient id="instagram-gradient-footer" cx="30%" cy="107%" r="150%">
                <stop offset="0%" stopColor="#fdf497" />
                <stop offset="10%" stopColor="#fdf497" />
                <stop offset="50%" stopColor="#fd5949" />
                <stop offset="68%" stopColor="#d6249f" />
                <stop offset="100%" stopColor="#285AEB" />
            </radialGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#instagram-gradient-footer)" />
        <rect x="3.8" y="3.8" width="16.4" height="16.4" rx="4.5" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
        <circle cx="12" cy="12" r="4.1" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
        <circle cx="16.5" cy="7.5" r="1.15" fill="#FFFFFF" />
    </svg>
);

const YoutubeIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
            d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
            fill="#FF0000"
        />
        <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF" />
    </svg>
);

const LinkedinIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect width="24" height="24" rx="4" fill="#0A66C2" />
        <path
            d="M5.5 9h3v10h-3v-10zm1.5-4.5c.966 0 1.75.784 1.75 1.75s-.784 1.75-1.75 1.75S5.25 7.216 5.25 6.25 6.034 4.5 7 4.5zm5.5 4.5h2.88v1.37h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6V19h-3v-4.4c0-1.05-.02-2.4-1.46-2.4-1.46 0-1.68 1.14-1.68 2.32V19h-3V9z"
            fill="#FFFFFF"
        />
    </svg>
);

const PinterestIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="12" fill="#E60023" />
        <path
            d="M12 2.5a9.5 9.5 0 0 0-3.46 18.35c-.06-.75-.1-1.9.02-2.72.11-.75.74-3.17.74-3.17s-.19-.38-.19-.95c0-.89.52-1.55 1.16-1.55.55 0 .81.41.81.91 0 .55-.35 1.38-.53 2.14-.15.64.32 1.16.95 1.16 1.14 0 2.02-1.2 2.02-2.94 0-1.54-1.11-2.61-2.68-2.61-1.96 0-3.11 1.47-3.11 2.99 0 .59.23 1.23.51 1.57.06.07.06.13.05.2-.06.22-.18.7-.2.8-.03.13-.1.16-.24.1-1-.41-1.45-1.71-1.45-2.76 0-2.25 1.63-4.31 4.71-4.31 2.47 0 4.39 1.76 4.39 4.11 0 2.45-1.55 4.43-3.7 4.43-.72 0-1.4-.38-1.63-.82l-.44 1.7c-.16.62-.6 1.4-0.89 1.88A9.5 9.5 0 1 0 12 2.5z"
            fill="#FFFFFF"
        />
    </svg>
);

const WhatsappIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="12" fill="#25D366" />
        <path
            d="M12 4.2a7.8 7.8 0 0 0-6.75 11.7L4.5 19.5l3.85-1A7.8 7.8 0 1 0 12 4.2z"
            fill="#FFFFFF"
        />
        <path
            d="M15.5 13.6c-.2-.1-1.25-.62-1.45-.7-.2-.07-.34-.1-.48.1-.15.22-.57.7-.7.86-.13.15-.26.17-.46.07-.2-.1-.85-.31-1.62-.99-.6-.54-1-1.2-1.12-1.42-.12-.2 0-.32.09-.42.1-.09.2-.23.3-.35.1-.11.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.48-1.15-.65-1.57-.17-.42-.35-.36-.48-.37h-.4c-.14 0-.37.05-.56.26-.2.2-.74.72-.74 1.76 0 1.04.76 2.05.86 2.19.1.14 1.5 2.29 3.63 3.21.51.22.9.35 1.21.45.51.16.98.14 1.35.08.41-.06 1.25-.51 1.43-1 .17-.5.17-.93.12-1.02-.05-.1-.2-.15-.42-.26z"
            fill="#25D366"
        />
    </svg>
);

function Wordmark({ settings = {}, light = false, isFooter = false }) {
    const rawTitle = settings.site_title || settings.company_name || 'ARCHI-TEXTURE';
    const siteTitle = (rawTitle === 'Archi Texture' || !rawTitle) ? 'ARCHI-TEXTURE' : rawTitle;
    const siteTagline = settings.site_tagline || 'Interior Products Wholesale Showroom and Farm';
    const logoSrc = settings.site_logo || settings.logo || '/images/logo.jpg';

    return (
        <Link
            href="/"
            className={`inline-flex items-center ${isFooter ? 'gap-3.5 sm:gap-4.5' : 'gap-2 min-[380px]:gap-2.5 sm:gap-3.5'} min-w-0 max-w-full cursor-pointer select-none group`}
        >
            <div
                className={`relative shrink-0 overflow-hidden transition-all duration-300 group-hover:scale-105 ${
                    isFooter
                        ? 'h-12 min-[380px]:h-14 sm:h-16 md:h-20 aspect-[742/1024] bg-white p-1 rounded-xl shadow-lg border border-white/20'
                        : 'h-8 min-[360px]:h-8.5 min-[400px]:h-9.5 sm:h-10 md:h-11 lg:h-12 aspect-[742/1024] bg-white rounded-lg sm:rounded-xl border border-sand/80 shadow-xs'
                }`}
            >
                <img
                    src={logoSrc}
                    alt={`${siteTitle} Logo`}
                    className="h-full w-full object-contain pointer-events-none select-none"
                />
            </div>
            <div className="flex flex-col min-w-0 justify-center">
                <span
                    className={`font-serif-display font-bold whitespace-nowrap ${
                        isFooter
                            ? 'text-lg sm:text-xl md:text-2xl text-cream tracking-[0.04em] sm:tracking-[0.06em] leading-tight'
                            : `text-[15px] min-[360px]:text-base min-[400px]:text-lg sm:text-xl md:text-[22px] lg:text-[24px] tracking-[0.05em] sm:tracking-[0.08em] md:tracking-[0.1em] uppercase leading-none ${light ? 'text-cream' : 'text-charcoal'}`
                    }`}
                >
                    {siteTitle}
                </span>
                {isFooter && (
                    <span
                        className="uppercase font-semibold leading-relaxed sm:leading-tight text-[8.5px] min-[380px]:text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.12em] sm:tracking-[0.18em] text-bronze-light mt-1 max-w-xs"
                    >
                        {siteTagline}
                    </span>
                )}
            </div>
        </Link>
    );
}

function TypewriterNotice({ text = "Interior Products Wholesale Showroom & Farm" }) {
    const fullText = text || "Interior Products Wholesale Showroom & Farm";
    const bronzeStart = fullText.includes('&') ? fullText.indexOf('&') : Math.floor(fullText.length * 0.7);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timeout;
        if (!isDeleting && displayText.length < fullText.length) {
            timeout = setTimeout(() => {
                setDisplayText(fullText.slice(0, displayText.length + 1));
            }, 60);
        } else if (!isDeleting && displayText.length === fullText.length) {
            timeout = setTimeout(() => {
                setIsDeleting(true);
            }, 3000);
        } else if (isDeleting && displayText.length > 0) {
            timeout = setTimeout(() => {
                setDisplayText(fullText.slice(0, displayText.length - 1));
            }, 28);
        } else if (isDeleting && displayText.length === 0) {
            timeout = setTimeout(() => {
                setIsDeleting(false);
            }, 400);
        }
        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, fullText]);

    const prefixPart = displayText.slice(0, Math.min(displayText.length, bronzeStart));
    const bronzePart = displayText.length > bronzeStart ? displayText.slice(bronzeStart) : '';

    return (
        <div className="w-full bg-[#1D1C1A] py-2 sm:py-2.5 border-b border-white/[0.06] overflow-hidden">
            <div className="mx-auto flex w-full max-w-[1440px] items-center justify-center px-4">
                <p className="flex items-center justify-center text-center text-[9.5px] min-[380px]:text-[10.5px] uppercase tracking-[0.12em] sm:tracking-[0.2em] sm:text-[11px] md:text-xs font-medium text-cream/90 min-h-[22px] whitespace-pre">
                    <span>{prefixPart}</span>
                    {bronzePart && (
                        <span className="text-bronze-light font-semibold">{bronzePart}</span>
                    )}
                </p>
            </div>
        </div>
    );
}

export default function PublicLayout({ children, settings: propSettings = {} }) {
    const { url, props } = usePage();
    const settings = { ...(props?.settings || {}), ...propSettings };
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openSub, setOpenSub] = useState(null);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Dynamically include all active and newly created product categories
    const sharedProductCategories = props?.sharedProductCategories || [];
    const baseCategories = ['Furniture', 'Lighting', 'Decor'];
    const allProductCategories = Array.from(new Set([...baseCategories, ...sharedProductCategories]))
        .filter(c => c && !c.toLowerCase().includes('textile'));

    // Dynamically include all active and newly created portfolio room categories
    const sharedPortfolioCategories = props?.sharedPortfolioCategories || [];
    const basePortfolioRooms = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office', 'Dining'];
    const allPortfolioCategories = Array.from(new Set([...sharedPortfolioCategories, ...basePortfolioRooms]));

    const navLinks = [
        { label: 'Home', href: '/' },
        {
            label: 'Our Products',
            href: '/products',
            submenu: [
                { label: 'All Products', href: '/products' },
                ...allProductCategories.map((cat) => ({
                    label: cat,
                    href: `/products?category=${encodeURIComponent(cat)}`,
                })),
            ],
        },
        {
            label: 'Portfolio',
            href: '/portfolio',
            submenu: [
                { label: 'All Projects', href: '/portfolio' },
                ...allPortfolioCategories.map((room) => ({
                    label: room,
                    href: `/portfolio?category=${encodeURIComponent(room)}`,
                })),
            ],
        },
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
    ];

    useEffect(() => {
        const onScroll = () => {
            setShowScrollTop(window.scrollY > 400);
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const isHome = url === '/' || url === '' || url.startsWith('/?');

    const noticeText = settings.notice_bar_text;
    const isNoticeActive = settings.notice_bar_active !== '0' && settings.notice_bar_active !== false;

    return (
        <div className="min-h-screen bg-white font-sans text-charcoal antialiased selection:bg-bronze selection:text-white">
            {/* Top Notice Bar */}
            {isNoticeActive && <TypewriterNotice text={noticeText} />}

            {/* Top Navigation */}
            <header
                className={`group relative sticky top-0 z-[61] w-full transition-all duration-300 ${
                    scrolled
                        ? 'bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(29,28,26,0.08)]'
                        : 'bg-white/95 backdrop-blur-sm border-b border-sand/40'
                }`}
            >
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-10">
                    <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
                        <Wordmark settings={settings} />

                        {/* Desktop Navigation Links */}
                        <nav className="hidden items-center gap-1 xl:gap-2 lg:flex">
                            {navLinks.map(({ label, href, submenu }) => {
                                const isCurrent = url === href || (href !== '/' && url.startsWith(href));
                                return submenu ? (
                                    <div key={href} className="group/item relative flex items-center py-2">
                                        <a
                                            href={href}
                                            className={`inline-flex items-center gap-1 px-3 py-2 text-[12px] xl:text-[13px] font-semibold uppercase tracking-[0.12em] xl:tracking-[0.14em] transition-colors duration-200 ${
                                                isCurrent
                                                    ? 'text-bronze font-bold'
                                                    : 'text-charcoal/80 hover:text-bronze'
                                            }`}
                                        >
                                            <span>{label}</span>
                                            <ChevronDown size={13} className="transition-transform duration-200 group-hover/item:rotate-180 opacity-60" />
                                        </a>

                                        {/* Dropdown */}
                                        <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-hover/item:visible group-hover/item:opacity-100">
                                            <div className="min-w-[200px] rounded-xl border border-sand/60 bg-white py-2 shadow-[0_14px_35px_rgba(29,28,26,0.14)] overflow-hidden">
                                                {submenu.map((item) => (
                                                    <a
                                                        key={item.label}
                                                        href={item.href}
                                                        className="block px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-charcoal/80 transition-colors hover:bg-cream hover:text-bronze"
                                                    >
                                                        {item.label}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <a
                                        key={href}
                                        href={href}
                                        className={`px-3 py-2 text-[12px] xl:text-[13px] font-semibold uppercase tracking-[0.12em] xl:tracking-[0.14em] transition-colors duration-200 ${
                                            isCurrent
                                                ? 'text-bronze font-bold'
                                                : 'text-charcoal/80 hover:text-bronze'
                                        }`}
                                    >
                                        {label}
                                    </a>
                                );
                            })}
                        </nav>

                        {/* CTA Button & Mobile Hamburger */}
                        <div className="flex items-center gap-2.5 sm:gap-3">
                            <a
                                href="/contact"
                                className="hidden sm:inline-flex items-center justify-center rounded-lg border border-charcoal/30 bg-transparent px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-[12.5px] font-semibold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-charcoal transition-all duration-200 hover:border-black hover:bg-black hover:text-white"
                            >
                                Get Started
                            </a>

                            <button
                                className="inline-flex lg:hidden items-center justify-center p-2 rounded-lg text-charcoal hover:bg-cream transition-colors"
                                onClick={() => setMobileOpen(!mobileOpen)}
                                aria-label="Toggle menu"
                                aria-expanded={mobileOpen}
                            >
                                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Responsive Mobile Drawer */}
                {mobileOpen && (
                    <div className="border-t border-sand/60 bg-white/98 backdrop-blur-md shadow-xl lg:hidden max-h-[calc(100vh-64px)] overflow-y-auto">
                        <nav className="space-y-1 px-4 py-4 sm:px-6">
                            {navLinks.map(({ label, href, submenu }) =>
                                submenu ? (
                                    <div key={href} className="rounded-lg overflow-hidden">
                                        <div className="flex items-center justify-between rounded-lg hover:bg-cream transition-colors">
                                            <a
                                                href={href}
                                                onClick={() => setMobileOpen(false)}
                                                className={`flex-1 px-3.5 py-3 text-sm font-semibold uppercase tracking-[0.1em] transition-colors ${
                                                    url === href || (href !== '/' && url.startsWith(href))
                                                        ? 'text-bronze font-bold'
                                                        : 'text-charcoal/85'
                                                }`}
                                            >
                                                {label}
                                            </a>
                                            <button
                                                type="button"
                                                onClick={() => setOpenSub(openSub === href ? null : href)}
                                                aria-label={`Toggle ${label} subcategories`}
                                                className="p-3 text-charcoal/60 hover:text-bronze transition-colors"
                                            >
                                                <ChevronDown
                                                    size={18}
                                                    className={`transition-transform duration-200 ${
                                                        openSub === href ? 'rotate-180 text-bronze' : ''
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                        {openSub === href && (
                                            <div className="my-1 ml-4 space-y-1 border-l-2 border-bronze/30 pl-3 py-1">
                                                {submenu.map((subItem) => (
                                                    <a
                                                        key={subItem.label}
                                                        href={subItem.href}
                                                        onClick={() => setMobileOpen(false)}
                                                        className="block rounded-md px-3 py-2 text-[12.5px] font-medium uppercase tracking-[0.08em] text-charcoal/70 hover:bg-cream hover:text-bronze transition-colors"
                                                    >
                                                        {subItem.label}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <a
                                        key={href}
                                        href={href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`block rounded-lg px-3.5 py-3 text-sm font-semibold uppercase tracking-[0.1em] transition-colors ${
                                            url === href || (href !== '/' && url.startsWith(href))
                                                ? 'bg-cream text-bronze font-bold'
                                                : 'text-charcoal/85 hover:bg-cream'
                                        }`}
                                    >
                                        {label}
                                    </a>
                                )
                            )}

                            <div className="pt-3 pb-2 border-t border-sand/40 mt-2">
                                <a
                                    href="/contact"
                                    onClick={() => setMobileOpen(false)}
                                    className="block w-full rounded-lg border border-charcoal/40 bg-charcoal px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.12em] text-white hover:bg-black transition-all"
                                >
                                    Get Started
                                </a>
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {/* Main */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-charcoal text-cream">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-10 py-10 sm:py-14 md:py-18">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
                        {/* Brand Column */}
                        <div className="space-y-4 sm:space-y-5">
                            <Wordmark settings={settings} light isFooter />

                            {/* Join Our Community */}
                            <div className="pt-1 sm:pt-2">
                                <h3 className="mb-2.5 sm:mb-3.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-cream/50">
                                    Join Our Community
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                                    {[
                                        { key: 'facebook_url', label: 'Facebook', Icon: FacebookIcon, defaultUrl: 'https://facebook.com', brandHover: 'hover:border-[#1877F2]/60 hover:shadow-[0_0_12px_rgba(24,119,242,0.45)]' },
                                        { key: 'instagram_url', label: 'Instagram', Icon: InstagramIcon, defaultUrl: 'https://instagram.com', brandHover: 'hover:border-[#E1306C]/60 hover:shadow-[0_0_12px_rgba(225,48,108,0.45)]' },
                                        { key: 'youtube_url', label: 'YouTube', Icon: YoutubeIcon, defaultUrl: 'https://youtube.com', brandHover: 'hover:border-[#FF0000]/60 hover:shadow-[0_0_12px_rgba(255,0,0,0.45)]' },
                                        { key: 'linkedin_url', label: 'LinkedIn', Icon: LinkedinIcon, brandHover: 'hover:border-[#0A66C2]/60 hover:shadow-[0_0_12px_rgba(10,102,194,0.45)]' },
                                        { key: 'pinterest_url', label: 'Pinterest', Icon: PinterestIcon, brandHover: 'hover:border-[#E60023]/60 hover:shadow-[0_0_12px_rgba(230,0,35,0.45)]' },
                                        { key: 'whatsapp_url', label: 'WhatsApp', Icon: WhatsappIcon, brandHover: 'hover:border-[#25D366]/60 hover:shadow-[0_0_12px_rgba(37,211,102,0.45)]' },
                                    ]
                                        .filter(({ key, defaultUrl }) => {
                                            const val = settings[key];
                                            if (val && typeof val === 'string' && val.trim() !== '') return true;
                                            if (defaultUrl && (val === undefined || val === null)) return true;
                                            return false;
                                        })
                                        .map(({ key, label, Icon, defaultUrl, brandHover }) => {
                                            let link = (settings[key] || defaultUrl || '#').trim();
                                            if (key === 'whatsapp_url' && link && !link.startsWith('http')) {
                                                const digits = link.replace(/[^0-9]/g, '');
                                                link = `https://wa.me/${digits}`;
                                            }
                                            return (
                                                <a
                                                    key={key}
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={label}
                                                    className={`inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 transition-all duration-300 hover:scale-110 hover:bg-white/15 ${brandHover}`}
                                                >
                                                    <Icon size={20} />
                                                </a>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>

                        {/* Navigation Columns: side by side on mobile for compact, responsive layout */}
                        <div className="grid grid-cols-2 gap-6 sm:contents">
                            {/* Quick Links */}
                            <div>
                                <h3 className="font-serif-display mb-3.5 sm:mb-5 text-base sm:text-lg md:text-xl text-cream tracking-[0.02em]">Quick Links</h3>
                                <ul className="space-y-2 sm:space-y-2.5">
                                    {[
                                        { label: 'Home', href: '/' },
                                        { label: 'Our Products', href: '/products' },
                                        { label: 'Portfolio', href: '/portfolio' },
                                        { label: 'About Us', href: '/about' },
                                        { label: 'Contact', href: '/contact' },
                                    ].map(({ label, href }) => (
                                        <li key={href}>
                                            <a href={href} className="text-xs sm:text-[13px] md:text-sm text-cream/65 transition-colors hover:text-bronze-light inline-block py-0.5">
                                                {label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Our Products */}
                            <div>
                                <h3 className="font-serif-display mb-3.5 sm:mb-5 text-base sm:text-lg md:text-xl text-cream tracking-[0.02em]">Our Products</h3>
                                <ul className="space-y-2 sm:space-y-2.5">
                                    <li>
                                        <a href="/products" className="text-xs sm:text-[13px] md:text-sm text-cream/65 transition-colors hover:text-bronze-light inline-block py-0.5">
                                            All Products
                                        </a>
                                    </li>
                                    {allProductCategories.map((cat) => (
                                        <li key={cat}>
                                            <a href={`/products?category=${encodeURIComponent(cat)}`} className="text-xs sm:text-[13px] md:text-sm text-cream/65 transition-colors hover:text-bronze-light inline-block py-0.5">
                                                {cat}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="font-serif-display mb-3.5 sm:mb-5 text-base sm:text-lg md:text-xl text-cream tracking-[0.02em]">Contact</h3>
                            <a
                                href="/contact"
                                className="inline-flex w-full sm:w-auto items-center justify-center rounded-[8px] border border-bronze px-5 sm:px-6 py-2.5 text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.14em] sm:tracking-[0.16em] text-bronze-light transition-all duration-300 hover:bg-bronze hover:text-white shadow-xs"
                            >
                                Start Your Project
                            </a>
                            <ul className="mt-4 sm:mt-5 space-y-3 sm:space-y-3.5">
                                <li className="flex items-start gap-2.5 sm:gap-3">
                                    <MapPin size={15} className="mt-0.5 shrink-0 text-bronze" />
                                    <span className="text-xs sm:text-[13px] md:text-sm text-cream/65 leading-relaxed">
                                        {settings.contact_address || 'Mohakhali, Dhaka, Bangladesh'}
                                    </span>
                                </li>
                                <li className="flex items-start gap-2.5 sm:gap-3">
                                    <Phone size={15} className="mt-0.5 shrink-0 text-bronze" />
                                    <a href={`tel:${(settings.contact_phone || settings.phone || '01626778573').replace(/[^0-9+]/g, '')}`} className="text-xs sm:text-[13px] md:text-sm text-cream/65 transition-colors hover:text-bronze-light break-words">
                                        {settings.contact_phone || settings.phone || '01626778573'}
                                    </a>
                                </li>
                                {(settings.contact_email || settings.email || 'contact@architexturebd.com') && (
                                    <li className="flex items-start gap-2.5 sm:gap-3">
                                        <Mail size={15} className="mt-0.5 shrink-0 text-bronze" />
                                        <a href={`mailto:${settings.contact_email || settings.email || 'contact@architexturebd.com'}`} className="text-xs sm:text-[13px] md:text-sm text-cream/65 transition-colors hover:text-bronze-light break-all sm:break-words">
                                            {settings.contact_email || settings.email || 'contact@architexturebd.com'}
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-cream/10">
                    <div className="mx-auto flex max-w-[1440px] flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 md:px-10 py-5 sm:py-6">
                        <p className="text-[11px] sm:text-xs text-cream/45 text-center sm:text-left">
                            &copy; {new Date().getFullYear()} {settings.site_title || settings.company_name || 'Archi Texture'}. All rights reserved.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                            <a href="#" className="text-[11px] sm:text-xs text-cream/45 transition-colors hover:text-cream/75">Privacy Policy</a>
                            <a href="#" className="text-[11px] sm:text-xs text-cream/45 transition-colors hover:text-cream/75">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Scroll to Top */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    aria-label="Scroll to top"
                    className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-charcoal text-cream shadow-lg transition-all duration-300 hover:bg-bronze"
                >
                    <ArrowUp size={17} />
                </button>
            )}
        </div>
    );
}
