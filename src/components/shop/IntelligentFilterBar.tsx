"use client";

import { useState, useEffect } from "react";
import { Car, Grid3x3, X, ChevronDown, Filter } from "lucide-react";

interface Vehicle {
  id: string;
  fullName: string;
  brand: string;
  model: string;
  popularity: number;
}

interface IntelligentFilterBarProps {
  onFilterChange: (filters: { vehicle: string; category: string }) => void;
  vehicles: Vehicle[];
  categories: string[];
  totalProducts: number;
  allProductsCount: number;
}

/**
 * INTELLIGENT PREMIUM FILTER BAR
 * Mobile-first responsive design with instant filtering
 */
export function IntelligentFilterBar({
  onFilterChange,
  vehicles,
  categories,
  totalProducts,
  allProductsCount,
}: IntelligentFilterBarProps) {
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Update parent when filters change
  useEffect(() => {
    onFilterChange({
      vehicle: selectedVehicle,
      category: selectedCategory,
    });
  }, [selectedVehicle, selectedCategory, onFilterChange]);

  const clearFilters = () => {
    setSelectedVehicle('');
    setSelectedCategory('');
  };

  const hasActiveFilters = selectedVehicle || selectedCategory;

  return (
    <>
      {/* Desktop Filter Bar - Sticky */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {/* Desktop View */}
          <div className="hidden md:flex items-center gap-4 py-4">
            {/* Vehicle Filter */}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Select Vehicle
              </label>
              <div className="relative">
                <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer hover:bg-gray-100"
                >
                  <option value="">All Vehicles ({allProductsCount})</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.fullName}>
                      {vehicle.fullName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Select Category
              </label>
              <div className="relative">
                <Grid3x3 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer hover:bg-gray-100"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Results & Clear */}
            <div className="flex items-end gap-3">
              <div className="px-4 py-3 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm font-bold text-blue-900">
                  {totalProducts} {totalProducts === 1 ? 'Product' : 'Products'}
                </p>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden py-4">
            <div className="flex items-center justify-between gap-3">
              {/* Filter Button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all"
              >
                <Filter className="h-5 w-5" />
                Filters
                {hasActiveFilters && (
                  <span className="px-2 py-0.5 bg-white text-blue-600 text-xs font-bold rounded-full">
                    {[selectedVehicle, selectedCategory].filter(Boolean).length}
                  </span>
                )}
              </button>

              {/* Results Count */}
              <div className="px-4 py-3 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm font-bold text-blue-900 whitespace-nowrap">
                  {totalProducts} Items
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />

          {/* Modal */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto animate-slideUp">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Filter Products</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Filter Options */}
            <div className="p-6 space-y-6">
              {/* Vehicle Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Select Vehicle
                </label>
                <div className="relative">
                  <Car className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="w-full pl-12 pr-10 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                  >
                    <option value="">All Vehicles ({allProductsCount})</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.fullName}>
                        {vehicle.fullName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Select Category
                </label>
                <div className="relative">
                  <Grid3x3 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-12 pr-10 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-700">Active Filters</p>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedVehicle && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg">
                        <Car className="h-3.5 w-3.5" />
                        {selectedVehicle}
                        <button
                          onClick={() => setSelectedVehicle('')}
                          className="hover:bg-blue-100 rounded-full p-0.5"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    )}
                    {selectedCategory && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg">
                        <Grid3x3 className="h-3.5 w-3.5" />
                        {selectedCategory}
                        <button
                          onClick={() => setSelectedCategory('')}
                          className="hover:bg-blue-100 rounded-full p-0.5"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Apply Button */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all"
              >
                Show {totalProducts} {totalProducts === 1 ? 'Product' : 'Products'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
