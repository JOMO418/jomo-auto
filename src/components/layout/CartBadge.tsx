"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { QuickCart } from "./QuickCart";

/**
 * FLOATING CART BADGE - ALWAYS VISIBLE
 * Premium animations when adding products
 */
export function CartBadge() {
  const [mounted, setMounted] = useState(false);
  const [bounce, setBounce] = useState(false);
  const [showItem, setShowItem] = useState(false);
  const [quickCartOpen, setQuickCartOpen] = useState(false);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Impressive item-entering-cart animation
  useEffect(() => {
    if (mounted && items.length > 0) {
      // Show the flying item
      setShowItem(true);

      // Start cart bounce after item starts flying (150ms delay)
      const bounceTimer = setTimeout(() => {
        setBounce(true);
      }, 150);

      // Stop bounce animation
      const stopBounceTimer = setTimeout(() => {
        setBounce(false);
      }, 900);

      // Hide the flying item
      const hideItemTimer = setTimeout(() => {
        setShowItem(false);
      }, 1000);

      return () => {
        clearTimeout(bounceTimer);
        clearTimeout(stopBounceTimer);
        clearTimeout(hideItemTimer);
      };
    }
  }, [items.length, mounted]);

  if (!mounted) {
    return null;
  }

  const count = getTotalItems();

  return (
    <>
      {/* ALWAYS VISIBLE Floating Cart Button */}
      <button
        onClick={() => setQuickCartOpen(true)}
        className={`
          fixed bottom-20 md:bottom-6 right-4 z-40
          bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800
          rounded-full shadow-2xl hover:shadow-blue-500/50
          p-4 md:p-5
          transition-all duration-300
          hover:scale-110 active:scale-95
          border-2 border-blue-400/40
          group
          ${bounce ? "animate-cart-bounce" : ""}
        `}
        aria-label={count > 0 ? `Cart with ${count} items` : "Open cart"}
      >
        <div className="relative">
          {/* Premium pulsing glow effect */}
          <div className="absolute -inset-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>

          {/* Shopping cart icon */}
          <ShoppingCart className="relative h-6 w-6 md:h-7 md:w-7 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]" />

          {/* Item count badge - ALWAYS show, even at 0 */}
          <span className={`
            absolute -top-2 -right-2
            bg-gradient-to-br from-red-500 to-red-600
            text-white text-xs md:text-sm font-bold
            rounded-full min-w-[24px] h-6 md:min-w-[28px] md:h-7
            flex items-center justify-center
            shadow-lg shadow-red-500/50
            transition-all duration-300
            border-2 border-white
            ${showItem ? "scale-125 rotate-12" : "scale-100 rotate-0"}
            ${count === 0 ? "opacity-70" : "opacity-100"}
          `}>
            {count}
          </span>

          {/* IMPRESSIVE Product Flying Animation */}
          {showItem && (
            <div className="absolute top-0 left-0 pointer-events-none">
              {/* Main item particle with trail */}
              <div className="animate-fly-to-cart">
                <div className="relative">
                  {/* Product icon particle */}
                  <div className="w-4 h-4 bg-gradient-to-br from-amber-400 via-orange-400 to-red-500 rounded-full shadow-lg border-2 border-white"></div>
                  {/* Outer glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-300 to-orange-500 rounded-full blur-md animate-pulse scale-150"></div>
                  {/* Sparkle effect */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping"></div>
                </div>
              </div>
            </div>
          )}

          {/* Ripple effect on add */}
          {showItem && (
            <div className="absolute inset-0 rounded-full">
              <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></div>
            </div>
          )}
        </div>
      </button>

      {/* Quick Cart Side Panel */}
      <QuickCart open={quickCartOpen} onClose={() => setQuickCartOpen(false)} />
    </>
  );
}
