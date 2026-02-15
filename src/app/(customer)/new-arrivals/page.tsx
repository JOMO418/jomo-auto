"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  Filter,
  SlidersHorizontal,
  Grid3x3,
  List,
  ChevronDown,
  X,
  Car,
  Package,
  ArrowLeft
} from "lucide-react";
import { getAllProducts } from "@/lib/dummy-data";
import { useCartStore } from "@/lib/store";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";

// Get unique vehicles from products
const getUniqueVehicles = (products: Product[]) => {
  const vehicles = new Set<string>();
  products.forEach(p => {
    if (p.compatibility) {
      p.compatibility.forEach(v => vehicles.add(v));
    }
  });
  return Array.from(vehicles).sort();
};

export default function NewArrivalsPage() {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedVehicle, setSelectedVehicle] = useState<string>("All Vehicles");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Get all products sorted by newest
  const allProducts = getAllProducts();
  const newArrivals = useMemo(() =>
    allProducts.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    [allProducts]
  );

  // Get unique vehicles
  const vehicles = useMemo(() => getUniqueVehicles(newArrivals), [newArrivals]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = newArrivals;

    // Filter by vehicle
    if (selectedVehicle !== "All Vehicles") {
      filtered = filtered.filter(p =>
        p.compatibility?.includes(selectedVehicle)
      );
    }

    // Filter by category
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    return filtered;
  }, [newArrivals, selectedVehicle, selectedCategory]);

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Premium Design */}
      <div className="bg-gradient-to-br from-white to-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-3 sm:px-4 py-8 md:py-12 max-w-7xl">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          {/* Title Section */}
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    New Arrivals
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {filteredProducts.length} fresh products from Japan
                  </p>
                </div>
              </div>
            </div>

            {/* View Mode Toggle - Desktop */}
            <div className="hidden md:flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar - Premium */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-4 max-w-7xl">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-sm font-medium">Filters</span>
            </button>

            {/* Desktop Filters */}
            <div className="hidden md:flex items-center gap-3 flex-1 flex-wrap">
              {/* Vehicle Filter */}
              <VehicleDropdown
                vehicles={vehicles}
                selected={selectedVehicle}
                onSelect={setSelectedVehicle}
              />

              {/* Category Filter */}
              <CategoryDropdown
                categories={CATEGORIES}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />

              {/* Active Filters Count */}
              {(selectedVehicle !== "All Vehicles" || selectedCategory !== "All Categories") && (
                <button
                  onClick={() => {
                    setSelectedVehicle("All Vehicles");
                    setSelectedCategory("All Categories");
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  <X className="h-4 w-4" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>

            {/* Results Count */}
            <div className="ml-auto text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
            </div>
          </div>

          {/* Mobile Filters Dropdown */}
          {showFilters && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-3">
              <VehicleDropdown
                vehicles={vehicles}
                selected={selectedVehicle}
                onSelect={setSelectedVehicle}
              />
              <CategoryDropdown
                categories={CATEGORIES}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-3 sm:px-4 py-8 max-w-7xl">
        {filteredProducts.length > 0 ? (
          <div className={`
            ${viewMode === "grid"
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
              : "flex flex-col gap-4"
            }
          `}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters to see more results
            </p>
            <button
              onClick={() => {
                setSelectedVehicle("All Vehicles");
                setSelectedCategory("All Categories");
              }}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Vehicle Dropdown Component
function VehicleDropdown({
  vehicles,
  selected,
  onSelect
}: {
  vehicles: string[];
  selected: string;
  onSelect: (vehicle: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors min-w-[200px] justify-between"
      >
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900 truncate">
            {selected}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
            <div className="p-2">
              <button
                onClick={() => {
                  onSelect("All Vehicles");
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selected === "All Vehicles"
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                All Vehicles
              </button>
              <div className="h-px bg-gray-200 my-2" />
              {vehicles.map((vehicle) => (
                <button
                  key={vehicle}
                  onClick={() => {
                    onSelect(vehicle);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                    selected === vehicle
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {vehicle}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Category Dropdown Component
function CategoryDropdown({
  categories,
  selected,
  onSelect
}: {
  categories: readonly string[];
  selected: string;
  onSelect: (category: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors min-w-[180px] justify-between"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900 truncate">
            {selected}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="p-2">
              <button
                onClick={() => {
                  onSelect("All Categories");
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selected === "All Categories"
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                All Categories
              </button>
              <div className="h-px bg-gray-200 my-2" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    onSelect(category);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                    selected === category
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
