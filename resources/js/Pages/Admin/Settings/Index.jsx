import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import {
    Save, CheckCircle, Bell, Phone, MapPin, Mail, Clock, Globe,
    Building2, BookOpen, ExternalLink, UploadCloud, Image as ImageIcon,
    Users, Plus, Trash2, Edit3, X, Check, Share2
} from 'lucide-react';

const SOCIAL_ICONS = {
    facebook: ({ size = 16, className = '' }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    ),
    instagram: ({ size = 16, className = '' }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
    ),
    youtube: ({ size = 16, className = '' }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    ),
    linkedin: ({ size = 16, className = '' }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
    ),
    pinterest: ({ size = 16, className = '' }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M12 0a12 12 0 0 0-4.37 23.18c-.07-.94-.13-2.39.03-3.42.14-.94.94-3.99.94-3.99s-.24-.48-.24-1.19c0-1.12.65-1.95 1.46-1.95.69 0 1.02.52 1.02 1.14 0 .69-.44 1.73-.67 2.69-.19.8.4 1.46 1.19 1.46 1.43 0 2.53-1.51 2.53-3.69 0-1.93-1.39-3.28-3.37-3.28-2.46 0-3.9 1.85-3.9 3.76 0 .74.29 1.54.64 1.97.07.09.08.16.06.25-.07.28-.22.88-.25 1-.04.16-.13.2-.3.12-1.12-.52-1.82-2.15-1.82-3.46 0-2.82 2.05-5.41 5.91-5.41 3.1 0 5.51 2.21 5.51 5.16 0 3.08-1.94 5.56-4.64 5.56-.91 0-1.76-.47-2.05-1.02l-.56 2.13c-.2.78-.75 1.76-1.12 2.36A12 12 0 1 0 12 0z"/>
        </svg>
    ),
    whatsapp: ({ size = 16, className = '' }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
    ),
};

const DEFAULT_TEAM = [
    {
        id: 1,
        name: 'Lutfor Rahaman',
        role: 'Principal Architect & Creative Director',
        experience: '12+ Years Experience',
        bio: 'Specializing in contemporary organic architecture and luxury residential transformations across South Asia and Europe.',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        tags: ['Spatial Design', 'Master Planning', 'Bespoke Joinery'],
        is_active: true,
    },
    {
        id: 2,
        name: 'Elena Rostova',
        role: 'Senior Interior Architect',
        experience: '9+ Years Experience',
        bio: 'Focuses on tactile materiality, historical restoration, and harmonious color psychology for private residential estates.',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
        tags: ['Color Theory', 'Materiality', 'Lighting Schemes'],
        is_active: true,
    },
    {
        id: 3,
        name: 'Marcus Sterling',
        role: 'Head of Furniture & Procurement',
        experience: '8+ Years Experience',
        bio: 'Coordinates artisan trade ateliers and custom furniture fabrications, ensuring flawless white-glove delivery.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        tags: ['Artisan Trade', 'Custom Millwork', 'Procurement'],
        is_active: true,
    },
];

export default function SettingsIndex({ settings = [] }) {
    const [form, setForm] = useState(() => {
        const map = {
            // Notice Bar defaults
            notice_bar_text: 'Interior Products Wholesale Showroom & Farm',
            notice_bar_active: '1',

            // About Us Hero & Story defaults
            about_eyebrow: 'About ARCHI-TEXTURE',
            about_title: 'Where Spatial Harmony Meets Timeless Interior Artistry',
            about_bio: 'At ARCHI-TEXTURE, we curate bespoke residential sanctuaries, wholesale interior products, and luxury architectural spaces. By uniting architectural rigor with tactile natural materials, we transform everyday living into an inspiring experience.',
            about_stat1_value: '12+',
            about_stat1_label: 'Years of Craft',
            about_stat2_value: '350+',
            about_stat2_label: 'Bespoke Spaces',
            about_stat3_value: '15+',
            about_stat3_label: 'Design Accolades',
            about_stat4_value: '100%',
            about_stat4_label: 'Delight Guarantee',

            // Team section defaults
            about_team_eyebrow: 'Creative Direction',
            about_team_title: 'Meet Our Principal Design Team',
            about_team_subtitle: 'Generational architects, interior sculptors, and procurement specialists dedicated to your vision.',
            about_team_members: JSON.stringify(DEFAULT_TEAM),

            // Standards & CTA defaults
            about_standards_title: 'Meticulous Precision at Every Stage',
            about_standards_desc: 'From structural layout to the final textile drape, our studio upholds an uncompromising standard of execution to guarantee timeless living spaces.',
            about_image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80',
            about_image_quote: 'Generational Craft, Modern Living',
            about_image_subtitle: 'Every project is custom engineered for longevity and effortless beauty.',
            about_cta_title: 'Begin Your Architectural & Interior Journey',
            about_cta_desc: 'Collaborate with our senior interior architects and experience the ease of bespoke turnkey transformation.',

            // Contact defaults
            contact_phone: '01626778573',
            contact_email: 'contact@architexture.com',
            contact_address: 'Mohakhali, Dhaka, Bangladesh',
            contact_hours: 'Sat - Thu: 10:00 AM - 08:00 PM',

            // Join Our Community / Social Media defaults
            facebook_url: 'https://facebook.com',
            instagram_url: 'https://instagram.com',
            youtube_url: 'https://youtube.com',
            linkedin_url: '',
            pinterest_url: '',
            whatsapp_url: '',

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
    const [aboutImageFile, setAboutImageFile] = useState(null);
    const [aboutImagePreview, setAboutImagePreview] = useState(form.about_image || '');

    // Team Members Local State
    const [teamList, setTeamList] = useState(() => {
        try {
            if (form.about_team_members) {
                const parsed = typeof form.about_team_members === 'string'
                    ? JSON.parse(form.about_team_members)
                    : form.about_team_members;
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) {}
        return DEFAULT_TEAM;
    });

    const [editingMember, setEditingMember] = useState(null);
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [uploadingMemberPhoto, setUploadingMemberPhoto] = useState(false);
    const [memberPhotoError, setMemberPhotoError] = useState('');
    const [memberForm, setMemberForm] = useState({
        name: '',
        role: '',
        experience: '8+ Years Experience',
        bio: '',
        image: '',
        tags: '',
        is_active: true, // Always active by default
    });

    const handleMemberPhotoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setMemberPhotoError('');
        const localPreview = URL.createObjectURL(file);
        setMemberForm((prev) => ({ ...prev, image: localPreview }));
        setUploadingMemberPhoto(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'team');

            const res = await axios.post('/admin/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const rawUrl = res.data?.data?.url || res.data?.url;
            const cleanUrl = rawUrl ? rawUrl.replace(/^https?:\/\/[^\/]+/, '') : localPreview;

            setMemberForm((prev) => ({ ...prev, image: cleanUrl }));
        } catch (err) {
            console.error('Member photo upload error:', err);
            setMemberPhotoError(err.response?.data?.message || 'Failed to upload photo. Please try again.');
        } finally {
            setUploadingMemberPhoto(false);
        }
    };

    const handleChange = (key, val) => {
        setForm((prev) => ({ ...prev, [key]: val }));
    };

    const handleAboutImageFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setAboutImageFile(file);
            setAboutImagePreview(URL.createObjectURL(file));
        }
    };

    // Open Modal for Add
    const handleOpenAddMember = () => {
        setEditingMember(null);
        setMemberForm({
            name: '',
            role: '',
            experience: '8+ Years Experience',
            bio: '',
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
            tags: 'Spatial Design, Materials',
            is_active: true, // Always active
        });
        setShowMemberModal(true);
    };

    // Open Modal for Edit
    const handleOpenEditMember = (member) => {
        setEditingMember(member);
        setMemberForm({
            name: member.name || '',
            role: member.role || '',
            experience: member.experience || '',
            bio: member.bio || '',
            image: member.image || '',
            tags: Array.isArray(member.tags) ? member.tags.join(', ') : (member.tags || ''),
            is_active: member.is_active !== false,
        });
        setShowMemberModal(true);
    };

    // Save Member to List
    const handleSaveMember = (e) => {
        e.preventDefault();
        const tagArray = memberForm.tags
            ? memberForm.tags.split(',').map((t) => t.trim()).filter(Boolean)
            : [];

        let updated;
        if (editingMember) {
            updated = teamList.map((m) =>
                m.id === editingMember.id
                    ? {
                          ...m,
                          ...memberForm,
                          tags: tagArray,
                          is_active: true, // Always active when updated
                      }
                    : m
            );
        } else {
            const newMember = {
                id: Date.now(),
                ...memberForm,
                tags: tagArray,
                is_active: true, // Always active when created
            };
            updated = [...teamList, newMember];
        }

        setTeamList(updated);
        handleChange('about_team_members', JSON.stringify(updated));
        setShowMemberModal(false);
    };

    // Delete Member
    const handleDeleteMember = (id, name) => {
        if (confirm(`Remove "${name}" from the Principal Design Team?`)) {
            const updated = teamList.filter((m) => m.id !== id);
            setTeamList(updated);
            handleChange('about_team_members', JSON.stringify(updated));
        }
    };

    const handleSave = (e) => {
        e?.preventDefault();
        setSaving(true);
        setSaved(false);

        const formData = new FormData();
        Object.entries(form).forEach(([key, val]) => {
            formData.append(`settings[${key}]`, val ?? '');
        });

        // Ensure current teamList is committed
        formData.append('settings[about_team_members]', JSON.stringify(teamList));

        if (aboutImageFile) {
            formData.append('about_image_file', aboutImageFile);
        }

        router.post('/admin/settings', formData, {
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
            <Head title="Notice Bar, About & Contact Settings — Admin" />

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
                            Directly edit top announcement banner text, About Us story, design team, contact info, and showroom location.
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
                <div className="flex items-center gap-2 border-b border-slate-200/60 pb-3 overflow-x-auto scrollbar-none">
                    <button
                        onClick={() => setActiveTab('notice')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                            activeTab === 'notice'
                                ? 'bg-violet-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        <Bell size={14} />
                        <span>Top Notice Bar</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('about')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                            activeTab === 'about'
                                ? 'bg-violet-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        <Building2 size={14} />
                        <span>About Us</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('contact')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                            activeTab === 'contact'
                                ? 'bg-violet-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        <Phone size={14} />
                        <span>Contact & Studio Info</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('community')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                            activeTab === 'community'
                                ? 'bg-violet-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        <Share2 size={14} />
                        <span>Join Our Community</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('general')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
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

                    {/* Panel 2: About Us (Linked to /about) */}
                    {activeTab === 'about' && (
                        <div className="space-y-6">
                            {/* Card 1: Hero & Story */}
                            <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                            <BookOpen size={16} className="text-violet-600" />
                                            About Us Story & Hero Banner
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Content shown at the top of the public About page (/about).
                                        </p>
                                    </div>
                                    <a
                                        href="/about"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition"
                                    >
                                        <span>View Live About Page</span>
                                        <ExternalLink size={12} className="text-slate-400" />
                                    </a>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                            Eyebrow Tag
                                        </label>
                                        <input
                                            type="text"
                                            value={form.about_eyebrow}
                                            onChange={(e) => handleChange('about_eyebrow', e.target.value)}
                                            placeholder="About ARCHI-TEXTURE"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:border-violet-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                            Hero Headline Title
                                        </label>
                                        <input
                                            type="text"
                                            value={form.about_title}
                                            onChange={(e) => handleChange('about_title', e.target.value)}
                                            placeholder="Where Spatial Harmony Meets Timeless Interior Artistry"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:bg-white focus:border-violet-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Studio Story Narrative & Philosophy
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={form.about_bio}
                                        onChange={(e) => handleChange('about_bio', e.target.value)}
                                        placeholder="Describe your studio's mission, craftsmanship, bespoke materials, and spatial philosophy..."
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs text-slate-800 leading-relaxed font-normal focus:bg-white focus:border-violet-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Card 2: 4 Core Milestone Stats */}
                            <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
                                <div className="pb-3 border-b border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Above-the-Fold Milestone Statistics
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        The 4 highlighted metrics prominently displayed below the hero narrative.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 space-y-2">
                                        <span className="text-[11px] font-bold text-violet-700 block">Metric 01</span>
                                        <input
                                            type="text"
                                            value={form.about_stat1_value}
                                            onChange={(e) => handleChange('about_stat1_value', e.target.value)}
                                            placeholder="12+"
                                            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-extrabold text-slate-900 focus:border-violet-500 focus:outline-none"
                                        />
                                        <input
                                            type="text"
                                            value={form.about_stat1_label}
                                            onChange={(e) => handleChange('about_stat1_label', e.target.value)}
                                            placeholder="Years of Craft"
                                            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-violet-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 space-y-2">
                                        <span className="text-[11px] font-bold text-violet-700 block">Metric 02</span>
                                        <input
                                            type="text"
                                            value={form.about_stat2_value}
                                            onChange={(e) => handleChange('about_stat2_value', e.target.value)}
                                            placeholder="350+"
                                            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-extrabold text-slate-900 focus:border-violet-500 focus:outline-none"
                                        />
                                        <input
                                            type="text"
                                            value={form.about_stat2_label}
                                            onChange={(e) => handleChange('about_stat2_label', e.target.value)}
                                            placeholder="Bespoke Spaces"
                                            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-violet-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 space-y-2">
                                        <span className="text-[11px] font-bold text-violet-700 block">Metric 03</span>
                                        <input
                                            type="text"
                                            value={form.about_stat3_value}
                                            onChange={(e) => handleChange('about_stat3_value', e.target.value)}
                                            placeholder="15+"
                                            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-extrabold text-slate-900 focus:border-violet-500 focus:outline-none"
                                        />
                                        <input
                                            type="text"
                                            value={form.about_stat3_label}
                                            onChange={(e) => handleChange('about_stat3_label', e.target.value)}
                                            placeholder="Design Accolades"
                                            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-violet-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 space-y-2">
                                        <span className="text-[11px] font-bold text-violet-700 block">Metric 04</span>
                                        <input
                                            type="text"
                                            value={form.about_stat4_value}
                                            onChange={(e) => handleChange('about_stat4_value', e.target.value)}
                                            placeholder="100%"
                                            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-extrabold text-slate-900 focus:border-violet-500 focus:outline-none"
                                        />
                                        <input
                                            type="text"
                                            value={form.about_stat4_label}
                                            onChange={(e) => handleChange('about_stat4_label', e.target.value)}
                                            placeholder="Delight Guarantee"
                                            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-violet-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Meet Our Principal Design Team (Editable Option) */}
                            <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                            <Users size={16} className="text-violet-600" />
                                            Meet Our Principal Design Team
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Manage the architects, interior sculptors, and creative directors featured on the About page.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleOpenAddMember}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 px-3.5 py-2 text-xs font-bold text-white transition shadow-sm shadow-violet-500/20"
                                    >
                                        <Plus size={14} strokeWidth={2.5} />
                                        <span>Add Team Member</span>
                                    </button>
                                </div>

                                {/* Section Headings */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                            Section Eyebrow
                                        </label>
                                        <input
                                            type="text"
                                            value={form.about_team_eyebrow}
                                            onChange={(e) => handleChange('about_team_eyebrow', e.target.value)}
                                            placeholder="Creative Direction"
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 font-medium focus:border-violet-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                            Section Title
                                        </label>
                                        <input
                                            type="text"
                                            value={form.about_team_title}
                                            onChange={(e) => handleChange('about_team_title', e.target.value)}
                                            placeholder="Meet Our Principal Design Team"
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 font-bold focus:border-violet-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                            Section Subtitle
                                        </label>
                                        <input
                                            type="text"
                                            value={form.about_team_subtitle}
                                            onChange={(e) => handleChange('about_team_subtitle', e.target.value)}
                                            placeholder="Generational architects, interior sculptors..."
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-violet-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Team Members Cards List */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {teamList.map((member) => (
                                        <div
                                            key={member.id}
                                            className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-violet-200 transition flex flex-col justify-between"
                                        >
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="h-16 w-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                                        <img
                                                            src={member.image}
                                                            alt={member.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center justify-between gap-1">
                                                            <h4 className="font-bold text-xs text-slate-900 truncate">
                                                                {member.name}
                                                            </h4>
                                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                                                                Active
                                                            </span>
                                                        </div>
                                                        <p className="text-[11px] font-medium text-violet-700 truncate mt-0.5">
                                                            {member.role}
                                                        </p>
                                                        <span className="inline-block mt-1 text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                                            {member.experience}
                                                        </span>
                                                    </div>
                                                </div>

                                                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                                                    {member.bio}
                                                </p>

                                                {member.tags && (
                                                    <div className="flex flex-wrap gap-1 pt-1">
                                                        {(Array.isArray(member.tags) ? member.tags : member.tags.split(',')).map((t, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="rounded bg-slate-100 text-[9px] text-slate-600 px-1.5 py-0.5"
                                                            >
                                                                {typeof t === 'string' ? t.trim() : t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenEditMember(member)}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 transition"
                                                >
                                                    <Edit3 size={12} />
                                                    <span>Edit</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteMember(member.id, member.name)}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white hover:bg-red-50 px-2.5 py-1 text-[11px] font-medium text-red-600 transition"
                                                >
                                                    <Trash2 size={12} />
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Card 4: Studio Standards & Craft Showcase */}
                            <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
                                <div className="pb-3 border-b border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Studio Standards & Craftsmanship Showcase
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Quality promise headline, description, and featured editorial photo.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                            Standards Section Title
                                        </label>
                                        <input
                                            type="text"
                                            value={form.about_standards_title}
                                            onChange={(e) => handleChange('about_standards_title', e.target.value)}
                                            placeholder="Meticulous Precision at Every Stage"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:bg-white focus:border-violet-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                            Overlay Quote on Image
                                        </label>
                                        <input
                                            type="text"
                                            value={form.about_image_quote}
                                            onChange={(e) => handleChange('about_image_quote', e.target.value)}
                                            placeholder="Generational Craft, Modern Living"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:border-violet-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Standards Narrative Description
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={form.about_standards_desc}
                                        onChange={(e) => handleChange('about_standards_desc', e.target.value)}
                                        placeholder="From structural layout to the final textile drape, our studio upholds an uncompromising standard..."
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-800 font-medium focus:bg-white focus:border-violet-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Showcase Image
                                    </label>
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <label className="flex flex-col items-center justify-center w-full sm:w-56 h-28 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                                            <div className="flex flex-col items-center justify-center p-3 text-slate-500">
                                                <UploadCloud className="w-6 h-6 mb-1 text-slate-400" />
                                                <p className="text-[11px] font-semibold">Upload Photo</p>
                                                <p className="text-[9px] text-slate-400">PNG, JPG, WEBP</p>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleAboutImageFileChange} />
                                        </label>

                                        {aboutImagePreview ? (
                                            <div className="relative h-28 w-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                                                <img src={aboutImagePreview} alt="Showcase Preview" className="h-full w-full object-cover" />
                                                <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded font-medium">
                                                    Preview
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="h-28 w-44 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400">
                                                <ImageIcon size={20} />
                                                <span className="text-[9px] mt-1">No image</span>
                                            </div>
                                        )}

                                        <div className="flex-1 w-full">
                                            <label className="block text-[11px] text-slate-500 mb-1">Or Direct Web Image URL</label>
                                            <input
                                                type="text"
                                                value={form.about_image}
                                                onChange={(e) => {
                                                    handleChange('about_image', e.target.value);
                                                    if (!aboutImageFile) setAboutImagePreview(e.target.value);
                                                }}
                                                placeholder="https://images.unsplash.com/photo-..."
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-violet-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 5: Call to Action Banner */}
                            <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
                                <div className="pb-3 border-b border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Bottom Call to Action Banner
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Invite prospective clients to collaborate and contact your team.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                            CTA Heading
                                        </label>
                                        <input
                                            type="text"
                                            value={form.about_cta_title}
                                            onChange={(e) => handleChange('about_cta_title', e.target.value)}
                                            placeholder="Begin Your Architectural & Interior Journey"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:bg-white focus:border-violet-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                            CTA Subtitle
                                        </label>
                                        <input
                                            type="text"
                                            value={form.about_cta_desc}
                                            onChange={(e) => handleChange('about_cta_desc', e.target.value)}
                                            placeholder="Collaborate with our senior interior architects..."
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:border-violet-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Panel 3: Contact Information */}
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

                    {/* Panel 4: Join Our Community (Social Media Links) */}
                    {activeTab === 'community' && (
                        <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                        <Share2 size={16} className="text-violet-600" />
                                        Join Our Community (Social Media Links)
                                    </h3>
                                </div>
                                <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 w-fit">
                                    Live Footer Sync
                                </span>
                            </div>

                            {/* Live Footer Preview Box */}
                            <div className="rounded-xl bg-[#1D1C1A] text-cream p-5 border border-[#2D2C2A] shadow-inner">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C5A880]">
                                            Footer Preview
                                        </span>
                                        <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-cream/70 mt-1">
                                            Join Our Community
                                        </h4>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {[
                                            { key: 'facebook_url', label: 'Facebook', Icon: SOCIAL_ICONS.facebook },
                                            { key: 'instagram_url', label: 'Instagram', Icon: SOCIAL_ICONS.instagram },
                                            { key: 'youtube_url', label: 'YouTube', Icon: SOCIAL_ICONS.youtube },
                                            { key: 'linkedin_url', label: 'LinkedIn', Icon: SOCIAL_ICONS.linkedin },
                                            { key: 'pinterest_url', label: 'Pinterest', Icon: SOCIAL_ICONS.pinterest },
                                            { key: 'whatsapp_url', label: 'WhatsApp', Icon: SOCIAL_ICONS.whatsapp },
                                        ].map(({ key, label, Icon }) => {
                                            const active = Boolean(form[key]?.trim());
                                            return (
                                                <div
                                                    key={key}
                                                    title={active ? `${label}: ${form[key]}` : `${label}: Not set (hidden)`}
                                                    className={`rounded-full p-2 border transition-all ${
                                                        active
                                                            ? 'border-[#C5A880] text-white bg-[#C5A880]/20'
                                                            : 'border-white/10 text-white/20'
                                                    }`}
                                                >
                                                    <Icon size={14} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <p className="text-[11px] text-cream/50 mt-3">
                                    Platforms with a valid link will automatically appear in your footer. Leave blank to hide.
                                </p>
                            </div>

                            {/* Inputs Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Facebook */}
                                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                                                <SOCIAL_ICONS.facebook size={14} />
                                            </span>
                                            Facebook Page / Profile
                                        </label>
                                        {form.facebook_url && (
                                            <a
                                                href={form.facebook_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-medium"
                                            >
                                                Test <ExternalLink size={10} />
                                            </a>
                                        )}
                                    </div>
                                    <input
                                        type="url"
                                        value={form.facebook_url}
                                        onChange={(e) => handleChange('facebook_url', e.target.value)}
                                        placeholder="https://facebook.com/your-brand"
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 font-medium focus:border-violet-500 focus:outline-none"
                                    />
                                </div>

                                {/* Instagram */}
                                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                            <span className="p-1.5 rounded-lg bg-pink-100 text-pink-600">
                                                <SOCIAL_ICONS.instagram size={14} />
                                            </span>
                                            Instagram Profile
                                        </label>
                                        {form.instagram_url && (
                                            <a
                                                href={form.instagram_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[11px] text-pink-600 hover:underline flex items-center gap-1 font-medium"
                                            >
                                                Test <ExternalLink size={10} />
                                            </a>
                                        )}
                                    </div>
                                    <input
                                        type="url"
                                        value={form.instagram_url}
                                        onChange={(e) => handleChange('instagram_url', e.target.value)}
                                        placeholder="https://instagram.com/your-brand"
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 font-medium focus:border-violet-500 focus:outline-none"
                                    />
                                </div>

                                {/* YouTube */}
                                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                            <span className="p-1.5 rounded-lg bg-red-100 text-red-600">
                                                <SOCIAL_ICONS.youtube size={14} />
                                            </span>
                                            YouTube Channel
                                        </label>
                                        {form.youtube_url && (
                                            <a
                                                href={form.youtube_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[11px] text-red-600 hover:underline flex items-center gap-1 font-medium"
                                            >
                                                Test <ExternalLink size={10} />
                                            </a>
                                        )}
                                    </div>
                                    <input
                                        type="url"
                                        value={form.youtube_url}
                                        onChange={(e) => handleChange('youtube_url', e.target.value)}
                                        placeholder="https://youtube.com/@your-channel"
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 font-medium focus:border-violet-500 focus:outline-none"
                                    />
                                </div>

                                {/* LinkedIn */}
                                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                            <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
                                                <SOCIAL_ICONS.linkedin size={14} />
                                            </span>
                                            LinkedIn Company / Profile
                                        </label>
                                        {form.linkedin_url && (
                                            <a
                                                href={form.linkedin_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[11px] text-sky-700 hover:underline flex items-center gap-1 font-medium"
                                            >
                                                Test <ExternalLink size={10} />
                                            </a>
                                        )}
                                    </div>
                                    <input
                                        type="url"
                                        value={form.linkedin_url}
                                        onChange={(e) => handleChange('linkedin_url', e.target.value)}
                                        placeholder="https://linkedin.com/company/your-brand"
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 font-medium focus:border-violet-500 focus:outline-none"
                                    />
                                </div>

                                {/* Pinterest */}
                                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                            <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                                                <SOCIAL_ICONS.pinterest size={14} />
                                            </span>
                                            Pinterest Profile
                                        </label>
                                        {form.pinterest_url && (
                                            <a
                                                href={form.pinterest_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[11px] text-rose-700 hover:underline flex items-center gap-1 font-medium"
                                            >
                                                Test <ExternalLink size={10} />
                                            </a>
                                        )}
                                    </div>
                                    <input
                                        type="url"
                                        value={form.pinterest_url}
                                        onChange={(e) => handleChange('pinterest_url', e.target.value)}
                                        placeholder="https://pinterest.com/your-brand"
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 font-medium focus:border-violet-500 focus:outline-none"
                                    />
                                </div>

                                {/* WhatsApp */}
                                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
                                                <SOCIAL_ICONS.whatsapp size={14} />
                                            </span>
                                            WhatsApp Link or Phone
                                        </label>
                                        {form.whatsapp_url && (
                                            <a
                                                href={
                                                    form.whatsapp_url.startsWith('http')
                                                        ? form.whatsapp_url
                                                        : `https://wa.me/${form.whatsapp_url.replace(/[^0-9]/g, '')}`
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-medium"
                                            >
                                                Test <ExternalLink size={10} />
                                            </a>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        value={form.whatsapp_url}
                                        onChange={(e) => handleChange('whatsapp_url', e.target.value)}
                                        placeholder="+8801626778573 or https://wa.me/8801626778573"
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 font-medium focus:border-violet-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Panel 5: General Brand */}
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

            {/* Modal for Add / Edit Team Member */}
            {showMemberModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
                    onClick={() => setShowMemberModal(false)}
                >
                    <div
                        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">
                                    {editingMember ? 'Edit Principal Member' : 'Add Team Member'}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {editingMember
                                        ? 'Update architect details — always active upon saving.'
                                        : 'Newly created members are set to Active by default.'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowMemberModal(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveMember} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={memberForm.name}
                                        onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                                        placeholder="e.g. Lutfor Rahaman"
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-violet-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Role / Architectural Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={memberForm.role}
                                        onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                                        placeholder="e.g. Principal Architect & Creative Director"
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-violet-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Experience Badge
                                    </label>
                                    <input
                                        type="text"
                                        value={memberForm.experience}
                                        onChange={(e) => setMemberForm({ ...memberForm, experience: e.target.value })}
                                        placeholder="e.g. 12+ Years Experience"
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-violet-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Specialization Tags (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={memberForm.tags}
                                        onChange={(e) => setMemberForm({ ...memberForm, tags: e.target.value })}
                                        placeholder="Spatial Design, Lighting, Joinery"
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-violet-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Portrait Photo *
                                </label>

                                <div className="space-y-3">
                                    <div className="flex flex-col sm:flex-row items-center gap-3">
                                        {/* Upload button area */}
                                        <label className="flex flex-col items-center justify-center w-full sm:w-52 h-28 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors shrink-0 relative overflow-hidden group">
                                            <div className="flex flex-col items-center justify-center p-2 text-center text-slate-500">
                                                {uploadingMemberPhoto ? (
                                                    <div className="flex flex-col items-center">
                                                        <div className="h-5 w-5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mb-1" />
                                                        <span className="text-[10px] font-semibold text-violet-600">Uploading photo...</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <UploadCloud className="w-6 h-6 mb-1 text-slate-400 group-hover:text-violet-600 transition-colors" />
                                                        <span className="text-[11px] font-semibold text-slate-700">Click to upload photo</span>
                                                        <span className="text-[9px] text-slate-400">PNG, JPG, WEBP up to 10MB</span>
                                                    </>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                disabled={uploadingMemberPhoto}
                                                onChange={handleMemberPhotoUpload}
                                            />
                                        </label>

                                        {/* Live Preview Box */}
                                        {memberForm.image ? (
                                            <div className="relative h-28 w-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-2xs">
                                                <img
                                                    src={memberForm.image}
                                                    alt="Member Preview"
                                                    className="h-full w-full object-cover"
                                                />
                                                <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1 py-0.5 rounded font-medium">
                                                    Preview
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="h-28 w-24 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 shrink-0">
                                                <ImageIcon size={20} />
                                                <span className="text-[9px] mt-1">No Photo</span>
                                            </div>
                                        )}

                                        {/* Or Direct URL Input */}
                                        <div className="flex-1 w-full min-w-0">
                                            <label className="block text-[11px] text-slate-500 mb-1">
                                                Or Direct Image URL
                                            </label>
                                            <input
                                                type="text"
                                                value={memberForm.image}
                                                onChange={(e) => setMemberForm({ ...memberForm, image: e.target.value })}
                                                placeholder="https://images.unsplash.com/photo-..."
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:bg-white focus:border-violet-500 focus:outline-none"
                                            />
                                            {memberForm.image && (
                                                <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                                                    <Check size={11} /> Photo attached &amp; ready
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {memberPhotoError && (
                                        <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                                            {memberPhotoError}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Bio / Narrative
                                </label>
                                <textarea
                                    rows={3}
                                    value={memberForm.bio}
                                    onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })}
                                    placeholder="Describe their design focus, materials expertise, or spatial background..."
                                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-violet-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                    <Check size={13} />
                                    Always Active on Live Site
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowMemberModal(false)}
                                        className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded-xl bg-violet-600 text-xs font-bold text-white hover:bg-violet-700 shadow-sm shadow-violet-500/20"
                                    >
                                        {editingMember ? 'Update Member' : 'Add to Team'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
