import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import axios from 'axios';
import {
    ArrowRight, Phone, CheckCircle2, Edit3, Plus, Trash2, X, Check,
    Users, Sparkles, UploadCloud, Image as ImageIcon
} from 'lucide-react';

/* -------------------------------------------------- */
/* Default Studio Team                                */
/* -------------------------------------------------- */
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

const STANDARDS = [
    'Rigorous structural & spatial feasibility analysis',
    'Curated palettes of natural marble, brass, and hardwood',
    'Photorealistic 3D virtual walkthroughs before fabrication',
    'Direct coordination with specialized generational artisans',
    'Comprehensive budget fidelity and transparent procurement',
    '100% Delight Guarantee on every completed commission',
];

export default function About({ experiences = [], education = [], settings = {} }) {
    const { props } = usePage();
    const isAdmin = !!props.auth?.user;
    const phone = settings.phone || settings.contact_phone || '01626778573';

    // Parse team members from database settings with fallback
    const teamList = useMemo(() => {
        if (settings.about_team_members) {
            try {
                const parsed = typeof settings.about_team_members === 'string'
                    ? JSON.parse(settings.about_team_members)
                    : settings.about_team_members;
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed.filter((m) => m.is_active !== false);
                }
            } catch (e) {}
        }
        return DEFAULT_TEAM;
    }, [settings.about_team_members]);

    // Frontend Team Management Modal State
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [localTeam, setLocalTeam] = useState(teamList);
    const [editingMember, setEditingMember] = useState(null);
    const [showMemberForm, setShowMemberForm] = useState(false);
    const [uploadingMemberPhoto, setUploadingMemberPhoto] = useState(false);
    const [memberPhotoError, setMemberPhotoError] = useState('');
    const [memberForm, setMemberForm] = useState({
        name: '',
        role: '',
        experience: '8+ Years Experience',
        bio: '',
        image: '',
        tags: '',
        is_active: true, // Always active
    });
    const [savingTeam, setSavingTeam] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);

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

    const handleOpenTeamModal = () => {
        if (!isAdmin) {
            router.visit('/admin/settings');
            return;
        }
        setLocalTeam([...teamList]);
        setShowMemberForm(false);
        setEditingMember(null);
        setMemberPhotoError('');
        setShowTeamModal(true);
    };

    const handleOpenAddForm = () => {
        setEditingMember(null);
        setMemberPhotoError('');
        setMemberForm({
            name: '',
            role: '',
            experience: '8+ Years Experience',
            bio: '',
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
            tags: 'Spatial Design, Materials',
            is_active: true, // Always active
        });
        setShowMemberForm(true);
    };

    const handleOpenEditForm = (member) => {
        setEditingMember(member);
        setMemberPhotoError('');
        setMemberForm({
            name: member.name || '',
            role: member.role || '',
            experience: member.experience || '',
            bio: member.bio || '',
            image: member.image || '',
            tags: Array.isArray(member.tags) ? member.tags.join(', ') : (member.tags || ''),
            is_active: true,
        });
        setShowMemberForm(true);
    };

    const handleSaveMemberForm = (e) => {
        e.preventDefault();
        const tagArray = memberForm.tags
            ? (Array.isArray(memberForm.tags)
                  ? memberForm.tags
                  : memberForm.tags.split(',').map((t) => t.trim()).filter(Boolean))
            : [];

        let updated;
        if (editingMember) {
            updated = localTeam.map((m) =>
                m.id === editingMember.id
                    ? {
                          ...m,
                          ...memberForm,
                          tags: tagArray,
                          is_active: true, // Always active
                      }
                    : m
            );
        } else {
            const newMember = {
                id: Date.now(),
                ...memberForm,
                tags: tagArray,
                is_active: true, // Always active
            };
            updated = [...localTeam, newMember];
        }

        setLocalTeam(updated);
        setShowMemberForm(false);
        setEditingMember(null);
    };

    const handleDeleteMember = (id, name) => {
        if (confirm(`Remove "${name}" from the design team?`)) {
            setLocalTeam((prev) => prev.filter((m) => m.id !== id));
        }
    };

    const handleSaveAllToLive = () => {
        setSavingTeam(true);
        router.post(
            '/admin/settings',
            {
                settings: {
                    about_team_members: JSON.stringify(localTeam),
                },
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSavingTeam(false);
                    setSavedSuccess(true);
                    setTimeout(() => {
                        setSavedSuccess(false);
                        setShowTeamModal(false);
                    }, 800);
                },
                onError: () => setSavingTeam(false),
            }
        );
    };

    return (
        <PublicLayout settings={settings}>
            <Head title={`About Us — ${settings.site_title || settings.company_name || 'ARCHI-TEXTURE'}`} />

            <div className="text-charcoal selection:bg-bronze selection:text-white">
                
                {/* -------------------------------------------------- */}
                {/* 1. Above-The-Fold Responsive Hero & Stats Section  */}
                {/* -------------------------------------------------- */}
                <section
                    onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                        e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
                        e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
                    }}
                    className="relative flex min-h-[calc(100vh-80px)] flex-col justify-center overflow-hidden bg-gradient-to-b from-[#181715] via-[#211F1C] to-[#161514] py-10 sm:py-14 md:py-18 text-white border-b border-sand/10"
                >
                    {/* Interactive Radial Glow Follower */}
                    <div
                        className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-500"
                        style={{
                            background:
                                'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(169, 137, 82, 0.28), transparent 70%)',
                        }}
                    />

                    {/* Subtle dot overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#A98952_1px,transparent_1px)] [background-size:24px_24px] sm:[background-size:28px_28px] opacity-10" />

                    <div className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-8 lg:px-10 text-center">
                        <p className="eyebrow !text-bronze-light mb-3 text-xs tracking-[0.2em]">
                            {settings.about_eyebrow || `About ${settings.site_title || settings.company_name || 'ARCHI-TEXTURE'}`}
                        </p>
                        <h1 className="font-serif-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.15] sm:leading-[1.12]">
                            {settings.about_title || 'Where Spatial Harmony Meets Timeless Interior Artistry'}
                        </h1>

                        <p className="mx-auto mt-3 sm:mt-5 max-w-2xl text-xs sm:text-sm md:text-base text-cream/80 font-light leading-relaxed px-1 sm:px-0">
                            {settings.about_bio ||
                                `At ${settings.site_title || settings.company_name || 'ARCHI-TEXTURE'}, we curate bespoke residential sanctuaries, wholesale interior products, and luxury architectural spaces. By uniting architectural rigor with tactile natural materials, we transform everyday living into an inspiring experience.`}
                        </p>

                        {/* 4 Core Studio Stats — Immediately Visible Above-The-Fold */}
                        <div className="mt-8 sm:mt-10 md:mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-4 max-w-4xl mx-auto">
                            <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 sm:p-4 md:p-5 backdrop-blur-sm transition-all duration-300 hover:border-bronze/50 hover:bg-white/[0.08] shadow-lg">
                                <span className="font-serif-display text-2xl sm:text-3xl md:text-4xl text-bronze-light font-bold block">
                                    {settings.about_stat1_value || '12+'}
                                </span>
                                <p className="mt-1 text-[11px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.14em] text-cream/80 font-medium">
                                    {settings.about_stat1_label || 'Years of Craft'}
                                </p>
                            </div>
                            <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 sm:p-4 md:p-5 backdrop-blur-sm transition-all duration-300 hover:border-bronze/50 hover:bg-white/[0.08] shadow-lg">
                                <span className="font-serif-display text-2xl sm:text-3xl md:text-4xl text-bronze-light font-bold block">
                                    {settings.about_stat2_value || '350+'}
                                </span>
                                <p className="mt-1 text-[11px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.14em] text-cream/80 font-medium">
                                    {settings.about_stat2_label || 'Bespoke Spaces'}
                                </p>
                            </div>
                            <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 sm:p-4 md:p-5 backdrop-blur-sm transition-all duration-300 hover:border-bronze/50 hover:bg-white/[0.08] shadow-lg">
                                <span className="font-serif-display text-2xl sm:text-3xl md:text-4xl text-bronze-light font-bold block">
                                    {settings.about_stat3_value || '15+'}
                                </span>
                                <p className="mt-1 text-[11px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.14em] text-cream/80 font-medium">
                                    {settings.about_stat3_label || 'Design Accolades'}
                                </p>
                            </div>
                            <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 sm:p-4 md:p-5 backdrop-blur-sm transition-all duration-300 hover:border-bronze/50 hover:bg-white/[0.08] shadow-lg">
                                <span className="font-serif-display text-2xl sm:text-3xl md:text-4xl text-bronze-light font-bold block">
                                    {settings.about_stat4_value || '100%'}
                                </span>
                                <p className="mt-1 text-[11px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.14em] text-cream/80 font-medium">
                                    {settings.about_stat4_label || 'Delight Guarantee'}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* -------------------------------------------------- */}
                {/* 3. Leadership & Principal Architects (Pure White)  */}
                {/* -------------------------------------------------- */}
                <section className="py-16 sm:py-20 md:py-24 bg-white border-b border-sand/70">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                            <p className="eyebrow mb-2">
                                {settings.about_team_eyebrow || 'Creative Direction'}
                            </p>
                            <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl text-charcoal font-medium">
                                {settings.about_team_title || 'Meet Our Principal Design Team'}
                            </h2>
                            <p className="mt-3 text-sm md:text-base text-charcoal/70 font-light leading-relaxed">
                                {settings.about_team_subtitle || 'Generational architects, interior sculptors, and procurement specialists dedicated to your vision.'}
                            </p>

                            {/* Front-End Editable Action Trigger */}
                            <div className="mt-4 flex items-center justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleOpenTeamModal}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-bronze/40 bg-[#FAF7F2] hover:bg-bronze hover:text-white px-3.5 py-1.5 text-xs font-semibold text-charcoal transition-all shadow-2xs group"
                                    title={isAdmin ? 'Edit Team Members directly from front end' : 'Sign in to edit team members'}
                                >
                                    <Edit3 size={13} className="text-bronze group-hover:text-white transition-colors" />
                                    <span>{isAdmin ? 'Edit Design Team (Admin)' : 'Manage Team'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Team Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8">
                            {teamList.map((member) => (
                                <div
                                    key={member.id || member.name}
                                    className="group rounded-2xl border border-sand/80 bg-[#FAF7F2]/70 p-4 sm:p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:bg-white hover:border-bronze/40 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="aspect-[4/5] rounded-xl overflow-hidden bg-sand/30 mb-4 sm:mb-5 relative">
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            {member.experience && (
                                                <span className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 rounded-full bg-charcoal/90 px-2.5 py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-bronze-light backdrop-blur-sm">
                                                    {member.experience}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="font-serif-display text-lg sm:text-xl text-charcoal font-medium">
                                            {member.name}
                                        </h3>
                                        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-bronze mt-1">
                                            {member.role}
                                        </p>
                                        <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-charcoal/70 leading-relaxed font-light">
                                            {member.bio}
                                        </p>
                                    </div>

                                    {member.tags && (
                                        <div className="mt-4 pt-3 border-t border-sand/70 flex flex-wrap gap-1.5">
                                            {(Array.isArray(member.tags) ? member.tags : member.tags.split(',')).map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="rounded-md bg-white border border-sand px-2 py-0.5 text-[9px] sm:text-[10px] uppercase tracking-wider text-charcoal/70 font-medium"
                                                >
                                                    {typeof tag === 'string' ? tag.trim() : tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* -------------------------------------------------- */}
                {/* 4. Studio Standards & Quality Promise (Warm Cream) */}
                {/* -------------------------------------------------- */}
                <section className="py-16 sm:py-20 md:py-24 bg-[#FAF7F2] border-b border-sand/70">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                            <div>
                                <p className="eyebrow mb-2">Our Standards</p>
                                <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl text-charcoal font-medium leading-tight">
                                    {settings.about_standards_title || 'Meticulous Precision at Every Stage'}
                                </h2>
                                <p className="mt-4 text-sm md:text-base text-charcoal/70 font-light leading-relaxed">
                                    {settings.about_standards_desc ||
                                        'From structural layout to the final textile drape, our studio upholds an uncompromising standard of execution to guarantee timeless living spaces.'}
                                </p>

                                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    {STANDARDS.map((std, i) => (
                                        <div key={i} className="flex items-start gap-2.5 bg-white p-3.5 rounded-xl border border-sand/80 shadow-sm">
                                            <CheckCircle2 size={18} className="text-bronze shrink-0 mt-0.5" />
                                            <span className="text-xs sm:text-[13px] text-charcoal/80 font-medium leading-snug">{std}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-sand">
                                <img
                                    src={settings.about_image || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80"}
                                    alt="Luxury Interior Studio Craft"
                                    className="w-full aspect-[4/3] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent flex items-end p-6 sm:p-8">
                                    <div className="text-white">
                                        <p className="font-serif-display text-xl sm:text-2xl font-medium">
                                            {settings.about_image_quote || 'Generational Craft, Modern Living'}
                                        </p>
                                        <p className="text-xs text-white/80 mt-1">
                                            {settings.about_image_subtitle || 'Every project is custom engineered for longevity and effortless beauty.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* -------------------------------------------------- */}
                {/* 5. Responsive Call To Action Banner (Dark)         */}
                {/* -------------------------------------------------- */}
                <section className="relative overflow-hidden bg-charcoal py-16 sm:py-20 md:py-24 text-center text-white">
                    <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6">
                        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-bronze-light mb-2 sm:mb-3">
                            Ready To Elevate Your Space?
                        </p>
                        <h2 className="font-serif-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-tight text-white">
                            {settings.about_cta_title || 'Begin Your Architectural & Interior Journey'}
                        </h2>
                        <p className="mx-auto mt-2.5 sm:mt-4 max-w-xl text-xs sm:text-sm md:text-base text-white/70 leading-relaxed font-light px-2 sm:px-0">
                            {settings.about_cta_desc ||
                                'Collaborate with our senior interior architects and experience the ease of bespoke turnkey transformation.'}
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md sm:max-w-none mx-auto">
                            <Link
                                href="/contact"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[8px] bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-charcoal shadow-xl transition-all duration-300 hover:bg-bronze hover:text-white"
                            >
                                <span>Start Your Project</span>
                                <ArrowRight size={15} />
                            </Link>

                            <a
                                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[8px] border border-white/20 bg-transparent px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-white/10 transition-colors"
                            >
                                <Phone size={14} className="text-bronze-light" />
                                <span>{phone}</span>
                            </a>
                        </div>
                    </div>
                </section>

            </div>

            {/* Front-End Design Team Management Modal */}
            {showTeamModal && (
                <div
                    className="fixed inset-0 z-[150] flex items-center justify-center bg-charcoal/85 p-4 backdrop-blur-sm transition-all"
                    onClick={() => setShowTeamModal(false)}
                >
                    <div
                        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-sand space-y-4 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-3 border-b border-sand/60">
                            <div className="flex items-center gap-2.5">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-bronze/10 text-bronze">
                                    <Users size={16} />
                                </span>
                                <div>
                                    <h3 className="font-serif-display text-lg font-medium text-charcoal">
                                        Principal Design Team
                                    </h3>
                                    <p className="text-[11px] text-charcoal/60">
                                        Add, edit, or delete architects. Changes publish live immediately.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowTeamModal(false)}
                                className="rounded-lg p-1 text-charcoal/40 hover:bg-sand/30 hover:text-charcoal"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Inline Form for Add / Edit */}
                        {showMemberForm ? (
                            <form onSubmit={handleSaveMemberForm} className="bg-sand/20 p-4 rounded-xl border border-sand space-y-3">
                                <div className="flex items-center justify-between pb-2 border-b border-sand/40">
                                    <span className="text-xs font-bold text-charcoal">
                                        {editingMember ? `Edit: ${editingMember.name}` : 'New Team Member'}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setShowMemberForm(false)}
                                        className="text-xs text-charcoal/60 hover:text-charcoal"
                                    >
                                        Cancel
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-charcoal/80 mb-1">Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={memberForm.name}
                                            onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                                            placeholder="e.g. Lutfor Rahaman"
                                            className="w-full rounded-lg border border-sand bg-white px-3 py-1.5 text-xs text-charcoal focus:border-bronze focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-charcoal/80 mb-1">Role / Title *</label>
                                        <input
                                            type="text"
                                            required
                                            value={memberForm.role}
                                            onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                                            placeholder="Principal Architect"
                                            className="w-full rounded-lg border border-sand bg-white px-3 py-1.5 text-xs text-charcoal focus:border-bronze focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-charcoal/80 mb-1">Experience Badge</label>
                                        <input
                                            type="text"
                                            value={memberForm.experience}
                                            onChange={(e) => setMemberForm({ ...memberForm, experience: e.target.value })}
                                            placeholder="12+ Years Experience"
                                            className="w-full rounded-lg border border-sand bg-white px-3 py-1.5 text-xs text-charcoal focus:border-bronze focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-charcoal/80 mb-1">Tags (comma-separated)</label>
                                        <input
                                            type="text"
                                            value={memberForm.tags}
                                            onChange={(e) => setMemberForm({ ...memberForm, tags: e.target.value })}
                                            placeholder="Spatial Design, Master Planning"
                                            className="w-full rounded-lg border border-sand bg-white px-3 py-1.5 text-xs text-charcoal focus:border-bronze focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-charcoal/80 mb-1.5">Portrait Photo *</label>
                                    
                                    <div className="space-y-2">
                                        <div className="flex flex-col sm:flex-row items-center gap-3">
                                            {/* Upload box */}
                                            <label className="flex flex-col items-center justify-center w-full sm:w-44 h-24 border-2 border-dashed border-sand/80 rounded-xl cursor-pointer bg-white hover:bg-sand/20 transition-colors shrink-0 relative overflow-hidden group">
                                                <div className="flex flex-col items-center justify-center p-2 text-center text-charcoal/60">
                                                    {uploadingMemberPhoto ? (
                                                        <div className="flex flex-col items-center">
                                                            <div className="h-4 w-4 border-2 border-bronze border-t-transparent rounded-full animate-spin mb-1" />
                                                            <span className="text-[10px] font-semibold text-bronze">Uploading...</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <UploadCloud className="w-5 h-5 mb-1 text-bronze group-hover:scale-110 transition-transform" />
                                                            <span className="text-[10px] font-semibold text-charcoal">Upload Photo</span>
                                                            <span className="text-[8px] text-charcoal/50">PNG, JPG, WEBP</span>
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

                                            {/* Preview */}
                                            {memberForm.image ? (
                                                <div className="relative h-24 w-20 rounded-xl overflow-hidden border border-sand bg-sand/30 shrink-0 shadow-2xs">
                                                    <img
                                                        src={memberForm.image}
                                                        alt="Portrait Preview"
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <span className="absolute bottom-1 right-1 bg-charcoal/80 text-white text-[7px] px-1 py-0.5 rounded font-medium">
                                                        Preview
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="h-24 w-20 rounded-xl border border-sand bg-white flex flex-col items-center justify-center text-charcoal/30 shrink-0">
                                                    <ImageIcon size={18} />
                                                    <span className="text-[8px] mt-0.5">No Photo</span>
                                                </div>
                                            )}

                                            {/* Web URL fallback */}
                                            <div className="flex-1 w-full min-w-0">
                                                <label className="block text-[10px] text-charcoal/60 mb-0.5">Or Photo URL</label>
                                                <input
                                                    type="text"
                                                    value={memberForm.image}
                                                    onChange={(e) => setMemberForm({ ...memberForm, image: e.target.value })}
                                                    placeholder="https://images.unsplash.com/..."
                                                    className="w-full rounded-lg border border-sand bg-white px-2.5 py-1.5 text-xs text-charcoal focus:border-bronze focus:outline-none"
                                                />
                                                {memberForm.image && (
                                                    <p className="text-[9px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
                                                        <Check size={10} /> Photo ready
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
                                    <label className="block text-[11px] font-semibold text-charcoal/80 mb-1">Bio</label>
                                    <textarea
                                        rows={2}
                                        value={memberForm.bio}
                                        onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })}
                                        placeholder="Brief architect biography..."
                                        className="w-full rounded-lg border border-sand bg-white p-2 text-xs text-charcoal focus:border-bronze focus:outline-none"
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                                        <Check size={12} /> Always Active
                                    </span>
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-bronze px-4 py-1.5 text-xs font-semibold text-white hover:bg-bronze-dark transition"
                                    >
                                        {editingMember ? 'Update Member' : 'Add Member'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-charcoal/70">
                                    Current Architects ({localTeam.length})
                                </span>
                                <button
                                    type="button"
                                    onClick={handleOpenAddForm}
                                    className="inline-flex items-center gap-1 rounded-lg bg-bronze px-3 py-1.5 text-xs font-semibold text-white hover:bg-bronze-dark transition shadow-2xs"
                                >
                                    <Plus size={14} />
                                    <span>Add Member</span>
                                </button>
                            </div>
                        )}

                        {/* Members List */}
                        <div className="space-y-2.5 max-h-60 overflow-y-auto">
                            {localTeam.map((m) => (
                                <div
                                    key={m.id || m.name}
                                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-sand bg-white hover:border-bronze/40 transition shadow-2xs"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="h-12 w-10 rounded-lg overflow-hidden bg-sand/30 shrink-0 border border-sand">
                                            <img src={m.image} alt={m.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-xs font-bold text-charcoal truncate">{m.name}</h4>
                                            <p className="text-[11px] text-bronze truncate">{m.role}</p>
                                            <span className="text-[10px] text-charcoal/50">{m.experience}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenEditForm(m)}
                                            className="rounded-lg border border-sand p-1.5 text-charcoal/70 hover:bg-sand/30 hover:text-charcoal transition"
                                            title="Edit Member"
                                        >
                                            <Edit3 size={13} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteMember(m.id, m.name)}
                                            className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50 transition"
                                            title="Delete Member"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-sand/60">
                            <span className="text-[11px] text-charcoal/50">
                                Changes are immediately active upon saving.
                            </span>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowTeamModal(false)}
                                    className="px-4 py-2 rounded-lg border border-sand text-xs font-medium text-charcoal/70 hover:bg-sand/20"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    disabled={savingTeam}
                                    onClick={handleSaveAllToLive}
                                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-bronze text-xs font-semibold text-white hover:bg-bronze-dark transition shadow-sm disabled:opacity-50"
                                >
                                    {savingTeam ? (
                                        <span>Saving to Live Site...</span>
                                    ) : savedSuccess ? (
                                        <>
                                            <Check size={14} />
                                            <span>Saved &amp; Published!</span>
                                        </>
                                    ) : (
                                        <span>Save &amp; Publish Live</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
