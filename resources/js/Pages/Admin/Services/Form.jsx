import AdminLayout from '@/Layouts/AdminLayout';
import FormLayout, { FormCard, FormField, FormInput, FormTextarea, FormToggle, ErrorBanner, SuccessBanner } from '@/Components/Admin/FormLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import api from '@/lib/api';

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

export default function ServiceForm({ service }) {
    const isEdit = !!service;
    const [form, setForm] = useState({ title: service?.title ?? '', slug: service?.slug ?? '', summary: service?.summary ?? '', description: service?.description ?? '', icon: service?.icon ?? '', sort_order: service?.sort_order ?? 0, is_active: service?.is_active ?? true });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);
    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault(); setSubmitting(true); setErrors({});
        try {
            if (isEdit) await api.patch(`/services/${service.id}`, { ...form, sort_order: Number(form.sort_order) });
            else await api.post('/services', { ...form, sort_order: Number(form.sort_order) });
            setSuccess(isEdit ? 'Service updated!' : 'Service created!');
            if (!isEdit) router.visit('/admin/services');
        } catch (err) { setErrors(err.response?.data?.errors ?? {}); } finally { setSubmitting(false); }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Service' : 'New Service'}>
            <Head title={isEdit ? 'Edit Service' : 'New Service'} />
            <FormLayout title={isEdit ? `Edit: ${service.title}` : 'Create New Service'} backHref="/admin/services" onSubmit={handleSubmit} isSubmitting={submitting}>
                <ErrorBanner errors={errors} /><SuccessBanner message={success} />
                <FormCard title="Service Details">
                    <FormField label="Title" required error={errors.title?.[0]}>
                        <FormInput value={form.title} onChange={(e) => { set('title', e.target.value); if (!isEdit) set('slug', slugify(e.target.value)); }} placeholder="Web Development" error={errors.title?.[0]} />
                    </FormField>
                    <FormField label="Slug" required error={errors.slug?.[0]}>
                        <FormInput value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="web-development" error={errors.slug?.[0]} />
                    </FormField>
                    <FormField label="Icon (emoji)" error={errors.icon?.[0]}>
                        <FormInput value={form.icon} onChange={(e) => set('icon', e.target.value)} placeholder="🌐" error={errors.icon?.[0]} />
                    </FormField>
                    <FormField label="Summary" error={errors.summary?.[0]}>
                        <FormInput value={form.summary} onChange={(e) => set('summary', e.target.value)} placeholder="Short summary..." error={errors.summary?.[0]} />
                    </FormField>
                    <FormField label="Description" error={errors.description?.[0]}>
                        <FormTextarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Full description..." rows={5} error={errors.description?.[0]} />
                    </FormField>
                    <FormField label="Sort Order">
                        <FormInput type="number" min="0" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} />
                    </FormField>
                    <FormToggle label="Active" description="Show on public site" checked={form.is_active} onChange={(v) => set('is_active', v)} />
                </FormCard>
            </FormLayout>
        </AdminLayout>
    );
}
