import AdminLayout from '@/Layouts/AdminLayout';
import FormLayout, {
    FormCard,
    FormField,
    FormInput,
    FormTextarea,
    FormSelect,
    FormToggle,
    ErrorBanner,
    SuccessBanner,
} from '@/Components/Admin/FormLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Wand2, Plus, Trash2, Image, Layers, Package, DollarSign } from 'lucide-react';
import api from '@/lib/api';

function slugify(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

const COMMON_CATEGORIES = [
    'Furniture',
    'Lighting',
    'Architectural Hardware',
    'Textiles & Rugs',
    'Sculptural Decor',
    'Acoustic Paneling',
    'Outdoor & Patio',
    'Custom Joinery',
];

export default function ProductForm({ product, categories = [] }) {
    const isEdit = !!product;

    const initialGallery = Array.isArray(product?.gallery)
        ? product.gallery
        : product?.gallery ? [product.gallery] : [];

    const [form, setForm] = useState({
        name: product?.name ?? '',
        slug: product?.slug ?? '',
        summary: product?.summary ?? '',
        description: product?.description ?? '',
        featured_image: product?.featured_image ?? '',
        gallery: initialGallery,
        price: product?.price ?? '',
        category: product?.category ?? 'Furniture',
        sku: product?.sku ?? '',
        stock_quantity: product?.stock_quantity ?? 10,
        status: product?.status ?? 'published',
        is_featured: product?.is_featured ?? false,
        sort_order: product?.sort_order ?? 0,
    });

    const [newGalleryUrl, setNewGalleryUrl] = useState('');
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);

    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const handleGenerateSku = () => {
        const catPrefix = (form.category || 'PRD').substring(0, 3).toUpperCase();
        const rand = Math.floor(1000 + Math.random() * 9000);
        const generated = `AT-${catPrefix}-${rand}`;
        set('sku', generated);
    };

    const handleAddGalleryImage = () => {
        if (!newGalleryUrl.trim()) return;
        set('gallery', [...form.gallery, newGalleryUrl.trim()]);
        setNewGalleryUrl('');
    };

    const handleRemoveGalleryImage = (idx) => {
        set('gallery', form.gallery.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

        const payload = {
            ...form,
            sort_order: Number(form.sort_order),
            stock_quantity: Number(form.stock_quantity),
            price: form.price ? Number(form.price) : null,
        };

        if (isEdit) {
            router.put(`/admin/products/${product.id}`, payload, {
                onError: (err) => setErrors(err),
                onSuccess: () => setSuccess('Product updated successfully!'),
                onFinish: () => setSubmitting(false),
            });
        } else {
            router.post('/admin/products', payload, {
                onError: (err) => setErrors(err),
                onSuccess: () => setSuccess('Product created successfully!'),
                onFinish: () => setSubmitting(false),
            });
        }
    };

    const mergedCategories = Array.from(new Set([...COMMON_CATEGORIES, ...categories]));

    return (
        <AdminLayout title={isEdit ? 'Edit Product' : 'Add New Product'}>
            <Head title={isEdit ? `Edit: ${product.name}` : 'New Product'} />

            <FormLayout
                title={isEdit ? `Edit Piece: ${product.name}` : 'Add New Inventory Piece'}
                backHref="/admin/products"
                onSubmit={handleSubmit}
                isSubmitting={submitting}
            >
                <ErrorBanner errors={errors} />
                <SuccessBanner message={success} />

                {/* Primary Information */}
                <FormCard title="Product Overview">
                    <FormField label="Product Name" required error={errors.name?.[0]}>
                        <FormInput
                            value={form.name}
                            onChange={(e) => {
                                set('name', e.target.value);
                                if (!isEdit) set('slug', slugify(e.target.value));
                            }}
                            placeholder="e.g. Sculptural Travertine Coffee Table"
                            error={errors.name?.[0]}
                        />
                    </FormField>

                    <FormField label="URL Slug" required error={errors.slug?.[0]}>
                        <FormInput
                            value={form.slug}
                            onChange={(e) => set('slug', e.target.value)}
                            placeholder="sculptural-travertine-coffee-table"
                            error={errors.slug?.[0]}
                        />
                    </FormField>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Category" error={errors.category?.[0]}>
                            <div className="space-y-2">
                                <FormSelect
                                    value={mergedCategories.includes(form.category) ? form.category : 'custom'}
                                    onChange={(e) => {
                                        if (e.target.value !== 'custom') {
                                            set('category', e.target.value);
                                        }
                                    }}
                                    options={[
                                        ...mergedCategories.map((c) => ({ value: c, label: c })),
                                        { value: 'custom', label: '+ Custom Category' },
                                    ]}
                                />
                                {(!mergedCategories.includes(form.category) || form.category === '') && (
                                    <FormInput
                                        value={form.category}
                                        onChange={(e) => set('category', e.target.value)}
                                        placeholder="Type custom category name..."
                                    />
                                )}
                            </div>
                        </FormField>

                        <FormField label="SKU / Item Code" error={errors.sku?.[0]}>
                            <div className="flex gap-2">
                                <FormInput
                                    value={form.sku}
                                    onChange={(e) => set('sku', e.target.value)}
                                    placeholder="AT-FUR-1049"
                                    error={errors.sku?.[0]}
                                />
                                <button
                                    type="button"
                                    onClick={handleGenerateSku}
                                    className="shrink-0 rounded-xl bg-slate-800 px-3 py-2 text-xs font-medium text-amber-400 hover:bg-slate-700 transition flex items-center gap-1.5 border border-slate-700"
                                    title="Auto-generate SKU"
                                >
                                    <Wand2 size={13} />
                                    Gen
                                </button>
                            </div>
                        </FormField>
                    </div>

                    <FormField label="Short Summary" error={errors.summary?.[0]}>
                        <FormInput
                            value={form.summary}
                            onChange={(e) => set('summary', e.target.value)}
                            placeholder="Hand-honed Italian travertine table with fluted cylinder pedestal..."
                            error={errors.summary?.[0]}
                        />
                    </FormField>

                    <FormField label="Full Description & Specifications" error={errors.description?.[0]}>
                        <FormTextarea
                            value={form.description}
                            onChange={(e) => set('description', e.target.value)}
                            placeholder="Detailed material composition, dimensions (W x D x H), finish, care instructions..."
                            rows={5}
                            error={errors.description?.[0]}
                        />
                    </FormField>
                </FormCard>

                {/* Pricing & Stock Management */}
                <FormCard title="Pricing & Inventory Control">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Price in BDT (৳)" error={errors.price?.[0]}>
                            <FormInput
                                type="number"
                                step="0.01"
                                min="0"
                                value={form.price}
                                onChange={(e) => set('price', e.target.value)}
                                placeholder="185000"
                                error={errors.price?.[0]}
                            />
                        </FormField>

                        <FormField label="Initial Stock Quantity" required error={errors.stock_quantity?.[0]}>
                            <FormInput
                                type="number"
                                min="0"
                                value={form.stock_quantity}
                                onChange={(e) => set('stock_quantity', e.target.value)}
                                placeholder="10"
                                error={errors.stock_quantity?.[0]}
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                {form.stock_quantity <= 0
                                    ? '⚠️ Marked as Out of Stock'
                                    : form.stock_quantity <= 5
                                    ? '⚠️ Marked as Low Stock'
                                    : '✓ In Stock'}
                            </p>
                        </FormField>
                    </div>
                </FormCard>

                {/* Imagery & Visuals */}
                <FormCard title="Media & Photography">
                    <FormField label="Primary Featured Image URL" error={errors.featured_image?.[0]}>
                        <FormInput
                            value={form.featured_image}
                            onChange={(e) => set('featured_image', e.target.value)}
                            placeholder="https://images.unsplash.com/... or /storage/products/..."
                            error={errors.featured_image?.[0]}
                        />
                    </FormField>

                    {form.featured_image && (
                        <div className="mt-2 relative rounded-xl border border-slate-700 overflow-hidden bg-slate-950 max-h-56">
                            <img
                                src={form.featured_image}
                                alt="Preview"
                                className="w-full h-56 object-cover"
                            />
                        </div>
                    )}

                    {/* Gallery Images */}
                    <div className="mt-4 pt-4 border-t border-slate-800">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                            Additional Gallery Image URLs
                        </label>

                        <div className="flex gap-2 mb-3">
                            <FormInput
                                value={newGalleryUrl}
                                onChange={(e) => setNewGalleryUrl(e.target.value)}
                                placeholder="Paste image URL here..."
                            />
                            <button
                                type="button"
                                onClick={handleAddGalleryImage}
                                className="shrink-0 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition border border-slate-700"
                            >
                                <Plus size={14} /> Add
                            </button>
                        </div>

                        {form.gallery.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                                {form.gallery.map((imgUrl, idx) => (
                                    <div
                                        key={idx}
                                        className="relative group rounded-xl border border-slate-800 overflow-hidden bg-slate-900 h-24"
                                    >
                                        <img src={imgUrl} alt={`Gallery ${idx}`} className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveGalleryImage(idx)}
                                            className="absolute top-1 right-1 rounded-full bg-red-600/90 p-1 text-white opacity-0 group-hover:opacity-100 transition shadow"
                                            title="Remove image"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </FormCard>

                {/* Visibility & Settings */}
                <FormCard title="Visibility & Catalog Settings">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Publishing Status" error={errors.status?.[0]}>
                            <FormSelect
                                value={form.status}
                                onChange={(e) => set('status', e.target.value)}
                                options={[
                                    { value: 'published', label: 'Published (Visible in Shop)' },
                                    { value: 'draft', label: 'Draft (Admin Only)' },
                                    { value: 'archived', label: 'Archived' },
                                ]}
                            />
                        </FormField>

                        <FormField label="Catalog Sort Order">
                            <FormInput
                                type="number"
                                min="0"
                                value={form.sort_order}
                                onChange={(e) => set('sort_order', e.target.value)}
                            />
                        </FormField>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800">
                        <FormToggle
                            label="Feature on Homepage & Shop Header"
                            description="Highlight this piece in featured curated collections."
                            checked={form.is_featured}
                            onChange={(v) => set('is_featured', v)}
                        />
                    </div>
                </FormCard>
            </FormLayout>
        </AdminLayout>
    );
}
