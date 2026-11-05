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
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard',          href: '/admin',          icon: LayoutDashboard, end: true },
    { label: 'Products & Catalog', href: '/admin/products', icon: Package },
    { label: 'Orders',             href: '/admin/orders',   icon: ShoppingBag, badge: 4 },
    { label: 'Portfolio Projects', href: '/admin/projects', icon: FolderKanban },
    { label: 'Services',           href: '/admin/services', icon: Briefcase },
    { label: 'Experience',         href: '/admin/experience', icon: ClipboardList },
    { label: 'Blog',               href: '/admin/blog',     icon: FileText },
    { label: 'Media',              href: '/admin/media',    icon: Image },
    { label: 'Site & Notice Settings', href: '/admin/settings', icon: Settings },
];

function NavItem({ item, collapsed, orderCount }) {
    const { url } = usePage();
    const isActive = item.end
        ? url === item.href || url === item.href + '/'
        : url.startsWith(item.href);
    const Icon = item.icon;
    const badgeVal = item.label === 'Orders' ? (orderCount ?? item.badge) : item.badge;

    return (
        <Link
            href={item.href}
            className={`group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all duration-200 ${
                isActive
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20 font-semibold'
                    : 'text-slate-300/80 hover:bg-slate-800/60 hover:text-white'
            } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? item.label : undefined}
        >
            <div className="flex items-center gap-3 min-w-0">
                <Icon size={17} className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
            </div>

            {!collapsed && badgeVal !== undefined && badgeVal > 0 && (
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white text-blue-600' : 'bg-blue-600 text-white shadow-xs'
                }`}>
                    {badgeVal}
                </span>
            )}
        </Link>
    );
}

export default function AdminLayout({ children, title }) {
    const { auth, stats } = usePage().props;
    const user = auth?.user;
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const orderCount = stats?.orders ?? 4;

    const Sidebar = ({ mobile = false }) => (
        <div
            className={`flex flex-col bg-[#0D1527] border-r border-slate-800/60 transition-all duration-300 ${
                mobile ? 'w-72' : collapsed ? 'w-18' : 'w-64'
            } h-full select-none`}
        >
            {/* Brand Logo & Studio Admin */}
            <div className={`flex items-center gap-3 px-5 py-5 border-b border-slate-800/80 ${collapsed && !mobile ? 'justify-center' : ''}`}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md p-1.5 ring-1 ring-white/10">
                    <svg viewBox="0 0 32 32" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 4L4 28h8l4-8 4 8h8L16 4z" fill="#FFF" fillOpacity="0.18" />
                        <path d="M16 4L5 28h6l5-10 5 10h6L16 4z" />
                        <path d="M11 19h10" />
                    </svg>
                </div>
                {(!collapsed || mobile) && (
                    <div className="min-w-0">
                        <span className="text-white font-bold text-sm tracking-tight block truncate">Archi Texture</span>
                        <span className="text-slate-400 text-[11px] font-medium block">Studio Admin</span>
                    </div>
                )}
            </div>

            {/* Nav list */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
                {navItems.map((item) => (
                    <NavItem key={item.href} item={item} collapsed={collapsed && !mobile} orderCount={orderCount} />
                ))}
            </nav>

            {/* Bottom Profile Widget */}
            <div className={`border-t border-slate-800/80 p-3.5 bg-[#0B1222] ${collapsed && !mobile ? 'flex flex-col items-center gap-2' : ''}`}>
                {(!collapsed || mobile) ? (
                    <div className="flex items-center gap-3 rounded-xl px-2 py-1.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2563EB] text-white text-sm font-bold shadow-md shadow-blue-500/20">
                            {user?.name?.[0]?.toUpperCase() ?? 'A'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white truncate leading-tight">{user?.name || 'Archi Texture Admin'}</p>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email || 'admin@architexturebd.com'}</p>
                        </div>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="text-slate-400 hover:text-white transition-colors p-1"
                            title="Logout"
                        >
                            <LogOut size={16} />
                        </Link>
                    </div>
                ) : (
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                        title="Logout"
                    >
                        <LogOut size={17} />
                    </Link>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900 overflow-hidden">
            {/* Left Desktop Sidebar */}
            <div className="hidden lg:flex relative shrink-0">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
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
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Clean Pure White Topbar */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-5 lg:px-8 shadow-xs">
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
                        {/* Notification Bell */}
                        <button
                            type="button"
                            className="relative flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            title="Notifications"
                        >
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                        </button>

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
                                    {user?.name?.[0]?.toUpperCase() ?? 'A'}
                                </div>
                                <span className="text-xs font-bold text-slate-700 hidden sm:inline-block max-w-[120px] truncate">
                                    {user?.name || 'Admin'}
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
                                            <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Archi Texture Admin'}</p>
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
                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition"
                                            >
                                                <LogOut size={15} />
                                                <span>Log Out</span>
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Direct Logout Quick Pill Button */}
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-red-200/80 bg-red-50/70 hover:bg-red-100/80 px-3 py-1.5 text-xs font-bold text-red-600 transition shadow-2xs"
                            title="Log Out of Admin"
                        >
                            <LogOut size={13} />
                            <span>Logout</span>
                        </Link>
                    </div>
                </header>

                {/* Dashboard Page Content */}
                <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
                    {children}
                </main>
            </div>
        </div>
    );
}

