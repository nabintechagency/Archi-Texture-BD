import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { Briefcase, GraduationCap, Award, Calendar, MapPin } from 'lucide-react';
import PageHero from '@/Components/PageHero';
import SectionHeader from '@/Components/SectionHeader';

function TimelineItem({ item, type }) {
    const isExperience = type === 'experience';
    return (
        <div className="relative pl-8 before:absolute before:left-[5px] before:top-2 before:bottom-0 before:w-px before:bg-neutral-200">
            <div className={`absolute left-0 top-2 h-2.5 w-2.5 rounded-full border-2 ${isExperience ? 'border-neutral-900' : 'border-neutral-400'} bg-white`} />
            <div className="rounded-xl border border-neutral-200 bg-white p-6 hover:border-neutral-300 transition-colors">
                {isExperience ? (
                    <>
                        <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                                <h3 className="text-base font-semibold text-neutral-900">{item.job_title}</h3>
                                <p className="text-sm font-medium text-neutral-500">{item.company}</p>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                                <Calendar size={12} />
                                <span>
                                    {item.started_at ? new Date(item.started_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                                    {' — '}
                                    {item.is_current ? 'Present' : item.ended_at ? new Date(item.ended_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                                </span>
                            </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-neutral-400">
                            {item.employment_type && <span>{item.employment_type}</span>}
                            {item.location && (
                                <span className="flex items-center gap-1">
                                    <MapPin size={11} /> {item.location}
                                </span>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className="text-base font-semibold text-neutral-900">{item.degree}</h3>
                        <p className="text-sm font-medium text-neutral-500">{item.institution}</p>
                        {item.field_of_study && (
                            <p className="text-sm text-neutral-400 mt-1">{item.field_of_study}</p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-neutral-400">
                            {item.started_at && (
                                <span className="flex items-center gap-1">
                                    <Calendar size={11} />
                                    {new Date(item.started_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                    {item.ended_at && ` — ${new Date(item.ended_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                                </span>
                            )}
                            {item.location && (
                                <span className="flex items-center gap-1">
                                    <MapPin size={11} /> {item.location}
                                </span>
                            )}
                        </div>
                    </>
                )}
                {item.description && (
                    <p className="mt-3 text-sm text-neutral-500 leading-relaxed whitespace-pre-line">{item.description}</p>
                )}
            </div>
        </div>
    );
}

function CertificationCard({ cert }) {
    return (
        <div className="rounded-xl border border-neutral-200 bg-white p-5 hover:border-neutral-300 transition-colors">
            <div className="flex items-start gap-3">
                <div className="inline-flex rounded-lg bg-neutral-100 p-2 shrink-0">
                    <Award size={16} className="text-neutral-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-sm text-neutral-900">{cert.name}</h3>
                    <p className="text-xs text-neutral-500">{cert.issuer}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-neutral-400">
                        {cert.issued_at && <span>Issued {new Date(cert.issued_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>}
                        {cert.expires_at && <span>Expires {new Date(cert.expires_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>}
                    </div>
                    {cert.credential_url && (
                        <a
                            href={cert.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                        >
                            View Credential &rarr;
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Experience({ experiences, education, certifications, settings }) {
    return (
        <PublicLayout settings={settings}>
            <Head title="Experience" />
            <PageHero
                eyebrow="The Team"
                title="Experience & Credentials"
                description="The accomplished designers and credentials behind every project."
            />
            <section className="py-16 sm:py-24">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-16">
                    {experiences.length > 0 && (
                        <div>
                            <SectionHeader title="Work Experience" />
                            <div className="space-y-6">
                                {experiences.map((exp) => (
                                    <TimelineItem key={exp.id} item={exp} type="experience" />
                                ))}
                            </div>
                        </div>
                    )}

                    {education.length > 0 && (
                        <div>
                            <SectionHeader title="Education" />
                            <div className="space-y-6">
                                {education.map((edu) => (
                                    <TimelineItem key={edu.id} item={edu} type="education" />
                                ))}
                            </div>
                        </div>
                    )}

                    {certifications.length > 0 && (
                        <div>
                            <SectionHeader title="Certifications" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {certifications.map((cert) => (
                                    <CertificationCard key={cert.id} cert={cert} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
