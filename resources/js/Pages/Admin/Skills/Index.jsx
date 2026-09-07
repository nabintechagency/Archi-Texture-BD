import AdminLayout from '@/Layouts/AdminLayout';
import ResourceTable from '@/Components/Admin/ResourceTable';
import { Head, router } from '@inertiajs/react';

const columns = [
    {
        key: 'name',
        label: 'Skill',
        render: (item) => (
            <div className="flex items-center gap-2">
                {item.icon && <span className="text-lg">{item.icon}</span>}
                <div>
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.category ?? '—'}</p>
                </div>
            </div>
        ),
    },
    {
        key: 'proficiency',
        label: 'Proficiency',
        render: (item) => item.proficiency != null ? (
            <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${item.proficiency}%` }}
                    />
                </div>
                <span className="text-xs text-slate-400">{item.proficiency}%</span>
            </div>
        ) : <span className="text-slate-600 text-xs">—</span>,
    },
    {
        key: 'is_active',
        label: 'Active',
        render: (item) => (
            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${item.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                {item.is_active ? 'Active' : 'Inactive'}
            </span>
        ),
    },
    { key: 'sort_order', label: 'Order', render: (item) => <span className="text-slate-400 text-xs">{item.sort_order}</span> },
];

export default function SkillsIndex({ skills, filters }) {
    const handleDelete = (id) => router.delete(`/api/skills/${id}`, { onSuccess: () => router.reload() });
    return (
        <AdminLayout title="Skills">
            <Head title="Admin — Skills" />
            <ResourceTable
                title="Skills"
                createHref="/admin/skills/create"
                createLabel="Add Skill"
                columns={columns}
                pagination={skills}
                onDelete={handleDelete}
                editHref={(item) => `/admin/skills/${item.id}/edit`}
                filters={filters}
                emptyMessage="No skills yet."
            />
        </AdminLayout>
    );
}
