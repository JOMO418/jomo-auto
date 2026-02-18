"use client";

import { HeroBillboard, defaultBillboardSlides } from "@/components/home/HeroBillboard";
import { SmartFilterBar } from "@/components/home/SmartFilterBar";
import { FeaturedProductsCarousel } from "@/components/home/FeaturedProductsCarousel";
import { DealsOfTheDay } from "@/components/home/DealsOfTheDay";
import { NewArrivals } from "@/components/home/NewArrivals";
import { AboutSection } from "@/components/home/AboutSection";
import { MapSection } from "@/components/home/MapSection";
import { getFeaturedProducts, getAllProducts } from "@/lib/dummy-data";
import { useCartStore } from "@/lib/store";
import type { Product } from "@/lib/types";

export default function HomePage() {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };

  // Combine all categories for the featured products carousel
  const featuredCarouselProducts = getAllProducts();

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

      {/* Featured Products — Auto-scrolling Infinite Carousel */}
      <FeaturedProductsCarousel
        allProducts={featuredCarouselProducts}
        onAddToCart={handleAddToCart}
      />

      {/* Deals of the Day - Premium Section */}
      {deals.length > 0 && <DealsOfTheDay deals={deals} />}

      {/* New Arrivals - Premium Section */}
      {newArrivals.length > 0 && (
        <NewArrivals
          products={newArrivals}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* About Section - Premium Copy */}
      <AboutSection />

      {/* Map Section - Location */}
      <MapSection />
    </div>
  );
}
