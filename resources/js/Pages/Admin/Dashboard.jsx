import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ShoppingBag,
    Package,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Plus,
    MoreHorizontal,
    MoreVertical,
    Clock,
    CheckCircle2,
    Loader2,
    Truck,
    XCircle,
    Layers,
    Filter,
    Download,
    Settings,
    ChevronDown,
    Building2,
    Armchair,
    Lamp,
    Palette,
    Compass,
    TrendingUp,
    Check,
    Search,
    Eye
} from 'lucide-react';

function formatBDT(amount) {
    const num = Number(amount || 0);
    return '৳' + num.toLocaleString('en-US');
}

function formatOrderDate(dateString) {
    if (!dateString) return 'Today';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
}

export default function Dashboard({ stats = {}, categoriesDistribution = [], recent_orders = [] }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [timeframe, setTimeframe] = useState('This week');
    const [hoveredPoint, setHoveredPoint] = useState(3); // Default Thu hovered like photo

    const totalOrders = stats.orders ?? 4;
    const pendingOrders = stats.pending_orders ?? 1;
    const revenue = stats.revenue ?? 672500;
    const totalSales = stats.total_sales ?? 982500;
    const inventoryVal = stats.inventory_value ?? 1850000;
    const totalProducts = stats.products ?? 8;
    const lowStock = stats.low_stock ?? 1;

    // Financial trends data mirroring the photo's dual-curve wavy graph
    // Purple = Revenue / Sales, Orange = Production / Expenses
    const trendData = [
        { day: 'Mon', revenue: 380000, expenses: 140000, profit: 240000, x: 50,  y1: 170, y2: 195 },
        { day: 'Tue', revenue: 260000, expenses: 160000, profit: 100000, x: 180, y1: 190, y2: 175 },
        { day: 'Wed', revenue: 420000, expenses: 190000, profit: 230000, x: 310, y1: 155, y2: 180 },
        { day: 'Thu', revenue: 548300, expenses: 175500, profit: 372800, x: 440, y1: 100, y2: 140 },
        { day: 'Fri', revenue: 360000, expenses: 220000, profit: 140000, x: 570, y1: 140, y2: 125 },
        { day: 'Sat', revenue: 490000, expenses: 185000, profit: 305000, x: 700, y1: 95,  y2: 150 },
        { day: 'Sun', revenue: 470000, expenses: 150000, profit: 320000, x: 830, y1: 105, y2: 165 },
    ];

    // Studio Department / Category Performance metrics (bottom left in photo)
    const departments = [
        {
            name: 'Architectural Furniture',
            icon: Armchair,
            iconBg: 'bg-emerald-50 text-emerald-600',
            utilization: '84%',
            allocation: '(72%)',
            earned: '৳ 374,800',
            barFill: 14, // 14 out of 18 ticks
            barTotal: 18,
            color: 'bg-emerald-500'
        },
        {
            name: 'Lighting & Luminaires',
            icon: Lamp,
            iconBg: 'bg-rose-50 text-rose-500',
            utilization: '80%',
            allocation: '(54%)',
            earned: '৳ 168,800',
            barFill: 12,
            barTotal: 18,
            color: 'bg-emerald-500'
        },
        {
            name: 'Acoustic & Wall Panels',
            icon: Palette,
            iconBg: 'bg-teal-50 text-teal-600',
            utilization: '64%',
            allocation: '(48%)',
            earned: '৳ 153,324',
            barFill: 9,
            barTotal: 18,
            color: 'bg-emerald-500'
        },
        {
            name: 'Custom Joinery & Decor',
            icon: Compass,
            iconBg: 'bg-indigo-50 text-indigo-600',
            utilization: '58%',
            allocation: '(40%)',
            earned: '৳ 92,500',
            barFill: 8,
            barTotal: 18,
            color: 'bg-emerald-500'
        },
    ];

    // Status pill renderer
    const renderStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                        <Clock size={12} className="text-amber-600" />
                        Pending
                    </span>
                );
            case 'confirmed':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                        <CheckCircle2 size={12} className="text-blue-600" />
                        Confirmed
                    </span>
                );
            case 'processing':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700">
                        <Loader2 size={12} className="animate-spin text-purple-600" />
                        Processing
                    </span>
                );
            case 'delivered':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                        Delivered
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 capitalize">
                        {status}
                    </span>
                );
        }
    };

    return (
        <AdminLayout title="Admin Overview">
            <Head title="Admin Dashboard — Archi Texture BD" />

            <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
                {/* 1. Header Bar with Period actions & Add Product */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Monitor orders, revenue, inventory stock, and catalog performance.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* Time Period Dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                            >
                                <Calendar size={14} className="text-slate-400" />
                                <span>{timeframe}</span>
                                <ChevronDown size={14} className="text-slate-400" />
                            </button>
                        </div>

                        {/* Export / Share Button */}
                        <button
                            type="button"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition shadow-2xs"
                            title="Export statement"
                        >
                            <Download size={15} />
                        </button>

                        {/* Settings Button */}
                        <Link
                            href="/admin/settings"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition shadow-2xs"
                            title="Studio Settings"
                        >
                            <Settings size={15} />
                        </Link>

                        {/* Add Product CTA */}
                        <Link
                            href="/admin/products/create"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 px-3.5 py-2 text-xs font-bold text-white transition-all shadow-sm shadow-violet-500/20"
                        >
                            <Plus size={15} strokeWidth={2.5} />
                            <span>Add Product</span>
                        </Link>
                    </div>
                </div>

                {/* 2. Sub-navigation tabs (Overview, Operations, Source distribution, Inventory, Reports) */}
                <div className="flex items-center gap-2 border-b border-slate-200/60 pb-3 overflow-x-auto text-xs font-semibold text-slate-500">
                    {['Overview', 'Operations', 'Source distribution', 'Inventory & Stock', 'Reports'].map((tab) => {
                        const tabKey = tab.toLowerCase();
                        const isCurrent = activeTab === tabKey || (tab === 'Overview' && activeTab === 'overview');
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tabKey)}
                                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                                    isCurrent
                                        ? 'text-slate-900 border-b-2 border-violet-600 font-bold -mb-[13px] bg-violet-50/50'
                                        : 'hover:text-slate-800'
                                }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                {/* 3. Top Four Financial Stat Blocks (Clean white minimalist cards styled like photo) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {/* Stat 1: Revenue */}
                    <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-xs transition-shadow hover:shadow-md">
                        <span className="text-xs font-medium text-slate-500 block">Revenue</span>
                        <div className="mt-2 text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                            {formatBDT(revenue)}
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                            <TrendingUp size={13} />
                            <span>14%</span>
                            <span className="text-slate-400 font-normal">per last week</span>
                        </div>
                    </div>

                    {/* Stat 2: Orders & Pipeline */}
                    <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-xs transition-shadow hover:shadow-md">
                        <span className="text-xs font-medium text-slate-500 block">Studio Orders</span>
                        <div className="mt-2 text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-2">
                            <span>{totalOrders}</span>
                            <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                                {pendingOrders} Pending
                            </span>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                            <TrendingUp size={13} />
                            <span>6.2%</span>
                            <span className="text-slate-400 font-normal">conversion rate</span>
                        </div>
                    </div>

                    {/* Stat 3: Studio Profit Margin */}
                    <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-xs transition-shadow hover:shadow-md">
                        <span className="text-xs font-medium text-slate-500 block">Estimated Profit</span>
                        <div className="mt-2 text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                            {formatBDT(revenue * 0.48)}
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                            <TrendingUp size={13} />
                            <span>18.9%</span>
                            <span className="text-slate-400 font-normal">per last week</span>
                        </div>
                    </div>

                    {/* Stat 4: Inventory Asset Value */}
                    <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-xs transition-shadow hover:shadow-md">
                        <span className="text-xs font-medium text-slate-500 block">Inventory Stock Value</span>
                        <div className="mt-2 text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                            {formatBDT(inventoryVal)}
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs">
                            <span className="font-semibold text-violet-600">{totalProducts} catalog pieces</span>
                            {lowStock > 0 && (
                                <span className="font-medium text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded">
                                    {lowStock} low stock
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* 4. Financial Trends Interactive Chart (Exact CareOps Style with Purple & Orange Sine Curves + Hover Tooltip) */}
                <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-xs">
                    {/* Graph Title & Legend */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <h2 className="text-sm font-bold text-slate-900 tracking-tight">Financial trends</h2>
                        <div className="flex items-center gap-5 text-xs font-semibold">
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-violet-600" />
                                <span className="text-slate-600">Revenue</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                                <span className="text-slate-600">Production</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                                <span className="text-slate-400">Profit</span>
                            </div>
                            <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md" title="Options">
                                <MoreHorizontal size={16} />
                            </button>
                        </div>
                    </div>

                    {/* SVG Chart Container */}
                    <div className="relative w-full overflow-hidden select-none">
                        <div className="flex">
                            {/* Y-Axis Labels */}
                            <div className="flex flex-col justify-between text-[11px] font-medium text-slate-400 h-52 pr-4 shrink-0 text-right">
                                <span>600k</span>
                                <span>400k</span>
                                <span>200k</span>
                                <span>100k</span>
                                <span>0</span>
                            </div>

                            {/* Chart Canvas */}
                            <div className="relative flex-1 h-52">
                                {/* Horizontal grid reference dashed lines */}
                                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                    <div className="w-full border-b border-slate-100" />
                                    <div className="w-full border-b border-slate-100" />
                                    <div className="w-full border-b border-slate-100" />
                                    <div className="w-full border-b border-slate-100" />
                                    <div className="w-full border-b border-slate-100" />
                                </div>

                                <svg className="w-full h-full overflow-visible" viewBox="0 0 880 200" preserveAspectRatio="none">
                                    {/* Gradient fill under Purple line */}
                                    <defs>
                                        <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.12" />
                                            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                                        </linearGradient>
                                        <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.10" />
                                            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                                        </linearGradient>
                                    </defs>

                                    {/* Orange Curve (Production/Expenses) */}
                                    <path
                                        d="M 50 195 C 110 185, 130 170, 180 175 C 240 180, 270 190, 310 180 C 370 165, 400 135, 440 140 C 490 145, 520 120, 570 125 C 620 130, 660 160, 700 150 C 750 140, 790 160, 830 165"
                                        fill="none"
                                        stroke="#F59E0B"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />

                                    {/* Purple Curve (Revenue) */}
                                    <path
                                        d="M 50 170 C 100 180, 130 195, 180 190 C 230 185, 270 160, 310 155 C 360 148, 390 95, 440 100 C 500 105, 530 145, 570 140 C 620 135, 650 90, 700 95 C 750 100, 790 110, 830 105"
                                        fill="none"
                                        stroke="#6366F1"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                    />

                                    {/* Vertical dashed guide line at hovered day (default Thu x=440) */}
                                    {hoveredPoint !== null && (
                                        <line
                                            x1={trendData[hoveredPoint].x}
                                            y1="10"
                                            x2={trendData[hoveredPoint].x}
                                            y2="200"
                                            stroke="#CBD5E1"
                                            strokeWidth="1.5"
                                            strokeDasharray="4 4"
                                        />
                                    )}

                                    {/* Interactive dots along the curve */}
                                    {trendData.map((d, idx) => (
                                        <g key={d.day}>
                                            {/* Revenue Dot */}
                                            <circle
                                                cx={d.x}
                                                cy={d.y1}
                                                r={hoveredPoint === idx ? 5 : 3.5}
                                                fill={hoveredPoint === idx ? '#6366F1' : '#FFFFFF'}
                                                stroke="#6366F1"
                                                strokeWidth="2.5"
                                                className="cursor-pointer transition-all duration-150"
                                                onMouseEnter={() => setHoveredPoint(idx)}
                                            />
                                            {/* Expenses Dot */}
                                            <circle
                                                cx={d.x}
                                                cy={d.y2}
                                                r={hoveredPoint === idx ? 4.5 : 3}
                                                fill={hoveredPoint === idx ? '#F59E0B' : '#FFFFFF'}
                                                stroke="#F59E0B"
                                                strokeWidth="2"
                                                className="cursor-pointer transition-all duration-150"
                                                onMouseEnter={() => setHoveredPoint(idx)}
                                            />
                                        </g>
                                    ))}
                                </svg>

                                {/* CareOps Dark Floating Tooltip Card over the active point */}
                                {hoveredPoint !== null && (
                                    <div
                                        className="absolute z-20 pointer-events-none rounded-xl bg-[#1E1B2E] text-white p-3.5 shadow-xl border border-slate-800 transition-all duration-200"
                                        style={{
                                            left: `${(trendData[hoveredPoint].x / 880) * 100}%`,
                                            top: '15%',
                                            transform: 'translate(-50%, -20%)'
                                        }}
                                    >
                                        <div className="space-y-1.5 text-xs min-w-[130px]">
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="h-2 w-1.5 rounded-xs bg-violet-400" />
                                                    <span className="text-slate-300">Revenue</span>
                                                </div>
                                                <span className="font-bold font-mono">৳{trendData[hoveredPoint].revenue.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="h-2 w-1.5 rounded-xs bg-amber-400" />
                                                    <span className="text-slate-300">Expenses</span>
                                                </div>
                                                <span className="font-bold font-mono">৳{trendData[hoveredPoint].expenses.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center justify-between gap-3 border-t border-slate-700/80 pt-1">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="h-2 w-1.5 rounded-xs bg-emerald-400" />
                                                    <span className="text-slate-300">Net Profit</span>
                                                </div>
                                                <span className="font-bold font-mono text-emerald-400">৳{trendData[hoveredPoint].profit.toLocaleString()}</span>
                                            </div>
                                            <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1 text-center font-mono">
                                                {trendData[hoveredPoint].day}, Nov 5, 2026
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* X-Axis Day Labels */}
                        <div className="flex justify-between pl-12 pr-6 pt-3 text-xs font-semibold text-slate-500">
                            {trendData.map((d, idx) => (
                                <button
                                    key={d.day}
                                    onClick={() => setHoveredPoint(idx)}
                                    className={`px-2 py-0.5 rounded transition ${
                                        hoveredPoint === idx ? 'text-violet-700 font-bold bg-violet-50' : 'hover:text-slate-800'
                                    }`}
                                >
                                    {d.day}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 5. Bottom Two Panels (Matching photo layout: Left = Departments performance, Right = Financial structure) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bottom Left: Departments performance */}
                    <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-xs flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Studio Category Performance</h3>
                                <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md" title="Options">
                                    <MoreHorizontal size={16} />
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="text-[11px] font-semibold text-slate-400 border-b border-slate-100 pb-2">
                                            <th className="pb-3 font-medium">Department</th>
                                            <th className="pb-3 font-medium text-center">Utilization</th>
                                            <th className="pb-3 font-medium">Allocation</th>
                                            <th className="pb-3 font-medium text-right">Earned</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100/60">
                                        {departments.map((dep) => {
                                            const IconComp = dep.icon;
                                            return (
                                                <tr key={dep.name} className="hover:bg-slate-50/50 transition">
                                                    <td className="py-3.5 pr-2">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${dep.iconBg}`}>
                                                                <IconComp size={14} />
                                                            </div>
                                                            <span className="font-semibold text-slate-800">{dep.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-2 text-center">
                                                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                                                            <TrendingUp size={11} className="text-emerald-500" />
                                                            {dep.utilization}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-2">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-slate-400 font-mono text-[11px] w-9">{dep.allocation}</span>
                                                            <div className="flex items-center gap-0.5">
                                                                {Array.from({ length: dep.barTotal }).map((_, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className={`h-3 w-0.5 rounded-full ${
                                                                            i < dep.barFill ? 'bg-emerald-500' : 'bg-slate-200'
                                                                        }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 pl-2 text-right font-bold text-slate-900 font-mono">
                                                        {dep.earned}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-400">Target fulfillment rate: 89.2%</span>
                            <Link href="/admin/products" className="font-semibold text-violet-600 hover:text-violet-700">
                                View all catalog pieces &rarr;
                            </Link>
                        </div>
                    </div>

                    {/* Bottom Right: Financial structure (Segmented proportional bar block) */}
                    <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-xs flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Financial structure</h3>
                                <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md" title="Options">
                                    <MoreHorizontal size={16} />
                                </button>
                            </div>

                            {/* Column values */}
                            <div className="grid grid-cols-4 gap-2 text-left mb-6">
                                <div>
                                    <span className="text-[11px] text-slate-400 font-medium block truncate">Bespoke Furniture</span>
                                    <span className="text-sm sm:text-base font-black text-slate-900 mt-1 block">৳456,000</span>
                                </div>
                                <div>
                                    <span className="text-[11px] text-slate-400 font-medium block truncate">Lighting Systems</span>
                                    <span className="text-sm sm:text-base font-black text-slate-900 mt-1 block">৳360,000</span>
                                </div>
                                <div>
                                    <span className="text-[11px] text-slate-400 font-medium block truncate">Wall Acoustics</span>
                                    <span className="text-sm sm:text-base font-black text-slate-900 mt-1 block">৳144,000</span>
                                </div>
                                <div>
                                    <span className="text-[11px] text-slate-400 font-medium block truncate">Decor / Other</span>
                                    <span className="text-sm sm:text-base font-black text-slate-900 mt-1 block">৳120,000</span>
                                </div>
                            </div>

                            {/* Proportional Rounded Segmented Bars */}
                            <div className="space-y-2">
                                <div className="flex h-12 w-full gap-2 overflow-hidden rounded-xl">
                                    {/* Segment 1: 38% - Deep Violet */}
                                    <div className="h-full rounded-xl bg-violet-600 transition-all hover:opacity-90" style={{ width: '38%' }} title="Bespoke Furniture: 38%" />
                                    {/* Segment 2: 30% - Medium Violet */}
                                    <div className="h-full rounded-xl bg-violet-400 transition-all hover:opacity-90" style={{ width: '30%' }} title="Lighting: 30%" />
                                    {/* Segment 3: 18% - Soft Violet */}
                                    <div className="h-full rounded-xl bg-violet-200 transition-all hover:opacity-90" style={{ width: '18%' }} title="Wall Acoustics: 18%" />
                                    {/* Segment 4: 14% - Striped Hatch Gray */}
                                    <div
                                        className="h-full rounded-xl bg-slate-100 border border-dashed border-slate-300 transition-all hover:opacity-90"
                                        style={{ width: '14%' }}
                                        title="Decor / Other: 14%"
                                    />
                                </div>

                                {/* Percentage labels underneath */}
                                <div className="flex text-xs font-bold text-slate-500 pt-1">
                                    <div style={{ width: '38%' }}>38%</div>
                                    <div style={{ width: '30%' }}>30%</div>
                                    <div style={{ width: '18%' }}>18%</div>
                                    <div style={{ width: '14%' }}>14%</div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span>High-margin architectural collections contribute 68% of gross margin</span>
                            <Link href="/admin/orders" className="font-semibold text-violet-600 hover:text-violet-700">
                                Detailed orders report &rarr;
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 6. Recent Orders Table (Clean Minimal CareOps Table with Quick Actions) */}
                <div className="rounded-2xl bg-white border border-slate-100 shadow-xs overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                        <div>
                            <h2 className="text-base font-bold text-slate-900 tracking-tight">Recent Client Orders</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Real-time transactions and architectural purchase requests</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/admin/orders/create"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 text-xs font-semibold transition"
                            >
                                <Plus size={13} />
                                <span>Create Order</span>
                            </Link>
                            <Link
                                href="/admin/orders"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700 transition"
                            >
                                <span>All Orders</span>
                                <span>&rarr;</span>
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="py-3.5 pl-6 pr-4">Order Code</th>
                                    <th className="py-3.5 px-4">Customer</th>
                                    <th className="py-3.5 px-4">Ordered Pieces</th>
                                    <th className="py-3.5 px-4">Total Amount</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recent_orders.length > 0 ? (
                                    recent_orders.map((order) => {
                                        const count = order.items?.reduce((s, it) => s + (Number(it.quantity) || 1), 0) || 1;
                                        const names = order.items?.map(it => it.product_name).join(', ') || 'Custom item';

                                        return (
                                            <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="py-4 pl-6 pr-4 align-middle">
                                                    <span className="font-mono font-bold text-slate-900 block">{order.order_number}</span>
                                                    <span className="text-[11px] text-slate-400 mt-0.5 block">{formatOrderDate(order.placed_at || order.created_at)}</span>
                                                </td>
                                                <td className="py-4 px-4 align-middle">
                                                    <span className="font-semibold text-slate-900 block">{order.customer_name}</span>
                                                    <span className="text-[11px] text-slate-400 mt-0.5 block">{order.customer_phone}</span>
                                                </td>
                                                <td className="py-4 px-4 align-middle max-w-xs">
                                                    <span className="font-semibold text-slate-800 block">{count} {count === 1 ? 'piece' : 'pieces'}</span>
                                                    <span className="text-[11px] text-slate-400 truncate block max-w-xs mt-0.5" title={names}>{names}</span>
                                                </td>
                                                <td className="py-4 px-4 align-middle font-bold text-emerald-600 font-mono whitespace-nowrap">
                                                    {formatBDT(order.total_amount)}
                                                </td>
                                                <td className="py-4 px-4 align-middle whitespace-nowrap">
                                                    {renderStatusBadge(order.status)}
                                                </td>
                                                <td className="py-4 pl-4 pr-6 align-middle text-right whitespace-nowrap">
                                                    <Link
                                                        href={`/admin/orders/${order.id}`}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                                                    >
                                                        <Eye size={13} className="text-slate-400" />
                                                        <span>View</span>
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-slate-400">
                                            No recent orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
