"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Car, Package, Search, X, ChevronRight } from "lucide-react";
import { getUniqueVehicles, getUniqueCategories } from "@/lib/vehicle-utils";
import { slugify } from "@/lib/utils";

/**
 * Premium Modal-Based Smart Filter Bar
 * Professional, Classic Design with Modal Navigation
 */
export function SmartFilterBar() {
  const router = useRouter();
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  const vehicles = getUniqueVehicles();
  const categories = getUniqueCategories();

  // Filter vehicles by search
  const filteredVehicles = vehicles.filter((v) =>
    v.name.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
    v.fullName.toLowerCase().includes(vehicleSearch.toLowerCase())
  );

  // Filter categories by search
  const filteredCategories = categories.filter((c) =>
    c.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Navigate to vehicle page
  const handleVehicleSelect = (slug: string) => {
    router.push(`/vehicle/${slug}`);
    setVehicleModalOpen(false);
    setVehicleSearch("");
  };

  // Navigate to category page
  const handleCategorySelect = (category: string) => {
    router.push(`/category/${slugify(category)}`);
    setCategoryModalOpen(false);
    setCategorySearch("");
  };

  return (
    <>
      {/* Premium Filter Bar */}
      <section className="relative w-full bg-gradient-to-b from-white to-gray-50 border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Elegant Header */}
          <div className="text-center mb-8">
            <div className="inline-block relative">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                Find Your Auto Parts
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full"></div>
            </div>
            <p className="text-sm md:text-base text-gray-600 mt-3 max-w-2xl mx-auto">
              Browse by vehicle model or shop by part category
            </p>
          </div>

          {/* Premium Filter Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
            {/* Vehicle Filter Button */}
            <button
              onClick={() => setVehicleModalOpen(true)}
              className="
                group relative overflow-hidden
                bg-white border-2 border-gray-200
                rounded-xl md:rounded-2xl
                px-6 md:px-8 py-6 md:py-8
                transition-all duration-300
                hover:border-blue-500 hover:shadow-xl
                focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20
              "
            >
              {/* Background Gradient Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-blue-50/0 to-blue-50/0 group-hover:from-blue-50/80 group-hover:via-blue-50/40 group-hover:to-transparent transition-all duration-500"></div>

              <div className="relative flex items-center gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Car className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                  <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                    Shop by Vehicle
                  </div>
                  <div className="text-base md:text-lg font-bold text-gray-900 mb-1">
                    Select Your Vehicle
                  </div>
                  <div className="text-xs md:text-sm text-gray-500">
                    {vehicles.length} vehicles available
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </button>

            {/* Category Filter Button */}
            <button
              onClick={() => setCategoryModalOpen(true)}
              className="
                group relative overflow-hidden
                bg-white border-2 border-gray-200
                rounded-xl md:rounded-2xl
                px-6 md:px-8 py-6 md:py-8
                transition-all duration-300
                hover:border-green-500 hover:shadow-xl
                focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20
              "
            >
              {/* Background Gradient Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/0 via-green-50/0 to-green-50/0 group-hover:from-green-50/80 group-hover:via-green-50/40 group-hover:to-transparent transition-all duration-500"></div>

              <div className="relative flex items-center gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                  <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">
                    Shop by Category
                  </div>
                  <div className="text-base md:text-lg font-bold text-gray-900 mb-1">
                    Browse Categories
                  </div>
                  <div className="text-xs md:text-sm text-gray-500">
                    {categories.length} categories available
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </button>
          </div>

          {/* Trust Badges - Elegant */}
          <div className="flex items-center justify-center gap-6 md:gap-8 mt-8 text-xs md:text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span>Genuine Parts</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <span>Same-Day Delivery</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
              <span>Warranty Backed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Modal - Premium Design */}
      {vehicleModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
          {/* Backdrop - Elegant blur */}
          <div
            className="fixed inset-0 bg-gradient-to-br from-gray-900/80 via-blue-900/60 to-gray-900/80 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setVehicleModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col animate-slideDown border border-gray-200/50 overflow-hidden">
              {/* Elegant Header with Gradient - More Compact */}
              <div className="relative px-5 md:px-6 py-4 border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Premium Icon - Smaller */}
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <Car className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                        Select Your Vehicle
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {vehicles.length} vehicles available
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setVehicleModalOpen(false)}
                    className="w-9 h-9 rounded-lg hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center transition-all duration-200 group"
                  >
                    <X className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </button>
                </div>

                {/* Premium Search Bar - More Compact */}
                <div className="relative mt-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={vehicleSearch}
                    onChange={(e) => setVehicleSearch(e.target.value)}
                    placeholder="Search vehicle (Fielder, Vitz, Note, Fit...)..."
                    className="w-full pl-11 pr-4 py-3 text-sm bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 shadow-sm placeholder:text-gray-400"
                    autoFocus
                  />
                </div>
              </div>

              {/* Vehicle Grid - Premium 3-column layout */}
              <div className="flex-1 overflow-y-auto p-5 md:p-6 bg-gray-50/30">
                {filteredVehicles.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
                      <Car className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No vehicles found</p>
                    <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredVehicles.map((vehicle) => (
                      <button
                        key={vehicle.slug}
                        onClick={() => handleVehicleSelect(vehicle.slug)}
                        className="
                          group relative overflow-hidden
                          flex items-center gap-3 p-4
                          bg-gradient-to-br from-white to-gray-50/50
                          border border-gray-200
                          rounded-xl
                          hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10
                          hover:from-blue-50/30 hover:to-white
                          transition-all duration-300
                          text-left
                        "
                      >
                        {/* Premium Icon */}
                        <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 group-hover:from-blue-500/20 group-hover:to-blue-600/20 flex items-center justify-center flex-shrink-0 transition-all duration-300 border border-blue-200/30 group-hover:border-blue-300/50">
                          <Car className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                        </div>

                        {/* Content - Prominent Model Name */}
                        <div className="relative flex-1 min-w-0">
                          {/* Brand - Small */}
                          <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                            {vehicle.brand}
                          </div>

                          {/* Model - LARGE and Prominent */}
                          <div className="font-bold text-base text-gray-900 group-hover:text-blue-600 transition-colors mb-0.5 line-clamp-1">
                            {vehicle.name}
                          </div>

                          {/* Code & Parts - Small */}
                          <div className="text-[10px] text-gray-500 flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 bg-gray-100 rounded font-mono">
                              {vehicle.code}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="font-semibold text-blue-600">
                              {vehicle.productCount} parts
                            </span>
                          </div>
                        </div>

                        {/* Arrow - Subtle */}
                        <ChevronRight className="relative w-5 h-5 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Elegant Footer Hint */}
              {filteredVehicles.length > 0 && (
                <div className="px-8 py-4 border-t border-gray-100 bg-gray-50/50">
                  <p className="text-xs text-center text-gray-500">
                    Click on a vehicle to browse compatible parts
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Category Modal - Premium Design */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
          {/* Backdrop - Elegant blur */}
          <div
            className="fixed inset-0 bg-gradient-to-br from-gray-900/80 via-green-900/60 to-gray-900/80 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setCategoryModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col animate-slideDown border border-gray-200/50 overflow-hidden">
              {/* Elegant Header with Gradient - More Compact */}
              <div className="relative px-5 md:px-6 py-4 border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Premium Icon - Smaller */}
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                        Browse Categories
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {categories.length} categories available
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCategoryModalOpen(false)}
                    className="w-9 h-9 rounded-lg hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center transition-all duration-200 group"
                  >
                    <X className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </button>
                </div>

                {/* Premium Search Bar - More Compact */}
                <div className="relative mt-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    placeholder="Search categories (Suspension, Brakes, Engine)..."
                    className="w-full pl-11 pr-4 py-3 text-sm bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-200 shadow-sm placeholder:text-gray-400"
                    autoFocus
                  />
                </div>
              </div>

              {/* Category Grid - Premium 3-column layout */}
              <div className="flex-1 overflow-y-auto p-5 md:p-6 bg-gray-50/30">
                {filteredCategories.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No categories found</p>
                    <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                        className="
                          group relative overflow-hidden
                          flex items-center gap-3 p-4
                          bg-gradient-to-br from-white to-gray-50/50
                          border border-gray-200
                          rounded-xl
                          hover:border-green-400 hover:shadow-lg hover:shadow-green-500/10
                          hover:from-green-50/30 hover:to-white
                          transition-all duration-300
                          text-left
                        "
                      >
                        {/* Premium Icon */}
                        <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/10 group-hover:from-green-500/20 group-hover:to-green-600/20 flex items-center justify-center flex-shrink-0 transition-all duration-300 border border-green-200/30 group-hover:border-green-300/50">
                          <Package className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
                        </div>

                        {/* Content */}
                        <div className="relative flex-1 min-w-0">
                          {/* Category - LARGE and Prominent */}
                          <div className="font-bold text-base text-gray-900 group-hover:text-green-600 transition-colors mb-0.5">
                            {category}
                          </div>

                          {/* Description - Small */}
                          <div className="text-[10px] text-gray-500">
                            Browse all {category.toLowerCase()} parts
                          </div>
                        </div>

                        {/* Arrow - Subtle */}
                        <ChevronRight className="relative w-5 h-5 text-gray-300 group-hover:text-green-600 group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Elegant Footer Hint */}
              {filteredCategories.length > 0 && (
                <div className="px-8 py-4 border-t border-gray-100 bg-gray-50/50">
                  <p className="text-xs text-center text-gray-500">
                    Click on a category to browse parts
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
