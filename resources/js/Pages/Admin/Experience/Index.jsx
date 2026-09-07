import AdminLayout from '@/Layouts/AdminLayout';
import ResourceTable from '@/Components/Admin/ResourceTable';
import { Head, router } from '@inertiajs/react';

const columns = [
    { key: 'job_title', label: 'Position', render: (item) => (
        <div><p className="font-medium text-white">{item.job_title}</p><p className="text-xs text-slate-400">{item.company} {item.location ? `· ${item.location}` : ''}</p></div>
    )},
    { key: 'period', label: 'Period', render: (item) => (
        <span className="text-xs text-slate-400">{item.started_at} — {item.is_current ? 'Present' : (item.ended_at ?? '—')}</span>
    )},
    { key: 'is_current', label: 'Current', render: (item) => item.is_current ? <span className="text-emerald-400 text-xs font-medium">✓ Current</span> : null },
    { key: 'sort_order', label: 'Order', render: (item) => <span className="text-slate-400 text-xs">{item.sort_order}</span> },
];

export default function ExperienceIndex({ experiences, filters }) {
    const handleDelete = (id) => router.delete(`/api/experiences/${id}`, { onSuccess: () => router.reload() });
    return (
        <AdminLayout title="Experience">
            <Head title="Admin — Experience" />
            <ResourceTable title="Work Experience" createHref="/admin/experience/create" createLabel="Add Experience" columns={columns} pagination={experiences} onDelete={handleDelete} editHref={(item) => `/admin/experience/${item.id}/edit`} filters={filters} emptyMessage="No experience entries yet." />
        </AdminLayout>
    );
}
