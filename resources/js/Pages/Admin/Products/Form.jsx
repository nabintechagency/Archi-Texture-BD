import AdminLayout from '@/Layouts/AdminLayout';
import FormLayout, {
    ErrorBanner,
    SuccessBanner,
} from '@/Components/Admin/FormLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { Wand2, Plus, Trash2, Image, Layers, Package, DollarSign, Tag, ArrowLeft, Upload, Check, Percent, Star } from 'lucide-react';

function slugify(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

const COMMON_CATEGORIES = [
    'Furniture',
    'Lighting',
    'Decor',
    'Architectural Hardware',
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
        original_price: product?.original_price ?? product?.price ?? '',
        discount_percent: product?.discount_percent ?? '',
        price: product?.price ?? '',
        category: product?.category ?? 'Furniture',
        custom_category: '',
        sku: product?.sku ?? '',
        stock_quantity: product?.stock_quantity ?? 10,
        status: product?.status ?? 'published',
        is_featured: product?.is_featured ?? false,
        sort_order: product?.sort_order ?? 0,
    });

    const [featuredFile, setFeaturedFile] = useState(null);
    const [featuredPreview, setFeaturedPreview] = useState(product?.featured_image || '');
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [newGalleryUrl, setNewGalleryUrl] = useState('');

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);

    const featuredInputRef = useRef(null);
    const galleryInputRef = useRef(null);

    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const handleGenerateSku = () => {
        const cat = form.category === 'CUSTOM' ? form.custom_category : form.category;
        const catPrefix = (cat || 'PRD').substring(0, 3).toUpperCase();
        const rand = Math.floor(1000 + Math.random() * 9000);
        const generated = `AT-${catPrefix}-${rand}`;
        set('sku', generated);
    };

    const handleOriginalPriceChange = (val) => {
        const orig = parseFloat(val);
        const disc = parseFloat(form.discount_percent);
        let selling = val;
        if (!isNaN(orig) && orig > 0) {
            if (!isNaN(disc) && disc > 0) {
                selling = Math.max(0, orig - (orig * (disc / 100))).toFixed(2);
            }
        }
        setForm((prev) => ({
            ...prev,
            original_price: val,
            price: selling || val,
        }));
    };

    const handleDiscountPercentChange = (val) => {
        const orig = parseFloat(form.original_price || form.price);
        const disc = parseFloat(val);
        let selling = form.original_price || form.price;
        if (!isNaN(orig) && orig > 0) {
            if (!isNaN(disc) && disc > 0) {
                selling = Math.max(0, orig - (orig * (disc / 100))).toFixed(2);
            }
        }
        setForm((prev) => ({
            ...prev,
            discount_percent: val,
            price: selling || prev.original_price || prev.price,
        }));
    };

    const handleFeaturedFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFeaturedFile(file);
            setFeaturedPreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryFilesChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setGalleryFiles(prev => [...prev, ...files]);
            const newPreviews = files.map(f => URL.createObjectURL(f));
            setGalleryPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const handleAddGalleryUrl = () => {
        if (!newGalleryUrl.trim()) return;
        set('gallery', [...form.gallery, newGalleryUrl.trim()]);
        setNewGalleryUrl('');
    };

    const handleRemoveExistingGalleryImage = (idx) => {
        set('gallery', form.gallery.filter((_, i) => i !== idx));
    };

    const handleRemoveNewGalleryFile = (idx) => {
        setGalleryFiles(prev => prev.filter((_, i) => i !== idx));
        setGalleryPreviews(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

        const effectiveCategory = form.category === 'CUSTOM'
            ? form.custom_category.trim()
            : form.category;

        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('slug', form.slug);
        formData.append('category', effectiveCategory);
        if (form.summary) formData.append('summary', form.summary);
        if (form.description) formData.append('description', form.description);

        const finalPrice = form.price || form.original_price;
        if (finalPrice) formData.append('price', finalPrice);
        if (form.original_price) formData.append('original_price', form.original_price);
        if (form.discount_percent) formData.append('discount_percent', form.discount_percent);

        formData.append('stock_quantity', Number(form.stock_quantity || 0));
        if (form.sku) formData.append('sku', form.sku);
        formData.append('status', form.status);
        formData.append('sort_order', Number(form.sort_order || 0));
        formData.append('is_featured', form.is_featured ? '1' : '0');

        if (form.featured_image) formData.append('featured_image', form.featured_image);

        if (featuredFile) {
            formData.append('image_file', featuredFile);
        }

        form.gallery.forEach((url, i) => {
            formData.append(`gallery[${i}]`, url);
        });

        galleryFiles.forEach((file, i) => {
            formData.append(`gallery_files[${i}]`, file);
        });

        if (isEdit) {
            formData.append('_method', 'PUT');
            router.post(`/admin/products/${product.id}`, formData, {
                onError: (err) => setErrors(err),
                onSuccess: () => setSuccess('Product updated successfully!'),
                onFinish: () => setSubmitting(false),
            });
        } else {
            router.post('/admin/products', formData, {
                onError: (err) => setErrors(err),
                onSuccess: () => setSuccess('Product created successfully!'),
                onFinish: () => setSubmitting(false),
            });
        }
    };

    const mergedCategories = Array.from(new Set([...COMMON_CATEGORIES, ...categories]))
        .filter(c => c && !c.toLowerCase().includes('textile'));

    return (
        <AdminLayout title={isEdit ? 'Edit Piece' : 'Add New Product'}>
            <Head title={isEdit ? `Edit: ${product.name}` : 'New Piece — Products & Catalog'} />

            <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/products"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition shadow-2xs"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                                {isEdit ? `Edit Piece: ${product.name}` : 'Add New Architectural Catalog Piece'}
                            </h1>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Set specifications, discount pricing, direct photography upload, and categorization.
                            </p>
                        </div>
                    </div>
                </div>

                <ErrorBanner errors={errors} />
                <SuccessBanner message={success} />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 1. Direct Photo Upload Section */}
                    <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                            <Upload size={16} className="text-violet-600" />
                            <h2 className="text-sm font-bold text-slate-900">Direct Product Photo Upload</h2>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Main Featured Photo
                            </label>
                            <input
                                type="file"
                                ref={featuredInputRef}
                                accept="image/*"
                                onChange={handleFeaturedFileChange}
                                className="hidden"
                            />

                            {featuredPreview ? (
                                <div className="relative h-56 max-w-md rounded-2xl border border-slate-200 overflow-hidden group bg-slate-50">
                                    <img
                                        src={featuredPreview}
                                        alt="Featured preview"
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => featuredInputRef.current?.click()}
                                            className="px-3.5 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs shadow hover:bg-slate-50 transition"
                                        >
                                            Change Photo
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFeaturedFile(null);
                                                setFeaturedPreview('');
                                                set('featured_image', '');
                                            }}
                                            className="px-3.5 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow hover:bg-red-700 transition"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() => featuredInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-300 hover:border-violet-500 rounded-2xl p-8 text-center cursor-pointer transition bg-slate-50/50 hover:bg-violet-50/20 group max-w-md"
                                >
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="h-12 w-12 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                                            <Upload size={22} />
                                        </div>
                                        <div>
                                            <span className="font-bold text-slate-800 text-sm block">
                                                Click to upload main photo
                                            </span>
                                            <span className="text-xs text-slate-400 mt-0.5 block">
                                                Select from your computer (PNG, JPG, WEBP up to 10MB)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Additional Gallery Photo Upload */}
                        <div className="pt-3 border-t border-slate-100">
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Additional Gallery Images (Upload from device or add URL)
                            </label>
                            <input
                                type="file"
                                multiple
                                ref={galleryInputRef}
                                accept="image/*"
                                onChange={handleGalleryFilesChange}
                                className="hidden"
                            />

                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <button
                                    type="button"
                                    onClick={() => galleryInputRef.current?.click()}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-violet-200 bg-violet-50 hover:bg-violet-100 text-violet-700 font-semibold text-xs transition"
                                >
                                    <Upload size={14} />
                                    <span>Upload Multiple Photos</span>
                                </button>
                                <span className="text-xs text-slate-400">or add via link:</span>
                                <input
                                    type="text"
                                    value={newGalleryUrl}
                                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                                    placeholder="Image URL link..."
                                    className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-800 w-64 focus:outline-none focus:border-violet-500"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddGalleryUrl}
                                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
                                >
                                    Add Link
                                </button>
                            </div>

                            {(form.gallery.length > 0 || galleryPreviews.length > 0) && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                                    {form.gallery.map((imgUrl, idx) => (
                                        <div key={`existing-${idx}`} className="relative group h-24 rounded-xl border border-slate-200 overflow-hidden bg-slate-100">
                                            <img src={imgUrl} alt={`Gallery ${idx}`} className="h-full w-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveExistingGalleryImage(idx)}
                                                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow"
                                                title="Remove"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}

                                    {galleryPreviews.map((previewUrl, idx) => (
                                        <div key={`new-${idx}`} className="relative group h-24 rounded-xl border-2 border-violet-400 overflow-hidden bg-slate-100">
                                            <img src={previewUrl} alt={`New upload ${idx}`} className="h-full w-full object-cover" />
                                            <span className="absolute bottom-1 left-1 bg-violet-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                                New
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveNewGalleryFile(idx)}
                                                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow"
                                                title="Remove"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 2. Categorization & Basic Details */}
                    <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-5">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                            <Tag size={16} className="text-violet-600" />
                            <h2 className="text-sm font-bold text-slate-900">Categorization & Identifiers</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Product Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={mergedCategories.includes(form.category) ? form.category : 'CUSTOM'}
                                    onChange={(e) => {
                                        if (e.target.value === 'CUSTOM') {
                                            set('category', 'CUSTOM');
                                        } else {
                                            set('category', e.target.value);
                                        }
                                    }}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition"
                                >
                                    {mergedCategories.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                    <option value="CUSTOM">+ Add New Custom Category...</option>
                                </select>
                            </div>

                            {form.category === 'CUSTOM' ? (
                                <div>
                                    <label className="block text-xs font-semibold text-violet-700 mb-1.5">
                                        Type New Custom Category <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.custom_category}
                                        onChange={(e) => set('custom_category', e.target.value)}
                                        placeholder="e.g. Sculptural Stone, Brass Hardware"
                                        className="w-full rounded-xl border border-violet-300 bg-violet-50/30 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-violet-600 focus:outline-none"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Item Code / SKU
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={form.sku}
                                            onChange={(e) => set('sku', e.target.value)}
                                            placeholder="AT-FUR-2041"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-mono focus:bg-white focus:border-violet-500 focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleGenerateSku}
                                            className="shrink-0 rounded-xl bg-violet-50 border border-violet-200 px-3 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-100 transition flex items-center gap-1.5"
                                            title="Auto-generate SKU"
                                        >
                                            <Wand2 size={13} />
                                            <span>Generate</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Product Title / Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => {
                                    set('name', e.target.value);
                                    if (!isEdit) set('slug', slugify(e.target.value));
                                }}
                                placeholder="e.g. Sculptural Travertine Coffee Table"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:bg-white focus:border-violet-500 focus:outline-none"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                URL Slug <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={form.slug}
                                onChange={(e) => set('slug', e.target.value)}
                                placeholder="sculptural-travertine-coffee-table"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-mono focus:bg-white focus:border-violet-500 focus:outline-none"
                            />
                            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Brief Architectural Summary
                            </label>
                            <input
                                type="text"
                                value={form.summary}
                                onChange={(e) => set('summary', e.target.value)}
                                placeholder="Hand-honed Italian travertine table with fluted cylinder pedestal..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-violet-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Full Specifications & Description
                            </label>
                            <textarea
                                rows={4}
                                value={form.description}
                                onChange={(e) => set('description', e.target.value)}
                                placeholder="Material composition, dimensions (W x D x H), finish, care instructions..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-violet-500 focus:outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* 3. Pricing & Discount Configuration */}
                    <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                            <DollarSign size={16} className="text-emerald-600" />
                            <h2 className="text-sm font-bold text-slate-900">Pricing, Discounts & Inventory</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Original Price in BDT (৳)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={form.original_price}
                                    onChange={(e) => handleOriginalPriceChange(e.target.value)}
                                    placeholder="185000"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-mono font-bold focus:bg-white focus:border-violet-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Discount % (Optional)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={form.discount_percent}
                                        onChange={(e) => handleDiscountPercentChange(e.target.value)}
                                        placeholder="15"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-3.5 pr-7 py-2.5 text-xs text-slate-800 font-mono font-bold focus:bg-white focus:border-violet-500 focus:outline-none"
                                    />
                                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">%</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-violet-700 mb-1.5">
                                    Final Selling Price (৳)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={form.price}
                                    onChange={(e) => set('price', e.target.value)}
                                    placeholder="157250"
                                    className="w-full rounded-xl border border-violet-300 bg-violet-50/40 px-3.5 py-2.5 text-xs text-violet-950 font-mono font-bold focus:bg-white focus:border-violet-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Stock Quantity <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    required
                                    value={form.stock_quantity}
                                    onChange={(e) => set('stock_quantity', e.target.value)}
                                    placeholder="10"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-mono font-bold focus:bg-white focus:border-violet-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Catalog Status
                                </label>
                                <select
                                    value={form.status}
                                    onChange={(e) => set('status', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:bg-white focus:border-violet-500 focus:outline-none"
                                >
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                                        <Star size={16} className={form.is_featured ? "fill-amber-600 text-amber-600" : "text-amber-600"} />
                                    </div>
                                    <div>
                                        <span className="block font-bold text-slate-900 text-xs">Signature Collection</span>
                                        <span className="text-[11px] text-slate-500">Feature on Homepage Signature Collection</span>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.is_featured}
                                        onChange={(e) => set('is_featured', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/60">
                        <Link
                            href="/admin/products"
                            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-xl bg-violet-600 hover:bg-violet-700 px-6 py-2.5 text-xs font-bold text-white transition shadow-sm shadow-violet-500/20 disabled:opacity-60 flex items-center gap-1.5"
                        >
                            {submitting ? 'Saving Piece...' : isEdit ? 'Update Piece' : 'Publish to Catalog'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
