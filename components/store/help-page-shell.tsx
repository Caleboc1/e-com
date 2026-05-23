import Link from "next/link";

export function HelpPageShell({
  tag,
  title,
  intro,
  children
}: {
  tag: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-12">
      <nav className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.15em] text-text-muted">
        <Link href="/" className="text-earth transition-colors hover:text-charcoal">
          Home
        </Link>
        <span>·</span>
        <span>{tag}</span>
      </nav>

      <div className="mt-10 grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <span className="section-tag">{tag}</span>
          <h1 className="font-display text-[clamp(2.8rem,5vw,4.8rem)] font-light leading-none">{title}</h1>
          <p className="mt-8 max-w-md text-sm leading-8 text-text-muted">{intro}</p>
        </div>

        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}

export function HelpSection({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-linen-dark bg-white p-8">
      <h2 className="font-display text-3xl font-light">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-8 text-text-muted">{children}</div>
    </section>
  );
}
