import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    ShoppingBag,
    DollarSign,
    Package,
    AlertTriangle,
    Calendar,
    Plus,
    MoreHorizontal,
    MoreVertical,
    CheckCircle2,
    Clock,
    Loader2,
    Truck,
    XCircle,
    User,
} from 'lucide-react';

// Format BDT currency
function formatBDT(amount) {
    const num = Number(amount || 0);
    return 'BDT ' + num.toLocaleString('en-US');
}

// Format date timestamp to match "Oct 4, 09:46 PM"
function formatOrderDate(dateString) {
    if (!dateString) return 'Oct 4, 09:46 PM';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const month = months[d.getMonth()];
    const day = d.getDate();
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours.toString().padStart(2, '0') : '12';
    return `${month} ${day}, ${hours}:${minutes} ${ampm}`;
}

// Calculate pieces and names summary
function getOrderItemsSummary(order) {
    if (!order.items || order.items.length === 0) {
        return {
            countText: '1 piece',
            names: 'Custom architectural furniture item',
        };
    }
    const totalQty = order.items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    const countText = totalQty === 1 ? '1 piece' : `${totalQty} pieces`;
    const names = order.items.map((it) => it.product_name).join(', ');
    return { countText, names };
}

// Status badge renderer matching the photo
function renderStatusBadge(status) {
    switch (status) {
        case 'pending':
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF3C7] border border-amber-200/80 px-3 py-1 text-xs font-semibold text-[#92400E]">
                    <Clock size={13} className="text-amber-600" />
                    Pending
                </span>
            );
        case 'confirmed':
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2563EB] px-3 py-1 text-xs font-semibold text-white shadow-xs">
                    <CheckCircle2 size={13} />
                    Confirmed
                </span>
            );
        case 'processing':
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3E8FF] border border-purple-200 px-3 py-1 text-xs font-semibold text-[#6B21A8]">
                    <Loader2 size={13} className="animate-spin text-purple-600" />
                    Processing
                </span>
            );
        case 'delivered':
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D1FAE5] px-3 py-1 text-xs font-semibold text-[#065F46]">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    Delivered
                </span>
            );
        case 'shipped':
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    <Truck size={13} />
                    Shipped
                </span>
            );
        case 'cancelled':
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                    <XCircle size={13} />
                    Cancelled
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 capitalize">
                    {status}
                </span>
            );
    }
}

export default function Dashboard({ stats = {}, recent_orders = [] }) {
    // Current date format matching photo "Oct 26, 2026 • 10:42 AM"
    const now = new Date();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const formattedDate = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()} • ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    // Fallback sample orders if empty, matching photo exactly
    const ordersList = (recent_orders && recent_orders.length > 0) ? recent_orders : [
        {
            id: 1,
            order_number: 'ORD-20261001-1042',
            placed_at: '2026-10-04T21:46:00',
            customer_name: 'Dr. Tahmid Rahman',
            customer_phone: '+880 1712-345678',
            total_amount: 309000,
            status: 'pending',
            items: [
                { quantity: 1, product_name: 'Aethel Bouclé Lounge Chair' },
                { quantity: 1, product_name: 'Lumina Alabaster Pendant Light' },
            ],
        },
        {
            id: 2,
            order_number: 'ORD-20261002-2891',
            placed_at: '2026-10-03T20:46:00',
            customer_name: 'Farhana Chowdhury',
            customer_phone: '+880 1819-876543',
            total_amount: 184000,
            status: 'confirmed',
            items: [
                { quantity: 1, product_name: 'Travertine Monolith Coffee Table' },
            ],
        },
        {
            id: 3,
            order_number: 'ORD-20261003-4912',
            placed_at: '2026-10-02T23:46:00',
            customer_name: 'Architect Mahfuzul Alam',
            customer_phone: '+880 1911-223344',
            total_amount: 405000,
            status: 'processing',
            items: [
                { quantity: 1, product_name: 'Aethel Bouclé Lounge Chair' },
                { quantity: 1, product_name: 'Komorebi Hand-Knotted Wool Rug' },
            ],
        },
        {
            id: 4,
            order_number: 'ORD-20260928-8721',
            placed_at: '2026-09-28T23:46:00',
            customer_name: 'Nusrat Jahan',
            customer_phone: '+880 1898-998877',
            total_amount: 83500,
            status: 'delivered',
            items: [
                { quantity: 1, product_name: 'Lumina Alabaster Pendant Light' },
            ],
        },
    ];

    const totalOrders = stats.orders ?? ordersList.length;
    const pendingOrders = stats.pending_orders ?? 1;
    const revenueAmount = stats.revenue ? formatBDT(stats.revenue) : 'BDT 672,500';
    const totalProducts = stats.products ?? 8;
    const lowStockCount = stats.low_stock ?? 1;

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            <div className="p-6 lg:p-8 space-y-7 max-w-[1440px] mx-auto">
                {/* 1. Dashboard Top Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Overview of orders, product inventory, and architectural portfolio content.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-3.5">
                        {/* Last Updated Timestamp */}
                        <div className="flex items-center gap-2.5 rounded-xl bg-white border border-slate-200/80 px-3.5 py-2 shadow-2xs">
                            <Calendar size={16} className="text-slate-400" />
                            <div className="flex flex-col text-left leading-tight">
                                <span className="text-[10px] text-slate-400 font-medium">Last updated</span>
                                <span className="text-xs font-bold text-slate-700">{formattedDate}</span>
                            </div>
                        </div>

                        {/* + New Order Button (Golden Amber) */}
                        <Link
                            href="/admin/orders/create"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-950 transition-all shadow-xs hover:shadow-sm"
                        >
                            <Plus size={15} strokeWidth={2.8} />
                            <span>New Order</span>
                        </Link>

                        {/* + Add Product Button (Royal Blue) */}
                        <Link
                            href="/admin/products/create"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition-all shadow-xs hover:shadow-sm"
                        >
                            <Package size={16} />
                            <span>Add Product</span>
                        </Link>
                    </div>
                </div>

                {/* 2. Four Featured Metric KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                    {/* Card 1: Total Orders */}
                    <div className="flex flex-col justify-between rounded-2xl bg-white border border-slate-100 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
                        <div>
                            {/* Card Top */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-xs">
                                        <ShoppingBag size={20} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-800 tracking-tight">Total Orders</span>
                                </div>
                                <button className="text-slate-300 hover:text-slate-500 transition-colors p-1" title="More options">
                                    <MoreHorizontal size={17} />
                                </button>
                            </div>

                            {/* Card Middle: Value + Pending Badge + Sparkline */}
                            <div className="mt-5 flex items-end justify-between">
                                <div className="flex items-center gap-2.5">
                                    <span className="text-3xl font-black text-slate-900 tracking-tight">{totalOrders}</span>
                                    <span className="rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-[11px] font-bold text-[#92400E]">
                                        {pendingOrders} Pending
                                    </span>
                                </div>

                                {/* Blue Sine Sparkline SVG */}
                                <div className="text-blue-500 shrink-0">
                                    <svg className="w-22 h-10 overflow-visible" viewBox="0 0 100 40" fill="none">
                                        <path
                                            d="M0 32 C 20 38, 35 15, 60 25 C 80 32, 90 12, 100 16"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Card Bottom Link */}
                        <div className="mt-4 pt-2">
                            <Link
                                href="/admin/orders"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                <span>Manage orders</span>
                                <span>&rarr;</span>
                            </Link>
                        </div>
                    </div>

                    {/* Card 2: Confirmed Revenue */}
                    <div className="flex flex-col justify-between rounded-2xl bg-white border border-slate-100 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
                        <div>
                            {/* Card Top */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#059669] text-white shadow-xs">
                                        <DollarSign size={20} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-800 tracking-tight">Confirmed Revenue</span>
                                </div>
                                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                                    &uarr; +12%
                                </span>
                            </div>

                            {/* Card Middle: Value + Sparkline */}
                            <div className="mt-5 flex items-end justify-between gap-2">
                                <div>
                                    <span className="text-2xl lg:text-[25px] font-black text-slate-900 tracking-tight">
                                        {revenueAmount}
                                    </span>
                                </div>

                                {/* Emerald Sine Sparkline SVG */}
                                <div className="text-emerald-500 shrink-0">
                                    <svg className="w-22 h-10 overflow-visible" viewBox="0 0 100 40" fill="none">
                                        <path
                                            d="M0 34 C 20 32, 40 22, 60 26 C 75 30, 85 14, 100 10"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Card Bottom Link */}
                        <div className="mt-4 pt-2">
                            <Link
                                href="/admin/orders?payment_status=paid"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                <span>Paid orders breakdown</span>
                                <span>&rarr;</span>
                            </Link>
                        </div>
                    </div>

                    {/* Card 3: Catalog Pieces */}
                    <div className="flex flex-col justify-between rounded-2xl bg-white border border-slate-100 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
                        <div>
                            {/* Card Top */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED] text-white shadow-xs">
                                        <Package size={20} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-800 tracking-tight">Catalog Pieces</span>
                                </div>
                                <span className="inline-flex items-center gap-0.5 rounded-full bg-purple-50 border border-purple-100 px-2 py-0.5 text-[11px] font-bold text-purple-600">
                                    + +2 new
                                </span>
                            </div>

                            {/* Card Middle: Value + Purple Bars Chart */}
                            <div className="mt-5 flex items-end justify-between">
                                <span className="text-3xl font-black text-slate-900 tracking-tight">{totalProducts}</span>

                                {/* Vertical Mini Purple Bars Chart */}
                                <div className="flex items-end gap-1.5 h-9 shrink-0">
                                    <div className="w-2.5 h-4 rounded-t-sm bg-purple-300" />
                                    <div className="w-2.5 h-6 rounded-t-sm bg-purple-400" />
                                    <div className="w-2.5 h-8 rounded-t-sm bg-purple-500" />
                                    <div className="w-2.5 h-9 rounded-t-sm bg-purple-700" />
                                </div>
                            </div>
                        </div>

                        {/* Card Bottom Link */}
                        <div className="mt-4 pt-2">
                            <Link
                                href="/admin/products"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                <span>View inventory & pricing</span>
                                <span>&rarr;</span>
                            </Link>
                        </div>
                    </div>

                    {/* Card 4: Low Stock Alert */}
                    <div className="flex flex-col justify-between rounded-2xl bg-white border border-slate-100 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
                        <div>
                            {/* Card Top */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EF4444] text-white shadow-xs">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-800 tracking-tight">Low Stock Alert</span>
                                </div>
                                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-white text-xs font-black shadow-xs">
                                    !
                                </div>
                            </div>

                            {/* Card Middle: Value + Subtitle + Faint Red Cube */}
                            <div className="mt-5 flex items-end justify-between">
                                <div>
                                    <span className="text-3xl font-black text-slate-900 tracking-tight leading-none block">
                                        {lowStockCount}
                                    </span>
                                    <span className="text-xs text-slate-500 mt-1 block">Items need restock</span>
                                </div>

                                {/* Faint Red 3D Wireframe Cube Illustration */}
                                <div className="text-red-300/70 shrink-0">
                                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
                                        <path d="M12 12l8-4.5" />
                                        <path d="M12 12v9" />
                                        <path d="M12 12L4 7.5" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Card Bottom Link */}
                        <div className="mt-4 pt-2">
                            <Link
                                href="/admin/products?status=low_stock"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                            >
                                <span>Manage stock levels</span>
                                <span>&rarr;</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 3. Recent Orders Card & Table */}
                <div className="rounded-2xl bg-white border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-2xs">
                                <ShoppingBag size={18} />
                            </div>
                            <h2 className="text-base font-bold text-slate-900 tracking-tight">Recent Orders</h2>
                        </div>
                        <Link
                            href="/admin/orders"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            <span>View All Orders</span>
                            <span>&rarr;</span>
                        </Link>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="py-3.5 pl-6 pr-4">Order</th>
                                    <th className="py-3.5 px-4">Customer</th>
                                    <th className="py-3.5 px-4">Items</th>
                                    <th className="py-3.5 px-4">Total</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 pl-4 pr-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/80">
                                {ordersList.map((order) => {
                                    const { countText, names } = getOrderItemsSummary(order);

                                    return (
                                        <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                                            {/* Column 1: Order Number & Timestamp */}
                                            <td className="py-4 pl-6 pr-4 align-middle">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-900 font-mono tracking-tight">
                                                        {order.order_number}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400 mt-0.5">
                                                        {formatOrderDate(order.placed_at || order.created_at)}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Column 2: Customer with Blue Circular Avatar */}
                                            <td className="py-4 px-4 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100/80 text-blue-600 shadow-2xs">
                                                        <User size={14} />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-xs font-bold text-slate-900 truncate">
                                                            {order.customer_name}
                                                        </span>
                                                        <span className="text-[11px] text-slate-400 mt-0.5 truncate">
                                                            {order.customer_phone}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Column 3: Items Quantity & Names snippet */}
                                            <td className="py-4 px-4 align-middle max-w-xs">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-800">
                                                        {countText}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400 truncate max-w-[220px] xl:max-w-xs mt-0.5" title={names}>
                                                        {names}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Column 4: Total Price in Green BDT */}
                                            <td className="py-4 px-4 align-middle whitespace-nowrap">
                                                <span className="text-xs font-bold text-[#059669]">
                                                    {formatBDT(order.total_amount)}
                                                </span>
                                            </td>

                                            {/* Column 5: Status Pill Badge */}
                                            <td className="py-4 px-4 align-middle whitespace-nowrap">
                                                {renderStatusBadge(order.status)}
                                            </td>

                                            {/* Column 6: Action */}
                                            <td className="py-4 pl-4 pr-6 align-middle text-right whitespace-nowrap">
                                                <div className="inline-flex items-center gap-2">
                                                    <Link
                                                        href={`/admin/orders/${order.id}`}
                                                        className="rounded-lg border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-all shadow-2xs"
                                                    >
                                                        View Details
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                                                        title="More actions"
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
