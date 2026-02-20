"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { slugify } from "@/lib/utils";

// ─── tunables ────────────────────────────────────────────────────────────────
const INITIAL_COUNT = 20;          // cards rendered at start per row
const LOAD_MORE_COUNT = 12;        // cards appended when near the end
const SCROLL_SPEED = 0.45;         // px per rAF tick (~27 px/s at 60 fps) — slow & readable
const LOAD_THRESHOLD = 900;        // px from right edge that triggers a top-up
// ─────────────────────────────────────────────────────────────────────────────

interface CardItem { product: Product; key: string }

interface RowProps {
  category: string;
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

/** One auto-scrolling row for a single category */
function CategoryRow({ category, products, onAddToCart }: RowProps) {
  const trackRef   = useRef<HTMLDivElement>(null);
  const rafRef     = useRef<number>(0);
  const pausedRef  = useRef(false);
  const loadingRef = useRef(false);

  // Compute initial cards synchronously so they render on the first pass
  const initialCount = products.length > 0 ? Math.min(INITIAL_COUNT, products.length) : 0;
  const srcIdxRef = useRef(products.length > 0 ? initialCount % products.length : 0);

  const [cards, setCards] = useState<CardItem[]>(() => {
    if (products.length === 0) return [];
    return products.slice(0, initialCount).map((p, i) => ({
      product: p,
      key: `${p.id}-init-${i}`,
    }));
  });

  // Append more cards (cycles through products array infinitely)
  const loadMore = useCallback(() => {
    if (loadingRef.current || products.length === 0) return;
    loadingRef.current = true;
    const stamp = Date.now();
    const batch: CardItem[] = [];
    let idx = srcIdxRef.current;
    for (let i = 0; i < LOAD_MORE_COUNT; i++) {
      const p = products[idx % products.length];
      batch.push({ product: p, key: `${p.id}-${stamp}-${i}` });
      idx = (idx + 1) % products.length;
    }
    srcIdxRef.current = idx;
    setCards((prev) => [...prev, ...batch]);
    loadingRef.current = false;
  }, [products]);

  // rAF scroll loop — runs whenever cards change
  useEffect(() => {
    if (cards.length === 0) return;
    const el = trackRef.current;
    if (!el) return;

    const tick = () => {
      if (!pausedRef.current) {
        el.scrollLeft += SCROLL_SPEED;
        const remaining = el.scrollWidth - el.clientWidth - el.scrollLeft;
        if (remaining < LOAD_THRESHOLD && !loadingRef.current) loadMore();
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [cards, loadMore]);

  if (cards.length === 0) return null;

  return (
    <div className="mb-5 md:mb-10 lg:mb-12">
      {/* Category header */}
      <div className="flex items-end justify-between mb-4 md:mb-6 border-b border-gray-200 pb-3 md:pb-4 px-4 md:px-6 lg:px-8 max-w-[1920px] mx-auto">
        <div className="relative pb-1">
          <h3 className="font-[family-name:var(--font-playfair)] text-2xl md:text-4xl lg:text-5xl font-bold text-[#0A0A0A] tracking-tight leading-none">
            {category}
          </h3>
          <div className="absolute -bottom-0.5 left-0 h-[3px] w-12 md:w-20 lg:w-24 bg-[#E8002D] rounded-full" />
        </div>
        <Link
          href={`/category/${slugify(category)}`}
          className="group flex items-center gap-1 text-xs font-[family-name:var(--font-playfair)] text-[#0A0A0A] hover:text-[#E8002D] uppercase tracking-wider font-semibold transition-colors duration-200 mb-1"
        >
          <span className="border-b border-[#0A0A0A]/30 group-hover:border-[#E8002D] pb-0.5">
            View All
          </span>
          <ChevronRight className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
        </Link>
      </div>

      {/* Scrolling track — no edge shadows, cards fully visible */}
      <div
        ref={trackRef}
        className="flex gap-3 md:gap-4 lg:gap-5 overflow-x-auto scrollbar-hide pb-2 px-4 md:px-6 lg:px-8"
        style={{ scrollBehavior: "auto" }}
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
        onTouchStart={() => { pausedRef.current = true; }}
        onTouchEnd={() => { pausedRef.current = false; }}
      >
        {cards.map(({ product, key }) => (
          <div
            key={key}
            className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[210px] lg:w-[230px] xl:w-[250px]"
          >
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

interface FeaturedProductsCarouselProps {
  allProducts: Product[];
  onAddToCart?: (product: Product) => void;
}

const FEATURED_CATEGORIES = [
  "Suspension", "Engine", "Brake", "Electrical",
  "Bolts & Nuts", "Transmission", "Gear", "Body",
] as const;

export function FeaturedProductsCarousel({
  allProducts,
  onAddToCart,
}: FeaturedProductsCarouselProps) {
  return (
    <section className="pt-4 pb-8 md:pt-10 md:pb-14 lg:py-16 xl:py-20 bg-gray-50">
      {/* Section title */}
      <div className="text-center px-4 mb-4 md:mb-8 lg:mb-12">
        <h2 className="text-lg md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-0.5 md:mb-2 lg:mb-3">
          Featured Products
        </h2>
        <p className="text-xs md:text-base text-gray-500 lg:text-xl">
          Popular auto parts across all vehicles
        </p>
      </div>

      {/* Four category rows */}
      {FEATURED_CATEGORIES.map((cat) => {
        const categoryProducts = allProducts.filter(
          (p) => p.category.toLowerCase() === cat.toLowerCase()
        );
        if (categoryProducts.length === 0) return null;
        return (
          <CategoryRow
            key={cat}
            category={cat}
            products={categoryProducts}
            onAddToCart={onAddToCart}
          />
        );
      })}

    </section>
  );
}
