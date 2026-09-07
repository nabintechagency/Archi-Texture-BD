import AdminLayout from '@/Layouts/AdminLayout';
import ResourceTable from '@/Components/Admin/ResourceTable';
import { Head, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import api from '@/lib/api';
import { Upload, X, Image as ImageIcon, Folder } from 'lucide-react';

function UploadModal({ show, onClose, onSuccess }) {
    const [file, setFile] = useState(null);
    const [altText, setAltText] = useState('');
    const [caption, setCaption] = useState('');
    const [folder, setFolder] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef();

    if (!show) return null;

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError(null);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('alt_text', altText);
        formData.append('caption', caption);
        formData.append('folder', folder);
        try {
            await api.post('/media/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            onSuccess();
            onClose();
            setFile(null);
            setAltText('');
            setCaption('');
            setFolder('');
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Upload Media</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
                </div>

                <div
                    onClick={() => inputRef.current?.click()}
                    className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-500/5 transition-all"
                >
                    <input ref={inputRef} type="file" className="hidden" accept="image/*,video/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0])} />
                    {file ? (
                        <div>
                            <p className="text-sm text-white font-medium">{file.name}</p>
                            <p className="text-xs text-slate-400 mt-1">{formatSize(file.size)}</p>
                        </div>
                    ) : (
                        <div>
                            <Upload size={32} className="mx-auto text-slate-400 mb-2" />
                            <p className="text-sm text-slate-400">Click to select a file</p>
                            <p className="text-xs text-slate-500 mt-1">Max 10MB</p>
                        </div>
                    )}
                </div>

                <div className="mt-4 space-y-3">
                    <input type="text" value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Alt text" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none" />
                    <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none" />
                    <input type="text" value={folder} onChange={(e) => setFolder(e.target.value)} placeholder="Folder (optional)" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none" />
                </div>

                {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

                <div className="mt-4 flex justify-end gap-3">
                    <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function MediaGrid({ media, onDelete }) {
    const [preview, setPreview] = useState(null);

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {media.data?.map((item) => (
                    <div
                        key={item.id}
                        className="group relative rounded-xl border border-slate-700/50 bg-slate-800/30 overflow-hidden cursor-pointer hover:border-slate-600 transition-all"
                        onClick={() => setPreview(item)}
                    >
                        <div className="aspect-square bg-slate-800 flex items-center justify-center">
                            {item.mime_type?.startsWith('image/') ? (
                                <img src={`/${item.path}`} alt={item.alt_text || item.original_filename} className="h-full w-full object-cover" />
                            ) : (
                                <ImageIcon size={24} className="text-slate-500" />
                            )}
                        </div>
                        <div className="p-2">
                            <p className="text-xs text-white truncate">{item.original_filename}</p>
                            <p className="text-xs text-slate-500">{formatSize(item.size)}</p>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                            className="absolute top-2 right-2 h-6 w-6 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}
            </div>

            {preview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setPreview(null)}>
                    <div className="absolute inset-0 bg-black/80" />
                    <div className="relative z-10 max-w-4xl max-h-[80vh] p-4">
                        {preview.mime_type?.startsWith('image/') ? (
                            <img src={`/${preview.path}`} alt={preview.alt_text || preview.original_filename} className="max-h-[80vh] rounded-lg shadow-2xl" />
                        ) : (
                            <div className="bg-slate-900 rounded-lg p-8 text-center">
                                <ImageIcon size={48} className="mx-auto text-slate-500 mb-2" />
                                <p className="text-white">{preview.original_filename}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default function MediaIndex({ media, filters }) {
    const [showUpload, setShowUpload] = useState(false);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this file?')) {
            router.delete(`/admin/media/${id}`, { onSuccess: () => router.reload() });
        }
    };

    return (
        <AdminLayout title="Media">
            <Head title="Admin — Media" />
            <div className="p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Media Library</h2>
                        <p className="text-sm text-slate-400">{media.total} files</p>
                    </div>
                    <button
                        onClick={() => setShowUpload(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-colors"
                    >
                        <Upload size={16} /> Upload File
                    </button>
                </div>

                {media.data?.length > 0 ? (
                    <MediaGrid media={media} onDelete={handleDelete} />
                ) : (
                    <div className="text-center py-16">
                        <ImageIcon size={48} className="mx-auto text-slate-600 mb-3" />
                        <p className="text-slate-400">No media files yet.</p>
                        <button onClick={() => setShowUpload(true)} className="mt-4 text-sm text-indigo-400 hover:text-indigo-300">Upload your first file</button>
                    </div>
                )}

                {media.last_page > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        {media.links.map((link, i) => (
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

                <UploadModal show={showUpload} onClose={() => setShowUpload(false)} onSuccess={() => router.reload()} />
            </div>
        </AdminLayout>
    );
}
