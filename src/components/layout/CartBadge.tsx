"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { QuickCart } from "./QuickCart";

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

  // Realistic item-entering-cart animation
  useEffect(() => {
    if (mounted && items.length > 0) {
      // Show the flying item
      setShowItem(true);

      // Start cart bounce after item starts flying (200ms delay)
      const bounceTimer = setTimeout(() => {
        setBounce(true);
      }, 200);

      // Stop bounce animation
      const stopBounceTimer = setTimeout(() => {
        setBounce(false);
      }, 800);

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

  if (count === 0) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setQuickCartOpen(true)}
        className={`
          fixed bottom-20 right-4 z-40
          bg-gradient-to-br from-[#0A1E3D] via-[#1E3A5F] to-[#0F2744]
          rounded-full shadow-xl hover:shadow-2xl
          p-3 md:p-4
          transition-all duration-300
          hover:scale-110 border border-blue-400/30
          group
          ${bounce ? "animate-cart-bounce" : ""}
        `}
        aria-label={`Cart with ${count} items`}
      >
        <div className="relative">
          {/* Elegant pulsing glow effect */}
          <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Shopping cart icon */}
          <ShoppingCart className="relative h-5 w-5 md:h-6 md:w-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />

          {/* Item count badge with scale animation */}
          <span className={`
            absolute -top-2 -right-2
            bg-gradient-to-br from-red-500 to-red-600
            text-white text-[10px] md:text-xs font-bold
            rounded-full h-5 w-5 md:h-6 md:w-6
            flex items-center justify-center
            shadow-lg
            transition-all duration-300
            ${showItem ? "scale-125" : "scale-100"}
          `}>
            {count}
          </span>

          {/* Realistic item flying into cart animation */}
          {showItem && (
            <div className="absolute top-0 left-0 pointer-events-none">
              {/* Item particle with trail */}
              <div className="animate-fly-to-cart">
                <div className="relative">
                  {/* Main item particle */}
                  <div className="w-3 h-3 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full shadow-lg"></div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-amber-400/50 rounded-full blur-sm animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </button>

      {/* Quick Cart Modal */}
      <QuickCart open={quickCartOpen} onClose={() => setQuickCartOpen(false)} />
    </>
  );
}
