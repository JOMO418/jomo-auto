"use client";

import { Home, ShoppingCart, User, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { useEffect, useState } from "react";

interface BottomNavProps {
  onSearchClick?: () => void;
}

// Per-icon colour config — always visible, blazing when active
const COLORS = {
  shop: {
    iconActive:    "text-amber-400",
    iconInactive:  "text-amber-300/80",
    glowActive:    "drop-shadow-[0_0_12px_rgba(251,191,36,1)] drop-shadow-[0_2px_6px_rgba(251,191,36,0.6)]",
    glowInactive:  "drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]",
    bgActive:      "from-amber-500/30 to-amber-600/15",
    borderActive:  "border-amber-400/70",
    shadowActive:  "shadow-amber-500/30",
    bgInactive:    "from-amber-500/8 to-amber-600/4",
    borderInactive:"border-amber-400/25",
    ping:          "bg-amber-400/25",
    labelActive:   "text-amber-400",
    labelGlow:     "drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]",
    labelInactive: "text-amber-300/70",
  },
  search: {
    iconActive:    "text-sky-400",
    iconInactive:  "text-sky-300/80",
    glowActive:    "drop-shadow-[0_0_12px_rgba(56,189,248,1)] drop-shadow-[0_2px_6px_rgba(56,189,248,0.6)]",
    glowInactive:  "drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]",
    bgActive:      "from-sky-500/30 to-sky-600/15",
    borderActive:  "border-sky-400/70",
    shadowActive:  "shadow-sky-500/30",
    bgInactive:    "from-sky-500/8 to-sky-600/4",
    borderInactive:"border-sky-400/25",
    ping:          "bg-sky-400/25",
    labelActive:   "text-sky-400",
    labelGlow:     "drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]",
    labelInactive: "text-sky-300/70",
  },
  cart: {
    iconActive:    "text-red-400",
    iconInactive:  "text-red-300/80",
    glowActive:    "drop-shadow-[0_0_12px_rgba(232,0,45,1)] drop-shadow-[0_2px_6px_rgba(232,0,45,0.6)]",
    glowInactive:  "drop-shadow-[0_0_8px_rgba(232,0,45,0.7)]",
    bgActive:      "from-[#E8002D]/30 to-[#B8001F]/15",
    borderActive:  "border-[#E8002D]/70",
    shadowActive:  "shadow-red-500/30",
    bgInactive:    "from-[#E8002D]/8 to-[#B8001F]/4",
    borderInactive:"border-[#E8002D]/25",
    ping:          "bg-[#E8002D]/25",
    labelActive:   "text-red-400",
    labelGlow:     "drop-shadow-[0_0_8px_rgba(232,0,45,0.6)]",
    labelInactive: "text-red-300/70",
  },
  account: {
    iconActive:    "text-emerald-400",
    iconInactive:  "text-emerald-300/80",
    glowActive:    "drop-shadow-[0_0_12px_rgba(52,211,153,1)] drop-shadow-[0_2px_6px_rgba(52,211,153,0.6)]",
    glowInactive:  "drop-shadow-[0_0_8px_rgba(52,211,153,0.7)]",
    bgActive:      "from-emerald-500/30 to-emerald-600/15",
    borderActive:  "border-emerald-400/70",
    shadowActive:  "shadow-emerald-500/30",
    bgInactive:    "from-emerald-500/8 to-emerald-600/4",
    borderInactive:"border-emerald-400/25",
    ping:          "bg-emerald-400/25",
    labelActive:   "text-emerald-400",
    labelGlow:     "drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]",
    labelInactive: "text-emerald-300/70",
  },
};

export function BottomNav({ onSearchClick }: BottomNavProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
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
      active: pathname === "/" || pathname === "/shop",
      type: "link" as const,
      colors: COLORS.shop,
    },
    {
      icon: Search,
      label: "Search",
      active: false,
      type: "button" as const,
      onClick: onSearchClick,
      colors: COLORS.search,
    },
    {
      href: "/cart",
      icon: ShoppingCart,
      label: "Cart",
      active: pathname === "/cart",
      badge: count,
      type: "link" as const,
      colors: COLORS.cart,
    },
    {
      href: "/admin/login",
      icon: User,
      label: "Account",
      active: pathname === "/admin/login" || pathname.startsWith("/admin"),
      type: "link" as const,
      colors: COLORS.account,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#080808] via-[#111111] to-[#080808] backdrop-blur-xl border-t border-white/5 shadow-2xl shadow-black/80 md:hidden">
      {/* Ultra-thin top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="flex items-center justify-around h-[56px] pb-safe px-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const c = item.colors;

          const iconPill = (
            <div className="flex flex-col items-center justify-center gap-1">
              {/* Icon pill */}
              <div
                className={`
                  relative flex items-center justify-center
                  w-[44px] h-[30px] rounded-xl
                  bg-gradient-to-br
                  transition-all duration-300
                  ${item.active
                    ? `${c.bgActive} border ${c.borderActive} shadow-md ${c.shadowActive} scale-[1.08] -translate-y-0.5`
                    : `${c.bgInactive} border ${c.borderInactive}`
                  }
                `}
              >
                {/* Pulse ring when active */}
                {item.active && (
                  <div
                    className={`absolute inset-0 rounded-xl ${c.ping} animate-ping opacity-50 pointer-events-none`}
                  />
                )}

                {/* The icon itself */}
                <Icon
                  className={`
                    relative h-[18px] w-[18px] transition-all duration-300
                    ${item.active ? `${c.iconActive} ${c.glowActive}` : `${c.iconInactive} ${c.glowInactive}`}
                  `}
                />

                {/* Cart badge */}
                {"badge" in item && item.badge && item.badge > 0 ? (
                  <span className="absolute -top-2 -right-1.5 bg-gradient-to-br from-[#E8002D] to-[#B8001F] text-white text-[9px] font-bold rounded-full h-[18px] min-w-[18px] px-1 flex items-center justify-center shadow-lg shadow-red-900/60 border border-white/40 leading-none">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                ) : null}
              </div>

              {/* Label */}
              <span
                className={`
                  text-[8px] font-bold tracking-widest uppercase transition-all duration-300
                  ${item.active ? `${c.labelActive} ${c.labelGlow}` : c.labelInactive}
                `}
              >
                {item.label}
              </span>
            </div>
          );

          if (item.type === "button") {
            return (
              <button
                key={`btn-${index}`}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center flex-1 h-full"
                aria-label={item.label}
              >
                {iconPill}
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href!}
              className="flex flex-col items-center justify-center flex-1 h-full"
              aria-label={item.label}
            >
              {iconPill}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
