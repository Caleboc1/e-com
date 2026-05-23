"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/store/cart-provider";

const megaMenus = {
  Women: {
    title: "Collection No. 01",
    feature: "The Linen\nCollection",
    links: [
      ["New Arrivals", "/shop?category=women"],
      ["T-Shirts", "/shop?category=women&type=t-shirt"],
      ["Dresses", "/shop?category=women&type=dress"]
    ]
  },
  Men: {
    title: "Limited Run",
    feature: "Adire\nfor Men",
    links: [
      ["New Arrivals", "/shop?category=men"],
      ["T-Shirts", "/shop?category=men&type=t-shirt"],
      ["Plain & Linen", "/shop?category=men&print=plain"]
    ]
  },
  Kids: {
    title: "For Little Ones",
    feature: "Mini\nCollection",
    links: [
      ["Girls", "/shop?category=kids&type=dress"],
      ["Boys", "/shop?category=kids&type=t-shirt"],
      ["Adire Edit", "/shop?category=kids&print=adire"]
    ]
  }
} as const;

export function Navbar() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-charcoal/10 bg-white/90 backdrop-blur transition-all",
        scrolled ? "px-6 py-4 md:px-12" : "px-6 py-6 md:px-12"
      )}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6">
        <Link href="/" className="font-body text-[1.35rem] font-medium tracking-[0.38em]">
          SAIIA
        </Link>

        <ul className="hidden items-center md:flex">
          {NAV_LINKS.map((link) => {
            const menu = megaMenus[link.label as keyof typeof megaMenus];

            return (
              <li key={link.href} className="group relative">
                <Link
                  href={link.href}
                  className={cn(
                    "block px-5 py-2 text-[0.72rem] uppercase tracking-[0.18em] text-earth transition-colors hover:text-charcoal",
                    pathname === link.href && "text-charcoal"
                  )}
                >
                  {link.label}
                </Link>

                {menu ? (
                  <div className="invisible fixed left-0 right-0 top-16 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                    <div className="border-y border-charcoal/10 bg-white px-12 py-10 shadow-[0_8px_24px_rgba(44,37,32,0.06)]">
                      <div className="mx-auto grid max-w-[1200px] grid-cols-[1fr_220px] gap-8">
                        <div className="grid grid-cols-3 gap-8">
                          <div className="border-r border-linen-dark pr-8">
                            <span className="mb-4 block text-[0.6rem] uppercase tracking-[0.25em] text-clay-dark">
                              Clothing
                            </span>
                            <ul className="space-y-3 text-sm text-charcoal">
                              {menu.links.map(([label, href], index) => (
                                <li key={href}>
                                  <Link
                                    href={href}
                                    className={cn(
                                      "transition-colors hover:text-clay-dark",
                                      index === 0 && "font-display text-base italic text-clay-dark"
                                    )}
                                  >
                                    {label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="border-r border-linen-dark pr-8">
                            <span className="mb-4 block text-[0.6rem] uppercase tracking-[0.25em] text-clay-dark">
                              Story
                            </span>
                            <p className="copy-muted max-w-xs text-sm">
                              Essentials built around natural fibres, generous movement, and quiet confidence.
                            </p>
                          </div>
                          <div />
                        </div>

                        <div
                          className={cn(
                            "flex min-h-[200px] flex-col justify-end p-6",
                            link.label === "Men" ? "bg-adire-blue text-[#ede8df]" : "bg-linen"
                          )}
                        >
                          <span
                            className={cn(
                              "mb-2 text-[0.6rem] uppercase tracking-[0.2em]",
                              link.label === "Men" ? "text-adire-light" : "text-clay-dark"
                            )}
                          >
                            {menu.title}
                          </span>
                          <p className="whitespace-pre-line font-display text-[1.35rem] leading-tight">
                            {menu.feature}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-5 text-[0.72rem] uppercase tracking-[0.15em] text-earth">
          {/* <Link href="/admin" className="hidden transition-colors hover:text-charcoal md:block">
            Admin
          </Link> */}
          <button
            type="button"
            onClick={openCart}
            className="flex items-center gap-2 transition-colors hover:text-charcoal"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Bag ({itemCount})</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
