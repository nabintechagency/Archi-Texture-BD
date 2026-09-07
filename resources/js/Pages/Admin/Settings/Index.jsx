import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Settings, Save, CheckCircle } from 'lucide-react';
import api from '@/lib/api';

export default function SettingsIndex({ settings }) {
    const [form, setForm] = useState(() => {
        const map = {};
        settings.forEach((s) => { map[s.key] = Array.isArray(s.value) ? JSON.stringify(s.value, null, 2) : (s.value ?? ''); });
        return map;
    });
    const [groups, setGroups] = useState(() => [...new Set(settings.map((s) => s.group || 'general'))]);
    const [activeGroup, setActiveGroup] = useState(groups[0] || 'general');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const filteredSettings = settings.filter((s) => (s.group || 'general') === activeGroup);

    const handleSave = async () => {
        setSaving(true);
        setSuccess(false);
        try {
            const promises = settings.map((s) => {
                let value = form[s.key];
                if (value && value.startsWith('[')) {
                    try { value = JSON.parse(value); } catch {}
                }
                return api.patch(`/settings/${s.id}`, { value });
            });
            await Promise.all(promises);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            alert('Failed to save settings: ' + (err.response?.data?.message || err.message));
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout title="Settings">
            <Head title="Admin — Settings" />
            <div className="p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Site Settings</h2>
                        <p className="text-sm text-slate-400">Configure your site's general settings</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                    >
                        {saving ? 'Saving...' : success ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Tabs */}
                    <div className="lg:w-48 shrink-0">
                        <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
                            {groups.map((group) => (
                                <button
                                    key={group}
                                    onClick={() => setActiveGroup(group)}
                                    className={`rounded-lg px-3 py-2 text-sm font-medium text-left whitespace-nowrap transition-colors ${
                                        activeGroup === group
                                            ? 'bg-indigo-600 text-white'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    {group.charAt(0).toUpperCase() + group.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Fields */}
                    <div className="flex-1 rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">{activeGroup} Settings</h3>
                        <div className="space-y-4">
                            {filteredSettings.map((setting) => (
                                <div key={setting.id}>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                        {setting.key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </label>
                                    <textarea
                                        value={form[setting.key] ?? ''}
                                        onChange={(e) => setForm((prev) => ({ ...prev, [setting.key]: e.target.value }))}
                                        rows={setting.key.includes('description') || setting.key.includes('bio') || setting.key.includes('content') ? 4 : 2}
                                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
                                    />
                                    <p className="mt-1 text-xs text-slate-600">Key: <code className="text-slate-500">{setting.key}</code></p>
                                </div>
                            ))}
                            {filteredSettings.length === 0 && (
                                <p className="text-sm text-slate-500 py-4">No settings in this group yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
