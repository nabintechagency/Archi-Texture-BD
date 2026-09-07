export default function SectionHeader({ eyebrow, title, subtitle, align = 'left' }) {
    return (
        <div className={align === 'center' ? 'mb-12 text-center' : 'mb-10'}>
            {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
            <h2 className="font-serif-display text-[30px] leading-tight text-charcoal md:text-5xl">{title}</h2>
            {subtitle && <p className={`mt-3 font-medium text-charcoal/50 ${align === 'center' ? 'mx-auto max-w-xl' : ''}`}>{subtitle}</p>}
        </div>
    );
}
