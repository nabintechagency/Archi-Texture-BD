import AdminLayout from '@/Layouts/AdminLayout';
import FormLayout, { FormCard, FormField, FormInput, ErrorBanner, SuccessBanner } from '@/Components/Admin/FormLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import api from '@/lib/api';

export default function CertificationForm({ certification }) {
    const isEdit = !!certification;
    const [form, setForm] = useState({ name: certification?.name ?? '', issuer: certification?.issuer ?? '', credential_id: certification?.credential_id ?? '', credential_url: certification?.credential_url ?? '', issued_at: certification?.issued_at ?? '', expires_at: certification?.expires_at ?? '', image_path: certification?.image_path ?? '', sort_order: certification?.sort_order ?? 0 });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);
    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault(); setSubmitting(true); setErrors({});
        try {
            if (isEdit) await api.patch(`/certifications/${certification.id}`, { ...form, sort_order: Number(form.sort_order) });
            else await api.post('/certifications', { ...form, sort_order: Number(form.sort_order) });
            setSuccess(isEdit ? 'Updated!' : 'Created!');
            if (!isEdit) router.visit('/admin/certifications');
        } catch (err) { setErrors(err.response?.data?.errors ?? {}); } finally { setSubmitting(false); }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Certification' : 'New Certification'}>
            <Head title={isEdit ? 'Edit Certification' : 'New Certification'} />
            <FormLayout title={isEdit ? `Edit: ${certification.name}` : 'Add Certification'} backHref="/admin/certifications" onSubmit={handleSubmit} isSubmitting={submitting}>
                <ErrorBanner errors={errors} /><SuccessBanner message={success} />
                <FormCard title="Certification Details">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Name" required error={errors.name?.[0]}>
                            <FormInput value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="AWS Solutions Architect" error={errors.name?.[0]} />
                        </FormField>
                        <FormField label="Issuer" required error={errors.issuer?.[0]}>
                            <FormInput value={form.issuer} onChange={(e) => set('issuer', e.target.value)} placeholder="Amazon Web Services" error={errors.issuer?.[0]} />
                        </FormField>
                        <FormField label="Credential ID" error={errors.credential_id?.[0]}>
                            <FormInput value={form.credential_id} onChange={(e) => set('credential_id', e.target.value)} placeholder="ABC123" error={errors.credential_id?.[0]} />
                        </FormField>
                        <FormField label="Credential URL" error={errors.credential_url?.[0]}>
                            <FormInput value={form.credential_url} onChange={(e) => set('credential_url', e.target.value)} placeholder="https://..." error={errors.credential_url?.[0]} />
                        </FormField>
                        <FormField label="Issued At">
                            <FormInput type="date" value={form.issued_at} onChange={(e) => set('issued_at', e.target.value)} />
                        </FormField>
                        <FormField label="Expires At">
                            <FormInput type="date" value={form.expires_at} onChange={(e) => set('expires_at', e.target.value)} />
                        </FormField>
                    </div>
                    <FormField label="Badge Image Path" error={errors.image_path?.[0]}>
                        <FormInput value={form.image_path} onChange={(e) => set('image_path', e.target.value)} placeholder="/storage/..." error={errors.image_path?.[0]} />
                    </FormField>
                    <FormField label="Sort Order">
                        <FormInput type="number" min="0" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} />
                    </FormField>
                </FormCard>
            </FormLayout>
        </AdminLayout>
    );
}
