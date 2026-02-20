"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { HeroBillboard, defaultBillboardSlides } from "@/components/home/HeroBillboard";
import { SmartFilterBar } from "@/components/home/SmartFilterBar";
import { FeaturedProductsCarousel } from "@/components/home/FeaturedProductsCarousel";
import { DealsOfTheDay } from "@/components/home/DealsOfTheDay";
import { NewArrivals } from "@/components/home/NewArrivals";
import { AboutSection } from "@/components/home/AboutSection";
import { MapSection } from "@/components/home/MapSection";
import { useCartStore } from "@/lib/store";
import type { Product } from "@/lib/types";

interface HomePageClientProps {
  allProducts: Product[];
  categories: string[];
}

export function HomePageClient({ allProducts, categories }: HomePageClientProps) {
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

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };

  const deals = allProducts
    .filter((p) => p.originalPrice && p.originalPrice > p.price)
    .map((p) => ({
      ...p,
      originalPrice: p.originalPrice!,
      discountPercent: Math.round(
        ((p.originalPrice! - p.price) / p.originalPrice!) * 100
      ),
      dealEndsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    }));

  const newArrivals = [...allProducts]
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 12);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Hero Billboard Carousel */}
      <HeroBillboard slides={defaultBillboardSlides} />

      {/* Smart Filter Bar - Dual Navigation */}
      <SmartFilterBar categories={categories} />

      {/* Featured Products — Auto-scrolling Infinite Carousel */}
      <FeaturedProductsCarousel
        allProducts={allProducts}
        onAddToCart={handleAddToCart}
      />

      {/* Deals of the Day - Premium Section */}
      {deals.length > 0 && <DealsOfTheDay deals={deals} />}

      {/* New Arrivals - Premium Section */}
      {newArrivals.length > 0 && (
        <NewArrivals products={newArrivals} onAddToCart={handleAddToCart} />
      )}

      {/* About Section - Premium Copy */}
      <AboutSection />

      {/* Map Section - Location */}
      <MapSection />
    </div>
  );
}
