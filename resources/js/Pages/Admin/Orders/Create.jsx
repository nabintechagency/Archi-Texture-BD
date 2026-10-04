import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft, Plus, Trash2, ShoppingBag, DollarSign,
    CheckCircle2, AlertTriangle, Package
} from 'lucide-react';

export default function OrderCreate({ products = [] }) {
    const [customer, setCustomer] = useState({
        name: '',
        email: '',
        phone: '',
        shipping_address: '',
        city: 'Dhaka',
        notes: '',
        status: 'pending',
        payment_status: 'pending',
        payment_method: 'cash_on_delivery',
        shipping_fee: 0,
        discount: 0,
        admin_notes: '',
    });

    const [items, setItems] = useState([
        {
            product_id: products[0]?.id || '',
            product_name: products[0]?.name || '',
            sku: products[0]?.sku || '',
            price: products[0]?.price || 0,
            quantity: 1,
            featured_image: products[0]?.featured_image || '',
            stock_available: products[0]?.stock_quantity ?? 0,
        }
    ]);

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleSelectProduct = (index, productId) => {
        const product = products.find((p) => p.id === Number(productId));
        if (!product) return;

        setItems((prev) => {
            const next = [...prev];
            next[index] = {
                product_id: product.id,
                product_name: product.name,
                sku: product.sku || '',
                price: Number(product.price) || 0,
                quantity: next[index].quantity || 1,
                featured_image: product.featured_image || '',
                stock_available: product.stock_quantity ?? 0,
            };
            return next;
        });
    };

    const handleUpdateItem = (index, field, value) => {
        setItems((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const handleAddItem = () => {
        const first = products[0];
        setItems((prev) => [
            ...prev,
            {
                product_id: first?.id || '',
                product_name: first?.name || '',
                sku: first?.sku || '',
                price: first?.price || 0,
                quantity: 1,
                featured_image: first?.featured_image || '',
                stock_available: first?.stock_quantity ?? 0,
            }
        ]);
    };

    const handleRemoveItem = (index) => {
        if (items.length <= 1) return;
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const subtotal = items.reduce((acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0);
    const shipping = Number(customer.shipping_fee) || 0;
    const discount = Number(customer.discount) || 0;
    const totalAmount = Math.max(0, subtotal + shipping - discount);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

        const payload = {
            customer_name: customer.name,
            customer_email: customer.email || null,
            customer_phone: customer.phone,
            shipping_address: customer.shipping_address,
            city: customer.city,
            notes: customer.notes || null,
            status: customer.status,
            payment_status: customer.payment_status,
            payment_method: customer.payment_method,
            shipping_fee: shipping,
            discount: discount,
            admin_notes: customer.admin_notes || null,
            items: items.map((it) => ({
                product_id: it.product_id ? Number(it.product_id) : null,
                product_name: it.product_name,
                sku: it.sku || null,
                price: Number(it.price),
                quantity: Number(it.quantity),
                featured_image: it.featured_image || null,
            })),
        };

        router.post('/admin/orders', payload, {
            onError: (errs) => {
                setErrors(errs);
                setSubmitting(false);
            },
        });
    };

    const formatBdt = (val) => `BDT ${Number(val || 0).toLocaleString('en-US')}`;

    return (
        <AdminLayout title="Create Manual Order">
            <Head title="Admin — Create Order" />

            <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <Link
                        href="/admin/orders"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
                    >
                        <ArrowLeft size={16} />
                        Back to Orders
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Banner */}
                    {Object.keys(errors).length > 0 && (
                        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-300 space-y-1">
                            <p className="font-bold flex items-center gap-1.5">
                                <AlertTriangle size={15} /> Please resolve the following errors:
                            </p>
                            <ul className="list-disc list-inside">
                                {Object.values(errors).map((err, i) => (
                                    <li key={i}>{Array.isArray(err) ? err[0] : err}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Section 1: Customer Details */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                        <h3 className="text-base font-semibold text-white flex items-center gap-2">
                            <ShoppingBag className="text-amber-400" size={18} />
                            Client & Delivery Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Customer Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={customer.name}
                                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                                    placeholder="e.g. Mahfuzul Alam"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Phone Number *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={customer.phone}
                                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                                    placeholder="e.g. +880 1712-345678"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Email Address (Optional)
                                </label>
                                <input
                                    type="email"
                                    value={customer.email}
                                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                                    placeholder="client@luxuryarc.com"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    City / District
                                </label>
                                <input
                                    type="text"
                                    value={customer.city}
                                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                                    placeholder="Dhaka"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Delivery Address *
                                </label>
                                <textarea
                                    required
                                    rows={2}
                                    value={customer.shipping_address}
                                    onChange={(e) => setCustomer({ ...customer, shipping_address: e.target.value })}
                                    placeholder="House number, road number, area, landmark..."
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Client Notes / Specific Requests
                                </label>
                                <input
                                    type="text"
                                    value={customer.notes}
                                    onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                                    placeholder="e.g. Call before delivery, elevator availability..."
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Order Items Selection */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold text-white flex items-center gap-2">
                                <Package className="text-amber-400" size={18} />
                                Ordered Architectural Pieces
                            </h3>
                            <button
                                type="button"
                                onClick={handleAddItem}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 transition border border-slate-700"
                            >
                                <Plus size={14} /> Add Piece
                            </button>
                        </div>

                        <div className="space-y-3">
                            {items.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex flex-col md:flex-row items-start md:items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3.5"
                                >
                                    {/* Thumbnail Preview */}
                                    <div className="h-12 w-12 shrink-0 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 hidden sm:block">
                                        {item.featured_image ? (
                                            <img src={item.featured_image} alt="Piece" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-600 font-mono">
                                                N/A
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Select */}
                                    <div className="flex-1 min-w-0 w-full md:w-auto">
                                        <select
                                            value={item.product_id}
                                            onChange={(e) => handleSelectProduct(idx, e.target.value)}
                                            className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                                        >
                                            <option value="">Select from catalog...</option>
                                            {products.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} ({p.sku || 'No SKU'}) — {formatBdt(p.price)} [Stock: {p.stock_quantity}]
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Unit Price */}
                                    <div className="w-full sm:w-28">
                                        <label className="block text-[10px] text-slate-500 uppercase md:hidden">Unit Price</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={item.price}
                                            onChange={(e) => handleUpdateItem(idx, 'price', e.target.value)}
                                            className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2 text-xs text-white text-right focus:border-amber-500 focus:outline-none"
                                            title="Unit price in BDT"
                                        />
                                    </div>

                                    {/* Quantity */}
                                    <div className="w-full sm:w-20">
                                        <label className="block text-[10px] text-slate-500 uppercase md:hidden">Quantity</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => handleUpdateItem(idx, 'quantity', e.target.value)}
                                            className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2 text-xs text-white text-center focus:border-amber-500 focus:outline-none"
                                        />
                                    </div>

                                    {/* Line Total */}
                                    <div className="w-full sm:w-28 text-right font-bold text-emerald-400 text-xs">
                                        {formatBdt((Number(item.price) || 0) * (Number(item.quantity) || 1))}
                                    </div>

                                    {/* Remove Button */}
                                    {items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(idx)}
                                            className="rounded-lg p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 transition"
                                            title="Remove item"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 3: Fulfillment, Payment, and Financial Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Status & Options */}
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                            <h3 className="text-base font-semibold text-white">Status & Logistics</h3>

                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Initial Order Status
                                </label>
                                <select
                                    value={customer.status}
                                    onChange={(e) => setCustomer({ ...customer, status: e.target.value })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="processing">Processing / In Production</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Payment Method
                                </label>
                                <select
                                    value={customer.payment_method}
                                    onChange={(e) => setCustomer({ ...customer, payment_method: e.target.value })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                                >
                                    <option value="cash_on_delivery">Cash on Delivery (Standard)</option>
                                    <option value="bkash">bKash Merchant Pay</option>
                                    <option value="nagad">Nagad</option>
                                    <option value="bank_transfer">Direct Bank Transfer / Wire</option>
                                    <option value="card">Credit / Debit Card</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Payment Status
                                </label>
                                <select
                                    value={customer.payment_status}
                                    onChange={(e) => setCustomer({ ...customer, payment_status: e.target.value })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                                >
                                    <option value="pending">Pending (Unpaid)</option>
                                    <option value="paid">Paid (Confirmed)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Internal Admin Memo
                                </label>
                                <input
                                    type="text"
                                    value={customer.admin_notes}
                                    onChange={(e) => setCustomer({ ...customer, admin_notes: e.target.value })}
                                    placeholder="Internal memo / reference..."
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Pricing Summary */}
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between space-y-4">
                            <h3 className="text-base font-semibold text-white">Order Valuation</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-white">{formatBdt(subtotal)}</span>
                                </div>

                                <div className="flex justify-between items-center text-xs text-slate-400">
                                    <span>Shipping / Handling (BDT)</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={customer.shipping_fee}
                                        onChange={(e) => setCustomer({ ...customer, shipping_fee: e.target.value })}
                                        className="w-28 rounded-lg border border-slate-700 bg-slate-950 p-1.5 text-xs text-white text-right focus:border-amber-500 focus:outline-none"
                                    />
                                </div>

                                <div className="flex justify-between items-center text-xs text-slate-400">
                                    <span>Trade Discount (BDT)</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={customer.discount}
                                        onChange={(e) => setCustomer({ ...customer, discount: e.target.value })}
                                        className="w-28 rounded-lg border border-slate-700 bg-slate-950 p-1.5 text-xs text-emerald-400 text-right focus:border-amber-500 focus:outline-none"
                                    />
                                </div>

                                <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline">
                                    <span className="font-semibold text-white text-sm">Grand Total</span>
                                    <span className="font-mono text-2xl font-bold text-emerald-400">
                                        {formatBdt(totalAmount)}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full rounded-xl bg-amber-500 py-3 text-xs font-semibold uppercase tracking-wider text-slate-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
                            >
                                {submitting ? 'Creating Order...' : 'Confirm & Save Order'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
