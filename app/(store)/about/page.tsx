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
          SAIIA builds effortless essentials around natural fibres, local craft, and silhouettes that move with the body.
          The idea began with a simple search for pieces that felt easy to wear every day, clothes you could throw on without thinking, yet still feel confident, youthful, and put together in.
          At the same time, we found ourselves thinking about the next generation. Children grow quickly, their needs change constantly, and too often clothing feels temporary. We wanted to create pieces that embraced simplicity, easy to wear, easy to care for, and made to be enjoyed, shared, and passed on.
          Inspired by the artistry of Nigerian Adire and the beauty of thoughtful craftsmanship, SAIIA brings together heritage and modern living. We work with natural fibres and locally crafted textiles to create timeless pieces designed for real life.
        </p>
        <p className="text-sm leading-8 text-text-muted">
          Whether it's an everyday essential, something for a weekend away, or a piece you'll return to season after season, our focus remains the same: creating clothing that feels effortless, comfortable, and beautifully made.
          By focusing on thoughtful design rather than fleeting trends, we believe in buying less and choosing well. Pieces that are worn often, travel easily, and become part of the stories we carry with us.
          SAIIA is a celebration of simplicity, craftsmanship, and the ease of getting dressed well.
        </p>
      </div>
      <section className="mt-24 grid gap-16 md:grid-cols-[1fr_1.2fr]">
        <div className="max-w-md">
          <span className="section-tag">Our Philosophy</span>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4.4rem)] font-light leading-none">
            Made with
            <br />
            intention.
            <br />
            Worn with <em>ease</em>.
          </h2>
          <p className="mt-8 text-sm leading-8 text-text-muted">
            SAIIA is built on the belief that everyday clothing should feel considered, not complicated. We design
            for the in-between moments, the meetings, the markets, the mornings when getting dressed should be
            effortless.
          </p>
          <p className="mt-6 text-sm leading-8 text-text-muted">
            Each piece is designed in Lagos and crafted from natural fibres that breathe, move, and soften with time.
          </p>
        </div>

        <div className="grid gap-px bg-linen-dark md:grid-cols-2">
          {[
            ["01", "Natural Fibres", "Linen, cotton, and organic blends that work with your body and the climate."],
            ["02", "Considered Cuts", "Relaxed silhouettes designed to flatter without effort."],
            ["03", "Local Craft", "Made with artisans in Lagos and Abeokuta who bring generations of skill."],
            ["04", "Timeless Value", "Investment pieces priced fairly, designed to last beyond seasons."]
          ].map(([number, title, copy]) => (
            <div key={number} className="bg-white p-8">
              <span className="text-[0.7rem] uppercase tracking-[0.2em] text-clay-dark">{number}</span>
              <h3 className="mt-6 font-display text-3xl font-light">{title}</h3>
              <p className="mt-4 text-sm leading-8 text-text-muted">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
