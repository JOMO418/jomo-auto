"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

interface PremiumShopSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

/**
 * ALWAYS-VISIBLE SEARCH BAR FOR SHOP PAGE
 * Premium, sticky, efficient UX
 */
export function PremiumShopSearch({
  onSearch,
  placeholder = "Search parts, vehicles, categories..."
}: PremiumShopSearchProps) {
  const [query, setQuery] = useState("");

  // Debounce search to avoid too many updates
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="sticky top-[100px] md:top-28 lg:top-28 z-40 bg-white border-b-2 border-[#E8002D]/20 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 max-w-[1920px] 2xl:max-w-full py-4 md:py-5 lg:py-6">
        <div className="relative">
          {/* Search Icon */}
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-gray-400" />

          {/* Search Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 md:pl-14 lg:pl-16 pr-12 md:pr-14 lg:pr-16 py-3.5 md:py-4 lg:py-5 bg-gray-50 border-2 border-gray-200 rounded-xl md:rounded-2xl text-gray-900 placeholder:text-gray-400 font-medium text-sm md:text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-[#E8002D] focus:border-transparent focus:bg-white transition-all shadow-sm focus:shadow-md"
          />

          {/* Clear Button */}
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 lg:p-2 hover:bg-gray-100 rounded-lg transition-colors group"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-gray-400 group-hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Active Search Indicator */}
        {query && (
          <p className="mt-2 text-xs md:text-sm lg:text-base text-gray-500 font-medium">
            Searching for &ldquo;{query}&rdquo;...
          </p>
        )}
      </div>
    </div>
  );
}
