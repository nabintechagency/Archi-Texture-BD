import AdminLayout from '@/Layouts/AdminLayout';
import ResourceTable from '@/Components/Admin/ResourceTable';
import { Head, router } from '@inertiajs/react';

const columns = [
    { key: 'title', label: 'Slide', render: (item) => (
        <div className="flex items-center gap-3">
            {item.image && <img src={item.image} alt={item.title} className="h-10 w-16 rounded-lg object-cover" />}
            <div>
                <p className="font-medium text-white">{item.title}</p>
                <p className="text-xs text-slate-500">{item.subtitle?.substring(0, 50) || 'No subtitle'}</p>
            </div>
        </div>
    )},
    { key: 'status', label: 'Status', render: (item) => (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${item.status ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>{item.status ? 'Active' : 'Inactive'}</span>
    )},
    { key: 'text_position', label: 'Position', render: (item) => <span className="text-slate-400 text-xs capitalize">{item.text_position}</span> },
    { key: 'sort_order', label: 'Order', render: (item) => <span className="text-slate-400 text-xs">{item.sort_order}</span> },
];

export default function SlidersIndex({ sliders, filters }) {
    const handleDelete = (id) => router.delete(`/api/sliders/${id}`, { onSuccess: () => router.reload() });
    return (
        <AdminLayout title="Sliders">
            <Head title="Admin — Sliders" />
            <ResourceTable title="Sliders" createHref="/admin/sliders/create" createLabel="Add Slide" columns={columns} pagination={sliders} onDelete={handleDelete} editHref={(item) => `/admin/sliders/${item.id}/edit`} filters={filters} emptyMessage="No sliders yet." />
        </AdminLayout>
    );
}
