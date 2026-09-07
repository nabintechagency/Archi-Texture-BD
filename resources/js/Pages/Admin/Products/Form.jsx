import AdminLayout from '@/Layouts/AdminLayout';
import FormLayout, { FormCard, FormField, FormInput, FormTextarea, FormSelect, FormToggle, ErrorBanner, SuccessBanner } from '@/Components/Admin/FormLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import api from '@/lib/api';

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

export default function ProductForm({ product }) {
    const isEdit = !!product;
    const [form, setForm] = useState({
        name: product?.name ?? '', slug: product?.slug ?? '', summary: product?.summary ?? '',
        description: product?.description ?? '', featured_image: product?.featured_image ?? '',
        price: product?.price ?? '', category: product?.category ?? '', sku: product?.sku ?? '',
        stock_quantity: product?.stock_quantity ?? 0, status: product?.status ?? 'draft',
        is_featured: product?.is_featured ?? false, sort_order: product?.sort_order ?? 0,
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);
    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault(); setSubmitting(true); setErrors({});
        try {
            const payload = { ...form, sort_order: Number(form.sort_order), stock_quantity: Number(form.stock_quantity), price: form.price ? Number(form.price) : null };
            if (isEdit) await api.patch(`/products/${product.id}`, payload);
            else await api.post('/products', payload);
            setSuccess(isEdit ? 'Product updated!' : 'Product created!');
            if (!isEdit) router.visit('/admin/products');
        } catch (err) { setErrors(err.response?.data?.errors ?? {}); } finally { setSubmitting(false); }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Product' : 'New Product'}>
            <Head title={isEdit ? 'Edit Product' : 'New Product'} />
            <FormLayout title={isEdit ? `Edit: ${product.name}` : 'Create New Product'} backHref="/admin/products" onSubmit={handleSubmit} isSubmitting={submitting}>
                <ErrorBanner errors={errors} /><SuccessBanner message={success} />
                <FormCard title="Product Details">
                    <FormField label="Name" required error={errors.name?.[0]}>
                        <FormInput value={form.name} onChange={(e) => { set('name', e.target.value); if (!isEdit) set('slug', slugify(e.target.value)); }} placeholder="Modern Armchair" error={errors.name?.[0]} />
                    </FormField>
                    <FormField label="Slug" required error={errors.slug?.[0]}>
                        <FormInput value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="modern-armchair" error={errors.slug?.[0]} />
                    </FormField>
                    <FormField label="Category" error={errors.category?.[0]}>
                        <FormInput value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="Furniture" error={errors.category?.[0]} />
                    </FormField>
                    <FormField label="SKU" error={errors.sku?.[0]}>
                        <FormInput value={form.sku} onChange={(e) => set('sku', e.target.value)} placeholder="FURN-001" error={errors.sku?.[0]} />
                    </FormField>
                    <FormField label="Summary" error={errors.summary?.[0]}>
                        <FormInput value={form.summary} onChange={(e) => set('summary', e.target.value)} placeholder="Short product summary..." error={errors.summary?.[0]} />
                    </FormField>
                    <FormField label="Description" error={errors.description?.[0]}>
                        <FormTextarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Full product description..." rows={6} error={errors.description?.[0]} />
                    </FormField>
                </FormCard>
                <FormCard title="Pricing & Inventory">
                    <FormField label="Price ($)" error={errors.price?.[0]}>
                        <FormInput type="number" step="0.01" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="299.99" error={errors.price?.[0]} />
                    </FormField>
                    <FormField label="Stock Quantity" error={errors.stock_quantity?.[0]}>
                        <FormInput type="number" min="0" value={form.stock_quantity} onChange={(e) => set('stock_quantity', e.target.value)} />
                    </FormField>
                </FormCard>
                <FormCard title="Media">
                    <FormField label="Featured Image URL" error={errors.featured_image?.[0]}>
                        <FormInput value={form.featured_image} onChange={(e) => set('featured_image', e.target.value)} placeholder="/images/product.jpg or https://..." error={errors.featured_image?.[0]} />
                    </FormField>
                    {form.featured_image && <div className="mt-2"><img src={form.featured_image} alt="Preview" className="h-40 w-full rounded-lg object-cover" /></div>}
                </FormCard>
                <FormCard title="Settings">
                    <FormField label="Status" error={errors.status?.[0]}>
                        <FormSelect value={form.status} onChange={(e) => set('status', e.target.value)} options={[
                            { value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }, { value: 'archived', label: 'Archived' },
                        ]} />
                    </FormField>
                    <FormField label="Sort Order">
                        <FormInput type="number" min="0" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} />
                    </FormField>
                    <FormToggle label="Featured" description="Highlight this product" checked={form.is_featured} onChange={(v) => set('is_featured', v)} />
                </FormCard>
            </FormLayout>
        </AdminLayout>
    );
}
