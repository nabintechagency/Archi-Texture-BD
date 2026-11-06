import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    SlidersHorizontal,
    FolderKanban,
    Zap,
    Briefcase,
    ClipboardList,
    GraduationCap,
    Award,
    Star,
    FileText,
    Image,
    MessageSquare,
    MessageSquareQuote,
    Settings,
    Search,
    User,
    LogOut,
    Bell,
    Menu,
    X,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard',          href: '/admin',          icon: LayoutDashboard, end: true },
    { label: 'Products & Catalog', href: '/admin/products', icon: Package },
    { label: 'Orders',             href: '/admin/orders',   icon: ShoppingBag },
    { label: 'Portfolio Projects', href: '/admin/projects', icon: FolderKanban },
    { label: 'Client Stories',     href: '/admin/testimonials', icon: MessageSquareQuote },
    { label: 'Blogs',              href: '/admin/blog',     icon: FileText },
    { label: 'Site Settings',      href: '/admin/settings', icon: Settings },
];

function NavItem({ item, collapsed, orderCount }) {
    const { url } = usePage();
    const isActive = item.end
        ? url === item.href || url === item.href + '/'
        : url.startsWith(item.href);
    const Icon = item.icon;
    const badgeVal = item.label === 'Orders' ? orderCount : item.badge;

    return (
        <Link
            href={item.href}
            className={`group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all duration-200 ${
                isActive
                    ? 'bg-gradient-to-r from-[#A98952] to-[#8C6F3E] text-white shadow-md shadow-[#8C6F3E]/25 font-semibold'
                    : 'text-[#D6D0C4]/80 hover:bg-[#292524]/85 hover:text-[#FAF8F5]'
            } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? item.label : undefined}
        >
            <div className="flex items-center gap-3 min-w-0">
                <Icon size={17} className={`shrink-0 ${isActive ? 'text-white' : 'text-[#A8A296] group-hover:text-[#D4BE9B] transition-colors'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
            </div>

            {!collapsed && badgeVal !== undefined && badgeVal > 0 && (
                <span className={`flex h-5 min-w-5 px-1.5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white shadow-xs' : 'bg-[#292524] text-[#C7AE85] border border-[#3E3832]'
                }`}>
                    {badgeVal}
                </span>
            )}
        </Link>
    );
}

export default function AdminLayout({ children, title }) {
    const { auth, stats, settings, adminOrderCount } = usePage().props;
    const user = auth?.user;
    const logoSrc = settings?.site_logo || settings?.logo || '/images/logo.jpg';
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const orderCount = adminOrderCount ?? stats?.orders ?? 0;

    const Sidebar = ({ mobile = false }) => (
        <div
            className={`flex flex-col bg-[#1C1A17] border-r border-[#2A2723] transition-all duration-300 ${
                mobile ? 'w-72' : collapsed ? 'w-18' : 'w-64'
            } h-full select-none shadow-[2px_0_12px_rgba(0,0,0,0.18)]`}
        >
            {/* Brand Logo & Studio Admin Header */}
            <div className={`flex items-center gap-3 px-5 py-4 border-b border-[#2A2723] ${collapsed && !mobile ? 'justify-center' : ''}`}>
                <div className="relative h-10 aspect-[742/1024] shrink-0 overflow-hidden rounded-lg bg-white p-0.5 shadow-sm border border-white/10">
                    <img
                        src={logoSrc}
                        alt="Archi Texture Logo"
                        className="h-full w-full object-contain pointer-events-none select-none"
                    />
                </div>
                {(!collapsed || mobile) && (
                    <div className="min-w-0">
                        <span className="text-[#F8F5EF] font-bold text-sm tracking-tight block truncate font-serif">Archi Texture</span>
                        <span className="text-[#C7AE85] text-[10px] font-semibold uppercase tracking-[0.16em] block mt-0.5">Studio Admin</span>
                    </div>
                )}
            </div>

            {/* Nav list */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-[#2A2723]">
                {navItems.map((item) => (
                    <NavItem key={item.href} item={item} collapsed={collapsed && !mobile} orderCount={orderCount} />
                ))}
            </nav>

            {/* Bottom Profile Widget */}
            <div className={`border-t border-[#2A2723] p-3.5 bg-[#141311] ${collapsed && !mobile ? 'flex flex-col items-center gap-2' : ''}`}>
                {(!collapsed || mobile) ? (
                    <div className="flex items-center gap-3 rounded-xl px-2 py-1.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#A98952] to-[#8C6F3E] text-white text-sm font-bold shadow-sm ring-1 ring-[#C7AE85]/20 font-serif">
                            {user?.name?.[0]?.toUpperCase() ?? 'S'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-[#F8F5EF] truncate leading-tight">{user?.name || 'Studio Admin'}</p>
                            <p className="text-[11px] text-[#A8A296] truncate mt-0.5">{user?.email || 'admin@architexturebd.com'}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#A98952] to-[#8C6F3E] text-white text-xs font-bold shadow-xs ring-1 ring-[#C7AE85]/20 font-serif" title={user?.name || 'Studio Admin'}>
                        {user?.name?.[0]?.toUpperCase() ?? 'S'}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900 overflow-hidden print:h-auto print:overflow-visible print:bg-white">
            {/* Left Desktop Sidebar */}
            <aside className="hidden lg:flex relative shrink-0 print:hidden">
                <Sidebar />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden print:hidden">
                    <div
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="relative z-10 h-full w-72">
                        <Sidebar mobile />
                    </div>
                </div>
            )}

            {/* Right Main Area */}
            <div className="flex flex-1 flex-col overflow-hidden print:h-auto print:overflow-visible">
                {/* Clean Pure White Topbar (Hidden in Print / PDF) */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-5 lg:px-8 shadow-xs print:hidden">
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Toggle Navigation"
                        >
                            <Menu size={20} />
                        </button>

                        {/* Search Input Bar */}
                        <div className="relative w-full max-w-sm sm:max-w-md">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search orders, customers, products..."
                                className="w-full rounded-full border border-slate-200/80 bg-[#F8FAFC] pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all shadow-2xs"
                            />
                        </div>
                    </div>

                    {/* Topbar Actions */}
                    <div className="flex items-center gap-3.5 shrink-0 ml-4">
                        {/* View Site Pill Button */}
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-all shadow-2xs"
                        >
                            <span>View Site</span>
                            <ExternalLink size={12} className="text-slate-400" />
                        </a>

                        {/* Topbar User Profile Menu & Logout */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white p-1 pr-3 hover:bg-slate-50 transition shadow-2xs select-none"
                            >
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-white font-bold text-xs shadow-xs">
                                    {user?.name?.[0]?.toUpperCase() ?? 'S'}
                                </div>
                                <span className="text-xs font-bold text-slate-700 hidden sm:inline-block max-w-[120px] truncate">
                                    {user?.name || 'Studio Admin'}
                                </span>
                            </button>

                            {/* Dropdown Menu */}
                            {userDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setUserDropdownOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                                        <div className="px-3 py-2 border-b border-slate-100">
                                            <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Studio Admin'}</p>
                                            <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email || 'admin@architexturebd.com'}</p>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                href="/admin/settings"
                                                onClick={() => setUserDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-violet-600 rounded-xl transition"
                                            >
                                                <Settings size={15} />
                                                <span>Studio Settings</span>
                                            </Link>
                                        </div>

                                        <div className="pt-1 border-t border-slate-100">
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <LogOut size={15} />
                                                    <span>Log Out</span>
                                                </div>
                                                <ArrowRight size={13} className="text-red-400" />
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Dashboard Page Content */}
                <main className="flex-1 overflow-y-auto bg-[#F8FAFC] print:overflow-visible print:bg-white print:p-0">
                    {children}
                </main>
            </div>
        </div>
    );
}

