import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import {
    ArrowLeft, MessageSquareQuote, Star, Upload, CheckCircle2,
    Save, Trash2
} from 'lucide-react';

export default function TestimonialForm({ testimonial }) {
    const isEdit = !!testimonial;
    const [form, setForm] = useState({
        author_name: testimonial?.author_name ?? '',
        author_role: testimonial?.author_role ?? '',
        company: testimonial?.company ?? '',
        content: testimonial?.content ?? testimonial?.quote ?? '',
        avatar_path: testimonial?.avatar_path ?? '',
        rating: testimonial?.rating ?? 5,
        is_featured: testimonial?.is_featured ?? true,
        sort_order: testimonial?.sort_order ?? 0,
    });

    const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(testimonial?.avatar_path ?? '');
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

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

        if (isEdit) {
            formData.append('_method', 'PUT');
            router.post(`/admin/testimonials/${testimonial.id}`, formData, {
                onError: (err) => setErrors(err),
                onFinish: () => setSubmitting(false),
            });
        } else {
            router.post('/admin/testimonials', formData, {
                onError: (err) => setErrors(err),
                onFinish: () => setSubmitting(false),
            });
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Client Story' : 'New Client Story'}>
            <Head title={isEdit ? `Edit: ${testimonial.author_name}` : 'New Client Story — Archi Texture BD Admin'} />

            <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/testimonials"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition shadow-2xs"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                                {isEdit ? `Edit Story: ${testimonial.author_name}` : 'Add New Client Story'}
                            </h1>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Link real client testimonials directly to the frontend Client Stories section.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-5 text-xs">
                        {/* Avatar photo upload */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Client Photo / Avatar (Optional)
                            </label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            {photoPreview ? (
                                <div className="flex items-center gap-4 p-3.5 rounded-2xl border border-slate-200 bg-slate-50">
                                    <img
                                        src={photoPreview}
                                        alt="Preview"
                                        className="h-16 w-16 rounded-full object-cover border border-slate-300 shadow-2xs"
                                    />
                                    <div className="space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-xs shadow-2xs hover:bg-slate-50"
                                        >
                                            Change Photo
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedPhotoFile(null);
                                                setPhotoPreview('');
                                                set('avatar_path', '');
                                            }}
                                            className="px-3.5 py-1.5 rounded-xl bg-red-50 text-red-600 font-bold text-xs hover:bg-red-100"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-300 hover:border-violet-500 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-50/50 hover:bg-violet-50/20 group"
                                >
                                    <div className="flex flex-col items-center justify-center gap-1.5">
                                        <div className="h-10 w-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                                            <Upload size={18} />
                                        </div>
                                        <span className="font-bold text-slate-800 text-xs mt-1">
                                            Click to upload client portrait
                                        </span>
                                        <span className="text-[11px] text-slate-400">
                                            PNG, JPG, WEBP up to 5MB
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Author name */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Client Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={form.author_name}
                                onChange={(e) => set('author_name', e.target.value)}
                                placeholder="e.g. Sarah Rahman"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:bg-white focus:border-violet-500 focus:outline-none"
                            />
                            {errors.author_name && <p className="text-red-500 text-xs mt-1">{errors.author_name[0]}</p>}
                        </div>

                        {/* Role and Company */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Role / Profession
                                </label>
                                <input
                                    type="text"
                                    value={form.author_role}
                                    onChange={(e) => set('author_role', e.target.value)}
                                    placeholder="e.g. Homeowner, Managing Director"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-violet-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Location / Company
                                </label>
                                <input
                                    type="text"
                                    value={form.company}
                                    onChange={(e) => set('company', e.target.value)}
                                    placeholder="e.g. Gulshan, Dhaka"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-violet-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Rating Stars */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Client Rating ({form.rating} of 5 Stars)
                            </label>
                            <div className="flex items-center gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => set('rating', star)}
                                        className="p-1 transition hover:scale-110"
                                    >
                                        <Star
                                            size={22}
                                            className={star <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                                        />
                                    </button>
                                ))}
                                <span className="ml-3 font-bold text-slate-700 text-xs">
                                    {form.rating} out of 5 Stars
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Review / Story Quote <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                required
                                rows={5}
                                value={form.content}
                                onChange={(e) => set('content', e.target.value)}
                                placeholder="Write the client's quote, testimonial, or review..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-violet-500 focus:outline-none resize-none leading-relaxed"
                            />
                            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content[0]}</p>}
                        </div>

                        {/* Featured and Sort Order */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                                <div>
                                    <span className="block font-bold text-slate-900 text-xs">Live on Homepage</span>
                                    <span className="text-[11px] text-slate-500">Show in frontend Client Stories</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.is_featured}
                                        onChange={(e) => set('is_featured', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                                </label>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Sort Order (0 = First)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.sort_order}
                                    onChange={(e) => set('sort_order', parseInt(e.target.value) || 0)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-violet-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/60">
                        <Link
                            href="/admin/testimonials"
                            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-xl bg-violet-600 hover:bg-violet-700 px-6 py-2.5 text-xs font-bold text-white transition shadow-sm shadow-violet-500/20 disabled:opacity-60 flex items-center gap-1.5"
                        >
                            <Save size={14} />
                            <span>{submitting ? 'Saving...' : isEdit ? 'Update Client Story' : 'Publish Story'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
