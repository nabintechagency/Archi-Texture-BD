import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    ArrowLeft, Printer, ShoppingBag, CheckCircle2, Clock,
    Truck, Package, AlertCircle, XCircle, Phone, Mail,
    MapPin, Calendar, CreditCard, MessageSquare, Save, ExternalLink,
    DollarSign, Tag, Check, ChevronRight
} from 'lucide-react';

export default function OrderShow({ order }) {
    const normalizePaymentMethod = (method) => {
        if (!method) return 'CASH ON DELIVERY';
        const upper = method.replace(/_/g, ' ').toUpperCase().trim();
        if (upper === 'CASH ON DELIVERY' || upper === 'COD') return 'CASH ON DELIVERY';
        if (upper === 'BKASH') return 'BKASH';
        if (upper === 'NAGAD') return 'NAGAD';
        if (upper === 'UPAY') return 'UPAY';
        if (upper === 'BANK TRANSFER' || upper === 'BANK' || upper === 'WIRE') return 'BANK TRANSFER';
        return upper;
    };

    const [status, setStatus] = useState(order.status);
    const [paymentStatus, setPaymentStatus] = useState(order.payment_status);
    const [paymentMethod, setPaymentMethod] = useState(normalizePaymentMethod(order.payment_method));
    const [adminNotes, setAdminNotes] = useState(order.admin_notes || '');
    const [isSaving, setIsSaving] = useState(false);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        let prevTitle = document.title;
        const handleBeforePrint = () => {
            prevTitle = document.title;
            document.title = '';
        };
        const handleAfterPrint = () => {
            document.title = prevTitle || `Order #${order.order_number}`;
        };

        window.addEventListener('beforeprint', handleBeforePrint);
        window.addEventListener('afterprint', handleAfterPrint);

        return () => {
            window.removeEventListener('beforeprint', handleBeforePrint);
            window.removeEventListener('afterprint', handleAfterPrint);
        };
    }, [order.order_number]);

    const handleUpdateStatus = (newStatus) => {
        setStatus(newStatus);
        setIsSaving(true);
        router.patch(`/admin/orders/${order.id}/status`, {
            status: newStatus,
            payment_status: paymentStatus,
            payment_method: paymentMethod,
            admin_notes: adminNotes,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setFeedback('Order status updated successfully!');
                setTimeout(() => setFeedback(null), 3500);
            },
            onFinish: () => setIsSaving(false),
        });
    };

    const handleSaveDetails = (e) => {
        e?.preventDefault?.();
        setIsSaving(true);
        router.patch(`/admin/orders/${order.id}/status`, {
            status,
            payment_status: paymentStatus,
            payment_method: paymentMethod,
            admin_notes: adminNotes,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setFeedback('Order details and payment state updated successfully!');
                setTimeout(() => setFeedback(null), 3500);
            },
            onFinish: () => setIsSaving(false),
        });
    };

    const formatBdt = (amount) => `৳${Number(amount || 0).toLocaleString('en-US')}`;

    const printInvoice = () => {
        const prevTitle = document.title;
        document.title = '';
        window.print();
        setTimeout(() => {
            document.title = prevTitle || `Order #${order.order_number}`;
        }, 1000);
    };

    return (
        <AdminLayout title={`Order #${order.order_number}`}>
            <Head title={`Order #${order.order_number}`} />

            <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 print:p-0 print:max-w-none">
                {/* 1. Header (Inspired by Add Product form) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4 print:hidden">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/orders"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition shadow-2xs"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
                                    #{order.order_number}
                                </h1>
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider border ${
                                    order.status === 'delivered'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : order.status === 'cancelled'
                                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                                        : order.status === 'pending'
                                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                                        : 'bg-violet-50 text-violet-700 border-violet-200'
                                }`}>
                                    {order.status === 'pending' ? 'Pending Review' : order.status}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                                <Calendar size={13} className="text-slate-400 shrink-0" />
                                <span>
                                    Placed on {new Date(order.placed_at || order.created_at).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={printInvoice}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition shadow-2xs"
                        >
                            <Printer size={15} className="text-slate-500" />
                            <span>Print Invoice / Slip</span>
                        </button>
                    </div>
                </div>

                {/* Feedback Banner */}
                {feedback && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2.5 shadow-2xs animate-fade-in print:hidden">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        <span>{feedback}</span>
                    </div>
                )}

                {/* Quick Workflow Transition Card */}
                <div className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <Clock size={15} className="text-violet-600 shrink-0" />
                        <span>Quick Fulfillment Transitions:</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {order.status !== 'confirmed' && order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <button
                                type="button"
                                onClick={() => handleUpdateStatus('confirmed')}
                                className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700 hover:bg-sky-100 transition shadow-2xs"
                            >
                                Confirm Order
                            </button>
                        )}
                        {order.status !== 'processing' && order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <button
                                type="button"
                                onClick={() => handleUpdateStatus('processing')}
                                className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition shadow-2xs"
                            >
                                Start Processing
                            </button>
                        )}
                        {order.status !== 'shipped' && order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <button
                                type="button"
                                onClick={() => handleUpdateStatus('shipped')}
                                className="rounded-xl border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100 transition shadow-2xs"
                            >
                                Mark Shipped
                            </button>
                        )}
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <button
                                type="button"
                                onClick={() => handleUpdateStatus('delivered')}
                                className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition shadow-2xs"
                            >
                                Mark Delivered
                            </button>
                        )}
                        {order.status !== 'cancelled' && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (confirm('Are you sure you want to cancel this order?')) {
                                        handleUpdateStatus('cancelled');
                                    }
                                }}
                                className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition shadow-2xs"
                            >
                                Cancel Order
                            </button>
                        )}
                    </div>
                </div>

                {/* Print-Only Studio Invoice Header */}
                <div className="hidden print:flex items-center justify-between pb-4 border-b-2 border-slate-900 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold font-serif tracking-tight text-slate-900">
                            Archi Texture
                        </h2>
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-600 font-medium mt-1">
                            Interior Products Wholesale Showroom & Farm
                        </p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                        <h1 className="text-lg font-bold font-mono text-slate-900">ORDER INVOICE</h1>
                        <p className="text-xs text-slate-600 mt-0.5 font-mono">
                            Order #{order.order_number}
                        </p>
                    </div>
                </div>

                {/* Main Content 2-Column Grid (Add Product inspired) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left 2-Columns: Items, Financials, Memo */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* 1. Ordered Pieces Card */}
                        <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4 print:border-none print:p-0">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:border-black/20">
                                <div className="flex items-center gap-2">
                                    <Package size={16} className="text-violet-600 print:text-black" />
                                    <h2 className="text-sm font-bold text-slate-900">Ordered Architectural Pieces</h2>
                                </div>
                                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 print:border-black/20">
                                    {order.items?.length || 0} Pieces
                                </span>
                            </div>

                            <div className="rounded-xl border border-slate-200/80 overflow-hidden print:border-black/20">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200/80 print:bg-slate-100 print:text-black">
                                        <tr>
                                            <th className="px-4 py-3">Piece Details</th>
                                            <th className="px-4 py-3 text-right">Unit Price</th>
                                            <th className="px-4 py-3 text-center">Qty</th>
                                            <th className="px-4 py-3 text-right">Line Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 print:divide-slate-200">
                                        {order.items?.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50/60 transition-colors print:hover:bg-transparent">
                                                <td className="px-4 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 print:hidden">
                                                            {item.featured_image ? (
                                                                <img src={item.featured_image} alt={item.product_name} className="h-full w-full object-cover" />
                                                            ) : (
                                                                <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400 font-medium">
                                                                    Piece
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900 text-xs">
                                                                {item.product_name}
                                                            </p>
                                                            {item.sku && (
                                                                <p className="font-mono text-[11px] text-slate-400 mt-0.5">
                                                                    SKU: {item.sku}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5 text-right font-medium text-slate-700">
                                                    {formatBdt(item.price)}
                                                </td>
                                                <td className="px-4 py-3.5 text-center">
                                                    <span className="font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md text-xs">
                                                        {item.quantity}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 text-right font-extrabold text-slate-900 font-mono">
                                                    {formatBdt(item.total)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 2. Financial Summary Card */}
                        <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-3 print:border-none print:p-0">
                            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 print:border-black/20">
                                <DollarSign size={16} className="text-violet-600 print:text-black" />
                                <h2 className="text-sm font-bold text-slate-900">Financial Summary & Payment Breakdown</h2>
                            </div>

                            <div className="space-y-2.5 pt-1">
                                <div className="flex justify-between text-xs text-slate-600">
                                    <span>Subtotal Amount</span>
                                    <span className="font-bold text-slate-900 font-mono">{formatBdt(order.subtotal)}</span>
                                </div>

                                <div className="flex justify-between text-xs text-slate-600">
                                    <span>White-Glove Delivery & Handling</span>
                                    <span className="font-medium text-slate-800">
                                        {Number(order.shipping_fee) > 0 ? formatBdt(order.shipping_fee) : 'Complimentary'}
                                    </span>
                                </div>

                                {Number(order.discount) > 0 && (
                                    <div className="flex justify-between text-xs text-emerald-700 font-semibold bg-emerald-50/70 p-2 rounded-lg border border-emerald-200/60">
                                        <span>Architectural Trade Discount</span>
                                        <span className="font-mono">- {formatBdt(order.discount)}</span>
                                    </div>
                                )}

                                <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline print:border-black/20">
                                    <span className="font-extrabold text-slate-900 text-sm">Total Order Amount</span>
                                    <span className="font-mono text-xl font-extrabold text-violet-700 print:text-black">
                                        {formatBdt(order.total_amount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 3. Internal Admin Memo Card (Hidden in Print) */}
                        <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4 print:hidden">
                            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                                <MessageSquare size={16} className="text-violet-600" />
                                <h2 className="text-sm font-bold text-slate-900">Internal Admin Notes & Workshop Memo</h2>
                            </div>
                            <textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Add private internal notes (e.g. customized dimensions, payment verification TrxID, delivery instructions)..."
                                rows={3}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-violet-500 focus:outline-none transition"
                            />
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    disabled={isSaving}
                                    onClick={handleSaveDetails}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition shadow-2xs disabled:opacity-50"
                                >
                                    <Save size={14} />
                                    <span>{isSaving ? 'Saving...' : 'Save Memo Note'}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right 1-Column: Client Profile & Fulfillment State Form */}
                    <div className="space-y-6">
                        {/* 4. Client & Shipping Profile Card */}
                        <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4 print:border-none print:p-0">
                            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 print:border-black/20">
                                <Phone size={16} className="text-violet-600 print:text-black" />
                                <h2 className="text-sm font-bold text-slate-900">Client & Shipping Profile</h2>
                            </div>

                            <div className="space-y-3.5 text-xs">
                                <div>
                                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Client Full Name</p>
                                    <p className="font-extrabold text-slate-900 text-sm mt-0.5">{order.customer_name}</p>
                                </div>

                                <div>
                                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Phone Contact</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <a
                                            href={`tel:${order.customer_phone}`}
                                            className="font-bold text-violet-700 hover:underline flex items-center gap-1.5 print:text-black"
                                        >
                                            <Phone size={12} className="text-violet-500 print:text-black" />
                                            {order.customer_phone}
                                        </a>
                                        <a
                                            href={`https://wa.me/${order.customer_phone.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700 hover:bg-emerald-100 transition print:hidden"
                                        >
                                            WhatsApp ↗
                                        </a>
                                    </div>
                                </div>

                                {order.customer_email && (
                                    <div>
                                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Email Address</p>
                                        <a
                                            href={`mailto:${order.customer_email}`}
                                            className="text-slate-700 hover:text-violet-600 font-medium flex items-center gap-1 mt-0.5 print:text-black"
                                        >
                                            <Mail size={12} className="text-slate-400 print:text-black" />
                                            {order.customer_email}
                                        </a>
                                    </div>
                                )}

                                <div>
                                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Delivery Destination</p>
                                    <p className="text-slate-800 mt-0.5 font-medium leading-relaxed">
                                        {order.city && <span className="font-bold text-slate-900">{order.city}, </span>}
                                        {order.shipping_address}
                                    </p>
                                    <a
                                        href={`https://maps.google.com/?q=${encodeURIComponent(`${order.shipping_address}, ${order.city || 'Dhaka'}`)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[11px] text-violet-600 hover:underline inline-flex items-center gap-1 mt-1 font-semibold print:hidden"
                                    >
                                        <MapPin size={11} /> Open in Google Maps ↗
                                    </a>
                                </div>

                                <div>
                                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Payment Method</p>
                                    <span className="inline-block mt-0.5 font-mono text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                                        {paymentMethod}
                                    </span>
                                </div>

                                {order.notes && (
                                    <div className="border-t border-slate-100 pt-3 print:border-black/20">
                                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Customer Special Instructions</p>
                                        <p className="text-slate-700 mt-1 italic bg-amber-50/60 p-3 rounded-xl border border-amber-200/80 leading-relaxed">
                                            "{order.notes}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 5. Fulfillment State & Payment Manager Form (Add Product styled) */}
                        <form
                            onSubmit={handleSaveDetails}
                            className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4 print:hidden"
                        >
                            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                                <CreditCard size={16} className="text-violet-600" />
                                <h2 className="text-sm font-bold text-slate-900">Fulfillment & Payment Control</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Fulfillment State
                                    </label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition"
                                    >
                                        <option value="pending">Pending Review</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="processing">In Workshop / Processing</option>
                                        <option value="shipped">Dispatched / Shipped</option>
                                        <option value="delivered">Delivered to Client</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Payment Status
                                    </label>
                                    <select
                                        value={paymentStatus}
                                        onChange={(e) => setPaymentStatus(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition"
                                    >
                                        <option value="pending">Payment Pending (Unpaid)</option>
                                        <option value="paid">Payment Confirmed (Paid)</option>
                                        <option value="failed">Payment Failed</option>
                                        <option value="refunded">Refunded</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Payment Method
                                    </label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition"
                                    >
                                        <option value="CASH ON DELIVERY">CASH ON DELIVERY</option>
                                        <option value="BKASH">BKASH</option>
                                        <option value="NAGAD">NAGAD</option>
                                        <option value="UPAY">UPAY</option>
                                        <option value="BANK TRANSFER">BANK TRANSFER</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full rounded-xl bg-violet-600 hover:bg-violet-700 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:shadow transition disabled:opacity-50"
                                >
                                    {isSaving ? 'Updating...' : 'Update Order State'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
