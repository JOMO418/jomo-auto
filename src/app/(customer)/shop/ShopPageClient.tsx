"use client";

import { useState, useMemo, useCallback, useEffect, useRef, startTransition } from "react";
import { useRouter } from "next/navigation";
import { PremiumShopSearch } from "@/components/shop/PremiumShopSearch";
import { PremiumFilterBar } from "@/components/shop/PremiumFilterBar";
import { ProductCard } from "@/components/product/ProductCard";
import { useCartStore } from "@/lib/store";
import { getUniqueVehicles, getUniqueCategories } from "@/lib/vehicle-utils";
import type { Product } from "@/lib/types";

interface FilterState {
  vehicle: string;
  category: string;
  searchQuery: string;
}

const ITEMS_PER_BATCH = 20;
const INITIAL_ITEMS = 40;

interface ShopPageClientProps {
  allProducts: Product[];
}

export function ShopPageClient({ allProducts }: ShopPageClientProps) {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  // Re-fetch server data when the tab regains focus so admin changes appear instantly
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [router]);

  const [filters, setFilters] = useState<FilterState>({
    vehicle: '',
    category: '',
    searchQuery: '',
  });
  const [itemsToShow, setItemsToShow] = useState(INITIAL_ITEMS);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const vehicles = useMemo(() => getUniqueVehicles(allProducts), [allProducts]);
  const categories = useMemo(() => getUniqueCategories(allProducts), [allProducts]);

  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.compatibility.some(c => c.toLowerCase().includes(query)) ||
        p.description?.toLowerCase().includes(query) ||
        Object.values(p.specs || {}).some(spec =>
          String(spec).toLowerCase().includes(query)
        )
      );
    }

    if (filters.vehicle) {
      products = products.filter(p =>
        p.compatibility.some(c => c.toLowerCase().includes(filters.vehicle.toLowerCase()))
      );
    }

    if (filters.category) {
      products = products.filter(p => p.category === filters.category);
    }

    return products;
  }, [allProducts, filters]);

  const displayedProducts = filteredProducts.slice(0, itemsToShow);
  const hasMore = itemsToShow < filteredProducts.length;

  const handleAddToCart = useCallback((product: Product) => {
    addItem(product, 1);
  }, [addItem]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true);
          startTransition(() => {
            setItemsToShow(prev => Math.min(prev + ITEMS_PER_BATCH, filteredProducts.length));
            setTimeout(() => setIsLoadingMore(false), 100);
          });
        }
      },
      { threshold: 0.1, rootMargin: '800px' }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, filteredProducts.length, isLoadingMore]);

  useEffect(() => {
    setItemsToShow(INITIAL_ITEMS);
    setIsLoadingMore(false);
  }, [filters]);

  const handleSearch = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const handleFilterChange = useCallback((newFilters: { vehicle: string; category: string }) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Premium Search Bar - Always Active - At Very Top */}
      <PremiumShopSearch onSearch={handleSearch} />

      {/* Premium Filter Bar */}
      <PremiumFilterBar
        onFilterChange={handleFilterChange}
        vehicles={vehicles}
        categories={categories}
        totalProducts={filteredProducts.length}
        allProductsCount={allProducts.length}
      />

      {/* Product Grid - Infinite Scroll */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 md:py-10 lg:py-12 xl:py-14 max-w-[1920px] 2xl:max-w-full">
        {filteredProducts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 lg:py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-2xl mb-6">
              <svg className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              No products found
            </h3>
            <p className="text-gray-600 lg:text-lg mb-6 max-w-md mx-auto font-light">
              We couldn&apos;t find any products matching your {filters.searchQuery ? 'search' : 'filters'}. Try different options.
            </p>
            <button
              onClick={() => setFilters({ vehicle: '', category: '', searchQuery: '' })}
              className="px-6 py-3 lg:px-8 lg:py-4 bg-gradient-to-br from-[#E8002D] to-[#B8001F] text-white font-bold text-base lg:text-lg rounded-xl hover:from-[#B8001F] hover:to-[#8A0015] hover:shadow-xl transition-all border border-red-400/30 shadow-lg"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {/* Infinite Scroll Trigger */}
            {hasMore && (
              <div ref={loadMoreRef} className="text-center py-8">
                {isLoadingMore && (
                  <div className="inline-flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-3 border-gray-200 border-t-[#E8002D] rounded-full animate-spin"></div>
                    <p className="text-xs text-gray-500 font-medium">Loading...</p>
                  </div>
                )}
              </div>
            )}

            {/* End Message */}
            {!hasMore && displayedProducts.length > 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 font-light">
                  You&apos;ve viewed all {filteredProducts.length} products
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
