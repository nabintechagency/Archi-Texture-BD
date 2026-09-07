import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutDashboard,
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
    ChevronLeft,
    ChevronRight,
    LogOut,
    Bell,
    Menu,
    X,
    SlidersHorizontal,
    Package,
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard',       href: '/admin',               icon: LayoutDashboard, end: true },
    { label: 'Sliders',         href: '/admin/sliders',        icon: SlidersHorizontal },
    { label: 'Projects',        href: '/admin/projects',       icon: FolderKanban },
    { label: 'Products',        href: '/admin/products',       icon: Package },
    { label: 'Skills',          href: '/admin/skills',         icon: Zap },
    { label: 'Services',        href: '/admin/services',       icon: Briefcase },
    { label: 'Experience',      href: '/admin/experience',     icon: ClipboardList },
    { label: 'Education',       href: '/admin/education',      icon: GraduationCap },
    { label: 'Certifications',  href: '/admin/certifications', icon: Award },
    { label: 'Testimonials',    href: '/admin/testimonials',   icon: Star },
    { label: 'Blog',            href: '/admin/blog',           icon: FileText },
    { label: 'Media',           href: '/admin/media',          icon: Image },
    { label: 'Messages',        href: '/admin/messages',       icon: MessageSquare },
    { label: 'Settings',        href: '/admin/settings',       icon: Settings },
    { label: 'SEO',             href: '/admin/seo',            icon: Search },
];

function NavItem({ item, collapsed }) {
    const { url } = usePage();
    const isActive = item.end
        ? url === item.href || url === item.href + '/'
        : url.startsWith(item.href);
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? item.label : undefined}
        >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
        </Link>
    );
}

export default function AdminLayout({ children, title }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const Sidebar = ({ mobile = false }) => (
        <div
            className={`flex flex-col bg-slate-900 transition-all duration-300 ${
                mobile ? 'w-72' : collapsed ? 'w-16' : 'w-64'
            } h-full`}
        >
            {/* Logo */}
            <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-800 ${collapsed && !mobile ? 'justify-center' : ''}`}>
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-amber-500/30 shadow-md">
                    <img src="/images/logo.jpg" alt="Logo" className="h-full w-full object-cover" />
                </div>
                {(!collapsed || mobile) && (
                    <div>
                        <span className="text-white font-bold text-sm leading-tight block tracking-wide">Archi Texture</span>
                        <span className="text-amber-400/80 text-[11px]">Studio Admin</span>
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {navItems.map((item) => (
                    <NavItem key={item.href} item={item} collapsed={collapsed && !mobile} />
                ))}
            </nav>

            {/* User */}
            <div className={`border-t border-slate-800 p-3 ${collapsed && !mobile ? 'flex flex-col items-center gap-2' : ''}`}>
                {(!collapsed || mobile) ? (
                    <div className="flex items-center gap-3 rounded-xl px-2 py-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-semibold">
                            {user?.name?.[0]?.toUpperCase() ?? 'A'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="text-slate-500 hover:text-red-400 transition-colors"
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
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </Link>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex relative shrink-0">
                <Sidebar />
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-slate-300 shadow-lg border border-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-200"
                >
                    {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="relative z-10 h-full w-72">
                        <Sidebar mobile />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Topbar */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm px-4 lg:px-6">
                    <div className="flex items-center gap-3">
                        <button
                            className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu size={18} />
                        </button>
                        {title && (
                            <h1 className="text-base font-semibold text-white">{title}</h1>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/"
                            target="_blank"
                            className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors border border-slate-700"
                        >
                            View Site ↗
                        </Link>
                        <Link
                            href="/admin/messages"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                            <Bell size={16} />
                        </Link>
                        <Link
                            href="/admin/profile"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                            <User size={16} />
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
