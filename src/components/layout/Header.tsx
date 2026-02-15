"use client";

import { Menu, Search, User, Sparkles } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
}

export function Header({ onMenuClick, onSearchClick }: HeaderProps) {
  return (
    <header className="sticky top-10 z-40 bg-gradient-to-br from-[#0A1E3D] via-[#1E3A5F] to-[#0F2744] backdrop-blur-xl border-b border-blue-400/20 shadow-2xl shadow-blue-900/40 before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-600/10 before:via-transparent before:to-blue-600/10 before:animate-shimmer overflow-x-hidden">
      <div className="relative h-20 md:h-24 px-3 md:px-8 flex items-center justify-between gap-2 md:gap-4 max-w-7xl mx-auto w-full">
        {/* Left: Premium Search Button */}
        <button
          onClick={onSearchClick}
          className="group flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 bg-gradient-to-br from-white/95 via-blue-50/95 to-white/95 hover:from-white hover:via-blue-50 hover:to-white rounded-xl md:rounded-2xl shadow-lg shadow-blue-400/20 hover:shadow-xl hover:shadow-blue-300/30 transition-all duration-500 hover:scale-105 flex-shrink-0 border border-blue-200/30"
        >
          <Search className="h-4 w-4 md:h-5 md:w-5 text-blue-900/80 group-hover:text-blue-900 transition-colors duration-300" />
          <span className="hidden sm:block font-heading text-xs md:text-sm font-semibold text-blue-900/80 group-hover:text-blue-900 tracking-tight transition-colors duration-300">
            Search
          </span>
          <kbd className="hidden lg:block ml-2 px-2 py-0.5 text-[10px] font-mono bg-white/50 border border-blue-200/50 rounded text-blue-700/70">
            ⌘K
          </kbd>
        </button>

        {/* Center: Ultra Premium Logo */}
        <Link href="/" className="flex-1 flex items-center justify-center gap-1 sm:gap-3 group min-w-0">
          {/* Elegant Sparkle Ornament - Hidden on mobile */}
          <div className="hidden sm:block relative opacity-80 group-hover:opacity-100 transition-opacity duration-700">
            <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-amber-400/70 animate-twinkle drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
          </div>

          <div className="relative flex flex-col items-center min-w-0">
            {/* Premium Glow Background */}
            <div className="absolute inset-0 bg-gradient-radial from-blue-300/20 via-transparent to-transparent blur-3xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

            {/* Main Brand Name - Keep Premium Serif Fonts */}
            <div className="relative flex items-baseline gap-1 sm:gap-2">
              <h1 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-gradient-to-br from-white via-blue-50 to-amber-50 bg-clip-text animate-elegant-fade tracking-tight whitespace-nowrap drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
                JOMO
              </h1>
              <span className="font-[family-name:var(--font-cinzel)] text-sm sm:text-xl md:text-2xl lg:text-3xl font-semibold text-transparent bg-gradient-to-br from-amber-200 via-amber-100 to-white bg-clip-text tracking-wider md:tracking-[0.2em] animate-elegant-fade-delay whitespace-nowrap drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)]">
                AUTO
              </span>
            </div>

            {/* Subtitle with Premium Divider */}
            <div className="flex items-center gap-2 sm:gap-4 mt-0.5 sm:mt-1">
              <div className="h-px w-4 sm:w-8 md:w-12 bg-gradient-to-r from-transparent via-amber-400/50 to-amber-300/30"></div>
              <span className="font-[family-name:var(--font-playfair)] text-[10px] sm:text-xs md:text-sm lg:text-base text-amber-100/90 tracking-[0.3em] sm:tracking-[0.5em] uppercase italic font-light whitespace-nowrap drop-shadow-[0_1px_4px_rgba(251,191,36,0.3)]">
                World
              </span>
              <div className="h-px w-4 sm:w-8 md:w-12 bg-gradient-to-r from-amber-300/30 via-amber-400/50 to-transparent"></div>
            </div>

            {/* Elegant Underline Animation */}
            <div className="absolute -bottom-2 md:-bottom-3 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/0 to-transparent group-hover:via-amber-400/70 transition-all duration-1000 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.5)]"></div>
          </div>

          {/* Elegant Sparkle Ornament - Hidden on mobile */}
          <div className="hidden sm:block relative opacity-80 group-hover:opacity-100 transition-opacity duration-700 delay-100">
            <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-amber-400/70 animate-twinkle-delay drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
          </div>
        </Link>

        {/* Right: Minimalist Action Buttons */}
        <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
          <button
            onClick={onMenuClick}
            className="p-2 md:p-3 hover:bg-white/10 rounded-lg md:rounded-xl transition-all duration-500 group/menu backdrop-blur-sm border border-transparent hover:border-white/20"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4 md:h-5 md:w-5 text-white/80 group-hover/menu:text-white transition-colors duration-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]" />
          </button>
          <Link
            href="/account"
            className="p-2 md:p-3 hover:bg-white/10 rounded-lg md:rounded-xl transition-all duration-500 group/user backdrop-blur-sm border border-transparent hover:border-white/20"
            aria-label="Account"
          >
            <User className="h-4 w-4 md:h-5 md:w-5 text-white/80 group-hover/user:text-white transition-colors duration-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
