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
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-8">
          {/* Elegant Header */}
          <div className="text-center mb-6 lg:mb-6">
            <div className="inline-block relative">
              <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                Find Your Auto Parts
              </h2>
              <div className="h-1 w-20 lg:w-20 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full"></div>
            </div>
            <p className="text-sm md:text-base lg:text-base text-gray-600 mt-3 max-w-2xl mx-auto">
              Browse by vehicle model or shop by part category
            </p>
          </div>

          {/* Premium Filter Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6 max-w-4xl lg:max-w-4xl mx-auto">
            {/* Vehicle Filter Button */}
            <button
              onClick={() => setVehicleModalOpen(true)}
              className="
                group relative overflow-hidden
                bg-white border-2 border-gray-200
                rounded-xl md:rounded-2xl lg:rounded-2xl
                px-6 md:px-8 lg:px-8 py-6 md:py-6 lg:py-6
                transition-all duration-300
                hover:border-blue-500 hover:shadow-xl
                focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20
              "
            >
              {/* Background Gradient Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-blue-50/0 to-blue-50/0 group-hover:from-blue-50/80 group-hover:via-blue-50/40 group-hover:to-transparent transition-all duration-500"></div>

              <div className="relative flex items-center gap-4 lg:gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Car className="w-7 h-7 md:w-8 md:h-8 lg:w-8 lg:h-8 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                  <div className="text-xs lg:text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                    Shop by Vehicle
                  </div>
                  <div className="text-base md:text-lg lg:text-lg font-bold text-gray-900 mb-1">
                    Select Your Vehicle
                  </div>
                  <div className="text-xs md:text-sm lg:text-sm text-gray-500">
                    {vehicles.length} vehicles available
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </button>

            {/* Category Filter Button */}
            <button
              onClick={() => setCategoryModalOpen(true)}
              className="
                group relative overflow-hidden
                bg-white border-2 border-gray-200
                rounded-xl md:rounded-2xl lg:rounded-2xl
                px-6 md:px-8 lg:px-8 py-6 md:py-6 lg:py-6
                transition-all duration-300
                hover:border-green-500 hover:shadow-xl
                focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20
              "
            >
              {/* Background Gradient Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/0 via-green-50/0 to-green-50/0 group-hover:from-green-50/80 group-hover:via-green-50/40 group-hover:to-transparent transition-all duration-500"></div>

              <div className="relative flex items-center gap-4 lg:gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-7 h-7 md:w-8 md:h-8 lg:w-8 lg:h-8 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                  <div className="text-xs lg:text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">
                    Shop by Category
                  </div>
                  <div className="text-base md:text-lg lg:text-lg font-bold text-gray-900 mb-1">
                    Browse Categories
                  </div>
                  <div className="text-xs md:text-sm lg:text-sm text-gray-500">
                    {categories.length} categories available
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </button>
          </div>

          {/* Trust Badges - Elegant */}
          <div className="flex items-center justify-center gap-6 md:gap-8 lg:gap-8 mt-6 lg:mt-6 text-xs md:text-sm lg:text-sm text-gray-500">
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

          {/* Modal Container - Ultra Premium */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col animate-slideDown overflow-hidden">
              {/* Premium Header - Minimalist */}
              <div className="relative px-6 md:px-8 py-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                      Select Your Vehicle
                    </h3>
                    <p className="text-sm text-gray-500">
                      {vehicles.length} vehicles · Sorted by popularity
                    </p>
                  </div>
                  <button
                    onClick={() => setVehicleModalOpen(false)}
                    className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all group"
                  >
                    <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
                  </button>
                </div>

                {/* Premium Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={vehicleSearch}
                    onChange={(e) => setVehicleSearch(e.target.value)}
                    placeholder="Search by name or model code (e.g., Fielder, NZE141)..."
                    className="w-full pl-12 pr-4 py-4 text-base bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
                    autoFocus
                  />
                </div>
              </div>

              {/* Vehicle Horizontal Scroll - Premium Mobile UX */}
              <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 md:p-8 scrollbar-hide">
                {filteredVehicles.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-lg font-semibold text-gray-400 mb-2">No vehicles found</p>
                    <p className="text-sm text-gray-400">Try a different search term</p>
                  </div>
                ) : (
                  <>
                    {/* Mobile: Swipe hint */}
                    <div className="md:hidden mb-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                      <span>Swipe to browse</span>
                      <span className="text-blue-600">→</span>
                    </div>

                    <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4 snap-x snap-mandatory md:snap-none scroll-smooth">
                      {filteredVehicles.map((vehicle, index) => (
                      <button
                        key={vehicle.slug}
                        onClick={() => handleVehicleSelect(vehicle.slug)}
                        className="group relative overflow-hidden text-left flex-shrink-0 w-[280px] md:w-auto snap-start"
                      >
                        {/* Premium Card with Luxury Design */}
                        <div className="relative h-full bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 min-h-[200px]">
                          {/* Popular Badge - Top Right */}
                          {vehicle.popular && index < 6 && (
                            <div className="absolute top-4 right-4">
                              <div className="px-2.5 py-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[10px] font-bold rounded-full shadow-lg">
                                POPULAR
                              </div>
                            </div>
                          )}

                          {/* Brand Badge - Elegant */}
                          <div className="inline-block px-3 py-1 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full mb-4">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                              {vehicle.brand}
                            </span>
                          </div>

                          {/* Vehicle Name - Large, Bold, Premium Typography */}
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                            {vehicle.name}
                          </h3>

                          {/* Model Code - Monospace, Tech Feel */}
                          <div className="flex items-center gap-2 mb-4">
                            <div className="px-2.5 py-1 bg-gray-900 rounded-lg">
                              <span className="text-xs font-mono font-bold text-white tracking-wider">
                                {vehicle.code}
                              </span>
                            </div>
                          </div>

                          {/* Divider - Elegant */}
                          <div className="h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 mb-4"></div>

                          {/* Parts Count - Premium Display */}
                          <div className="flex items-baseline justify-between">
                            <div>
                              <span className="text-3xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                                {vehicle.productCount}
                              </span>
                              <span className="text-sm text-gray-500 ml-2 font-medium">
                                parts available
                              </span>
                            </div>

                            {/* Arrow - Minimal */}
                            <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-blue-600 flex items-center justify-center transition-all duration-300">
                              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                            </div>
                          </div>

                          {/* Hover Effect - Premium Glow */}
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/5 group-hover:to-blue-600/10 transition-all duration-300 pointer-events-none"></div>
                        </div>
                      </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Premium Footer */}
              {filteredVehicles.length > 0 && (
                <div className="px-8 py-5 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <p className="text-sm text-center text-gray-500 font-medium">
                    💡 Popular vehicles with most parts shown first
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

          {/* Modal Container - Ultra Premium */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col animate-slideDown overflow-hidden">
              {/* Premium Header - Minimalist */}
              <div className="relative px-6 md:px-8 py-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                      Browse by Category
                    </h3>
                    <p className="text-sm text-gray-500">
                      {categories.length} categories available
                    </p>
                  </div>
                  <button
                    onClick={() => setCategoryModalOpen(false)}
                    className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all group"
                  >
                    <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
                  </button>
                </div>

                {/* Premium Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    placeholder="Search categories (e.g., Suspension, Brakes, Engine)..."
                    className="w-full pl-12 pr-4 py-4 text-base bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
                    autoFocus
                  />
                </div>
              </div>

              {/* Category Horizontal Scroll - Premium Mobile UX */}
              <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 md:p-8 scrollbar-hide">
                {filteredCategories.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-lg font-semibold text-gray-400 mb-2">No categories found</p>
                    <p className="text-sm text-gray-400">Try a different search term</p>
                  </div>
                ) : (
                  <>
                    {/* Mobile: Swipe hint */}
                    <div className="md:hidden mb-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                      <span>Swipe to browse</span>
                      <span className="text-green-600">→</span>
                    </div>

                    <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 pb-4 snap-x snap-mandatory md:snap-none scroll-smooth">
                    {filteredCategories.map((category, index) => {
                      // Define colors for each category
                      const categoryColors: Record<string, { from: string; to: string; text: string; hover: string }> = {
                        "Engine": { from: "from-red-500", to: "to-orange-500", text: "text-red-600", hover: "hover:border-red-500" },
                        "Brakes": { from: "from-blue-500", to: "to-cyan-500", text: "text-blue-600", hover: "hover:border-blue-500" },
                        "Suspension": { from: "from-purple-500", to: "to-pink-500", text: "text-purple-600", hover: "hover:border-purple-500" },
                        "Electrical": { from: "from-yellow-500", to: "to-amber-500", text: "text-yellow-600", hover: "hover:border-yellow-500" },
                        "Body": { from: "from-green-500", to: "to-emerald-500", text: "text-green-600", hover: "hover:border-green-500" },
                        "Transmission": { from: "from-indigo-500", to: "to-blue-500", text: "text-indigo-600", hover: "hover:border-indigo-500" },
                        "Interior": { from: "from-pink-500", to: "to-rose-500", text: "text-pink-600", hover: "hover:border-pink-500" },
                        "Wheels & Tires": { from: "from-gray-700", to: "to-gray-900", text: "text-gray-700", hover: "hover:border-gray-700" },
                      };

                      const colors = categoryColors[category] || {
                        from: "from-gray-500",
                        to: "to-gray-600",
                        text: "text-gray-600",
                        hover: "hover:border-gray-500"
                      };

                      return (
                        <button
                          key={category}
                          onClick={() => handleCategorySelect(category)}
                          className={`group relative overflow-hidden text-left bg-white border-2 border-gray-100 rounded-2xl p-6 ${colors.hover} hover:shadow-2xl transition-all duration-300 flex-shrink-0 w-[240px] md:w-auto min-h-[180px] snap-start`}
                        >
                          {/* Gradient Accent Bar */}
                          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.from} ${colors.to}`}></div>

                          {/* Category Name - Large, Bold */}
                          <h3 className={`text-xl font-bold ${colors.text} group-hover:scale-105 transition-transform duration-300 mb-3 leading-tight`}>
                            {category}
                          </h3>

                          {/* Description - Clean */}
                          <p className="text-sm text-gray-500 mb-4">
                            Browse all {category.toLowerCase()} parts
                          </p>

                          {/* Divider */}
                          <div className="h-px bg-gradient-to-r from-gray-200 to-transparent mb-4"></div>

                          {/* View Button - Minimalist */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              Explore
                            </span>
                            <div className={`w-8 h-8 rounded-full bg-gray-50 group-hover:bg-gradient-to-r ${colors.from} ${colors.to} flex items-center justify-center transition-all duration-300`}>
                              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                            </div>
                          </div>

                          {/* Hover Glow Effect */}
                          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colors.from} ${colors.to} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
                        </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Premium Footer */}
              {filteredCategories.length > 0 && (
                <div className="px-8 py-5 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <p className="text-sm text-center text-gray-500 font-medium">
                    🔧 Select a category to explore parts
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
