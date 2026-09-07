import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import {
    FolderKanban, Zap, Briefcase, ClipboardList, GraduationCap,
    Award, Star, FileText, Image, MessageSquare, Settings, TrendingUp,
    SlidersHorizontal, Package,
} from 'lucide-react';

const statCards = [
    { key: 'projects',       label: 'Projects',        icon: FolderKanban, href: '/admin/projects',      color: 'from-indigo-500 to-indigo-600' },
    { key: 'skills',         label: 'Skills',          icon: Zap,          href: '/admin/skills',         color: 'from-violet-500 to-violet-600' },
    { key: 'services',       label: 'Services',        icon: Briefcase,    href: '/admin/services',       color: 'from-sky-500 to-sky-600' },
    { key: 'sliders',        label: 'Sliders',         icon: SlidersHorizontal, href: '/admin/sliders',  color: 'from-cyan-500 to-cyan-600' },
    { key: 'products',       label: 'Products',        icon: Package,      href: '/admin/products',       color: 'from-fuchsia-500 to-fuchsia-600' },
    { key: 'experiences',    label: 'Experience',      icon: ClipboardList,href: '/admin/experience',     color: 'from-teal-500 to-teal-600' },
    { key: 'education',      label: 'Education',       icon: GraduationCap,href: '/admin/education',      color: 'from-emerald-500 to-emerald-600' },
    { key: 'certifications', label: 'Certifications',  icon: Award,        href: '/admin/certifications', color: 'from-amber-500 to-amber-600' },
    { key: 'testimonials',   label: 'Testimonials',    icon: Star,         href: '/admin/testimonials',   color: 'from-orange-500 to-orange-600' },
    { key: 'blog_posts',     label: 'Blog Posts',      icon: FileText,     href: '/admin/blog',           color: 'from-pink-500 to-pink-600' },
    { key: 'media',          label: 'Media Files',     icon: Image,        href: '/admin/media',          color: 'from-rose-500 to-rose-600' },
    { key: 'messages',       label: 'Messages',        icon: MessageSquare,href: '/admin/messages',       color: 'from-red-500 to-red-600', badge: 'unread_messages' },
    { key: 'settings',       label: 'Settings',        icon: Settings,     href: '/admin/settings',       color: 'from-slate-500 to-slate-600' },
];

const quickLinks = [
    { label: 'Add Project',       href: '/admin/projects/create' },
    { label: 'Add Product',       href: '/admin/products/create' },
    { label: 'Add Slide',         href: '/admin/sliders/create' },
    { label: 'Add Blog Post',     href: '/admin/blog/create' },
    { label: 'Add Skill',         href: '/admin/skills/create' },
    { label: 'View Messages',     href: '/admin/messages' },
    { label: 'Manage Settings',   href: '/admin/settings' },
    { label: 'View Public Site',  href: '/', external: true },
];

export default function Dashboard({ stats }) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            <div className="p-6 lg:p-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Welcome back! 👋</h2>
                        <p className="text-slate-400 text-sm mt-1">Here's an overview of your portfolio content.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <TrendingUp size={16} className="text-indigo-400" />
                        <span>Content Overview</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {statCards.map(({ key, label, icon: Icon, href, color, badge }) => (
                        <Link
                            key={key}
                            href={href}
                            className="group relative overflow-hidden rounded-2xl bg-slate-800/50 border border-slate-700/50 p-4 hover:border-slate-600 hover:bg-slate-800 transition-all duration-200"
                        >
                            <div className={`inline-flex rounded-xl bg-gradient-to-br ${color} p-2.5 mb-3 shadow-lg`}>
                                <Icon size={18} className="text-white" />
                            </div>
                            <p className="text-2xl font-bold text-white">{stats[key] ?? 0}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
                            {badge && stats[badge] > 0 && (
                                <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                    {stats[badge]}
                                </span>
                            )}
                            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                    ))}
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {quickLinks.map(({ label, href, external }) => (
                            <Link
                                key={href}
                                href={href}
                                target={external ? '_blank' : undefined}
                                className="flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800/30 px-3 py-3 text-xs font-medium text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300 transition-all duration-200 text-center"
                            >
                                {label}
                                {external && <span className="ml-1 opacity-60">↗</span>}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Message Alert */}
                {stats.unread_messages > 0 && (
                    <Link
                        href="/admin/messages"
                        className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300 hover:border-red-500/50 hover:bg-red-500/15 transition-all"
                    >
                        <MessageSquare size={20} className="shrink-0" />
                        <div>
                            <p className="font-semibold text-sm">You have {stats.unread_messages} unread message{stats.unread_messages !== 1 ? 's' : ''}!</p>
                            <p className="text-xs text-red-400/70 mt-0.5">Click here to view your inbox</p>
                        </div>
                    </Link>
                )}
            </div>
        </AdminLayout>
    );
}
