"use client";

import { useState, useEffect } from "react";
import { Car, Grid3x3, X, ChevronDown, RotateCcw } from "lucide-react";
import type { VehicleInfo } from "@/lib/vehicle-utils";

interface PremiumFilterBarProps {
  onFilterChange: (filters: { vehicle: string; category: string }) => void;
  vehicles: VehicleInfo[];
  categories: string[];
  totalProducts: number;
  allProductsCount: number;
}

/**
 * PREMIUM FILTER BAR - MOBILE-FIRST DESIGN
 * Bottom sheet on mobile, inline on desktop
 * Clean, efficient, premium UX
 */
export function PremiumFilterBar({
  onFilterChange,
  vehicles,
  categories,
  totalProducts,
  allProductsCount,
}: PremiumFilterBarProps) {
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [showResetHint, setShowResetHint] = useState(false);

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
    setShowResetHint(false);
  };

  const hasActiveFilters = selectedVehicle || selectedCategory;
  const activeFilterCount = [selectedVehicle, selectedCategory].filter(Boolean).length;

  // Show reset hint after 30 seconds of having active filters
  useEffect(() => {
    if (hasActiveFilters) {
      const timer = setTimeout(() => {
        setShowResetHint(true);
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    } else {
      setShowResetHint(false);
    }
  }, [hasActiveFilters]);

  return (
    <>
      {/* Filter Bar - Sticky below search */}
      <div className="sticky top-[140px] md:top-[156px] z-30 bg-white border-b border-gray-200 shadow-md">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {/* DESKTOP VIEW */}
          <div className="hidden md:block py-4">
            <div className="flex items-center gap-4">
              {/* Vehicle Filter */}
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  Vehicle
                </label>
                <div className="relative">
                  <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl text-gray-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:border-gray-300 hover:shadow-md"
                  >
                    <option value="">All Vehicles</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.slug} value={vehicle.fullName}>
                        {vehicle.fullName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  Category
                </label>
                <div className="relative">
                  <Grid3x3 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl text-gray-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:border-gray-300 hover:shadow-md"
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

              {/* Results Count & Reset */}
              <div className="flex items-end gap-3">
                {/* Product Count */}
                <div className="px-5 py-3 bg-gradient-to-br from-[#0A1E3D] via-[#1E3A5F] to-[#0F2744] rounded-xl border border-blue-400/30 shadow-lg">
                  <p className="text-sm font-bold text-white whitespace-nowrap">
                    {totalProducts.toLocaleString()} {totalProducts === 1 ? 'Product' : 'Products'}
                  </p>
                </div>

                {/* Reset Button */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Active:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedVehicle && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200">
                      <Car className="h-3.5 w-3.5" />
                      {selectedVehicle}
                      <button
                        onClick={() => setSelectedVehicle('')}
                        className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200">
                      <Grid3x3 className="h-3.5 w-3.5" />
                      {selectedCategory}
                      <button
                        onClick={() => setSelectedCategory('')}
                        className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* MOBILE VIEW */}
          <div className="md:hidden py-3">
            <div className="flex items-center gap-2">
              {/* Vehicle Tab - Shows selected vehicle or "Vehicle" */}
              <button
                onClick={() => setVehicleModalOpen(true)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 relative ${
                  selectedVehicle
                    ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white border border-amber-400/50'
                    : 'bg-gradient-to-br from-[#0A1E3D] via-[#1E3A5F] to-[#0F2744] text-white border border-blue-400/30'
                }`}
              >
                <Car className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs font-bold truncate">
                  {selectedVehicle || 'Vehicle'}
                </span>
              </button>

              {/* Category Tab - Shows selected category or "Category" */}
              <button
                onClick={() => setCategoryModalOpen(true)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 relative ${
                  selectedCategory
                    ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white border border-amber-400/50'
                    : 'bg-gradient-to-br from-[#0A1E3D] via-[#1E3A5F] to-[#0F2744] text-white border border-blue-400/30'
                }`}
              >
                <Grid3x3 className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs font-bold truncate">
                  {selectedCategory || 'Category'}
                </span>
              </button>

              {/* Reset Button - Always visible when filters active */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className={`p-3.5 bg-gray-100 hover:bg-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 ${
                    showResetHint ? 'animate-pulse-subtle' : ''
                  }`}
                  title="Reset filters"
                >
                  <RotateCcw className="h-4 w-4 text-gray-700" />
                </button>
              )}

              {/* Product Count */}
              <div className="px-3 py-3.5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 shadow-md">
                <p className="text-xs font-bold text-blue-900 whitespace-nowrap tabular-nums">
                  {totalProducts.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Active Filter Chips - Mobile */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex flex-wrap gap-2 flex-1">
                  {selectedVehicle && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-200">
                      <Car className="h-3 w-3" />
                      {selectedVehicle.length > 15 ? selectedVehicle.substring(0, 15) + '...' : selectedVehicle}
                      <button onClick={() => setSelectedVehicle('')} className="hover:bg-blue-200 rounded-full p-0.5">
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-200">
                      <Grid3x3 className="h-3 w-3" />
                      {selectedCategory}
                      <button onClick={() => setSelectedCategory('')} className="hover:bg-blue-200 rounded-full p-0.5">
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  )}
                </div>
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 px-2"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* VEHICLE SELECTOR MODAL */}
      {vehicleModalOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setVehicleModalOpen(false)}
          />

          {/* Bottom Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[70vh] overflow-hidden flex flex-col animate-slideUp">
            {/* Header */}
            <div className="flex-shrink-0 bg-gradient-to-br from-[#0A1E3D] via-[#1E3A5F] to-[#0F2744] px-6 py-5 rounded-t-3xl border-b border-blue-400/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Car className="h-6 w-6 text-amber-400" />
                  <h3 className="text-xl font-bold text-white">Select Vehicle</h3>
                </div>
                <button
                  onClick={() => setVehicleModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>

            {/* Vehicle List - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              {/* All Vehicles Option */}
              <button
                onClick={() => {
                  setSelectedVehicle('');
                  setVehicleModalOpen(false);
                }}
                className={`w-full px-6 py-4 text-left font-semibold transition-all border-b border-gray-100 ${
                  !selectedVehicle
                    ? 'bg-blue-50 text-blue-900'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>All Vehicles</span>
                  <span className="text-sm text-gray-500">({allProductsCount})</span>
                </div>
              </button>

              {/* Vehicle Options */}
              {vehicles.map((vehicle) => (
                <button
                  key={vehicle.slug}
                  onClick={() => {
                    setSelectedVehicle(vehicle.fullName);
                    setVehicleModalOpen(false);
                  }}
                  className={`w-full px-6 py-4 text-left font-semibold transition-all border-b border-gray-100 ${
                    selectedVehicle === vehicle.fullName
                      ? 'bg-amber-50 text-amber-900'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {vehicle.fullName}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY SELECTOR MODAL */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setCategoryModalOpen(false)}
          />

          {/* Bottom Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[70vh] overflow-hidden flex flex-col animate-slideUp">
            {/* Header */}
            <div className="flex-shrink-0 bg-gradient-to-br from-[#0A1E3D] via-[#1E3A5F] to-[#0F2744] px-6 py-5 rounded-t-3xl border-b border-blue-400/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Grid3x3 className="h-6 w-6 text-amber-400" />
                  <h3 className="text-xl font-bold text-white">Select Category</h3>
                </div>
                <button
                  onClick={() => setCategoryModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>

            {/* Category List - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              {/* All Categories Option */}
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setCategoryModalOpen(false);
                }}
                className={`w-full px-6 py-4 text-left font-semibold transition-all border-b border-gray-100 ${
                  !selectedCategory
                    ? 'bg-blue-50 text-blue-900'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                All Categories
              </button>

              {/* Category Options */}
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCategoryModalOpen(false);
                  }}
                  className={`w-full px-6 py-4 text-left font-semibold transition-all border-b border-gray-100 ${
                    selectedCategory === category
                      ? 'bg-amber-50 text-amber-900'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </>
  );
}
