"use client";

import { X, ChevronRight, ShoppingBag, History, LogOut, Car } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { CATEGORIES, VEHICLE_MODELS } from "@/lib/constants";
import { slugify } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const displayCategories = CATEGORIES.slice(0, 5);
  const displayVehicles = VEHICLE_MODELS.slice(0, 5);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="left"
        hideCloseButton
        className="w-full max-w-[50vw] sm:max-w-[40vw] p-0 bg-gradient-to-br from-[#0A1E3D] via-[#1E3A5F] to-[#0F2744] border-r border-blue-400/20"
      >
        <div className="flex flex-col h-full">
          {/* Premium Header - Compact */}
          <div className="relative px-4 py-4 border-b border-white/10">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-blue-600/10 opacity-50"></div>

            {/* Title & Close Button */}
            <div className="relative flex items-center justify-between gap-2">
              <h2 className="font-heading text-xl font-bold text-transparent bg-gradient-to-br from-white via-blue-50 to-amber-50 bg-clip-text">
                Menu
              </h2>

              {/* Premium Close Button */}
              <button
                onClick={onClose}
                className="group p-2 hover:bg-white/10 rounded-lg transition-all duration-300 border border-transparent hover:border-white/20"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-white/70 group-hover:text-white transition-colors duration-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]" />
              </button>
            </div>
          </div>

          {/* Scrollable Content - Compact */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {/* Shop by Part */}
            <div>
              <h3 className="font-heading text-[10px] font-semibold text-amber-200/90 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShoppingBag className="h-3.5 w-3.5" />
                Shop by Part
              </h3>
              <div className="space-y-0.5">
                {displayCategories.map((category) => (
                  <Link
                    key={category}
                    href={`/category/${slugify(category)}`}
                    onClick={onClose}
                    className="group flex items-center justify-between py-2 px-3 hover:bg-white/10 rounded-lg transition-all duration-200 border border-transparent hover:border-white/20"
                  >
                    <span className="font-sans text-sm text-white/90 group-hover:text-white font-medium">
                      {category}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-white/40 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
                {CATEGORIES.length > 5 && (
                  <Link
                    href="/categories"
                    onClick={onClose}
                    className="flex items-center gap-1.5 py-2 px-3 text-xs text-amber-300 hover:text-amber-200 font-medium transition-colors mt-1"
                  >
                    <ChevronRight className="h-3 w-3" />
                    View All Categories
                  </Link>
                )}
              </div>
            </div>

            {/* Elegant Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* Shop by Vehicle */}
            <div>
              <h3 className="font-heading text-[10px] font-semibold text-amber-200/90 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Car className="h-3.5 w-3.5" />
                Shop by Vehicle
              </h3>
              <div className="space-y-0.5">
                {displayVehicles.map((model) => (
                  <Link
                    key={model}
                    href={`/vehicle/${slugify(model)}`}
                    onClick={onClose}
                    className="group flex items-center justify-between py-2 px-3 hover:bg-white/10 rounded-lg transition-all duration-200 border border-transparent hover:border-white/20"
                  >
                    <span className="font-sans text-sm text-white/90 group-hover:text-white font-medium">
                      Toyota {model}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-white/40 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
                {VEHICLE_MODELS.length > 5 && (
                  <Link
                    href="/vehicles"
                    onClick={onClose}
                    className="flex items-center gap-1.5 py-2 px-3 text-xs text-amber-300 hover:text-amber-200 font-medium transition-colors mt-1"
                  >
                    <ChevronRight className="h-3 w-3" />
                    View All Vehicles
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Premium Footer Actions - Compact */}
          <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm px-4 py-3 space-y-1.5">
            <Link
              href="/order-history"
              onClick={onClose}
              className="flex items-center gap-2.5 py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200 group"
            >
              <History className="h-4 w-4 text-blue-300 group-hover:text-blue-200" />
              <span className="font-sans text-sm text-white/90 group-hover:text-white font-medium flex-1">
                Order History
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-white/40 group-hover:text-white/60" />
            </Link>

            <button
              onClick={() => {
                // Add logout logic here
                console.log("Logout clicked");
                onClose();
              }}
              className="w-full flex items-center gap-2.5 py-2 px-3 bg-gradient-to-r from-red-600/20 to-red-700/20 hover:from-red-600/30 hover:to-red-700/30 border border-red-500/30 hover:border-red-500/50 rounded-lg transition-all duration-200 group"
            >
              <LogOut className="h-4 w-4 text-red-300 group-hover:text-red-200" />
              <span className="font-sans text-sm text-red-100 group-hover:text-white font-medium flex-1 text-left">
                Logout
              </span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
