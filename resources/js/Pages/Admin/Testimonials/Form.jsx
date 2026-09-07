import AdminLayout from '@/Layouts/AdminLayout';
import FormLayout, { FormCard, FormField, FormInput, FormTextarea, FormToggle, ErrorBanner, SuccessBanner } from '@/Components/Admin/FormLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import api from '@/lib/api';

export default function TestimonialForm({ testimonial }) {
    const isEdit = !!testimonial;
    const [form, setForm] = useState({ author_name: testimonial?.author_name ?? '', author_role: testimonial?.author_role ?? '', company: testimonial?.company ?? '', content: testimonial?.content ?? '', avatar_path: testimonial?.avatar_path ?? '', rating: testimonial?.rating ?? 5, is_featured: testimonial?.is_featured ?? false, sort_order: testimonial?.sort_order ?? 0 });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);
    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault(); setSubmitting(true); setErrors({});
        try {
            if (isEdit) await api.patch(`/testimonials/${testimonial.id}`, { ...form, sort_order: Number(form.sort_order), rating: Number(form.rating) });
            else await api.post('/testimonials', { ...form, sort_order: Number(form.sort_order), rating: Number(form.rating) });
            setSuccess(isEdit ? 'Updated!' : 'Created!');
            if (!isEdit) router.visit('/admin/testimonials');
        } catch (err) { setErrors(err.response?.data?.errors ?? {}); } finally { setSubmitting(false); }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Testimonial' : 'New Testimonial'}>
            <Head title={isEdit ? 'Edit Testimonial' : 'New Testimonial'} />
            <FormLayout title={isEdit ? `Edit: ${testimonial.author_name}` : 'Add Testimonial'} backHref="/admin/testimonials" onSubmit={handleSubmit} isSubmitting={submitting}>
                <ErrorBanner errors={errors} /><SuccessBanner message={success} />
                <FormCard title="Testimonial Details">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Author Name" required error={errors.author_name?.[0]}>
                            <FormInput value={form.author_name} onChange={(e) => set('author_name', e.target.value)} placeholder="Jane Doe" error={errors.author_name?.[0]} />
                        </FormField>
                        <FormField label="Author Role" error={errors.author_role?.[0]}>
                            <FormInput value={form.author_role} onChange={(e) => set('author_role', e.target.value)} placeholder="CEO" error={errors.author_role?.[0]} />
                        </FormField>
                        <FormField label="Company" error={errors.company?.[0]}>
                            <FormInput value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Tech Corp" error={errors.company?.[0]} />
                        </FormField>
                        <FormField label="Rating (1-5)" error={errors.rating?.[0]}>
                            <FormInput type="number" min="1" max="5" value={form.rating} onChange={(e) => set('rating', e.target.value)} error={errors.rating?.[0]} />
                        </FormField>
                    </div>
                    <FormField label="Content" required error={errors.content?.[0]}>
                        <FormTextarea value={form.content} onChange={(e) => set('content', e.target.value)} rows={4} placeholder="Their feedback..." error={errors.content?.[0]} />
                    </FormField>
                    <FormField label="Avatar Image Path" error={errors.avatar_path?.[0]}>
                        <FormInput value={form.avatar_path} onChange={(e) => set('avatar_path', e.target.value)} placeholder="/storage/..." error={errors.avatar_path?.[0]} />
                    </FormField>
                    <FormField label="Sort Order">
                        <FormInput type="number" min="0" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} />
                    </FormField>
                    <FormToggle label="Featured" description="Show on public homepage" checked={form.is_featured} onChange={(v) => set('is_featured', v)} />
                </FormCard>
            </FormLayout>
        </AdminLayout>
    );
}
