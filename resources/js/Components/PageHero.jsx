export default function PageHero({ eyebrow, title, description, children }) {
    return (
        <section className="relative overflow-hidden bg-cream py-14 sm:py-20">
            <span className="font-serif-display pointer-events-none absolute -right-6 -top-10 select-none text-[200px] italic leading-none text-bronze/10 md:text-[280px]">
                d.
            </span>
            <div className="mx-auto max-w-[1440px] px-4 md:px-16 lg:px-10">
                <div className="max-w-3xl">
                    {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
                    <h1 className="font-serif-display text-4xl leading-tight text-charcoal sm:text-5xl md:text-6xl">{title}</h1>
                    {description && (
                        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-charcoal/60 md:text-xl">{description}</p>
                    )}
                    {children}
                </div>
            </div>
        </section>
    );
}
