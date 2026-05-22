"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";

import { ProductCard } from "@/components/store/product-card";
import type { Product, ProductCategory, ProductPrint } from "@/types";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" }
] as const;

export function ShopClient({
  products,
  initialCategory,
  initialPrint
}: {
  products: Product[];
  initialCategory?: string;
  initialPrint?: string;
}) {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    initialCategory ? new Set([initialCategory]) : new Set()
  );
  const [selectedPrints, setSelectedPrints] = useState<Set<string>>(
    initialPrint ? new Set([initialPrint]) : new Set()
  );
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]["value"]>("newest");

  useEffect(() => {
    setSelectedCategories(initialCategory ? new Set([initialCategory]) : new Set());
  }, [initialCategory]);

  useEffect(() => {
    setSelectedPrints(initialPrint ? new Set([initialPrint]) : new Set());
  }, [initialPrint]);

  function toggleSetValue(setter: React.Dispatch<React.SetStateAction<Set<string>>>, value: string) {
    setter((current) => {
      const next = new Set(current);

      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }

      return next;
    });
  }

  const visibleProducts = useMemo(() => {
    let list = products;

    if (selectedCategories.size > 0) {
      list = list.filter((product) => selectedCategories.has(product.category));
    }

    if (selectedPrints.size > 0) {
      list = list.filter((product) => selectedPrints.has(product.print));
    }

    if (sortBy === "price-asc") {
      return [...list].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-desc") {
      return [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, selectedCategories, selectedPrints, sortBy]);

  const activeFilterCount = selectedCategories.size + selectedPrints.size;

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-24 md:px-12">
      <header className="px-2 py-20 text-center">
        <span className="section-tag">Collection No. 01</span>
        <h1 className="font-display text-[clamp(2.5rem,5vw,3.8rem)] font-light leading-none">Shop All</h1>
        <p className="mt-3 text-[0.75rem] uppercase tracking-[0.15em] text-text-muted">
          {visibleProducts.length} {visibleProducts.length === 1 ? "piece" : "pieces"}
        </p>
      </header>

      <div className="grid gap-12 md:grid-cols-[240px_1fr]">
        <aside className="space-y-10 md:sticky md:top-24 md:h-fit">
          <FilterGroup<ProductCategory>
            title="Category"
            values={["women", "men", "kids"]}
            selected={selectedCategories}
            labels={{ women: "Women", men: "Men", kids: "Kids" }}
            onToggle={(value) => toggleSetValue(setSelectedCategories, value)}
          />
          <FilterGroup<ProductPrint>
            title="Print"
            values={["adire", "plain"]}
            selected={selectedPrints}
            labels={{ adire: "Adire", plain: "Plain & Linen" }}
            onToggle={(value) => toggleSetValue(setSelectedPrints, value)}
          />
          {activeFilterCount > 0 ? (
            <button
              type="button"
              className="border-t border-linen-dark pt-5 text-[0.7rem] uppercase tracking-[0.18em] text-clay-dark transition-colors hover:text-charcoal"
              onClick={() => {
                setSelectedCategories(new Set());
                setSelectedPrints(new Set());
              }}
            >
              Clear all ({activeFilterCount})
            </button>
          ) : null}
          <div className="border-t border-linen-dark pt-8">
            <span className="section-tag mb-3">Sort</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as (typeof sortOptions)[number]["value"])}
              className="w-full border-b border-clay bg-transparent pb-2 text-sm outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </aside>

        <section className="grid gap-px bg-linen-dark md:grid-cols-2 xl:grid-cols-3">
          {visibleProducts.length > 0 ? (
            visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <div className="col-span-full bg-white px-6 py-20 text-center">
              <p className="copy-muted">No pieces match these filters.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FilterGroup<T extends string>({
  title,
  values,
  selected,
  labels,
  onToggle
}: {
  title: string;
  values: T[];
  selected: Set<string>;
  labels: Record<T, string>;
  onToggle: (value: T) => void;
}) {
  return (
    <div>
      <span className="section-tag mb-4">{title}</span>
      <ul className="space-y-3">
        {values.map((value) => {
          const isActive = selected.has(value);
          return (
            <li key={value}>
              <button
                type="button"
                className={`flex items-center gap-3 text-sm text-earth transition-colors hover:text-charcoal ${isActive ? "text-charcoal" : ""}`}
                onClick={() => onToggle(value)}
              >
                <span className={`h-3 w-3 rounded-full border border-clay ${isActive ? "border-charcoal bg-charcoal" : ""}`} />
                {labels[value]}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
