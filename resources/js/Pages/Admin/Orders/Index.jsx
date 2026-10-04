import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ShoppingBag, Search, Plus, Filter, CheckCircle2, Clock,
    Truck, Package, AlertCircle, XCircle, ArrowRight, Eye,
    Trash2, DollarSign, Calendar, Phone, MapPin, Copy, Check
} from 'lucide-react';

export default function OrdersIndex({ orders, orderStats = {}, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [paymentFilter, setPaymentFilter] = useState(filters.payment_status || 'all');
    const [copiedOrder, setCopiedOrder] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

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

    const formatBdt = (val) => `BDT ${Number(val || 0).toLocaleString('en-US')}`;

    const statusPill = (status) => {
        switch (status) {
            case 'pending':
                return <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/30"><Clock size={11} /> Pending</span>;
            case 'confirmed':
                return <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 px-2.5 py-0.5 text-xs font-semibold text-sky-400 border border-sky-500/30"><CheckCircle2 size={11} /> Confirmed</span>;
            case 'processing':
                return <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/30"><Package size={11} /> Processing</span>;
            case 'shipped':
                return <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/15 px-2.5 py-0.5 text-xs font-semibold text-purple-400 border border-purple-500/30"><Truck size={11} /> Shipped</span>;
            case 'delivered':
                return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30"><CheckCircle2 size={11} /> Delivered</span>;
            case 'cancelled':
                return <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-semibold text-red-400 border border-red-500/30"><XCircle size={11} /> Cancelled</span>;
            default:
                return <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/15 px-2.5 py-0.5 text-xs font-semibold text-slate-400 border border-slate-500/30">{status}</span>;
        }
    };

    const paymentPill = (paymentStatus) => {
        switch (paymentStatus) {
            case 'paid':
                return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">● Paid</span>;
            case 'pending':
                return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">○ Unpaid</span>;
            case 'failed':
                return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">✕ Failed</span>;
            case 'refunded':
                return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">↺ Refunded</span>;
            default:
                return <span className="text-slate-400 text-xs">{paymentStatus}</span>;
        }
    };

    return (
        <AdminLayout title="Order Management">
            <Head title="Admin — Orders & Fulfillment" />

            <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                            <ShoppingBag className="text-amber-400" size={24} />
                            Orders & Client Fulfillment
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">
                            Review customer orders, update delivery tracking status, and manage sales revenue.
                        </p>
                    </div>

                    <Link
                        href="/admin/orders/create"
                        className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
                    >
                        <Plus size={16} />
                        Create Manual Order
                    </Link>
                </div>

                {/* Executive Order KPI Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                    <div
                        onClick={() => handleStatusTab('all')}
                        className={`rounded-2xl border p-4 cursor-pointer transition ${
                            statusFilter === 'all'
                                ? 'border-indigo-500 bg-indigo-500/10'
                                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                        }`}
                    >
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Orders</span>
                        <div className="mt-2 text-2xl font-bold text-white">{orderStats.total ?? 0}</div>
                        <p className="text-[11px] text-slate-500 mt-0.5">All time orders</p>
                    </div>

                    <div
                        onClick={() => handleStatusTab('pending')}
                        className={`rounded-2xl border p-4 cursor-pointer transition ${
                            statusFilter === 'pending'
                                ? 'border-amber-500 bg-amber-500/10'
                                : 'border-amber-500/30 bg-slate-900/60 hover:border-amber-500/60'
                        }`}
                    >
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 flex items-center justify-between">
                            Pending Review
                            <Clock size={13} />
                        </span>
                        <div className="mt-2 text-2xl font-bold text-amber-400">{orderStats.pending ?? 0}</div>
                        <p className="text-[11px] text-slate-500 mt-0.5">Awaiting confirmation</p>
                    </div>

                    <div
                        onClick={() => handleStatusTab('processing')}
                        className={`rounded-2xl border p-4 cursor-pointer transition ${
                            statusFilter === 'processing'
                                ? 'border-sky-500 bg-sky-500/10'
                                : 'border-slate-800 bg-slate-900/60 hover:border-sky-500/40'
                        }`}
                    >
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-400 flex items-center justify-between">
                            Active Fulfillment
                            <Truck size={13} />
                        </span>
                        <div className="mt-2 text-2xl font-bold text-sky-400">{orderStats.processing ?? 0}</div>
                        <p className="text-[11px] text-slate-500 mt-0.5">In production / transit</p>
                    </div>

                    <div
                        onClick={() => handleStatusTab('delivered')}
                        className={`rounded-2xl border p-4 cursor-pointer transition ${
                            statusFilter === 'delivered'
                                ? 'border-emerald-500 bg-emerald-500/10'
                                : 'border-slate-800 bg-slate-900/60 hover:border-emerald-500/40'
                        }`}
                    >
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center justify-between">
                            Delivered
                            <CheckCircle2 size={13} />
                        </span>
                        <div className="mt-2 text-2xl font-bold text-emerald-400">{orderStats.delivered ?? 0}</div>
                        <p className="text-[11px] text-slate-500 mt-0.5">Successfully fulfilled</p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 col-span-2 sm:col-span-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Paid Revenue</span>
                        <div className="mt-2 text-lg font-bold text-emerald-400 truncate" title={formatBdt(orderStats.total_sales)}>
                            {formatBdt(orderStats.total_sales)}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">Confirmed collections</p>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
                    {/* Status Tabs */}
                    <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-3">
                        {[
                            { key: 'all', label: 'All Orders' },
                            { key: 'pending', label: 'Pending' },
                            { key: 'confirmed', label: 'Confirmed' },
                            { key: 'processing', label: 'Processing' },
                            { key: 'shipped', label: 'Shipped' },
                            { key: 'delivered', label: 'Delivered' },
                            { key: 'cancelled', label: 'Cancelled' },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => handleStatusTab(tab.key)}
                                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                                    statusFilter === tab.key
                                        ? 'bg-amber-500 text-slate-950 shadow-md'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search & Payment Dropdown */}
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by Order #, Customer Name, Phone, or Email..."
                                className="w-full rounded-xl border border-slate-700 bg-slate-950/70 pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                            />
                        </div>

                        <select
                            value={paymentFilter}
                            onChange={(e) => handlePaymentFilterChange(e.target.value)}
                            className="rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2 text-sm text-slate-300 focus:border-amber-500 focus:outline-none"
                        >
                            <option value="all">All Payment Statuses</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Payment Pending</option>
                            <option value="failed">Payment Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>

                        <button
                            type="submit"
                            className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition"
                        >
                            Search
                        </button>

                        {(search || statusFilter !== 'all' || paymentFilter !== 'all') && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    setStatusFilter('all');
                                    setPaymentFilter('all');
                                    router.get('/admin/orders');
                                }}
                                className="rounded-xl border border-slate-700 px-3 py-2 text-xs text-slate-400 hover:text-white transition"
                            >
                                Reset Filters
                            </button>
                        )}
                    </form>
                </div>

                {/* Orders Data Table */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4">Order Details</th>
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Items Summary</th>
                                    <th className="px-6 py-4">Total Amount</th>
                                    <th className="px-6 py-4">Payment</th>
                                    <th className="px-6 py-4">Fulfillment Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {orders.data?.length > 0 ? (
                                    orders.data.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-800/40 transition">
                                            {/* Order Number & Date */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 font-mono font-medium text-white text-xs">
                                                    <Link
                                                        href={`/admin/orders/${order.id}`}
                                                        className="hover:text-amber-400 transition"
                                                    >
                                                        {order.order_number}
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopy(order.order_number)}
                                                        className="text-slate-500 hover:text-slate-300 transition"
                                                        title="Copy order number"
                                                    >
                                                        {copiedOrder === order.order_number ? (
                                                            <Check size={12} className="text-emerald-400" />
                                                        ) : (
                                                            <Copy size={12} />
                                                        )}
                                                    </button>
                                                </div>
                                                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                                                    <Calendar size={11} />
                                                    {new Date(order.placed_at || order.created_at).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </td>

                                            {/* Customer */}
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-white text-sm">
                                                    {order.customer_name}
                                                </div>
                                                <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                                    <Phone size={11} className="text-slate-500" />
                                                    {order.customer_phone}
                                                </div>
                                                <div className="text-[11px] text-slate-500 truncate max-w-[180px] flex items-center gap-1 mt-0.5">
                                                    <MapPin size={10} className="text-slate-600" />
                                                    {order.city ? `${order.city}: ` : ''}{order.shipping_address}
                                                </div>
                                            </td>

                                            {/* Items Summary */}
                                            <td className="px-6 py-4">
                                                <div className="text-xs text-slate-300 font-medium">
                                                    {order.items?.length ?? 0} {order.items?.length === 1 ? 'piece' : 'pieces'}
                                                </div>
                                                <div className="text-[11px] text-slate-500 line-clamp-2 max-w-[220px] mt-0.5">
                                                    {order.items?.map((item) => `${item.quantity}x ${item.product_name}`).join(', ') || 'Custom pieces'}
                                                </div>
                                            </td>

                                            {/* Total */}
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-emerald-400 text-sm">
                                                    {formatBdt(order.total_amount)}
                                                </div>
                                                <div className="text-[10px] uppercase tracking-wider text-slate-500 mt-0.5 font-medium">
                                                    {order.payment_method?.replace(/_/g, ' ') || 'Cash on delivery'}
                                                </div>
                                            </td>

                                            {/* Payment Status */}
                                            <td className="px-6 py-4">
                                                {paymentPill(order.payment_status)}
                                            </td>

                                            {/* Fulfillment Status + Quick Selector */}
                                            <td className="px-6 py-4">
                                                <div className="space-y-1.5">
                                                    {statusPill(order.status)}

                                                    <select
                                                        disabled={updatingId === order.id}
                                                        value={order.status}
                                                        onChange={(e) => handleQuickStatusChange(order.id, e.target.value)}
                                                        className="block text-[11px] rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-slate-300 hover:border-slate-500 focus:outline-none"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/orders/${order.id}`}
                                                        className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-amber-500 hover:text-slate-950 transition"
                                                        title="View full order details"
                                                    >
                                                        <Eye size={13} />
                                                        Details
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteOrder(order.id, order.order_number)}
                                                        className="rounded-lg bg-slate-800 p-1.5 text-slate-400 hover:bg-red-600 hover:text-white transition"
                                                        title="Delete order"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-16 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <ShoppingBag size={32} className="text-slate-600 mb-2" />
                                                <p className="text-base font-medium text-slate-300">No orders found</p>
                                                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                                                    {search || statusFilter !== 'all' || paymentFilter !== 'all'
                                                        ? 'Try clearing active search or filters.'
                                                        : 'Orders placed on the website or created manually will appear here.'}
                                                </p>
                                                <Link
                                                    href="/admin/orders/create"
                                                    className="mt-4 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-950 hover:bg-amber-400 transition"
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

                {/* Pagination */}
                {orders.links && orders.links.length > 3 && (
                    <div className="flex items-center justify-center gap-1.5 pt-4">
                        {orders.links.map((link, idx) => (
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
