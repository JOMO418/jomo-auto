"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const LABEL_MAP: Record<string, string> = {
  shop: "Shop",
  cart: "Cart",
  checkout: "Checkout",
  "new-arrivals": "New Arrivals",
  category: "Category",
  product: "Product",
  vehicle: "Vehicle",
  admin: "Admin",
  products: "Products",
};

function toLabel(segment: string): string {
  return (
    LABEL_MAP[segment] ??
    segment
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

export function Breadcrumb() {
  const pathname = usePathname();

  // Only show on non-home pages
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-6 max-w-[1920px] py-2">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs">
          <Link
            href="/"
            className="flex items-center gap-1 text-[#E8002D] hover:text-[#B8001F] font-semibold transition-colors"
          >
            <Home className="h-3 w-3" />
            <span>Home</span>
          </Link>

          {segments.map((seg, i) => {
            const href = "/" + segments.slice(0, i + 1).join("/");
            const isLast = i === segments.length - 1;
            return (
              <span key={href} className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3 text-gray-300" />
                {isLast ? (
                  <span className="text-gray-500 font-medium">{toLabel(seg)}</span>
                ) : (
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    {toLabel(seg)}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
