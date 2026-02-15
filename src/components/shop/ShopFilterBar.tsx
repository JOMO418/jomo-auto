"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";

interface ShopFilterBarProps {
  onFilterChange: (filters: FilterState) => void;
  totalProducts: number;
  vehicles: string[];
  categories: string[];
}

export interface FilterState {
  vehicle: string;
  category: string;
  priceRange: { min: number; max: number };
  search: string;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'popular';
}

/**
 * PREMIUM SHOP FILTER BAR
 * Desktop: Sticky horizontal bar
 * Mobile: Filter button opens modal
 */
export function ShopFilterBar({ onFilterChange, totalProducts, vehicles, categories }: ShopFilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    vehicle: '',
    category: '',
    priceRange: { min: 0, max: 100000 },
    search: '',
    sortBy: 'newest',
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Update parent when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      vehicle: '',
      category: '',
      priceRange: { min: 0, max: 100000 },
      search: '',
      sortBy: 'newest',
    });
  };

  const hasActiveFilters = filters.vehicle || filters.category || filters.search || filters.priceRange.min > 0 || filters.priceRange.max < 100000;

  return (
    <>
      {/* Desktop Filter Bar - Sticky */}
      <div className="hidden md:block sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4 max-w-7xl">
          <div className="flex items-center gap-3">
            {/* Vehicle Filter */}
            <select
              value={filters.vehicle}
              onChange={(e) => updateFilter('vehicle', e.target.value)}
              className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-[#0A5789] focus:border-[#0A5789] focus:outline-none transition-colors"
            >
              <option value="">All Vehicles</option>
              {vehicles.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-[#0A5789] focus:border-[#0A5789] focus:outline-none transition-colors"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                placeholder="Search parts..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm focus:border-[#0A5789] focus:outline-none transition-colors"
              />
            </div>

            {/* Sort */}
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value as FilterState['sortBy'])}
              className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-[#0A5789] focus:border-[#0A5789] focus:outline-none transition-colors"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2.5 bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Button - Fixed */}
      <button
        onClick={() => setMobileFiltersOpen(true)}
        className="md:hidden fixed bottom-20 right-4 z-40 w-14 h-14 bg-gradient-to-br from-[#0A5789] to-[#083d5e] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300"
      >
        <SlidersHorizontal className="w-6 h-6" />
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold">
            !
          </span>
        )}
      </button>

      {/* Mobile Filter Modal */}
      {mobileFiltersOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />

          {/* Bottom Sheet */}
          <div className="relative w-full bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Filter Options */}
            <div className="p-6 space-y-6">
              {/* Vehicle */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Vehicle</label>
                <select
                  value={filters.vehicle}
                  onChange={(e) => updateFilter('vehicle', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-base focus:border-[#0A5789] focus:outline-none"
                >
                  <option value="">All Vehicles</option>
                  {vehicles.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-base focus:border-[#0A5789] focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Search</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  placeholder="Search parts..."
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-base focus:border-[#0A5789] focus:outline-none"
                />
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value as FilterState['sortBy'])}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-base focus:border-[#0A5789] focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#0A5789] to-[#083d5e] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
