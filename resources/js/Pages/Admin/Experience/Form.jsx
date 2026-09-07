import AdminLayout from '@/Layouts/AdminLayout';
import FormLayout, { FormCard, FormField, FormInput, FormTextarea, FormToggle, ErrorBanner, SuccessBanner } from '@/Components/Admin/FormLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import api from '@/lib/api';

export default function ExperienceForm({ experience }) {
    const isEdit = !!experience;
    const [form, setForm] = useState({
        company: experience?.company ?? '', job_title: experience?.job_title ?? '',
        employment_type: experience?.employment_type ?? '', location: experience?.location ?? '',
        started_at: experience?.started_at ?? '', ended_at: experience?.ended_at ?? '',
        is_current: experience?.is_current ?? false, description: experience?.description ?? '',
        sort_order: experience?.sort_order ?? 0,
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);
    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault(); setSubmitting(true); setErrors({});
        try {
            const payload = { ...form, sort_order: Number(form.sort_order), ended_at: form.is_current ? null : form.ended_at };
            if (isEdit) await api.patch(`/experiences/${experience.id}`, payload);
            else await api.post('/experiences', payload);
            setSuccess(isEdit ? 'Updated!' : 'Created!');
            if (!isEdit) router.visit('/admin/experience');
        } catch (err) { setErrors(err.response?.data?.errors ?? {}); } finally { setSubmitting(false); }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Experience' : 'New Experience'}>
            <Head title={isEdit ? 'Edit Experience' : 'New Experience'} />
            <FormLayout title={isEdit ? `Edit: ${experience.job_title}` : 'Add Work Experience'} backHref="/admin/experience" onSubmit={handleSubmit} isSubmitting={submitting}>
                <ErrorBanner errors={errors} /><SuccessBanner message={success} />
                <FormCard title="Position Details">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Company" required error={errors.company?.[0]}>
                            <FormInput value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Acme Corp" error={errors.company?.[0]} />
                        </FormField>
                        <FormField label="Job Title" required error={errors.job_title?.[0]}>
                            <FormInput value={form.job_title} onChange={(e) => set('job_title', e.target.value)} placeholder="Senior Developer" error={errors.job_title?.[0]} />
                        </FormField>
                        <FormField label="Employment Type" error={errors.employment_type?.[0]}>
                            <FormInput value={form.employment_type} onChange={(e) => set('employment_type', e.target.value)} placeholder="Full-time" error={errors.employment_type?.[0]} />
                        </FormField>
                        <FormField label="Location" error={errors.location?.[0]}>
                            <FormInput value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="New York, NY" error={errors.location?.[0]} />
                        </FormField>
                        <FormField label="Started At" required error={errors.started_at?.[0]}>
                            <FormInput type="date" value={form.started_at} onChange={(e) => set('started_at', e.target.value)} error={errors.started_at?.[0]} />
                        </FormField>
                        <FormField label="Ended At" error={errors.ended_at?.[0]}>
                            <FormInput type="date" value={form.ended_at} onChange={(e) => set('ended_at', e.target.value)} disabled={form.is_current} error={errors.ended_at?.[0]} />
                        </FormField>
                    </div>
                    <FormToggle label="Currently Working Here" checked={form.is_current} onChange={(v) => set('is_current', v)} />
                    <FormField label="Description" error={errors.description?.[0]}>
                        <FormTextarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={5} placeholder="Role responsibilities and achievements..." error={errors.description?.[0]} />
                    </FormField>
                    <FormField label="Sort Order">
                        <FormInput type="number" min="0" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} />
                    </FormField>
                </FormCard>
            </FormLayout>
        </AdminLayout>
    );
}
