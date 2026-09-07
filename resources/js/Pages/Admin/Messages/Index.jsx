import AdminLayout from '@/Layouts/AdminLayout';
import ResourceTable from '@/Components/Admin/ResourceTable';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import api from '@/lib/api';

function MessageModal({ message, onClose }) {
    if (!message) return null;

    const markRead = async () => {
        try {
            await api.patch(`/messages/${message.id}`, { is_read: true });
            onClose();
            router.reload();
        } catch {}
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <div>
                        <h3 className="text-lg font-semibold text-white">{message.subject || 'No Subject'}</h3>
                        <p className="text-sm text-slate-400 mt-1">From: {message.name} &lt;{message.email}&gt;</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-sm">Close</button>
                </div>
                <div className="p-6">
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{message.message}</p>
                    <p className="mt-4 text-xs text-slate-500">
                        Received {new Date(message.created_at).toLocaleString()}
                    </p>
                </div>
                <div className="flex items-center justify-between p-6 border-t border-slate-700">
                    <a href={`mailto:${message.email}`} className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors">
                        <Mail size={14} /> Reply via Email
                    </a>
                    {!message.is_read && (
                        <button onClick={markRead} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500 transition-colors">
                            <MailOpen size={14} /> Mark as Read
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function MessagesIndex({ messages, filters }) {
    const [selected, setSelected] = useState(null);
    const [isReadFilter, setIsReadFilter] = useState(filters?.is_read ?? '');

    const handleFilter = (value) => {
        setIsReadFilter(value);
        router.get('/admin/messages', { ...filters, is_read: value || undefined }, { preserveState: true, replace: true });
    };

    const handleDelete = (id) => {
        if (confirm('Delete this message?')) {
            router.delete(`/api/messages/${id}`, { onSuccess: () => router.reload() });
        }
    };

    return (
        <AdminLayout title="Messages">
            <Head title="Admin — Messages" />
            <div className="p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Messages</h2>
                        <p className="text-sm text-slate-400">{messages.total} total</p>
                    </div>
                    <div className="flex gap-2">
                        {['', 'false', 'true'].map((val) => (
                            <button
                                key={val}
                                onClick={() => handleFilter(val)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                                    isReadFilter === val
                                        ? 'bg-indigo-600 text-white'
                                        : 'border border-slate-700 text-slate-400 hover:bg-slate-800'
                                }`}
                            >
                                {val === '' ? 'All' : val === 'true' ? 'Read' : 'Unread'}
                            </button>
                        ))}
                    </div>
                </div>

                {messages.data?.length > 0 ? (
                    <div className="space-y-2">
                        {messages.data.map((msg) => (
                            <div
                                key={msg.id}
                                onClick={() => { setSelected(msg); if (!msg.is_read) { api.patch(`/messages/${msg.id}`, { is_read: true }); } }}
                                className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-all ${
                                    msg.is_read
                                        ? 'border-slate-700/50 bg-slate-800/20 hover:bg-slate-800/40'
                                        : 'border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10'
                                }`}
                            >
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${msg.is_read ? 'bg-slate-700 text-slate-400' : 'bg-indigo-600 text-white'}`}>
                                    {msg.name?.[0]?.toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className={`text-sm font-medium ${msg.is_read ? 'text-slate-300' : 'text-white'}`}>{msg.name}</p>
                                        {!msg.is_read && <span className="h-2 w-2 rounded-full bg-indigo-400" />}
                                    </div>
                                    <p className="text-xs text-slate-500 truncate">{msg.subject || msg.message?.slice(0, 80)}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xs text-slate-500">{new Date(msg.created_at).toLocaleDateString()}</p>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                                        className="mt-1 text-slate-600 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <Mail size={48} className="mx-auto text-slate-600 mb-3" />
                        <p className="text-slate-400">No messages yet.</p>
                    </div>
                )}

                {messages.last_page > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        {messages.links.map((link, i) => (
                            <a
                                key={i}
                                href={link.url || '#'}
                                className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                                    link.active ? 'bg-indigo-600 text-white' : link.url ? 'border border-slate-700 text-slate-400 hover:bg-slate-800' : 'text-slate-600'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}

                <MessageModal message={selected} onClose={() => setSelected(null)} />
            </div>
        </AdminLayout>
    );
}
