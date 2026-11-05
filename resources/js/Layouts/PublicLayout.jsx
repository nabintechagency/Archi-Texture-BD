import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import { Menu, X, Mail, ArrowUp, ChevronDown, Phone, MapPin } from 'lucide-react';

const FacebookIcon = ({ size = 17 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const InstagramIcon = ({ size = 17 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);

const YoutubeIcon = ({ size = 17 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

const LinkedinIcon = ({ size = 17 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
);

const PinterestIcon = ({ size = 17 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0a12 12 0 0 0-4.37 23.18c-.07-.94-.13-2.39.03-3.42.14-.94.94-3.99.94-3.99s-.24-.48-.24-1.19c0-1.12.65-1.95 1.46-1.95.69 0 1.02.52 1.02 1.14 0 .69-.44 1.73-.67 2.69-.19.8.4 1.46 1.19 1.46 1.43 0 2.53-1.51 2.53-3.69 0-1.93-1.39-3.28-3.37-3.28-2.46 0-3.9 1.85-3.9 3.76 0 .74.29 1.54.64 1.97.07.09.08.16.06.25-.07.28-.22.88-.25 1-.04.16-.13.2-.3.12-1.12-.52-1.82-2.15-1.82-3.46 0-2.82 2.05-5.41 5.91-5.41 3.1 0 5.51 2.21 5.51 5.16 0 3.08-1.94 5.56-4.64 5.56-.91 0-1.76-.47-2.05-1.02l-.56 2.13c-.2.78-.75 1.76-1.12 2.36A12 12 0 1 0 12 0z"/>
    </svg>
);

const WhatsappIcon = ({ size = 17 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
);

const XIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
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
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
                        {/* Brand Column */}
                        <div className="space-y-5 sm:space-y-6">
                            <Wordmark settings={settings} light isFooter />
                            
                            <p className="text-xs sm:text-[13px] leading-relaxed text-cream/65 max-w-sm">
                                Interior products wholesale showroom and farm, curating bespoke furniture, artisan lighting, and architectural elements.
                            </p>

                            {/* Join Our Community */}
                            <div className="pt-1">
                                <h3 className="mb-3 sm:mb-4 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-cream/50">
                                    Join Our Community
                                </h3>
                                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                                    {[
                                        { key: 'facebook_url', label: 'Facebook', Icon: FacebookIcon, defaultUrl: 'https://facebook.com' },
                                        { key: 'instagram_url', label: 'Instagram', Icon: InstagramIcon, defaultUrl: 'https://instagram.com' },
                                        { key: 'youtube_url', label: 'YouTube', Icon: YoutubeIcon, defaultUrl: 'https://youtube.com' },
                                        { key: 'linkedin_url', label: 'LinkedIn', Icon: LinkedinIcon },
                                        { key: 'pinterest_url', label: 'Pinterest', Icon: PinterestIcon },
                                        { key: 'whatsapp_url', label: 'WhatsApp', Icon: WhatsappIcon },
                                        { key: 'x_url', label: 'X', Icon: XIcon },
                                    ]
                                        .filter(({ key, defaultUrl }) => {
                                            const val = settings[key];
                                            if (val && typeof val === 'string' && val.trim() !== '') return true;
                                            if (defaultUrl && (val === undefined || val === null)) return true;
                                            return false;
                                        })
                                        .map(({ key, label, Icon, defaultUrl }) => {
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
                                                    className="rounded-full border border-cream/15 p-2 sm:p-2.5 text-cream/60 transition-all duration-300 hover:border-bronze hover:bg-bronze hover:text-white"
                                                >
                                                    <Icon size={16} />
                                                </a>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                        {/* Quick Links */}
                        <div>
                            <h3 className="font-serif-display mb-4 sm:mb-6 text-base sm:text-lg md:text-xl text-cream tracking-[0.02em]">Quick Links</h3>
                            <ul className="space-y-2.5 sm:space-y-3">
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
                            <h3 className="font-serif-display mb-4 sm:mb-6 text-base sm:text-lg md:text-xl text-cream tracking-[0.02em]">Our Products</h3>
                            <ul className="space-y-2.5 sm:space-y-3">
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

                        {/* Contact */}
                        <div>
                            <h3 className="font-serif-display mb-4 sm:mb-6 text-base sm:text-lg md:text-xl text-cream tracking-[0.02em]">Contact</h3>
                            <a
                                href="/contact"
                                className="inline-flex w-full sm:w-auto items-center justify-center rounded-[8px] border border-bronze px-6 sm:px-7 py-2.5 text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.14em] sm:tracking-[0.16em] text-bronze-light transition-all duration-300 hover:bg-bronze hover:text-white"
                            >
                                Start Your Project
                            </a>
                            <ul className="mt-5 sm:mt-6 space-y-3.5 sm:space-y-4">
                                <li className="flex items-start gap-3">
                                    <MapPin size={15} className="mt-0.5 shrink-0 text-bronze" />
                                    <span className="text-xs sm:text-[13px] md:text-sm text-cream/65 leading-relaxed">
                                        {settings.contact_address || 'Mohakhali, Dhaka, Bangladesh'}
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Phone size={15} className="mt-0.5 shrink-0 text-bronze" />
                                    <a href={`tel:${(settings.contact_phone || settings.phone || '01626778573').replace(/[^0-9+]/g, '')}`} className="text-xs sm:text-[13px] md:text-sm text-cream/65 transition-colors hover:text-bronze-light break-words">
                                        {settings.contact_phone || settings.phone || '01626778573'}
                                    </a>
                                </li>
                                {(settings.contact_email || settings.email || 'contact@architexturebd.com') && (
                                    <li className="flex items-start gap-3">
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
