import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Settings, Save, CheckCircle, Bell, Phone, MapPin, Mail, Clock, Globe, Sparkles } from 'lucide-react';

export default function SettingsIndex({ settings = [] }) {
    const [form, setForm] = useState(() => {
        const map = {
            // Notice Bar defaults
            notice_bar_text: 'Interior Products Wholesale Showroom & Farm',
            notice_bar_active: '1',
            // Contact defaults
            contact_phone: '01626778573',
            contact_email: 'contact@architexture.com',
            contact_address: 'Mohakhali, Dhaka, Bangladesh',
            contact_hours: 'Sat - Thu: 10:00 AM - 08:00 PM',
            // General defaults
            site_title: 'ARCHI-TEXTURE',
            site_tagline: 'Interior Products Wholesale Showroom and Farm',
            company_name: 'ARCHI-TEXTURE',
        };

        settings.forEach((s) => {
            map[s.key] = s.value ?? '';
        });
        return map;
    });

    const [activeTab, setActiveTab] = useState('notice');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleChange = (key, val) => {
        setForm((prev) => ({ ...prev, [key]: val }));
    };

    const handleSave = (e) => {
        e?.preventDefault();
        setSaving(true);
        setSaved(false);

        router.post('/admin/settings', { settings: form }, {
            preserveScroll: true,
            onSuccess: () => {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            },
            onFinish: () => setSaving(false),
        });
    };

    return (
        <AdminLayout title="Site, Notice & Contact Settings">
            <Head title="Notice Bar & Contact Settings — Admin" />

            <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-100 text-violet-700">
                                Global Controls
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs font-medium text-slate-500">Live Website Sync</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Notice Bar, Contact & Site Settings
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Directly edit top announcement banner text, studio phone numbers, email, and atelier location.
                        </p>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-sm shadow-violet-500/20 disabled:opacity-60"
                    >
                        {saving ? (
                            <span>Saving Changes...</span>
                        ) : saved ? (
                            <>
                                <CheckCircle size={15} />
                                <span>Saved to Website!</span>
                            </>
                        ) : (
                            <>
                                <Save size={15} />
                                <span>Save All Settings</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 border-b border-slate-200/60 pb-3">
                    <button
                        onClick={() => setActiveTab('notice')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                            activeTab === 'notice'
                                ? 'bg-violet-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        <Bell size={14} />
                        <span>Top Notice Bar</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('contact')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                            activeTab === 'contact'
                                ? 'bg-violet-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        <Phone size={14} />
                        <span>Contact & Studio Info</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('general')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                            activeTab === 'general'
                                ? 'bg-violet-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        <Globe size={14} />
                        <span>General Brand</span>
                    </button>
                </div>

                {/* Form Panels */}
                <form onSubmit={handleSave} className="space-y-6">
                    {/* Panel 1: Top Notice Bar */}
                    {activeTab === 'notice' && (
                        <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                        <Bell size={16} className="text-violet-600" />
                                        Announcement & Typewriter Notice Bar
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Appears at the very top of all public visitor pages.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-700">Display Notice:</span>
                                    <button
                                        type="button"
                                        onClick={() => handleChange('notice_bar_active', form.notice_bar_active === '1' ? '0' : '1')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            form.notice_bar_active === '1' ? 'bg-violet-600' : 'bg-slate-300'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                                form.notice_bar_active === '1' ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Notice Bar Headline Text
                                </label>
                                <textarea
                                    rows={2}
                                    value={form.notice_bar_text}
                                    onChange={(e) => handleChange('notice_bar_text', e.target.value)}
                                    placeholder="e.g. Interior Products Wholesale Showroom & Farm"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-800 font-medium focus:bg-white focus:border-violet-500 focus:outline-none"
                                />
                                <p className="text-[11px] text-slate-400 mt-1">
                                    This text animates with the elegant typewriter effect on the site.
                                </p>
                            </div>

                            {/* Live Preview Box */}
                            <div className="rounded-xl bg-[#1D1C1A] p-4 text-center">
                                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                                    Live Top Bar Preview
                                </span>
                                <p className="text-xs uppercase tracking-[0.15em] font-medium text-cream">
                                    {form.notice_bar_text || 'Interior Products Wholesale Showroom & Farm'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Panel 2: Contact Information */}
                    {activeTab === 'contact' && (
                        <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-5">
                            <div className="pb-3 border-b border-slate-100">
                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <Phone size={16} className="text-emerald-600" />
                                    Studio Contact Details
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    These credentials populate the Contact page, footer, and inquiry widgets.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <Phone size={13} className="text-slate-400" />
                                        Primary Contact Phone
                                    </label>
                                    <input
                                        type="text"
                                        value={form.contact_phone}
                                        onChange={(e) => handleChange('contact_phone', e.target.value)}
                                        placeholder="01626778573"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-mono font-bold focus:bg-white focus:border-violet-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <Mail size={13} className="text-slate-400" />
                                        Inquiry Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={form.contact_email}
                                        onChange={(e) => handleChange('contact_email', e.target.value)}
                                        placeholder="contact@architexture.com"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:border-violet-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <MapPin size={13} className="text-slate-400" />
                                        Showroom / Atelier Address
                                    </label>
                                    <input
                                        type="text"
                                        value={form.contact_address}
                                        onChange={(e) => handleChange('contact_address', e.target.value)}
                                        placeholder="Mohakhali, Dhaka, Bangladesh"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:border-violet-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <Clock size={13} className="text-slate-400" />
                                        Showroom Visiting Hours
                                    </label>
                                    <input
                                        type="text"
                                        value={form.contact_hours}
                                        onChange={(e) => handleChange('contact_hours', e.target.value)}
                                        placeholder="Sat - Thu: 10:00 AM - 08:00 PM"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:border-violet-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Panel 3: General Brand */}
                    {activeTab === 'general' && (
                        <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
                            <div className="pb-3 border-b border-slate-100">
                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <Globe size={16} className="text-blue-600" />
                                    Brand & SEO Identity
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Studio / Brand Name
                                    </label>
                                    <input
                                        type="text"
                                        value={form.site_title}
                                        onChange={(e) => handleChange('site_title', e.target.value)}
                                        placeholder="ARCHI-TEXTURE"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:bg-white focus:border-violet-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Tagline
                                    </label>
                                    <input
                                        type="text"
                                        value={form.site_tagline}
                                        onChange={(e) => handleChange('site_tagline', e.target.value)}
                                        placeholder="Interior Products Wholesale Showroom and Farm"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:border-violet-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bottom Save Trigger */}
                    <div className="flex items-center justify-end gap-3 pt-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 px-6 py-2.5 text-xs font-bold text-white transition-all shadow-sm shadow-violet-500/20 disabled:opacity-60"
                        >
                            {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
