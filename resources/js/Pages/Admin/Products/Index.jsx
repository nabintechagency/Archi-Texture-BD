import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import {
    Package, Plus, Search, Filter, AlertTriangle, CheckCircle2,
    XCircle, Edit, Trash2, ArrowUpDown, DollarSign, Layers,
    Copy, Check, ExternalLink, RefreshCw, LayoutGrid, List,
    SlidersHorizontal, Eye, ChevronDown, CheckSquare, Sparkles,
    Tag, FolderPlus, Upload, Image as ImageIcon, Percent, Star
} from 'lucide-react';

const PRESET_CATEGORIES = [
    'All Categories',
    'Furniture',
    'Lighting',
    'Decor',
    'Architectural Hardware',
    'Acoustic Paneling',
    'Outdoor & Patio',
    'Custom Joinery'
];

export default function ProductsIndex({ products, inventoryStats = {}, categories = [], categoryCounts = {}, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category || '');
    const [featuredFilter, setFeaturedFilter] = useState(filters.featured || '');
    const [viewMode, setViewMode] = useState('inventory'); // 'inventory' or 'catalog'
    const [copiedSku, setCopiedSku] = useState(null);
    const [updatingStockId, setUpdatingStockId] = useState(null);
    const [stockValues, setStockValues] = useState({});
    
    // Quick Add/Edit Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [quickForm, setQuickForm] = useState({
        name: '',
        category: 'Furniture',
        custom_category: '',
        original_price: '',
        discount_percent: '',
        price: '',
        stock_quantity: 10,
        sku: '',
        status: 'published',
        is_featured: false,
        featured_image: '',
        summary: '',
    });
    const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);

    // Calculate effective selling price based on original price and discount percent
    const calculateSellingPrice = (origPrice, discPercent) => {
        const orig = parseFloat(origPrice);
        const disc = parseFloat(discPercent);
        if (!isNaN(orig) && orig > 0) {
            if (!isNaN(disc) && disc > 0) {
                const discounted = orig - (orig * (disc / 100));
                return Math.max(0, discounted).toFixed(2);
            }
            return orig.toFixed(2);
        }
        return '';
    };

    // Filter handling
    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/products', {
            search,
            status: statusFilter,
            category: categoryFilter,
            featured: featuredFilter,
        }, { preserveState: true, replace: true });
    };

    const handleFilterChange = (key, val) => {
        let nextFeatured = featuredFilter;
        let nextStatus = statusFilter;
        let nextCategory = categoryFilter;

        if (key === 'status') {
            nextStatus = val;
            setStatusFilter(val);
        }
        if (key === 'category') {
            const nextVal = val === 'All Categories' ? '' : val;
            nextCategory = nextVal;
            setCategoryFilter(nextVal);
        }
        if (key === 'featured') {
            nextFeatured = val;
            setFeaturedFilter(val);
        }

        const nextFilters = {
            search,
            status: nextStatus,
            category: nextCategory,
            featured: nextFeatured,
        };

        router.get('/admin/products', nextFilters, { preserveState: true, replace: true });
    };

    const handleToggleFeatured = (product) => {
        router.patch(`/admin/products/${product.id}/toggle-featured`, {}, {
            preserveScroll: true,
        });
    };

    const handleCopySku = (sku) => {
        if (!sku) return;
        navigator.clipboard.writeText(sku);
        setCopiedSku(sku);
        setTimeout(() => setCopiedSku(null), 2000);
    };

    const handleQuickStockSave = async (productId, currentQuantity) => {
        const newQty = stockValues[productId] !== undefined ? stockValues[productId] : currentQuantity;
        setUpdatingStockId(productId);
        try {
            await router.patch(`/admin/products/${productId}/stock`, {
                stock_quantity: newQty,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setStockValues(prev => {
                        const copy = { ...prev };
                        delete copy[productId];
                        return copy;
                    });
                }
            });
        } finally {
            setUpdatingStockId(null);
        }
    };

    const handleStockStep = async (product, delta) => {
        const current = stockValues[product.id] !== undefined ? stockValues[product.id] : product.stock_quantity;
        const newQty = Math.max(0, current + delta);
        setStockValues(prev => ({ ...prev, [product.id]: newQty }));

        setUpdatingStockId(product.id);
        try {
            await router.patch(`/admin/products/${product.id}/stock`, {
                stock_quantity: newQty,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setStockValues(prev => {
                        const copy = { ...prev };
                        delete copy[product.id];
                        return copy;
                    });
                }
            });
        } finally {
            setUpdatingStockId(null);
        }
    };

    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to permanently delete "${name}"? This action cannot be undone.`)) {
            router.delete(`/admin/products/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const formatBdt = (amount) => {
        return `৳${Number(amount || 0).toLocaleString('en-US')}`;
    };

    // Open Quick Add Modal
    const openAddModal = (defaultCategory = '') => {
        setEditingProduct(null);
        const cat = defaultCategory || categoryFilter || 'Furniture';
        const rand = Math.floor(1000 + Math.random() * 9000);
        const skuPrefix = cat.substring(0, 3).toUpperCase();

        setQuickForm({
            name: '',
            category: cat,
            custom_category: '',
            original_price: '',
            discount_percent: '',
            price: '',
            stock_quantity: 10,
            sku: `AT-${skuPrefix}-${rand}`,
            status: 'published',
            featured_image: '',
            summary: '',
        });
        setSelectedPhotoFile(null);
        setPhotoPreview('');
        setFormErrors({});
        setModalOpen(true);
    };

    // Open Quick Edit Modal
    const openEditModal = (product) => {
        setEditingProduct(product);
        setQuickForm({
            name: product.name || '',
            category: product.category || 'Furniture',
            custom_category: '',
            original_price: product.original_price || product.price || '',
            discount_percent: product.discount_percent || '',
            price: product.price || '',
            stock_quantity: product.stock_quantity ?? 10,
            sku: product.sku || '',
            status: product.status || 'published',
            is_featured: Boolean(product.is_featured),
            featured_image: product.featured_image || '',
            summary: product.summary || '',
        });
        setSelectedPhotoFile(null);
        setPhotoPreview(product.featured_image || '');
        setFormErrors({});
        setModalOpen(true);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedPhotoFile(file);
            const previewUrl = URL.createObjectURL(file);
            setPhotoPreview(previewUrl);
        }
    };

    const handleOriginalPriceChange = (val) => {
        const selling = calculateSellingPrice(val, quickForm.discount_percent);
        setQuickForm(prev => ({
            ...prev,
            original_price: val,
            price: selling || val
        }));
    };

    const handleDiscountPercentChange = (val) => {
        const selling = calculateSellingPrice(quickForm.original_price || quickForm.price, val);
        setQuickForm(prev => ({
            ...prev,
            discount_percent: val,
            price: selling || prev.original_price || prev.price
        }));
    };

    const handleSaveQuickModal = (e) => {
        e.preventDefault();
        setSaving(true);
        setFormErrors({});

        const finalCategory = quickForm.category === 'CUSTOM'
            ? quickForm.custom_category.trim()
            : quickForm.category;

        const slug = (editingProduct ? editingProduct.slug : quickForm.name)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') || 'item-' + Date.now();

        const formData = new FormData();
        formData.append('name', quickForm.name);
        formData.append('slug', slug);
        formData.append('category', finalCategory);
        
        // Price and discounts
        const finalPrice = quickForm.price || quickForm.original_price;
        if (finalPrice) formData.append('price', finalPrice);
        if (quickForm.original_price) formData.append('original_price', quickForm.original_price);
        if (quickForm.discount_percent) formData.append('discount_percent', quickForm.discount_percent);

        formData.append('stock_quantity', Number(quickForm.stock_quantity || 0));
        formData.append('sku', quickForm.sku || '');
        formData.append('status', quickForm.status);
        if (quickForm.featured_image) formData.append('featured_image', quickForm.featured_image);
        if (quickForm.summary) formData.append('summary', quickForm.summary);
        formData.append('description', editingProduct?.description || quickForm.summary || '');
        formData.append('sort_order', editingProduct?.sort_order || 0);
        formData.append('is_featured', quickForm.is_featured ? '1' : '0');

        if (selectedPhotoFile) {
            formData.append('image_file', selectedPhotoFile);
        }

        if (editingProduct) {
            formData.append('_method', 'PUT');
            router.post(`/admin/products/${editingProduct.id}`, formData, {
                preserveScroll: true,
                onSuccess: () => setModalOpen(false),
                onError: (err) => setFormErrors(err),
                onFinish: () => setSaving(false),
            });
        } else {
            router.post('/admin/products', formData, {
                preserveScroll: true,
                onSuccess: () => setModalOpen(false),
                onError: (err) => setFormErrors(err),
                onFinish: () => setSaving(false),
            });
        }
    };

    // Category lists combination
    const allKnownCategories = Array.from(new Set([...PRESET_CATEGORIES.slice(1), ...categories]))
        .filter(c => c && !c.toLowerCase().includes('textile'));

    return (
        <AdminLayout title="Products & Catalog Management">
            <Head title="Products & Catalog — Archi Texture BD" />

            <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
                {/* 1. Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Products & Catalog
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Manage inventory stock, categories, discount pricing, and showroom products.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* Switch View Toggle */}
                        <div className="inline-flex rounded-xl bg-white border border-slate-200 p-1 shadow-2xs">
                            <button
                                onClick={() => setViewMode('inventory')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                    viewMode === 'inventory'
                                        ? 'bg-violet-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <List size={14} />
                                <span>Table View</span>
                            </button>
                            <button
                                onClick={() => setViewMode('catalog')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                    viewMode === 'catalog'
                                        ? 'bg-violet-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <LayoutGrid size={14} />
                                <span>Cards Grid</span>
                            </button>
                        </div>

                        {/* Quick Add Product Button */}
                        <button
                            type="button"
                            onClick={() => openAddModal()}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 px-4 py-2 text-xs font-bold text-white transition-all shadow-sm shadow-violet-500/20"
                        >
                            <Plus size={15} strokeWidth={2.5} />
                            <span>Quick Add Piece</span>
                        </button>

                        <Link
                            href="/admin/products/create"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition shadow-2xs"
                        >
                            <span>Full Form</span>
                            <ExternalLink size={13} className="text-slate-400" />
                        </Link>
                    </div>
                </div>

                {/* 2. Top Metric KPI Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-xs">
                        <span className="text-xs font-medium text-slate-500 block">Total Catalog Items</span>
                        <div className="mt-1.5 text-2xl font-extrabold text-slate-900 tracking-tight">
                            {inventoryStats.total_products ?? 0}
                        </div>
                        <span className="text-[11px] text-slate-400 mt-1 block">Active architectural SKUs</span>
                    </div>

                    <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-xs">
                        <span className="text-xs font-medium text-slate-500 block">Available in Stock</span>
                        <div className="mt-1.5 text-2xl font-extrabold text-emerald-600 tracking-tight">
                            {inventoryStats.in_stock ?? 0}
                        </div>
                        <span className="text-[11px] text-slate-400 mt-1 block">&gt; 5 units ready to ship</span>
                    </div>

                    <div
                        onClick={() => handleFilterChange('status', statusFilter === 'low_stock' ? '' : 'low_stock')}
                        className={`rounded-2xl border p-5 shadow-xs cursor-pointer transition ${
                            statusFilter === 'low_stock' ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-100 hover:border-amber-200'
                        }`}
                    >
                        <span className="text-xs font-medium text-amber-700 block flex items-center justify-between">
                            Low Stock Alert
                            <AlertTriangle size={13} className="text-amber-500" />
                        </span>
                        <div className="mt-1.5 text-2xl font-extrabold text-amber-600 tracking-tight">
                            {inventoryStats.low_stock ?? 0}
                        </div>
                        <span className="text-[11px] text-slate-400 mt-1 block">1 to 5 units remaining</span>
                    </div>

                    <div
                        onClick={() => handleFilterChange('featured', featuredFilter === '1' ? '' : '1')}
                        className={`rounded-2xl border p-5 shadow-xs cursor-pointer transition ${
                            featuredFilter === '1' ? 'bg-amber-50 border-amber-400 shadow-sm' : 'bg-white border-slate-100 hover:border-amber-300'
                        }`}
                    >
                        <span className="text-xs font-medium text-amber-800 block flex items-center justify-between">
                            Signature Collection
                            <Star size={13} className="fill-amber-500 text-amber-500" />
                        </span>
                        <div className="mt-1.5 text-2xl font-extrabold text-amber-600 tracking-tight">
                            {inventoryStats.featured ?? 0}
                        </div>
                        <span className="text-[11px] text-slate-400 mt-1 block">Featured on Homepage</span>
                    </div>

                    <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-xs">
                        <span className="text-xs font-medium text-slate-500 block">Total Inventory Valuation</span>
                        <div className="mt-1.5 text-2xl font-extrabold text-slate-900 tracking-tight">
                            {formatBdt(inventoryStats.total_value ?? 0)}
                        </div>
                        <span className="text-[11px] text-slate-400 mt-1 block">Based on showroom pricing</span>
                    </div>
                </div>

                {/* 3. Category Filter Tabs Row */}
                <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <Tag size={13} className="text-violet-600" />
                            Filter by Category & Collections
                        </span>
                        {(categoryFilter || featuredFilter) && (
                            <button
                                onClick={() => {
                                    setCategoryFilter('');
                                    setFeaturedFilter('');
                                    router.get('/admin/products', { search, status: statusFilter }, { preserveState: true, replace: true });
                                }}
                                className="text-[11px] font-semibold text-violet-600 hover:text-violet-800"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={() => {
                                if (categoryFilter || featuredFilter) {
                                    setCategoryFilter('');
                                    setFeaturedFilter('');
                                    router.get('/admin/products', { search, status: statusFilter }, { preserveState: true, replace: true });
                                }
                            }}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                                !categoryFilter && !featuredFilter
                                    ? 'bg-violet-600 text-white shadow-xs'
                                    : 'bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <span>All Pieces</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                !categoryFilter && !featuredFilter
                                    ? 'bg-white/20 text-white'
                                    : 'bg-slate-200 text-slate-700'
                            }`}>
                                {inventoryStats.total_products ?? 0}
                            </span>
                        </button>

                        {/* Signature Collection Featured Filter Tab */}
                        <button
                            onClick={() => handleFilterChange('featured', featuredFilter === '1' ? '' : '1')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                featuredFilter === '1'
                                    ? 'bg-amber-500 text-white shadow-xs'
                                    : 'bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100'
                            }`}
                        >
                            <Star size={13} className={featuredFilter === '1' ? 'fill-white text-white' : 'fill-amber-500 text-amber-500'} />
                            <span>Signature Collection</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                featuredFilter === '1'
                                    ? 'bg-white/20 text-white'
                                    : 'bg-amber-200 text-amber-900'
                            }`}>
                                {inventoryStats.featured ?? 0}
                            </span>
                        </button>

                        {allKnownCategories.map((cat) => {
                            const isSelected = categoryFilter.toLowerCase() === cat.toLowerCase();
                            // Case-insensitive match for category counts
                            const matchedKey = Object.keys(categoryCounts).find(
                                (k) => k.toLowerCase() === cat.toLowerCase()
                            );
                            const count = matchedKey ? categoryCounts[matchedKey] : (categoryCounts[cat] ?? 0);

                            return (
                                <button
                                    key={cat}
                                    onClick={() => handleFilterChange('category', cat)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                                        isSelected
                                            ? 'bg-violet-600 text-white shadow-xs'
                                            : 'bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    <span>{cat}</span>
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                        isSelected
                                            ? 'bg-white/20 text-white'
                                            : count > 0
                                            ? 'bg-violet-100 text-violet-700'
                                            : 'bg-slate-200 text-slate-400'
                                    }`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}

                        <button
                            type="button"
                            onClick={() => {
                                const customCat = prompt('Enter new category name:');
                                if (customCat && customCat.trim()) {
                                    openAddModal(customCat.trim());
                                }
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-medium border border-dashed border-slate-300 text-slate-500 hover:border-violet-400 hover:text-violet-600 transition flex items-center gap-1"
                        >
                            <Plus size={13} />
                            <span>New Category</span>
                        </button>
                    </div>
                </div>

                {/* 4. Search and Status Filter Toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-96">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by piece title, SKU, or style..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/10 transition shadow-2xs"
                        />
                    </form>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <select
                            value={statusFilter}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-violet-500 focus:outline-none"
                        >
                            <option value="">All Stock Statuses</option>
                            <option value="in_stock">In Stock (&gt;5)</option>
                            <option value="low_stock">Low Stock (1-5)</option>
                            <option value="out_of_stock">Out of Stock (0)</option>
                            <option value="published">Published</option>
                            <option value="draft">Drafts</option>
                        </select>
                    </div>
                </div>

                {/* 5. Inventory Table View */}
                {viewMode === 'inventory' ? (
                    <div className="rounded-2xl bg-white border border-slate-100 shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="py-3.5 pl-6 pr-4">Item Details</th>
                                        <th className="py-3.5 px-4">Category</th>
                                        <th className="py-3.5 px-4">Price & Discount</th>
                                        <th className="py-3.5 px-4">Stock Level</th>
                                        <th className="py-3.5 px-4">Signature Collection</th>
                                        <th className="py-3.5 px-4">Status</th>
                                        <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {products.data?.length > 0 ? (
                                        products.data.map((item) => {
                                            const currentStock = stockValues[item.id] !== undefined ? stockValues[item.id] : item.stock_quantity;
                                            const isLow = currentStock > 0 && currentStock <= 5;
                                            const isOut = currentStock <= 0;
                                            const hasDiscount = item.discount_percent && item.discount_percent > 0;

                                            return (
                                                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                                                    {/* Column 1: Image, Title, SKU */}
                                                    <td className="py-4 pl-6 pr-4 align-middle">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                                                {item.featured_image ? (
                                                                    <img
                                                                        src={item.featured_image}
                                                                        alt={item.name}
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="h-full w-full flex items-center justify-center text-slate-400">
                                                                        <Package size={18} />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="min-w-0 flex flex-col">
                                                                <span className="font-bold text-slate-900 truncate max-w-xs block">
                                                                    {item.name}
                                                                </span>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <span className="font-mono text-[11px] text-slate-400">
                                                                        {item.sku || 'No SKU'}
                                                                    </span>
                                                                    {item.sku && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleCopySku(item.sku)}
                                                                            className="text-slate-400 hover:text-slate-600"
                                                                            title="Copy SKU"
                                                                        >
                                                                            {copiedSku === item.sku ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Column 2: Category Pill */}
                                                    <td className="py-4 px-4 align-middle">
                                                        <span className="inline-flex items-center rounded-lg bg-violet-50 text-violet-700 px-2.5 py-1 text-[11px] font-semibold border border-violet-100">
                                                            {item.category || 'General'}
                                                        </span>
                                                    </td>

                                                    {/* Column 3: Price & Discount */}
                                                    <td className="py-4 px-4 align-middle whitespace-nowrap">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                                                                <span>{item.price ? formatBdt(item.price) : 'On Request'}</span>
                                                                {hasDiscount && (
                                                                    <span className="bg-red-50 text-red-600 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-red-200">
                                                                        -{item.discount_percent}%
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {hasDiscount && item.original_price && (
                                                                <span className="text-[11px] text-slate-400 line-through font-mono mt-0.5">
                                                                    {formatBdt(item.original_price)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Column 4: Stock Adjustment stepper */}
                                                    <td className="py-4 px-4 align-middle whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleStockStep(item, -1)}
                                                                    className="px-2 py-1 text-slate-500 hover:bg-slate-100 font-bold"
                                                                    title="Decrease stock"
                                                                >
                                                                    -
                                                                </button>
                                                                <input
                                                                    type="number"
                                                                    value={currentStock}
                                                                    onChange={(e) => setStockValues(prev => ({ ...prev, [item.id]: Math.max(0, parseInt(e.target.value) || 0) }))}
                                                                    onBlur={() => handleQuickStockSave(item.id, item.stock_quantity)}
                                                                    className="w-12 text-center text-xs font-mono font-bold border-none p-1 focus:ring-0 text-slate-800"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleStockStep(item, 1)}
                                                                    className="px-2 py-1 text-slate-500 hover:bg-slate-100 font-bold"
                                                                    title="Increase stock"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>

                                                            {isOut ? (
                                                                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                                                                    Out of Stock
                                                                </span>
                                                            ) : isLow ? (
                                                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                                                    Low: {currentStock} left
                                                                </span>
                                                            ) : (
                                                                <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                                    Available
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Column 5: Signature Collection Featured Toggle */}
                                                    <td className="py-4 px-4 align-middle whitespace-nowrap">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleFeatured(item)}
                                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition shadow-2xs ${
                                                                item.is_featured
                                                                    ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                                                                    : 'bg-slate-100 text-slate-500 border border-slate-200/60 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'
                                                            }`}
                                                            title={item.is_featured ? 'Featured on Homepage (Click to remove)' : 'Standard (Click to feature on Homepage)'}
                                                        >
                                                            <Star
                                                                size={12}
                                                                className={item.is_featured ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}
                                                            />
                                                            <span>{item.is_featured ? 'Featured' : 'Standard'}</span>
                                                        </button>
                                                    </td>

                                                    {/* Column 6: Status */}
                                                    <td className="py-4 px-4 align-middle whitespace-nowrap">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                                            item.status === 'published'
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                : 'bg-slate-100 text-slate-600'
                                                        }`}>
                                                            {item.status}
                                                        </span>
                                                    </td>

                                                    {/* Column 7: Actions */}
                                                    <td className="py-4 pl-4 pr-6 align-middle text-right whitespace-nowrap">
                                                        <div className="inline-flex items-center gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditModal(item)}
                                                                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:text-violet-600 hover:bg-slate-50 transition shadow-2xs"
                                                                title="Quick Edit"
                                                            >
                                                                <Edit size={14} />
                                                            </button>

                                                            <Link
                                                                href={`/admin/products/${item.id}/edit`}
                                                                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:text-violet-600 hover:bg-slate-50 transition shadow-2xs"
                                                                title="Full Edit Page"
                                                            >
                                                                <ExternalLink size={14} />
                                                            </Link>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(item.id, item.name)}
                                                                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition shadow-2xs"
                                                                title="Delete Product"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="py-12 text-center text-slate-400">
                                                No architectural products found matching your filter criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* 6. Catalog Cards Grid View */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {products.data?.map((item) => (
                            <div
                                key={item.id}
                                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-md transition"
                            >
                                <div>
                                    <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                                        {item.featured_image ? (
                                            <img
                                                src={item.featured_image}
                                                alt={item.name}
                                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-xs text-slate-400 font-mono">
                                                No Image Provided
                                            </div>
                                        )}
                                        {/* Category & Discount Badges */}
                                        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                                            <span className="rounded-full bg-white/90 backdrop-blur-xs px-2.5 py-0.5 text-[11px] font-bold text-violet-700 shadow-2xs">
                                                {item.category || 'General'}
                                            </span>
                                            {item.discount_percent > 0 && (
                                                <span className="rounded-full bg-red-600 text-white px-2 py-0.5 text-[11px] font-bold shadow-2xs">
                                                    -{item.discount_percent}% OFF
                                                </span>
                                            )}
                                        </div>

                                        {/* 1-Click Signature Collection Star Toggle */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleToggleFeatured(item);
                                            }}
                                            className={`absolute top-2.5 right-2.5 z-10 rounded-full p-2 transition shadow-md ${
                                                item.is_featured
                                                    ? 'bg-amber-400 text-amber-950 hover:bg-amber-500 ring-2 ring-white'
                                                    : 'bg-white/90 text-slate-400 hover:text-amber-600 hover:bg-white'
                                            }`}
                                            title={item.is_featured ? 'Featured in Signature Collection (Click to unfeature)' : 'Feature in Signature Collection'}
                                        >
                                            <Star size={14} className={item.is_featured ? 'fill-amber-950 text-amber-950' : ''} />
                                        </button>
                                    </div>

                                    <div className="p-4 space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-[11px] text-slate-400">{item.sku}</span>
                                            <div className="flex items-center gap-1.5">
                                                {item.discount_percent > 0 && item.original_price && (
                                                    <span className="text-[11px] text-slate-400 line-through font-mono">
                                                        {formatBdt(item.original_price)}
                                                    </span>
                                                )}
                                                <span className="text-xs font-bold text-emerald-600 font-mono">
                                                    {item.price ? formatBdt(item.price) : 'On Req'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{item.name}</h3>
                                            {item.is_featured && (
                                                <span className="shrink-0 inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-full">
                                                    <Star size={10} className="fill-amber-500 text-amber-500" />
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-2">
                                            {item.summary || item.description || 'No summary text.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
                                    <span className="text-xs font-semibold text-slate-600">
                                        Stock: <strong className="text-slate-900">{item.stock_quantity}</strong>
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => openEditModal(item)}
                                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-violet-700 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(item.id, item.name)}
                                            className="rounded-lg border border-slate-200 bg-white p-1 text-slate-400 hover:text-red-600 transition"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {products.links && products.links.length > 3 && (
                    <div className="flex items-center justify-center gap-1.5 pt-4">
                        {products.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                                    link.active
                                        ? 'bg-violet-600 text-white font-bold shadow-xs'
                                        : link.url
                                        ? 'text-slate-600 hover:bg-slate-100'
                                        : 'text-slate-300 cursor-not-allowed'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* 7. Quick Add / Edit Modal with Discount Options */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setModalOpen(false)} />
                    <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">
                                {editingProduct ? `Edit Piece: ${editingProduct.name}` : 'Quick Add New Architectural Piece'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSaveQuickModal} className="space-y-4 text-xs">
                            {/* Direct Photo Upload Drop Area */}
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1.5">
                                    Product Photo Upload
                                </label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />

                                {photoPreview ? (
                                    <div className="relative h-40 w-full rounded-2xl border border-slate-200 overflow-hidden group bg-slate-50">
                                        <img
                                            src={photoPreview}
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-3 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow hover:bg-slate-50 transition"
                                            >
                                                Change Photo
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPhotoFile(null);
                                                    setPhotoPreview('');
                                                    setQuickForm({ ...quickForm, featured_image: '' });
                                                }}
                                                className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs shadow hover:bg-red-700 transition"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-slate-300 hover:border-violet-500 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-50/50 hover:bg-violet-50/20 group"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-1.5">
                                            <div className="h-10 w-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                                                <Upload size={18} />
                                            </div>
                                            <span className="font-bold text-slate-800 text-xs mt-1">
                                                Click to upload product photo from device
                                            </span>
                                            <span className="text-[11px] text-slate-400">
                                                PNG, JPG, WEBP up to 10MB
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Product Name */}
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={quickForm.name}
                                    onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                                    placeholder="e.g. Fluted Walnut Credenza"
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                                />
                                {formErrors.name && <p className="text-red-500 mt-1">{formErrors.name[0]}</p>}
                            </div>

                            {/* Category Selector + Custom Category */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={quickForm.category}
                                        onChange={(e) => setQuickForm({ ...quickForm, category: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                                    >
                                        {allKnownCategories.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                        <option value="CUSTOM">+ Add New Custom Category</option>
                                    </select>
                                </div>

                                {quickForm.category === 'CUSTOM' ? (
                                    <div>
                                        <label className="block font-semibold text-violet-700 mb-1">
                                            New Category Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={quickForm.custom_category}
                                            onChange={(e) => setQuickForm({ ...quickForm, custom_category: e.target.value })}
                                            placeholder="e.g. Sculptural Stone"
                                            className="w-full rounded-xl border border-violet-300 bg-violet-50/30 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block font-semibold text-slate-700 mb-1">SKU / Code</label>
                                        <input
                                            type="text"
                                            value={quickForm.sku}
                                            onChange={(e) => setQuickForm({ ...quickForm, sku: e.target.value })}
                                            placeholder="AT-FUR-2026"
                                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Pricing & Discount Controls */}
                            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80 space-y-3">
                                <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                                    <Percent size={13} className="text-violet-600" />
                                    Pricing & Discount Configuration
                                </span>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block font-medium text-slate-600 mb-1">Original Price (৳)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={quickForm.original_price}
                                            onChange={(e) => handleOriginalPriceChange(e.target.value)}
                                            placeholder="150000"
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:border-violet-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-medium text-slate-600 mb-1">Discount %</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={quickForm.discount_percent}
                                                onChange={(e) => handleDiscountPercentChange(e.target.value)}
                                                placeholder="15"
                                                className="w-full rounded-xl border border-slate-200 bg-white pl-3 pr-7 py-1.5 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:border-violet-500"
                                            />
                                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[11px]">%</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-medium text-slate-600 mb-1">Final Selling Price (৳)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={quickForm.price}
                                            onChange={(e) => setQuickForm({ ...quickForm, price: e.target.value })}
                                            placeholder="127500"
                                            className="w-full rounded-xl border border-violet-300 bg-violet-50/40 px-3 py-1.5 text-xs text-violet-900 font-mono font-bold focus:outline-none focus:border-violet-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Stock Quantity */}
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Stock Quantity</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={quickForm.stock_quantity}
                                    onChange={(e) => setQuickForm({ ...quickForm, stock_quantity: e.target.value })}
                                    placeholder="10"
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                                />
                            </div>

                            {/* Summary */}
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Summary / Specifications</label>
                                <textarea
                                    rows={2}
                                    value={quickForm.summary}
                                    onChange={(e) => setQuickForm({ ...quickForm, summary: e.target.value })}
                                    placeholder="Brief specifications, material, dimensions..."
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-violet-500 resize-none"
                                />
                            </div>

                            {/* Feature in Signature Collection Toggle */}
                            <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                                        <Star size={16} className={quickForm.is_featured ? "fill-amber-600 text-amber-600" : "text-amber-600"} />
                                    </div>
                                    <div>
                                        <span className="block font-bold text-slate-900 text-xs">Featured in Signature Collection</span>
                                        <span className="text-[11px] text-slate-500">Highlight this piece on the website homepage</span>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={quickForm.is_featured}
                                        onChange={(e) => setQuickForm({ ...quickForm, is_featured: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                                </label>
                            </div>

                            {/* Submit buttons */}
                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-violet-600 hover:bg-violet-700 px-5 py-2 text-xs font-bold text-white transition shadow-sm disabled:opacity-60 flex items-center gap-1.5"
                                >
                                    {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Piece'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
