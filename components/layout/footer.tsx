import Link from "next/link";

import { FOOTER_COLUMNS } from "@/lib/constants";

export function Footer() {
  return (
    <>
      <footer className="bg-charcoal px-6 py-16 md:px-12">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="font-display text-[1.4rem] tracking-[0.3em] text-[#ede8df]">
              SAIIA
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-8 text-white/35">
              Effortless essentials and Adire prints for everyone. Designed and made in Lagos.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="mb-5 text-[0.65rem] uppercase tracking-[0.25em] text-white/40">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/55 transition-colors hover:text-white/90">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
      <div className="flex flex-col items-center justify-between gap-2 border-t border-white/10 bg-charcoal px-6 py-5 text-center md:flex-row md:px-12 md:text-left">
        <span className="text-[0.68rem] tracking-[0.08em] text-white/25">
          © 2026 SAIIA. All rights reserved. Lagos, Nigeria.
        </span>
        <Link href="https://instagram.com" className="text-[0.68rem] tracking-[0.08em] text-white/40 transition-colors hover:text-white/80">
          Instagram
        </Link>
      </div>
    </>
  );
}
