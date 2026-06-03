import Link from "next/link";

import { AdirePattern } from "@/components/store/adire-pattern";
import { NewsletterSignupForm } from "@/components/store/newsletter-signup-form";
import { ProductCard } from "@/components/store/product-card";
import { buttonVariants } from "@/components/ui/button";
import { TICKER_ITEMS } from "@/lib/constants";
import { getFeaturedProducts } from "@/lib/store";

const colorways = [
  { name: "Indigo Night", type: "Eleko · Classic", bg: "#1E2E52", pattern: "circle" as const },
  { name: "Burnt Earth", type: "Alabere · Bold", bg: "#8B3A2A", pattern: "hex" as const },
  { name: "Forest Dusk", type: "Oniko · Natural", bg: "#2A4A2E", pattern: "grid" as const },
  { name: "Faded Rose", type: "Eleko · Feminine", bg: "#8B4A55", pattern: "circle" as const },
  { name: "Saffron Sun", type: "Alabere · Warm", bg: "#9A6B10", pattern: "hex" as const },
  { name: "Ash & Smoke", type: "Eleko · Minimal", bg: "#3A3530", pattern: "cross" as const }
];

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <section className="grid min-h-screen md:grid-cols-2">
        <div className="relative flex flex-col justify-end overflow-hidden bg-linen px-6 pb-20 pt-10 md:px-16">
          <div className="linen-grid absolute inset-0" />
          <div className="relative max-w-lg animate-fade-up">
            <span className="section-tag">Collection No. 01</span>
            <h1 className="font-display text-[clamp(3.5rem,6vw,5.5rem)] font-light leading-[0.98] text-charcoal">
              Dressed in
              <br />
              <em className="text-clay-dark">quiet</em>
              <br />
              confidence.
            </h1>
            <p className="mt-8 max-w-sm text-sm leading-8 text-text-muted">
              Essentials crafted for everyday life. Natural fibres, effortless silhouettes, and the soul of Adire
              worn with ease, by everyone.
            </p>
            <Link href="/shop" className={`${buttonVariants()} mt-10`}>
              Shop the Collection
            </Link>
          </div>
        </div>

        <div className="relative flex items-center justify-center overflow-hidden bg-adire-blue">
          <svg className="absolute inset-0 h-full w-full opacity-[0.18]" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
              <pattern id="hero-adire" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="40" cy="40" r="28" fill="none" stroke="white" strokeWidth="0.8" />
                <circle cx="40" cy="40" r="18" fill="none" stroke="white" strokeWidth="0.5" />
                <circle cx="40" cy="40" r="8" fill="none" stroke="white" strokeWidth="0.8" />
                <line x1="40" y1="12" x2="40" y2="68" stroke="white" strokeWidth="0.4" />
                <line x1="12" y1="40" x2="68" y2="40" stroke="white" strokeWidth="0.4" />
              </pattern>
            </defs>
            <rect width="400" height="600" fill="url(#hero-adire)" />
          </svg>
          <Link
            href="#adire"
            className="relative inline-flex border border-white/40 px-8 py-4 text-[0.7rem] uppercase tracking-[0.2em] text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            Explore Adire
          </Link>
        </div>
      </section>

      <div className="overflow-hidden border-y border-linen-dark bg-white py-4">
        <div className="flex min-w-max animate-ticker gap-6 whitespace-nowrap text-[0.72rem] uppercase tracking-[0.22em] text-earth">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-6">
              {item}
              <span className="text-clay">◆</span>
            </span>
          ))}
        </div>
      </div>

      <section className="px-6 py-24 md:px-12">
        <div className="pb-12 text-center">
          <span className="section-tag">New Arrivals</span>
          <h2 className="section-title">Collection No. 01</h2>
        </div>
        <div className="mx-auto grid max-w-[1400px] gap-px bg-linen-dark md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/shop" className={buttonVariants()}>
            View All Pieces
          </Link>
        </div>
      </section>

      <section id="adire" className="bg-charcoal px-6 py-24 text-white md:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="max-w-2xl">
              <span className="section-tag">The Adire Story</span>
              <h2 className="font-display text-[clamp(2.5rem,5vw,4.4rem)] font-light leading-none text-[#ede8df]">
                Every colour
                <br />
                tells a <em>story</em>.
              </h2>
              <p className="mt-8 text-sm leading-8 text-white/65">
                Adire, Yoruba for cloth that is tied and dyed, is a centuries-old tradition of resist-printing from
                Yorubaland. At SAIIA, we work with master dyers in Abeokuta to create prints in the full spectrum of
                Adire colour.
              </p>
              <p className="mt-6 text-sm leading-8 text-white/65">
                The colours are rooted in tradition. The patterns change every season. Nothing here is accidental.
              </p>
            </div>

            <div className="space-y-8">
              {[
                ["Adire Eleko", "Starch-resist technique painted by hand using cassava starch. Creates bold geometric patterns."],
                ["Adire Oniko", "Tie-dye method using raffia to bind fabric before dyeing. Produces distinctive circular bursts."],
                ["Adire Alabere", "Sewn-resist technique using thread stitched in patterns then drawn tight. The most intricate method."]
              ].map(([title, copy]) => (
                <div key={title} className="border-t border-white/10 pt-6">
                  <h3 className="font-display text-2xl font-light text-[#ede8df]">{title}</h3>
                  <p className="mt-3 text-sm leading-8 text-white/60">{copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            {colorways.map((colorway) => (
              <div key={colorway.name} className="group relative min-h-72 overflow-hidden" style={{ background: colorway.bg }}>
                <AdirePattern variant={colorway.pattern} opacity={0.42} />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/10 px-4 py-4 backdrop-blur">
                  <div>
                    <p className="font-display text-lg text-white">{colorway.name}</p>
                    <p className="text-[0.68rem] uppercase tracking-[0.18em] text-white/60">{colorway.type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-[0.72rem] uppercase tracking-[0.18em] text-white/45">
            Hover to explore each colourway · New prints each season
          </p>
        </div>
      </section>

      <section className="px-6 py-24 text-center md:px-12">
        <span className="section-tag">Stay Close</span>
        <h2 className="font-display text-5xl font-light">Be first to know.</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-text-muted">
          New arrivals, stories from the studio, early access for members.
        </p>
        <NewsletterSignupForm />
      </section>
    </>
  );
}
