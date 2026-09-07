import AdminLayout from '@/Layouts/AdminLayout';
import FormLayout, {
    FormCard, FormField, FormInput, FormTextarea, FormSelect, FormToggle, ErrorBanner, SuccessBanner,
} from '@/Components/Admin/FormLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import api from '@/lib/api';

function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function ProjectForm({ project, skills = [] }) {
    const isEdit = !!project;

    const [form, setForm] = useState({
        title: project?.title ?? '',
        slug: project?.slug ?? '',
        summary: project?.summary ?? '',
        description: project?.description ?? '',
        featured_image: project?.featured_image ?? '',
        project_url: project?.project_url ?? '',
        repository_url: project?.repository_url ?? '',
        technologies: project?.technologies?.join(', ') ?? '',
        status: project?.status ?? 'draft',
        is_featured: project?.is_featured ?? false,
        completed_at: project?.completed_at ?? '',
        sort_order: project?.sort_order ?? 0,
        skills: project?.skills?.map((s) => s.id) ?? [],
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);

    const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const toggleSkill = (id) => {
        set('skills', form.skills.includes(id)
            ? form.skills.filter((s) => s !== id)
            : [...form.skills, id]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

        const payload = {
            ...form,
            technologies: form.technologies ? form.technologies.split(',').map((t) => t.trim()).filter(Boolean) : [],
            sort_order: Number(form.sort_order),
        };

        try {
            if (isEdit) {
                await api.patch(`/projects/${project.id}`, payload);
            } else {
                await api.post('/projects', payload);
            }
            setSuccess(isEdit ? 'Project updated successfully!' : 'Project created successfully!');
            if (!isEdit) router.visit('/admin/projects');
        } catch (err) {
            setErrors(err.response?.data?.errors ?? { general: [err.message] });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Project' : 'New Project'}>
            <Head title={isEdit ? 'Edit Project' : 'New Project'} />
            <FormLayout
                title={isEdit ? `Edit: ${project.title}` : 'Create New Project'}
                backHref="/admin/projects"
                onSubmit={handleSubmit}
                isSubmitting={submitting}
            >
                <ErrorBanner errors={errors} />
                <SuccessBanner message={success} />

                <FormCard title="Basic Information">
                    <FormField label="Title" required error={errors.title?.[0]}>
                        <FormInput
                            value={form.title}
                            onChange={(e) => {
                                set('title', e.target.value);
                                if (!isEdit) set('slug', slugify(e.target.value));
                            }}
                            placeholder="My Awesome Project"
                            error={errors.title?.[0]}
                        />
                    </FormField>
                    <FormField label="Slug" required error={errors.slug?.[0]}>
                        <FormInput
                            value={form.slug}
                            onChange={(e) => set('slug', e.target.value)}
                            placeholder="my-awesome-project"
                            error={errors.slug?.[0]}
                        />
                    </FormField>
                    <FormField label="Summary" error={errors.summary?.[0]}>
                        <FormInput
                            value={form.summary}
                            onChange={(e) => set('summary', e.target.value)}
                            placeholder="Short description..."
                            error={errors.summary?.[0]}
                        />
                    </FormField>
                    <FormField label="Description" error={errors.description?.[0]}>
                        <FormTextarea
                            value={form.description}
                            onChange={(e) => set('description', e.target.value)}
                            rows={6}
                            placeholder="Full project description..."
                            error={errors.description?.[0]}
                        />
                    </FormField>
                </FormCard>

                <FormCard title="URLs & Media">
                    <FormField label="Featured Image URL" error={errors.featured_image?.[0]}>
                        <FormInput
                            value={form.featured_image}
                            onChange={(e) => set('featured_image', e.target.value)}
                            placeholder="https://..."
                            error={errors.featured_image?.[0]}
                        />
                    </FormField>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Project URL" error={errors.project_url?.[0]}>
                            <FormInput
                                value={form.project_url}
                                onChange={(e) => set('project_url', e.target.value)}
                                placeholder="https://..."
                                error={errors.project_url?.[0]}
                            />
                        </FormField>
                        <FormField label="Repository URL" error={errors.repository_url?.[0]}>
                            <FormInput
                                value={form.repository_url}
                                onChange={(e) => set('repository_url', e.target.value)}
                                placeholder="https://github.com/..."
                                error={errors.repository_url?.[0]}
                            />
                        </FormField>
                    </div>
                </FormCard>

                <FormCard title="Technologies & Skills">
                    <FormField label="Technologies" hint="Comma-separated list" error={errors.technologies?.[0]}>
                        <FormInput
                            value={form.technologies}
                            onChange={(e) => set('technologies', e.target.value)}
                            placeholder="React, Laravel, PostgreSQL..."
                            error={errors.technologies?.[0]}
                        />
                    </FormField>
                    {skills.length > 0 && (
                        <FormField label="Associated Skills">
                            <div className="flex flex-wrap gap-2 mt-1">
                                {skills.map((skill) => (
                                    <button
                                        key={skill.id}
                                        type="button"
                                        onClick={() => toggleSkill(skill.id)}
                                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                                            form.skills.includes(skill.id)
                                                ? 'bg-indigo-600 text-white border border-indigo-500'
                                                : 'border border-slate-600 bg-slate-800 text-slate-300 hover:border-slate-500'
                                        }`}
                                    >
                                        {skill.name}
                                    </button>
                                ))}
                            </div>
                        </FormField>
                    )}
                </FormCard>

                <FormCard title="Status & Visibility">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Status" required error={errors.status?.[0]}>
                            <FormSelect value={form.status} onChange={(e) => set('status', e.target.value)}>
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </FormSelect>
                        </FormField>
                        <FormField label="Completed At" error={errors.completed_at?.[0]}>
                            <FormInput
                                type="date"
                                value={form.completed_at}
                                onChange={(e) => set('completed_at', e.target.value)}
                                error={errors.completed_at?.[0]}
                            />
                        </FormField>
                    </div>
                    <FormField label="Sort Order" error={errors.sort_order?.[0]}>
                        <FormInput
                            type="number"
                            value={form.sort_order}
                            onChange={(e) => set('sort_order', e.target.value)}
                            min="0"
                            error={errors.sort_order?.[0]}
                        />
                    </FormField>
                    <FormToggle
                        label="Featured Project"
                        description="Show this project prominently on the homepage"
                        checked={form.is_featured}
                        onChange={(v) => set('is_featured', v)}
                    />
                </FormCard>
            </FormLayout>
        </AdminLayout>
    );
}
