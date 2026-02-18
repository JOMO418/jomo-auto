"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { slugify } from "@/lib/utils";

interface CategorySectionProps {
  category: string;
  products: Product[];
  limit?: number;
  onAddToCart?: (product: Product) => void;
}

export function CategorySection({
  category,
  products,
  limit = 12,
  onAddToCart,
}: CategorySectionProps) {
  // Show more products on large screens: 4 on mobile, 6 on md, 8 on lg, 12 on xl
  const displayProducts = products.slice(0, limit);
  const hasMore = products.length > limit;

  return (
    <section className="mb-12">
      <div className="flex items-end justify-between mb-6 border-b border-gray-200 pb-3">
        {/* Classic Category Header */}
        <div className="relative">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl lg:text-3xl font-bold text-[#0A0A0A] tracking-tight leading-tight">
            {category}
          </h2>

          {/* Classic single underline accent */}
          <div className="absolute -bottom-3 left-0 h-0.5 w-12 md:w-16 bg-[#E8002D]"></div>
        </div>

        <Link
          href={`/category/${slugify(category)}`}
          className="group flex items-center gap-1 text-xs font-[family-name:var(--font-playfair)] text-[#0A0A0A] hover:text-[#E8002D] uppercase tracking-wider font-semibold transition-colors duration-200 mb-0.5"
        >
          <span className="border-b border-[#0A0A0A]/30 group-hover:border-[#E8002D] pb-0.5">
            View All
          </span>
          <ChevronRight className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
        </Link>
      </div>

      {/* Horizontal Scroll Grid - More products on large screens */}
      <div className="relative -mx-3 sm:-mx-4 px-3 sm:px-4">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-5 pb-2">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-auto"
              >
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
