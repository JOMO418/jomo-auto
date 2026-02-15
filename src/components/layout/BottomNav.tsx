"use client";

import { Home, ShoppingCart, User, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { QuickCart } from "./QuickCart";

interface BottomNavProps {
  onSearchClick?: () => void;
}

export function BottomNav({ onSearchClick }: BottomNavProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [quickCartOpen, setQuickCartOpen] = useState(false);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = mounted ? getTotalItems() : 0;

  const navItems = [
    {
      href: "/shop",
      icon: Home,
      label: "Shop",
      active: pathname === "/shop",
      type: "link" as const,
    },
    {
      icon: Search,
      label: "Search",
      active: false,
      type: "button" as const,
      onClick: onSearchClick,
    },
    {
      icon: ShoppingCart,
      label: "Cart",
      active: pathname === "/cart" || quickCartOpen,
      badge: count,
      type: "button" as const,
      onClick: () => setQuickCartOpen(true),
    },
    {
      href: "/account",
      icon: User,
      label: "Account",
      active: pathname === "/account",
      type: "link" as const,
    },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#0A1E3D] via-[#1E3A5F] to-[#0F2744] backdrop-blur-xl border-t border-blue-400/20 shadow-2xl shadow-blue-900/40 md:hidden">
        <div className="flex items-center justify-around h-14 pb-safe">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const content = (
              <>
                <div className="relative group">
                  {/* Icon glow effect */}
                  <div className={`absolute inset-0 rounded-full blur-md transition-all duration-300 ${
                    item.active
                      ? "bg-amber-400/30 opacity-100"
                      : "bg-blue-400/0 opacity-0 group-hover:bg-blue-400/20 group-hover:opacity-100"
                  }`}></div>

                  {/* Icon with realistic depth */}
                  <Icon className={`relative h-5 w-5 transition-all duration-300 ${
                    item.active
                      ? "text-amber-300 drop-shadow-[0_2px_8px_rgba(251,191,36,0.6)]"
                      : "text-blue-200/80 drop-shadow-[0_1px_4px_rgba(96,165,250,0.3)] group-hover:text-blue-100 group-hover:scale-110"
                  }`} />

                  {/* Premium badge with glow */}
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-amber-400 to-amber-600 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-lg shadow-amber-500/50 animate-pulse-subtle border border-amber-200/30">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Refined label text */}
                <span className={`text-[10px] mt-0.5 font-medium tracking-wide transition-all duration-300 ${
                  item.active
                    ? "text-amber-200 drop-shadow-[0_1px_4px_rgba(251,191,36,0.4)]"
                    : "text-blue-200/70 group-hover:text-blue-100"
                }`}>
                  {item.label}
                </span>
              </>
            );

            const className = `flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 group ${
              item.active ? "scale-105" : "hover:scale-105"
            }`;

            if (item.type === "button") {
              return (
                <button
                  key={`button-${index}`}
                  onClick={item.onClick}
                  className={className}
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href!}
                className={className}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Quick Cart Modal */}
      <QuickCart open={quickCartOpen} onClose={() => setQuickCartOpen(false)} />
    </>
  );
}
