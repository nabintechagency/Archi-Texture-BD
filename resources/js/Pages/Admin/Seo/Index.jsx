import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Save, CheckCircle, Globe, Tag, FileText } from 'lucide-react';
import api from '@/lib/api';

const seoFields = [
    { key: 'site_title', label: 'Site Title', icon: Globe, group: 'seo', placeholder: 'My Portfolio' },
    { key: 'site_description', label: 'Site Description', icon: FileText, group: 'seo', placeholder: 'A brief description of your site', rows: 3 },
    { key: 'og_title', label: 'OG Title', icon: Tag, group: 'seo', placeholder: 'Title for social media sharing' },
    { key: 'og_description', label: 'OG Description', icon: FileText, group: 'seo', placeholder: 'Description for social media sharing', rows: 3 },
    { key: 'og_image', label: 'OG Image URL', icon: Globe, group: 'seo', placeholder: 'https://example.com/og-image.png' },
    { key: 'keywords', label: 'Keywords', icon: Tag, group: 'seo', placeholder: 'developer, portfolio, react, laravel' },
    { key: 'google_analytics_id', label: 'Google Analytics ID', icon: Search, group: 'seo', placeholder: 'G-XXXXXXXXXX' },
    { key: 'robots_meta', label: 'Robots Meta', icon: Search, group: 'seo', placeholder: 'index, follow' },
];

export default function SeoIndex({ seoSettings }) {
    const [form, setForm] = useState(() => {
        const map = {};
        seoFields.forEach((field) => {
            const setting = seoSettings[field.key];
            map[field.key] = setting?.value ?? '';
        });
        return map;
    });
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        setSuccess(false);
        try {
            const promises = seoFields.map((field) => {
                const existing = seoSettings[field.key];
                if (existing) {
                    return api.patch(`/settings/${existing.id}`, { value: form[field.key] });
                }
                return api.post('/settings', { key: field.key, value: form[field.key], group: 'seo' });
            });
            await Promise.all(promises);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            alert('Failed to save SEO settings: ' + (err.response?.data?.message || err.message));
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout title="SEO Settings">
            <Head title="Admin — SEO" />
            <div className="p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-white">SEO Settings</h2>
                        <p className="text-sm text-slate-400">Optimize your site for search engines and social media</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                    >
                        {saving ? 'Saving...' : success ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> Save SEO</>}
                    </button>
                </div>

                {/* Preview Card */}
                <div className="mb-8 rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Search Preview</h3>
                    <div className="max-w-xl">
                        <p className="text-lg text-blue-400 font-medium hover:underline cursor-pointer truncate">
                            {form.site_title || 'Your Site Title'}
                        </p>
                        <p className="text-sm text-emerald-400 mt-0.5">https://yoursite.com</p>
                        <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                            {form.site_description || 'Your site description will appear here...'}
                        </p>
                    </div>
                </div>

                {/* Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {seoFields.map((field) => {
                        const Icon = field.icon;
                        return (
                            <div key={field.key} className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-5">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                    <Icon size={16} className="text-indigo-400" />
                                    {field.label}
                                </label>
                                {field.rows ? (
                                    <textarea
                                        value={form[field.key]}
                                        onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                                        rows={field.rows}
                                        placeholder={field.placeholder}
                                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={form[field.key]}
                                        onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                                        placeholder={field.placeholder}
                                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </AdminLayout>
    );
}
