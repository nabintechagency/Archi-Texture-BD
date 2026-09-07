import AdminLayout from '@/Layouts/AdminLayout';
import ResourceTable from '@/Components/Admin/ResourceTable';
import { Head, router } from '@inertiajs/react';

const columns = [
    { key: 'name', label: 'Certification', render: (item) => (
        <div><p className="font-medium text-white">{item.name}</p><p className="text-xs text-slate-400">{item.issuer}</p></div>
    )},
    { key: 'issued_at', label: 'Issued', render: (item) => <span className="text-xs text-slate-400">{item.issued_at ?? '—'}</span> },
    { key: 'expires_at', label: 'Expires', render: (item) => <span className="text-xs text-slate-400">{item.expires_at ?? 'Never'}</span> },
];

export default function CertificationsIndex({ certifications, filters }) {
    const handleDelete = (id) => router.delete(`/api/certifications/${id}`, { onSuccess: () => router.reload() });
    return (
        <AdminLayout title="Certifications">
            <Head title="Admin — Certifications" />
            <ResourceTable title="Certifications" createHref="/admin/certifications/create" createLabel="Add Certification" columns={columns} pagination={certifications} onDelete={handleDelete} editHref={(item) => `/admin/certifications/${item.id}/edit`} filters={filters} emptyMessage="No certifications yet." />
        </AdminLayout>
    );
}
