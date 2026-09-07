import AdminLayout from '@/Layouts/AdminLayout';
import FormLayout, { FormCard, FormField, FormInput, FormTextarea, FormSelect, FormToggle, ErrorBanner, SuccessBanner } from '@/Components/Admin/FormLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import api from '@/lib/api';

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

export default function SliderForm({ slider }) {
    const isEdit = !!slider;
    const [form, setForm] = useState({
        title: slider?.title ?? '', subtitle: slider?.subtitle ?? '', description: slider?.description ?? '',
        image: slider?.image ?? '', link_url: slider?.link_url ?? '', link_text: slider?.link_text ?? '',
        text_position: slider?.text_position ?? 'center', text_color: slider?.text_color ?? '#ffffff',
        overlay_opacity: slider?.overlay_opacity ?? 50, status: slider?.status ?? true, sort_order: slider?.sort_order ?? 0,
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);
    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault(); setSubmitting(true); setErrors({});
        try {
            const payload = { ...form, sort_order: Number(form.sort_order), overlay_opacity: Number(form.overlay_opacity) };
            if (isEdit) await api.patch(`/sliders/${slider.id}`, payload);
            else await api.post('/sliders', payload);
            setSuccess(isEdit ? 'Slider updated!' : 'Slider created!');
            if (!isEdit) router.visit('/admin/sliders');
        } catch (err) { setErrors(err.response?.data?.errors ?? {}); } finally { setSubmitting(false); }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Slider' : 'New Slider'}>
            <Head title={isEdit ? 'Edit Slider' : 'New Slider'} />
            <FormLayout title={isEdit ? `Edit: ${slider.title}` : 'Create New Slide'} backHref="/admin/sliders" onSubmit={handleSubmit} isSubmitting={submitting}>
                <ErrorBanner errors={errors} /><SuccessBanner message={success} />
                <FormCard title="Slide Content">
                    <FormField label="Title" required error={errors.title?.[0]}>
                        <FormInput value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Welcome to Our Studio" error={errors.title?.[0]} />
                    </FormField>
                    <FormField label="Subtitle" error={errors.subtitle?.[0]}>
                        <FormInput value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} placeholder="Interior Design & Architecture" error={errors.subtitle?.[0]} />
                    </FormField>
                    <FormField label="Description" error={errors.description?.[0]}>
                        <FormTextarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Slide description..." rows={3} error={errors.description?.[0]} />
                    </FormField>
                    <FormField label="Image URL" error={errors.image?.[0]}>
                        <FormInput value={form.image} onChange={(e) => set('image', e.target.value)} placeholder="/images/hero.jpg or https://..." error={errors.image?.[0]} />
                    </FormField>
                    {form.image && <div className="mt-2"><img src={form.image} alt="Preview" className="h-32 w-full rounded-lg object-cover" /></div>}
                </FormCard>
                <FormCard title="Link">
                    <FormField label="Link URL" error={errors.link_url?.[0]}>
                        <FormInput value={form.link_url} onChange={(e) => set('link_url', e.target.value)} placeholder="https://example.com" error={errors.link_url?.[0]} />
                    </FormField>
                    <FormField label="Link Text" error={errors.link_text?.[0]}>
                        <FormInput value={form.link_text} onChange={(e) => set('link_text', e.target.value)} placeholder="Learn More" error={errors.link_text?.[0]} />
                    </FormField>
                </FormCard>
                <FormCard title="Appearance">
                    <FormField label="Text Position" error={errors.text_position?.[0]}>
                        <FormSelect value={form.text_position} onChange={(e) => set('text_position', e.target.value)} options={[
                            { value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' },
                        ]} />
                    </FormField>
                    <FormField label="Text Color" error={errors.text_color?.[0]}>
                        <div className="flex items-center gap-3">
                            <input type="color" value={form.text_color} onChange={(e) => set('text_color', e.target.value)} className="h-10 w-10 rounded border-0 cursor-pointer" />
                            <FormInput value={form.text_color} onChange={(e) => set('text_color', e.target.value)} placeholder="#ffffff" error={errors.text_color?.[0]} />
                        </div>
                    </FormField>
                    <FormField label="Overlay Opacity" error={errors.overlay_opacity?.[0]}>
                        <div className="flex items-center gap-3">
                            <input type="range" min="0" max="100" value={form.overlay_opacity} onChange={(e) => set('overlay_opacity', e.target.value)} className="flex-1" />
                            <span className="text-sm text-slate-400 w-10 text-right">{form.overlay_opacity}%</span>
                        </div>
                    </FormField>
                    <FormField label="Sort Order">
                        <FormInput type="number" min="0" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} />
                    </FormField>
                    <FormToggle label="Active" description="Show on public site" checked={form.status} onChange={(v) => set('status', v)} />
                </FormCard>
            </FormLayout>
        </AdminLayout>
    );
}
