import { Link } from '@inertiajs/react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export default function FormLayout({ title, backHref, onSubmit, isSubmitting, children, submitLabel = 'Save' }) {
    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6 flex items-center gap-4">
                <Link
                    href={backHref}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600 hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} />
                </Link>
                <h2 className="text-xl font-bold text-white">{title}</h2>
            </div>

            <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
                {children}

                {/* Submit */}
                <div className="flex items-center gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        {isSubmitting ? (
                            <><Loader2 size={16} className="animate-spin" /> Saving...</>
                        ) : (
                            <><Save size={16} /> {submitLabel}</>
                        )}
                    </button>
                    <Link
                        href={backHref}
                        className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}

// Reusable field components
export function FormField({ label, error, required, children, hint }) {
    return (
        <div>
            {label && (
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                    {label} {required && <span className="text-red-400">*</span>}
                </label>
            )}
            {children}
            {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>
    );
}

export function FormInput({ error, ...props }) {
    return (
        <input
            className={`w-full rounded-xl border bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors ${
                error
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
            }`}
            {...props}
        />
    );
}

export function FormTextarea({ error, rows = 4, ...props }) {
    return (
        <textarea
            rows={rows}
            className={`w-full rounded-xl border bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors resize-none ${
                error
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
            }`}
            {...props}
        />
    );
}

export function FormSelect({ error, children, ...props }) {
    return (
        <select
            className={`w-full rounded-xl border bg-slate-800 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 transition-colors ${
                error
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
            }`}
            {...props}
        >
            {children}
        </select>
    );
}

export function FormToggle({ label, checked, onChange, description }) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3">
            <div>
                <p className="text-sm font-medium text-slate-300">{label}</p>
                {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
            </div>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-slate-600'}`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
                />
            </button>
        </div>
    );
}

export function FormCard({ title, children }) {
    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-5 space-y-4">
            {title && <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{title}</h3>}
            {children}
        </div>
    );
}

export function ErrorBanner({ errors }) {
    const list = Object.values(errors ?? {}).flat();
    if (!list.length) return null;
    return (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm font-medium text-red-400 mb-1">Please fix the following errors:</p>
            <ul className="list-disc list-inside space-y-0.5">
                {list.map((e, i) => (
                    <li key={i} className="text-xs text-red-400/80">{e}</li>
                ))}
            </ul>
        </div>
    );
}

export function SuccessBanner({ message }) {
    if (!message) return null;
    return (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <p className="text-sm text-emerald-400">{message}</p>
        </div>
    );
}
