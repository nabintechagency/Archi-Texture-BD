import AdminLayout from '@/Layouts/AdminLayout';
import FormLayout, { FormCard, FormField, FormInput, FormTextarea, ErrorBanner, SuccessBanner } from '@/Components/Admin/FormLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import api from '@/lib/api';

export default function EducationForm({ education }) {
    const isEdit = !!education;
    const [form, setForm] = useState({ institution: education?.institution ?? '', degree: education?.degree ?? '', field_of_study: education?.field_of_study ?? '', location: education?.location ?? '', started_at: education?.started_at ?? '', ended_at: education?.ended_at ?? '', description: education?.description ?? '', sort_order: education?.sort_order ?? 0 });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);
    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault(); setSubmitting(true); setErrors({});
        try {
            if (isEdit) await api.patch(`/education/${education.id}`, { ...form, sort_order: Number(form.sort_order) });
            else await api.post('/education', { ...form, sort_order: Number(form.sort_order) });
            setSuccess(isEdit ? 'Updated!' : 'Created!');
            if (!isEdit) router.visit('/admin/education');
        } catch (err) { setErrors(err.response?.data?.errors ?? {}); } finally { setSubmitting(false); }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Education' : 'New Education'}>
            <Head title={isEdit ? 'Edit Education' : 'New Education'} />
            <FormLayout title={isEdit ? `Edit: ${education.degree}` : 'Add Education'} backHref="/admin/education" onSubmit={handleSubmit} isSubmitting={submitting}>
                <ErrorBanner errors={errors} /><SuccessBanner message={success} />
                <FormCard title="Education Details">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Institution" required error={errors.institution?.[0]}>
                            <FormInput value={form.institution} onChange={(e) => set('institution', e.target.value)} placeholder="MIT" error={errors.institution?.[0]} />
                        </FormField>
                        <FormField label="Degree" required error={errors.degree?.[0]}>
                            <FormInput value={form.degree} onChange={(e) => set('degree', e.target.value)} placeholder="Bachelor of Science" error={errors.degree?.[0]} />
                        </FormField>
                        <FormField label="Field of Study" error={errors.field_of_study?.[0]}>
                            <FormInput value={form.field_of_study} onChange={(e) => set('field_of_study', e.target.value)} placeholder="Computer Science" error={errors.field_of_study?.[0]} />
                        </FormField>
                        <FormField label="Location" error={errors.location?.[0]}>
                            <FormInput value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Cambridge, MA" error={errors.location?.[0]} />
                        </FormField>
                        <FormField label="Started At">
                            <FormInput type="date" value={form.started_at} onChange={(e) => set('started_at', e.target.value)} />
                        </FormField>
                        <FormField label="Ended At">
                            <FormInput type="date" value={form.ended_at} onChange={(e) => set('ended_at', e.target.value)} />
                        </FormField>
                    </div>
                    <FormField label="Description" error={errors.description?.[0]}>
                        <FormTextarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={4} placeholder="Notes about this education..." error={errors.description?.[0]} />
                    </FormField>
                    <FormField label="Sort Order">
                        <FormInput type="number" min="0" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} />
                    </FormField>
                </FormCard>
            </FormLayout>
        </AdminLayout>
    );
}
