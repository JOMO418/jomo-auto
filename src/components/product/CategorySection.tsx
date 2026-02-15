"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductGrid } from "./ProductGrid";
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
  limit = 6,
  onAddToCart,
}: CategorySectionProps) {
  const displayProducts = products.slice(0, limit);
  const hasMore = products.length > limit;

  return (
    <section className="mb-12">
      <div className="flex items-end justify-between mb-6 border-b border-gray-200 pb-3">
        {/* Classic Category Header */}
        <div className="relative">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-[#0A1E3D] tracking-tight leading-tight">
            {category}
          </h2>

          {/* Classic single underline accent */}
          <div className="absolute -bottom-3 left-0 h-0.5 w-16 bg-[#0A1E3D]"></div>
        </div>

        {hasMore && (
          <Link
            href={`/category/${slugify(category)}`}
            className="group flex items-center gap-1 text-xs font-[family-name:var(--font-playfair)] text-[#0A1E3D] hover:text-[#1E3A5F] uppercase tracking-wider font-semibold transition-colors duration-200 mb-0.5"
          >
            <span className="border-b border-[#0A1E3D]/30 group-hover:border-[#1E3A5F] pb-0.5">
              View All
            </span>
            <ChevronRight className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
          </Link>
        )}
      </div>

      <ProductGrid products={displayProducts} onAddToCart={onAddToCart} />
    </section>
  );
}
