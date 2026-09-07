import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import { Menu, X, Mail, ArrowUp, ChevronDown, Phone } from 'lucide-react';

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

const PRODUCT_CATEGORIES = ['Furniture', 'Lighting', 'Decor', 'Textiles'];
const PORTFOLIO_ROOMS = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office', 'Dining'];

const navLinks = [
    { label: 'Home', href: '/' },
    {
        label: 'Our Products',
        href: '/products',
        submenu: PRODUCT_CATEGORIES.map((cat) => ({
            label: cat,
            href: `/products?category=${encodeURIComponent(cat)}`,
        })),
    },
    {
        label: 'Portfolio',
        href: '/portfolio',
        submenu: PORTFOLIO_ROOMS.map((room) => ({
            label: room,
            href: `/portfolio?category=${encodeURIComponent(room)}`,
        })),
    },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
];

function Wordmark({ settings = {}, light = false, isFooter = false }) {
    const siteTitle = settings.site_title || settings.company_name || 'Archi Texture';
    const siteTagline = settings.site_tagline || 'Interior Products Wholesale Showroom and Farm';

    return (
        <Link
            href="/"
            className={`inline-flex items-center ${isFooter ? 'gap-3 sm:gap-4' : 'gap-2.5 sm:gap-3.5'} min-w-0 max-w-full cursor-pointer select-none group`}
        >
            <div
                className={`relative shrink-0 overflow-hidden rounded-lg sm:rounded-xl border border-bronze/30 shadow-xs transition-transform duration-200 group-hover:scale-105 bg-[#fab617] ${
                    isFooter
                        ? 'h-12 min-[380px]:h-14 sm:h-16 md:h-20 aspect-[742/1024]'
                        : 'h-9 sm:h-11 md:h-12 aspect-[742/1024]'
                }`}
            >
                <img
                    src="/images/logo.jpg"
                    alt={`${siteTitle} Logo`}
                    className="h-full w-full object-contain pointer-events-none select-none"
                />
            </div>
            <div className="flex flex-col min-w-0 justify-center">
                <span
                    className={`font-serif-display font-bold leading-tight ${
                        isFooter
                            ? 'text-lg sm:text-xl md:text-2xl text-cream tracking-[0.04em] sm:tracking-[0.06em]'
                            : `text-base sm:text-lg md:text-xl lg:text-[22px] tracking-[0.04em] sm:tracking-[0.06em] ${light ? 'text-cream' : 'text-charcoal'} truncate`
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

export default function PublicLayout({ children, settings = {} }) {
    const { url } = usePage();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openSub, setOpenSub] = useState(null);
    const [showScrollTop, setShowScrollTop] = useState(false);

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

    return (
        <div className="min-h-screen bg-white font-sans text-charcoal antialiased selection:bg-bronze selection:text-white">
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
                                <div className="flex items-center gap-2.5 sm:gap-3">
                                    {[
                                        { key: 'facebook_url', label: 'Facebook', Icon: FacebookIcon },
                                        { key: 'instagram_url', label: 'Instagram', Icon: InstagramIcon },
                                        { key: 'youtube_url', label: 'YouTube', Icon: YoutubeIcon },
                                    ].map(({ key, label, Icon }) => (
                                        <a
                                            key={key}
                                            href={settings[key] || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={label}
                                            className="rounded-full border border-cream/15 p-2 sm:p-2.5 text-cream/60 transition-all duration-300 hover:border-bronze hover:bg-bronze hover:text-white"
                                        >
                                            <Icon size={16} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Explore */}
                        <div>
                            <h3 className="font-serif-display mb-4 sm:mb-6 text-base sm:text-lg md:text-xl text-cream tracking-[0.02em]">Explore</h3>
                            <ul className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-2.5 sm:gap-y-3">
                                {navLinks.map(({ label, href }) => (
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
                                {['Bespoke Furniture', 'Architectural Lighting', 'Handcrafted Rugs & Textiles', 'Sculptural Ceramic & Decor'].map((label) => (
                                    <li key={label}>
                                        <a href="/products" className="text-xs sm:text-[13px] md:text-sm text-cream/65 transition-colors hover:text-bronze-light inline-block py-0.5">
                                            {label}
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
                                    <Phone size={15} className="mt-0.5 shrink-0 text-bronze" />
                                    <a href={`tel:${(settings.phone || settings.contact_phone || '01626778573').replace(/[^0-9+]/g, '')}`} className="text-xs sm:text-[13px] md:text-sm text-cream/65 transition-colors hover:text-bronze-light break-words">
                                        {settings.phone || settings.contact_phone || '01626778573'}
                                    </a>
                                </li>
                                {(settings.email || settings.contact_email || 'contact@architexture.com') && (
                                    <li className="flex items-start gap-3">
                                        <Mail size={15} className="mt-0.5 shrink-0 text-bronze" />
                                        <a href={`mailto:${settings.email || settings.contact_email || 'contact@architexture.com'}`} className="text-xs sm:text-[13px] md:text-sm text-cream/65 transition-colors hover:text-bronze-light break-all sm:break-words">
                                            {settings.email || settings.contact_email || 'contact@architexture.com'}
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
