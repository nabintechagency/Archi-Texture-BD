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

export default function BlogForm({ post }) {
    const isEdit = !!post;

    const [form, setForm] = useState({
        title: post?.title ?? '',
        slug: post?.slug ?? '',
        excerpt: post?.excerpt ?? '',
        content: post?.content ?? '',
        featured_image: post?.featured_image ?? '',
        status: post?.status ?? 'draft',
        published_at: post?.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : '',
        seo_title: post?.seo_title ?? '',
        seo_description: post?.seo_description ?? '',
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);

    const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

        const payload = { ...form };
        if (!payload.published_at) payload.published_at = null;

        try {
            if (isEdit) {
                await api.patch(`/blog-posts/${post.id}`, payload);
            } else {
                await api.post('/blog-posts', payload);
            }
            setSuccess(isEdit ? 'Post updated successfully!' : 'Post created successfully!');
            if (!isEdit) router.visit('/admin/blog');
        } catch (err) {
            setErrors(err.response?.data?.errors ?? { general: [err.message] });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Post' : 'New Post'}>
            <Head title={isEdit ? 'Edit Post' : 'New Post'} />
            <FormLayout
                title={isEdit ? `Edit: ${post.title}` : 'Create New Post'}
                backHref="/admin/blog"
                onSubmit={handleSubmit}
                isSubmitting={submitting}
            >
                <ErrorBanner errors={errors} />
                <SuccessBanner message={success} />

                <FormCard title="Content">
                    <FormField label="Title" required error={errors.title?.[0]}>
                        <FormInput
                            value={form.title}
                            onChange={(e) => {
                                set('title', e.target.value);
                                if (!isEdit) set('slug', slugify(e.target.value));
                            }}
                            placeholder="My Awesome Blog Post"
                            error={errors.title?.[0]}
                        />
                    </FormField>
                    <FormField label="Slug" required error={errors.slug?.[0]}>
                        <FormInput
                            value={form.slug}
                            onChange={(e) => set('slug', e.target.value)}
                            placeholder="my-awesome-blog-post"
                            error={errors.slug?.[0]}
                        />
                    </FormField>
                    <FormField label="Excerpt" error={errors.excerpt?.[0]}>
                        <FormTextarea
                            value={form.excerpt}
                            onChange={(e) => set('excerpt', e.target.value)}
                            rows={3}
                            placeholder="Brief summary of the post..."
                            error={errors.excerpt?.[0]}
                        />
                    </FormField>
                    <FormField label="Content" required error={errors.content?.[0]}>
                        <FormTextarea
                            value={form.content}
                            onChange={(e) => set('content', e.target.value)}
                            rows={15}
                            placeholder="Write your blog post content here (HTML supported)..."
                            error={errors.content?.[0]}
                        />
                    </FormField>
                </FormCard>

                <FormCard title="Media">
                    <FormField label="Featured Image URL" error={errors.featured_image?.[0]}>
                        <FormInput
                            value={form.featured_image}
                            onChange={(e) => set('featured_image', e.target.value)}
                            placeholder="https://..."
                            error={errors.featured_image?.[0]}
                        />
                    </FormField>
                </FormCard>

                <FormCard title="Publishing">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Status" required error={errors.status?.[0]}>
                            <FormSelect value={form.status} onChange={(e) => set('status', e.target.value)}>
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </FormSelect>
                        </FormField>
                        <FormField label="Published At" error={errors.published_at?.[0]}>
                            <FormInput
                                type="datetime-local"
                                value={form.published_at}
                                onChange={(e) => set('published_at', e.target.value)}
                                error={errors.published_at?.[0]}
                            />
                        </FormField>
                    </div>
                </FormCard>

                <FormCard title="SEO">
                    <FormField label="SEO Title" error={errors.seo_title?.[0]}>
                        <FormInput
                            value={form.seo_title}
                            onChange={(e) => set('seo_title', e.target.value)}
                            placeholder="Custom title for search engines"
                            error={errors.seo_title?.[0]}
                        />
                    </FormField>
                    <FormField label="SEO Description" error={errors.seo_description?.[0]}>
                        <FormTextarea
                            value={form.seo_description}
                            onChange={(e) => set('seo_description', e.target.value)}
                            rows={3}
                            placeholder="Meta description for search engines"
                            error={errors.seo_description?.[0]}
                        />
                    </FormField>
                </FormCard>
            </FormLayout>
        </AdminLayout>
    );
}
