import AdminLayout from '@/Layouts/AdminLayout';
import ResourceTable from '@/Components/Admin/ResourceTable';
import { Head, router } from '@inertiajs/react';

const columns = [
    { key: 'author_name', label: 'Author', render: (item) => (
        <div><p className="font-medium text-white">{item.author_name}</p><p className="text-xs text-slate-400">{item.author_role ?? ''}{item.company ? ` @ ${item.company}` : ''}</p></div>
    )},
    { key: 'content', label: 'Quote', render: (item) => <p className="text-xs text-slate-400 max-w-xs truncate">"{item.content}"</p> },
    { key: 'rating', label: 'Rating', render: (item) => item.rating ? <span className="text-amber-400">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</span> : null },
    { key: 'is_featured', label: 'Featured', render: (item) => item.is_featured ? <span className="text-indigo-400 text-xs">✓ Featured</span> : null },
];

export default function TestimonialsIndex({ testimonials, filters }) {
    const handleDelete = (id) => router.delete(`/api/testimonials/${id}`, { onSuccess: () => router.reload() });
    return (
        <AdminLayout title="Testimonials">
            <Head title="Admin — Testimonials" />
            <ResourceTable title="Testimonials" createHref="/admin/testimonials/create" createLabel="Add Testimonial" columns={columns} pagination={testimonials} onDelete={handleDelete} editHref={(item) => `/admin/testimonials/${item.id}/edit`} filters={filters} emptyMessage="No testimonials yet." />
        </AdminLayout>
    );
}
