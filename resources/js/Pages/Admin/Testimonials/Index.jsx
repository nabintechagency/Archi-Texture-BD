import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import {
    MessageSquareQuote, Plus, Search, Star, Trash2, Edit,
    ExternalLink, Upload, Check, AlertCircle, LayoutGrid, List,
    User, Sparkles, Eye, CheckCircle2, XCircle
} from 'lucide-react';

export default function TestimonialsIndex({ testimonials, stats = {}, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
    const [modalOpen, setModalOpen] = useState(false);
    const [editingStory, setEditingStory] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Form states
    const [form, setForm] = useState({
        author_name: '',
        author_role: '',
        company: '',
        content: '',
        rating: 5,
        is_featured: true,
        sort_order: 0,
        avatar_path: '',
    });
    const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState('');
    const fileInputRef = useRef(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/testimonials', { search }, { preserveState: true, replace: true });
    };

    const handleToggleFeatured = (item) => {
        router.patch(`/admin/testimonials/${item.id}/toggle-featured`, {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (item) => {
        if (confirm(`Are you sure you want to delete the client story by "${item.author_name}"? This action cannot be undone.`)) {
            router.delete(`/admin/testimonials/${item.id}`, {
                preserveScroll: true,
            });
        }
    };

    const openAddModal = () => {
        setEditingStory(null);
        setForm({
            author_name: '',
            author_role: '',
            company: '',
            content: '',
            rating: 5,
            is_featured: true,
            sort_order: 0,
            avatar_path: '',
        });
        setSelectedPhotoFile(null);
        setPhotoPreview('');
        setFormErrors({});
        setModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingStory(item);
        setForm({
            author_name: item.author_name || '',
            author_role: item.author_role || '',
            company: item.company || '',
            content: item.content || item.quote || '',
            rating: item.rating ?? 5,
            is_featured: Boolean(item.is_featured),
            sort_order: item.sort_order ?? 0,
            avatar_path: item.avatar_path || '',
        });
        setSelectedPhotoFile(null);
        setPhotoPreview(item.avatar_path || '');
        setFormErrors({});
        setModalOpen(true);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        setSaving(true);
        setFormErrors({});

        const formData = new FormData();
        formData.append('author_name', form.author_name);
        formData.append('author_role', form.author_role || '');
        formData.append('company', form.company || '');
        formData.append('content', form.content);
        formData.append('rating', form.rating);
        formData.append('is_featured', form.is_featured ? '1' : '0');
        formData.append('sort_order', form.sort_order || 0);

        if (form.avatar_path) {
            formData.append('avatar_path', form.avatar_path);
        }
        if (selectedPhotoFile) {
            formData.append('avatar_file', selectedPhotoFile);
        }

        if (editingStory) {
            formData.append('_method', 'PUT');
            router.post(`/admin/testimonials/${editingStory.id}`, formData, {
                preserveScroll: true,
                onSuccess: () => setModalOpen(false),
                onError: (err) => setFormErrors(err),
                onFinish: () => setSaving(false),
            });
        } else {
            router.post('/admin/testimonials', formData, {
                preserveScroll: true,
                onSuccess: () => setModalOpen(false),
                onError: (err) => setFormErrors(err),
                onFinish: () => setSaving(false),
            });
        }
    };

    return (
        <AdminLayout title="Client Stories">
            <Head title="Client Stories — Archi Texture BD Admin" />

            <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
                {/* 1. Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Client Stories
                        </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* View Switcher */}
                        <div className="inline-flex rounded-xl bg-white border border-slate-200 p-1 shadow-2xs">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                    viewMode === 'grid'
                                        ? 'bg-violet-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <LayoutGrid size={14} />
                                <span>Cards Grid</span>
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                    viewMode === 'table'
                                        ? 'bg-violet-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <List size={14} />
                                <span>Table View</span>
                            </button>
                        </div>

                        {/* Add Story Button */}
                        <button
                            type="button"
                            onClick={openAddModal}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 px-4 py-2 text-xs font-bold text-white transition-all shadow-sm shadow-violet-500/20"
                        >
                            <Plus size={15} strokeWidth={2.5} />
                            <span>Add Client Story</span>
                        </button>
                    </div>
                </div>

                {/* 2. Top Metric KPI Row */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-xs">
                        <span className="text-xs font-medium text-slate-500 block">Total Client Stories</span>
                        <div className="mt-1.5 text-2xl font-extrabold text-slate-900 tracking-tight">
                            {stats.total ?? testimonials.total ?? 0}
                        </div>
                        <span className="text-[11px] text-slate-400 mt-1 block">Reviews in database</span>
                    </div>

                    <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-xs">
                        <span className="text-xs font-medium text-emerald-600 block flex items-center justify-between">
                            Live on Homepage
                            <CheckCircle2 size={13} className="text-emerald-500" />
                        </span>
                        <div className="mt-1.5 text-2xl font-extrabold text-emerald-600 tracking-tight">
                            {stats.featured ?? 0}
                        </div>
                        <span className="text-[11px] text-slate-400 mt-1 block">Visible in Client Stories section</span>
                    </div>

                    <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-xs">
                        <span className="text-xs font-medium text-amber-700 block flex items-center justify-between">
                            Average Rating
                            <Star size={13} className="fill-amber-500 text-amber-500" />
                        </span>
                        <div className="mt-1.5 text-2xl font-extrabold text-amber-600 tracking-tight flex items-center gap-1.5">
                            <span>{stats.avg_rating ?? '5.0'}</span>
                            <span className="text-xs text-amber-500 font-normal">/ 5.0</span>
                        </div>
                        <span className="text-[11px] text-slate-400 mt-1 block">Client satisfaction score</span>
                    </div>

                    <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-xs">
                        <span className="text-xs font-medium text-slate-500 block">With Client Photos</span>
                        <div className="mt-1.5 text-2xl font-extrabold text-slate-900 tracking-tight">
                            {stats.with_photo ?? 0}
                        </div>
                        <span className="text-[11px] text-slate-400 mt-1 block">Verified avatar pictures</span>
                    </div>
                </div>

                {/* 3. Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-96">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search client by name, role, company or quote..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/10 transition shadow-2xs"
                        />
                    </form>

                    {search && (
                        <button
                            onClick={() => {
                                setSearch('');
                                router.get('/admin/testimonials');
                            }}
                            className="text-xs font-semibold text-violet-600 hover:text-violet-800"
                        >
                            Clear search
                        </button>
                    )}
                </div>

                {/* 4. Stories View */}
                {viewMode === 'grid' ? (
                    /* Cards Grid View */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {testimonials.data?.length > 0 ? (
                            testimonials.data.map((item) => (
                                <div
                                    key={item.id}
                                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition"
                                >
                                    <div>
                                        {/* Top Star Rating & Featured Status Pill */}
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            <div className="flex items-center gap-0.5 text-amber-500">
                                                {Array.from({ length: item.rating || 5 }).map((_, i) => (
                                                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                                                ))}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleToggleFeatured(item)}
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition shadow-2xs ${
                                                    item.is_featured
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                                        : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200'
                                                }`}
                                                title={item.is_featured ? 'Click to hide from homepage' : 'Click to show on homepage'}
                                            >
                                                {item.is_featured ? (
                                                    <>
                                                        <CheckCircle2 size={11} className="text-emerald-600" />
                                                        <span>Live on Homepage</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle size={11} className="text-slate-400" />
                                                        <span>Hidden</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {/* Quote Text */}
                                        <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed italic line-clamp-4 mb-4">
                                            &ldquo;{item.content || item.quote}&rdquo;
                                        </p>
                                    </div>

                                    {/* Author Info & Actions Footer */}
                                    <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            {item.avatar_path ? (
                                                <img
                                                    src={item.avatar_path}
                                                    alt={item.author_name}
                                                    className="h-9 w-9 rounded-full object-cover border border-slate-200 shrink-0"
                                                />
                                            ) : (
                                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-700 font-bold text-xs shrink-0">
                                                    {item.author_name ? item.author_name[0] : 'C'}
                                                </span>
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-slate-900 truncate">
                                                    {item.author_name}
                                                </p>
                                                <p className="text-[11px] text-slate-400 truncate">
                                                    {[item.author_role, item.company].filter(Boolean).join(' · ') || 'Verified Client'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => openEditModal(item)}
                                                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:text-violet-600 hover:bg-slate-50 transition shadow-2xs"
                                                title="Edit Client Story"
                                            >
                                                <Edit size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(item)}
                                                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition shadow-2xs"
                                                title="Delete Story"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-100 p-8">
                                <MessageSquareQuote className="mx-auto text-slate-300 mb-2" size={32} />
                                <p className="text-sm font-semibold text-slate-700">No client stories found.</p>
                                <p className="text-xs text-slate-400 mt-1">Click "Add Client Story" to create your first client review.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Table View */
                    <div className="rounded-2xl bg-white border border-slate-100 shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="py-3.5 pl-6 pr-4">Client</th>
                                        <th className="py-3.5 px-4">Story & Quote</th>
                                        <th className="py-3.5 px-4">Rating</th>
                                        <th className="py-3.5 px-4">Homepage Status</th>
                                        <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {testimonials.data?.length > 0 ? (
                                        testimonials.data.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="py-4 pl-6 pr-4 align-middle">
                                                    <div className="flex items-center gap-3">
                                                        {item.avatar_path ? (
                                                            <img
                                                                src={item.avatar_path}
                                                                alt={item.author_name}
                                                                className="h-10 w-10 rounded-full object-cover border border-slate-200 shrink-0"
                                                            />
                                                        ) : (
                                                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-700 font-bold text-xs shrink-0">
                                                                {item.author_name ? item.author_name[0] : 'C'}
                                                            </span>
                                                        )}
                                                        <div>
                                                            <span className="font-bold text-slate-900 block">{item.author_name}</span>
                                                            <span className="text-[11px] text-slate-400">
                                                                {[item.author_role, item.company].filter(Boolean).join(' · ')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-4 px-4 align-middle max-w-md">
                                                    <p className="text-xs text-slate-700 italic line-clamp-2">
                                                        &ldquo;{item.content || item.quote}&rdquo;
                                                    </p>
                                                </td>

                                                <td className="py-4 px-4 align-middle whitespace-nowrap">
                                                    <div className="flex items-center gap-0.5 text-amber-500">
                                                        {Array.from({ length: item.rating || 5 }).map((_, i) => (
                                                            <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                                                        ))}
                                                    </div>
                                                </td>

                                                <td className="py-4 px-4 align-middle whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleFeatured(item)}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition shadow-2xs ${
                                                            item.is_featured
                                                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                                                                : 'bg-slate-100 text-slate-500 border border-slate-200/60 hover:bg-emerald-50 hover:text-emerald-700'
                                                        }`}
                                                        title={item.is_featured ? 'Click to hide from homepage' : 'Click to show on homepage'}
                                                    >
                                                        {item.is_featured ? (
                                                            <>
                                                                <CheckCircle2 size={12} className="text-emerald-600" />
                                                                <span>Live on Homepage</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle size={12} className="text-slate-400" />
                                                                <span>Hidden</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </td>

                                                <td className="py-4 pl-4 pr-6 align-middle text-right whitespace-nowrap">
                                                    <div className="inline-flex items-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditModal(item)}
                                                            className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:text-violet-600 hover:bg-slate-50 transition shadow-2xs"
                                                            title="Edit"
                                                        >
                                                            <Edit size={14} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(item)}
                                                            className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition shadow-2xs"
                                                            title="Delete"
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
                                                No client stories found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {testimonials.links && testimonials.links.length > 3 && (
                    <div className="flex items-center justify-center gap-1.5 pt-4">
                        {testimonials.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                                    link.active
                                        ? 'bg-violet-600 text-white font-bold shadow-xs'
                                        : link.url
                                        ? 'text-slate-600 hover:bg-slate-100'
                                        : 'text-slate-300 cursor-not-allowed'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* 5. Quick Add / Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setModalOpen(false)} />
                    <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">
                                {editingStory ? `Edit Client Story: ${editingStory.author_name}` : 'Add New Client Story'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4 text-xs">
                            {/* Photo Upload Area */}
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1.5">
                                    Client Photo / Avatar
                                </label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />

                                {photoPreview ? (
                                    <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50">
                                        <img
                                            src={photoPreview}
                                            alt="Preview"
                                            className="h-16 w-16 rounded-full object-cover border border-slate-300 shadow-xs"
                                        />
                                        <div className="space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-xs shadow-2xs hover:bg-slate-50"
                                            >
                                                Change Photo
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPhotoFile(null);
                                                    setPhotoPreview('');
                                                    setForm(prev => ({ ...prev, avatar_path: '' }));
                                                }}
                                                className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 font-bold text-xs hover:bg-red-100"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-slate-300 hover:border-violet-500 rounded-2xl p-4 text-center cursor-pointer transition bg-slate-50/50 hover:bg-violet-50/20 group"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-1">
                                            <div className="h-9 w-9 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                                                <Upload size={16} />
                                            </div>
                                            <span className="font-bold text-slate-800 text-xs">
                                                Click to upload client avatar
                                            </span>
                                            <span className="text-[11px] text-slate-400">
                                                PNG, JPG, WEBP up to 5MB (Optional)
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Author Name */}
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Client Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.author_name}
                                    onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                                    placeholder="e.g. Sarah Rahman"
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                                />
                                {formErrors.author_name && <p className="text-red-500 mt-1">{formErrors.author_name[0]}</p>}
                            </div>

                            {/* Author Role and Company */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Role / Profession</label>
                                    <input
                                        type="text"
                                        value={form.author_role}
                                        onChange={(e) => setForm({ ...form, author_role: e.target.value })}
                                        placeholder="e.g. Homeowner, Architect"
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Company / Location</label>
                                    <input
                                        type="text"
                                        value={form.company}
                                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                                        placeholder="e.g. Gulshan, Dhaka"
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                                    />
                                </div>
                            </div>

                            {/* Rating Selector */}
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1.5">
                                    Rating ({form.rating} out of 5 Stars)
                                </label>
                                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setForm({ ...form, rating: star })}
                                            className="p-1 transition hover:scale-110"
                                        >
                                            <Star
                                                size={20}
                                                className={star <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                                            />
                                        </button>
                                    ))}
                                    <span className="ml-2 font-bold text-slate-700 text-xs">
                                        {form.rating} Stars
                                    </span>
                                </div>
                            </div>

                            {/* Content / Quote Textarea */}
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Client Story / Testimonial Quote <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    placeholder="Write the client's review, quote, or experience..."
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-violet-500 resize-none leading-relaxed"
                                />
                                {formErrors.content && <p className="text-red-500 mt-1">{formErrors.content[0]}</p>}
                            </div>

                            {/* Live Toggle */}
                            <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                                        <CheckCircle2 size={16} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <span className="block font-bold text-slate-900 text-xs">Feature on Homepage</span>
                                        <span className="text-[11px] text-slate-500">Display in the "Client Stories" section on the front page</span>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.is_featured}
                                        onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                                </label>
                            </div>

                            {/* Sort Order */}
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Display Sort Order</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.sort_order}
                                    onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                                    placeholder="0"
                                    className="w-32 rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                                />
                            </div>

                            {/* Submit buttons */}
                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-violet-600 hover:bg-violet-700 px-5 py-2 text-xs font-bold text-white transition shadow-sm disabled:opacity-60 flex items-center gap-1.5"
                                >
                                    {saving ? 'Saving...' : editingStory ? 'Update Story' : 'Publish Client Story'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
