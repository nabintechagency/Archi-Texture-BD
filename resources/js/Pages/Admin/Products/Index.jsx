import AdminLayout from '@/Layouts/AdminLayout';
import ResourceTable from '@/Components/Admin/ResourceTable';
import { Head, router } from '@inertiajs/react';

const columns = [
    { key: 'name', label: 'Product', render: (item) => (
        <div className="flex items-center gap-3">
            {item.featured_image && <img src={item.featured_image} alt={item.name} className="h-10 w-10 rounded-lg object-cover" />}
            <div>
                <p className="font-medium text-white">{item.name}</p>
                <p className="text-xs text-slate-500">{item.category || 'Uncategorized'}</p>
            </div>
        </div>
    )},
    { key: 'price', label: 'Price', render: (item) => <span className="text-emerald-400 font-medium text-sm">{item.price ? `$${Number(item.price).toFixed(2)}` : '—'}</span> },
    { key: 'stock_quantity', label: 'Stock', render: (item) => (
        <span className={`text-xs font-medium ${item.stock_quantity > 0 ? 'text-slate-400' : 'text-red-400'}`}>{item.stock_quantity}</span>
    )},
    { key: 'status', label: 'Status', render: (item) => (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${item.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : item.status === 'draft' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'}`}>{item.status}</span>
    )},
    { key: 'is_featured', label: 'Featured', render: (item) => item.is_featured ? <span className="text-amber-400 text-xs">★ Yes</span> : <span className="text-slate-600 text-xs">No</span> },
    { key: 'sort_order', label: 'Order', render: (item) => <span className="text-slate-400 text-xs">{item.sort_order}</span> },
];

export default function ProductsIndex({ products, filters }) {
    const handleDelete = (id) => router.delete(`/api/products/${id}`, { onSuccess: () => router.reload() });
    return (
        <AdminLayout title="Products">
            <Head title="Admin — Products" />
            <ResourceTable title="Products" createHref="/admin/products/create" createLabel="Add Product" columns={columns} pagination={products} onDelete={handleDelete} editHref={(item) => `/admin/products/${item.id}/edit`} filters={filters} emptyMessage="No products yet." />
        </AdminLayout>
    );
}
