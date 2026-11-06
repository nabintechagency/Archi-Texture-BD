import AdminLayout from '@/Layouts/AdminLayout';
import { ErrorBanner, SuccessBanner } from '@/Components/Admin/FormLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import {
    Upload,
    Layers,
    Tag,
    Star,
    ArrowLeft,
    Check,
    Wand2,
    Calendar,
    Globe,
    FileText,
    Plus,
    X,
    AlertCircle,
    Image as ImageIcon,
} from 'lucide-react';

function slugify(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

const DEFAULT_ROOMS = [
    'Living Room',
    'Bedroom',
    'Kitchen',
    'Bathroom',
    'Office',
    'Dining',
    'Commercial',
    'Outdoor',
];

export default function ProjectForm({ project, categories = [] }) {
    const isEdit = !!project;

    const availableCategories = Array.from(new Set([...DEFAULT_ROOMS, ...categories]));

    const initialGallery = Array.isArray(project?.gallery)
        ? project.gallery
        : project?.gallery ? [project.gallery] : [];

    const [form, setForm] = useState({
        title: project?.title ?? '',
        slug: project?.slug ?? '',
        category: project?.category ?? 'Living Room',
        custom_category: '',
        summary: project?.summary ?? '',
        description: project?.description ?? '',
        featured_image: project?.featured_image ?? '',
        gallery: initialGallery,
        project_url: project?.project_url ?? '',
        status: project?.status ?? 'published',
        is_featured: project?.is_featured ?? false,
        completed_at: project?.completed_at ? project.completed_at.substring(0, 10) : '',
        sort_order: project?.sort_order ?? 0,
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(project?.featured_image || '');
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [newGalleryUrl, setNewGalleryUrl] = useState('');
    const [uploadNotice, setUploadNotice] = useState(null);

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);

    const imageInputRef = useRef(null);
    const galleryInputRef = useRef(null);

    const MAX_PHOTOS = 15;
    const currentPhotoCount = (imagePreview ? 1 : 0) + form.gallery.length + galleryFiles.length;
    const remainingSlots = Math.max(0, MAX_PHOTOS - currentPhotoCount);

    const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const handleFeaturedFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!imagePreview && currentPhotoCount >= MAX_PHOTOS) {
                setUploadNotice(`Maximum limit of ${MAX_PHOTOS} photos reached.`);
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setUploadNotice(null);
        }
    };

    const handleGalleryFilesChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        if (remainingSlots <= 0) {
            setUploadNotice(`Maximum limit of ${MAX_PHOTOS} photos reached.`);
            return;
        }

        let acceptedFiles = files;
        if (files.length > remainingSlots) {
            acceptedFiles = files.slice(0, remainingSlots);
            setUploadNotice(`Photo limit is ${MAX_PHOTOS}. Only ${acceptedFiles.length} photo(s) were added because limit was reached.`);
        } else {
            setUploadNotice(null);
        }

        const newPreviews = acceptedFiles.map((file) => ({
            url: URL.createObjectURL(file),
            name: file.name,
        }));

        setGalleryFiles((prev) => [...prev, ...acceptedFiles]);
        setGalleryPreviews((prev) => [...prev, ...newPreviews]);
        if (galleryInputRef.current) galleryInputRef.current.value = '';
    };

    const handleRemoveGalleryFile = (index) => {
        setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
        setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
        setUploadNotice(null);
    };

    const handleRemoveExistingGallery = (url) => {
        setForm((prev) => ({
            ...prev,
            gallery: prev.gallery.filter((g) => g !== url),
        }));
        setUploadNotice(null);
    };

    const handleAddGalleryUrl = () => {
        if (!newGalleryUrl.trim()) return;
        if (remainingSlots <= 0) {
            setUploadNotice(`Maximum limit of ${MAX_PHOTOS} photos reached.`);
            return;
        }
        setForm((prev) => ({
            ...prev,
            gallery: [...prev.gallery, newGalleryUrl.trim()],
        }));
        setNewGalleryUrl('');
        setUploadNotice(null);
    };

    const handleRegenerateSlug = () => {
        if (form.title) {
            set('slug', slugify(form.title));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

        const effectiveCategory =
            form.category === 'CUSTOM'
                ? form.custom_category.trim()
                : form.category;

        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('slug', form.slug);
        formData.append('category', effectiveCategory);
        if (form.summary) formData.append('summary', form.summary);
        if (form.description) formData.append('description', form.description);
        if (form.featured_image) formData.append('featured_image', form.featured_image);
        if (form.project_url) formData.append('project_url', form.project_url);
        formData.append('status', form.status);
        formData.append('is_featured', form.is_featured ? '1' : '0');
        if (form.completed_at) formData.append('completed_at', form.completed_at);
        formData.append('sort_order', Number(form.sort_order || 0));

        if (imageFile) {
            formData.append('image_file', imageFile);
        }

        form.gallery.forEach((url, i) => {
            formData.append(`gallery[${i}]`, url);
        });

        galleryFiles.forEach((file, i) => {
            formData.append(`gallery_files[${i}]`, file);
        });

        if (isEdit) {
            formData.append('_method', 'PUT');
            router.post(`/admin/projects/${project.id}`, formData, {
                onError: (err) => setErrors(err),
                onSuccess: () => setSuccess('Portfolio project updated successfully!'),
                onFinish: () => setSubmitting(false),
            });
        } else {
            router.post('/admin/projects', formData, {
                onError: (err) => setErrors(err),
                onSuccess: () => setSuccess('Portfolio project created and published successfully!'),
                onFinish: () => setSubmitting(false),
            });
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}>
            <Head title={isEdit ? `Edit: ${project.title}` : 'New Project — Portfolio Showcase'} />

            <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/projects"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition shadow-2xs"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                                {isEdit ? `Edit Project: ${project.title}` : 'Add New Portfolio Project'}
                            </h1>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Set spatial specifications, direct photography upload, room categorization, and public showcase status.
                            </p>
                        </div>
                    </div>
                </div>

                <ErrorBanner errors={errors} />
                <SuccessBanner message={success} />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 1. Spatial Photography & Gallery Upload Section */}
                    <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-6">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <Upload size={16} className="text-violet-600" />
                                <h2 className="text-sm font-bold text-slate-900">Spatial Photography & Gallery</h2>
                            </div>
                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
                                currentPhotoCount >= MAX_PHOTOS
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-violet-50 text-violet-700 border-violet-200'
                            }`}>
                                {currentPhotoCount} / {MAX_PHOTOS} Photos Uploaded
                            </span>
                        </div>

                        {uploadNotice && (
                            <div className="flex items-center gap-2 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5">
                                <AlertCircle size={15} className="text-amber-600 shrink-0" />
                                <span>{uploadNotice}</span>
                            </div>
                        )}

                        {/* Primary Featured Spatial Photo */}
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Primary Featured Spatial Photo <span className="text-red-500">*</span>
                                </label>
                                <p className="text-[11px] text-slate-400 mb-2">
                                    The main cover photo presented on showcase cards and portfolio grids.
                                </p>
                            </div>

                            <input
                                type="file"
                                ref={imageInputRef}
                                accept="image/*"
                                onChange={handleFeaturedFileChange}
                                className="hidden"
                            />

                            {imagePreview ? (
                                <div className="relative h-64 max-w-md rounded-2xl border border-slate-200 overflow-hidden group bg-slate-50">
                                    <img
                                        src={imagePreview}
                                        alt="Featured spatial preview"
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => imageInputRef.current?.click()}
                                            className="px-3.5 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs shadow hover:bg-slate-50 transition"
                                        >
                                            Change Photo
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImageFile(null);
                                                setImagePreview('');
                                                set('featured_image', '');
                                            }}
                                            className="px-3.5 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow hover:bg-red-700 transition"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                                        Primary Cover Photo
                                    </span>
                                </div>
                            ) : (
                                <div
                                    onClick={() => imageInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-300 hover:border-violet-500 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-50/50 hover:bg-violet-50/20 group max-w-md"
                                >
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="h-10 w-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                                            <Upload size={20} />
                                        </div>
                                        <div>
                                            <span className="font-bold text-slate-800 text-xs block">
                                                Click to upload cover photo
                                            </span>
                                            <span className="text-[11px] text-slate-400 mt-0.5 block">
                                                PNG, JPG, WEBP up to 10MB
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                                    Or Cover Photo Web URL (External link alternative)
                                </label>
                                <input
                                    type="url"
                                    value={form.featured_image}
                                    onChange={(e) => {
                                        set('featured_image', e.target.value);
                                        if (!imageFile) setImagePreview(e.target.value);
                                    }}
                                    placeholder="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
                                    className="w-full max-w-md rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-800 font-mono focus:bg-white focus:border-violet-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Additional Gallery Photos Section (Limit: 15 Photos total) */}
                        <div className="pt-5 border-t border-slate-100 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                    <h3 className="text-xs font-bold text-slate-900">
                                        Additional Gallery Photos (Limit 15 photos in total)
                                    </h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        Upload up to {remainingSlots} more {remainingSlots === 1 ? 'photo' : 'photos'} to showcase various angles, details, and lighting of this space.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        multiple
                                        ref={galleryInputRef}
                                        accept="image/*"
                                        onChange={handleGalleryFilesChange}
                                        className="hidden"
                                        disabled={remainingSlots <= 0}
                                    />
                                    <button
                                        type="button"
                                        disabled={remainingSlots <= 0}
                                        onClick={() => galleryInputRef.current?.click()}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs transition ${
                                            remainingSlots <= 0
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                : 'bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200'
                                        }`}
                                    >
                                        <Plus size={14} />
                                        Upload Photos ({remainingSlots} left)
                                    </button>
                                </div>
                            </div>

                            {/* Or Add via URL */}
                            <div className="flex gap-2 max-w-md">
                                <input
                                    type="url"
                                    value={newGalleryUrl}
                                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                                    placeholder="Or paste an image URL..."
                                    disabled={remainingSlots <= 0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddGalleryUrl();
                                        }
                                    }}
                                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-violet-500 focus:outline-none disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddGalleryUrl}
                                    disabled={remainingSlots <= 0 || !newGalleryUrl.trim()}
                                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                                >
                                    Add URL
                                </button>
                            </div>

                            {/* Gallery Preview Grid */}
                            {(galleryPreviews.length > 0 || form.gallery.length > 0) ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                                    {/* Existing Gallery Images */}
                                    {form.gallery.map((url, idx) => (
                                        <div
                                            key={`existing-${idx}-${url}`}
                                            className="group relative aspect-4/3 rounded-xl border border-slate-200 overflow-hidden bg-slate-100"
                                        >
                                            <img
                                                src={url}
                                                alt={`Gallery photo ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <span className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                                Saved #{idx + 1}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveExistingGallery(url)}
                                                className="absolute top-1.5 right-1.5 h-6 w-6 rounded-lg bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow"
                                                title="Remove photo"
                                            >
                                                <X size={13} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Newly Uploaded Files */}
                                    {galleryPreviews.map((preview, idx) => (
                                        <div
                                            key={`new-${idx}-${preview.url}`}
                                            className="group relative aspect-4/3 rounded-xl border-2 border-violet-200 overflow-hidden bg-violet-50/30"
                                        >
                                            <img
                                                src={preview.url}
                                                alt={preview.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <span className="absolute top-1.5 left-1.5 bg-violet-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                                                New #{idx + 1}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveGalleryFile(idx)}
                                                className="absolute top-1.5 right-1.5 h-6 w-6 rounded-lg bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow"
                                                title="Remove photo"
                                            >
                                                <X size={13} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center bg-slate-50/40">
                                    <p className="text-xs text-slate-400">
                                        No additional gallery photos added yet. You can upload up to {remainingSlots} more photos.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 2. Spatial Category & Room Type */}
                    <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-5">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                            <Tag size={16} className="text-violet-600" />
                            <h2 className="text-sm font-bold text-slate-900">Spatial Category & Room Type</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Room / Space Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={availableCategories.includes(form.category) ? form.category : 'CUSTOM'}
                                    onChange={(e) => {
                                        if (e.target.value === 'CUSTOM') {
                                            set('category', 'CUSTOM');
                                        } else {
                                            set('category', e.target.value);
                                        }
                                    }}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition"
                                >
                                    {availableCategories.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                    <option value="CUSTOM">+ Add New Custom Room / Space...</option>
                                </select>
                            </div>

                            {form.category === 'CUSTOM' ? (
                                <div>
                                    <label className="block text-xs font-semibold text-violet-700 mb-1.5">
                                        Type New Custom Space Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.custom_category}
                                        onChange={(e) => set('custom_category', e.target.value)}
                                        placeholder="e.g. Penthouse Terrace, Wine Cellar"
                                        className="w-full rounded-xl border border-violet-300 bg-violet-50/30 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-violet-600 focus:outline-none"
                                        autoFocus
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <Globe size={13} className="text-slate-400" />
                                        Project Website / Live Tour URL (Optional)
                                    </label>
                                    <input
                                        type="url"
                                        value={form.project_url}
                                        onChange={(e) => set('project_url', e.target.value)}
                                        placeholder="https://architexturebd.com/showcase/project"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:border-violet-500 focus:outline-none"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Quick Selection Pills */}
                        <div>
                            <span className="block text-[11px] font-semibold text-slate-500 mb-2">
                                Popular Room Types:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {DEFAULT_ROOMS.map((room) => (
                                    <button
                                        key={room}
                                        type="button"
                                        onClick={() => set('category', room)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                                            form.category === room
                                                ? 'bg-violet-600 text-white font-semibold shadow-xs'
                                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                        }`}
                                    >
                                        {room}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 3. Project Identity & Architectural Story */}
                    <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                            <Layers size={16} className="text-violet-600" />
                            <h2 className="text-sm font-bold text-slate-900">Project Identity & Architectural Concept</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Project Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.title}
                                    onChange={(e) => {
                                        set('title', e.target.value);
                                        if (!isEdit) set('slug', slugify(e.target.value));
                                    }}
                                    placeholder="e.g. Nordic Minimalist Living Room"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:bg-white focus:border-violet-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    URL Slug <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        required
                                        value={form.slug}
                                        onChange={(e) => set('slug', e.target.value)}
                                        placeholder="nordic-minimalist-living-room"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-mono focus:bg-white focus:border-violet-500 focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRegenerateSlug}
                                        className="shrink-0 rounded-xl bg-violet-50 border border-violet-200 px-3 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-100 transition flex items-center gap-1.5"
                                        title="Sync slug with title"
                                    >
                                        <Wand2 size={13} />
                                        <span>Sync</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                                <span>Summary & Mood Concept</span>
                                <span className="text-[11px] text-slate-400 font-normal">Shown on portfolio hover card</span>
                            </label>
                            <input
                                type="text"
                                value={form.summary}
                                onChange={(e) => set('summary', e.target.value)}
                                placeholder="e.g. Warm oak paneling, tactile boucle textures, and soft diffuse perimeter lighting."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:border-violet-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                <FileText size={13} className="text-slate-400" />
                                Full Architectural Description
                            </label>
                            <textarea
                                rows={4}
                                value={form.description}
                                onChange={(e) => set('description', e.target.value)}
                                placeholder="Provide comprehensive details about spatial layout, material palette, custom millwork, procurement, and lighting integration..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:border-violet-500 focus:outline-none leading-relaxed"
                            />
                        </div>
                    </div>

                    {/* 4. Visibility, Showcase & Publishing Options */}
                    <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                            <Star size={16} className="text-violet-600" />
                            <h2 className="text-sm font-bold text-slate-900">Showcase & Visibility Options</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Project Status
                                </label>
                                <select
                                    value={form.status}
                                    onChange={(e) => set('status', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:bg-white focus:border-violet-500 focus:outline-none"
                                >
                                    <option value="published">Active / Published (Live)</option>
                                    <option value="draft">Draft (Hidden)</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                    <Calendar size={13} className="text-slate-400" />
                                    Completion Date
                                </label>
                                <input
                                    type="date"
                                    value={form.completed_at}
                                    onChange={(e) => set('completed_at', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:border-violet-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Sort Order
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.sort_order}
                                    onChange={(e) => set('sort_order', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-mono font-bold focus:bg-white focus:border-violet-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Featured Project Showcase Card */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50/70 border border-amber-200 mt-2">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                                    <Star size={17} className={form.is_featured ? 'fill-amber-600 text-amber-600' : 'text-amber-600'} />
                                </div>
                                <div>
                                    <span className="block font-bold text-slate-900 text-xs">Featured Portfolio Project</span>
                                    <span className="text-[11px] text-slate-500">Highlight this project in featured carousel and hero galleries</span>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.is_featured}
                                    onChange={(e) => set('is_featured', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                            </label>
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/60">
                        <Link
                            href="/admin/projects"
                            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-xl bg-violet-600 hover:bg-violet-700 px-6 py-2.5 text-xs font-bold text-white transition shadow-sm shadow-violet-500/20 disabled:opacity-60 flex items-center gap-1.5"
                        >
                            <Check size={15} />
                            <span>{submitting ? 'Saving Project...' : isEdit ? 'Update Project' : 'Publish Project'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
