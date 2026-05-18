export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 py-24 md:px-12">
      <span className="section-tag">Brand Story</span>
      <h1 className="font-display text-[clamp(3rem,6vw,5rem)] font-light leading-none">
        Designed in Lagos.
        <br />
        Worn with ease.
      </h1>
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <p className="text-sm leading-8 text-text-muted">
          SAIIA builds effortless essentials around natural fibres, local craft, and silhouettes that move with the
          body. The reference direction from the supplied files has been preserved here: the same warm neutrals, the
          Adire blue contrast, and the same editorial pacing between commerce and story.
        </p>
        <p className="text-sm leading-8 text-text-muted">
          This route is also where help content can expand later: sizing, returns, care instructions, FAQ, and contact
          blocks. The shared storefront shell already keeps it visually consistent with the rest of the site.
        </p>
      </div>
    </div>
  );
}
