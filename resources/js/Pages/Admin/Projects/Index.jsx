import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, ExternalLink, Image as ImageIcon, Trash2, Edit, Search, CheckCircle2 } from 'lucide-react';

export default function ProjectsIndex({ projects = {}, categories = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const currentCategory = filters.category || '';

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            '/admin/projects',
            { search: search || undefined, category: currentCategory || undefined },
            { preserveState: true, replace: true }
        );
    };

    const handleCategoryFilter = (cat) => {
        router.get(
            '/admin/projects',
            { search: search || undefined, category: cat || undefined },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (id, title) => {
        if (confirm(`Are you sure you want to delete portfolio project "${title}"?`)) {
            router.delete(`/admin/projects/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const projectList = projects?.data || [];

    return (
        <AdminLayout title="Portfolio Projects">
            <Head title="Portfolio Projects — Admin" />

            <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Portfolio Projects
                        </h1>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <a
                            href="/portfolio"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition shadow-2xs"
                        >
                            <span>View Public Page</span>
                            <ExternalLink size={13} className="text-slate-400" />
                        </a>

                        <Link
                            href="/admin/projects/create"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 px-4 py-2 text-xs font-bold text-white transition-all shadow-sm shadow-violet-500/20"
                        >
                            <Plus size={15} strokeWidth={2.5} />
                            <span>Add Project</span>
                        </Link>
                    </div>
                </div>

                {/* Filters & Search Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs">
                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                        <button
                            type="button"
                            onClick={() => handleCategoryFilter('')}
                            className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${!currentCategory
                                    ? 'bg-violet-600 text-white shadow-2xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            All Spaces
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => handleCategoryFilter(cat)}
                                className={`rounded-xl px-3 py-1.5 text-xs font-medium whitespace-nowrap transition ${currentCategory === cat
                                        ? 'bg-violet-600 text-white shadow-2xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="relative sm:w-64 shrink-0">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search projects..."
                            className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs focus:border-violet-500 focus:ring-1 focus:ring-violet-500 bg-slate-50/50"
                        />
                    </form>
                </div>

                {/* Projects Table View */}
                <div className="rounded-2xl bg-white border border-slate-100 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="py-3.5 pl-6 pr-4">Project Preview</th>
                                    <th className="py-3.5 px-4">Room / Space</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4">Featured</th>
                                    <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {projectList.length > 0 ? (
                                    projectList.map((proj) => (
                                        <tr key={proj.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="py-4 pl-6 pr-4 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative h-12 w-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                                        {proj.featured_image ? (
                                                            <img
                                                                src={proj.featured_image}
                                                                alt={proj.title}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-slate-400">
                                                                <ImageIcon size={18} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-slate-900 block truncate max-w-xs">{proj.title}</span>
                                                        <span className="text-[11px] text-slate-400 font-mono block mt-0.5">{proj.slug}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4 align-middle">
                                                <span className="inline-flex items-center rounded-lg bg-violet-50 text-violet-700 px-2.5 py-1 text-[11px] font-semibold border border-violet-100">
                                                    {proj.category || 'General Space'}
                                                </span>
                                            </td>

                                            <td className="py-4 px-4 align-middle whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${proj.status === 'published'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {proj.status === 'published' && <CheckCircle2 size={11} className="text-emerald-600" />}
                                                    {proj.status === 'published' ? 'Active / Published' : proj.status}
                                                </span>
                                            </td>

                                            <td className="py-4 px-4 align-middle whitespace-nowrap">
                                                {proj.is_featured ? (
                                                    <span className="text-violet-600 font-bold text-xs">★ Featured</span>
                                                ) : (
                                                    <span className="text-slate-400 text-xs">—</span>
                                                )}
                                            </td>

                                            <td className="py-4 pl-4 pr-6 align-middle text-right whitespace-nowrap">
                                                <div className="inline-flex items-center gap-1.5">
                                                    <Link
                                                        href={`/admin/projects/${proj.id}/edit`}
                                                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:text-violet-600 hover:bg-slate-50 transition shadow-2xs"
                                                        title="Edit Project"
                                                    >
                                                        <Edit size={14} />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(proj.id, proj.title)}
                                                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition shadow-2xs"
                                                        title="Delete Project"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400">
                                            No portfolio projects found. Click &ldquo;Add Project&rdquo; to showcase your spatial designs.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {projects.links && projects.links.length > 3 && (
                        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-slate-500">
                                Showing {projects.from || 0} to {projects.to || 0} of {projects.total || 0} projects
                            </span>
                            <div className="flex items-center gap-1">
                                {projects.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 rounded-lg text-xs font-medium transition ${link.active
                                                ? 'bg-violet-600 text-white'
                                                : link.url
                                                    ? 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                                                    : 'text-slate-300 pointer-events-none'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
