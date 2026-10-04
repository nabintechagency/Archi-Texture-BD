import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Package, Plus, Search, Filter, AlertTriangle, CheckCircle2,
    XCircle, Edit, Trash2, ArrowUpDown, DollarSign, Layers,
    Copy, Check, ExternalLink, RefreshCw, LayoutGrid, List
} from 'lucide-react';
import api from '@/lib/api';

export default function ProductsIndex({ products, inventoryStats = {}, categories = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category || '');
    const [viewMode, setViewMode] = useState('inventory'); // 'inventory' or 'catalog'
    const [copiedSku, setCopiedSku] = useState(null);
    const [updatingStockId, setUpdatingStockId] = useState(null);
    const [stockValues, setStockValues] = useState({});

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/products', {
            search,
            status: statusFilter,
            category: categoryFilter,
        }, { preserveState: true, replace: true });
    };

    const handleFilterChange = (key, val) => {
        const nextFilters = {
            search,
            status: statusFilter,
            category: categoryFilter,
            [key]: val,
        };
        if (key === 'status') setStatusFilter(val);
        if (key === 'category') setCategoryFilter(val);

        router.get('/admin/products', nextFilters, { preserveState: true, replace: true });
    };

    const handleCopySku = (sku) => {
        if (!sku) return;
        navigator.clipboard.writeText(sku);
        setCopiedSku(sku);
        setTimeout(() => setCopiedSku(null), 2000);
    };

    const handleStockChange = (productId, newQuantity) => {
        const val = Math.max(0, parseInt(newQuantity) || 0);
        setStockValues(prev => ({ ...prev, [productId]: val }));
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
        if (confirm(`Are you sure you want to delete product "${name}"?`)) {
            router.delete(`/admin/products/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const formatBdt = (amount) => {
        return `BDT ${Number(amount || 0).toLocaleString('en-US')}`;
    };

    return (
        <AdminLayout title="Products & Inventory">
            <Head title="Admin — Products & Inventory Management" />

            <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
                {/* Header with Title and Add Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                            <Package className="text-amber-400" size={24} />
                            Product Inventory & Stock Management
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">
                            Monitor stock levels, update inventory counts in real-time, and manage catalog pricing.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* View Switcher */}
                        <div className="inline-flex rounded-xl bg-slate-900 border border-slate-800 p-1">
                            <button
                                onClick={() => setViewMode('inventory')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                    viewMode === 'inventory'
                                        ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <List size={14} /> Inventory Table
                            </button>
                            <button
                                onClick={() => setViewMode('catalog')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                    viewMode === 'catalog'
                                        ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <LayoutGrid size={14} /> Catalog Cards
                            </button>
                        </div>

                        <Link
                            href="/admin/products/create"
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20"
                        >
                            <Plus size={16} />
                            Add Product
                        </Link>
                    </div>
                </div>

                {/* Inventory KPI Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Products</span>
                        <div className="mt-2 text-2xl font-bold text-white">
                            {inventoryStats.total_products ?? 0}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">Active catalogue SKUs</p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">In Stock</span>
                        <div className="mt-2 text-2xl font-bold text-emerald-400">
                            {inventoryStats.in_stock ?? 0}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">&gt; 5 units available</p>
                    </div>

                    <div
                        onClick={() => handleFilterChange('status', 'low_stock')}
                        className={`rounded-2xl border p-4 cursor-pointer transition ${
                            statusFilter === 'low_stock'
                                ? 'border-amber-500 bg-amber-500/10'
                                : 'border-amber-500/30 bg-slate-900/60 hover:border-amber-500/60'
                        }`}
                    >
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 flex items-center justify-between">
                            Low Stock
                            <AlertTriangle size={13} />
                        </span>
                        <div className="mt-2 text-2xl font-bold text-amber-400">
                            {inventoryStats.low_stock ?? 0}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">1 to 5 units left</p>
                    </div>

                    <div
                        onClick={() => handleFilterChange('status', 'out_of_stock')}
                        className={`rounded-2xl border p-4 cursor-pointer transition ${
                            statusFilter === 'out_of_stock'
                                ? 'border-red-500 bg-red-500/10'
                                : 'border-red-500/30 bg-slate-900/60 hover:border-red-500/60'
                        }`}
                    >
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-red-400 flex items-center justify-between">
                            Out of Stock
                            <XCircle size={13} />
                        </span>
                        <div className="mt-2 text-2xl font-bold text-red-400">
                            {inventoryStats.out_of_stock ?? 0}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">0 units available</p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 col-span-2 sm:col-span-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Inventory Valuation</span>
                        <div className="mt-2 text-lg font-bold text-amber-300 truncate" title={formatBdt(inventoryStats.total_value)}>
                            {formatBdt(inventoryStats.total_value)}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">Price × stock quantity</p>
                    </div>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by product name, SKU, or category..."
                                className="w-full rounded-xl border border-slate-700 bg-slate-950/70 pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                        </div>

                        {/* Category filter */}
                        <select
                            value={categoryFilter}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2 text-sm text-slate-300 focus:border-amber-500 focus:outline-none"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        {/* Stock Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2 text-sm text-slate-300 focus:border-amber-500 focus:outline-none"
                        >
                            <option value="">All Stock Levels</option>
                            <option value="in_stock">In Stock (&gt; 5)</option>
                            <option value="low_stock">⚠️ Low Stock (1–5)</option>
                            <option value="out_of_stock">❌ Out of Stock (0)</option>
                            <option value="published">Status: Published</option>
                            <option value="draft">Status: Draft</option>
                        </select>

                        <button
                            type="submit"
                            className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition"
                        >
                            Filter
                        </button>

                        {(search || statusFilter || categoryFilter) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    setStatusFilter('');
                                    setCategoryFilter('');
                                    router.get('/admin/products');
                                }}
                                className="rounded-xl border border-slate-700 px-3 py-2 text-xs text-slate-400 hover:text-white transition"
                            >
                                Reset
                            </button>
                        )}
                    </form>
                </div>

                {/* View 1: Inventory Table with Direct Stock Steppers */}
                {viewMode === 'inventory' ? (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-300">
                                <thead className="bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                                    <tr>
                                        <th className="px-6 py-4">Product & SKU</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Unit Price</th>
                                        <th className="px-6 py-4">Stock Level</th>
                                        <th className="px-6 py-4">Quick Adjust Stock</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {products.data?.length > 0 ? (
                                        products.data.map((item) => {
                                            const currentVal = stockValues[item.id] !== undefined ? stockValues[item.id] : item.stock_quantity;
                                            const isDirty = stockValues[item.id] !== undefined && stockValues[item.id] !== item.stock_quantity;
                                            const isLow = item.stock_quantity > 0 && item.stock_quantity <= 5;
                                            const isOut = item.stock_quantity <= 0;

                                            return (
                                                <tr key={item.id} className="hover:bg-slate-800/40 transition">
                                                    {/* Product & SKU */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3.5">
                                                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-700 bg-slate-800">
                                                                {item.featured_image ? (
                                                                    <img src={item.featured_image} alt={item.name} className="h-full w-full object-cover" />
                                                                ) : (
                                                                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-500 font-mono">
                                                                        N/A
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <Link
                                                                    href={`/admin/products/${item.id}/edit`}
                                                                    className="font-medium text-white hover:text-amber-400 transition text-sm"
                                                                >
                                                                    {item.name}
                                                                </Link>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    {item.sku ? (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleCopySku(item.sku)}
                                                                            className="inline-flex items-center gap-1 rounded bg-slate-800 px-1.5 py-0.5 text-[11px] font-mono text-slate-400 hover:text-white hover:bg-slate-700 transition"
                                                                            title="Click to copy SKU"
                                                                        >
                                                                            {copiedSku === item.sku ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                                                                            {item.sku}
                                                                        </button>
                                                                    ) : (
                                                                        <span className="text-[11px] text-slate-600 font-mono">No SKU</span>
                                                                    )}
                                                                    {item.is_featured && (
                                                                        <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                                                                            ★ Featured
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Category */}
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex rounded-lg bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300">
                                                            {item.category || 'General'}
                                                        </span>
                                                    </td>

                                                    {/* Unit Price */}
                                                    <td className="px-6 py-4 font-medium text-emerald-400 text-sm">
                                                        {item.price ? formatBdt(item.price) : '—'}
                                                    </td>

                                                    {/* Stock Level Badge */}
                                                    <td className="px-6 py-4">
                                                        {isOut ? (
                                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-400 border border-red-500/30">
                                                                <XCircle size={13} /> Out of Stock (0)
                                                            </span>
                                                        ) : isLow ? (
                                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/30">
                                                                <AlertTriangle size={13} /> Low ({item.stock_quantity})
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                                                                <CheckCircle2 size={13} /> In Stock ({item.stock_quantity})
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Quick Adjust Stock */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="inline-flex items-center rounded-xl border border-slate-700 bg-slate-950 p-0.5">
                                                                <button
                                                                    type="button"
                                                                    disabled={updatingStockId === item.id}
                                                                    onClick={() => handleStockStep(item, -1)}
                                                                    className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition disabled:opacity-50"
                                                                    title="Decrease stock by 1"
                                                                >
                                                                    -
                                                                </button>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={currentVal}
                                                                    onChange={(e) => handleStockChange(item.id, e.target.value)}
                                                                    className="w-14 text-center bg-transparent py-0.5 text-xs font-bold text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    disabled={updatingStockId === item.id}
                                                                    onClick={() => handleStockStep(item, 1)}
                                                                    className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition disabled:opacity-50"
                                                                    title="Increase stock by 1"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>

                                                            {isDirty && (
                                                                <button
                                                                    type="button"
                                                                    disabled={updatingStockId === item.id}
                                                                    onClick={() => handleQuickStockSave(item.id, item.stock_quantity)}
                                                                    className="rounded-lg bg-emerald-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-emerald-500 transition shadow"
                                                                    title="Save new stock count"
                                                                >
                                                                    {updatingStockId === item.id ? '...' : 'Save'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                            item.status === 'published'
                                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                                : item.status === 'draft'
                                                                ? 'bg-amber-500/20 text-amber-400'
                                                                : 'bg-slate-500/20 text-slate-400'
                                                        }`}>
                                                            {item.status}
                                                        </span>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Link
                                                                href={`/admin/products/${item.id}/edit`}
                                                                className="rounded-lg bg-slate-800 p-2 text-slate-400 hover:bg-indigo-600 hover:text-white transition"
                                                                title="Edit Product"
                                                            >
                                                                <Edit size={14} />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(item.id, item.name)}
                                                                className="rounded-lg bg-slate-800 p-2 text-slate-400 hover:bg-red-600 hover:text-white transition"
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
                                            <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                                No products found matching your active filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* View 2: Catalog Card Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {products.data?.map((item) => (
                            <div
                                key={item.id}
                                className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden hover:border-slate-700 transition shadow-lg"
                            >
                                <div>
                                    {/* Image & Quick Badges */}
                                    <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                                        {item.featured_image ? (
                                            <img
                                                src={item.featured_image}
                                                alt={item.name}
                                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-xs text-slate-500 font-mono">
                                                No Image
                                            </div>
                                        )}
                                        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold backdrop-blur-md ${
                                                item.status === 'published' ? 'bg-emerald-500/80 text-white' : 'bg-slate-700/80 text-slate-300'
                                            }`}>
                                                {item.status}
                                            </span>
                                            {item.is_featured && (
                                                <span className="rounded-full bg-amber-500/90 text-slate-950 px-2 py-0.5 text-[11px] font-bold backdrop-blur-md">
                                                    ★ Featured
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 space-y-2">
                                        <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                                            {item.category || 'Architecture / Furniture'}
                                        </div>
                                        <h3 className="font-semibold text-white text-base line-clamp-1">
                                            {item.name}
                                        </h3>
                                        {item.sku && (
                                            <p className="font-mono text-xs text-slate-400">
                                                SKU: {item.sku}
                                            </p>
                                        )}
                                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                                            {item.summary || item.description || 'No description provided.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-slate-800/80 p-4 bg-slate-950/40">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-base font-bold text-emerald-400">
                                            {item.price ? formatBdt(item.price) : 'Price on req'}
                                        </span>
                                        <span className={`text-xs font-semibold ${
                                            item.stock_quantity <= 0
                                                ? 'text-red-400'
                                                : item.stock_quantity <= 5
                                                ? 'text-amber-400'
                                                : 'text-slate-400'
                                        }`}>
                                            {item.stock_quantity} in stock
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/products/${item.id}/edit`}
                                            className="flex-1 rounded-xl bg-slate-800 py-2 text-center text-xs font-semibold text-white hover:bg-indigo-600 transition"
                                        >
                                            Edit Details
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item.id, item.name)}
                                            className="rounded-xl bg-slate-800 p-2 text-slate-400 hover:bg-red-600 hover:text-white transition"
                                        >
                                            <Trash2 size={15} />
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
                                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                    link.active
                                        ? 'bg-amber-500 text-slate-950 font-bold'
                                        : link.url
                                        ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                        : 'text-slate-600 cursor-not-allowed'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
