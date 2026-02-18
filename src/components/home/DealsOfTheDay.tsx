"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Clock, Tag, Percent, TrendingDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface Deal extends Product {
  discountPercent: number;
  dealEndsAt: Date;
}

interface DealsOfTheDayProps {
  deals: Deal[];
}

export function DealsOfTheDay({ deals }: DealsOfTheDayProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Mount check for hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!mounted) return;

    const calculateTimeLeft = () => {
      // Set deal end time to 11:59 PM today
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const difference = endOfDay.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [mounted]);

  const scrollContainer = (direction: "left" | "right") => {
    const container = document.getElementById("deals-scroll");
    if (container) {
      const scrollAmount = 320; // Card width + gap
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Clean minimal accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500"></div>

      <div className="relative container mx-auto px-3 sm:px-4 max-w-7xl">
        {/* Header with Countdown Timer - Cleaner Design */}
        <div className="mb-8">
          {/* Title Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900">
                    Flash Deals
                  </h2>
                  <p className="text-gray-600 text-sm">Limited time offers</p>
                </div>
              </div>
            </div>

            {/* Countdown Timer - Clean Minimal */}
            {mounted && (
              <div className="flex items-center gap-2 bg-white border-2 border-orange-200 rounded-xl px-4 py-3 shadow-sm">
                <Clock className="h-4 w-4 text-orange-600" />
                <div className="flex items-center gap-1.5">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900 font-mono">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </div>
                  </div>
                  <span className="text-gray-400 font-bold">:</span>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900 font-mono">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </div>
                  </div>
                  <span className="text-gray-400 font-bold">:</span>
                  <div className="text-center">
                    <div className="text-xl font-bold text-orange-600 font-mono">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 ml-1">left</span>
              </div>
            )}
          </div>

          {/* Clean divider */}
          <div className="h-px bg-gray-200"></div>
        </div>

        {/* Scroll hint - Above cards */}
        <div className="md:hidden mb-4">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <span>Swipe to see more deals</span>
            <ChevronRight className="h-3 w-3" />
          </p>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative group">
          {/* Navigation Buttons - Desktop - Cleaner */}
          <button
            onClick={() => scrollContainer("left")}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 items-center justify-center bg-white hover:bg-gray-50 rounded-full shadow-lg border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>

          <button
            onClick={() => scrollContainer("right")}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 items-center justify-center bg-white hover:bg-gray-50 rounded-full shadow-lg border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>

          {/* Scrollable Deals Container */}
          <div
            id="deals-scroll"
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {deals.map((deal, index) => (
              <DealCard key={deal.id} deal={deal} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Individual Deal Card Component - Premium & Clean
function DealCard({ deal, index }: { deal: Deal; index: number }) {
  const savings = (deal.originalPrice || deal.price) - deal.price;

  return (
    <Link
      href={`/product/${deal.slug}`}
      className="group relative flex-shrink-0 w-[260px] md:w-[280px] snap-start"
    >
      <div className="relative h-full bg-white rounded-xl overflow-hidden border-2 border-gray-100 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
        {/* Discount Badge - Clean & Prominent */}
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-red-600 text-white px-2.5 py-1 rounded-lg shadow-md">
            <div className="flex items-center gap-1">
              <Percent className="h-3 w-3" />
              <span className="font-bold text-sm">-{deal.discountPercent}%</span>
            </div>
          </div>
        </div>

        {/* Stock Badge - Clean */}
        {deal.stock && deal.stock <= 10 && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-orange-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md">
              {deal.stock} left
            </div>
          </div>
        )}

        {/* Product Image - Clean */}
        <div className="relative h-40 bg-gray-50 overflow-hidden">
          <OptimizedImage
            src={deal.images?.[0] || PLACEHOLDER_IMAGE}
            alt={deal.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="280px"
          />
        </div>

        {/* Product Info - Clean & Organized */}
        <div className="p-4">
          {/* Category */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-semibold text-[#E8002D] bg-red-50 px-2 py-0.5 rounded">
              {deal.category}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-sm text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors min-h-[40px]">
            {deal.name}
          </h3>

          {/* Pricing - Clean Layout */}
          <div className="space-y-2 mb-3">
            {/* Original Price */}
            {deal.originalPrice && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 line-through">
                  KSh {deal.originalPrice.toLocaleString()}
                </span>
                <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                  Save {savings.toLocaleString()}
                </span>
              </div>
            )}

            {/* Deal Price */}
            <div className="flex items-baseline gap-1">
              <Tag className="h-4 w-4 text-orange-600" />
              <span className="text-2xl font-bold text-gray-900">
                {deal.price.toLocaleString()}
              </span>
              <span className="text-sm text-gray-600">KSh</span>
            </div>
          </div>

          {/* CTA Button - Clean */}
          <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 text-sm">
            Get Deal
          </button>
        </div>
      </div>
    </Link>
  );
}

// Note: Deals are now loaded from Supabase featured products
// See src/app/(customer)/page.tsx for implementation

// Hide scrollbar CSS
const styles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
