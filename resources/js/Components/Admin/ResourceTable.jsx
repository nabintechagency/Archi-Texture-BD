import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Trash2, Edit, Plus, Search, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { Link } from '@inertiajs/react';

function DeleteModal({ isOpen, onClose, onConfirm, label = 'this item' }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
                        <AlertTriangle size={20} className="text-red-400" />
                    </div>
                    <div>
                        <p className="font-semibold text-white text-sm">Delete Confirmation</p>
                        <p className="text-slate-400 text-xs mt-0.5">This action cannot be undone.</p>
                    </div>
                </div>
                <p className="text-slate-300 text-sm mb-6">Are you sure you want to delete {label}?</p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-slate-600 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-500 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ResourceTable({
    title,
    createHref,
    createLabel = 'Add New',
    columns,
    data,
    pagination,
    onDelete,
    editHref,
    filters,
    onSearch,
    searchPlaceholder = 'Search...',
    emptyMessage = 'No items found.',
}) {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [search, setSearch] = useState(filters?.search ?? '');

    const handleDelete = () => {
        if (deleteTarget && onDelete) {
            onDelete(deleteTarget.id);
        }
        setDeleteTarget(null);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch) onSearch(search);
    };

    const items = pagination?.data ?? data ?? [];
    const meta = pagination;

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <DeleteModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                label={deleteTarget?.label ?? 'this item'}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    {meta && (
                        <p className="text-sm text-slate-400 mt-0.5">{meta.total} total item{meta.total !== 1 ? 's' : ''}</p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {onSearch && (
                        <form onSubmit={handleSearch} className="flex items-center gap-2">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={searchPlaceholder}
                                    className="w-48 rounded-xl border border-slate-700 bg-slate-800 pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                        </form>
                    )}
                    {createHref && (
                        <Link
                            href={createHref}
                            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            <Plus size={16} />
                            {createLabel}
                        </Link>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 overflow-hidden">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="text-slate-600 text-4xl mb-3">📭</div>
                        <p className="text-slate-400 text-sm">{emptyMessage}</p>
                        {createHref && (
                            <Link
                                href={createHref}
                                className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                            >
                                Create your first item →
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700/50">
                                    {columns.map((col) => (
                                        <th
                                            key={col.key}
                                            className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                                        >
                                            {col.label}
                                        </th>
                                    ))}
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30">
                                {items.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                                        {columns.map((col) => (
                                            <td key={col.key} className="px-4 py-3 text-slate-300">
                                                {col.render ? col.render(item) : (item[col.key] ?? '—')}
                                            </td>
                                        ))}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                {editHref && (
                                                    <Link
                                                        href={editHref(item)}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-600 bg-slate-700 text-slate-300 hover:border-indigo-500 hover:bg-indigo-500/20 hover:text-indigo-300 transition-all"
                                                    >
                                                        <Edit size={14} />
                                                    </Link>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => setDeleteTarget({
                                                            id: item.id,
                                                            label: `"${item.title ?? item.name ?? item.company ?? item.author_name ?? 'this item'}"`,
                                                        })}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-600 bg-slate-700 text-slate-300 hover:border-red-500 hover:bg-red-500/20 hover:text-red-400 transition-all"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
                <div className="flex items-center justify-between text-sm">
                    <p className="text-slate-400">
                        Showing {meta.from}–{meta.to} of {meta.total}
                    </p>
                    <div className="flex items-center gap-1">
                        {meta.links.map((link, i) => {
                            if (link.label.includes('Previous')) {
                                return (
                                    <Link
                                        key={i}
                                        href={link.url ?? '#'}
                                        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                                            link.url
                                                ? 'border-slate-600 bg-slate-800 text-slate-300 hover:border-indigo-500 hover:text-indigo-300'
                                                : 'border-slate-700 bg-slate-800/50 text-slate-600 cursor-not-allowed'
                                        }`}
                                    >
                                        <ChevronLeft size={14} />
                                    </Link>
                                );
                            }
                            if (link.label.includes('Next')) {
                                return (
                                    <Link
                                        key={i}
                                        href={link.url ?? '#'}
                                        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                                            link.url
                                                ? 'border-slate-600 bg-slate-800 text-slate-300 hover:border-indigo-500 hover:text-indigo-300'
                                                : 'border-slate-700 bg-slate-800/50 text-slate-600 cursor-not-allowed'
                                        }`}
                                    >
                                        <ChevronRight size={14} />
                                    </Link>
                                );
                            }
                            return (
                                <Link
                                    key={i}
                                    href={link.url ?? '#'}
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs transition-colors ${
                                        link.active
                                            ? 'border-indigo-500 bg-indigo-600 text-white'
                                            : link.url
                                            ? 'border-slate-600 bg-slate-800 text-slate-300 hover:border-indigo-500 hover:text-indigo-300'
                                            : 'border-slate-700 bg-slate-800/50 text-slate-600 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
