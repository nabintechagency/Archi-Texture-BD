import AdminLayout from '@/Layouts/AdminLayout';
import ResourceTable from '@/Components/Admin/ResourceTable';
import { Head, router } from '@inertiajs/react';

const columns = [
    { key: 'title', label: 'Service', render: (item) => (
        <div><p className="font-medium text-white">{item.title}</p><p className="text-xs text-slate-500">{item.summary?.substring(0, 60)}...</p></div>
    )},
    { key: 'is_active', label: 'Status', render: (item) => (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${item.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>{item.is_active ? 'Active' : 'Inactive'}</span>
    )},
    { key: 'sort_order', label: 'Order', render: (item) => <span className="text-slate-400 text-xs">{item.sort_order}</span> },
];

export default function ServicesIndex({ services, filters }) {
    const handleDelete = (id) => router.delete(`/api/services/${id}`, { onSuccess: () => router.reload() });
    return (
        <AdminLayout title="Services">
            <Head title="Admin — Services" />
            <ResourceTable title="Services" createHref="/admin/services/create" createLabel="Add Service" columns={columns} pagination={services} onDelete={handleDelete} editHref={(item) => `/admin/services/${item.id}/edit`} filters={filters} emptyMessage="No services yet." />
        </AdminLayout>
    );
}
