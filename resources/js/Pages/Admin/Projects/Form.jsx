import AdminLayout from '@/Layouts/AdminLayout';
import FormLayout, {
    FormCard, FormField, FormInput, FormTextarea, FormSelect, FormToggle, ErrorBanner, SuccessBanner,
} from '@/Components/Admin/FormLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles } from 'lucide-react';

function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const DEFAULT_ROOMS = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office', 'Dining', 'Commercial', 'Outdoor'];

export default function ProjectForm({ project, categories = [] }) {
    const isEdit = !!project;

    const availableCategories = Array.from(new Set([...DEFAULT_ROOMS, ...categories]));

    const [form, setForm] = useState({
        title: project?.title ?? '',
        slug: project?.slug ?? '',
        category: project?.category ?? 'Living Room',
        custom_category: '',
        summary: project?.summary ?? '',
        description: project?.description ?? '',
        featured_image: project?.featured_image ?? '',
        project_url: project?.project_url ?? '',
        status: project?.status ?? 'published', // Always active / published by default for new portfolio
        is_featured: project?.is_featured ?? false,
        completed_at: project?.completed_at ? project.completed_at.substring(0, 10) : '',
        sort_order: project?.sort_order ?? 0,
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(project?.featured_image || '');
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);

    const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

        const effectiveCategory = form.category === 'CUSTOM'
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
        <AdminLayout title={isEdit ? 'Edit Portfolio Project' : 'New Portfolio Project'}>
            <Head title={isEdit ? 'Edit Portfolio Project' : 'New Portfolio Project'} />
            <FormLayout
                title={isEdit ? `Edit: ${project.title}` : 'Add Portfolio Showcase'}
                backHref="/admin/projects"
                onSubmit={handleSubmit}
                isSubmitting={submitting}
            >
                <ErrorBanner errors={errors} />
                <SuccessBanner message={success} />

                {/* Spatial Category & Identity */}
                <FormCard title="Spatial Category & Information">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField label="Room / Spatial Category" required error={errors.category?.[0]}>
                            <FormSelect
                                value={form.category}
                                onChange={(e) => set('category', e.target.value)}
                            >
                                {availableCategories.map((room) => (
                                    <option key={room} value={room}>{room}</option>
                                ))}
                                <option value="CUSTOM">+ Add Custom Room / Space...</option>
                            </FormSelect>
                        </FormField>

                        {form.category === 'CUSTOM' && (
                            <FormField label="Custom Space Name" required error={errors.category?.[0]}>
                                <FormInput
                                    value={form.custom_category}
                                    onChange={(e) => set('custom_category', e.target.value)}
                                    placeholder="e.g. Penthouse Terrace, Wine Cellar"
                                    error={errors.category?.[0]}
                                    autoFocus
                                />
                            </FormField>
                        )}
                    </div>

                    <FormField label="Project Title" required error={errors.title?.[0]}>
                        <FormInput
                            value={form.title}
                            onChange={(e) => {
                                set('title', e.target.value);
                                if (!isEdit) set('slug', slugify(e.target.value));
                            }}
                            placeholder="e.g. Nordic Minimalist Living Room"
                            error={errors.title?.[0]}
                        />
                    </FormField>

                    <FormField label="URL Slug" required error={errors.slug?.[0]}>
                        <FormInput
                            value={form.slug}
                            onChange={(e) => set('slug', e.target.value)}
                            placeholder="nordic-minimalist-living-room"
                            error={errors.slug?.[0]}
                        />
                    </FormField>

                    <FormField label="Summary & Mood Concept" hint="Shown on portfolio hover card & preview" error={errors.summary?.[0]}>
                        <FormInput
                            value={form.summary}
                            onChange={(e) => set('summary', e.target.value)}
                            placeholder="e.g. Warm oak paneling, boucle textures, and soft diffuse perimeter lighting."
                            error={errors.summary?.[0]}
                        />
                    </FormField>

                    <FormField label="Full Architectural Description" error={errors.description?.[0]}>
                        <FormTextarea
                            value={form.description}
                            onChange={(e) => set('description', e.target.value)}
                            rows={4}
                            placeholder="Provide details about spatial flow, materials used, lighting integration, and bespoke craftsmanship..."
                            error={errors.description?.[0]}
                        />
                    </FormField>
                </FormCard>

                {/* Photography & Imagery */}
                <FormCard title="Photography & Showcase Imagery">
                    <FormField label="Upload Spatial Image" error={errors.image_file?.[0]}>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <label className="flex flex-col items-center justify-center w-full sm:w-64 h-32 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
                                    <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
                                    <p className="text-xs font-semibold">Click to upload photo</p>
                                    <p className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 10MB</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>

                            {imagePreview ? (
                                <div className="relative h-32 w-48 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                                    <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-full font-medium">
                                        Live Preview
                                    </span>
                                </div>
                            ) : (
                                <div className="h-32 w-48 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400">
                                    <ImageIcon size={24} />
                                    <span className="text-[10px] mt-1">No image selected</span>
                                </div>
                            )}
                        </div>
                    </FormField>

                    <FormField label="Or Image Web URL" hint="Direct link to image if hosted externally" error={errors.featured_image?.[0]}>
                        <FormInput
                            value={form.featured_image}
                            onChange={(e) => {
                                set('featured_image', e.target.value);
                                if (!imageFile) setImagePreview(e.target.value);
                            }}
                            placeholder="https://images.unsplash.com/photo-..."
                            error={errors.featured_image?.[0]}
                        />
                    </FormField>
                </FormCard>

                {/* Status & Visibility */}
                <FormCard title="Status & Publishing">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField label="Status" required hint="New projects are set to Active by default" error={errors.status?.[0]}>
                            <FormSelect value={form.status} onChange={(e) => set('status', e.target.value)}>
                                <option value="published">Active / Published (Live on Website)</option>
                                <option value="draft">Draft (Hidden)</option>
                                <option value="archived">Archived</option>
                            </FormSelect>
                        </FormField>

                        <FormField label="Completion Date" error={errors.completed_at?.[0]}>
                            <FormInput
                                type="date"
                                value={form.completed_at}
                                onChange={(e) => set('completed_at', e.target.value)}
                                error={errors.completed_at?.[0]}
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField label="Sort Order" error={errors.sort_order?.[0]}>
                            <FormInput
                                type="number"
                                value={form.sort_order}
                                onChange={(e) => set('sort_order', e.target.value)}
                                min="0"
                                error={errors.sort_order?.[0]}
                            />
                        </FormField>
                    </div>

                    <FormToggle
                        label="Featured on Homepage & Highlights"
                        description="Prioritize this space in featured hero carousels and highlight sections"
                        checked={form.is_featured}
                        onChange={(v) => set('is_featured', v)}
                    />
                </FormCard>
            </FormLayout>
        </AdminLayout>
    );
}
