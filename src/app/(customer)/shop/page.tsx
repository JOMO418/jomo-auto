"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { IntelligentFilterBar } from "@/components/shop/IntelligentFilterBar";
import { ProductCard } from "@/components/product/ProductCard";
import { getAllProducts } from "@/lib/dummy-data";
import { useCartStore } from "@/lib/store";
import { getUniqueVehicles, getUniqueCategories } from "@/lib/vehicle-utils";
import type { Product } from "@/lib/types";

interface FilterState {
  vehicle: string;
  category: string;
}

export default function ShopPage() {
  const addItem = useCartStore((state) => state.addItem);
  const [filters, setFilters] = useState<FilterState>({
    vehicle: '',
    category: '',
  });
  const [itemsToShow, setItemsToShow] = useState(50);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Get all products and filter options
  const allProducts = getAllProducts();
  const vehicles = getUniqueVehicles();
  const categories = getUniqueCategories();

  // Filter products
  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    // Filter by vehicle
    if (filters.vehicle) {
      products = products.filter(p =>
        p.compatibility.some(c => c.toLowerCase().includes(filters.vehicle.toLowerCase()))
      );
    }

    // Filter by category
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

  // Infinite scroll with Intersection Observer
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          // Load 50 more items
          setItemsToShow(prev => Math.min(prev + 50, filteredProducts.length));
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasMore, filteredProducts.length]);

  // Reset items when filters change
  useEffect(() => {
    setItemsToShow(50);
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple 3-Line Introduction */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-10 max-w-7xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Shop Premium Auto Parts
          </h1>
          <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed max-w-3xl">
            Discover our complete collection of{" "}
            <span className="font-semibold text-gray-900">authentic ex-Japan automotive parts</span>.
            Filter by vehicle and category to find exactly what you need—quality guaranteed, delivered fast.
          </p>
        </div>
      </div>

      {/* Intelligent Premium Filter Bar */}
      <IntelligentFilterBar
        onFilterChange={setFilters}
        vehicles={vehicles}
        categories={categories}
        totalProducts={filteredProducts.length}
        allProductsCount={allProducts.length}
      />

      {/* Product Grid - Infinite Scroll */}
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-10 max-w-7xl">
        {filteredProducts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              No products found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto font-light">
              We couldn't find any products matching your filters. Try selecting different options.
            </p>
            <button
              onClick={() => setFilters({ vehicle: '', category: '' })}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
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
              <div ref={loadMoreRef} className="text-center py-12">
                <div className="inline-flex flex-col items-center gap-3">
                  {/* Loading Spinner */}
                  <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-500 font-light">
                    Loading more products...
                  </p>
                </div>
              </div>
            )}

            {/* End Message */}
            {!hasMore && displayedProducts.length > 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 font-light">
                  You've viewed all {filteredProducts.length} products
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
