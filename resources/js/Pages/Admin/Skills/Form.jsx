import AdminLayout from '@/Layouts/AdminLayout';
import FormLayout, { FormCard, FormField, FormInput, FormToggle, ErrorBanner, SuccessBanner } from '@/Components/Admin/FormLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import api from '@/lib/api';

function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function SkillForm({ skill }) {
    const isEdit = !!skill;
    const [form, setForm] = useState({
        name: skill?.name ?? '',
        slug: skill?.slug ?? '',
        category: skill?.category ?? '',
        proficiency: skill?.proficiency ?? '',
        icon: skill?.icon ?? '',
        sort_order: skill?.sort_order ?? 0,
        is_active: skill?.is_active ?? true,
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);
    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        try {
            const payload = { ...form, sort_order: Number(form.sort_order), proficiency: form.proficiency !== '' ? Number(form.proficiency) : null };
            if (isEdit) await api.patch(`/skills/${skill.id}`, payload);
            else await api.post('/skills', payload);
            setSuccess(isEdit ? 'Skill updated!' : 'Skill created!');
            if (!isEdit) router.visit('/admin/skills');
        } catch (err) {
            setErrors(err.response?.data?.errors ?? {});
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Skill' : 'New Skill'}>
            <Head title={isEdit ? 'Edit Skill' : 'New Skill'} />
            <FormLayout title={isEdit ? `Edit: ${skill.name}` : 'Create New Skill'} backHref="/admin/skills" onSubmit={handleSubmit} isSubmitting={submitting}>
                <ErrorBanner errors={errors} />
                <SuccessBanner message={success} />
                <FormCard title="Skill Details">
                    <FormField label="Name" required error={errors.name?.[0]}>
                        <FormInput value={form.name} onChange={(e) => { set('name', e.target.value); if (!isEdit) set('slug', slugify(e.target.value)); }} placeholder="React" error={errors.name?.[0]} />
                    </FormField>
                    <FormField label="Slug" required error={errors.slug?.[0]}>
                        <FormInput value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="react" error={errors.slug?.[0]} />
                    </FormField>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Category" error={errors.category?.[0]}>
                            <FormInput value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="Frontend" error={errors.category?.[0]} />
                        </FormField>
                        <FormField label="Icon (emoji or class)" error={errors.icon?.[0]}>
                            <FormInput value={form.icon} onChange={(e) => set('icon', e.target.value)} placeholder="⚛️" error={errors.icon?.[0]} />
                        </FormField>
                    </div>
                    <FormField label="Proficiency (0–100)" error={errors.proficiency?.[0]}>
                        <FormInput type="number" min="0" max="100" value={form.proficiency} onChange={(e) => set('proficiency', e.target.value)} placeholder="85" error={errors.proficiency?.[0]} />
                    </FormField>
                    <FormField label="Sort Order">
                        <FormInput type="number" min="0" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} />
                    </FormField>
                    <FormToggle label="Active" description="Show this skill on the public site" checked={form.is_active} onChange={(v) => set('is_active', v)} />
                </FormCard>
            </FormLayout>
        </AdminLayout>
    );
}
