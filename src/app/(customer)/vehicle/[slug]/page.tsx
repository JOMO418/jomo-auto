"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, Home, Car, ChevronDown } from "lucide-react";
import {
  getVehicleBySlug,
  groupProductsByCategory,
} from "@/lib/vehicle-utils";
import { getVehicleYears, filterProductsByYear } from "@/lib/year-utils";
import { CategorySection } from "@/components/product/CategorySection";
import { useCartStore } from "@/lib/store";
import type { Product } from "@/lib/types";

interface VehiclePageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Vehicle-Specific Page with Year Selector
 * Shows all parts for a specific vehicle, grouped by category
 * Allows filtering by year
 */
export default function VehiclePage({ params }: VehiclePageProps) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const addItem = useCartStore((state) => state.addItem);
  const vehicle = getVehicleBySlug(slug);
  const allProductsByCategory = groupProductsByCategory(slug);

  // Get all products for this vehicle (flattened)
  const allProducts = useMemo(
    () => Object.values(allProductsByCategory).flat(),
    [allProductsByCategory]
  );

  // Get available years for this vehicle
  const availableYears = useMemo(
    () => getVehicleYears(allProducts),
    [allProducts]
  );

  // State for selected year (null = All Years)
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

  // Filter products by selected year
  const filteredProducts = useMemo(() => {
    if (selectedYear === null) {
      return allProducts;
    }
    return filterProductsByYear(allProducts, selectedYear);
  }, [allProducts, selectedYear]);

  // Group filtered products by category
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    filteredProducts.forEach((product) => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }
      grouped[product.category].push(product);
    });
    return grouped;
  }, [filteredProducts]);

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };

  // 404 - Vehicle not found
  if (!vehicle) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Vehicle Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn't find parts for "{slug}". Try searching for another
            vehicle.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#E8002D] to-[#B8001F] text-white font-semibold rounded-lg hover:from-[#B8001F] hover:to-[#8A0015] transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const categories = Object.keys(productsByCategory);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-3 sm:px-4 py-3">
          <nav
            className="flex items-center gap-2 text-sm"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="flex items-center gap-1 text-gray-600 hover:text-[#E8002D] transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Vehicles</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-900">{vehicle.name}</span>
            {selectedYear && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-[#E8002D]">{selectedYear}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Vehicle Header with Year Selector */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-3 sm:px-4 py-6 md:py-10">
          <div className="flex items-start gap-4 flex-wrap">
            {/* Icon */}
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-[#E8002D] to-[#B8001F] flex items-center justify-center flex-shrink-0 shadow-lg">
              <Car className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
                Parts for {vehicle.fullName}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm md:text-base text-gray-600">
                {vehicle.models.length > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Models:</span>{" "}
                    {vehicle.models.join(", ")}
                  </span>
                )}
                {vehicle.models.length > 0 && <span className="text-gray-300">•</span>}
                <span className="font-semibold text-[#E8002D]">
                  {filteredProducts.length} parts
                  {selectedYear && ` for ${selectedYear}`}
                </span>
              </div>
            </div>

            {/* Year Selector - Premium Dropdown */}
            {availableYears.length > 1 && (
              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                  className="
                    w-full sm:w-auto min-w-[200px]
                    px-4 md:px-6 py-3 md:py-3.5
                    bg-gradient-to-r from-gray-50 to-white
                    border-2 border-gray-200
                    rounded-xl
                    flex items-center justify-between gap-3
                    hover:border-[#E8002D] hover:from-red-50 hover:to-white
                    focus:outline-none focus:border-[#E8002D] focus:ring-4 focus:ring-[#E8002D]/10
                    transition-all duration-300
                    shadow-sm hover:shadow-md
                  "
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </span>
                    <span className="text-base md:text-lg font-bold text-gray-900">
                      {selectedYear || "All Years"}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      yearDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Year Dropdown */}
                {yearDropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setYearDropdownOpen(false)}
                    />

                    {/* Dropdown Menu */}
                    <div className="absolute top-full right-0 mt-2 z-40 w-full sm:w-64 bg-white border-2 border-gray-200 rounded-xl shadow-2xl overflow-hidden">
                      {/* All Years Option */}
                      <button
                        onClick={() => {
                          setSelectedYear(null);
                          setYearDropdownOpen(false);
                        }}
                        className={`
                          w-full px-4 py-3 text-left
                          flex items-center justify-between
                          ${
                            selectedYear === null
                              ? "bg-red-50 text-[#E8002D] font-semibold"
                              : "text-gray-700 hover:bg-gray-50"
                          }
                          transition-colors border-b border-gray-100
                        `}
                      >
                        <span>All Years</span>
                        {selectedYear === null && (
                          <svg
                            className="w-5 h-5 text-[#E8002D]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>

                      {/* Year Options */}
                      <div className="max-h-64 overflow-y-auto">
                        {availableYears.map((year) => {
                          const yearProducts = filterProductsByYear(
                            allProducts,
                            year
                          );
                          return (
                            <button
                              key={year}
                              onClick={() => {
                                setSelectedYear(year);
                                setYearDropdownOpen(false);
                              }}
                              className={`
                                w-full px-4 py-3 text-left
                                flex items-center justify-between
                                ${
                                  selectedYear === year
                                    ? "bg-red-50 text-[#E8002D] font-semibold"
                                    : "text-gray-700 hover:bg-gray-50"
                                }
                                transition-colors
                              `}
                            >
                              <span className="font-medium">{year}</span>
                              <span className="text-xs text-gray-500">
                                {yearProducts.length} parts
                              </span>
                              {selectedYear === year && (
                                <svg
                                  className="w-5 h-5 text-[#E8002D] ml-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Year Info Message */}
          {selectedYear && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <svg
                className="w-5 h-5 text-[#E8002D] flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm text-red-800">
                <span className="font-medium">
                  Showing {filteredProducts.length} parts compatible with {selectedYear} {vehicle.name}.
                </span>
                <button
                  onClick={() => setSelectedYear(null)}
                  className="ml-1 underline hover:no-underline"
                >
                  Show all years
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products by Category */}
      <div className="container mx-auto px-3 sm:px-4 py-6 md:py-8 max-w-7xl">
        {categories.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Parts Available
            </h2>
            <p className="text-gray-600 mb-6">
              {selectedYear ? (
                <>
                  No parts found for {selectedYear} {vehicle.fullName}.
                  <br />
                  <button
                    onClick={() => setSelectedYear(null)}
                    className="text-[#E8002D] hover:underline mt-2"
                  >
                    View all years
                  </button>
                </>
              ) : (
                <>
                  We currently don't have parts listed for {vehicle.fullName}.
                  <br />
                  Check back soon or contact us for availability.
                </>
              )}
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#E8002D] to-[#B8001F] text-white font-semibold rounded-lg hover:from-[#B8001F] hover:to-[#8A0015] transition-all"
            >
              Browse All Parts
            </Link>
          </div>
        ) : (
          <>
            {categories.map((category) => (
              <CategorySection
                key={category}
                category={category}
                products={productsByCategory[category]}
                onAddToCart={handleAddToCart}
              />
            ))}
          </>
        )}
      </div>

      {/* Back to All Vehicles */}
      <div className="container mx-auto px-3 sm:px-4 pb-8">
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#E8002D] hover:text-[#B8001F] font-medium transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Browse other vehicles
          </Link>
        </div>
      </div>
    </div>
  );
}
