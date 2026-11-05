import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    ShoppingBag,
    Package,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Plus,
    MoreHorizontal,
    Clock,
    CheckCircle2,
    Loader2,
    Truck,
    XCircle,
    Download,
    Settings,
    ChevronDown,
    Armchair,
    Lamp,
    Palette,
    Compass,
    TrendingUp,
    Check,
    Search,
    Eye,
    AlertTriangle,
    BarChart3,
    DollarSign,
    FileSpreadsheet,
    Layers,
    Filter
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

export default function Dashboard({
    stats = {},
    categoriesDistribution = [],
    recent_orders = [],
    inventory_products = []
}) {
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'inventory' | 'reports'
    const [timeframe, setTimeframe] = useState('This week');
    const [showTimeframeDropdown, setShowTimeframeDropdown] = useState(false);
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [hoveredPoint, setHoveredPoint] = useState(3);
    const [feedbackMsg, setFeedbackMsg] = useState(null);

    // Inventory search & filter state
    const [inventorySearch, setInventorySearch] = useState('');
    const [inventoryStockFilter, setInventoryStockFilter] = useState('all');

    const totalOrders = stats.orders ?? 4;
    const pendingOrders = stats.pending_orders ?? 1;
    const revenue = stats.revenue ?? 672500;
    const totalSales = stats.total_sales ?? 982500;
    const inventoryVal = stats.inventory_value ?? 1850000;
    const totalProducts = stats.products ?? 8;
    const lowStock = stats.low_stock ?? 1;
    const outOfStock = stats.out_of_stock ?? 0;
    const inStock = stats.in_stock ?? Math.max(0, totalProducts - lowStock - outOfStock);
    const aov = stats.aov ?? (totalOrders > 0 ? Math.round(revenue / totalOrders) : 0);

    // Dynamic graph data depending on chosen timeframe
    const trendDatasets = {
        'Today': [
            { day: '9 AM', revenue: 65000, expenses: 22000, profit: 43000, x: 50,  y1: 180, y2: 195 },
            { day: '12 PM', revenue: 140000, expenses: 45000, profit: 95000, x: 245, y1: 140, y2: 170 },
            { day: '3 PM', revenue: 210000, expenses: 62000, profit: 148000, x: 440, y1: 95,  y2: 150 },
            { day: '6 PM', revenue: 175000, expenses: 50000, profit: 125000, x: 635, y1: 115, y2: 160 },
            { day: '9 PM', revenue: 90000, expenses: 30000, profit: 60000, x: 830, y1: 160, y2: 185 },
        ],
        'This week': [
            { day: 'Mon', revenue: 380000, expenses: 140000, profit: 240000, x: 50,  y1: 170, y2: 195 },
            { day: 'Tue', revenue: 260000, expenses: 160000, profit: 100000, x: 180, y1: 190, y2: 175 },
            { day: 'Wed', revenue: 420000, expenses: 190000, profit: 230000, x: 310, y1: 155, y2: 180 },
            { day: 'Thu', revenue: 548300, expenses: 175500, profit: 372800, x: 440, y1: 100, y2: 140 },
            { day: 'Fri', revenue: 360000, expenses: 220000, profit: 140000, x: 570, y1: 140, y2: 125 },
            { day: 'Sat', revenue: 490000, expenses: 185000, profit: 305000, x: 700, y1: 95,  y2: 150 },
            { day: 'Sun', revenue: 470000, expenses: 150000, profit: 320000, x: 830, y1: 105, y2: 165 },
        ],
        'This month': [
            { day: 'Week 1', revenue: 1250000, expenses: 420000, profit: 830000, x: 80,  y1: 150, y2: 180 },
            { day: 'Week 2', revenue: 1680000, expenses: 510000, profit: 1170000, x: 320, y1: 110, y2: 160 },
            { day: 'Week 3', revenue: 1940000, expenses: 580000, profit: 1360000, x: 560, y1: 90,  y2: 145 },
            { day: 'Week 4', revenue: 1420000, expenses: 470000, profit: 950000, x: 800, y1: 135, y2: 170 },
        ],
        'This year': [
            { day: 'Q1', revenue: 4200000, expenses: 1600000, profit: 2600000, x: 80,  y1: 160, y2: 185 },
            { day: 'Q2', revenue: 5800000, expenses: 2100000, profit: 3700000, x: 320, y1: 120, y2: 160 },
            { day: 'Q3', revenue: 7100000, expenses: 2400000, profit: 4700000, x: 560, y1: 85,  y2: 140 },
            { day: 'Q4', revenue: 6400000, expenses: 2300000, profit: 4100000, x: 800, y1: 105, y2: 150 },
        ],
        'Custom date': [
            { day: 'Day 1', revenue: 180000, expenses: 60000, profit: 120000, x: 80,  y1: 165, y2: 185 },
            { day: 'Day 2', revenue: 290000, expenses: 95000, profit: 195000, x: 320, y1: 125, y2: 160 },
            { day: 'Day 3', revenue: 340000, expenses: 110000, profit: 230000, x: 560, y1: 100, y2: 145 },
            { day: 'Day 4', revenue: 260000, expenses: 85000, profit: 175000, x: 800, y1: 135, y2: 170 },
        ],
    };

    const currentTrendData = trendDatasets[timeframe] || trendDatasets['This week'];
    const safeHoveredIndex = Math.min(hoveredPoint, currentTrendData.length - 1);

    // Studio Department / Category Performance metrics
    const departments = [
        {
            name: 'Architectural Furniture',
            icon: Armchair,
            iconBg: 'bg-emerald-50 text-emerald-600',
            utilization: '84%',
            allocation: '(72%)',
            earned: '৳ 374,800',
            barFill: 14,
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

    const handleSelectTimeframe = (option) => {
        if (option === 'Custom date') {
            setShowTimeframeDropdown(false);
            setShowCustomModal(true);
            return;
        }
        setTimeframe(option);
        setShowTimeframeDropdown(false);
        setHoveredPoint(0);
        setFeedbackMsg(`Period set to ${option}`);
        setTimeout(() => setFeedbackMsg(null), 2500);
    };

    const handleApplyCustomDate = (e) => {
        e.preventDefault();
        if (!customStartDate || !customEndDate) return;
        setTimeframe(`Custom (${customStartDate} to ${customEndDate})`);
        setShowCustomModal(false);
        setHoveredPoint(0);
        setFeedbackMsg(`Period updated to custom date range`);
        setTimeout(() => setFeedbackMsg(null), 3000);
    };

    const handleExportStatement = () => {
        let url = `/admin/export/statement?timeframe=${encodeURIComponent(timeframe)}`;
        if (customStartDate && customEndDate) {
            url += `&start_date=${encodeURIComponent(customStartDate)}&end_date=${encodeURIComponent(customEndDate)}`;
        }
        window.open(url, '_blank');
        setFeedbackMsg(`Downloading financial statement for ${timeframe}...`);
        setTimeout(() => setFeedbackMsg(null), 3500);
    };

    const renderStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-300 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-900 shadow-2xs">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                        New Order
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

    // Filtered inventory products
    const filteredInventory = inventory_products.filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
            (p.sku && p.sku.toLowerCase().includes(inventorySearch.toLowerCase())) ||
            (p.category && p.category.toLowerCase().includes(inventorySearch.toLowerCase()));

        if (!matchesSearch) return false;

        const qty = Number(p.stock_quantity ?? 0);
        if (inventoryStockFilter === 'low') return qty > 0 && qty <= 5;
        if (inventoryStockFilter === 'out') return qty <= 0;
        if (inventoryStockFilter === 'in') return qty > 5;
        return true;
    });

    return (
        <AdminLayout title="Admin Overview">
            <Head title="Admin Dashboard — Archi Texture BD" />

            <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
                {/* Notification toast */}
                {feedbackMsg && (
                    <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2.5 text-xs font-semibold shadow-2xl border border-slate-700 animate-fade-in">
                        <Check size={14} className="text-emerald-400" />
                        <span>{feedbackMsg}</span>
                    </div>
                )}

                {/* 1. Header Bar with Period actions & Add Product */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* Interactive Time Period Dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowTimeframeDropdown(!showTimeframeDropdown)}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                            >
                                <Calendar size={14} className="text-violet-600" />
                                <span>{timeframe}</span>
                                <ChevronDown size={14} className="text-slate-400" />
                            </button>

                            {showTimeframeDropdown && (
                                <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl bg-white border border-slate-200 shadow-xl py-1.5 z-50 animate-fade-in">
                                    {['Today', 'This week', 'This month', 'This year', 'Custom date'].map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => handleSelectTimeframe(opt)}
                                            className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition ${
                                                timeframe === opt ? 'bg-violet-50 text-violet-700' : 'text-slate-700 hover:bg-slate-50'
                                            }`}
                                        >
                                            <span>{opt}</span>
                                            {timeframe === opt && <Check size={13} className="text-violet-600" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Export Statement Download Option */}
                        <button
                            type="button"
                            onClick={handleExportStatement}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-violet-700 transition shadow-2xs"
                            title="Download Financial Statement CSV"
                        >
                            <Download size={14} className="text-slate-500" />
                            <span className="hidden sm:inline">Export Statement</span>
                        </button>

                        {/* Add Product CTA */}
                        <Link
                            href="/admin/products/create"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 px-3.5 py-2 text-xs font-bold text-white transition-all shadow-sm shadow-violet-500/20"
                        >
                            <Plus size={15} strokeWidth={2.5} />
                            <span>Add Product</span>
                        </Link>

                        {/* Studio Settings Button (Placed after Add Product) */}
                        <Link
                            href="/admin/settings"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-violet-700 transition shadow-2xs"
                            title="Studio Settings"
                        >
                            <Settings size={15} />
                        </Link>
                    </div>
                </div>

                {/* Custom Date Modal */}
                {showCustomModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-w-sm w-full space-y-4">
                            <h3 className="font-bold text-slate-900 text-sm">Select Custom Date Range</h3>
                            <form onSubmit={handleApplyCustomDate} className="space-y-3">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={customStartDate}
                                        onChange={(e) => setCustomStartDate(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800 focus:border-violet-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">End Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={customEndDate}
                                        onChange={(e) => setCustomEndDate(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800 focus:border-violet-500 focus:outline-none"
                                    />
                                </div>
                                <div className="flex items-center justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCustomModal(false)}
                                        className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-xl bg-violet-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-violet-700 shadow-sm shadow-violet-500/20"
                                    >
                                        Apply Range
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* 2. Sub-navigation tabs: Activated "Overview", "Inventory & Stock", "Reports" */}
                <div className="flex items-center gap-2 border-b border-slate-200/60 pb-3 overflow-x-auto text-xs font-semibold text-slate-500">
                    {[
                        { id: 'overview', label: 'Overview' },
                        { id: 'inventory', label: 'Inventory & Stock' },
                        { id: 'reports', label: 'Reports' },
                    ].map((tab) => {
                        const isCurrent = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
                                    isCurrent
                                        ? 'text-violet-700 font-extrabold bg-violet-50 border border-violet-200 shadow-2xs'
                                        : 'hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                                }`}
                            >
                                {tab.id === 'overview' && <Layers size={14} className={isCurrent ? 'text-violet-600' : 'text-slate-400'} />}
                                {tab.id === 'inventory' && <Package size={14} className={isCurrent ? 'text-violet-600' : 'text-slate-400'} />}
                                {tab.id === 'reports' && <BarChart3 size={14} className={isCurrent ? 'text-violet-600' : 'text-slate-400'} />}
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* ================= VIEW 1: OVERVIEW ================= */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Top Four Financial Stat Blocks */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                            {/* Stat 1: Revenue */}
                            <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-xs transition-shadow hover:shadow-md">
                                <span className="text-xs font-medium text-slate-500 block">Revenue ({timeframe})</span>
                                <div className="mt-2 text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                                    {formatBDT(revenue)}
                                </div>
                                <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                                    <TrendingUp size={13} />
                                    <span>14%</span>
                                    <span className="text-slate-400 font-normal">vs previous cycle</span>
                                </div>
                            </div>

                            {/* Stat 2: Orders & Pipeline */}
                            <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-xs transition-shadow hover:shadow-md">
                                <span className="text-xs font-medium text-slate-500 block">Studio Orders</span>
                                <div className="mt-2 text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-2">
                                    <span>{totalOrders}</span>
                                    {pendingOrders > 0 && (
                                        <span className="text-xs font-extrabold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full animate-pulse">
                                            {pendingOrders} New Order
                                        </span>
                                    )}
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
                                    <span className="text-slate-400 font-normal">net margin (48%)</span>
                                </div>
                            </div>

                            {/* Stat 4: Inventory Asset Value */}
                            <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-xs transition-shadow hover:shadow-md">
                                <span className="text-xs font-medium text-slate-500 block">Inventory Stock Value</span>
                                <div className="mt-2 text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                                    {formatBDT(inventoryVal)}
                                </div>
                                <div className="mt-2 flex items-center gap-2 text-xs">
                                    <span className="font-semibold text-violet-600">{totalProducts} pieces</span>
                                    {lowStock > 0 && (
                                        <span className="font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                                            {lowStock} low stock
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Financial Trends Interactive Chart */}
                        <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-xs">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900 tracking-tight">Financial trends ({timeframe})</h2>
                                    <p className="text-[11px] text-slate-400">Click any interval below to inspect revenue and workshop cost details.</p>
                                </div>
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
                                    <button
                                        type="button"
                                        onClick={handleExportStatement}
                                        className="text-slate-400 hover:text-violet-600 p-1 rounded-md transition"
                                        title="Export chart data"
                                    >
                                        <Download size={15} />
                                    </button>
                                </div>
                            </div>

                            {/* SVG Dual Wavy Curves Graph */}
                            <div className="relative pt-4">
                                <div className="relative h-60 w-full overflow-hidden">
                                    {/* Y-Axis Grid Lines */}
                                    <div className="absolute inset-0 flex flex-col justify-between text-[11px] font-mono text-slate-400 pointer-events-none">
                                        {[600, 450, 300, 150, 0].map((v) => (
                                            <div key={v} className="flex items-center gap-3 w-full">
                                                <span className="w-10 text-right text-[10px] text-slate-400">{v ? `${v}k` : '0'}</span>
                                                <div className="flex-1 border-b border-dashed border-slate-100" />
                                            </div>
                                        ))}
                                    </div>

                                    {/* SVG Curves */}
                                    <svg viewBox="0 0 880 230" className="absolute inset-0 h-full w-full pl-12 pr-6 overflow-visible" preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="violetGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
                                                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.0" />
                                            </linearGradient>
                                            <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.18" />
                                                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                                            </linearGradient>
                                        </defs>

                                        {/* Filled Area Under Purple Curve */}
                                        <path
                                            d="M 50 170 Q 180 80 310 155 T 570 140 T 830 105 L 830 230 L 50 230 Z"
                                            fill="url(#violetGradient)"
                                        />

                                        {/* Filled Area Under Amber Curve */}
                                        <path
                                            d="M 50 195 Q 180 150 310 180 T 570 125 T 830 165 L 830 230 L 50 230 Z"
                                            fill="url(#amberGradient)"
                                        />

                                        {/* Purple Revenue Line */}
                                        <path
                                            d="M 50 170 Q 180 80 310 155 T 570 140 T 830 105"
                                            fill="none"
                                            stroke="#7c3aed"
                                            strokeWidth="3.5"
                                            strokeLinecap="round"
                                        />

                                        {/* Amber Production Line */}
                                        <path
                                            d="M 50 195 Q 180 150 310 180 T 570 125 T 830 165"
                                            fill="none"
                                            stroke="#f59e0b"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />

                                        {/* Interactive Hover Point & Dashed Guideline */}
                                        {currentTrendData[safeHoveredIndex] && (
                                            <g>
                                                <line
                                                    x1={currentTrendData[safeHoveredIndex].x}
                                                    y1="20"
                                                    x2={currentTrendData[safeHoveredIndex].x}
                                                    y2="230"
                                                    stroke="#64748b"
                                                    strokeWidth="1.5"
                                                    strokeDasharray="4 4"
                                                    opacity="0.6"
                                                />
                                                <circle cx={currentTrendData[safeHoveredIndex].x} cy={currentTrendData[safeHoveredIndex].y1} r="6" fill="#7c3aed" stroke="#ffffff" strokeWidth="2.5" />
                                                <circle cx={currentTrendData[safeHoveredIndex].x} cy={currentTrendData[safeHoveredIndex].y2} r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
                                            </g>
                                        )}
                                    </svg>

                                    {/* Floating Dark Tooltip */}
                                    {currentTrendData[safeHoveredIndex] && (
                                        <div
                                            className="absolute top-4 pointer-events-none transition-all duration-150 z-30"
                                            style={{
                                                left: `clamp(10%, ${((currentTrendData[safeHoveredIndex].x + 48) / 920) * 100}%, 80%)`,
                                                transform: 'translateX(-50%)'
                                            }}
                                        >
                                            <div className="rounded-xl bg-slate-900/95 backdrop-blur-md text-white p-3 shadow-2xl border border-slate-700/60 w-44 space-y-1.5">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="flex items-center gap-1.5 text-slate-300">
                                                        <span className="h-2 w-2 rounded-full bg-violet-500" />
                                                        Revenue
                                                    </span>
                                                    <span className="font-mono font-bold text-white">
                                                        {formatBDT(currentTrendData[safeHoveredIndex].revenue)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="flex items-center gap-1.5 text-slate-300">
                                                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                                                        Production
                                                    </span>
                                                    <span className="font-mono font-bold text-slate-300">
                                                        {formatBDT(currentTrendData[safeHoveredIndex].expenses)}
                                                    </span>
                                                </div>
                                                <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1 text-center font-mono">
                                                    {currentTrendData[safeHoveredIndex].day} • {timeframe}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* X-Axis Interval Labels */}
                                <div className="flex justify-between pl-12 pr-6 pt-3 text-xs font-semibold text-slate-500">
                                    {currentTrendData.map((d, idx) => (
                                        <button
                                            key={d.day}
                                            onClick={() => setHoveredPoint(idx)}
                                            className={`px-2 py-0.5 rounded transition ${
                                                safeHoveredIndex === idx ? 'text-violet-700 font-bold bg-violet-50' : 'hover:text-slate-800'
                                            }`}
                                        >
                                            {d.day}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Studio Category Performance (Clean full-width card - "Financial structure" removed) */}
                        <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-xs">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">Studio Category Performance</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Allocation and revenue yield across signature disciplines</p>
                                </div>
                                <Link href="/admin/products" className="text-xs font-semibold text-violet-600 hover:text-violet-700">
                                    Manage Catalog Pieces &rarr;
                                </Link>
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

                        {/* Recent Orders Table */}
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
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="font-mono font-bold text-slate-900 block">{order.order_number}</span>
                                                                {order.status === 'pending' && (
                                                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-amber-400 text-slate-950">
                                                                        NEW
                                                                    </span>
                                                                )}
                                                            </div>
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
                )}

                {/* ================= VIEW 2: INVENTORY & STOCK ================= */}
                {activeTab === 'inventory' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Inventory Metric Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-xs">
                                <span className="text-xs font-medium text-slate-500">Catalog Pieces</span>
                                <div className="mt-2 text-2xl lg:text-3xl font-extrabold text-slate-900">{totalProducts}</div>
                                <span className="text-[11px] text-slate-400 mt-1 block">Active showroom items</span>
                            </div>

                            <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-xs">
                                <span className="text-xs font-medium text-emerald-700">In Stock</span>
                                <div className="mt-2 text-2xl lg:text-3xl font-extrabold text-emerald-700">{inStock}</div>
                                <span className="text-[11px] text-slate-400 mt-1 block">Healthy inventory</span>
                            </div>

                            <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-xs">
                                <span className="text-xs font-medium text-amber-700">Low Stock Alert</span>
                                <div className="mt-2 text-2xl lg:text-3xl font-extrabold text-amber-700">{lowStock}</div>
                                <span className="text-[11px] text-amber-600 font-semibold mt-1 block">5 units or fewer</span>
                            </div>

                            <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-xs">
                                <span className="text-xs font-medium text-rose-700">Out of Stock</span>
                                <div className="mt-2 text-2xl lg:text-3xl font-extrabold text-rose-700">{outOfStock}</div>
                                <span className="text-[11px] text-slate-400 mt-1 block">Needs restocking</span>
                            </div>

                            <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-xs col-span-2 sm:col-span-1">
                                <span className="text-xs font-medium text-slate-500">Stock Asset Value</span>
                                <div className="mt-2 text-xl sm:text-2xl font-extrabold text-violet-700 truncate">{formatBDT(inventoryVal)}</div>
                                <span className="text-[11px] text-slate-400 mt-1 block">Total asset appraisal</span>
                            </div>
                        </div>

                        {/* Inventory Controls & Table */}
                        <div className="rounded-2xl bg-white border border-slate-100 shadow-xs overflow-hidden">
                            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <div className="relative w-full sm:w-80">
                                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search inventory pieces, SKU, category..."
                                        value={inventorySearch}
                                        onChange={(e) => setInventorySearch(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:border-violet-500 focus:outline-none"
                                    />
                                </div>

                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                    <select
                                        value={inventoryStockFilter}
                                        onChange={(e) => setInventoryStockFilter(e.target.value)}
                                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-violet-500 focus:outline-none"
                                    >
                                        <option value="all">All Stock Statuses</option>
                                        <option value="low">Low Stock (≤ 5)</option>
                                        <option value="out">Out of Stock (0)</option>
                                        <option value="in">In Stock (&gt; 5)</option>
                                    </select>

                                    <Link
                                        href="/admin/products"
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white px-3.5 py-1.5 text-xs font-bold transition shadow-xs"
                                    >
                                        <span>Full Catalog</span>
                                        <span>&rarr;</span>
                                    </Link>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                            <th className="py-3.5 pl-6 pr-4">Architectural Piece</th>
                                            <th className="py-3.5 px-4">Category</th>
                                            <th className="py-3.5 px-4">Price</th>
                                            <th className="py-3.5 px-4 text-center">Available Units</th>
                                            <th className="py-3.5 px-4">Stock Health</th>
                                            <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredInventory.length > 0 ? (
                                            filteredInventory.map((item) => {
                                                const qty = Number(item.stock_quantity ?? 0);
                                                return (
                                                    <tr key={item.id} className="hover:bg-slate-50/60 transition">
                                                        <td className="py-4 pl-6 pr-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
                                                                    {item.featured_image ? (
                                                                        <img src={item.featured_image} alt={item.name} className="h-full w-full object-cover" />
                                                                    ) : (
                                                                        <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">Piece</div>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <span className="font-bold text-slate-900 block">{item.name}</span>
                                                                    <span className="font-mono text-[11px] text-slate-400">{item.sku || 'No SKU'}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4 font-semibold text-slate-600 capitalize">
                                                            {item.category || 'General'}
                                                        </td>
                                                        <td className="py-4 px-4 font-mono font-bold text-slate-900">
                                                            {formatBDT(item.price)}
                                                        </td>
                                                        <td className="py-4 px-4 text-center font-bold text-slate-900 text-sm">
                                                            {qty}
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            {qty <= 0 ? (
                                                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                                                                    <XCircle size={11} /> Out of Stock
                                                                </span>
                                                            ) : qty <= 5 ? (
                                                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full animate-pulse">
                                                                    <AlertTriangle size={11} /> Low Stock ({qty})
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                                                    <CheckCircle2 size={11} /> In Stock ({qty})
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-4 pl-4 pr-6 text-right">
                                                            <Link
                                                                href={`/admin/products/${item.id}/edit`}
                                                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-violet-700 hover:bg-slate-50 transition shadow-2xs"
                                                            >
                                                                <span>Edit Piece</span>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="py-12 text-center text-slate-400">
                                                    No pieces match the filter criteria.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ================= VIEW 3: REPORTS ================= */}
                {activeTab === 'reports' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Reports Action Header Card */}
                        <div className="rounded-2xl bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-500/30 text-violet-200 border border-violet-400/30 mb-2">
                                    Financial Statement & Audit
                                </span>
                                <h2 className="text-xl sm:text-2xl font-black tracking-tight">Studio Operational Statement</h2>
                                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                                    Export detailed records of all architectural client transactions, fulfillment states, and revenue allocations for {timeframe}.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleExportStatement}
                                    className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 px-4 py-2.5 text-xs font-extrabold transition shadow-lg"
                                >
                                    <FileSpreadsheet size={15} className="text-emerald-600" />
                                    <span>Download Statement (CSV)</span>
                                </button>
                            </div>
                        </div>

                        {/* Statement Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-xs space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sales & Cash Collection</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xs text-slate-500">Gross Sales Volume</span>
                                        <span className="font-mono font-bold text-slate-900 text-sm">{formatBDT(totalSales)}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xs text-slate-500">Confirmed Paid</span>
                                        <span className="font-mono font-bold text-emerald-600 text-sm">{formatBDT(revenue)}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xs text-slate-500">Unsettled / COD Pipeline</span>
                                        <span className="font-mono font-bold text-amber-600 text-sm">{formatBDT(Math.max(0, totalSales - revenue))}</span>
                                    </div>
                                    <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                                        <span className="text-xs font-bold text-slate-900">Average Order Value (AOV)</span>
                                        <span className="font-mono font-black text-violet-700 text-base">{formatBDT(aov)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-xs space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Fulfillment Funnel</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xs text-slate-500">Total Purchase Requests</span>
                                        <span className="font-mono font-bold text-slate-900">{totalOrders} orders</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xs text-slate-500">Fully Delivered & Settled</span>
                                        <span className="font-mono font-bold text-emerald-600">{stats.delivered_orders ?? 0}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xs text-slate-500">Pending Studio Confirmation</span>
                                        <span className="font-mono font-bold text-amber-600">{pendingOrders}</span>
                                    </div>
                                    <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                                        <span className="text-xs font-bold text-slate-900">Conversion Ratio</span>
                                        <span className="font-mono font-black text-slate-900 text-base">92.4%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-xs space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Catalog Capital Allocation</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xs text-slate-500">Active Catalog Titles</span>
                                        <span className="font-mono font-bold text-slate-900">{totalProducts}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xs text-slate-500">Total Valuation</span>
                                        <span className="font-mono font-bold text-slate-900">{formatBDT(inventoryVal)}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xs text-slate-500">Low Stock Pieces</span>
                                        <span className="font-mono font-bold text-rose-600">{lowStock}</span>
                                    </div>
                                    <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                                        <span className="text-xs font-bold text-slate-900">Asset Liquidity</span>
                                        <span className="font-mono font-black text-emerald-600 text-base">High</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
