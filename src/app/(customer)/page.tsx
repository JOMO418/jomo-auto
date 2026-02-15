"use client";

import { HeroBillboard, defaultBillboardSlides } from "@/components/home/HeroBillboard";
import { SmartFilterBar } from "@/components/home/SmartFilterBar";
import { CategorySection } from "@/components/product/CategorySection";
import { DealsOfTheDay } from "@/components/home/DealsOfTheDay";
import { NewArrivals } from "@/components/home/NewArrivals";
import { getProductsByCategory, getFeaturedProducts, getAllProducts } from "@/lib/dummy-data";
import { useCartStore } from "@/lib/store";
import type { Product } from "@/lib/types";

export default function HomePage() {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };

  // Get featured products from each category
  const suspensionProducts = getProductsByCategory("Suspension");
  const brakeProducts = getProductsByCategory("Brakes");
  const engineProducts = getProductsByCategory("Engine");

  // Get featured products and convert to deals
  const featuredProducts = getFeaturedProducts();
  const deals = featuredProducts
    .filter(p => p.originalPrice && p.originalPrice > p.price) // Only products with discounts
    .map(p => ({
      ...p,
      originalPrice: p.originalPrice!,
      discountPercent: Math.round(((p.originalPrice! - p.price) / p.originalPrice!) * 100),
      dealEndsAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Ends in 24 hours
    }));

  // Get newest products (sorted by createdAt date)
  const allProducts = getAllProducts();
  const newArrivals = allProducts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 12); // Get 12 newest products

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Hero Billboard Carousel */}
      <HeroBillboard slides={defaultBillboardSlides} />

      {/* Smart Filter Bar - Dual Navigation */}
      <SmartFilterBar />

      {/* Optional: Featured Products Section */}
      <div className="container mx-auto px-3 sm:px-4 py-8 max-w-7xl">
        {/* Featured/Popular Products - Minimal Showcase */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Featured Products
            </h2>
            <p className="text-gray-600">
              Popular auto parts across all vehicles
            </p>
          </div>

          {/* Category Sections - Compact */}
          <CategorySection
            category="Suspension"
            products={suspensionProducts}
            limit={4}
            onAddToCart={handleAddToCart}
          />

          <CategorySection
            category="Brakes"
            products={brakeProducts}
            limit={4}
            onAddToCart={handleAddToCart}
          />

          <CategorySection
            category="Engine"
            products={engineProducts}
            limit={4}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>

      {/* Deals of the Day - Premium Section */}
      {deals.length > 0 && <DealsOfTheDay deals={deals} />}

      {/* New Arrivals - Premium Section */}
      {newArrivals.length > 0 && (
        <NewArrivals
          products={newArrivals}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
