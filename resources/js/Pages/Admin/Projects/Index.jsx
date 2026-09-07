import AdminLayout from '@/Layouts/AdminLayout';
import ResourceTable from '@/Components/Admin/ResourceTable';
import { Head, router } from '@inertiajs/react';

const columns = [
    {
        key: 'title',
        label: 'Title',
        render: (item) => (
            <div>
                <p className="font-medium text-white">{item.title}</p>
                <p className="text-xs text-slate-500">{item.slug}</p>
            </div>
        ),
    },
    {
        key: 'status',
        label: 'Status',
        render: (item) => (
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                item.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' :
                item.status === 'draft' ? 'bg-amber-500/20 text-amber-400' :
                'bg-slate-500/20 text-slate-400'
            }`}>
                {item.status}
            </span>
        ),
    },
    {
        key: 'is_featured',
        label: 'Featured',
        render: (item) => item.is_featured ? (
            <span className="text-indigo-400 text-xs font-medium">✓ Featured</span>
        ) : <span className="text-slate-600 text-xs">—</span>,
    },
    {
        key: 'skills',
        label: 'Skills',
        render: (item) => (
            <div className="flex flex-wrap gap-1">
                {item.skills?.slice(0, 3).map((s) => (
                    <span key={s.id} className="rounded bg-slate-700 px-1.5 py-0.5 text-xs text-slate-300">{s.name}</span>
                ))}
                {item.skills?.length > 3 && <span className="text-xs text-slate-500">+{item.skills.length - 3}</span>}
            </div>
        ),
    },
    {
        key: 'sort_order',
        label: 'Order',
        render: (item) => <span className="text-slate-400 text-xs">{item.sort_order}</span>,
    },
];

export default function ProjectsIndex({ projects, filters }) {
    const handleDelete = (id) => {
        router.delete(`/api/projects/${id}`, {
            headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content },
            onSuccess: () => router.reload(),
        });
    };

    return (
        <AdminLayout title="Projects">
            <Head title="Admin — Projects" />
            <ResourceTable
                title="Projects"
                createHref="/admin/projects/create"
                createLabel="Add Project"
                columns={columns}
                pagination={projects}
                onDelete={handleDelete}
                editHref={(item) => `/admin/projects/${item.id}/edit`}
                filters={filters}
                searchPlaceholder="Search projects..."
                emptyMessage="No projects yet. Add your first project!"
            />
        </AdminLayout>
    );
}
