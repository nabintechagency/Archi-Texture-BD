import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    ShoppingBag, Search, Plus, Filter, CheckCircle2, Clock,
    Truck, Package, AlertCircle, XCircle, ArrowRight, Eye,
    Trash2, DollarSign, Calendar, Phone, MapPin, Copy, Check,
    ExternalLink, ChevronRight, User, TrendingUp, Sparkles, CreditCard, RotateCw
} from 'lucide-react';

export default function OrdersIndex({ orders, orderStats = {}, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [paymentFilter, setPaymentFilter] = useState(filters.payment_status || 'all');
    const [copiedOrder, setCopiedOrder] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Auto-refresh orders list every 30 seconds for live new orders
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ preserveScroll: true, preserveState: true });
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setIsRefreshing(false),
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/orders', {
            search,
            status: statusFilter,
            payment_status: paymentFilter,
        }, { preserveState: true, replace: true });
    };

    const handleStatusTab = (status) => {
        setStatusFilter(status);
        router.get('/admin/orders', {
            search,
            status,
            payment_status: paymentFilter,
        }, { preserveState: true, replace: true });
    };

    const handlePaymentFilterChange = (val) => {
        setPaymentFilter(val);
        router.get('/admin/orders', {
            search,
            status: statusFilter,
            payment_status: val,
        }, { preserveState: true, replace: true });
    };

    const handleQuickStatusChange = (orderId, newStatus) => {
        setUpdatingId(orderId);
        router.patch(`/admin/orders/${orderId}/status`, {
            status: newStatus,
        }, {
            preserveScroll: true,
            onFinish: () => setUpdatingId(null),
        });
    };

    const handleDeleteOrder = (orderId, orderNumber) => {
        if (confirm(`Are you sure you want to delete order ${orderNumber}? This will remove all associated line items.`)) {
            router.delete(`/admin/orders/${orderId}`, {
                preserveScroll: true,
            });
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedOrder(text);
        setTimeout(() => setCopiedOrder(null), 2000);
    };

    const formatBdt = (val) => `৳ ${Number(val || 0).toLocaleString('en-US')}`;

    const formatOrderDate = (dateString) => {
        if (!dateString) return 'Just now';
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return dateString;
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return `${months[d.getMonth()]} ${d.getDate()}, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    };

    const statusPill = (status) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-300 px-2.5 py-1 text-xs font-extrabold text-amber-900 shadow-2xs">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        New Order
                    </span>
                );
            case 'confirmed':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-bold text-blue-700">
                        <CheckCircle2 size={12} className="text-blue-600" /> Confirmed
                    </span>
                );
            case 'processing':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200 px-2.5 py-1 text-xs font-bold text-purple-700">
                        <Package size={12} className="text-purple-600" /> Processing
                    </span>
                );
            case 'shipped':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-2.5 py-1 text-xs font-bold text-sky-700">
                        <Truck size={12} className="text-sky-600" /> Shipped
                    </span>
                );
            case 'delivered':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-800">
                        <CheckCircle2 size={12} className="text-emerald-600" /> Delivered
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-1 text-xs font-bold text-rose-700">
                        <XCircle size={12} className="text-rose-600" /> Cancelled
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 capitalize">
                        {status}
                    </span>
                );
        }
    };

    const paymentPill = (paymentStatus) => {
        switch (paymentStatus) {
            case 'paid':
                return (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Paid
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Unpaid
                    </span>
                );
            case 'failed':
                return (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Failed
                    </span>
                );
            case 'refunded':
                return (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                        ↺ Refunded
                    </span>
                );
            default:
                return <span className="text-slate-500 text-xs font-medium">{paymentStatus}</span>;
        }
    };

    return (
        <AdminLayout title="Client Orders & Sales Fulfillment">
            <Head title="Orders & Fulfillment — Archi Texture BD" />

            <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto">
                {/* 1. Header Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Orders & Fulfillment
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Track client transactions, verify payment statuses, and manage delivery schedules.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition shadow-2xs"
                            title="Refresh orders for new incoming requests"
                        >
                            <RotateCw size={14} className={isRefreshing ? 'animate-spin text-violet-600' : 'text-slate-400'} />
                            <span>{isRefreshing ? 'Refreshing...' : 'Live Refresh'}</span>
                        </button>

                        <Link
                            href="/admin/orders/create"
                            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-sm shadow-violet-500/20"
                        >
                            <Plus size={16} strokeWidth={2.5} />
                            <span>Create Manual Order</span>
                        </Link>
                    </div>
                </div>

                {/* 2. Top Metric KPI Row (CareOps Aesthetic: Pure white cards with clear typography) */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div
                        onClick={() => handleStatusTab('all')}
                        className={`rounded-2xl border p-5 cursor-pointer transition shadow-xs ${
                            statusFilter === 'all'
                                ? 'bg-violet-50/50 border-violet-400 ring-2 ring-violet-500/20'
                                : 'bg-white border-slate-100 hover:border-slate-300'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500">Total Orders</span>
                            <ShoppingBag size={16} className="text-slate-400" />
                        </div>
                        <div className="mt-2 text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                            {orderStats.total ?? 0}
                        </div>
                        <span className="text-[11px] text-slate-400 mt-1 block">All lifetime orders</span>
                    </div>

                    <div
                        onClick={() => handleStatusTab('pending')}
                        className={`rounded-2xl border p-5 cursor-pointer transition shadow-xs ${
                            statusFilter === 'pending'
                                ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-500/20'
                                : 'bg-white border-slate-100 hover:border-amber-300'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-800">New Incoming Orders</span>
                            <Clock size={16} className="text-amber-500" />
                        </div>
                        <div className="mt-2 text-2xl lg:text-3xl font-black text-amber-600 tracking-tight flex items-baseline gap-2">
                            {orderStats.pending ?? 0}
                            {(orderStats.pending ?? 0) > 0 && (
                                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                                    New
                                </span>
                            )}
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 block">Awaiting confirmation</span>
                    </div>

                    <div
                        onClick={() => handleStatusTab('processing')}
                        className={`rounded-2xl border p-5 cursor-pointer transition shadow-xs ${
                            statusFilter === 'processing'
                                ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/20'
                                : 'bg-white border-slate-100 hover:border-blue-300'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-blue-700">In Production / Transit</span>
                            <Truck size={16} className="text-blue-500" />
                        </div>
                        <div className="mt-2 text-2xl lg:text-3xl font-extrabold text-blue-700 tracking-tight">
                            {orderStats.processing ?? 0}
                        </div>
                        <span className="text-[11px] text-slate-400 mt-1 block">Active fulfillment</span>
                    </div>

                    <div
                        onClick={() => handleStatusTab('delivered')}
                        className={`rounded-2xl border p-5 cursor-pointer transition shadow-xs ${
                            statusFilter === 'delivered'
                                ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/20'
                                : 'bg-white border-slate-100 hover:border-emerald-300'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-emerald-700">Completed & Delivered</span>
                            <CheckCircle2 size={16} className="text-emerald-500" />
                        </div>
                        <div className="mt-2 text-2xl lg:text-3xl font-extrabold text-emerald-700 tracking-tight">
                            {orderStats.delivered ?? 0}
                        </div>
                        <span className="text-[11px] text-slate-400 mt-1 block">Successfully handed over</span>
                    </div>

                    <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-xs col-span-2 sm:col-span-1">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500">Paid Revenue</span>
                            <CreditCard size={16} className="text-emerald-500" />
                        </div>
                        <div className="mt-2 text-xl sm:text-2xl font-extrabold text-slate-900 truncate tracking-tight">
                            {formatBdt(orderStats.total_sales)}
                        </div>
                        <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Confirmed collections</span>
                    </div>
                </div>

                {/* 3. Status Tabs Navigation */}
                <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                        {[
                            { key: 'all', label: 'All Orders', count: orderStats.total },
                            { key: 'pending', label: '⭐ New Orders', count: orderStats.pending },
                            { key: 'confirmed', label: 'Confirmed', count: orderStats.confirmed },
                            { key: 'processing', label: 'Processing', count: orderStats.processing },
                            { key: 'shipped', label: 'Shipped', count: orderStats.shipped },
                            { key: 'delivered', label: 'Delivered', count: orderStats.delivered },
                            { key: 'cancelled', label: 'Cancelled', count: orderStats.cancelled },
                        ].map((tab) => {
                            const isCurrent = statusFilter === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => handleStatusTab(tab.key)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                        isCurrent
                                            ? 'bg-violet-600 text-white shadow-xs'
                                            : 'bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    {tab.count !== undefined && (
                                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                            isCurrent ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                                        }`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 4. Search and Payment Status Filter Toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-96">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by order #, client name, phone..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/10 transition shadow-2xs"
                        />
                    </form>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <select
                            value={paymentFilter}
                            onChange={(e) => handlePaymentFilterChange(e.target.value)}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-violet-500 focus:outline-none"
                        >
                            <option value="all">All Payment Statuses</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Payment Pending</option>
                            <option value="failed">Payment Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>
                </div>

                {/* 5. Orders Table (Clean Minimalist CareOps Aesthetic) */}
                <div className="rounded-2xl bg-white border border-slate-100 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="py-3.5 pl-6 pr-4">Order Reference</th>
                                    <th className="py-3.5 px-4">Client & Address</th>
                                    <th className="py-3.5 px-4">Architectural Pieces</th>
                                    <th className="py-3.5 px-4">Order Total</th>
                                    <th className="py-3.5 px-4">Payment</th>
                                    <th className="py-3.5 px-4">Fulfillment Status</th>
                                    <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {orders.data && orders.data.length > 0 ? (
                                    orders.data.map((order) => {
                                        const totalQty = order.items?.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0) || 1;

                                        return (
                                            <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                                                {/* Column 1: Order Number & Timestamp */}
                                                <td className="py-4 pl-6 pr-4 align-middle">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <span className="font-mono font-extrabold text-slate-900 block text-xs">
                                                            {order.order_number}
                                                        </span>
                                                        {order.status === 'pending' && (
                                                            <span className="inline-flex items-center px-1.5 py-0.2 rounded-md text-[9px] font-black tracking-wider bg-amber-400 text-slate-950 uppercase animate-pulse shadow-2xs">
                                                                NEW
                                                            </span>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCopy(order.order_number)}
                                                            className="text-slate-400 hover:text-slate-600 transition"
                                                            title="Copy Order #"
                                                        >
                                                            {copiedOrder === order.order_number ? (
                                                                <Check size={11} className="text-emerald-500" />
                                                            ) : (
                                                                <Copy size={11} />
                                                            )}
                                                        </button>
                                                    </div>
                                                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                                                        {formatOrderDate(order.placed_at || order.created_at)}
                                                    </span>
                                                </td>

                                                {/* Column 2: Client Profile */}
                                                <td className="py-4 px-4 align-middle">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700 font-bold text-xs">
                                                            {order.customer_name?.[0]?.toUpperCase() ?? 'C'}
                                                        </div>
                                                        <div className="min-w-0 flex flex-col">
                                                            <span className="font-bold text-slate-900 truncate">
                                                                {order.customer_name}
                                                            </span>
                                                            <span className="text-[11px] text-slate-500 font-mono mt-0.5">
                                                                {order.customer_phone}
                                                            </span>
                                                            {order.shipping_address && (
                                                                <span className="text-[10px] text-slate-400 truncate max-w-[180px] mt-0.5" title={order.shipping_address}>
                                                                    {order.shipping_address}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Column 3: Items summary */}
                                                <td className="py-4 px-4 align-middle max-w-[220px]">
                                                    <span className="font-bold text-slate-800 block">
                                                        {totalQty} {totalQty === 1 ? 'piece' : 'pieces'}
                                                    </span>
                                                    <span
                                                        className="text-[11px] text-slate-400 truncate block mt-0.5"
                                                        title={order.items?.map(i => `${i.quantity}x ${i.product_name}`).join(', ')}
                                                    >
                                                        {order.items?.map(i => `${i.quantity}x ${i.product_name}`).join(', ') || 'Custom item'}
                                                    </span>
                                                </td>

                                                {/* Column 4: Total Amount */}
                                                <td className="py-4 px-4 align-middle font-mono font-bold text-slate-900 whitespace-nowrap">
                                                    <div className="text-xs sm:text-sm font-extrabold text-charcoal">
                                                        {formatBdt(order.total_amount)}
                                                    </div>
                                                    <span className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5 block font-sans font-medium">
                                                        {order.payment_method?.replace(/_/g, ' ') || 'Cash on Delivery'}
                                                    </span>
                                                </td>

                                                {/* Column 5: Payment Status */}
                                                <td className="py-4 px-4 align-middle whitespace-nowrap">
                                                    {paymentPill(order.payment_status)}
                                                </td>

                                                {/* Column 6: Fulfillment Status */}
                                                <td className="py-4 px-4 align-middle whitespace-nowrap">
                                                    <div className="space-y-1.5">
                                                        {statusPill(order.status)}

                                                        <select
                                                            disabled={updatingId === order.id}
                                                            value={order.status}
                                                            onChange={(e) => handleQuickStatusChange(order.id, e.target.value)}
                                                            className="block text-[11px] font-medium rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-700 hover:border-violet-400 focus:outline-none transition shadow-2xs"
                                                        >
                                                            <option value="pending">⭐ New Order (Pending)</option>
                                                            <option value="confirmed">Confirmed</option>
                                                            <option value="processing">In Production / Processing</option>
                                                            <option value="shipped">Dispatched / Shipped</option>
                                                            <option value="delivered">Delivered to Client</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </div>
                                                </td>

                                                {/* Column 7: Actions */}
                                                <td className="py-4 pl-4 pr-6 align-middle text-right whitespace-nowrap">
                                                    <div className="inline-flex items-center gap-1.5">
                                                        <Link
                                                            href={`/admin/orders/${order.id}`}
                                                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:text-violet-700 hover:bg-slate-50 transition shadow-2xs"
                                                            title="Inspect Order Details & Print Invoice"
                                                        >
                                                            <Eye size={13} className="text-slate-400" />
                                                            <span>Details</span>
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteOrder(order.id, order.order_number)}
                                                            className="rounded-lg border border-slate-200 bg-white p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 transition shadow-2xs"
                                                            title="Delete Order"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-16 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                                                    <ShoppingBag size={22} />
                                                </div>
                                                <p className="text-sm font-bold text-slate-700">No orders found</p>
                                                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                                                    {search || statusFilter !== 'all' || paymentFilter !== 'all'
                                                        ? 'No results matched your search or status filter.'
                                                        : 'Orders placed on the website or created manually will appear here.'}
                                                </p>
                                                <Link
                                                    href="/admin/orders/create"
                                                    className="mt-4 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-700 transition shadow-xs"
                                                >
                                                    + Create First Order
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 6. Pagination */}
                {orders.links && orders.links.length > 3 && (
                    <div className="flex items-center justify-center gap-1.5 pt-4">
                        {orders.links.map((link, idx) => (
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
        </AdminLayout>
    );
}
