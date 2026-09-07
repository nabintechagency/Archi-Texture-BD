import AdminLayout from '@/Layouts/AdminLayout';
import ResourceTable from '@/Components/Admin/ResourceTable';
import { Head, router } from '@inertiajs/react';

const columns = [
    { key: 'title', label: 'Post', render: (item) => (
        <div><p className="font-medium text-white">{item.title}</p><p className="text-xs text-slate-400">{item.slug}</p></div>
    )},
    { key: 'status', label: 'Status', render: (item) => (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            item.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' :
            item.status === 'draft' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'
        }`}>{item.status}</span>
    )},
    { key: 'published_at', label: 'Published Date', render: (item) => <span className="text-xs text-slate-400">{item.published_at ? new Date(item.published_at).toLocaleDateString() : '—'}</span> },
    { key: 'author', label: 'Author', render: (item) => <span className="text-xs text-slate-400">{item.author?.name ?? '—'}</span> },
];

export default function BlogIndex({ posts, filters }) {
    const handleDelete = (id) => router.delete(`/api/blog-posts/${id}`, { onSuccess: () => router.reload() });
    return (
        <AdminLayout title="Blog">
            <Head title="Admin — Blog" />
            <ResourceTable title="Blog Posts" createHref="/admin/blog/create" createLabel="New Post" columns={columns} pagination={posts} onDelete={handleDelete} editHref={(item) => `/admin/blog/${item.id}/edit`} filters={filters} searchPlaceholder="Search posts..." emptyMessage="No blog posts yet." />
        </AdminLayout>
    );
}
