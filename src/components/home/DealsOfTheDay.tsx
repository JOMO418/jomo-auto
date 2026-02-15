"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, Clock, Tag, Percent, TrendingDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

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
    <section className="relative py-12 bg-gradient-to-br from-[#0A1E3D] via-[#1E3A5F] to-[#0F2744] overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-transparent to-orange-600/10 animate-shimmer"></div>
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>

      <div className="relative container mx-auto px-4 max-w-7xl">
        {/* Header with Countdown Timer */}
        <div className="mb-8">
          {/* Title Section */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-500/40 rounded-full blur-lg animate-pulse-slow"></div>
                  <Flame className="relative h-8 w-8 text-orange-400 drop-shadow-[0_0_12px_rgba(251,146,60,0.8)]" />
                </div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-br from-white via-orange-50 to-amber-100 bg-clip-text tracking-tight">
                  Today's Hot Deals
                </h2>
              </div>
              <p className="text-blue-200/80 text-sm md:text-base ml-11">
                Limited time offers • Prices drop at midnight
              </p>
            </div>

            {/* Countdown Timer */}
            {mounted && (
              <div className="flex items-center gap-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl border border-orange-400/30 rounded-2xl px-6 py-4 shadow-2xl shadow-orange-500/20">
                <Clock className="h-5 w-5 text-orange-300 animate-pulse" />
                <div className="flex items-center gap-2">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white font-mono tabular-nums">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] text-orange-200/70 uppercase tracking-wider">Hours</div>
                  </div>
                  <span className="text-2xl text-orange-300 font-bold">:</span>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white font-mono tabular-nums">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] text-orange-200/70 uppercase tracking-wider">Mins</div>
                  </div>
                  <span className="text-2xl text-orange-300 font-bold">:</span>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white font-mono tabular-nums">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] text-orange-200/70 uppercase tracking-wider">Secs</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Subtle divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-orange-400/30 to-transparent"></div>
        </div>

        {/* Scroll hint - Above cards */}
        <div className="md:hidden mb-4">
          <p className="text-xs text-blue-200/70 flex items-center justify-center gap-2">
            <span>Swipe to see more deals</span>
            <span className="animate-pulse">→</span>
          </p>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative group">
          {/* Navigation Buttons - Desktop */}
          <button
            onClick={() => scrollContainer("left")}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 items-center justify-center bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6 text-gray-900" />
          </button>

          <button
            onClick={() => scrollContainer("right")}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 items-center justify-center bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6 text-gray-900" />
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

// Individual Deal Card Component
function DealCard({ deal, index }: { deal: Deal; index: number }) {
  const savings = (deal.originalPrice || deal.price) - deal.price;

  return (
    <Link
      href={`/product/${deal.slug}`}
      className="group relative flex-shrink-0 w-[280px] md:w-[300px] snap-start"
    >
      <div className="relative h-full bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
        {/* Discount Badge - Prominent */}
        <div className="absolute top-2 left-2 z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 rounded-lg blur-md opacity-70"></div>
            <div className="relative bg-gradient-to-br from-red-500 to-red-600 text-white px-2.5 py-1 rounded-lg shadow-lg">
              <div className="flex items-center gap-1">
                <Percent className="h-3.5 w-3.5" />
                <span className="font-bold text-base">-{deal.discountPercent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Badge - If low */}
        {deal.stock && deal.stock <= 10 && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg animate-pulse">
              Only {deal.stock} left!
            </div>
          </div>
        )}

        {/* Product Image - Reduced height */}
        <div className="relative h-36 bg-gray-100 overflow-hidden">
          <Image
            src={deal.images?.[0] || PLACEHOLDER_IMAGE}
            alt={deal.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="300px"
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Product Info - Reduced padding */}
        <div className="p-4">
          {/* Category & Vehicle */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {deal.category}
            </span>
            {deal.compatibility && deal.compatibility.length > 0 && (
              <span className="text-[10px] text-gray-500 truncate">
                {deal.compatibility[0]}
              </span>
            )}
          </div>

          {/* Product Name - Reduced min-height */}
          <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[40px]">
            {deal.name}
          </h3>

          {/* Pricing - More compact */}
          <div className="space-y-1.5">
            {/* Original Price - Strikethrough */}
            {deal.originalPrice && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 line-through">
                  KSh {deal.originalPrice.toLocaleString()}
                </span>
                <div className="flex items-center gap-0.5 text-green-600 text-[10px] font-semibold">
                  <TrendingDown className="h-3 w-3" />
                  <span>Save {savings.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Deal Price - Prominent */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <Tag className="h-3.5 w-3.5 text-orange-500" />
                <span className="text-xl font-bold text-gray-900">
                  KSh {deal.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* CTA Button - Reduced padding */}
          <button className="mt-3 w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 group-hover:scale-[1.02] text-sm">
            Grab Deal Now
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
