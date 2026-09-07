import AdminLayout from '@/Layouts/AdminLayout';
import ResourceTable from '@/Components/Admin/ResourceTable';
import { Head, router } from '@inertiajs/react';

const columns = [
    { key: 'degree', label: 'Degree', render: (item) => (
        <div><p className="font-medium text-white">{item.degree}</p><p className="text-xs text-slate-400">{item.field_of_study ?? ''}</p></div>
    )},
    { key: 'institution', label: 'Institution', render: (item) => <span className="text-slate-300">{item.institution}</span> },
    { key: 'period', label: 'Period', render: (item) => <span className="text-xs text-slate-400">{item.started_at ?? '—'} — {item.ended_at ?? '—'}</span> },
];

export default function EducationIndex({ educations, filters }) {
    const handleDelete = (id) => router.delete(`/api/education/${id}`, { onSuccess: () => router.reload() });
    return (
        <AdminLayout title="Education">
            <Head title="Admin — Education" />
            <ResourceTable title="Education" createHref="/admin/education/create" createLabel="Add Education" columns={columns} pagination={educations} onDelete={handleDelete} editHref={(item) => `/admin/education/${item.id}/edit`} filters={filters} emptyMessage="No education entries yet." />
        </AdminLayout>
    );
}
