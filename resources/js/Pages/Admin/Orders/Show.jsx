import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft, Printer, ShoppingBag, CheckCircle2, Clock,
    Truck, Package, AlertCircle, XCircle, Phone, Mail,
    MapPin, Calendar, CreditCard, MessageSquare, Save, ExternalLink
} from 'lucide-react';

export default function OrderShow({ order }) {
    const [status, setStatus] = useState(order.status);
    const [paymentStatus, setPaymentStatus] = useState(order.payment_status);
    const [adminNotes, setAdminNotes] = useState(order.admin_notes || '');
    const [isSaving, setIsSaving] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const handleUpdateStatus = (newStatus) => {
        setStatus(newStatus);
        setIsSaving(true);
        router.patch(`/admin/orders/${order.id}/status`, {
            status: newStatus,
            payment_status: paymentStatus,
            admin_notes: adminNotes,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setFeedback('Order status updated successfully!');
                setTimeout(() => setFeedback(null), 3000);
            },
            onFinish: () => setIsSaving(false),
        });
    };

    const handleSaveDetails = (e) => {
        e.preventDefault();
        setIsSaving(true);
        router.patch(`/admin/orders/${order.id}/status`, {
            status,
            payment_status: paymentStatus,
            admin_notes: adminNotes,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setFeedback('Order details saved successfully!');
                setTimeout(() => setFeedback(null), 3000);
            },
            onFinish: () => setIsSaving(false),
        });
    };

    const formatBdt = (amount) => `BDT ${Number(amount || 0).toLocaleString('en-US')}`;

    const printInvoice = () => {
        window.print();
    };

    return (
        <AdminLayout title={`Order #${order.order_number}`}>
            <Head title={`Admin — Order ${order.order_number}`} />

            <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto print:p-0 print:max-w-none">
                {/* Print and Navigation Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                    <Link
                        href="/admin/orders"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
                    >
                        <ArrowLeft size={16} />
                        Back to Orders
                    </Link>

                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={printInvoice}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition shadow"
                        >
                            <Printer size={15} />
                            Print Invoice / Slip
                        </button>
                    </div>
                </div>

                {feedback && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-medium text-emerald-400 flex items-center gap-2 animate-fade-in print:hidden">
                        <CheckCircle2 size={16} />
                        {feedback}
                    </div>
                )}

                {/* Printable Order Header */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl print:border-none print:bg-white print:p-0 print:text-black">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 print:border-black/20">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="font-mono text-2xl font-bold text-white print:text-black">
                                    {order.order_number}
                                </h1>
                                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                                    order.status === 'delivered'
                                        ? 'bg-emerald-500/20 text-emerald-400 print:text-emerald-800'
                                        : order.status === 'cancelled'
                                        ? 'bg-red-500/20 text-red-400 print:text-red-800'
                                        : 'bg-amber-500/20 text-amber-400 print:text-amber-800'
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-2 print:text-gray-600">
                                <Calendar size={13} />
                                Placed on {new Date(order.placed_at || order.created_at).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>

                        {/* Quick Status Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 print:hidden">
                            {order.status !== 'confirmed' && order.status !== 'delivered' && order.status !== 'cancelled' && (
                                <button
                                    type="button"
                                    onClick={() => handleUpdateStatus('confirmed')}
                                    className="rounded-xl bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-500 transition shadow"
                                >
                                    Confirm Order
                                </button>
                            )}

                            {order.status !== 'processing' && order.status !== 'delivered' && order.status !== 'cancelled' && (
                                <button
                                    type="button"
                                    onClick={() => handleUpdateStatus('processing')}
                                    className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition shadow"
                                >
                                    Start Processing
                                </button>
                            )}

                            {order.status !== 'shipped' && order.status !== 'delivered' && order.status !== 'cancelled' && (
                                <button
                                    type="button"
                                    onClick={() => handleUpdateStatus('shipped')}
                                    className="rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-500 transition shadow"
                                >
                                    Mark Shipped
                                </button>
                            )}

                            {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                <button
                                    type="button"
                                    onClick={() => handleUpdateStatus('delivered')}
                                    className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition shadow"
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
                                    className="rounded-xl border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
                        {/* Left Column: Line Items & Finance (2 cols) */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Ordered Items Table */}
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 print:text-black">
                                    Ordered Items ({order.items?.length || 0})
                                </h3>

                                <div className="rounded-xl border border-slate-800 bg-slate-950/40 overflow-hidden print:border-black/20 print:bg-transparent">
                                    <table className="w-full text-left text-sm print:text-black">
                                        <thead className="bg-slate-900/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 print:bg-gray-100 print:text-gray-700">
                                            <tr>
                                                <th className="px-4 py-3">Piece Details</th>
                                                <th className="px-4 py-3 text-right">Unit Price</th>
                                                <th className="px-4 py-3 text-center">Qty</th>
                                                <th className="px-4 py-3 text-right">Line Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60 print:divide-gray-200">
                                            {order.items?.map((item) => (
                                                <tr key={item.id} className="hover:bg-slate-900/30 print:hover:bg-transparent">
                                                    <td className="px-4 py-3.5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-800 bg-slate-900 print:hidden">
                                                                {item.featured_image ? (
                                                                    <img src={item.featured_image} alt={item.product_name} className="h-full w-full object-cover" />
                                                                ) : (
                                                                    <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-500">
                                                                        Piece
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-white text-sm print:text-black">
                                                                    {item.product_name}
                                                                </p>
                                                                {item.sku && (
                                                                    <p className="font-mono text-xs text-slate-400 print:text-gray-600 mt-0.5">
                                                                        SKU: {item.sku}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-right font-medium text-slate-300 print:text-black">
                                                        {formatBdt(item.price)}
                                                    </td>
                                                    <td className="px-4 py-3.5 text-center font-bold text-white print:text-black">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="px-4 py-3.5 text-right font-bold text-emerald-400 print:text-black">
                                                        {formatBdt(item.total)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Cost Breakdown */}
                            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-2.5 print:border-black/20 print:bg-transparent">
                                <div className="flex justify-between text-xs text-slate-400 print:text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-white print:text-black">{formatBdt(order.subtotal)}</span>
                                </div>

                                <div className="flex justify-between text-xs text-slate-400 print:text-gray-600">
                                    <span>White-Glove Delivery & Handling</span>
                                    <span className="font-medium text-white print:text-black">
                                        {Number(order.shipping_fee) > 0 ? formatBdt(order.shipping_fee) : 'Complimentary'}
                                    </span>
                                </div>

                                {Number(order.discount) > 0 && (
                                    <div className="flex justify-between text-xs text-emerald-400">
                                        <span>Architectural Trade Discount</span>
                                        <span>- {formatBdt(order.discount)}</span>
                                    </div>
                                )}

                                <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline print:border-gray-300">
                                    <span className="font-semibold text-white text-base print:text-black">Total Amount</span>
                                    <span className="font-mono text-xl font-extrabold text-emerald-400 print:text-black">
                                        {formatBdt(order.total_amount)}
                                    </span>
                                </div>
                            </div>

                            {/* Internal Admin Memo */}
                            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 print:hidden">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                    <MessageSquare size={14} className="text-amber-400" />
                                    Internal Admin Notes & Workshop Memo
                                </div>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Add private internal notes (e.g. customized dimensions, payment verification TrxID, delivery instructions)..."
                                    rows={3}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                                />
                                <div className="mt-2 flex justify-end">
                                    <button
                                        type="button"
                                        disabled={isSaving}
                                        onClick={handleSaveDetails}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                                    >
                                        <Save size={13} />
                                        Save Note
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Customer Info & Status Manager */}
                        <div className="space-y-6">
                            {/* Customer Profile Card */}
                            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 space-y-4 print:border-black/20 print:bg-transparent">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 print:text-black">
                                    Client & Shipping Information
                                </h3>

                                <div className="space-y-3 text-xs">
                                    <div>
                                        <p className="text-[11px] text-slate-500 uppercase tracking-wider">Client Name</p>
                                        <p className="font-semibold text-white text-sm print:text-black mt-0.5">{order.customer_name}</p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] text-slate-500 uppercase tracking-wider">Phone Contact</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <a
                                                href={`tel:${order.customer_phone}`}
                                                className="font-medium text-amber-400 hover:underline flex items-center gap-1 print:text-black"
                                            >
                                                <Phone size={12} />
                                                {order.customer_phone}
                                            </a>
                                            <a
                                                href={`https://wa.me/${order.customer_phone.replace(/[^0-9]/g, '')}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 hover:bg-emerald-500/30 print:hidden"
                                            >
                                                WhatsApp ↗
                                            </a>
                                        </div>
                                    </div>

                                    {order.customer_email && (
                                        <div>
                                            <p className="text-[11px] text-slate-500 uppercase tracking-wider">Email</p>
                                            <a
                                                href={`mailto:${order.customer_email}`}
                                                className="text-slate-300 hover:text-white flex items-center gap-1 mt-0.5 print:text-black"
                                            >
                                                <Mail size={12} />
                                                {order.customer_email}
                                            </a>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-[11px] text-slate-500 uppercase tracking-wider">Delivery Destination</p>
                                        <p className="text-slate-200 mt-0.5 print:text-black">
                                            {order.city && <span className="font-bold">{order.city}, </span>}
                                            {order.shipping_address}
                                        </p>
                                        <a
                                            href={`https://maps.google.com/?q=${encodeURIComponent(`${order.shipping_address}, ${order.city || 'Dhaka'}`)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-[11px] text-indigo-400 hover:underline inline-flex items-center gap-1 mt-1 print:hidden"
                                        >
                                            <MapPin size={11} /> Open in Google Maps ↗
                                        </a>
                                    </div>

                                    {order.notes && (
                                        <div className="border-t border-slate-800 pt-3">
                                            <p className="text-[11px] text-slate-500 uppercase tracking-wider">Customer Special Instructions</p>
                                            <p className="text-slate-300 mt-1 italic print:text-black bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                                                "{order.notes}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status & Payment Control Panel */}
                            <form onSubmit={handleSaveDetails} className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 space-y-4 print:hidden">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Fulfillment & Payment Status
                                </h3>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1">Fulfillment State</label>
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
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
                                        <label className="block text-xs text-slate-400 mb-1">Payment Status</label>
                                        <select
                                            value={paymentStatus}
                                            onChange={(e) => setPaymentStatus(e.target.value)}
                                            className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                                        >
                                            <option value="pending">Payment Pending (Unpaid)</option>
                                            <option value="paid">Payment Confirmed (Paid)</option>
                                            <option value="failed">Payment Failed</option>
                                            <option value="refunded">Refunded</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1">Payment Method</label>
                                        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-2.5 text-xs text-slate-300 font-mono">
                                            {order.payment_method?.replace(/_/g, ' ').toUpperCase() || 'CASH ON DELIVERY'}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full rounded-xl bg-amber-500 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
                                    >
                                        {isSaving ? 'Updating...' : 'Update Order State'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
